import { readFileSync } from 'node:fs';
import type { IncomingHttpHeaders } from 'node:http';
import { performance } from 'node:perf_hooks';
import { type Client, Metadata, status } from '@grpc/grpc-js';
import { to } from 'await-to-js';
import { StatusCodes } from 'http-status-codes';
import { parse } from 'pbkit/core/parser/proto.js';

import { type HttpMethod, collectSpecs } from './collectSpecs.js';
import { httpStatusFromCode } from './httpStatusFromCode.js';
import { receiveResponseMetadata } from './interceptors.js';

type ParsedRequest = {
  headers: IncomingHttpHeaders;
  query: Record<string, string | string[]>;
  body: Record<string, unknown>;
  params: Record<string, string>;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type OverrideErrorResponse = (error: GrpcError, respMetadata: Metadata) => any;
// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type RegisterRoutes = (method: HttpMethod, path: string, callRpc: (req: ParsedRequest) => Promise<{ responseJson: any; httpStatusCode: number }>) => void;
export type OnLog = (log: {
  request: {
    headers: IncomingHttpHeaders;
    method: HttpMethod;
    // /routes/:params 형태
    path: string;
    query: ParsedRequest['query'];
    body: ParsedRequest['body'] | null;
    params: ParsedRequest['params'];
    // query <- body <- params 순으로 merge된 object
    json: Record<string, unknown>;
  };
  response: {
    json: Record<string, unknown>;
    httpStatusCode: number;
    metadata: Metadata;
  };
  grpc: {
    method: string;
    code: status;
    error: GrpcError | null;
  };
  times: {
    occuredAt: Date;
    // e.g. 100.74062514305115
    elapsedMs: number;
  };
}) => void;

type Option = {
  protoFileAbsolutePath: string;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  idlMessageJsonConvertorModule: any;
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  idlMessageJsonConvertorModuleAltanative?: any;
  altanativeJsonConverterRequiredMessageNames?: string[];
  grpcClient: Client;
  allowHeaders?: string[];
  overrideErrorResponse?: OverrideErrorResponse;
  onLog?: OnLog;
  registerRoutes: RegisterRoutes;
};
export type MiddlewareOption = Omit<Option, 'registerRoutes'>;

type GrpcError = {
  code: status;
  message: string;
  stack?: string;
};

const DEFAULT_ALLOW_HEADERS = ['authorization'];
export const HEADER_KEY_REAL_HTTP_STATUS_CODE = 'x-real-http-status-code';

export const grpcGateway = ({
  protoFileAbsolutePath,
  idlMessageJsonConvertorModule,
  idlMessageJsonConvertorModuleAltanative,
  altanativeJsonConverterRequiredMessageNames = [],
  grpcClient,
  allowHeaders = [],
  overrideErrorResponse = undefined,
  onLog = () => undefined,
  registerRoutes,
}: Option) => {
  const proto = readFileSync(protoFileAbsolutePath, 'utf8');
  const specs = collectSpecs(parse(proto));

  const getMessage = (messageName: string) => {
    if (!idlMessageJsonConvertorModuleAltanative) {
      return idlMessageJsonConvertorModule[messageName];
    }

    return altanativeJsonConverterRequiredMessageNames.includes(messageName) ? idlMessageJsonConvertorModuleAltanative[messageName] : idlMessageJsonConvertorModule[messageName];
  };

  allowHeaders = Array.from(new Set([...DEFAULT_ALLOW_HEADERS, ...allowHeaders]));

  for (const [rpcName, { http, grpc }] of Object.entries(specs)) {
    if (!http) {
      continue;
    }

    const reqMessage = getMessage(grpc.requestMessageName);
    const respMessage = getMessage(grpc.responseMessageName);

    for (const { method, path } of http) {
      registerRoutes(method, path, async (req) => {
        const start = performance.now();
        const occuredAt = new Date();

        const requestJson = {
          ...req.query,
          ...req.body,
          ...req.params,
        };

        const { interceptor: receiveResponseMetadataInterceptor, getResponseMetadata } = receiveResponseMetadata();

        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const [err, rpcResp] = await to<any, GrpcError>(
          new Promise((resolve, reject) => {
            // @ts-ignore
            grpcClient[rpcName[0].toLowerCase() + rpcName.slice(1)](
              reqMessage.fromPartial(reqMessage.fromJSON(requestJson)),
              requestMetadata(req.headers, allowHeaders),
              { interceptors: [receiveResponseMetadataInterceptor] },
              // biome-ignore lint/suspicious/noExplicitAny: <explanation>
              (grpcError: Error, resp: any) => (grpcError ? reject(grpcError) : resolve(resp)),
            );
          }),
        );

        const respMetadata = getResponseMetadata();

        let responseJson = null;
        let httpStatusCode = null;

        if (err) {
          err.code ??= status.INTERNAL;

          responseJson = overrideErrorResponse?.(err, respMetadata) ?? {
            code: err.code,
            message: err.message,
            details: [],
          };
          httpStatusCode = parseHttpStatusCode(respMetadata, httpStatusFromCode(err.code));
        }

        responseJson = responseJson ?? respMessage.toJSON(rpcResp);
        httpStatusCode = httpStatusCode ?? parseHttpStatusCode(respMetadata);

        try {
          return {
            responseJson,
            httpStatusCode,
          };
        } finally {
          const elapsedMs = performance.now() - start;
          const grpcLog = {
            method: rpcName,
            code: err?.code ?? status.OK,
            error: err,
          };

          // onLog에서의 response의 조작 가능성을 막고
          // 해당 로직의 연산이 grpc-gateway 내부 로직에 blocking되지 않도록 finally scope에서 처리
          onLog({
            request: {
              headers: req.headers,
              method: method,
              path: path,
              query: req.query,
              body: req.body,
              params: req.params,
              json: requestJson,
            },
            response: {
              json: responseJson,
              httpStatusCode,
              metadata: respMetadata,
            },
            grpc: grpcLog,
            times: {
              occuredAt,
              elapsedMs,
            },
          });
        }
      });
    }
  }
};

function requestMetadata(headers: IncomingHttpHeaders, allowHeaders: string[]) {
  const metadata = new Metadata();
  for (let [key, values = ''] of Object.entries(headers)) {
    if (!allowHeaders.includes(key)) {
      key = `grpcgateway-${key}`;
    }
    values = Array.isArray(values) ? values : [values];

    for (const value of values) {
      metadata.add(key, value);
    }
  }

  return metadata;
}

function parseHttpStatusCode(metadata: Metadata, defaultHttpStatusCode = StatusCodes.OK): StatusCodes {
  const [httpStatusCodeStr] = metadata.get(HEADER_KEY_REAL_HTTP_STATUS_CODE) ?? [];
  return Number.parseInt(String(httpStatusCodeStr), 10) || defaultHttpStatusCode;
}

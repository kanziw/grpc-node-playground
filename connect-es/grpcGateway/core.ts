import type { IncomingHttpHeaders } from 'node:http';
import { type DescMessage, type DescService, type JsonValue, type MessageInitShape, type MessageShape, create, fromBinary, fromJson, getOption, toJson } from '@bufbuild/protobuf';
import type { GenFile } from '@bufbuild/protobuf/codegenv1';
import { Code, ConnectError, createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { http } from '~/connect-es/__proto__/google/api/annotations_pb.js';
import { LocalizedMessageSchema } from '~/connect-es/__proto__/google/rpc/error_details_pb.js';

export type CoreOptions = {
  service: DescService;
  serviceDescriptor: GenFile;
  grpcServerPort: number;
  registerRoutes: (
    method: HttpMethod,
    path: string,
    callRpc: (req: {
      headers: IncomingHttpHeaders;
      query: Record<string, string | string[]>;
      body: Record<string, unknown>;
      params: Record<string, string>;
    }) => Promise<{ responseJson: JsonValue; httpStatusCode: number }>,
  ) => void;
};

export const grpcGatewayCore = ({ service, serviceDescriptor, grpcServerPort, registerRoutes }: CoreOptions) => {
  const { implement, messages } = parseSpec<typeof service>(serviceDescriptor);
  const client = createPromiseClient(
    service,
    createGrpcTransport({
      baseUrl: `http://localhost:${grpcServerPort}`,
      httpVersion: '2',
    }),
  );

  for (const [method, infos = []] of Object.entries(implement)) {
    for (const { http, grpc } of infos) {
      registerRoutes(http.method, http.path, async (req) => {
        const input = create(
          grpc.input,
          fromJson(
            grpc.input,
            {
              ...req.query,
              ...req.body,
              ...req.params,
            } as JsonValue,
            { ignoreUnknownFields: true },
          ),
        );

        let responseJson: JsonValue;

        try {
          // @ts-ignore
          const resp = await client[method](input);

          responseJson = toJson(grpc.output, resp);
        } catch (unknownErr) {
          const err = ConnectError.from(unknownErr, Code.Internal);

          const details: JsonValue[] = [];
          for (const detail of err.details) {
            let schema: DescMessage | undefined;
            let value: MessageShape<DescMessage> | undefined;

            if ('type' in detail) {
              schema = messages[detail.type];
              value = fromBinary(schema, detail.value);
            }
            if ('desc' in detail) {
              schema = detail.desc;
              value = detail.value as MessageShape<DescMessage>;
            }

            if (schema && value) {
              details.push(toJson(schema, value));
            }
          }

          responseJson = {
            code: err.code,
            message: err.rawMessage,
            details,
          };
        }

        // TODO: handle status code
        return { responseJson, httpStatusCode: 200 };
      });
    }
  }
};

export function parseSpec<Service extends DescService>(file: GenFile): { implement: Partial<Spec<Service>>; messages: Record<string, DescMessage> } {
  type Methods = keyof Service['method'];
  const implement: Partial<Spec<Service>> = {};

  const messages: Record<string, DescMessage> = {};
  for (const message of file.messages) {
    messages[message.typeName] = message;
  }
  for (const dependency of file.dependencies) {
    for (const message of dependency.messages) {
      messages[message.typeName] = message;
    }
  }

  // we consider single service
  for (const service of file.services) {
    for (const method of service.methods) {
      const infos: Info[] = [];

      if (method.methodKind !== 'unary') {
        continue;
      }

      const option: Option = getOption(service.method[method.localName], http);
      const push = ({ pattern }: Option) => {
        if (!pattern.case) {
          return;
        }

        const regex = /{([^{}]+)}/g;
        const path = pattern.value.replace(regex, (_, paramName) => `:${paramName}`);

        infos.push({
          http: {
            method: pattern.case,
            path,
          },
          grpc: {
            input: method.input,
            output: method.output,
          },
        });
      };

      push(option);
      // parse only 1 depth
      for (const additionalBinding of option.additionalBindings) {
        push(additionalBinding);
      }

      implement[method.localName as Methods] = infos;
    }
  }

  return { implement, messages };
}

type Spec<Service extends DescService> = Record<keyof Service['method'], Info[]>;
type Info = {
  http: {
    method: HttpMethod;
    path: string; // e.g. '/echo/:message'
  };
  grpc: {
    input: DescMessage;
    output: DescMessage;
  };
};
type HttpMethod = 'get' | 'post' | 'put' | 'delete';

type Option = {
  $typeName: 'google.api.HttpRule';
  selector: '';
  pattern: { case: undefined } | { case: HttpMethod; value: string };
  body: '';
  responseBody: '';
  additionalBindings: Option[];
};

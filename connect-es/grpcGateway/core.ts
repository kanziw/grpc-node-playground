import type { IncomingHttpHeaders } from 'node:http';
import { type DescMessage, type DescService, type JsonValue, create, fromJson, getOption, toJson } from '@bufbuild/protobuf';
import type { GenFile } from '@bufbuild/protobuf/codegenv1';
import { createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import { http } from '~/connect-es/__proto__/google/api/annotations_pb.js';

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
  const spec = parseSpec<typeof service>(serviceDescriptor);
  const client = createPromiseClient(
    service,
    createGrpcTransport({
      baseUrl: `http://localhost:${grpcServerPort}`,
      httpVersion: '2',
    }),
  );

  for (const [method, infos = []] of Object.entries(spec)) {
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

        // @ts-ignore
        const resp = await client[method](input);

        // TODO: handle status code
        return { responseJson: toJson(grpc.output, resp), httpStatusCode: 200 };
      });
    }
  }
};

export function parseSpec<Service extends DescService>(file: GenFile): Partial<Spec<Service>> {
  type Methods = keyof Service['method'];
  const spec: Partial<Spec<Service>> = {};

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

      spec[method.localName as Methods] = infos;
    }
  }

  return spec;
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

import { type DescMessage, type DescService, create, getOption, toJson } from '@bufbuild/protobuf';
import type { GenFile } from '@bufbuild/protobuf/codegenv1';
import { createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import fastify, { type FastifyInstance } from 'fastify';
import { EchoService, file_echo_v1_echo } from '~/connect-es/__proto__/echo/v1/echo_pb.js';
import { http } from './__proto__/google/api/annotations_pb.js';

export const makeHttpServer = ({ grpcServerPort }: { grpcServerPort: number }): FastifyInstance => {
  const app = fastify();

  const spec = parse<typeof EchoService>(file_echo_v1_echo);
  const client = createPromiseClient(
    EchoService,
    createGrpcTransport({
      baseUrl: `http://localhost:${grpcServerPort}`,
      httpVersion: '2',
    }),
  );
  for (const [method, infos] of Object.entries(spec)) {
    for (const { http, grpc } of infos) {
      app.route({
        method: http.method,
        url: http.path,
        handler: async (req, reply) => {
          const input = create(grpc.input, {
            ...(req.query ?? {}),
            ...(req.body ?? {}),
            ...(req.params ?? {}),
          });
          // @ts-expect-error
          const resp = await client[method](input);
          reply.send(toJson(grpc.output, resp));
        },
      });
    }
  }

  return app;
};

function parse<Service extends DescService>(file: GenFile): Partial<Spec<Service>> {
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

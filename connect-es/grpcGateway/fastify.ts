import { type DescService, create, toJson } from '@bufbuild/protobuf';
import type { GenFile } from '@bufbuild/protobuf/codegenv1';
import { createPromiseClient } from '@connectrpc/connect';
import { createGrpcTransport } from '@connectrpc/connect-node';
import type { FastifyPluginAsync } from 'fastify';
import { parseSpec } from './core.js';

type Options = {
  service: DescService;
  serviceDescriptor: GenFile;
  grpcServerPort: number;
};

export const grpcGateway = ({ service, serviceDescriptor, grpcServerPort }: Options): FastifyPluginAsync => {
  const spec = parseSpec<typeof service>(serviceDescriptor);
  const client = createPromiseClient(
    service,
    createGrpcTransport({
      baseUrl: `http://localhost:${grpcServerPort}`,
      httpVersion: '2',
    }),
  );

  return async (app) => {
    for (const [method, infos = []] of Object.entries(spec)) {
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

            // @ts-ignore
            const resp = await client[method](input);
            reply.send(toJson(grpc.output, resp));
          },
        });
      }
    }
  };
};

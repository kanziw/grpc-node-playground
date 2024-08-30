import type { FastifyPluginAsync } from 'fastify';
import { type CoreOptions, grpcGatewayCore } from './core.js';

export type Options = Omit<CoreOptions, 'registerRoutes'>;

export const grpcGateway = (options: Options): FastifyPluginAsync => {
  return async (app) => {
    grpcGatewayCore({
      ...options,
      registerRoutes: (method, path, callRpc) => {
        app.route({
          method,
          url: path,
          handler: async (req, reply) => {
            const { responseJson: resp, httpStatusCode } = await callRpc({
              headers: req.headers,
              query: req.query ?? {},
              body: req.body ?? {},
              params: req.params ?? {},
            } as Parameters<typeof callRpc>[0]);

            reply.code(httpStatusCode).send(resp);
          },
        });
      },
    });
    // for (const [method, infos = []] of Object.entries(spec)) {
    //   for (const { http, grpc } of infos) {
    //     app.route({
    //       method: http.method,
    //       url: http.path,
    //       handler: async (req, reply) => {
    //         const input = create(grpc.input, {
    //           ...(req.query ?? {}),
    //           ...(req.body ?? {}),
    //           ...(req.params ?? {}),
    //         });

    //         // @ts-ignore
    //         const resp = await client[method](input);
    //         reply.send(toJson(grpc.output, resp));
    //       },
    //     });
    //   }
    // }
  };
};

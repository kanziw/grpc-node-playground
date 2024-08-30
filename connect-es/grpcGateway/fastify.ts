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
  };
};

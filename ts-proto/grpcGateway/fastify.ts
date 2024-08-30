import type { FastifyInstance } from 'fastify';

import type { HttpMethod } from './collectSpecs.js';
import { type MiddlewareOption, grpcGateway } from './core.js';

export const grpcGatewayWithFastify = (app: FastifyInstance, options: MiddlewareOption) =>
  grpcGateway({
    ...options,
    registerRoutes(method, path, callRpc) {
      app.route({
        url: path,
        method: method.toUpperCase() as Uppercase<HttpMethod>,
        handler: async (req, reply) => {
          const { responseJson: resp, httpStatusCode } = await callRpc({
            headers: req.headers,
            query: req.query,
            body: req.body,
            params: req.params,
          } as Parameters<typeof callRpc>[0]);

          reply.code(httpStatusCode).send(resp);
        },
      });
    },
  });

export const grpcGatewayFastifyPlugin = (options: MiddlewareOption) => async (fastify: FastifyInstance) => {
  grpcGatewayWithFastify(fastify, options);
};

import fastify, { type FastifyInstance } from 'fastify';
import { EchoService, file_echo_v1_echo } from '~/connect-es/__proto__/echo/v1/echo_pb.js';
import { grpcGateway } from './grpcGateway/fastify.js';

export const makeHttpServer = async ({ grpcServerPort }: { grpcServerPort: number }): Promise<FastifyInstance> => {
  const app = fastify();

  await app.register(
    grpcGateway({
      service: EchoService,
      serviceDescriptor: file_echo_v1_echo,
      grpcServerPort,
    }),
  );

  return app;
};

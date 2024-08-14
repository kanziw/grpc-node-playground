import { makeGrpcServer } from './server.js';

const GRPC_SERVER_PORT = Number(process.env.CONNECT_ES_GRPC_SERVER_PORT) || 8085;

const grpcServer = makeGrpcServer();
grpcServer.start(GRPC_SERVER_PORT);

console.log(`Start gRPC Server w/ connect-es on port ${GRPC_SERVER_PORT}`);

import type { MethodImpl } from '@connectrpc/connect';
import type { EchoService } from './__proto__/echo/v1/echo_pb.js';

type EchoServiceMethods = keyof (typeof EchoService)['method'];
export type EchoServiceHandler<Method extends EchoServiceMethods> = MethodImpl<(typeof EchoService)['method'][Method]>;

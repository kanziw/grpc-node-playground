import type { MethodImpl } from '@connectrpc/connect';
import type { EchoService } from './__proto__/echo/v1/echo_connect.js';

type EchoServiceMethods = keyof (typeof EchoService)['methods'];
export type EchoServiceHandler<Method extends EchoServiceMethods> = MethodImpl<(typeof EchoService)['methods'][Method]>;

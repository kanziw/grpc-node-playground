import type { EchoRequest, EchoResponse } from '~/ts-proto/__proto__/echo/v1/echo.js';
import type { Handler } from '~/ts-proto/context.js';

export const echo: Handler<EchoRequest, EchoResponse> = async (ctx) => {
  return {
    message: `you said: ${ctx.req.message}`,
    response_time: new Date(),
  };
};

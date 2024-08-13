import Mali from 'mali';
import { EchoServiceService as EchoService } from './__proto__/echo/v1/echo.js';
import { type AppContext, wrapHandlers } from './context.js';
import * as echoService from './handlers/echoService.js';

export const makeGrpcServer = () => {
  const app = new Mali<AppContext>([EchoService]);
  app.context = {};

  app.use({
    EchoService: wrapHandlers(echoService),
  });

  return app;
};

import Mali from 'mali';
import { ConsoleLogger } from '~/lib/logger.js';
import { statsUnaryServerInterceptor } from '~/ts-proto/interceptors/statsUnaryServerInterceptor.js';
import { EchoServiceService as EchoService } from './__proto__/echo/v1/echo.js';
import { type AppContext, wrapHandlers } from './context.js';
import { unhandledErrorHandler } from './error.js';
import * as echoService from './handlers/echoService.js';
import { stdoutUnaryServerInterceptor } from './interceptors/stdoutUnaryServerInterceptor.js';

export const makeGrpcServer = () => {
  const app = new Mali<AppContext>([EchoService]);
  const logger = ConsoleLogger();

  app.context = {
    logger,
  };

  app.use(stdoutUnaryServerInterceptor(), statsUnaryServerInterceptor());

  app.use({
    EchoService: wrapHandlers(echoService),
  });

  app.on('error', unhandledErrorHandler(logger));

  return app;
};

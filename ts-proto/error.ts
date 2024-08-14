import { status } from '@grpc/grpc-js';
import { StatusCodes } from 'http-status-codes';
import type { Context } from 'mali';
import type { Logger } from '~/lib/logger.js';
import type { AppContext } from './context.js';

export const unhandledErrorHandler =
  (logger: Logger) =>
  (err: Error, ctx: Context<AppContext>): void => {
    if (err instanceof BaseError) {
      return;
    }

    err.message = `${err.message}, server error for call ${ctx.name} of type ${ctx.type}`;
    logger.error(err);
  };

export abstract class BaseError {
  abstract get httpStatus(): number;

  abstract get code(): status;
}

export class InvalidArgumentError extends BaseError {
  get httpStatus(): number {
    return StatusCodes.BAD_REQUEST;
  }

  get code(): status {
    return status.INVALID_ARGUMENT;
  }
}

export class UnauthenticatedError extends BaseError {
  get httpStatus(): number {
    return StatusCodes.UNAUTHORIZED;
  }

  get code(): status {
    return status.UNAUTHENTICATED;
  }
}

export class NotFoundError extends BaseError {
  get httpStatus(): number {
    return StatusCodes.NOT_FOUND;
  }

  get code(): status {
    return status.NOT_FOUND;
  }
}

export class InternalServerError extends BaseError {
  get httpStatus(): number {
    return StatusCodes.INTERNAL_SERVER_ERROR;
  }

  get code(): status {
    return status.INTERNAL;
  }
}

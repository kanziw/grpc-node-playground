import { status } from '@grpc/grpc-js';
import { StatusCodes } from 'http-status-codes';

/**
 * @see https://github.com/grpc-ecosystem/grpc-gateway/blob/39f37d5f2303b2a2c72a9c917395404d3fa05330/runtime/errors.go#L36
 */
export const httpStatusFromCode = (code: number): StatusCodes => {
  switch (code) {
    case status.OK:
      return StatusCodes.OK;
    case status.CANCELLED:
      return StatusCodes.REQUEST_TIMEOUT;
    case status.UNKNOWN:
      return StatusCodes.INTERNAL_SERVER_ERROR;
    case status.INVALID_ARGUMENT:
      return StatusCodes.BAD_REQUEST;
    case status.DEADLINE_EXCEEDED:
      return StatusCodes.GATEWAY_TIMEOUT;
    case status.NOT_FOUND:
      return StatusCodes.NOT_FOUND;
    case status.ALREADY_EXISTS:
      return StatusCodes.CONFLICT;
    case status.PERMISSION_DENIED:
      return StatusCodes.FORBIDDEN;
    case status.UNAUTHENTICATED:
      return StatusCodes.UNAUTHORIZED;
    case status.RESOURCE_EXHAUSTED:
      return StatusCodes.TOO_MANY_REQUESTS;
    case status.FAILED_PRECONDITION:
      return StatusCodes.BAD_REQUEST;
    case status.ABORTED:
      return StatusCodes.CONFLICT;
    case status.OUT_OF_RANGE:
      return StatusCodes.BAD_REQUEST;
    case status.UNIMPLEMENTED:
      return StatusCodes.NOT_IMPLEMENTED;
    case status.INTERNAL:
      return StatusCodes.INTERNAL_SERVER_ERROR;
    case status.UNAVAILABLE:
      return StatusCodes.SERVICE_UNAVAILABLE;
    case status.DATA_LOSS:
      return StatusCodes.INTERNAL_SERVER_ERROR;
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
};

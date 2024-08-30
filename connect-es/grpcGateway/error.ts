import { type DescMessage, type JsonValue, type MessageShape, fromBinary, toJson } from '@bufbuild/protobuf';
import { Code, ConnectError } from '@connectrpc/connect';
import { StatusCodes } from 'http-status-codes';

export const parseErrorResponseJson = (messages: Record<string, DescMessage>, unknownErr: unknown): { responseJson: JsonValue; httpStatusCode: number } => {
  const err = ConnectError.from(unknownErr, Code.Internal);

  const details: JsonValue[] = [];
  for (const detail of err.details) {
    let schema: DescMessage | undefined;
    let value: MessageShape<DescMessage> | undefined;

    if ('type' in detail) {
      schema = messages[detail.type];
      value = fromBinary(schema, detail.value);
    }
    if ('desc' in detail) {
      schema = detail.desc;
      value = detail.value as MessageShape<DescMessage>;
    }

    if (schema && value) {
      details.push(toJson(schema, value));
    }
  }

  return {
    responseJson: {
      code: err.code,
      message: err.rawMessage,
      details,
    },
    httpStatusCode: httpStatusCodeFromCode(err.code),
  };
};

// See: https://github.com/grpc-ecosystem/grpc-gateway/blob/fd0ec0eac1b93d9b1b7c5f25b6ecd435810ce90a/runtime/errors.go#L36
function httpStatusCodeFromCode(code: Code): number {
  switch (code) {
    case Code.Canceled:
      return 499;
    case Code.Unknown:
      return StatusCodes.INTERNAL_SERVER_ERROR;
    case Code.InvalidArgument:
      return StatusCodes.BAD_REQUEST;
    case Code.DeadlineExceeded:
      return StatusCodes.GATEWAY_TIMEOUT;
    case Code.NotFound:
      return StatusCodes.NOT_FOUND;
    case Code.AlreadyExists:
      return StatusCodes.CONFLICT;
    case Code.PermissionDenied:
      return StatusCodes.FORBIDDEN;
    case Code.Unauthenticated:
      return StatusCodes.UNAUTHORIZED;
    case Code.ResourceExhausted:
      return StatusCodes.TOO_MANY_REQUESTS;
    case Code.FailedPrecondition:
      return StatusCodes.BAD_REQUEST;
    case Code.Aborted:
      return StatusCodes.CONFLICT;
    case Code.OutOfRange:
      return StatusCodes.BAD_REQUEST;
    case Code.Unimplemented:
      return StatusCodes.NOT_IMPLEMENTED;
    case Code.Internal:
      return StatusCodes.INTERNAL_SERVER_ERROR;
    case Code.Unavailable:
      return StatusCodes.SERVICE_UNAVAILABLE;
    case Code.DataLoss:
      return StatusCodes.INTERNAL_SERVER_ERROR;
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
}

import { InterceptingCall, type Interceptor, ListenerBuilder, Metadata } from '@grpc/grpc-js';

/**
 * @see https://github.com/grpc/proposal/blob/master/L5-node-client-interceptors.md
 */

export const receiveResponseMetadata = () => {
  const metadata = new Metadata();

  const listener = new ListenerBuilder()
    .withOnReceiveMetadata((responseMetadata, next) => {
      metadata.merge(responseMetadata);
      next(responseMetadata);
    })
    .build();

  const interceptor: Interceptor = (options, nextCall) =>
    new InterceptingCall(nextCall(options), {
      start(meta, _listener, next) {
        next(meta, listener);
      },
    });

  return {
    interceptor,
    getResponseMetadata() {
      return metadata;
    },
  };
};

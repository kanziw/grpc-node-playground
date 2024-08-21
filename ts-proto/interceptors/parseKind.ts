import type { Context } from '~/ts-proto/context.js';

export const parseKind = (ctx: Context): 'unary' | 'server_streaming' | 'client_streaming' | 'bidi_streaming' | 'unknown'  => {
  const {
    request: { type: requestType },
    response: { type: responseType },
  } = ctx;

  // TODO: Support other method kinds
  return requestType === 'unary' && responseType === 'unary' ? 'unary' : 'unknown';
};

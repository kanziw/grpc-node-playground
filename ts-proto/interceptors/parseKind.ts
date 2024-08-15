import type { Context } from '~/ts-proto/context.js';

export const parseKind = (ctx: Context): 'Unary' | 'Unknown' => {
  const {
    request: { type: requestType },
    response: { type: responseType },
  } = ctx;

  // TODO: Support other method kinds
  return requestType === 'unary' && responseType === 'unary' ? 'Unary' : 'Unknown';
};

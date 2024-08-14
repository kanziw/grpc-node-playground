import { Timestamp } from '@bufbuild/protobuf';
import { extractCtxTags } from '~/connect-es/context/tags.js';
import type { EchoServiceHandler } from '~/connect-es/types.js';

export const echo: EchoServiceHandler<'echo'> = async (req, ctx) => {
  extractCtxTags(ctx.values).set('message', req.message);
  return {
    message: req.message,
    responseTime: Timestamp.now(),
  };
};

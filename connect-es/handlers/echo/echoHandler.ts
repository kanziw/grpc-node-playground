import { Timestamp } from '@bufbuild/protobuf';
import type { EchoServiceHandler } from '~/connect-es/types.js';

export const echo: EchoServiceHandler<'echo'> = async (req, ctx) => {
  return {
    message: req.message,
    responseTime: Timestamp.now(),
  };
};

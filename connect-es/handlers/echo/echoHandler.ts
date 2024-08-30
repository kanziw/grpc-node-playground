import { create } from '@bufbuild/protobuf';
import { timestampNow } from '@bufbuild/protobuf/wkt';
import { Code, ConnectError } from '@connectrpc/connect';
import { LocalizedMessageSchema } from '~/connect-es/__proto__/google/rpc/error_details_pb.js';
import { extractCtxTags } from '~/connect-es/context/tags.js';
import type { EchoServiceHandler } from '~/connect-es/types.js';

export const echo: EchoServiceHandler<'echo'> = async (req, ctx) => {
  extractCtxTags(ctx.values).set('message', req.message);

  if (req.message === 'bomb') {
    throw new ConnectError('💣', Code.InvalidArgument, new Headers({ 'words-left': 'none' }), [
      {
        desc: LocalizedMessageSchema,
        value: create(LocalizedMessageSchema, {
          locale: 'en-US',
          message: 'Bomb!',
        }),
      },
      {
        desc: LocalizedMessageSchema,
        value: create(LocalizedMessageSchema, {
          locale: 'ko-KR',
          message: '펑!',
        }),
      },
    ]);
  }

  return {
    message: req.message,
    responseTime: timestampNow(),
  };
};

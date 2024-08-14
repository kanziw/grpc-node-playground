import { type ContextValues, createContextValues } from '@connectrpc/connect';
import type { connectNodeAdapter } from '@connectrpc/connect-node';

type NodeServerRequest = Parameters<ReturnType<typeof connectNodeAdapter>>[0];
type Params = { ctxValues: ContextValues; req: NodeServerRequest };

export type SetContext = (params: Params) => Params;

type PipeFunc = (...fns: SetContext[]) => (req: NodeServerRequest) => ContextValues;
export const pipeCtxValues: PipeFunc =
  (...fns) =>
  (req) =>
    fns.reduce((params, fn) => fn(params), {
      ctxValues: createContextValues(),
      req,
    }).ctxValues;

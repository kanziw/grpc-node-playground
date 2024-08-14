import { type ContextValues, createContextKey } from '@connectrpc/connect';
import type { SetContext } from './types.js';

type TagValues = Record<string, unknown>;
type Tags = {
  set: (key: string, value: unknown) => Tags;
  sets: (tags: Record<string, unknown>) => Tags;
  values: () => TagValues;
};

const kTags = createContextKey<Tags>(NoopTags());

export const extractCtxTags = (ctxValues: ContextValues): Tags => ctxValues.get(kTags);

export const SetTags: SetContext = ({ ctxValues, req }) => {
  const tagValues: TagValues = {};

  const ctxTags: Tags = {
    set: (key, value) => {
      tagValues[key] = value;
      return ctxTags;
    },
    sets: (tags) => {
      for (const [key, value] of Object.entries(tags)) {
        tagValues[key] = value;
      }
      return ctxTags;
    },
    values: () => tagValues,
  };

  ctxValues.set(kTags, ctxTags);

  return { ctxValues, req };
};

function NoopTags(): Tags {
  const noopCtxTags = { set: () => noopCtxTags, sets: () => noopCtxTags, values: () => ({}) };
  return noopCtxTags;
}

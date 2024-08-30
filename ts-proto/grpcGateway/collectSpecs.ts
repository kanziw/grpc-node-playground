// eslint-disable-next-line max-len
/* eslint-disable @typescript-eslint/no-use-before-define, no-restricted-syntax, no-continue, consistent-return */

import type { FieldOption, FieldOptions } from 'pbkit/core/ast/index.js';
import type { ParseResult } from 'pbkit/core/parser/proto.js';
import { stringifyOptionName, stringifyType } from 'pbkit/core/schema/stringify-ast-frag.js';
import { type Visitor, visitor as defaultVisitor } from 'pbkit/core/visitor/index.js';

export type HttpMethod = 'get' | 'post' | 'put' | 'delete';
type Info = {
  http: Array<{
    method: HttpMethod;
    path: string;
  }>;
  grpc: {
    requestMessageName: string;
    responseMessageName: string;
  };
};

export const collectSpecs = ({ parser, ast }: ParseResult) => {
  const specs: Record<string, Info> = {};
  let currentSpec: Info | null = null;
  let currentMessageName: string | null = null;

  const allRequestMessageNames: string[] = [];

  const visitor: Visitor = {
    ...defaultVisitor,
    visitRpc(v, node) {
      const rpcName = node.rpcName.text;

      const requestMessageName = stringifyType(node.reqType.messageType);
      allRequestMessageNames.push(requestMessageName);

      currentSpec = {
        http: [],
        grpc: {
          requestMessageName,
          responseMessageName: stringifyType(node.resType.messageType),
        },
      };

      defaultVisitor.visitRpc(v, node);

      if (currentSpec !== null) {
        specs[rpcName] = currentSpec;
      }
      currentSpec = null;
    },

    visitOption(v, node) {
      const routeRegExp = /(?<method>get|post|put|delete): "(?<path>.*?)"/g;

      if (stringifyOptionName(node.optionName) === '(google.api.http)') {
        if (!currentSpec) {
          return;
        }
        const rawOption = parser.input.slice(node.constant.start, node.constant.end);

        let match: RegExpExecArray | null = null;
        do {
          match = routeRegExp.exec(rawOption);
          if (match) {
            currentSpec.http.push({ method: match.groups!.method as HttpMethod, path: match.groups!.path });
          }
        } while (match);
      }

      defaultVisitor.visitOption(v, node);
    },

    visitMessage(v, node) {
      const messageName = node.messageName.text;
      if (allRequestMessageNames.includes(messageName)) {
        currentMessageName = messageName;
        defaultVisitor.visitMessage(v, node);
        currentMessageName = null;
      }
    },

    visitMessageBodyStatement(_visitor, node) {
      if (node.type !== 'field') {
        return;
      }

      const jsonOption = findJsonNameOption(node.fieldOptions);
      if (!jsonOption) {
        return;
      }

      const targetJsonName = parseTargetFieldName(jsonOption);
      if (!targetJsonName) {
        return;
      }

      const spec = Object.values(specs).find(({ grpc }) => grpc.requestMessageName === currentMessageName);

      const fieldName = node.fieldName.text;
      const httpSpecs = spec?.http ?? [];
      for (const httpSpec of httpSpecs) {
        if (httpSpec.path.includes(`:${fieldName}`)) {
          httpSpec.path = httpSpec.path.replace(`:${fieldName}`, `:${targetJsonName}`);
        }
      }
    },
  };

  visitor.visitProto(visitor, ast);

  return specs;
};

function findJsonNameOption(fieldOptions?: FieldOptions): FieldOption | undefined {
  if (!fieldOptions) {
    return;
  }
  for (const fieldOptionOrComman of fieldOptions.fieldOptionOrCommas) {
    if (fieldOptionOrComman.type !== 'field-option') {
      continue;
    }

    if (stringifyOptionName(fieldOptionOrComman.optionName) === 'json_name') {
      return fieldOptionOrComman;
    }
  }
}

function parseTargetFieldName(fieldOption: FieldOption): string | undefined {
  if (fieldOption.constant.type !== 'str-lit') {
    return;
  }

  return fieldOption.constant.tokens[0]?.text.split('"')[1];
}

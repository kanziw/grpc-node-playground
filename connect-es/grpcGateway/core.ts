import { type DescMessage, type DescService, create, getOption, toJson } from '@bufbuild/protobuf';
import type { GenFile } from '@bufbuild/protobuf/codegenv1';
import { http } from '~/connect-es/__proto__/google/api/annotations_pb.js';

export function parseSpec<Service extends DescService>(file: GenFile): Partial<Spec<Service>> {
  type Methods = keyof Service['method'];
  const spec: Partial<Spec<Service>> = {};

  // we consider single service
  for (const service of file.services) {
    for (const method of service.methods) {
      const infos: Info[] = [];

      if (method.methodKind !== 'unary') {
        continue;
      }

      const option: Option = getOption(service.method[method.localName], http);
      const push = ({ pattern }: Option) => {
        if (!pattern.case) {
          return;
        }

        const regex = /{([^{}]+)}/g;
        const path = pattern.value.replace(regex, (_, paramName) => `:${paramName}`);

        infos.push({
          http: {
            method: pattern.case,
            path,
          },
          grpc: {
            input: method.input,
            output: method.output,
          },
        });
      };

      push(option);
      // parse only 1 depth
      for (const additionalBinding of option.additionalBindings) {
        push(additionalBinding);
      }

      spec[method.localName as Methods] = infos;
    }
  }

  return spec;
}

type Spec<Service extends DescService> = Record<keyof Service['method'], Info[]>;
type Info = {
  http: {
    method: HttpMethod;
    path: string; // e.g. '/echo/:message'
  };
  grpc: {
    input: DescMessage;
    output: DescMessage;
  };
};
type HttpMethod = 'get' | 'post' | 'put' | 'delete';

type Option = {
  $typeName: 'google.api.HttpRule';
  selector: '';
  pattern: { case: undefined } | { case: HttpMethod; value: string };
  body: '';
  responseBody: '';
  additionalBindings: Option[];
};

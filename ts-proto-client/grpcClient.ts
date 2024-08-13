import { type CallOptions, ChannelCredentials, type ChannelOptions, type Client, type ClientUnaryCall, Metadata, type ServiceError } from '@grpc/grpc-js';
import { status } from '@grpc/grpc-js';

type Options = ChannelOptions & {
  credentials: ChannelCredentials;
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
interface ClientConstructor<T = any> {
  new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions> | undefined): T;
}

type Callback<Response> = (err: ServiceError | null, resp: Response) => void;

interface RpcFunction<Request, Response> {
  (req: Request, cb: Callback<Response>): ClientUnaryCall;
  (req: Request, metadata: Metadata, cb: Callback<Response>): ClientUnaryCall;
  (req: Request, metadata: Metadata, options: Partial<CallOptions>, cb: Callback<Response>): ClientUnaryCall;
}

type GrpcClient<T> = {
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [K in keyof T as T[K] extends RpcFunction<any, any> ? K : never]: T[K] extends RpcFunction<infer TRequest, infer TResponse>
    ? (req: TRequest, metadata?: Metadata) => Promise<TResponse>
    : never;
};

export const makeGrpcClient = <T extends ClientConstructor>(
  client: T,
  endpoint: `dns:///${string}`,
  { credentials = ChannelCredentials.createInsecure(), ...options }: Partial<Options> = {},
) => {
  const instance = new client(endpoint, credentials, options);

  const result = {} as GrpcClient<InstanceType<T>>;

  for (const key of Object.keys(instance.__proto__)) {
    const operation = instance[key as keyof InstanceType<T>];

    if (!operation || typeof operation !== 'function') {
      continue;
    }

    // @ts-expect-error
    result[key as keyof GrpcClient<InstanceType<T>>] = (req, metadata = new Metadata()) => {
      return new Promise((resolve, reject) => {
        // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        const client = (instance[key as keyof InstanceType<T>] as any).bind(instance);

        client(req, metadata, (error: ServiceError | null, response: unknown) => {
          if (error) {
            reject(error);
            return;
          }

          resolve(response);
        });
      });
    };
  }

  return result;
};

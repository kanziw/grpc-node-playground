// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v1.178.0
//   protoc               unknown
// source: protoc-gen-openapiv2/options/annotations.proto

/* eslint-disable */

export const protobufPackage = "grpc.gateway.protoc_gen_openapiv2.options";

export interface DataLoaderOptions {
  cache?: boolean;
}

export interface DataLoaders {
  rpcDataLoaderOptions?: DataLoaderOptions;
  getDataLoader<T>(identifier: string, constructorFn: () => T): T;
}

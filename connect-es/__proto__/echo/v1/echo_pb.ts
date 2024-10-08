// @generated by protoc-gen-es v2.0.0 with parameter "target=ts"
// @generated from file echo/v1/echo.proto (package echo.v1, syntax proto3)
/* eslint-disable */

import type { GenFile, GenMessage, GenService } from "@bufbuild/protobuf/codegenv1";
import { fileDesc, messageDesc, serviceDesc } from "@bufbuild/protobuf/codegenv1";
import { file_google_api_annotations } from "../../google/api/annotations_pb";
import { file_google_rpc_error_details } from "../../google/rpc/error_details_pb";
import type { Timestamp } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_timestamp } from "@bufbuild/protobuf/wkt";
import { file_protoc_gen_openapiv2_options_annotations } from "../../protoc-gen-openapiv2/options/annotations_pb";
import type { Message } from "@bufbuild/protobuf";

/**
 * Describes the file echo/v1/echo.proto.
 */
export const file_echo_v1_echo: GenFile = /*@__PURE__*/
  fileDesc("ChJlY2hvL3YxL2VjaG8ucHJvdG8SB2VjaG8udjEiHgoLRWNob1JlcXVlc3QSDwoHbWVzc2FnZRgBIAEoCSJSCgxFY2hvUmVzcG9uc2USDwoHbWVzc2FnZRgBIAEoCRIxCg1yZXNwb25zZV90aW1lGAIgASgLMhouZ29vZ2xlLnByb3RvYnVmLlRpbWVzdGFtcCI6ChFFY2hvU3RyZWFtUmVxdWVzdBIPCgdtZXNzYWdlGAEgASgJEhQKDHJlcGVhdF9jb3VudBgCIAEoBSJxChJFY2hvU3RyZWFtUmVzcG9uc2USDwoHbWVzc2FnZRgBIAEoCRIXCg9zZXF1ZW5jZV9udW1iZXIYAiABKAUSMQoNcmVzcG9uc2VfdGltZRgDIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXAiKQoRU3RyZWFtRWNob1JlcXVlc3QSFAoMbWVzc2FnZV9wYXJ0GAEgASgJIl0KElN0cmVhbUVjaG9SZXNwb25zZRIUCgxmdWxsX21lc3NhZ2UYASABKAkSMQoNcmVzcG9uc2VfdGltZRgCIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXAiYgoLQ2hhdFJlcXVlc3QSDwoHdXNlcl9pZBgBIAEoCRIPCgdtZXNzYWdlGAIgASgJEjEKDXJlc3BvbnNlX3RpbWUYAyABKAsyGi5nb29nbGUucHJvdG9idWYuVGltZXN0YW1wImMKDENoYXRSZXNwb25zZRIPCgd1c2VyX2lkGAEgASgJEg8KB21lc3NhZ2UYAiABKAkSMQoNcmVzcG9uc2VfdGltZRgDIAEoCzIaLmdvb2dsZS5wcm90b2J1Zi5UaW1lc3RhbXAysgIKC0VjaG9TZXJ2aWNlElgKBEVjaG8SFC5lY2hvLnYxLkVjaG9SZXF1ZXN0GhUuZWNoby52MS5FY2hvUmVzcG9uc2UiI4LT5JMCHVoUEhIvdjEvZWNoby97bWVzc2FnZX0SBS9lY2hvEkcKCkVjaG9TdHJlYW0SGi5lY2hvLnYxLkVjaG9TdHJlYW1SZXF1ZXN0GhsuZWNoby52MS5FY2hvU3RyZWFtUmVzcG9uc2UwARJHCgpTdHJlYW1FY2hvEhouZWNoby52MS5TdHJlYW1FY2hvUmVxdWVzdBobLmVjaG8udjEuU3RyZWFtRWNob1Jlc3BvbnNlKAESNwoEQ2hhdBIULmVjaG8udjEuQ2hhdFJlcXVlc3QaFS5lY2hvLnYxLkNoYXRSZXNwb25zZSgBMAFC4QEKC2NvbS5lY2hvLnYxQglFY2hvUHJvdG9QAaICA0VYWKoCB0VjaG8uVjHKAghFY2hvX1xWMeICFEVjaG9fXFYxXEdQQk1ldGFkYXRh6gIIRWNobzo6VjGSQYYBEl0KBEVjaG8iTgoGa2Fueml3Ei5odHRwczovL2dpdGh1Yi5jb20va2Fueml3L2dycGMtbm9kZS1wbGF5Z3JvdW5kGhRrYW56aXdvb25nQGdtYWlsLmNvbTIFMC4wLjEqAQIyEGFwcGxpY2F0aW9uL2pzb246EGFwcGxpY2F0aW9uL2pzb25iBnByb3RvMw", [file_google_api_annotations, file_google_rpc_error_details, file_google_protobuf_timestamp, file_protoc_gen_openapiv2_options_annotations]);

/**
 * @generated from message echo.v1.EchoRequest
 */
export type EchoRequest = Message<"echo.v1.EchoRequest"> & {
  /**
   * @generated from field: string message = 1;
   */
  message: string;
};

/**
 * Describes the message echo.v1.EchoRequest.
 * Use `create(EchoRequestSchema)` to create a new message.
 */
export const EchoRequestSchema: GenMessage<EchoRequest> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 0);

/**
 * @generated from message echo.v1.EchoResponse
 */
export type EchoResponse = Message<"echo.v1.EchoResponse"> & {
  /**
   * @generated from field: string message = 1;
   */
  message: string;

  /**
   * @generated from field: google.protobuf.Timestamp response_time = 2;
   */
  responseTime?: Timestamp;
};

/**
 * Describes the message echo.v1.EchoResponse.
 * Use `create(EchoResponseSchema)` to create a new message.
 */
export const EchoResponseSchema: GenMessage<EchoResponse> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 1);

/**
 * @generated from message echo.v1.EchoStreamRequest
 */
export type EchoStreamRequest = Message<"echo.v1.EchoStreamRequest"> & {
  /**
   * @generated from field: string message = 1;
   */
  message: string;

  /**
   * @generated from field: int32 repeat_count = 2;
   */
  repeatCount: number;
};

/**
 * Describes the message echo.v1.EchoStreamRequest.
 * Use `create(EchoStreamRequestSchema)` to create a new message.
 */
export const EchoStreamRequestSchema: GenMessage<EchoStreamRequest> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 2);

/**
 * @generated from message echo.v1.EchoStreamResponse
 */
export type EchoStreamResponse = Message<"echo.v1.EchoStreamResponse"> & {
  /**
   * @generated from field: string message = 1;
   */
  message: string;

  /**
   * @generated from field: int32 sequence_number = 2;
   */
  sequenceNumber: number;

  /**
   * @generated from field: google.protobuf.Timestamp response_time = 3;
   */
  responseTime?: Timestamp;
};

/**
 * Describes the message echo.v1.EchoStreamResponse.
 * Use `create(EchoStreamResponseSchema)` to create a new message.
 */
export const EchoStreamResponseSchema: GenMessage<EchoStreamResponse> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 3);

/**
 * @generated from message echo.v1.StreamEchoRequest
 */
export type StreamEchoRequest = Message<"echo.v1.StreamEchoRequest"> & {
  /**
   * @generated from field: string message_part = 1;
   */
  messagePart: string;
};

/**
 * Describes the message echo.v1.StreamEchoRequest.
 * Use `create(StreamEchoRequestSchema)` to create a new message.
 */
export const StreamEchoRequestSchema: GenMessage<StreamEchoRequest> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 4);

/**
 * @generated from message echo.v1.StreamEchoResponse
 */
export type StreamEchoResponse = Message<"echo.v1.StreamEchoResponse"> & {
  /**
   * @generated from field: string full_message = 1;
   */
  fullMessage: string;

  /**
   * @generated from field: google.protobuf.Timestamp response_time = 2;
   */
  responseTime?: Timestamp;
};

/**
 * Describes the message echo.v1.StreamEchoResponse.
 * Use `create(StreamEchoResponseSchema)` to create a new message.
 */
export const StreamEchoResponseSchema: GenMessage<StreamEchoResponse> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 5);

/**
 * @generated from message echo.v1.ChatRequest
 */
export type ChatRequest = Message<"echo.v1.ChatRequest"> & {
  /**
   * @generated from field: string user_id = 1;
   */
  userId: string;

  /**
   * @generated from field: string message = 2;
   */
  message: string;

  /**
   * @generated from field: google.protobuf.Timestamp response_time = 3;
   */
  responseTime?: Timestamp;
};

/**
 * Describes the message echo.v1.ChatRequest.
 * Use `create(ChatRequestSchema)` to create a new message.
 */
export const ChatRequestSchema: GenMessage<ChatRequest> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 6);

/**
 * @generated from message echo.v1.ChatResponse
 */
export type ChatResponse = Message<"echo.v1.ChatResponse"> & {
  /**
   * @generated from field: string user_id = 1;
   */
  userId: string;

  /**
   * @generated from field: string message = 2;
   */
  message: string;

  /**
   * @generated from field: google.protobuf.Timestamp response_time = 3;
   */
  responseTime?: Timestamp;
};

/**
 * Describes the message echo.v1.ChatResponse.
 * Use `create(ChatResponseSchema)` to create a new message.
 */
export const ChatResponseSchema: GenMessage<ChatResponse> = /*@__PURE__*/
  messageDesc(file_echo_v1_echo, 7);

/**
 * @generated from service echo.v1.EchoService
 */
export const EchoService: GenService<{
  /**
   * @generated from rpc echo.v1.EchoService.Echo
   */
  echo: {
    methodKind: "unary";
    input: typeof EchoRequestSchema;
    output: typeof EchoResponseSchema;
  },
  /**
   * @generated from rpc echo.v1.EchoService.EchoStream
   */
  echoStream: {
    methodKind: "server_streaming";
    input: typeof EchoStreamRequestSchema;
    output: typeof EchoStreamResponseSchema;
  },
  /**
   * @generated from rpc echo.v1.EchoService.StreamEcho
   */
  streamEcho: {
    methodKind: "client_streaming";
    input: typeof StreamEchoRequestSchema;
    output: typeof StreamEchoResponseSchema;
  },
  /**
   * @generated from rpc echo.v1.EchoService.Chat
   */
  chat: {
    methodKind: "bidi_streaming";
    input: typeof ChatRequestSchema;
    output: typeof ChatResponseSchema;
  },
}> = /*@__PURE__*/
  serviceDesc(file_echo_v1_echo, 0);


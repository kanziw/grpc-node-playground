// @generated by protoc-gen-es v2.0.0 with parameter "target=ts"
// @generated from file protoc-gen-openapiv2/options/annotations.proto (package grpc.gateway.protoc_gen_openapiv2.options, syntax proto3)
/* eslint-disable */

import type { GenExtension, GenFile } from "@bufbuild/protobuf/codegenv1";
import { extDesc, fileDesc } from "@bufbuild/protobuf/codegenv1";
import type { FieldOptions, FileOptions, MessageOptions, MethodOptions, ServiceOptions } from "@bufbuild/protobuf/wkt";
import { file_google_protobuf_descriptor } from "@bufbuild/protobuf/wkt";
import type { JSONSchema, Operation, Schema, Swagger, Tag } from "./openapiv2_pb";
import { file_protoc_gen_openapiv2_options_openapiv2 } from "./openapiv2_pb";

/**
 * Describes the file protoc-gen-openapiv2/options/annotations.proto.
 */
export const file_protoc_gen_openapiv2_options_annotations: GenFile = /*@__PURE__*/
  fileDesc("Ci5wcm90b2MtZ2VuLW9wZW5hcGl2Mi9vcHRpb25zL2Fubm90YXRpb25zLnByb3RvEilncnBjLmdhdGV3YXkucHJvdG9jX2dlbl9vcGVuYXBpdjIub3B0aW9uczp+ChFvcGVuYXBpdjJfc3dhZ2dlchIcLmdvb2dsZS5wcm90b2J1Zi5GaWxlT3B0aW9ucxiSCCABKAsyMi5ncnBjLmdhdGV3YXkucHJvdG9jX2dlbl9vcGVuYXBpdjIub3B0aW9ucy5Td2FnZ2VyUhBvcGVuYXBpdjJTd2FnZ2VyOoYBChNvcGVuYXBpdjJfb3BlcmF0aW9uEh4uZ29vZ2xlLnByb3RvYnVmLk1ldGhvZE9wdGlvbnMYkgggASgLMjQuZ3JwYy5nYXRld2F5LnByb3RvY19nZW5fb3BlbmFwaXYyLm9wdGlvbnMuT3BlcmF0aW9uUhJvcGVuYXBpdjJPcGVyYXRpb246fgoQb3BlbmFwaXYyX3NjaGVtYRIfLmdvb2dsZS5wcm90b2J1Zi5NZXNzYWdlT3B0aW9ucxiSCCABKAsyMS5ncnBjLmdhdGV3YXkucHJvdG9jX2dlbl9vcGVuYXBpdjIub3B0aW9ucy5TY2hlbWFSD29wZW5hcGl2MlNjaGVtYTp1Cg1vcGVuYXBpdjJfdGFnEh8uZ29vZ2xlLnByb3RvYnVmLlNlcnZpY2VPcHRpb25zGJIIIAEoCzIuLmdycGMuZ2F0ZXdheS5wcm90b2NfZ2VuX29wZW5hcGl2Mi5vcHRpb25zLlRhZ1IMb3BlbmFwaXYyVGFnOn4KD29wZW5hcGl2Ml9maWVsZBIdLmdvb2dsZS5wcm90b2J1Zi5GaWVsZE9wdGlvbnMYkgggASgLMjUuZ3JwYy5nYXRld2F5LnByb3RvY19nZW5fb3BlbmFwaXYyLm9wdGlvbnMuSlNPTlNjaGVtYVIOb3BlbmFwaXYyRmllbGRCSFpGZ2l0aHViLmNvbS9ncnBjLWVjb3N5c3RlbS9ncnBjLWdhdGV3YXkvdjIvcHJvdG9jLWdlbi1vcGVuYXBpdjIvb3B0aW9uc2IGcHJvdG8z", [file_google_protobuf_descriptor, file_protoc_gen_openapiv2_options_openapiv2]);

/**
 * ID assigned by protobuf-global-extension-registry@google.com for gRPC-Gateway project.
 *
 * All IDs are the same, as assigned. It is okay that they are the same, as they extend
 * different descriptor messages.
 *
 * @generated from extension: grpc.gateway.protoc_gen_openapiv2.options.Swagger openapiv2_swagger = 1042;
 */
export const openapiv2_swagger: GenExtension<FileOptions, Swagger> = /*@__PURE__*/
  extDesc(file_protoc_gen_openapiv2_options_annotations, 0);

/**
 * ID assigned by protobuf-global-extension-registry@google.com for gRPC-Gateway project.
 *
 * All IDs are the same, as assigned. It is okay that they are the same, as they extend
 * different descriptor messages.
 *
 * @generated from extension: grpc.gateway.protoc_gen_openapiv2.options.Operation openapiv2_operation = 1042;
 */
export const openapiv2_operation: GenExtension<MethodOptions, Operation> = /*@__PURE__*/
  extDesc(file_protoc_gen_openapiv2_options_annotations, 1);

/**
 * ID assigned by protobuf-global-extension-registry@google.com for gRPC-Gateway project.
 *
 * All IDs are the same, as assigned. It is okay that they are the same, as they extend
 * different descriptor messages.
 *
 * @generated from extension: grpc.gateway.protoc_gen_openapiv2.options.Schema openapiv2_schema = 1042;
 */
export const openapiv2_schema: GenExtension<MessageOptions, Schema> = /*@__PURE__*/
  extDesc(file_protoc_gen_openapiv2_options_annotations, 2);

/**
 * ID assigned by protobuf-global-extension-registry@google.com for gRPC-Gateway project.
 *
 * All IDs are the same, as assigned. It is okay that they are the same, as they extend
 * different descriptor messages.
 *
 * @generated from extension: grpc.gateway.protoc_gen_openapiv2.options.Tag openapiv2_tag = 1042;
 */
export const openapiv2_tag: GenExtension<ServiceOptions, Tag> = /*@__PURE__*/
  extDesc(file_protoc_gen_openapiv2_options_annotations, 3);

/**
 * ID assigned by protobuf-global-extension-registry@google.com for gRPC-Gateway project.
 *
 * All IDs are the same, as assigned. It is okay that they are the same, as they extend
 * different descriptor messages.
 *
 * @generated from extension: grpc.gateway.protoc_gen_openapiv2.options.JSONSchema openapiv2_field = 1042;
 */
export const openapiv2_field: GenExtension<FieldOptions, JSONSchema> = /*@__PURE__*/
  extDesc(file_protoc_gen_openapiv2_options_annotations, 4);


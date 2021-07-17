/**
 * @fileoverview gRPC-Web generated client stub for 
 * @enhanceable
 * @public
 */

// GENERATED CODE -- DO NOT EDIT!


/* eslint-disable */
// @ts-nocheck



const grpc = {};
grpc.web = require('grpc-web');


var google_protobuf_timestamp_pb = require('google-protobuf/google/protobuf/timestamp_pb.js')
const proto = require('./users_pb.js');

/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.AddUserClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @param {string} hostname
 * @param {?Object} credentials
 * @param {?Object} options
 * @constructor
 * @struct
 * @final
 */
proto.AddUserPromiseClient =
    function(hostname, credentials, options) {
  if (!options) options = {};
  options['format'] = 'text';

  /**
   * @private @const {!grpc.web.GrpcWebClientBase} The client
   */
  this.client_ = new grpc.web.GrpcWebClientBase(options);

  /**
   * @private @const {string} The hostname
   */
  this.hostname_ = hostname;

};


/**
 * @const
 * @type {!grpc.web.MethodDescriptor<
 *   !proto.UserCreateRequest,
 *   !proto.UserSummary>}
 */
const methodDescriptor_AddUser_Add = new grpc.web.MethodDescriptor(
  '/AddUser/Add',
  grpc.web.MethodType.UNARY,
  proto.UserCreateRequest,
  proto.UserSummary,
  /**
   * @param {!proto.UserCreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UserSummary.deserializeBinary
);


/**
 * @const
 * @type {!grpc.web.AbstractClientBase.MethodInfo<
 *   !proto.UserCreateRequest,
 *   !proto.UserSummary>}
 */
const methodInfo_AddUser_Add = new grpc.web.AbstractClientBase.MethodInfo(
  proto.UserSummary,
  /**
   * @param {!proto.UserCreateRequest} request
   * @return {!Uint8Array}
   */
  function(request) {
    return request.serializeBinary();
  },
  proto.UserSummary.deserializeBinary
);


/**
 * @param {!proto.UserCreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @param {function(?grpc.web.Error, ?proto.UserSummary)}
 *     callback The callback function(error, response)
 * @return {!grpc.web.ClientReadableStream<!proto.UserSummary>|undefined}
 *     The XHR Node Readable Stream
 */
proto.AddUserClient.prototype.add =
    function(request, metadata, callback) {
  return this.client_.rpcCall(this.hostname_ +
      '/AddUser/Add',
      request,
      metadata || {},
      methodDescriptor_AddUser_Add,
      callback);
};


/**
 * @param {!proto.UserCreateRequest} request The
 *     request proto
 * @param {?Object<string, string>} metadata User defined
 *     call metadata
 * @return {!Promise<!proto.UserSummary>}
 *     Promise that resolves to the response
 */
proto.AddUserPromiseClient.prototype.add =
    function(request, metadata) {
  return this.client_.unaryCall(this.hostname_ +
      '/AddUser/Add',
      request,
      metadata || {},
      methodDescriptor_AddUser_Add);
};


module.exports = proto;


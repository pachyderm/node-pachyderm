// package: enterprise_v2
// file: enterprise/enterprise.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "@grpc/grpc-js";
import * as enterprise_enterprise_pb from "../enterprise/enterprise_pb";
import * as google_protobuf_timestamp_pb from "google-protobuf/google/protobuf/timestamp_pb";

interface IAPIService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    activate: IAPIService_IActivate;
    getState: IAPIService_IGetState;
    getActivationCode: IAPIService_IGetActivationCode;
    heartbeat: IAPIService_IHeartbeat;
    deactivate: IAPIService_IDeactivate;
}

interface IAPIService_IActivate extends grpc.MethodDefinition<enterprise_enterprise_pb.ActivateRequest, enterprise_enterprise_pb.ActivateResponse> {
    path: "/enterprise_v2.API/Activate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<enterprise_enterprise_pb.ActivateRequest>;
    requestDeserialize: grpc.deserialize<enterprise_enterprise_pb.ActivateRequest>;
    responseSerialize: grpc.serialize<enterprise_enterprise_pb.ActivateResponse>;
    responseDeserialize: grpc.deserialize<enterprise_enterprise_pb.ActivateResponse>;
}
interface IAPIService_IGetState extends grpc.MethodDefinition<enterprise_enterprise_pb.GetStateRequest, enterprise_enterprise_pb.GetStateResponse> {
    path: "/enterprise_v2.API/GetState";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<enterprise_enterprise_pb.GetStateRequest>;
    requestDeserialize: grpc.deserialize<enterprise_enterprise_pb.GetStateRequest>;
    responseSerialize: grpc.serialize<enterprise_enterprise_pb.GetStateResponse>;
    responseDeserialize: grpc.deserialize<enterprise_enterprise_pb.GetStateResponse>;
}
interface IAPIService_IGetActivationCode extends grpc.MethodDefinition<enterprise_enterprise_pb.GetActivationCodeRequest, enterprise_enterprise_pb.GetActivationCodeResponse> {
    path: "/enterprise_v2.API/GetActivationCode";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<enterprise_enterprise_pb.GetActivationCodeRequest>;
    requestDeserialize: grpc.deserialize<enterprise_enterprise_pb.GetActivationCodeRequest>;
    responseSerialize: grpc.serialize<enterprise_enterprise_pb.GetActivationCodeResponse>;
    responseDeserialize: grpc.deserialize<enterprise_enterprise_pb.GetActivationCodeResponse>;
}
interface IAPIService_IHeartbeat extends grpc.MethodDefinition<enterprise_enterprise_pb.HeartbeatRequest, enterprise_enterprise_pb.HeartbeatResponse> {
    path: "/enterprise_v2.API/Heartbeat";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<enterprise_enterprise_pb.HeartbeatRequest>;
    requestDeserialize: grpc.deserialize<enterprise_enterprise_pb.HeartbeatRequest>;
    responseSerialize: grpc.serialize<enterprise_enterprise_pb.HeartbeatResponse>;
    responseDeserialize: grpc.deserialize<enterprise_enterprise_pb.HeartbeatResponse>;
}
interface IAPIService_IDeactivate extends grpc.MethodDefinition<enterprise_enterprise_pb.DeactivateRequest, enterprise_enterprise_pb.DeactivateResponse> {
    path: "/enterprise_v2.API/Deactivate";
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<enterprise_enterprise_pb.DeactivateRequest>;
    requestDeserialize: grpc.deserialize<enterprise_enterprise_pb.DeactivateRequest>;
    responseSerialize: grpc.serialize<enterprise_enterprise_pb.DeactivateResponse>;
    responseDeserialize: grpc.deserialize<enterprise_enterprise_pb.DeactivateResponse>;
}

export const APIService: IAPIService;

export interface IAPIServer extends grpc.UntypedServiceImplementation {
    activate: grpc.handleUnaryCall<enterprise_enterprise_pb.ActivateRequest, enterprise_enterprise_pb.ActivateResponse>;
    getState: grpc.handleUnaryCall<enterprise_enterprise_pb.GetStateRequest, enterprise_enterprise_pb.GetStateResponse>;
    getActivationCode: grpc.handleUnaryCall<enterprise_enterprise_pb.GetActivationCodeRequest, enterprise_enterprise_pb.GetActivationCodeResponse>;
    heartbeat: grpc.handleUnaryCall<enterprise_enterprise_pb.HeartbeatRequest, enterprise_enterprise_pb.HeartbeatResponse>;
    deactivate: grpc.handleUnaryCall<enterprise_enterprise_pb.DeactivateRequest, enterprise_enterprise_pb.DeactivateResponse>;
}

export interface IAPIClient {
    activate(request: enterprise_enterprise_pb.ActivateRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.ActivateResponse) => void): grpc.ClientUnaryCall;
    activate(request: enterprise_enterprise_pb.ActivateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.ActivateResponse) => void): grpc.ClientUnaryCall;
    activate(request: enterprise_enterprise_pb.ActivateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.ActivateResponse) => void): grpc.ClientUnaryCall;
    getState(request: enterprise_enterprise_pb.GetStateRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    getState(request: enterprise_enterprise_pb.GetStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    getState(request: enterprise_enterprise_pb.GetStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    getActivationCode(request: enterprise_enterprise_pb.GetActivationCodeRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetActivationCodeResponse) => void): grpc.ClientUnaryCall;
    getActivationCode(request: enterprise_enterprise_pb.GetActivationCodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetActivationCodeResponse) => void): grpc.ClientUnaryCall;
    getActivationCode(request: enterprise_enterprise_pb.GetActivationCodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetActivationCodeResponse) => void): grpc.ClientUnaryCall;
    heartbeat(request: enterprise_enterprise_pb.HeartbeatRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.HeartbeatResponse) => void): grpc.ClientUnaryCall;
    heartbeat(request: enterprise_enterprise_pb.HeartbeatRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.HeartbeatResponse) => void): grpc.ClientUnaryCall;
    heartbeat(request: enterprise_enterprise_pb.HeartbeatRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.HeartbeatResponse) => void): grpc.ClientUnaryCall;
    deactivate(request: enterprise_enterprise_pb.DeactivateRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.DeactivateResponse) => void): grpc.ClientUnaryCall;
    deactivate(request: enterprise_enterprise_pb.DeactivateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.DeactivateResponse) => void): grpc.ClientUnaryCall;
    deactivate(request: enterprise_enterprise_pb.DeactivateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.DeactivateResponse) => void): grpc.ClientUnaryCall;
}

export class APIClient extends grpc.Client implements IAPIClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: Partial<grpc.ClientOptions>);
    public activate(request: enterprise_enterprise_pb.ActivateRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.ActivateResponse) => void): grpc.ClientUnaryCall;
    public activate(request: enterprise_enterprise_pb.ActivateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.ActivateResponse) => void): grpc.ClientUnaryCall;
    public activate(request: enterprise_enterprise_pb.ActivateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.ActivateResponse) => void): grpc.ClientUnaryCall;
    public getState(request: enterprise_enterprise_pb.GetStateRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    public getState(request: enterprise_enterprise_pb.GetStateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    public getState(request: enterprise_enterprise_pb.GetStateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetStateResponse) => void): grpc.ClientUnaryCall;
    public getActivationCode(request: enterprise_enterprise_pb.GetActivationCodeRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetActivationCodeResponse) => void): grpc.ClientUnaryCall;
    public getActivationCode(request: enterprise_enterprise_pb.GetActivationCodeRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetActivationCodeResponse) => void): grpc.ClientUnaryCall;
    public getActivationCode(request: enterprise_enterprise_pb.GetActivationCodeRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.GetActivationCodeResponse) => void): grpc.ClientUnaryCall;
    public heartbeat(request: enterprise_enterprise_pb.HeartbeatRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.HeartbeatResponse) => void): grpc.ClientUnaryCall;
    public heartbeat(request: enterprise_enterprise_pb.HeartbeatRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.HeartbeatResponse) => void): grpc.ClientUnaryCall;
    public heartbeat(request: enterprise_enterprise_pb.HeartbeatRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.HeartbeatResponse) => void): grpc.ClientUnaryCall;
    public deactivate(request: enterprise_enterprise_pb.DeactivateRequest, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.DeactivateResponse) => void): grpc.ClientUnaryCall;
    public deactivate(request: enterprise_enterprise_pb.DeactivateRequest, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.DeactivateResponse) => void): grpc.ClientUnaryCall;
    public deactivate(request: enterprise_enterprise_pb.DeactivateRequest, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: enterprise_enterprise_pb.DeactivateResponse) => void): grpc.ClientUnaryCall;
}

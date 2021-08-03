import {ClientReadableStream} from '@grpc/grpc-js';
import {APIClient} from '@pachyderm/proto/pb/pps/pps_grpc_pb';
import {
  ListJobRequest,
  ListPipelineRequest,
  PipelineInfo,
  JobInfo,
  InspectJobRequest,
  InspectPipelineRequest,
  JobSet,
  InspectJobSetRequest,
  LogMessage,
  Pipeline,
  ListJobSetRequest,
  JobSetInfo,
} from '@pachyderm/proto/pb/pps/pps_pb';

import {
  pipelineFromObject,
  GetLogsRequestObject,
  getLogsRequestFromObject,
  InspectJobRequestObject,
  inspectJobRequestFromObject,
  InspectJobSetRequestObject,
  inspectJobSetRequestFromObject,
  ListJobRequestObject,
  listJobRequestFromObject,
  SubscribeJobRequestObject,
  subscribeJobRequestFromObject,
} from '../builders/pps';
import {JobSetQueryArgs, JobQueryArgs, ServiceArgs} from '../lib/types';
import {DEFAULT_JOBS_LIMIT} from '../services/constants/pps';
import streamToObjectArray from '../utils/streamToObjectArray';

export interface ListArgs {
  limit?: number | null;
}
export interface ListJobArgs extends ListArgs {
  pipelineId?: string | null;
}

const pps = ({
  pachdAddress,
  channelCredentials,
  credentialMetadata,
}: ServiceArgs) => {
  const client = new APIClient(pachdAddress, channelCredentials);

  return {
    listPipeline: (jq = '') => {
      const listPipelineRequest = new ListPipelineRequest()
        .setJqfilter(jq)
        .setDetails(true);
      const stream = client.listPipeline(
        listPipelineRequest,
        credentialMetadata,
      );

      return streamToObjectArray<PipelineInfo, PipelineInfo.AsObject>(stream);
    },

    listJob: (request: ListJobRequestObject) => {
      const listJobRequest = listJobRequestFromObject(request);

      const stream = client.listJob(listJobRequest, credentialMetadata);

      return streamToObjectArray<JobInfo, JobInfo.AsObject>(
        stream,
        // TODO: bring user opt in limits to be used here ||
        DEFAULT_JOBS_LIMIT,
      );
    },

    subscribeJob: (request: SubscribeJobRequestObject) => {
      const subscribeJobRequest = subscribeJobRequestFromObject(request);

      const stream = client.subscribeJob(
        subscribeJobRequest,
        credentialMetadata,
      );

      return streamToObjectArray<JobInfo, JobInfo.AsObject>(stream);
    },

    inspectPipeline: (id: string) => {
      return new Promise<PipelineInfo.AsObject>((resolve, reject) => {
        client.inspectPipeline(
          new InspectPipelineRequest()
            .setPipeline(pipelineFromObject({name: id}))
            .setDetails(true),
          credentialMetadata,
          (error, res) => {
            if (error) {
              return reject(error);
            }
            return resolve(res.toObject());
          },
        );
      });
    },

    inspectJobSet: (request: InspectJobSetRequestObject) => {
      const inspectJobSetRequest = inspectJobSetRequestFromObject(request);

      const stream = client.inspectJobSet(
        inspectJobSetRequest,
        credentialMetadata,
      );

      return streamToObjectArray<JobInfo, JobInfo.AsObject>(stream);
    },

    listJobSet: (params: ListJobSetRequest.AsObject['details'] = false) => {
      const listJobSetRequest = new ListJobSetRequest().setDetails(params);

      const stream = client.listJobSet(listJobSetRequest, credentialMetadata);

      return streamToObjectArray<JobSetInfo, JobSetInfo.AsObject>(
        stream,
        // TODO: bring user opt in limits to be used here ||
        DEFAULT_JOBS_LIMIT,
      );
    },

    inspectJob: (request: InspectJobRequestObject) => {
      const inspectJobRequest = inspectJobRequestFromObject(request);
      return new Promise<JobInfo.AsObject>((resolve, reject) => {
        client.inspectJob(
          inspectJobRequest,
          credentialMetadata,
          (error, res) => {
            if (error) {
              return reject(error);
            }
            return resolve(res.toObject());
          },
        );
      });
    },

    getLogs: (request: GetLogsRequestObject) => {
      const getLogsRequest = getLogsRequestFromObject(request);
      const stream = client.getLogs(getLogsRequest, credentialMetadata);

      return streamToObjectArray<LogMessage, LogMessage.AsObject>(stream);
    },

    getLogsStream: (request: GetLogsRequestObject) => {
      return new Promise<ClientReadableStream<LogMessage>>(
        (resolve, reject) => {
          try {
            const getLogsRequest = getLogsRequestFromObject(request);
            const stream = client.getLogs(getLogsRequest, credentialMetadata);

            return resolve(stream);
          } catch (error) {
            return reject(error);
          }
        },
      );
    },
  };
};

export default pps;

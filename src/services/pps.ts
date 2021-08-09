import {ClientReadableStream} from '@grpc/grpc-js';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
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
  DeleteJobRequest,
  Job,
  StopJobRequest,
  InspectDatumRequest,
  DatumInfo,
  StartPipelineRequest,
  StopPipelineRequest,
  RunCronRequest,
  CreateSecretRequest,
  DeleteSecretRequest,
  SecretInfo,
  SecretInfos,
  InspectSecretRequest,
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
  jobFromObject,
  JobObject,
  StopJobRequestObject,
  stopJobRequestFromObject,
  DatumObject,
  datumFromObject,
  ListDatumRequestObject,
  listDatumRequestFromObject,
  RestartDatumRequestObject,
  restartDatumRequestFromObject,
  CreatePipelineRequestObject,
  createPipelineRequestFromObject,
  InspectPipelineRequestObject,
  inspectPipelineRequestFromObject,
  ListPipelineRequestObject,
  listPipelineRequestFromObject,
  deletePipelineRequestFromObject,
  DeletePipelineRequestObject,
  PipelineObject,
  SecretObject,
  secretFromObject,
  CreateSecretRequestObject,
  createSecretRequestFromObject,
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
    listPipeline: (request: ListPipelineRequestObject) => {
      const listPipelineRequest = listPipelineRequestFromObject(request);
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

    inspectPipeline: (request: InspectPipelineRequestObject) => {
      return new Promise<PipelineInfo.AsObject>((resolve, reject) => {
        const inspectPipelineRequest =
          inspectPipelineRequestFromObject(request);

        client.inspectPipeline(
          inspectPipelineRequest,
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

    deleteJob: (params: JobObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const deleteJobRequest = new DeleteJobRequest().setJob(
          jobFromObject(params),
        );

        client.deleteJob(deleteJobRequest, credentialMetadata, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve({});
        });
      });
    },

    stopJob: (request: StopJobRequestObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const stopJobRequest = stopJobRequestFromObject(request);

        client.stopJob(stopJobRequest, credentialMetadata, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve({});
        });
      });
    },

    inspectDatum: (params: DatumObject) => {
      const inspectDatumRequest = new InspectDatumRequest().setDatum(
        datumFromObject(params),
      );
      return new Promise<DatumInfo.AsObject>((resolve, reject) => {
        client.inspectDatum(
          inspectDatumRequest,
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

    listDatum: (request: ListDatumRequestObject) => {
      const listDatumRequest = listDatumRequestFromObject(request);

      const stream = client.listDatum(listDatumRequest, credentialMetadata);

      return streamToObjectArray<DatumInfo, DatumInfo.AsObject>(stream);
    },

    restartDatum: (request: RestartDatumRequestObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const restartDatumRequest = restartDatumRequestFromObject(request);

        client.restartDatum(
          restartDatumRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    createPipeline: (request: CreatePipelineRequestObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const createPipelineRequest = createPipelineRequestFromObject(request);

        client.createPipeline(
          createPipelineRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    startPipeline: (params: PipelineObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const startPipelineRequest = new StartPipelineRequest().setPipeline(
          pipelineFromObject(params),
        );

        client.startPipeline(
          startPipelineRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    stopPipeline: (params: PipelineObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const stopPipelineRequest = new StopPipelineRequest().setPipeline(
          pipelineFromObject(params),
        );

        client.stopPipeline(
          stopPipelineRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    runCron: (params: PipelineObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const runCronRequest = new RunCronRequest().setPipeline(
          pipelineFromObject(params),
        );

        client.runCron(runCronRequest, credentialMetadata, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve({});
        });
      });
    },

    deletePipeline: (request: DeletePipelineRequestObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const deletePipelineRequest = deletePipelineRequestFromObject(request);

        client.deletePipeline(
          deletePipelineRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    deleteAllPipelines: () => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        client.deleteAll(new Empty(), credentialMetadata, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve({});
        });
      });
    },

    createSecret: (request: CreateSecretRequestObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const createSecretRequest = createSecretRequestFromObject(request);
        client.createSecret(
          createSecretRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    deleteSecret: (params: SecretObject) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const deleteeSecretRequest = new DeleteSecretRequest().setSecret(
          secretFromObject(params),
        );
        client.deleteSecret(
          deleteeSecretRequest,
          credentialMetadata,
          (error) => {
            if (error) {
              return reject(error);
            }
            return resolve({});
          },
        );
      });
    },

    listSecret: () => {
      return new Promise<SecretInfos.AsObject>((resolve, reject) => {
        client.listSecret(new Empty(), credentialMetadata, (error, res) => {
          if (error) {
            return reject(error);
          }
          return resolve(res.toObject());
        });
      });
    },

    inspectSecret: (params: SecretObject) => {
      return new Promise<SecretInfo.AsObject>((resolve, reject) => {
        const inspectSecretRequest = new InspectSecretRequest().setSecret(
          secretFromObject(params),
        );
        client.inspectSecret(
          inspectSecretRequest,
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

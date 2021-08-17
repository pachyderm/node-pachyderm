import {ClientReadableStream} from '@grpc/grpc-js';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';
import {APIClient} from '@pachyderm/proto/pb/pps/pps_grpc_pb';
import {
  PipelineInfo,
  LogMessage,
  StartPipelineRequest,
  StopPipelineRequest,
  RunCronRequest,
  CreatePipelineRequest,
  Transform,
  Input,
  ListPipelineRequest,
  Pipeline,
  InspectPipelineRequest,
  DeletePipelineRequest,
} from '@pachyderm/proto/pb/pps/pps_pb';

import {commitFromObject} from 'builders/pfs';
import {durationFromObject} from 'builders/protobuf';

import {
  pipelineFromObject,
  GetLogsRequestObject,
  getLogsRequestFromObject,
  PipelineObject,
  egressFromObject,
  inputFromObject,
  parallelismSpecFromObject,
  chunkSpecFromObject,
  resourceSpecFromObject,
  schedulingSpecFromObject,
  serviceFromObject,
  spoutFromObject,
  transformFromObject,
} from '../builders/pps';
import {ServiceArgs} from '../lib/types';
import {DEFAULT_JOBS_LIMIT} from '../services/constants/pps';
import streamToObjectArray from '../utils/streamToObjectArray';

export interface ListArgs {
  limit?: number | null;
}
export interface ListJobArgs extends ListArgs {
  pipelineId?: string | null;
}

interface CreatePipelineRequestOptions
  extends Omit<
    CreatePipelineRequest.AsObject,
    | 'autoscaling'
    | 'pipeline'
    | 'description'
    | 'transform'
    | 'podPatch'
    | 'podSpec'
    | 'outputBranch'
    | 'reprocess'
    | 'reprocessSpec'
    | 'tfJob'
    | 'extension'
    | 'update'
    | 'salt'
    | 's3Out'
    | 'datumTries'
  > {
  autoscaling?: CreatePipelineRequest.AsObject['autoscaling'];
  name: string;
  transform: Transform.AsObject;
  description?: CreatePipelineRequest.AsObject['description'];
  input: Input.AsObject;
  podPatch?: CreatePipelineRequest.AsObject['podPatch'];
  podSpec?: CreatePipelineRequest.AsObject['podSpec'];
  outputBranch?: CreatePipelineRequest.AsObject['outputBranch'];
  reprocess?: CreatePipelineRequest.AsObject['reprocess'];
  reprocessSpec?: CreatePipelineRequest.AsObject['reprocessSpec'];
  update?: CreatePipelineRequest.AsObject['update'];
  salt?: CreatePipelineRequest.AsObject['salt'];
  s3Out?: CreatePipelineRequest.AsObject['s3Out'];
  datumTries?: CreatePipelineRequest.AsObject['datumTries'];
}

interface ListPipelineRequestOptions
  extends Omit<
    ListPipelineRequest.AsObject,
    'pipeline' | 'history' | 'details' | 'jqfilter'
  > {
  pipeline?: Pipeline.AsObject;
  history?: ListPipelineRequest.AsObject['history'];
  details?: ListPipelineRequest.AsObject['details'];
  jqfilter?: ListPipelineRequest.AsObject['jqfilter'];
}

interface InspectPipelineRequestOptions
  extends Omit<InspectPipelineRequest.AsObject, 'pipeline' | 'details'> {
  pipeline: Pipeline.AsObject;
  details?: InspectPipelineRequest.AsObject['details'];
}

interface DeletePipelineRequestOptions
  extends Omit<
    DeletePipelineRequest.AsObject,
    'pipeline' | 'all' | 'force' | 'keepRepo'
  > {
  pipeline: Pipeline.AsObject;
  all?: DeletePipelineRequest.AsObject['all'];
  force?: DeletePipelineRequest.AsObject['force'];
  keepRepo?: DeletePipelineRequest.AsObject['keepRepo'];
}

const pps = ({
  pachdAddress,
  channelCredentials,
  credentialMetadata,
}: ServiceArgs) => {
  const client = new APIClient(pachdAddress, channelCredentials);

  return {
    createPipeline: (options: CreatePipelineRequestOptions) => {
      const request = new CreatePipelineRequest();
      if (options.autoscaling) request.setAutoscaling(options.autoscaling);
      if (options.datumSetSpec)
        request.setDatumSetSpec(chunkSpecFromObject(options.datumSetSpec));
      if (options.datumTimeout)
        request.setDatumTimeout(durationFromObject(options.datumTimeout));
      if (options.datumTries) request.setDatumTries(options.datumTries);
      if (options.description) request.setDescription(options.description);
      if (options.egress) request.setEgress(egressFromObject(options.egress));
      if (options.input) request.setInput(inputFromObject(options.input));
      if (options.jobTimeout)
        request.setJobTimeout(durationFromObject(options.jobTimeout));
      // if (options.metadata) request.setMetadata(options.metadata);
      if (options.outputBranch) request.setOutputBranch(options.outputBranch);
      if (options.parallelismSpec)
        request.setParallelismSpec(
          parallelismSpecFromObject(options.parallelismSpec),
        );
      request.setPipeline(pipelineFromObject({name: options.name}));
      if (options.podPatch) request.setPodPatch(options.podPatch);
      if (options.podSpec) request.setPodSpec(options.podSpec);
      if (options.s3Out) request.setS3Out(options.s3Out);
      if (options.reprocess) request.setReprocess(options.reprocess);
      if (options.reprocessSpec)
        request.setReprocessSpec(options.reprocessSpec);
      if (options.resourceLimits)
        request.setResourceLimits(
          resourceSpecFromObject(options.resourceLimits),
        );
      if (options.resourceRequests)
        request.setResourceRequests(
          resourceSpecFromObject(options.resourceRequests),
        );
      if (options.schedulingSpec)
        request.setSchedulingSpec(
          schedulingSpecFromObject(options.schedulingSpec),
        );
      if (options.service)
        request.setService(serviceFromObject(options.service));
      if (options.sidecarResourceLimits)
        request.setSidecarResourceLimits(
          resourceSpecFromObject(options.sidecarResourceLimits),
        );
      if (options.spout) request.setSpout(spoutFromObject(options.spout));
      if (options.update) request.setUpdate(options.update);
      request.setTransform(transformFromObject(options.transform));
      if (options.salt) request.setSalt(options.salt);
      if (options.specCommit)
        request.setSpecCommit(commitFromObject(options.specCommit));

      return new Promise<Empty.AsObject>((resolve, reject) => {
        client.createPipeline(request, (error) => {
          if (error) return reject(error);
          return resolve({});
        });
      });
    },
    listPipeline: (options: ListPipelineRequestOptions) => {
      const request = new ListPipelineRequest();

      if (options.pipeline) {
        request.setPipeline(pipelineFromObject(options.pipeline));
      }

      if (options.history) {
        request.setHistory(options.history);
      } else {
        request.setHistory(0);
      }

      if (options.details) {
        request.setDetails(options.details);
      } else {
        request.setDetails(true);
      }

      if (options.jqfilter) {
        request.setJqfilter(options.jqfilter);
      } else {
        request.setJqfilter('');
      }

      const stream = client.listPipeline(request, credentialMetadata);

      return streamToObjectArray<PipelineInfo, PipelineInfo.AsObject>(stream);
    },

    inspectPipeline: (options: InspectPipelineRequestOptions) => {
      return new Promise<PipelineInfo.AsObject>((resolve, reject) => {
        const request = new InspectPipelineRequest();

        if (options.pipeline) {
          request.setPipeline(pipelineFromObject(options.pipeline));
        }

        if (options.details) {
          request.setDetails(options.details);
        } else {
          request.setDetails(true);
        }

        client.inspectPipeline(request, credentialMetadata, (error, res) => {
          if (error) {
            return reject(error);
          }
          return resolve(res.toObject());
        });
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

    deletePipeline: (options: DeletePipelineRequestOptions) => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        const request = new DeletePipelineRequest();

        request.setPipeline(pipelineFromObject(options.pipeline));

        if (options.all) {
          request.setAll(options.all);
        } else {
          request.setAll(false);
        }

        if (options.force) {
          request.setForce(options.force);
        } else {
          request.setForce(false);
        }

        if (options.keepRepo) {
          request.setKeepRepo(options.keepRepo);
        } else {
          request.setKeepRepo(false);
        }

        client.deletePipeline(request, credentialMetadata, (error) => {
          if (error) {
            return reject(error);
          }
          return resolve({});
        });
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

    deleteAll: () => {
      return new Promise<Empty.AsObject>((resolve, reject) => {
        client.deleteAll(new Empty(), (error) => {
          if (error) {
            return reject(error);
          }
          return resolve({});
        });
      });
    },
  };
};

export default pps;

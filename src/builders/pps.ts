import {
  CronInput,
  DatumSetSpec,
  Egress,
  GPUSpec,
  Input,
  JobState,
  ParallelismSpec,
  PFSInput,
  Pipeline,
  PipelineInfo,
  PipelineInfos,
  PipelineState,
  ResourceSpec,
  SchedulingSpec,
  SecretMount,
  Service,
  Spout,
  TFJob,
  Transform,
  Job,
  JobInfo,
  GetLogsRequest,
  InspectJobRequest,
  InspectJobSetRequest,
  JobSet,
  ListJobRequest,
  SubscribeJobRequest,
  StopJobRequest,
  Datum,
  DatumState,
  ProcessStats,
  DatumInfo,
  ListDatumRequest,
  RestartDatumRequest,
  CreatePipelineRequest,
  Metadata,
  InspectPipelineRequest,
  ListPipelineRequest,
  DeletePipelineRequest,
  Secret,
  CreateSecretRequest,
} from '@pachyderm/proto/pb/pps/pps_pb';

import {
  commitFromObject,
  CommitObject,
  fileFromObject,
  fileInfoFromObject,
  FileInfoObject,
  FileObject,
  triggerFromObject,
  TriggerObject,
} from '../builders/pfs';
import {
  durationFromObject,
  DurationObject,
  timestampFromObject,
  TimestampObject,
} from '../builders/protobuf';

export type PipelineObject = {
  name: Pipeline.AsObject['name'];
};

export type SecretMountObject = {
  name: SecretMount.AsObject['name'];
  key: SecretMount.AsObject['key'];
  mountPath: SecretMount.AsObject['mountPath'];
  envVar: SecretMount.AsObject['envVar'];
};

export type TransformObject = {
  image: Transform.AsObject['image'];
  cmdList: Transform.AsObject['cmdList'];
  errCmdList?: Transform.AsObject['errCmdList'];
  //TODO: Proto Map does not have a setter
  // envMap: Array<[string, string]>;
  secretsList?: SecretMountObject[];
  imagePullSecretsList?: Transform.AsObject['imagePullSecretsList'];
  stdinList?: Transform.AsObject['stdinList'];
  errStdinList?: Transform.AsObject['errStdinList'];
  acceptReturnCodeList?: Transform.AsObject['acceptReturnCodeList'];
  debug?: Transform.AsObject['debug'];
  user?: Transform.AsObject['user'];
  workingDir?: Transform.AsObject['workingDir'];
  dockerfile?: Transform.AsObject['dockerfile'];
};

export type TFJobObject = {
  tfJob: TFJob.AsObject['tfJob'];
};

export type ParallelismSpecObject = {
  constant: ParallelismSpec.AsObject['constant'];
};

export type EgressObject = {
  url: Egress.AsObject['url'];
};

export type GPUSpecObject = {
  type: GPUSpec.AsObject['type'];
  number: GPUSpec.AsObject['number'];
};

export type ResourceSpecObject = {
  cpu: ResourceSpec.AsObject['cpu'];
  memory: ResourceSpec.AsObject['memory'];
  gpu?: GPUSpecObject;
  disk: ResourceSpec.AsObject['disk'];
};

export type PFSInputObject = {
  name: PFSInput.AsObject['name'];
  repo: PFSInput.AsObject['repo'];
  branch: PFSInput.AsObject['branch'];
  commit?: PFSInput.AsObject['commit'];
  glob?: PFSInput.AsObject['glob'];
  joinOn?: PFSInput.AsObject['joinOn'];
  outerJoin?: PFSInput.AsObject['outerJoin'];
  groupBy?: PFSInput.AsObject['groupBy'];
  lazy?: PFSInput.AsObject['lazy'];
  emptyFiles?: PFSInput.AsObject['emptyFiles'];
  s3?: PFSInput.AsObject['s3'];
  trigger?: TriggerObject;
};

export type CronInputObject = {
  name: CronInput.AsObject['name'];
  repo: CronInput.AsObject['repo'];
  commit: CronInput.AsObject['commit'];
  spec: CronInput.AsObject['spec'];
  overwrite: CronInput.AsObject['overwrite'];
  start?: TimestampObject;
};

export type InputObject = {
  pfs?: PFSInputObject;
  joinList?: InputObject[];
  groupList?: InputObject[];
  crossList?: InputObject[];
  unionList?: InputObject[];
  cron?: CronInputObject;
};

export type ServiceObject = {
  internalPort: Service.AsObject['internalPort'];
  externalPort: Service.AsObject['externalPort'];
  ip: Service.AsObject['ip'];
  type: Service.AsObject['type'];
};

export type SpoutObject = {
  service?: ServiceObject;
};

export type DatumSetSpecObject = {
  number: DatumSetSpec.AsObject['number'];
  sizeBytes: DatumSetSpec.AsObject['sizeBytes'];
};
export type SchedulingSpecObject = {
  //TODO: Proto Map does not have a setter
  // nodeSelectorMap: jspb.Map<string, string>;
  priorityClassName: SchedulingSpec.AsObject['priorityClassName'];
};

export type PipelineInfoObject = {
  pipeline?: PipelineObject;
  version?: PipelineInfo.AsObject['version'];
  transform?: TransformObject;
  tfJob?: TFJobObject;
  parallelismSpec?: ParallelismSpecObject;
  egress?: EgressObject;
  createdAt?: TimestampObject;
  state?: PipelineState;
  stopped?: PipelineInfo.AsObject['stopped'];
  recentError?: PipelineInfo.Details.AsObject['recentError'];
  workersRequested?: PipelineInfo.Details.AsObject['workersRequested'];
  workersAvailable?: PipelineInfo.Details.AsObject['workersAvailable'];
  //TODO: Proto Map does not have a setter
  // jobCountsMap: jspb.Map<number, number>;
  lastJobState?: JobState;
  outputBranch?: PipelineInfo.Details.AsObject['outputBranch'];
  resourceRequests?: ResourceSpecObject;
  resourceLimits?: ResourceSpecObject;
  sidecarResourceLimits?: ResourceSpecObject;
  input?: InputObject;
  description?: PipelineInfo.Details.AsObject['description'];
  salt?: PipelineInfo.Details.AsObject['salt'];
  reason?: PipelineInfo.AsObject['reason'];
  service?: ServiceObject;
  spout?: SpoutObject;
  chunkSpec?: DatumSetSpecObject;
  datumTimeout?: DurationObject;
  jobTimeout?: DurationObject;
  specCommit?: CommitObject;
  datumTries?: PipelineInfo.Details.AsObject['datumTries'];
  schedulingSpec?: SchedulingSpecObject;
  podSpec?: PipelineInfo.Details.AsObject['podSpec'];
  podPatch?: PipelineInfo.Details.AsObject['podPatch'];
  s3Out?: PipelineInfo.Details.AsObject['s3Out'];
  //TODO: Proto Map does not have a setter
  // metadata?: Metadata.AsObject,
};

export type PipelineInfosObject = {
  pipelineInfoList: PipelineInfoObject[];
};

export type JobObject = {
  id: Job.AsObject['id'];
  pipeline?: PipelineObject;
};

export type JobSetObject = {
  id: JobSet.AsObject['id'];
};

export type DatumObject = {
  job: JobObject;
  id: Datum.AsObject['id'];
};

export type ProcessStatsObject = {
  downloadTime: DurationObject;
  processTime: DurationObject;
  uploadTime: DurationObject;
  downloadBytes: ProcessStats.AsObject['downloadBytes'];
  uploadBytes: ProcessStats.AsObject['uploadBytes'];
};

export type DatumInfoObject = {
  datum: DatumObject;
  state: DatumState;
  stats: ProcessStatsObject;
  pfsState: FileObject;
  data: FileInfoObject[];
};

export type ListDatumRequestObject = {
  job?: JobObject;
  input?: InputObject;
};

export type MetadataObject = {
  annotations: Metadata.AsObject['annotationsMap'];
  labels: Metadata.AsObject['labelsMap'];
};

export type CreatePipelineRequestObject = {
  pipeline: PipelineObject;
  tfJob?: TFJobObject;
  transform: TransformObject;
  parallelismSpec?: ParallelismSpecObject;
  egress?: EgressObject;
  update?: CreatePipelineRequest.AsObject['update'];
  outputBranch?: CreatePipelineRequest.AsObject['outputBranch'];
  s3Out?: CreatePipelineRequest.AsObject['s3Out'];
  resourceRequests?: ResourceSpecObject;
  resourceLimits?: ResourceSpecObject;
  sidecarResourceLimits?: ResourceSpecObject;
  input: InputObject;
  description?: CreatePipelineRequest.AsObject['description'];
  reprocess?: CreatePipelineRequest.AsObject['reprocess'];
  service?: ServiceObject;
  spout?: SpoutObject;
  datumSetSpec?: DatumSetSpecObject;
  datumTimeout?: DurationObject;
  jobTimeout?: DurationObject;
  salt?: CreatePipelineRequest.AsObject['salt'];
  datumTries?: CreatePipelineRequest.AsObject['datumTries'];
  schedulingSpec?: SchedulingSpecObject;
  podSpec?: CreatePipelineRequest.AsObject['podSpec'];
  podPatch?: CreatePipelineRequest.AsObject['podPatch'];
  specCommit?: CommitObject;
  metadata?: MetadataObject;
  reprocessSpec?: CreatePipelineRequest.AsObject['reprocessSpec'];
  autoscaling?: CreatePipelineRequest.AsObject['autoscaling'];
};

export type JobInfoObject = {
  job: Pick<Job.AsObject, 'id' | 'pipeline'>;
  createdAt?: JobInfo.AsObject['created'];
  startedAt?: JobInfo.AsObject['started'];
  finishedAt?: JobInfo.AsObject['finished'];
  state: JobState;
  input?: InputObject;
  outputCommit?: CommitObject;
};

export type GetLogsRequestObject = {
  pipelineName?: string;
  jobId?: string;
  since?: number;
  follow?: boolean;
};

export type InspectJobRequestObject = {
  job: JobObject;
  pipeline: PipelineObject;
  wait?: InspectJobRequest.AsObject['wait'];
  details?: InspectJobRequest.AsObject['details'];
};

export type InspectJobSetRequestObject = {
  jobSet: JobSetObject;
  wait?: InspectJobSetRequest.AsObject['wait'];
  details?: InspectJobSetRequest.AsObject['details'];
};

export type ListJobRequestObject = {
  pipeline?: PipelineObject;
  inputCommit?: CommitObject[];
  history?: ListJobRequest.AsObject['history'];
  details?: ListJobRequest.AsObject['details'];
  jqfilter?: ListJobRequest.AsObject['jqfilter'];
};

export type SubscribeJobRequestObject = {
  pipeline: PipelineObject;
  details?: SubscribeJobRequest.AsObject['details'];
};

export type StopJobRequestObject = {
  job: JobObject;
  reason?: StopJobRequest.AsObject['reason'];
};

export type RestartDatumRequestObject = {
  job: JobObject;
  dataFilters: RestartDatumRequest.AsObject['dataFiltersList'];
};

export type DeletePipelineRequestObject = {
  pipeline: PipelineObject;
  all?: DeletePipelineRequest.AsObject['all'];
  force?: DeletePipelineRequest.AsObject['force'];
  keepRepo?: DeletePipelineRequest.AsObject['keepRepo'];
};

export type CreateSecretRequestObject = {
  name: SecretObject['name'];
  data: CreateSecretRequest.AsObject['file'];
  labels?: Metadata.AsObject['labelsMap'];
  annotations?: Metadata.AsObject['annotationsMap'];
};

export type SecretObject = {
  name: Secret.AsObject['name'];
};

export const secretFromObject = ({name}: SecretObject) => {
  const secret = new Secret();

  secret.setName(name);

  return secret;
};

export const pipelineFromObject = ({name}: PipelineObject) => {
  const pipeline = new Pipeline();
  pipeline.setName(name);

  return pipeline;
};

export const secretMountFromObject = ({
  name,
  key,
  mountPath,
  envVar,
}: SecretMountObject) => {
  const secretMount = new SecretMount();
  secretMount.setName(name);
  secretMount.setKey(key);
  secretMount.setMountPath(mountPath);
  secretMount.setEnvVar(envVar);

  return secretMount;
};

export const transformFromObject = ({
  image,
  cmdList,
  errCmdList = [],
  secretsList = [],
  imagePullSecretsList = [],
  stdinList = [],
  errStdinList = [],
  acceptReturnCodeList = [],
  debug = false,
  user = '',
  workingDir = '',
  dockerfile = '',
}: TransformObject) => {
  const transform = new Transform();
  transform.setImage(image);
  transform.setCmdList(cmdList);
  transform.setErrCmdList(errCmdList);

  if (secretsList) {
    const transformedSecrets = secretsList.map((secret) => {
      return secretMountFromObject(secret);
    });
    transform.setSecretsList(transformedSecrets);
  }

  transform.setImagePullSecretsList(imagePullSecretsList);
  transform.setStdinList(stdinList);
  transform.setErrStdinList(errStdinList);
  transform.setAcceptReturnCodeList(acceptReturnCodeList);
  transform.setDebug(debug);
  transform.setUser(user);
  transform.setWorkingDir(workingDir);
  transform.setDockerfile(dockerfile);

  return transform;
};

export const tfJobFromObject = ({tfJob}: TFJobObject) => {
  const tfjJob = new TFJob();
  tfjJob.setTfJob(tfJob);

  return tfjJob;
};

export const parallelismSpecFromObject = ({
  constant,
}: ParallelismSpecObject) => {
  const parallelismSpec = new ParallelismSpec();
  parallelismSpec.setConstant(constant);

  return parallelismSpec;
};

export const egressFromObject = ({url}: EgressObject) => {
  const egress = new Egress();
  egress.setUrl(url);

  return egress;
};

export const gpuSpecFromObject = ({type, number}: GPUSpecObject) => {
  const gpuSpec = new GPUSpec();
  gpuSpec.setType(type);
  gpuSpec.setNumber(number);

  return gpuSpec;
};

export const resourceSpecFromObject = ({
  cpu,
  memory,
  gpu,
  disk,
}: ResourceSpecObject) => {
  const resourceSpec = new ResourceSpec();
  resourceSpec.setCpu(cpu);
  resourceSpec.setMemory(memory);
  if (gpu) {
    resourceSpec.setGpu(gpuSpecFromObject(gpu));
  }
  resourceSpec.setDisk(disk);
  return resourceSpec;
};

export const pfsInputFromObject = ({
  name,
  repo,
  branch,
  commit = '',
  glob = '',
  joinOn = '',
  outerJoin = false,
  groupBy = '',
  lazy = false,
  emptyFiles = false,
  s3 = false,
  trigger,
}: PFSInputObject) => {
  const pfsInput = new PFSInput();
  pfsInput.setName(name);
  pfsInput.setRepo(repo);
  pfsInput.setBranch(branch);
  pfsInput.setCommit(commit);
  pfsInput.setGlob(glob);
  pfsInput.setJoinOn(joinOn);
  pfsInput.setOuterJoin(outerJoin);
  pfsInput.setGroupBy(groupBy);
  pfsInput.setLazy(lazy);
  pfsInput.setEmptyFiles(emptyFiles);
  pfsInput.setS3(s3);
  if (trigger) {
    pfsInput.setTrigger(triggerFromObject(trigger));
  }

  return pfsInput;
};

export const cronInputFromObject = ({
  name,
  repo,
  commit,
  spec,
  overwrite,
  start,
}: CronInputObject) => {
  const cronInput = new CronInput();
  cronInput.setName(name);
  cronInput.setRepo(repo);
  cronInput.setCommit(commit);
  cronInput.setSpec(spec);
  cronInput.setOverwrite(overwrite);

  if (start) {
    cronInput.setStart(timestampFromObject(start));
  }
  return cronInput;
};

export const inputFromObject = ({
  pfs,
  joinList = [],
  groupList = [],
  crossList = [],
  unionList = [],
  cron,
}: InputObject) => {
  const input = new Input();

  if (pfs) {
    input.setPfs(pfsInputFromObject(pfs));
  }

  if (joinList) {
    const transformedJoinlist = joinList.map((item) => {
      return inputFromObject(item);
    });
    input.setJoinList(transformedJoinlist);
  }

  if (groupList) {
    const transformedGroupList = groupList.map((item) => {
      return inputFromObject(item);
    });
    input.setGroupList(transformedGroupList);
  }

  if (crossList) {
    const transformedCrosslist = crossList.map((item) => {
      return inputFromObject(item);
    });
    input.setCrossList(transformedCrosslist);
  }

  if (unionList) {
    const transformedUnionlist = unionList.map((item) => {
      return inputFromObject(item);
    });
    input.setUnionList(transformedUnionlist);
  }

  if (cron) {
    input.setCron(cronInputFromObject(cron));
  }

  return input;
};

export const serviceFromObject = ({
  internalPort,
  externalPort,
  ip,
  type,
}: ServiceObject) => {
  const service = new Service();
  service.setInternalPort(internalPort);
  service.setExternalPort(externalPort);
  service.setIp(ip);
  service.setType(type);

  return service;
};

export const spoutFromObject = ({service}: SpoutObject) => {
  const spout = new Spout();
  if (service) {
    spout.setService(serviceFromObject(service));
  }

  return spout;
};

export const chunkSpecFromObject = ({
  number,
  sizeBytes,
}: DatumSetSpecObject) => {
  const chunkSpec = new DatumSetSpec();
  chunkSpec.setNumber(number);
  chunkSpec.setSizeBytes(sizeBytes);

  return chunkSpec;
};

export const schedulingSpecFromObject = ({
  priorityClassName,
}: SchedulingSpecObject) => {
  const schedulingSpec = new SchedulingSpec();
  schedulingSpec.setPriorityClassName(priorityClassName);

  return schedulingSpec;
};

export const metadataFromObject = ({annotations, labels}: MetadataObject) => {
  const metadata = new Metadata();

  // TODO (proto setters for metadata):
  // metadata.setAnnotations
  // metadata.setLabels

  return metadata;
};

export const createPipelineRequestFromObject = ({
  pipeline,
  tfJob,
  transform,
  parallelismSpec,
  egress,
  update,
  outputBranch,
  s3Out,
  resourceRequests,
  resourceLimits,
  sidecarResourceLimits,
  input,
  description,
  reprocess,
  service,
  spout,
  datumSetSpec,
  datumTimeout,
  jobTimeout,
  salt,
  datumTries,
  schedulingSpec,
  podSpec,
  podPatch,
  specCommit,
  metadata,
  reprocessSpec,
  autoscaling,
}: CreatePipelineRequestObject) => {
  const request = new CreatePipelineRequest();

  request.setPipeline(pipelineFromObject(pipeline));
  if (tfJob) {
    request.setTfJob(tfJobFromObject(tfJob));
  }
  request.setTransform(transformFromObject(transform));
  if (parallelismSpec) {
    request.setParallelismSpec(parallelismSpecFromObject(parallelismSpec));
  }
  if (egress) {
    request.setEgress(egressFromObject(egress));
  }
  if (update) {
    request.setUpdate(update);
  }
  if (outputBranch) {
    request.setOutputBranch(outputBranch);
  }
  if (s3Out) {
    request.setS3Out(s3Out);
  }
  if (resourceRequests) {
    request.setResourceRequests(resourceSpecFromObject(resourceRequests));
  }
  if (resourceLimits) {
    request.setResourceLimits(resourceSpecFromObject(resourceLimits));
  }
  if (sidecarResourceLimits) {
    request.setSidecarResourceLimits(
      resourceSpecFromObject(sidecarResourceLimits),
    );
  }
  request.setInput(inputFromObject(input));
  if (description) {
    request.setDescription(description);
  }
  if (reprocess) {
    request.setReprocess(reprocess);
  }
  if (service) {
    request.setService(serviceFromObject(service));
  }
  if (spout) {
    request.setSpout(spoutFromObject(spout));
  }
  if (datumSetSpec) {
    // TODO: Check if this is the same
    request.setDatumSetSpec(chunkSpecFromObject(datumSetSpec));
  }
  if (datumTimeout) {
    request.setDatumTimeout(durationFromObject(datumTimeout));
  }
  if (jobTimeout) {
    request.setJobTimeout(durationFromObject(jobTimeout));
  }
  if (salt) {
    request.setSalt(salt);
  }
  if (datumTries) {
    request.setDatumTries(datumTries);
  }
  if (schedulingSpec) {
    request.setSchedulingSpec(schedulingSpecFromObject(schedulingSpec));
  }
  if (podSpec) {
    request.setPodSpec(podSpec);
  }
  if (podPatch) {
    request.setPodPatch(podPatch);
  }
  if (specCommit) {
    request.setSpecCommit(commitFromObject(specCommit));
  }
  if (metadata) {
    request.setMetadata(metadataFromObject(metadata));
  }
  if (reprocessSpec) {
    request.setReprocessSpec(reprocessSpec);
  }
  if (autoscaling) {
    request.setAutoscaling(autoscaling);
  }
  return request;
};

export const pipelineInfoFromObject = ({
  pipeline,
  version = 1,
  transform,
  tfJob,
  parallelismSpec,
  egress,
  createdAt,
  state = 0,
  stopped = false,
  recentError = '',
  workersRequested = 0,
  workersAvailable = 0,
  lastJobState = 0,
  outputBranch = 'master',
  resourceRequests,
  resourceLimits,
  sidecarResourceLimits,
  input,
  description = '',
  salt = '',
  reason = '',
  service,
  spout,
  chunkSpec,
  datumTimeout,
  jobTimeout,
  datumTries = 0,
  podSpec = '',
  podPatch = '',
  s3Out = false,
}: PipelineInfoObject) => {
  const pipelineInfo = new PipelineInfo();
  const details = new PipelineInfo.Details();

  if (pipeline) {
    pipelineInfo.setPipeline(pipelineFromObject(pipeline));
  }
  pipelineInfo.setVersion(version);
  if (transform) {
    details.setTransform(transformFromObject(transform));
  }
  if (tfJob) {
    details.setTfJob(tfJobFromObject(tfJob));
  }
  if (parallelismSpec) {
    details.setParallelismSpec(parallelismSpecFromObject(parallelismSpec));
  }
  if (egress) {
    details.setEgress(egressFromObject(egress));
  }
  if (createdAt) {
    details.setCreatedAt(timestampFromObject(createdAt));
  }

  pipelineInfo.setState(state);
  pipelineInfo.setStopped(stopped);
  pipelineInfo.setLastJobState(lastJobState);
  details.setRecentError(recentError);
  details.setWorkersRequested(workersRequested);
  details.setWorkersAvailable(workersAvailable);
  details.setOutputBranch(outputBranch);

  if (resourceRequests) {
    details.setResourceRequests(resourceSpecFromObject(resourceRequests));
  }
  if (resourceLimits) {
    details.setResourceLimits(resourceSpecFromObject(resourceLimits));
  }
  if (sidecarResourceLimits) {
    details.setSidecarResourceLimits(
      resourceSpecFromObject(sidecarResourceLimits),
    );
  }
  if (input) {
    details.setInput(inputFromObject(input));
  }
  if (service) {
    details.setService(serviceFromObject(service));
  }
  if (spout) {
    details.setSpout(spoutFromObject(spout));
  }
  if (chunkSpec) {
    details.setDatumSetSpec(chunkSpecFromObject(chunkSpec));
  }
  if (datumTimeout) {
    details.setDatumTimeout(durationFromObject(datumTimeout));
  }
  if (jobTimeout) {
    details.setJobTimeout(durationFromObject(jobTimeout));
  }

  details.setDescription(description);
  details.setSalt(salt);
  details.setDatumTries(datumTries);
  details.setPodSpec(podSpec);
  details.setPodPatch(podPatch);
  details.setS3Out(s3Out);
  pipelineInfo.setReason(reason);
  pipelineInfo.setDetails(details);

  return pipelineInfo;
};

export const pipelineInfosFromObject = ({
  pipelineInfoList,
}: PipelineInfosObject) => {
  const pipelineInfos = new PipelineInfos();
  if (pipelineInfoList) {
    const transformedPipelines = pipelineInfoList.map((item) => {
      return pipelineInfoFromObject(item);
    });
    pipelineInfos.setPipelineInfoList(transformedPipelines);
  }

  return pipelineInfos;
};

export const jobFromObject = ({id, pipeline}: JobObject) => {
  const job = new Job();
  job.setId(id);
  if (pipeline) {
    job.setPipeline(pipelineFromObject(pipeline));
  }

  return job;
};

export const jobSetFromObject = ({id}: JobSetObject) => {
  const jobSet = new JobSet();
  jobSet.setId(id);

  return jobSet;
};

export const datumFromObject = ({job, id}: DatumObject) => {
  const datum = new Datum();

  datum.setJob(jobFromObject(job));
  datum.setId(id);

  return datum;
};

export const processStatsFromObject = ({
  downloadTime,
  processTime,
  uploadTime,
  downloadBytes,
  uploadBytes,
}: ProcessStatsObject) => {
  const processStats = new ProcessStats();

  processStats.setDownloadTime(durationFromObject(downloadTime));
  processStats.setProcessTime(durationFromObject(processTime));
  processStats.setUploadTime(durationFromObject(uploadTime));
  processStats.setDownloadBytes(downloadBytes);
  processStats.setUploadBytes(uploadBytes);

  return processStats;
};

export const datumInfoFromObject = ({
  datum,
  state,
  stats,
  pfsState,
  data,
}: DatumInfoObject) => {
  const datumInfo = new DatumInfo();

  datumInfo.setDatum(datumFromObject(datum));
  datumInfo.setState(state);
  datumInfo.setStats(processStatsFromObject(stats));
  datumInfo.setPfsState(fileFromObject(pfsState));
  if (data) {
    const transformedData = data.map((eachData) => {
      return fileInfoFromObject(eachData);
    });
    datumInfo.setDataList(transformedData);
  }

  return datumInfo;
};

export const jobInfoFromObject = ({
  job: {id, pipeline: {name} = {name: ''}},
  createdAt,
  startedAt,
  finishedAt,
  state,
  input,
  outputCommit,
}: JobInfoObject) => {
  const jobInfo = new JobInfo()
    .setState(state)
    .setJob(new Job().setId(id).setPipeline(new Pipeline().setName(name)));

  if (createdAt) {
    jobInfo.setCreated(
      timestampFromObject({seconds: createdAt?.seconds || 0, nanos: 0}),
    );
  }

  if (startedAt) {
    jobInfo.setStarted(
      timestampFromObject({seconds: startedAt?.seconds || 0, nanos: 0}),
    );
  }

  if (finishedAt) {
    jobInfo.setFinished(
      timestampFromObject({seconds: finishedAt?.seconds || 0, nanos: 0}),
    );
  }

  if (input) {
    jobInfo.setDetails(new JobInfo.Details().setInput(inputFromObject(input)));
  }

  if (outputCommit) {
    jobInfo.setOutputCommit(commitFromObject(outputCommit));
  }

  return jobInfo;
};

export const getLogsRequestFromObject = ({
  pipelineName,
  jobId,
  since,
  follow = false,
}: GetLogsRequestObject) => {
  const getLogsRequest = new GetLogsRequest();
  getLogsRequest.setFollow(follow);

  if (pipelineName && jobId) {
    getLogsRequest.setJob(
      jobFromObject({
        id: jobId,
        pipeline: {name: pipelineName},
      }),
    );
  } else {
    if (pipelineName) {
      getLogsRequest.setPipeline(pipelineFromObject({name: pipelineName}));
    }
  }
  if (since) {
    getLogsRequest.setSince(durationFromObject({seconds: since, nanos: 0}));
  }
  return getLogsRequest;
};

export const inspectJobRequestFromObject = ({
  job,
  pipeline,
  wait = true,
  details = true,
}: InspectJobRequestObject) => {
  const request = new InspectJobRequest();

  if (job && pipeline) {
    request.setJob(
      jobFromObject(job).setPipeline(pipelineFromObject(pipeline)),
    );
  }

  request.setWait(wait);
  request.setDetails(details);

  return request;
};

export const inspectJobSetRequestFromObject = ({
  jobSet,
  wait = true,
  details = true,
}: InspectJobSetRequestObject) => {
  const request = new InspectJobSetRequest();

  if (jobSet) {
    request.setJobSet(jobSetFromObject(jobSet));
  }

  request.setWait(wait);
  request.setDetails(details);

  return request;
};

export const listJobRequestFromObject = ({
  pipeline,
  inputCommit,
  history = 0,
  details = true,
  jqfilter = '',
}: ListJobRequestObject) => {
  const request = new ListJobRequest();

  if (pipeline) {
    request.setPipeline(pipelineFromObject(pipeline));
  }
  if (inputCommit) {
    const transformedCommits = inputCommit.map((commit) => {
      return commitFromObject(commit);
    });
    request.setInputCommitList(transformedCommits);
  }

  request.setJqfilter(jqfilter);
  request.setHistory(history);
  request.setDetails(details);

  return request;
};

export const subscribeJobRequestFromObject = ({
  pipeline,
  details = true,
}: SubscribeJobRequestObject) => {
  const request = new SubscribeJobRequest();

  request.setPipeline(pipelineFromObject(pipeline));
  if (details) {
    request.setDetails(details);
  }
  return request;
};

export const stopJobRequestFromObject = ({
  job,
  reason = '',
}: StopJobRequestObject) => {
  const request = new StopJobRequest();

  request.setJob(jobFromObject(job));
  request.setReason(reason);

  return request;
};

export const listDatumRequestFromObject = ({
  job,
  input,
}: ListDatumRequestObject) => {
  const request = new ListDatumRequest();
  if (job !== undefined && input !== undefined) {
    // TODO: check if there is a better approach with Pick
    throw new Error('Only a job or an input can be set, got both');
  }

  if (job) {
    request.setJob(jobFromObject(job));
  }
  if (input) {
    request.setInput(inputFromObject(input));
  }
  return request;
};

export const restartDatumRequestFromObject = ({
  job,
  dataFilters,
}: RestartDatumRequestObject) => {
  const request = new RestartDatumRequest();

  request.setJob(jobFromObject(job));
  if (dataFilters) {
    request.setDataFiltersList(dataFilters);
  }

  return request;
};

export const deletePipelineRequestFromObject = ({
  pipeline,
  all = false,
  force = false,
  keepRepo = false,
}: DeletePipelineRequestObject) => {
  const request = new DeletePipelineRequest();

  request.setPipeline(pipelineFromObject(pipeline));
  request.setAll(all);
  request.setForce(force);
  request.setKeepRepo(keepRepo);

  return request;
};

export const createSecretRequestFromObject = ({
  name,
  data,
  labels,
  annotations,
}: CreateSecretRequestObject) => {
  const request = new CreateSecretRequest();

  const encodedData: any = {};
  Object.keys(JSON.parse(Buffer.from(data).toString('utf8'))).forEach(
    (key: any) => {
      encodedData[key] = Buffer.from(data[key].toString()).toString('base64');
    },
  );
  const file = JSON.stringify({
    kind: `Secret`,
    apiVersion: `v1`,
    metadata: {
      name: `${name}`,
      labels: `${labels}`,
      annotations: `${annotations}`,
    },
    data: `${encodedData}`,
  });

  request.setFile(file);

  return request;
};

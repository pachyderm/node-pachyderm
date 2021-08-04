import {
  DatumState,
  ProcessStats,
  RestartDatumRequest,
} from '@pachyderm/proto/pb/pps/pps_pb';
import {
  chunkSpecFromObject,
  cronInputFromObject,
  egressFromObject,
  gpuSpecFromObject,
  inputFromObject,
  parallelismSpecFromObject,
  pfsInputFromObject,
  pipelineFromObject,
  pipelineInfoFromObject,
  pipelineInfosFromObject,
  resourceSpecFromObject,
  secretMountFromObject,
  serviceFromObject,
  spoutFromObject,
  tfJobFromObject,
  transformFromObject,
  jobInfoFromObject,
  jobFromObject,
  getLogsRequestFromObject,
  inspectJobRequestFromObject,
  inspectJobSetRequestFromObject,
  listJobRequestFromObject,
  subscribeJobRequestFromObject,
  stopJobRequestFromObject,
  datumFromObject,
  processStatsFromObject,
  datumInfoFromObject,
  listDatumRequestFromObject,
  restartDatumRequestFromObject,
  createPipelineRequestFromObject,
  inspectPipelineRequestFromObject,
  listPipelineRequestFromObject,
  deletePipelineRequestFromObject,
} from '../pps';

describe('grpc/builders/pps', () => {
  it('should create Pipeline from an object', () => {
    const pipeline = pipelineFromObject({
      name: 'testPipeline',
    });

    expect(pipeline.getName()).toBe('testPipeline');
  });

  it('should create SecretMount from an object', () => {
    const secretMount = secretMountFromObject({
      name: 'testSecret',
      key: 'test',
      mountPath: '/test',
      envVar: 'testVar',
    });

    expect(secretMount.getName()).toBe('testSecret');
    expect(secretMount.getKey()).toBe('test');
    expect(secretMount.getMountPath()).toBe('/test');
    expect(secretMount.getEnvVar()).toBe('testVar');
  });

  it('should create Transform from an object', () => {
    const transform = transformFromObject({
      image: 'pachyderm/opencv',
      cmdList: ['python3', '/edges.py'],
      errCmdList: ['python3', '/error.py'],
      secretsList: [
        {
          name: 'testSecret',
          key: 'test',
          mountPath: '/test',
          envVar: 'testVar',
        },
      ],
      imagePullSecretsList: ['asdkldsfsdf'],
      stdinList: ['python2', '/test.py'],
      errStdinList: ['python2', '/error.py'],
      acceptReturnCodeList: [2, 4],
      debug: true,
      user: 'peter',
      workingDir: '/test',
      dockerfile: 'docker',
    });

    expect(transform.getImage()).toBe('pachyderm/opencv');
    expect(transform.getCmdList()).toStrictEqual(['python3', '/edges.py']);
    expect(transform.getErrCmdList()).toStrictEqual(['python3', '/error.py']);
    expect(transform.getSecretsList()[0]?.getName()).toEqual('testSecret');
    expect(transform.getSecretsList()[0]?.getKey()).toEqual('test');
    expect(transform.getSecretsList()[0]?.getMountPath()).toEqual('/test');
    expect(transform.getSecretsList()[0]?.getEnvVar()).toEqual('testVar');
    expect(transform.getImagePullSecretsList()).toStrictEqual(['asdkldsfsdf']);
    expect(transform.getStdinList()).toStrictEqual(['python2', '/test.py']);
    expect(transform.getErrStdinList()).toStrictEqual(['python2', '/error.py']);
    expect(transform.getAcceptReturnCodeList()).toStrictEqual([2, 4]);
    expect(transform.getDebug()).toBe(true);
    expect(transform.getUser()).toBe('peter');
    expect(transform.getWorkingDir()).toBe('/test');
  });

  it('should create Transform from an object with defaults', () => {
    const transform = transformFromObject({
      image: 'pachyderm/opencv',
      cmdList: ['python3', '/edges.py'],
    });

    expect(transform.getImage()).toBe('pachyderm/opencv');
    expect(transform.getCmdList()).toStrictEqual(['python3', '/edges.py']);
    expect(transform.getErrCmdList()).toStrictEqual([]);
    expect(transform.getSecretsList()).toStrictEqual([]);
    expect(transform.getImagePullSecretsList()).toStrictEqual([]);
    expect(transform.getStdinList()).toStrictEqual([]);
    expect(transform.getErrStdinList()).toStrictEqual([]);
    expect(transform.getAcceptReturnCodeList()).toStrictEqual([]);
    expect(transform.getDebug()).toBe(false);
    expect(transform.getUser()).toBe('');
    expect(transform.getWorkingDir()).toBe('');
  });

  it('should create TFJob from an object', () => {
    const tfJob = tfJobFromObject({
      tfJob: 'example-job',
    });

    expect(tfJob.getTfJob()).toBe('example-job');
  });

  it('should create ParallelismSpec from an object', () => {
    const parallelismSpec = parallelismSpecFromObject({
      constant: 1,
    });

    expect(parallelismSpec.getConstant()).toBe(1);
  });

  it('should create Egress from an object', () => {
    const egress = egressFromObject({
      url: 's3://bucket/dir',
    });

    expect(egress.getUrl()).toBe('s3://bucket/dir');
  });

  it('should create GPUSpec from an object', () => {
    const gpuSpec = gpuSpecFromObject({
      type: 'good',
      number: 3,
    });

    expect(gpuSpec.getType()).toBe('good');
    expect(gpuSpec.getNumber()).toBe(3);
  });

  it('should create ResourceSpec from an object', () => {
    const resourceSpec = resourceSpecFromObject({
      cpu: 8,
      memory: '12mb',
      gpu: {type: 'good', number: 3},
      disk: '2t',
    });

    expect(resourceSpec.getCpu()).toBe(8);
    expect(resourceSpec.getMemory()).toBe('12mb');
    expect(resourceSpec.getGpu()?.getType()).toBe('good');
    expect(resourceSpec.getGpu()?.getNumber()).toBe(3);
    expect(resourceSpec.getDisk()).toBe('2t');
  });

  it('should create PFSInput from an object with defaults', () => {
    const pfsInput = pfsInputFromObject({
      name: 'images',
      repo: 'imagesRepo',
      branch: 'master',
      commit: 'uweioruwejrij098w0e9r809we',
      glob: '/test/*',
      joinOn: 'test',
      outerJoin: true,
      groupBy: 'name',
      lazy: true,
      emptyFiles: true,
      s3: true,
      trigger: {
        branch: 'master',
        all: true,
        cronSpec: '@every 10s',
        size: 'big',
        commits: 12,
      },
    });

    expect(pfsInput.getName()).toBe('images');
    expect(pfsInput.getRepo()).toBe('imagesRepo');
    expect(pfsInput.getBranch()).toBe('master');
    expect(pfsInput.getCommit()).toBe('uweioruwejrij098w0e9r809we');
    expect(pfsInput.getGlob()).toBe('/test/*');
    expect(pfsInput.getJoinOn()).toBe('test');
    expect(pfsInput.getOuterJoin()).toBe(true);
    expect(pfsInput.getGroupBy()).toBe('name');
    expect(pfsInput.getLazy()).toBe(true);
    expect(pfsInput.getEmptyFiles()).toBe(true);
    expect(pfsInput.getS3()).toBe(true);
    expect(pfsInput.getTrigger()?.getBranch()).toBe('master');
    expect(pfsInput.getTrigger()?.getAll()).toBe(true);
    expect(pfsInput.getTrigger()?.getCronSpec()).toBe('@every 10s');
    expect(pfsInput.getTrigger()?.getSize()).toBe('big');
    expect(pfsInput.getTrigger()?.getCommits()).toBe(12);
  });

  it('should create PFSInput from an object', () => {
    const pfsInput = pfsInputFromObject({
      name: 'images',
      repo: 'imagesRepo',
      branch: 'master',
      commit: 'uweioruwejrij098w0e9r809we',
      glob: '/test/*',
      joinOn: 'test',
      outerJoin: true,
      groupBy: 'name',
      lazy: true,
      emptyFiles: true,
      s3: true,
      trigger: {
        branch: 'master',
        all: true,
        cronSpec: '@every 10s',
        size: 'big',
        commits: 12,
      },
    });

    expect(pfsInput.getName()).toBe('images');
    expect(pfsInput.getRepo()).toBe('imagesRepo');
    expect(pfsInput.getBranch()).toBe('master');
    expect(pfsInput.getCommit()).toBe('uweioruwejrij098w0e9r809we');
    expect(pfsInput.getGlob()).toBe('/test/*');
    expect(pfsInput.getJoinOn()).toBe('test');
    expect(pfsInput.getOuterJoin()).toBe(true);
    expect(pfsInput.getGroupBy()).toBe('name');
    expect(pfsInput.getLazy()).toBe(true);
    expect(pfsInput.getEmptyFiles()).toBe(true);
    expect(pfsInput.getS3()).toBe(true);
    expect(pfsInput.getTrigger()?.getBranch()).toBe('master');
    expect(pfsInput.getTrigger()?.getAll()).toBe(true);
    expect(pfsInput.getTrigger()?.getCronSpec()).toBe('@every 10s');
    expect(pfsInput.getTrigger()?.getSize()).toBe('big');
    expect(pfsInput.getTrigger()?.getCommits()).toBe(12);
  });

  it('should create CronInput from an object', () => {
    const cronInput = cronInputFromObject({
      name: 'images',
      repo: 'imagesRepo',
      commit: 'uweioruwejrij098w0e9r809we',
      spec: '*/10 * * * *',
      overwrite: true,
      start: {
        seconds: 1614736724,
        nanos: 344218476,
      },
    });

    expect(cronInput.getName()).toBe('images');
    expect(cronInput.getRepo()).toBe('imagesRepo');
    expect(cronInput.getCommit()).toBe('uweioruwejrij098w0e9r809we');
    expect(cronInput.getSpec()).toBe('*/10 * * * *');
    expect(cronInput.getOverwrite()).toBe(true);
    expect(cronInput.getStart()?.getSeconds()).toBe(1614736724);
    expect(cronInput.getStart()?.getNanos()).toBe(344218476);
  });

  it('should create Input from an object', () => {
    const input = inputFromObject({
      pfs: {
        name: 'imagesPfs',
        repo: 'imagesRepo',
        branch: 'master',
      },
      joinList: [
        {
          pfs: {
            name: 'joinList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      groupList: [
        {
          pfs: {
            name: 'groupList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      crossList: [
        {
          pfs: {
            name: 'crossList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      unionList: [
        {
          pfs: {
            name: 'unionList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],

      cron: {
        name: 'imagesCron',
        repo: 'imagesRepo',
        commit: 'uweioruwejrij098w0e9r809we',
        spec: '*/10 * * * *',
        overwrite: true,
      },
    });

    expect(input.getPfs()?.getName()).toBe('imagesPfs');
    expect(input.getCron()?.getName()).toBe('imagesCron');

    expect(input.getJoinList()[0]?.getPfs()?.getName()).toBe('joinList');
    expect(input.getGroupList()[0]?.getPfs()?.getName()).toBe('groupList');
    expect(input.getCrossList()[0]?.getPfs()?.getName()).toBe('crossList');
    expect(input.getUnionList()[0]?.getPfs()?.getName()).toBe('unionList');
  });

  it('should create Service from an object', () => {
    const service = serviceFromObject({
      internalPort: 8888,
      externalPort: 30888,
      ip: '172.16.254.1',
      type: 'good',
    });

    expect(service.getInternalPort()).toBe(8888);
    expect(service.getExternalPort()).toBe(30888);
    expect(service.getIp()).toBe('172.16.254.1');
    expect(service.getType()).toBe('good');
  });

  it('should create Spout from an object', () => {
    const spout = spoutFromObject({
      service: {
        internalPort: 8888,
        externalPort: 30888,
        ip: '172.16.254.1',
        type: 'good',
      },
    });

    expect(spout.getService()?.getIp()).toBe('172.16.254.1');
  });

  it('should create ChunkSpec from an object', () => {
    const chunkSpec = chunkSpecFromObject({
      number: 123,
      sizeBytes: 23498769,
    });

    expect(chunkSpec.getNumber()).toBe(123);
    expect(chunkSpec.getSizeBytes()).toBe(23498769);
  });

  it('should create PipelineInfo from an object with defaults', () => {
    const pipelineInfo = pipelineInfoFromObject({
      pipeline: {
        name: 'testPipeline',
      },
    });

    expect(pipelineInfo.getPipeline()?.getName()).toBe('testPipeline');
    expect(pipelineInfo.getVersion()).toBe(1);
    expect(pipelineInfo.getState()).toBe(0);
    expect(pipelineInfo.getStopped()).toBe(false);
    expect(pipelineInfo.getLastJobState()).toBe(0);
    expect(pipelineInfo.getDetails()?.getTransform()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getTfJob()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getParallelismSpec()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getEgress()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getCreatedAt()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getRecentError()).toBe('');
    expect(pipelineInfo.getDetails()?.getWorkersRequested()).toBe(0);
    expect(pipelineInfo.getDetails()?.getWorkersAvailable()).toBe(0);
    expect(pipelineInfo.getDetails()?.getOutputBranch()).toBe('master');
    expect(pipelineInfo.getDetails()?.getResourceRequests()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getResourceLimits()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getSidecarResourceLimits()).toBe(
      undefined,
    );
    expect(pipelineInfo.getDetails()?.getInput()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getDescription()).toBe('');
    expect(pipelineInfo.getDetails()?.getSalt()).toBe('');
    expect(pipelineInfo.getDetails()?.getReason()).toBe('');
    expect(pipelineInfo.getDetails()?.getService()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getSpout()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getDatumSetSpec()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getDatumTimeout()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getJobTimeout()).toBe(undefined);
    expect(pipelineInfo.getDetails()?.getDatumTries()).toBe(0);
    expect(pipelineInfo.getDetails()?.getPodSpec()).toBe('');
    expect(pipelineInfo.getDetails()?.getPodPatch()).toBe('');
    expect(pipelineInfo.getDetails()?.getS3Out()).toBe(false);
  });

  it('should create PipelineInfo from an object with defaults', () => {
    const pipelineInfo = pipelineInfoFromObject({
      pipeline: {
        name: 'testPipeline',
      },
      version: 4,
      transform: {
        image: 'pachyderm/opencv',
        cmdList: ['python3', '/edges.py'],
      },
      tfJob: {tfJob: 'example-job'},
      parallelismSpec: {
        constant: 1,
      },
      egress: {
        url: 's3://bucket/dir',
      },
      createdAt: {
        seconds: 1614736724,
        nanos: 344218476,
      },
      state: 3,
      stopped: true,
      recentError: 'err',
      workersRequested: 23,
      workersAvailable: 2,
      lastJobState: 3,
      outputBranch: 'testBranch',
      resourceRequests: {
        cpu: 8,
        memory: '12mb',
        gpu: {type: 'good', number: 3},
        disk: '2t',
      },
      resourceLimits: {
        cpu: 5,
        memory: '12mb',
        gpu: {type: 'good', number: 3},
        disk: '2t',
      },
      sidecarResourceLimits: {
        cpu: 12,
        memory: '12mb',
        gpu: {type: 'good', number: 3},
        disk: '2t',
      },
      input: {
        pfs: {
          name: 'imagesPfs',
          repo: 'imagesRepo',
          branch: 'master',
        },
      },
      description: 'yo yo yo!',
      salt: 'd5631d7df40d4b1195bc46f1f146d6a5',
      reason: 'because',
      service: {
        internalPort: 8888,
        externalPort: 30888,
        ip: '172.16.254.1',
        type: 'good',
      },
      spout: {
        service: {
          internalPort: 8888,
          externalPort: 30888,
          ip: '172.16.254.1',
          type: 'good',
        },
      },
      chunkSpec: {
        number: 123,
        sizeBytes: 23498769,
      },
      datumTimeout: {
        seconds: 23424,
        nanos: 254345,
      },
      jobTimeout: {
        seconds: 564645,
        nanos: 867867,
      },
      specCommit: {
        branch: {name: '', repo: {name: '__spec__'}},
        id: '4af40d34a0384f23a5b98d3bd7eaece1',
      },
      datumTries: 12,
      podSpec: 'podSpec',
      podPatch: 'podPatch',
      s3Out: true,
    });

    expect(pipelineInfo.getPipeline()?.getName()).toBe('testPipeline');
    expect(pipelineInfo.getVersion()).toBe(4);
    expect(pipelineInfo.getState()).toBe(3);
    expect(pipelineInfo.getStopped()).toBe(true);
    expect(pipelineInfo.getLastJobState()).toBe(3);
    expect(pipelineInfo.getDetails()?.getTransform()?.getImage()).toBe(
      'pachyderm/opencv',
    );
    expect(pipelineInfo.getDetails()?.getTfJob()?.getTfJob()).toBe(
      'example-job',
    );
    expect(pipelineInfo.getDetails()?.getEgress()?.getUrl()).toBe(
      's3://bucket/dir',
    );
    expect(pipelineInfo.getDetails()?.getCreatedAt()?.getSeconds()).toBe(
      1614736724,
    );
    expect(pipelineInfo.getDetails()?.getRecentError()).toBe('err');
    expect(pipelineInfo.getDetails()?.getWorkersRequested()).toBe(23);
    expect(pipelineInfo.getDetails()?.getWorkersAvailable()).toBe(2);
    expect(pipelineInfo.getDetails()?.getOutputBranch()).toBe('testBranch');
    expect(pipelineInfo.getDetails()?.getResourceRequests()?.getCpu()).toBe(8);
    expect(pipelineInfo.getDetails()?.getResourceLimits()?.getCpu()).toBe(5);
    expect(
      pipelineInfo.getDetails()?.getSidecarResourceLimits()?.getCpu(),
    ).toBe(12);
    expect(pipelineInfo.getDetails()?.getInput()?.getPfs()?.getName()).toBe(
      'imagesPfs',
    );
    expect(pipelineInfo.getDetails()?.getDescription()).toBe('yo yo yo!');
    expect(pipelineInfo.getDetails()?.getSalt()).toBe(
      'd5631d7df40d4b1195bc46f1f146d6a5',
    );
    expect(pipelineInfo.getReason()).toBe('because');
    expect(pipelineInfo.getDetails()?.getService()?.getIp()).toBe(
      '172.16.254.1',
    );
    expect(pipelineInfo.getDetails()?.getDatumSetSpec()?.getNumber()).toBe(123);
    expect(pipelineInfo.getDetails()?.getDatumTimeout()?.getSeconds()).toBe(
      23424,
    );
    expect(pipelineInfo.getDetails()?.getJobTimeout()?.getSeconds()).toBe(
      564645,
    );
    expect(pipelineInfo.getDetails()?.getDatumTries()).toBe(12);
    expect(pipelineInfo.getDetails()?.getPodSpec()).toBe('podSpec');
    expect(pipelineInfo.getDetails()?.getPodPatch()).toBe('podPatch');
    expect(pipelineInfo.getDetails()?.getS3Out()).toBe(true);
  });

  it('should create PipelineInfos from an object', () => {
    const pipelineInfos = pipelineInfosFromObject({
      pipelineInfoList: [
        {
          pipeline: {
            name: 'pipeline_one',
          },
        },
        {
          pipeline: {
            name: 'pipeline_two',
          },
        },
      ],
    });

    expect(
      pipelineInfos.getPipelineInfoList()[0]?.getPipeline()?.getName(),
    ).toBe('pipeline_one');
    expect(
      pipelineInfos.getPipelineInfoList()[1]?.getPipeline()?.getName(),
    ).toBe('pipeline_two');
  });
});

it('should create PipelineJob from an object', () => {
  const pipelineJob = jobFromObject({id: '23efw4ef098few0'});

  expect(pipelineJob.getId()).toBe('23efw4ef098few0');
});

it('should create JobInfo from an object', () => {
  const pipelineJob = jobInfoFromObject({
    state: 1,
    job: {id: '1', pipeline: {name: 'montage'}},
    createdAt: {
      seconds: 564645,
      nanos: 0,
    },
    startedAt: {
      seconds: 10000,
      nanos: 0,
    },
    finishedAt: {
      seconds: 20000,
      nanos: 0,
    },
    outputCommit: {
      branch: {
        name: 'development',
        repo: {
          name: 'test',
        },
      },
      id: '123',
    },
  });

  expect(pipelineJob.getState()).toBe(1);
  expect(pipelineJob.getCreated()?.getSeconds()).toBe(564645);
  expect(pipelineJob.getStarted()?.getSeconds()).toBe(10000);
  expect(pipelineJob.getFinished()?.getSeconds()).toBe(20000);
  expect(pipelineJob.getJob()?.getId()).toBe('1');
  expect(pipelineJob.getOutputCommit()?.getBranch()?.getName()).toBe(
    'development',
  );
  expect(pipelineJob.getOutputCommit()?.getBranch()?.getRepo()?.getName()).toBe(
    'test',
  );
  expect(pipelineJob.getOutputCommit()?.getId()).toBe('123');
});

it('should create GetLogsRequestObject from a pipeline request', () => {
  const getLogsRequest = getLogsRequestFromObject({
    pipelineName: 'PipelineName',
    since: 564645,
    follow: true,
  });

  expect(getLogsRequest.getPipeline()?.getName()).toBe('PipelineName');
  expect(getLogsRequest.getJob()).toBe(undefined);
  expect(getLogsRequest.getSince()?.getSeconds()).toBe(564645);
  expect(getLogsRequest.getFollow()).toBe(true);
});

it('should create GetLogsRequestObject from a job request', () => {
  const getLogsRequest = getLogsRequestFromObject({
    pipelineName: 'PipelineName',
    jobId: '2222222',
    since: 564645,
    follow: true,
  });

  expect(getLogsRequest.getPipeline()).toBe(undefined);
  expect(getLogsRequest.getJob()?.getId()).toBe('2222222');
  expect(getLogsRequest.getJob()?.getPipeline()?.getName()).toBe(
    'PipelineName',
  );
  expect(getLogsRequest.getSince()?.getSeconds()).toBe(564645);
  expect(getLogsRequest.getFollow()).toBe(true);
});

it('should create a Datum from an object', () => {
  const datumObject = datumFromObject({
    job: {
      id: '23efw4ef098few0',
      pipeline: {name: 'edges'},
    },
    id: '63d8d0fc65594c38980686b91b052293',
  });
  expect(datumObject.getJob()?.getId()).toBe('23efw4ef098few0');
  expect(datumObject.getJob()?.getPipeline()?.getName()).toBe('edges');
  expect(datumObject.getId()).toBe('63d8d0fc65594c38980686b91b052293');
});

it('should create a ProcessStats from an object', () => {
  const processStats = processStatsFromObject({
    downloadTime: {
      seconds: 1614736724,
      nanos: 344218476,
    },
    processTime: {
      seconds: 1614736724,
      nanos: 344218476,
    },
    uploadTime: {
      seconds: 1614736724,
      nanos: 344218476,
    },
    downloadBytes: 9000,
    uploadBytes: 9001,
  });
  expect(processStats.getDownloadTime()?.getSeconds()).toBe(1614736724);
  expect(processStats.getDownloadTime()?.getNanos()).toBe(344218476);
  expect(processStats.getProcessTime()?.getSeconds()).toBe(1614736724);
  expect(processStats.getProcessTime()?.getNanos()).toBe(344218476);
  expect(processStats.getUploadTime()?.getSeconds()).toBe(1614736724);
  expect(processStats.getUploadTime()?.getNanos()).toBe(344218476);
  expect(processStats.getDownloadBytes()).toBe(9000);
  expect(processStats.getUploadBytes()).toBe(9001);
});

it('should create DatumInfo from an object', () => {
  const datumInfo = datumInfoFromObject({
    datum: {
      job: {
        id: '23efw4ef098few0',
        pipeline: {name: 'edges'},
      },
      id: '63d8d0fc65594c38980686b91b052293',
    },
    state: DatumState.SKIPPED,
    stats: {
      downloadTime: {
        seconds: 1614736724,
        nanos: 344218476,
      },
      processTime: {
        seconds: 1614736724,
        nanos: 344218476,
      },
      uploadTime: {
        seconds: 1614736724,
        nanos: 344218476,
      },
      downloadBytes: 9000,
      uploadBytes: 9001,
    },
    pfsState: {
      branch: {name: 'master', repo: {name: 'neato'}},
      path: '/assets',
    },
    data: [
      {
        committed: {
          seconds: 1615922718,
          nanos: 449796812,
        },
        file: {
          commitId: '1234567890',
          path: '/assets',
          branch: {name: 'master', repo: {name: 'neato'}},
        },
        fileType: 2,
        hash: 'abcde12345',
        sizeBytes: 123,
      },
    ],
  });
  expect(datumInfo.getDatum()?.getJob()?.getId()).toBe('23efw4ef098few0');
  expect(datumInfo.getDatum()?.getJob()?.getPipeline()?.getName()).toBe(
    'edges',
  );
  expect(datumInfo.getDatum()?.getId()).toBe(
    '63d8d0fc65594c38980686b91b052293',
  );
  expect(datumInfo.getState()).toBe(3);
  expect(datumInfo.getStats()?.getDownloadTime()?.getSeconds()).toBe(
    1614736724,
  );
  expect(datumInfo.getStats()?.getDownloadTime()?.getNanos()).toBe(344218476);
  expect(datumInfo.getStats()?.getProcessTime()?.getSeconds()).toBe(1614736724);
  expect(datumInfo.getStats()?.getProcessTime()?.getNanos()).toBe(344218476);
  expect(datumInfo.getStats()?.getUploadTime()?.getSeconds()).toBe(1614736724);
  expect(datumInfo.getStats()?.getUploadTime()?.getNanos()).toBe(344218476);
  expect(datumInfo.getStats()?.getDownloadBytes()).toBe(9000);
  expect(datumInfo.getStats()?.getUploadBytes()).toBe(9001);
  expect(datumInfo.getPfsState()?.getCommit()?.getBranch()?.getName()).toBe(
    'master',
  );
  expect(
    datumInfo.getPfsState()?.getCommit()?.getBranch()?.getRepo()?.getName(),
  ).toBe('neato');
  expect(datumInfo.getPfsState()?.getPath()).toBe('/assets');
  expect(datumInfo.getDataList()[0]?.getCommitted()?.getSeconds()).toBe(
    1615922718,
  );
  expect(datumInfo.getDataList()[0]?.getCommitted()?.getNanos()).toBe(
    449796812,
  );
  expect(datumInfo.getDataList()[0].getFile()?.getPath()).toBe('/assets');
  expect(datumInfo.getDataList()[0].getFile()?.getCommit()?.getId()).toBe(
    '1234567890',
  );
  expect(
    datumInfo.getDataList()[0].getFile()?.getCommit()?.getBranch()?.getName(),
  ).toBe('master');
  expect(
    datumInfo
      .getDataList()[0]
      .getFile()
      ?.getCommit()
      ?.getBranch()
      ?.getRepo()
      ?.getName(),
  ).toBe('neato');
  expect(datumInfo.getDataList()[0].getFileType()).toBe(2);
  expect(datumInfo.getDataList()[0].getHash()).toBe('abcde12345');
  expect(datumInfo.getDataList()[0].getSizeBytes()).toBe(123);
});

it('should create ListDatumRequest from an object with job specified', () => {
  const listDatumRequest = listDatumRequestFromObject({
    job: {
      id: '23efw4ef098few0',
      pipeline: {name: 'edges'},
    },
  });
  expect(listDatumRequest.getJob()?.getId()).toBe('23efw4ef098few0');
  expect(listDatumRequest.getJob()?.getPipeline()?.getName()).toBe('edges');
});

it('should create ListDatumRequest from an object with input specified', () => {
  const listDatumRequest = listDatumRequestFromObject({
    input: {
      pfs: {
        name: 'imagesPfs',
        repo: 'imagesRepo',
        branch: 'master',
      },
      joinList: [
        {
          pfs: {
            name: 'joinList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      groupList: [
        {
          pfs: {
            name: 'groupList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      crossList: [
        {
          pfs: {
            name: 'crossList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      unionList: [
        {
          pfs: {
            name: 'unionList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      cron: {
        name: 'imagesCron',
        repo: 'imagesRepo',
        commit: 'uweioruwejrij098w0e9r809we',
        spec: '*/10 * * * *',
        overwrite: true,
      },
    },
  });
  expect(listDatumRequest.getInput()?.getPfs()?.getName()).toBe('imagesPfs');
  expect(listDatumRequest.getInput()?.getCron()?.getName()).toBe('imagesCron');

  expect(
    listDatumRequest.getInput()?.getJoinList()[0]?.getPfs()?.getName(),
  ).toBe('joinList');
  expect(
    listDatumRequest.getInput()?.getGroupList()[0]?.getPfs()?.getName(),
  ).toBe('groupList');
  expect(
    listDatumRequest.getInput()?.getCrossList()[0]?.getPfs()?.getName(),
  ).toBe('crossList');
  expect(
    listDatumRequest.getInput()?.getUnionList()[0]?.getPfs()?.getName(),
  ).toBe('unionList');
});

it('should create RestartDatumRequest from an object', () => {
  const restartDatumRequest = restartDatumRequestFromObject({
    job: {
      id: '63d8d0fc65594c38980686b91b052293',
      pipeline: {name: 'edges'},
    },
    dataFilters: ['/liberty.png'],
  });
  expect(restartDatumRequest.getJob()?.getId()).toBe(
    '63d8d0fc65594c38980686b91b052293',
  );
  expect(restartDatumRequest.getJob()?.getPipeline()?.getName()).toBe('edges');
  expect(restartDatumRequest.getDataFiltersList()[0]).toBe('/liberty.png');
});

it('should create CreatePipelineRequest from an object with defaults', () => {
  const createPipelineRequest = createPipelineRequestFromObject({
    pipeline: {
      name: 'edges',
    },
    transform: {
      image: 'pachyderm/opencv',
      cmdList: ['python3', '/edges.py'],
    },
    input: {
      pfs: {
        name: 'imagesPfs',
        repo: 'imagesRepo',
        branch: 'master',
      },
      joinList: [
        {
          pfs: {
            name: 'joinList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      groupList: [
        {
          pfs: {
            name: 'groupList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      crossList: [
        {
          pfs: {
            name: 'crossList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      unionList: [
        {
          pfs: {
            name: 'unionList',
            repo: 'imagesRepo',
            branch: 'master',
          },
        },
      ],
      cron: {
        name: 'imagesCron',
        repo: 'imagesRepo',
        commit: 'uweioruwejrij098w0e9r809we',
        spec: '*/10 * * * *',
        overwrite: true,
      },
    },
  });

  expect(createPipelineRequest.getPipeline()?.getName()).toBe('edges');
  expect(createPipelineRequest.getTransform()?.getImage()).toBe(
    'pachyderm/opencv',
  );
  expect(createPipelineRequest.getTransform()?.getCmdList()).toStrictEqual([
    'python3',
    '/edges.py',
  ]);
  expect(createPipelineRequest.getTransform()?.getErrCmdList()).toStrictEqual(
    [],
  );
  expect(createPipelineRequest.getTransform()?.getSecretsList()).toStrictEqual(
    [],
  );
  expect(
    createPipelineRequest.getTransform()?.getImagePullSecretsList(),
  ).toStrictEqual([]);
  expect(createPipelineRequest.getTransform()?.getStdinList()).toStrictEqual(
    [],
  );
  expect(createPipelineRequest.getTransform()?.getErrStdinList()).toStrictEqual(
    [],
  );
  expect(
    createPipelineRequest.getTransform()?.getAcceptReturnCodeList(),
  ).toStrictEqual([]);
  expect(createPipelineRequest.getTransform()?.getDebug()).toBe(false);
  expect(createPipelineRequest.getTransform()?.getUser()).toBe('');
  expect(createPipelineRequest.getTransform()?.getWorkingDir()).toBe('');
  expect(createPipelineRequest.getInput()?.getPfs()?.getName()).toBe(
    'imagesPfs',
  );
  expect(createPipelineRequest.getInput()?.getCron()?.getName()).toBe(
    'imagesCron',
  );
  expect(
    createPipelineRequest.getInput()?.getJoinList()[0]?.getPfs()?.getName(),
  ).toBe('joinList');
  expect(
    createPipelineRequest.getInput()?.getGroupList()[0]?.getPfs()?.getName(),
  ).toBe('groupList');
  expect(
    createPipelineRequest.getInput()?.getCrossList()[0]?.getPfs()?.getName(),
  ).toBe('crossList');
  expect(
    createPipelineRequest.getInput()?.getUnionList()[0]?.getPfs()?.getName(),
  ).toBe('unionList');
  expect(createPipelineRequest.getTfJob()).toBe(undefined);
  expect(createPipelineRequest.getParallelismSpec()?.getConstant()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getEgress()?.getUrl()).toBe(undefined);
  expect(createPipelineRequest.getUpdate()).toBe(false);
  expect(createPipelineRequest.getOutputBranch()).toBe('');
  expect(createPipelineRequest.getS3Out()).toBe(false);
  expect(createPipelineRequest.getResourceRequests()?.getCpu()).toBe(undefined);
  expect(createPipelineRequest.getResourceRequests()?.getMemory()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getResourceRequests()?.getGpu()?.getType()).toBe(
    undefined,
  );
  expect(
    createPipelineRequest.getResourceRequests()?.getGpu()?.getNumber(),
  ).toBe(undefined);
  expect(createPipelineRequest.getResourceRequests()?.getDisk()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getResourceLimits()?.getCpu()).toBe(undefined);
  expect(createPipelineRequest.getResourceLimits()?.getMemory()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getResourceLimits()?.getGpu()?.getType()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getResourceLimits()?.getGpu()?.getNumber()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getResourceLimits()?.getDisk()).toBe(undefined);
  expect(createPipelineRequest.getSidecarResourceLimits()?.getCpu()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getSidecarResourceLimits()?.getMemory()).toBe(
    undefined,
  );
  expect(
    createPipelineRequest.getSidecarResourceLimits()?.getGpu()?.getType(),
  ).toBe(undefined);
  expect(
    createPipelineRequest.getSidecarResourceLimits()?.getGpu()?.getNumber(),
  ).toBe(undefined);
  expect(createPipelineRequest.getSidecarResourceLimits()?.getDisk()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getDescription()).toBe('');
  expect(createPipelineRequest.getReprocess()).toBe(false);
  expect(createPipelineRequest.getService()?.getInternalPort()).toBe(undefined);
  expect(createPipelineRequest.getService()?.getExternalPort()).toBe(undefined);
  expect(createPipelineRequest.getService()?.getIp()).toBe(undefined);
  expect(createPipelineRequest.getService()?.getType()).toBe(undefined);
  expect(
    createPipelineRequest.getSpout()?.getService()?.getInternalPort(),
  ).toBe(undefined);
  expect(
    createPipelineRequest.getSpout()?.getService()?.getExternalPort(),
  ).toBe(undefined);
  expect(createPipelineRequest.getSpout()?.getService()?.getIp()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getSpout()?.getService()?.getType()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getDatumSetSpec()?.getNumber()).toBe(undefined);
  expect(createPipelineRequest.getDatumSetSpec()?.getSizeBytes()).toBe(
    undefined,
  );
  expect(createPipelineRequest.getDatumTimeout()?.getSeconds()).toBe(undefined);
  expect(createPipelineRequest.getDatumTimeout()?.getNanos()).toBe(undefined);
  expect(createPipelineRequest.getJobTimeout()?.getSeconds()).toBe(undefined);
  expect(createPipelineRequest.getJobTimeout()?.getNanos()).toBe(undefined);
  expect(createPipelineRequest.getSalt()).toBe('');
  expect(createPipelineRequest.getDatumTries()).toBe(0);
  expect(
    createPipelineRequest.getSchedulingSpec()?.getPriorityClassName(),
  ).toBe(undefined);
  expect(createPipelineRequest.getPodSpec()).toBe('');
  expect(createPipelineRequest.getPodPatch()).toBe('');
  expect(
    createPipelineRequest.getSpecCommit()?.getBranch()?.getRepo()?.getName(),
  ).toBe(undefined);
  expect(createPipelineRequest.getSpecCommit()?.getId()).toBe(undefined);
  //TODO: test metadata returns
  expect(createPipelineRequest.getReprocessSpec()).toBe('');
  expect(createPipelineRequest.getAutoscaling()).toBe(false);
});

it('should create InspectPipelineRequest from an object with defaults to display details', () => {
  const inspectPipelineRequest = inspectPipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
  });
  expect(inspectPipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(inspectPipelineRequest.getDetails()).toBe(true);
});

it('should create InspectPipelineRequest from an object with details set to false', () => {
  const inspectPipelineRequest = inspectPipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
    details: false,
  });
  expect(inspectPipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(inspectPipelineRequest.getDetails()).toBe(false);
});

it('should create ListPipelineRequest from an object with defaults', () => {
  const listPipelineRequest = listPipelineRequestFromObject({});
  expect(listPipelineRequest.getPipeline()?.getName()).toBe(undefined); // nil for all pipelines
  expect(listPipelineRequest.getHistory()).toBe(0);
  expect(listPipelineRequest.getDetails()).toBe(true);
  expect(listPipelineRequest.getJqfilter()).toBe('');
});

it('should create ListPipelineRequest from an object with a pipeline set', () => {
  const listPipelineRequest = listPipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
  });
  expect(listPipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(listPipelineRequest.getHistory()).toBe(0);
  expect(listPipelineRequest.getDetails()).toBe(true);
  expect(listPipelineRequest.getJqfilter()).toBe('');
});

it('should create ListPipelineRequest from an object with history set to 1', () => {
  const listPipelineRequest = listPipelineRequestFromObject({
    history: 1,
  });
  expect(listPipelineRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listPipelineRequest.getHistory()).toBe(1);
  expect(listPipelineRequest.getDetails()).toBe(true);
  expect(listPipelineRequest.getJqfilter()).toBe('');
});

it('should create ListPipelineRequest from an object with details set to false', () => {
  const listPipelineRequest = listPipelineRequestFromObject({
    details: false,
  });
  expect(listPipelineRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listPipelineRequest.getHistory()).toBe(0);
  expect(listPipelineRequest.getDetails()).toBe(false);
  expect(listPipelineRequest.getJqfilter()).toBe('');
});

it('should create ListPipelineRequest from an object with a jq filter', () => {
  const listPipelineRequest = listPipelineRequestFromObject({
    jqfilter: 'testfilter',
  });
  expect(listPipelineRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listPipelineRequest.getHistory()).toBe(0);
  expect(listPipelineRequest.getDetails()).toBe(true);
  expect(listPipelineRequest.getJqfilter()).toBe('testfilter');
});

it('should create DeletePipelineRequest from an object with defaults', () => {
  const deletePipelineRequest = deletePipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
  });
  expect(deletePipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(deletePipelineRequest.getAll()).toBe(false);
  expect(deletePipelineRequest.getForce()).toBe(false);
  expect(deletePipelineRequest.getKeepRepo()).toBe(false);
});

it('should create DeletePipelineRequest from an object with defaults', () => {
  const deletePipelineRequest = deletePipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
    all: true,
  });
  expect(deletePipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(deletePipelineRequest.getAll()).toBe(true);
  expect(deletePipelineRequest.getForce()).toBe(false);
  expect(deletePipelineRequest.getKeepRepo()).toBe(false);
});

it('should create DeletePipelineRequest from an object with defaults', () => {
  const deletePipelineRequest = deletePipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
    force: true,
  });
  expect(deletePipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(deletePipelineRequest.getAll()).toBe(false);
  expect(deletePipelineRequest.getForce()).toBe(true);
  expect(deletePipelineRequest.getKeepRepo()).toBe(false);
});

it('should create DeletePipelineRequest from an object with defaults', () => {
  const deletePipelineRequest = deletePipelineRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
    keepRepo: true,
  });
  expect(deletePipelineRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(deletePipelineRequest.getAll()).toBe(false);
  expect(deletePipelineRequest.getForce()).toBe(false);
  expect(deletePipelineRequest.getKeepRepo()).toBe(true);
});

it('should create InspectJobRequest from an object with defaults to wait and display all details', () => {
  const inspectJobRequest = inspectJobRequestFromObject({
    job: {id: '23efw4ef098few0'},
    pipeline: {name: 'edges'},
  });
  expect(inspectJobRequest.getJob()?.getId()).toBe('23efw4ef098few0');
  expect(inspectJobRequest.getJob()?.getPipeline()?.getName()).toBe('edges');
  expect(inspectJobRequest.getWait()).toBe(true);
  expect(inspectJobRequest.getDetails()).toBe(true);
});

it('should create InspectJobRequest from an object with to wait false and details false', () => {
  const inspectJobRequest = inspectJobRequestFromObject({
    job: {id: '23efw4ef098few0'},
    pipeline: {name: 'edges'},
    details: false,
    wait: false,
  });
  expect(inspectJobRequest.getJob()?.getId()).toBe('23efw4ef098few0');
  expect(inspectJobRequest.getJob()?.getPipeline()?.getName()).toBe('edges');
  expect(inspectJobRequest.getWait()).toBe(false);
  expect(inspectJobRequest.getDetails()).toBe(false);
});

it('should create InspectJobSetRequest from an object with defaults to wait and display all details', () => {
  const inspectJobSetRequest = inspectJobSetRequestFromObject({
    jobSet: {id: '23efw4ef098few0'},
  });
  expect(inspectJobSetRequest.getJobSet()?.getId()).toBe('23efw4ef098few0');
  expect(inspectJobSetRequest.getWait()).toBe(true);
  expect(inspectJobSetRequest.getDetails()).toBe(true);
});

it('should create InspectJobSetRequest from an object with to wait false and details false', () => {
  const inspectJobSetRequest = inspectJobSetRequestFromObject({
    jobSet: {id: '23efw4ef098few0'},
    details: false,
    wait: false,
  });
  expect(inspectJobSetRequest.getJobSet()?.getId()).toBe('23efw4ef098few0');
  expect(inspectJobSetRequest.getWait()).toBe(false);
  expect(inspectJobSetRequest.getDetails()).toBe(false);
});

it('should create ListJobRequest from an object with defaults', () => {
  const listJobRequest = listJobRequestFromObject({});
  expect(listJobRequest.getPipeline()?.getName()).toBe(undefined); // nil for all pipelines
  expect(listJobRequest.getInputCommitList()[0]?.getId()).toBe(undefined); // nil for all input commits
  expect(listJobRequest.getHistory()).toBe(0);
  expect(listJobRequest.getDetails()).toBe(true);
  expect(listJobRequest.getJqfilter()).toBe('');
});

it('should create ListJobRequest from an object with a pipeline set', () => {
  const listJobRequest = listJobRequestFromObject({
    pipeline: {
      name: 'testPipeline',
    },
  });
  expect(listJobRequest.getPipeline()?.getName()).toBe('testPipeline');
  expect(listJobRequest.getInputCommitList()[0]?.getId()).toBe(undefined);
  expect(listJobRequest.getHistory()).toBe(0);
  expect(listJobRequest.getDetails()).toBe(true);
  expect(listJobRequest.getJqfilter()).toBe('');
});

it('should create ListJobRequest from an object with an input commit set', () => {
  const listJobRequest = listJobRequestFromObject({
    inputCommit: [
      {
        branch: {name: 'master', repo: {name: '__spec__'}},
        id: '4af40d34a0384f23a5b98d3bd7eaece1',
      },
    ],
  });
  expect(listJobRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listJobRequest.getInputCommitList()[0]?.getId()).toBe(
    '4af40d34a0384f23a5b98d3bd7eaece1',
  );
  expect(listJobRequest.getInputCommitList()[0]?.getBranch()?.getName()).toBe(
    'master',
  );
  expect(
    listJobRequest.getInputCommitList()[0]?.getBranch()?.getRepo()?.getName(),
  ).toBe('__spec__');
  expect(listJobRequest.getHistory()).toBe(0);
  expect(listJobRequest.getDetails()).toBe(true);
  expect(listJobRequest.getJqfilter()).toBe('');
});

it('should create ListJobRequest from an object with history set to 1', () => {
  const listJobRequest = listJobRequestFromObject({
    history: 1,
  });
  expect(listJobRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listJobRequest.getInputCommitList()[0]?.getId()).toBe(undefined);
  expect(listJobRequest.getHistory()).toBe(1);
  expect(listJobRequest.getDetails()).toBe(true);
  expect(listJobRequest.getJqfilter()).toBe('');
});

it('should create ListJobRequest from an object with details set to false', () => {
  const listJobRequest = listJobRequestFromObject({
    details: false,
  });
  expect(listJobRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listJobRequest.getInputCommitList()[0]?.getId()).toBe(undefined);
  expect(listJobRequest.getHistory()).toBe(0);
  expect(listJobRequest.getDetails()).toBe(false);
  expect(listJobRequest.getJqfilter()).toBe('');
});

it('should create ListJobRequest from an object with a jq filter', () => {
  const listJobRequest = listJobRequestFromObject({
    jqfilter: 'testfilter',
  });
  expect(listJobRequest.getPipeline()?.getName()).toBe(undefined);
  expect(listJobRequest.getInputCommitList()[0]?.getId()).toBe(undefined);
  expect(listJobRequest.getHistory()).toBe(0);
  expect(listJobRequest.getDetails()).toBe(true);
  expect(listJobRequest.getJqfilter()).toBe('testfilter');
});

it('should create SubscribeJobRequest from an object with defaults details set to true', () => {
  const subscribeJobRequest = subscribeJobRequestFromObject({
    pipeline: {name: 'edges'},
  });
  expect(subscribeJobRequest.getPipeline()?.getName()).toBe('edges');
  expect(subscribeJobRequest.getDetails()).toBe(true);
});

it('should create SubscribeJobRequest from an object with details set to false', () => {
  const subscribeJobRequest = subscribeJobRequestFromObject({
    pipeline: {name: 'edges'},
    details: false,
  });
  expect(subscribeJobRequest.getPipeline()?.getName()).toBe('edges');
  expect(subscribeJobRequest.getDetails()).toBe(false);
});

it('should create a StopJobRequest from an object with reason set to empty by default', () => {
  const stopJobRequest = stopJobRequestFromObject({
    job: {
      id: '63d8d0fc65594c38980686b91b052293',
      pipeline: {name: 'edges'},
    },
  });
  expect(stopJobRequest.getJob()?.getId()).toBe(
    '63d8d0fc65594c38980686b91b052293',
  );
  expect(stopJobRequest.getJob()?.getPipeline()?.getName()).toBe('edges');
  expect(stopJobRequest.getReason()).toBe('');
});

it('should create a StopJobRequest from an object with a reason set', () => {
  const stopJobRequest = stopJobRequestFromObject({
    job: {
      id: '63d8d0fc65594c38980686b91b052293',
      pipeline: {name: 'edges'},
    },
    reason: 'neato',
  });
  expect(stopJobRequest.getJob()?.getId()).toBe(
    '63d8d0fc65594c38980686b91b052293',
  );
  expect(stopJobRequest.getJob()?.getPipeline()?.getName()).toBe('edges');
  expect(stopJobRequest.getReason()).toBe('neato');
});

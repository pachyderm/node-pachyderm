import {
  commitFromObject,
  createRepoRequestFromObject,
  deleteRepoRequestFromObject,
  commitSetFromObject,
  fileFromObject,
  fileInfoFromObject,
  inspectCommitSetRequestFromObject,
  createBranchRequestFromObject,
  listBranchRequestFromObject,
  deleteBranchRequestFromObject,
  repoFromObject,
  triggerFromObject,
  globFileRequestFromObject,
  diffFileRequestFromObject,
} from '../pfs';

describe('grpc/builders/pfs', () => {
  it('should create File from an object', () => {
    const file = fileFromObject({
      commitId: '1234567890',
      path: '/assets',
      branch: {name: 'master', repo: {name: 'neato'}},
    });

    expect(file.getCommit()?.getId()).toBe('1234567890');
    expect(file.getCommit()?.getBranch()?.getRepo()?.getName()).toBe('neato');
    expect(file.getPath()).toBe('/assets');
  });

  it('should create File from an object with defaults', () => {
    const file = fileFromObject({
      branch: {name: 'master', repo: {name: 'neato'}},
    });

    expect(file.getCommit()?.getId()).toBe('master');
    expect(file.getCommit()?.getBranch()?.getRepo()?.getName()).toBe('neato');
    expect(file.getPath()).toBe('/');
  });

  it('should create FileInfo from an object', () => {
    const fileInfo = fileInfoFromObject({
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
    });

    expect(fileInfo.getFile()?.getCommit()?.getId()).toBe('1234567890');
    expect(
      fileInfo.getFile()?.getCommit()?.getBranch()?.getRepo()?.getName(),
    ).toBe('neato');
    expect(fileInfo.getFile()?.getPath()).toBe('/assets');
    expect(fileInfo.getFileType()).toBe(2);
    expect(fileInfo.getHash()).toBe('abcde12345');
    expect(fileInfo.getSizeBytes()).toBe(123);
    expect(fileInfo.getCommitted()?.getSeconds()).toBe(1615922718);
    expect(fileInfo.getCommitted()?.getNanos()).toBe(449796812);
  });

  it('should create FileInfo from an object with missing timestamp', () => {
    const fileInfo = fileInfoFromObject({
      committed: undefined,
      file: {
        commitId: '1234567890',
        path: '/assets',
        branch: {name: 'master', repo: {name: 'neato'}},
      },
      fileType: 2,
      hash: 'abcde12345',
      sizeBytes: 123,
    });

    expect(fileInfo.getFile()?.getCommit()?.getId()).toBe('1234567890');
    expect(
      fileInfo.getFile()?.getCommit()?.getBranch()?.getRepo()?.getName(),
    ).toBe('neato');
    expect(fileInfo.getFile()?.getPath()).toBe('/assets');
    expect(fileInfo.getFileType()).toBe(2);
    expect(fileInfo.getHash()).toBe('abcde12345');
    expect(fileInfo.getSizeBytes()).toBe(123);
    expect(fileInfo.getCommitted()?.getSeconds()).toBe(undefined);
    expect(fileInfo.getCommitted()?.getNanos()).toBe(undefined);
  });

  it('should create Trigger from an object', () => {
    const trigger = triggerFromObject({
      branch: 'master',
      all: true,
      cronSpec: '@every 10s',
      size: 'big',
      commits: 12,
    });

    expect(trigger.getBranch()).toBe('master');
    expect(trigger.getAll()).toBe(true);
    expect(trigger.getCronSpec()).toBe('@every 10s');
    expect(trigger.getSize()).toBe('big');
    expect(trigger.getCommits()).toBe(12);
  });

  it('should create Repo from an object', () => {
    const repo = repoFromObject({
      name: '__spec__',
    });

    expect(repo.getName()).toBe('__spec__');
  });

  it('should create Commit from an object', () => {
    const commit = commitFromObject({
      branch: {name: 'master', repo: {name: '__spec__'}},
      id: '4af40d34a0384f23a5b98d3bd7eaece1',
    });

    expect(commit.getBranch()?.getRepo()?.getName()).toBe('__spec__');
    expect(commit.getId()).toBe('4af40d34a0384f23a5b98d3bd7eaece1');
  });

  it('should create CommitSet from an object', () => {
    const commitSet = commitSetFromObject({
      id: '4af40d34a0384f23a5b98d3bd7eaece1',
    });

    expect(commitSet.getId()).toBe('4af40d34a0384f23a5b98d3bd7eaece1');
  });

  it('should create inspectCommitSetRequest from an object with defaults to wait for commits to finish', () => {
    const commitSet = inspectCommitSetRequestFromObject({
      commitSet: {id: '4af40d34a0384f23a5b98d3bd7eaece1'},
    });

    expect(commitSet.getCommitSet()?.getId()).toBe(
      '4af40d34a0384f23a5b98d3bd7eaece1',
    );
    expect(commitSet.getWait()).toBe(true);
  });

  it('should create inspectCommitSetRequest from an object wait set to false', () => {
    const commitSet = inspectCommitSetRequestFromObject({
      commitSet: {id: '4af40d34a0384f23a5b98d3bd7eaece1'},
      wait: false,
    });

    expect(commitSet.getCommitSet()?.getId()).toBe(
      '4af40d34a0384f23a5b98d3bd7eaece1',
    );
    expect(commitSet.getWait()).toBe(false);
  });

  it('should create createBranchRequest from an object with defaults', () => {
    const createBranchRequest = createBranchRequestFromObject({
      head: {
        branch: {name: 'master', repo: {name: '__spec__'}},
        id: '4af40d34a0384f23a5b98d3bd7eaece1',
      },
      branch: {
        name: 'staging',
        repo: {name: '__spec__'},
      },
      trigger: {
        branch: 'master',
        all: true,
        cronSpec: '@every 10s',
        size: '1MB',
        commits: 12,
      },
      provenance: [],
      newCommitSet: false,
    });
    expect(createBranchRequest.getHead()?.getBranch()?.getName()).toBe(
      'master',
    );
    expect(
      createBranchRequest.getHead()?.getBranch()?.getRepo()?.getName(),
    ).toBe('__spec__');
    expect(createBranchRequest.getHead()?.getId()).toBe(
      '4af40d34a0384f23a5b98d3bd7eaece1',
    );
    expect(createBranchRequest.getBranch()?.getName()).toBe('staging');
    expect(createBranchRequest.getBranch()?.getRepo()?.getName()).toBe(
      '__spec__',
    );
    expect(createBranchRequest.getProvenanceList()).toStrictEqual([]);
    expect(createBranchRequest.getTrigger()?.getBranch()).toBe('master');
    expect(createBranchRequest.getTrigger()?.getAll()).toBe(true);
    expect(createBranchRequest.getTrigger()?.getCronSpec()).toBe('@every 10s');
    expect(createBranchRequest.getTrigger()?.getSize()).toBe('1MB');
    expect(createBranchRequest.getTrigger()?.getCommits()).toBe(12);
    expect(createBranchRequest.getNewCommitSet()).toBe(false);
  });

  it('should create listBranchRequest from an object with defaults reverse to false', () => {
    const listBranchRequest = listBranchRequestFromObject({
      repo: {name: 'test'},
    });
    expect(listBranchRequest.getRepo()?.getName()).toBe('test');
    expect(listBranchRequest.getReverse()).toBe(false);
  });

  it('should create listBranchRequest from an object with reverse set to true', () => {
    const listBranchRequest = listBranchRequestFromObject({
      repo: {name: 'test'},
      reverse: true,
    });
    expect(listBranchRequest.getRepo()?.getName()).toBe('test');
    expect(listBranchRequest.getReverse()).toBe(true);
  });

  it('should create deleteBranchRequest from an object without force by default', () => {
    const deleteBranchRequest = deleteBranchRequestFromObject({
      branch: {name: 'master', repo: {name: 'test'}},
    });
    expect(deleteBranchRequest.getBranch()?.getName()).toBe('master');
    expect(deleteBranchRequest.getBranch()?.getRepo()?.getName()).toBe('test');
    expect(deleteBranchRequest.getForce()).toBe(false);
  });

  it('should create deleteBranchRequest from an object without force by default', () => {
    const deleteBranchRequest = deleteBranchRequestFromObject({
      branch: {name: 'master', repo: {name: 'test'}},
      force: true,
    });
    expect(deleteBranchRequest.getBranch()?.getName()).toBe('master');
    expect(deleteBranchRequest.getBranch()?.getRepo()?.getName()).toBe('test');
    expect(deleteBranchRequest.getForce()).toBe(true);
  });

  it('should create globFileRequest from an object with defaults', () => {
    const globFileRequest = globFileRequestFromObject({
      commit: {
        branch: {name: 'master', repo: {name: '__spec__'}},
        id: '4af40d34a0384f23a5b98d3bd7eaece1',
      },
    });
    expect(globFileRequest.getCommit()?.getBranch()?.getName()).toBe('master');
    expect(globFileRequest.getCommit()?.getBranch()?.getRepo()?.getName()).toBe(
      '__spec__',
    );
    expect(globFileRequest.getCommit()?.getId()).toBe(
      '4af40d34a0384f23a5b98d3bd7eaece1',
    );
    expect(globFileRequest.getPattern()).toBe('/');
  });

  it('should create globFileRequest from an object with a pattern', () => {
    const globFileRequest = globFileRequestFromObject({
      commit: {
        branch: {name: 'master', repo: {name: '__spec__'}},
        id: '4af40d34a0384f23a5b98d3bd7eaece1',
      },
      pattern: '/*',
    });
    expect(globFileRequest.getCommit()?.getBranch()?.getName()).toBe('master');
    expect(globFileRequest.getCommit()?.getBranch()?.getRepo()?.getName()).toBe(
      '__spec__',
    );
    expect(globFileRequest.getCommit()?.getId()).toBe(
      '4af40d34a0384f23a5b98d3bd7eaece1',
    );
    expect(globFileRequest.getPattern()).toBe('/*');
  });

  it('should create diffFileRequest from an object with shallow true by default', () => {
    const diffFileRequest = diffFileRequestFromObject({
      newFile: {
        commitId: '1234567890',
        path: '/newAsset',
        branch: {name: 'master', repo: {name: 'neato'}},
      },
      oldFile: {
        commitId: '0123456789',
        path: '/oldAsset',
        branch: {name: 'master', repo: {name: 'neatero'}},
      },
    });

    expect(diffFileRequest.getNewFile()?.getCommit()?.getId()).toBe(
      '1234567890',
    );
    expect(diffFileRequest.getNewFile()?.getPath()).toBe('/newAsset');
    expect(
      diffFileRequest.getNewFile()?.getCommit()?.getBranch()?.getName(),
    ).toBe('master');
    expect(
      diffFileRequest
        .getNewFile()
        ?.getCommit()
        ?.getBranch()
        ?.getRepo()
        ?.getName(),
    ).toBe('neato');
    expect(diffFileRequest.getOldFile()?.getCommit()?.getId()).toBe(
      '0123456789',
    );
    expect(diffFileRequest.getOldFile()?.getPath()).toBe('/oldAsset');
    expect(
      diffFileRequest.getOldFile()?.getCommit()?.getBranch()?.getName(),
    ).toBe('master');
    expect(
      diffFileRequest
        .getOldFile()
        ?.getCommit()
        ?.getBranch()
        ?.getRepo()
        ?.getName(),
    ).toBe('neatero');
    expect(diffFileRequest.getShallow()).toBe(true);
  });

  it('should create diffFileRequest from an object with shallow set to false', () => {
    const diffFileRequest = diffFileRequestFromObject({
      newFile: {
        commitId: '1234567890',
        path: '/newAsset',
        branch: {name: 'master', repo: {name: 'neato'}},
      },
      oldFile: {
        commitId: '0123456789',
        path: '/oldAsset',
        branch: {name: 'master', repo: {name: 'neatero'}},
      },
      shallow: false,
    });

    expect(diffFileRequest.getNewFile()?.getCommit()?.getId()).toBe(
      '1234567890',
    );
    expect(diffFileRequest.getNewFile()?.getPath()).toBe('/newAsset');
    expect(
      diffFileRequest.getNewFile()?.getCommit()?.getBranch()?.getName(),
    ).toBe('master');
    expect(
      diffFileRequest
        .getNewFile()
        ?.getCommit()
        ?.getBranch()
        ?.getRepo()
        ?.getName(),
    ).toBe('neato');
    expect(diffFileRequest.getOldFile()?.getCommit()?.getId()).toBe(
      '0123456789',
    );
    expect(diffFileRequest.getOldFile()?.getPath()).toBe('/oldAsset');
    expect(
      diffFileRequest.getOldFile()?.getCommit()?.getBranch()?.getName(),
    ).toBe('master');
    expect(
      diffFileRequest
        .getOldFile()
        ?.getCommit()
        ?.getBranch()
        ?.getRepo()
        ?.getName(),
    ).toBe('neatero');
    expect(diffFileRequest.getShallow()).toBe(false);
  });

  it('should create CreateRepoRequest from an object with defaults', () => {
    const createRepoRequest = createRepoRequestFromObject({
      repo: {name: 'test'},
    });

    expect(createRepoRequest.getRepo()?.getName()).toBe('test');
    expect(createRepoRequest.getDescription()).toBe('');
    expect(createRepoRequest.getUpdate()).toBe(false);
  });

  it('should create CreateRepoRequest from an object', () => {
    const createRepoRequest = createRepoRequestFromObject({
      repo: {name: 'test'},
      description: 'this is a discription.',
      update: true,
    });

    expect(createRepoRequest.getRepo()?.getName()).toBe('test');
    expect(createRepoRequest.getDescription()).toBe('this is a discription.');
    expect(createRepoRequest.getUpdate()).toBe(true);
  });

  it('should create deleteRepoRequest from an object without force by default', () => {
    const deleteRepoRequest = deleteRepoRequestFromObject({
      repo: {name: 'test'},
    });

    expect(deleteRepoRequest.getRepo()?.getName()).toBe('test');
    expect(deleteRepoRequest.getForce()).toBe(false);
  });

  it('should create deleteRepoRequest from an object with force', () => {
    const deleteRepoRequest = deleteRepoRequestFromObject({
      repo: {name: 'test'},
      force: true,
    });

    expect(deleteRepoRequest.getRepo()?.getName()).toBe('test');
    expect(deleteRepoRequest.getForce()).toBe(true);
  });
});

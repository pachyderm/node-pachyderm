import {ListCommitRequest, OriginKind} from '@pachyderm/proto/pb/pfs/pfs_pb';

import {CommitObject, RepoObject} from 'builders/pfs';

export type ListCommitArgs = {
  repo: RepoObject;
  number?: ListCommitRequest.AsObject['number'];
  reverse?: ListCommitRequest.AsObject['reverse'];
  all?: ListCommitRequest.AsObject['all'];
  originKind?: OriginKind;
  from?: CommitObject;
  to?: CommitObject;
};

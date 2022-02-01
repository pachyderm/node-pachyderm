import {Empty} from 'google-protobuf/google/protobuf/empty_pb';

import {Commit, ModifyFileRequest} from '../../..';
import {branchFromObject, commitFromObject} from '../../../builders/pfs';
import {AddFile, Branch, Repo} from '../../../proto/pfs/pfs_pb';
import {FileClient, FileClientConstructorArgs} from '../lib/FileClient';
export class ModifyFile extends FileClient<Empty.AsObject> {
  constructor({
    pachdAddress,
    channelCredentials,
    credentialMetadata,
    plugins = [],
  }: FileClientConstructorArgs) {
    super({
      pachdAddress,
      channelCredentials,
      credentialMetadata,
      plugins,
    });
    const onCallObservers = plugins.flatMap((p) =>
      p.onCall ? [p.onCall] : [],
    );
    const onCompleteObservers = plugins.flatMap((p) =>
      p.onCompleted ? [p.onCompleted] : [],
    );
    const onErrorObservers = plugins.flatMap((p) =>
      p.onError ? [p.onError] : [],
    );
    this.promise = new Promise<Empty.AsObject>((resolve, reject) => {
      onCallObservers.forEach((cb) => cb({requestName: 'modifyFile'}));
      this.stream = this.client.modifyFile(credentialMetadata, (err) => {
        if (err) {
          reject(err);
          onErrorObservers.forEach((cb) =>
            cb({error: err, requestName: 'modifyFile'}),
          );
          return;
        } else {
          resolve({});
          onCompleteObservers.forEach((cb) => cb({requestName: 'modifyFile'}));
          return;
        }
      });
    });
  }

  autoCommit(branch: Branch.AsObject) {
    this.stream.write(
      new ModifyFileRequest().setSetCommit(
        new Commit().setBranch(branchFromObject(branch)),
      ),
    );
    return this;
  }

  setCommit(commit: Commit.AsObject) {
    this.stream.write(
      new ModifyFileRequest().setSetCommit(commitFromObject(commit)),
    );
    return this;
  }
}

import {FileClient, FileClientConstructorArgs} from '../lib/FileClient';

export class FileSet extends FileClient<string> {
  fileSetId: string | undefined;
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
    this.promise = new Promise<string>((resolve, reject) => {
      onCallObservers.forEach((cb) => cb({requestName: 'modifyFile'}));
      this.stream = this.client.createFileSet(
        credentialMetadata,
        (err, res) => {
          if (err) {
            reject(err);
            onErrorObservers.forEach((cb) =>
              cb({error: err, requestName: 'modifyFile'}),
            );
            return;
          } else {
            this.fileSetId = res.getFileSetId();
            resolve(res.getFileSetId());
            onCompleteObservers.forEach((cb) =>
              cb({requestName: 'modifyFile'}),
            );
            return;
          }
        },
      );
    });
  }
}

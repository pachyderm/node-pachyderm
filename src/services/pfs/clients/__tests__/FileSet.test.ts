import path from 'path';

import client from '../../../../client';

describe('FileSet', () => {
  afterAll(async () => {
    const pachClient = client({ssl: false, pachdAddress: 'localhost:30650'});
    const pfs = pachClient.pfs();
    await pfs.deleteAll();
  });

  const createSandbox = async (name: string) => {
    const pachClient = client({ssl: false, pachdAddress: 'localhost:30650'});
    const pfs = pachClient.pfs();
    await pfs.deleteAll();
    await pfs.createRepo({repo: {name}});

    return pachClient;
  };

  describe('putFileFromURL', () => {
    it('should add a file from a URL to a repo', async () => {
      const client = await createSandbox('putFileFromURL');

      const fileClient = await client.pfs().fileSet();
      const fileSetId = await fileClient
        .putFileFromURL('at-at.png', 'http://imgur.com/8MN9Kg0.png')
        .end();

      const commit = await client.pfs().startCommit({
        branch: {name: 'master', repo: {name: 'putFileFromURL'}},
      });

      await client.pfs().addFileSet({fileSetId, commit});
      await client.pfs().finishCommit({commit});

      const files = await client.pfs().listFile({
        commitId: commit.id,
        branch: {name: 'master', repo: {name: 'putFileFromURL'}},
      });

      expect(files).toHaveLength(1);
    });
  });

  describe('putFileFromBytes', () => {
    it('should add a file in byte format to a repo', async () => {
      const client = await createSandbox('putFileFromBytes');

      const fileClient = await client.pfs().fileSet();
      await fileClient.putFileFromBytes('test.dat', Buffer.from('data'));

      const commit = await client.pfs().startCommit({
        branch: {name: 'master', repo: {name: 'putFileFromBytes'}},
      });
      const fileSetId = await fileClient.end();
      await client.pfs().addFileSet({fileSetId, commit});

      await client.pfs().finishCommit({commit});

      const files = await client.pfs().listFile({
        commitId: commit.id,
        branch: {name: 'master', repo: {name: 'putFileFromBytes'}},
      });
      expect(files).toHaveLength(1);
    });
  });

  describe('putFileFromFilePath', () => {
    it('should add a file from a local path to the repo', async () => {
      const client = await createSandbox('putFileFromFilePath');

      const fileClient = await client.pfs().fileSet();

      const fileSetId = await fileClient
        .putFileFromFilepath(
          path.join(
            __dirname,
            '../../../../../examples/opencv/images/8MN9Kg0.jpg',
          ),
          '/8MN9Kg0.jpg',
        )
        .end();

      const commit = await client.pfs().startCommit({
        branch: {name: 'master', repo: {name: 'putFileFromFilePath'}},
      });
      await client.pfs().addFileSet({fileSetId, commit});

      await client.pfs().finishCommit({commit});

      const files = await client.pfs().listFile({
        commitId: commit.id,
        branch: {name: 'master', repo: {name: 'putFileFromFilePath'}},
      });
      expect(files).toHaveLength(1);
    });
  });
});

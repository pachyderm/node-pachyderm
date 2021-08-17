import client from 'client';

describe('ModifyFile', () => {
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
      const commit = await client.pfs().startCommit({
        branch: {name: 'master', repo: {name: 'putFileFromURL'}},
      });

      const initialFiles = await client.pfs().listFile({
        commitId: commit.id,
        branch: {name: 'master', repo: {name: 'putFileFromURL'}},
      });
      expect(initialFiles).toHaveLength(0);

      await client
        .modifyFile()
        .setCommit(commit)
        .putFileFromURL('at-at.png', 'http://imgur.com/8MN9Kg0.png')
        .end();

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
      const commit = await client.pfs().startCommit({
        branch: {name: 'master', repo: {name: 'putFileFromBytes'}},
      });

      const initialFiles = await client.pfs().listFile({
        commitId: commit.id,
        branch: {name: 'master', repo: {name: 'putFileFromBytes'}},
      });
      expect(initialFiles).toHaveLength(0);

      await client
        .modifyFile()
        .setCommit(commit)
        .putFileFromBytes('test.dat', Buffer.from('data'))
        .end();
      await client.pfs().finishCommit({commit});

      const files = await client.pfs().listFile({
        commitId: commit.id,
        branch: {name: 'master', repo: {name: 'putFileFromBytes'}},
      });
      expect(files).toHaveLength(1);
    });
  });
});
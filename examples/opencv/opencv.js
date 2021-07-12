#!/usr/bin/env node

// eslint-disable-next-line @typescript-eslint/no-var-requires
const {pachydermClient} = require('../../dist');

const pachdAddress = 'localhost:30650';
const ssl = false;
const main = async () => {
  try {
    // Connect to a pachyderm cluster on the default host:port
    const pachyClient = pachydermClient({pachdAddress, ssl});
    // Create images repo
    await pachyClient.pfs().repoFromOject({name: 'images'});

    // Create edges pipeline
    await pachyClient.pps().pipelineInfoFromObject({
      pipeline: {
        name: 'edges',
      },
      transform: {
        // TODO: replace below with pachyderm/node-opencv
        image: 'laneone/node-opencv',
        cmdList: ['node', '/edges.js'],
      },
      input: {
        pfs: {
          repo: 'images',
          glob: '/*',
        },
      },
    });

    // Create montage pipeline
    await pachyClient.pps().pipelineInfoFromObject({
      pipeline: {
        name: 'montage',
      },
      transform: {
        image: 'v4tech/imagemagick',
        cmdList: ['sh'],
        stdinList: [
          'montage -shadow -background SkyBlue -geometry 300x300+2+2 $(find /pfs -type f | sort) /pfs/out/montage.png',
        ],
      },
      input: {
        crossList: [
          {
            pfs: {
              repo: 'images',
              glob: '/',
            },
          },
          {
            pfs: {
              repo: 'edges',
              glob: '/',
            },
          },
        ],
      },
    });

    // TODO: Add images to master
    // TODO: Wait for downstream commits to finish
    // TODO: Get montage image
  } catch (e) {
    console.log(e);
  }
};

main();

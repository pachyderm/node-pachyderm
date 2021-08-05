import {ServiceArgs} from 'lib/types';
import {Empty} from 'google-protobuf/google/protobuf/empty_pb';

const pps = ({
  pachdAddress,
  channelCredentials,
  credentialMetadata,
}: ServiceArgs) => {
  //   const client = new APIClient(pachdAddress, channelCredentials);

  return {
    inspectCluster: () => {
      //   return new Promise<ClusterInfo.AsObject>((resolve, reject) => {
      //     client.inspectCluster(new Empty(), credentialMetadata, (error, res) => {
      //       if (error) {
      //         return reject(error);
      //       }
      //       return resolve(res.toObject());
      //     });
      //   });
    },
  };
};

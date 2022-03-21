import client from '../client';
import {JobState} from '../proto/pps/pps_pb';

export const waitForJobSuccess = async (
  jobId: string,
  pipelineName: string,
  interval: number = 500,
  timeout: number = 10000,
) => {
  return new Promise(async (resolve, reject) => {
    const pachClient = client({ssl: false, pachdAddress: 'localhost:30650'});
    const pps = pachClient.pps();
    const start = Date.now();
    const poll = () =>
      setTimeout(async () => {
        const job = await pps.inspectJob({
          id: jobId,
          pipelineName,
          projectId: 'default',
        });
        if (job.state === JobState.JOB_SUCCESS) {
          resolve(true);
          return;
        }
        if (job.state === JobState.JOB_FAILURE) {
          reject('Job failed');
          return;
        }
        if (Date.now() - start > timeout) {
          reject('Timed out waiting for job to succeed');
          return;
        }
        poll();
      }, interval);
    poll();
  });
};

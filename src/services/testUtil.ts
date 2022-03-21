import client from '../client';
import {JobState} from '../proto/pps/pps_pb';

export const waitForJobSuccess = async (
  jobId: string,
  pipelineName: string,
  interval = 500,
  timeout = 30000,
) => {
  return new Promise((resolve, reject) => {
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
          reject(
            `Timed out waiting for job to succeed, current job state: ${JobState[
              job.state
            ].toString()}`,
          );
          return;
        }
        poll();
      }, interval);
    poll();
  });
};

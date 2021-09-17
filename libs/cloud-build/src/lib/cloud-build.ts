import { CloudBuildClient } from '@google-cloud/cloudbuild';

export async function runGoogleBuildTrigger(projectId, triggerId, branchName) {
  const cb = new CloudBuildClient();
  const [resp] = await cb.runBuildTrigger({
    projectId,
    triggerId,
    source: {
      projectId,
      dir: './',
      branchName,
    },
  });
}

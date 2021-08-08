import { exec } from 'child_process';
export const startServer = (projectName: string): Promise<any> => {
  const server = exec(
    `gcloud beta emulators pubsub start --project=${projectName}`
  );

  return new Promise((resolve, reject) => {
    server.stdout.on('data', (data) => {
      console.log(`stdout: ${data}`);
    });
    server.stderr.on('data', (data: string) => {
      console.log(`stderr: ${data}`);
      if (data.includes('Server started')) {
        resolve(server);
      }
      if (data.includes('Exception')) {
        reject(server);
      }
    });

    server.on('error', (error) => {
      console.log(`error: ${error.message}`);
    });

    server.on('close', (code) => {
      console.log(`child process exited with code ${code}`);
    });
  });
};

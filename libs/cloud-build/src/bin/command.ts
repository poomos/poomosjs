#!/usr/bin/env node
import { runGoogleBuildTrigger } from '@poomosjs/cloud-build';
import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .command(
    'run-trigger <projectId> <triggerId> <branchName>',
    'the run-trigger command',
    (yargs) => {
      yargs
        .positional('projectId', {
          type: 'string',
          alias: 'p',
          demandOption: 'The project Id is required.',
        })
        .positional('triggerId', {
          type: 'string',
          alias: 't',
          demandOption: 'The trigger Id is required.',
        })
        .positional('branchName', {
          type: 'string',
          alias: 'b',
          demandOption: 'The branch Name is required.',
        });
    },
    (argv) => {
      const { projectId, triggerId, branchName } = argv;
      runGoogleBuildTrigger(projectId, triggerId, branchName);
    }
  )
  .demandCommand()
  .help().argv;

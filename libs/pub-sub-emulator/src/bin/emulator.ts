#!/usr/bin/env node

import * as yargs from 'yargs';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as validateSchema from 'yaml-schema-validator';
import { startServer } from '../lib/start-server';
import { EmulatorConfig } from '../lib/interfaces';
import { initInstance } from '../lib/init-instance';
import { initSubject } from '../lib/init-subject';
import { initSubscribers } from '../lib/init-subscribers';

const options = yargs.usage('Usage: --config <name>').option('config', {
  alias: 'configFile',
  describe: 'Your name',
  type: 'string',
  requiresArg: true,
  demandOption: false,
}).argv;

const greeting = `Hello, ${options.configFile}!`;
console.log(process.cwd());
console.log(greeting);

try {
  const fileContents = fs.readFileSync(
    `${options.configFile || 'pub-sub-emulator.yaml'}`,
    'utf8'
  );
  const data = yaml.load(fileContents);

  console.log(data);
  const validation = valideSchema(data);
  if (validation.length === 0) {
    start(data);
  } else {
    console.error('Invalid Schema');
  }
} catch (e) {
  console.log(e);
}

async function start(config: EmulatorConfig) {
  await startServer(config.projectId);
  const instance = initInstance(config);

  const subjects = await initSubject(instance, config);
  const subscribers = initSubscribers(subjects, config);
}

function valideSchema(config: EmulatorConfig) {
  return validateSchema(config, {
    schema: {
      projectId: { type: String, required: true },
      serverPort: { type: Number, required: false },
      topics: [{ type: String, required: true, length: { min: 3, max: 255 } }],
      pull: [
        {
          topic: { type: String, required: true, length: { min: 3, max: 255 } },
          id: { type: String, required: true, length: { min: 3, max: 255 } },
        },
      ],
      push: [
        {
          topic: { type: String, required: true, length: { min: 3, max: 255 } },
          id: { type: String, required: true, length: { min: 3, max: 255 } },
          endpoint: {
            type: String,
            required: true,
            length: { min: 3, max: 255 },
          },
        },
      ],
    },
  });
}

//do something when app is closing
process.on('exit', exitHandler.bind(null, { cleanup: true }));

//catches ctrl+c event
process.on('SIGINT', exitHandler.bind(null, { exit: true }));

// catches "kill pid" (for example: nodemon restart)
process.on('SIGUSR1', exitHandler.bind(null, { exit: true }));
process.on('SIGUSR2', exitHandler.bind(null, { exit: true }));

//catches uncaught exceptions
process.on('uncaughtException', exitHandler.bind(null, { exit: true }));
function exitHandler(options, exitCode) {
  if (options.cleanup) console.log('clean');
  if (exitCode || exitCode === 0) console.log(exitCode);
  if (options.exit) process.exit();
}

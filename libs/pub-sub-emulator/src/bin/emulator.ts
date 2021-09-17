#!/usr/bin/env node

import * as yargs from 'yargs';
import * as fs from 'fs';
import { startServer } from '../lib/start-server';
import { EmulatorConfig } from '../lib/interfaces';
import { initInstance } from '../lib/init-instance';
import { initSubject } from '../lib/init-subject';
import { initSubscribers } from '../lib/init-subscribers';
import Ajv, { JSONSchemaType } from 'ajv';

const ajv = new Ajv();

const schema = {
  type: 'object',
  properties: {
    projectId: { type: 'string' },
    serverPort: { type: 'integer', nullable: true },
    topics: {
      type: 'array',
      items: {
        type: 'string',
        minLength: 3,
        maxLength: 255,
      },
    },
    pull: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          topic: { type: 'string', minLength: 3, maxLength: 255 },
          id: { type: 'string', minLength: 3, maxLength: 255 },
        },
        required: ['topic', 'id'],
      },
    },
    push: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          topic: { type: 'string', minLength: 3, maxLength: 255 },
          id: { type: 'string', minLength: 3, maxLength: 255 },
          endpoint: { type: 'string', minLength: 3, maxLength: 255 },
        },
        required: ['topic', 'id', 'endpoint'],
      },
    },
  },
  required: ['projectId', 'topics'],
  additionalProperties: false,
};

const validate = ajv.compile(schema);

const options = yargs.usage('Usage: --config <name>').option('config', {
  alias: 'configFile',
  describe: 'Your name',
  type: 'string',
  requiresArg: true,
}).argv;

try {
  const fileContents = fs.readFileSync(
    `${options.configFile || 'pub-sub-emulator.json'}`,
    'utf8'
  );
  const data = JSON.parse(fileContents);

  console.log(data);
  const validation = validate(data);
  if (validation) {
    start(data as EmulatorConfig);
  } else {
    console.error('Invalid Schema');
    console.log(validate.errors);
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

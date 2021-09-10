#!/usr/bin/env node
'use strict';

import * as fs from 'fs';
import { execSync } from 'child_process';

const rawdata = fs.readFileSync('package.json').toString();
const PackageJson = JSON.parse(rawdata);
let peerDependenciesForDependencies = {};

for (const [key, value] of Object.entries(PackageJson.dependencies)) {
  console.log('Get peerDependencies for ' + key);
  const deps = execSync('npm view ' + key + ' peerDependencies --json')
    .toString()
    .replace(/[\r\n]/, '');
  if (deps !== null && deps !== '') {
    peerDependenciesForDependencies = {
      ...peerDependenciesForDependencies,
      ...JSON.parse(deps),
    };
  }
}

console.log('Merge peerDependencies');
PackageJson.dependencies = {
  ...peerDependenciesForDependencies,
  ...PackageJson.dependencies,
};
const data = JSON.stringify(PackageJson);
fs.writeFileSync('package.json', data);
console.log('package.json updated');

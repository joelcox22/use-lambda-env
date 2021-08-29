#!/usr/bin/env node

// istanbul ignore file

import { cli } from './cli-app';

try {
  cli.parse();
} catch (err) {
  if (err instanceof Error) console.log(err.message);
  process.exit(1);
}

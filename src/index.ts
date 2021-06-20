#!/usr/bin/env node

// istanbul ignore file

import { cli } from './cli'

try {
  cli.parse()
} catch (err) {
  console.log(err.message)
  process.exit(1)
}

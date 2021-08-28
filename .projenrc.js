const { Project } = require('@joelcox22/boilerplate');

const project = new Project({
  name: 'use-lambda-env',
  publishToNpm: true,
});

project.synth();

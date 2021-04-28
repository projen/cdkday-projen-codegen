const { JsiiProject } = require('projen');

const project = new JsiiProject({
  author: 'Elad Ben-Israel',
  authorAddress: 'benisrae@amazon.com',
  defaultReleaseBranch: 'main',
  name: 'projen-codegen',
  description: 'A code generation library for projen',
  repositoryUrl: 'git@github.com:projen/projen-codegen.git',
  testdir: 'src/__tests__',
  peerDeps: ['projen'],
});

project.synth();

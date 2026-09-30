#!/usr/bin/env node
'use strict';

const Hexo = require('hexo');
const path = require('path');

const args = process.argv.slice(2);
const command = args[0] || 'generate';
const hexo = new Hexo(path.resolve(__dirname), {
  debug: args.includes('--debug'),
  safe: args.includes('--safe'),
  silent: args.includes('--silent'),
  draft: args.includes('--draft')
});

const options = {};
if (command === 'server') {
  const portIdx = args.indexOf('-p');
  options.port = portIdx !== -1 ? parseInt(args[portIdx + 1]) : 4000;
}

hexo.init().then(() => {
  return hexo.call(command, options);
}).then(() => {
  if (command === 'server') {
    console.log('Server running at http://localhost:' + (options.port || 4000));
  }
}).catch(err => {
  console.error(err);
  process.exit(1);
});

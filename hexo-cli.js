#!/usr/bin/env node
'use strict';

const Hexo = require('hexo');
const path = require('path');

const projectDir = path.resolve(__dirname);
const args = process.argv.slice(2);
const command = args[0] || 'help';

const options = {};
for (let i = 1; i < args.length; i++) {
  if (args[i] === '-p' || args[i] === '--port') {
    options.port = parseInt(args[++i]);
  }
}

const hexo = new Hexo(projectDir, {
  debug: args.includes('--debug'),
  draft: args.includes('--draft')
});

// Set global hexo so plugins can register themselves
global.hexo = hexo;

hexo.init().then(() => {
  // Load external plugins (they register via global.hexo)
  const pkg = require('./package.json');
  const deps = Object.keys(pkg.dependencies || {});
  deps.filter(d => d.startsWith('hexo-') && !d.includes('theme')).forEach(dep => {
    try { require(path.join(projectDir, 'node_modules', dep)); } catch (e) {}
  });

  if (command === 'server' || command === 's') {
    return hexo.call('server', options);
  } else if (command === 'generate' || command === 'g') {
    return hexo.call('generate');
  } else if (command === 'clean' || command === 'cl') {
    return hexo.call('clean');
  } else if (command === 'new' || command === 'n') {
    return hexo.call('new', { title: args[1] || 'New Post' });
  } else if (command === 'deploy' || command === 'd') {
    return hexo.call('deploy');
  } else {
    console.log('Usage: node hexo-cli.js <command>');
    console.log('  generate, g    Generate static files');
    console.log('  server, s      Start server (-p PORT)');
    console.log('  clean, cl      Clean generated files');
    console.log('  new, n <title> Create new post');
    console.log('  deploy, d      Deploy');
  }
}).then(() => {
  if (command === 'server' || command === 's') {
    console.log('Hexo running at http://localhost:' + (options.port || 4000) + '/');
  }
}).catch(err => {
  console.error(err.message || err);
  process.exit(1);
});

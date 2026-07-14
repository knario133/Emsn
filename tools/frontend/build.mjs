import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { build } from 'esbuild';

const currentFile = fileURLToPath(import.meta.url);
const repositoryRoot = path.resolve(path.dirname(currentFile), '..', '..');

const jsOutputDirectory = path.join(repositoryRoot, 'src', 'IntraMessenger.Web', 'Scripts', 'dist');

const cssOutputDirectory = path.join(repositoryRoot, 'src', 'IntraMessenger.Web', 'Content', 'app');

async function prepareOutputDirectories() {
  await rm(jsOutputDirectory, { recursive: true, force: true });
  await rm(cssOutputDirectory, { recursive: true, force: true });
  await mkdir(jsOutputDirectory, { recursive: true });
  await mkdir(cssOutputDirectory, { recursive: true });
}

async function buildAssets() {
  await prepareOutputDirectories();

  await build({
    entryPoints: [path.join(repositoryRoot, 'frontend', 'src', 'js', 'app.js')],
    outfile: path.join(jsOutputDirectory, 'app.js'),
    bundle: true,
    platform: 'browser',
    target: ['es2020'],
    charset: 'utf8',
    legalComments: 'none',
    minify: false,
    sourcemap: false,
    logLevel: 'info',
  });

  await build({
    entryPoints: [path.join(repositoryRoot, 'frontend', 'src', 'css', 'app.css')],
    outfile: path.join(cssOutputDirectory, 'app.css'),
    bundle: true,
    charset: 'utf8',
    legalComments: 'none',
    minify: false,
    sourcemap: false,
    logLevel: 'info',
  });
}

try {
  await buildAssets();
} catch (error) {
  console.error('Fallo el build frontend.', error);
  process.exitCode = 1;
}

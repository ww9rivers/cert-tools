#! /usr/bin/env node
/**
 * CSR generator CLI tool.
 */
import { Command } from 'commander';
import config from './config.js';
import csr_gen from './csr-gen.js';

const app = new Command('csr-gen').version('0.0.1')
	.description('Tool to generate CSR using openSSL.')
	.usage('[options] hostname alt-name1 alt-name2 . . .')
	.option('-c, --config <string>', 'Configuration file')
	.option("-C, --new-config", "New CSR configuration")
	.option("-K, --new-key", "Generate new key file")
	.option("-q, --quiet", "Run quietly with no output")
	.parse();

const opts = app.opts();
await config(opts.config);
process.exit(await csr_gen(app.args, opts));
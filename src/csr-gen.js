/**
 * CSR generator CLI tool.
 */
import * as fs from 'fs/promises';
import { constants as FSC } from 'fs';
import config from './config.js';
import openssl from './openssl.js';

const conf = (await config()).config;
let req = conf.csr.req;
let dn = conf.csr[req.distinguished_name];
if (!req.default_bits) { req.default_bits = 4096; }
if (!dn.emailAddress) { dn.emailAddress = "ww@9rivers.com"; }

/**
 * Function to generate CSR for a given set of entities (hosts).
 * @param {Array} args	An array with a given hostname and a list of alternative names.
 * @param {Array} opts	Options -- see csr.js --help for details.
 * @return Exit codes:
 *	1	Missing hostname.
 *	others	Exit codes from openssl.
 */
export default async (args, opts) => {
	/**
 	* Function to either log to console or do nothing.
 	*/
	const log = (opts.quiet?(()=>{}):console.log);

	if (!args[0]) {
		log('Error: Missing hostname. Use --help for usage.');
		return 1;
	}

	// Create CSR configuration:
	let keyfile = `certs/${args[0]}.key`;
	let csrfile = `certs/${args[0]}.csr`;
	let csrconf = `certs/${args[0]}.conf`;

	/**
 	 * Check if a file can be reused.
	 * @param {string} opt Command line option to check.
	 * @param {*} file Name of the file to check.
	 * @returns True if the file needs to be re-created.
	 */
	const reuse = async (opt, file) => {
		return (opts[opt]!==true)
			&& (await fs.access(file, FSC.R_OK|FSC.W_OK).then(() => true).catch(() => false));
	}
	return fs.mkdir('certs', { recursive: true, mode:0o700 }).then(async () => {
		if (await reuse('newConfig', csrconf)) { return; }
		log(`Creating new CSR configuration ${csrconf}...`);
		return fs.open(csrconf, 'w+').then(async cnf => {
			await cnf.write([
				'#	Config file for splunk-es.med.umich.edu.csr',
				'[req]',
				`default_bits = ${req.default_bits}`,
				`default_md = ${req.default_md||(req.default_md="sha256")}`,
				`req_extensions = ${req.req_extensions||(req.req_extensions="req_ext")}`,
				`distinguished_name = ${req.distinguished_name||(req.distinguished_name="dn")}`,
				'prompt = no',
				'encrypt_key = no\n',
				`[${req.distinguished_name}]`,
				`C=${dn.C||"US"}`,
				`ST=${dn.ST||"Michigan"}`,
				`L=${dn.L||"Ann Arbor"}`,
				`O=${dn.O||"9Rivers.NET, LLC"}`,
				`OU=${dn.OU||"Dev"}`,
				`emailAddress=${dn.emailAddress}`,
				`CN=${args[0]}\n`,
				`[${req.req_extensions}]`,
				'subjectAltName = @alt_names\n',
				'[alt_names]\n'
			].join('\n'));
			cnf.write(args.map((san, ix) => `DNS.${ix++} = ${san}`).join('\n'));
			cnf.close();
		});
	}).then(async () => {
		// Generating the key:
		// openssl genrsa -out "$KEYFILE" "$KEYSIZE"
		if (await reuse('newKey', keyfile)) { return; }
		log(`Creating new key ${csrconf}...`);
		return openssl("genrsa", "-out", keyfile, req.default_bits);
	}).then(code => {
		// Generate the CSR:
		// openssl req -new -nodes -key "$KEYFILE" -out "$CSRFILE" -config "$csr_cf"
		if (code) return Promise.reject(code);
		log("\n",
			"Generating certification signing request for:\n\n",
			`	HOSTNAME = ${args[0]}\n`,
			`	Key size = ${req.default_bits}\n`,
			`	   Email = ${dn.emailAddress}\n\n`,
			`	Key file = ${keyfile}\n`,
			`	CSR file = ${csrfile}\n\n`,
			`Find more details in "${csrconf}"`);
		return openssl("req", "-new", "-nodes", "-key", keyfile, "-out", csrfile, "-config", csrconf);
	}).then(code => {
		if (code) return Promise.reject(code);
		log("\n",
			"------	Run command below to see the contents of the CSR:\n",
			`	openssl req -text -noout -in "${csrfile}"\n`,
			"------	CSR created successfully. Submit the request here for InCommon certification:\n",
			"	https://cert-manager.com/customer/InCommon/ssl\n");
		return 0;
	}).catch(code => {
		log(`OpenSSL returned code ${code}.`)
		return code;
	});
};
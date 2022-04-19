import { copyFile, readFile } from 'fs/promises';
import { pino } from 'pino';

var app;

/**
 * @param {string} cnf	A JSON file to be read as configuration.
 * @returns An object containing a [config] object and a [logger] object.
 */
export default async (cnf) => {
	return app || (app = readFile(cnf||'etc/config.json')).then(data => {
		let conf = JSON.parse(data);
		return {
			config: conf,
			log: pino({
				level: conf.log_level||'info'
			})
		};
	}).catch(err => {
		// Create a configuration file if one does not exist:
		if (err.errno == -2) {
			// code: 'ENOENT' // File not found
			copyFile('etc/config-dist.json', 'etc/config.json').then(() => {
				console.log('Defailt configuration file "etc/config.json" created.\n',
					'Please edit and verify the contests and try again.'
				);
			});
		}
		return Promise.reject(err);
	});
}
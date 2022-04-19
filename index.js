const axios = require('axios');
const Command = require('c9r/etc/cli');
const CM = require('./src/api');
const defaults = {
	confile: 'etc/config.json',
	version: '1.0.0'
};

class App extends Command {
	constructor () {
		super(defaults);
		this.cm = new CM();
	}
	/**
	 * A function to parse a given certificate, extract the CN, then download the
	 * 'x509IOR' format of the signer cert chain to build a server certificate
	 * chain - if the server key is present.
	 *
	 * @param {*} id - of the cert;
	 * @param {*} cert - the cert only.
	 */
	build (id, cert) {
		// Parse the cert for CN and expiration date:
		// Quit if the server key is not found:
		// Download the 'x509IOR' cert chain:
		return this.cm.download(id, 'x509IOR').then(data => {
			// Build and save the server cert chain:
		});
	}

	async run () {
		await this.cm.download(
			this.args()[0]
		).then(data => console.log(data, '\nDone.'));
	}
}

(new App()).run();
const axios = require("axios");

/**
 * Class CM - Certificate Manager
 */
module.exports = class CM {
	constructor (conf={}) {
		this._c = {
			uri: "https://cert-manager.com/customer/InCommon/ssl",
			...conf
		}
	}
	/**
	 * Download a certificate by ID in the given format.
	 * @param {string} id - of the certificate to download;
	 * @param string} format - of the download.
	 */
	async download (id, format='x509CO') {
		return axios.get(this._c.uri, {
			params: {
				action: 'download',
				sslId: id,
				format: format
			}
		}).then((response) => {
			return response.data;
		});
	}
	async enroll () {
		// Enroll a CSR.
	}
	async types () {
		// Get cert types.
		return this.get()
	}
}
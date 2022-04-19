# cert-tools

A package for SSL/TLS certificate management aims to use the
[InCommon Certificate Manager](https://cert-manager.com/customer/InCommon/ssl)
API functions.

Currently, this package uses [openssl](https://www.openssl.org/) for key, certificate
signing request (CSR) generation.

## Commands

Commands in this package includes all functions needed to create, renew, replace, and
revoke a certificate.

### build

To run a build of the cert for a given host.

## CLI Tool Usage

The package includes some command line tools.
### CSR and key generation

```shell
src/csr-cli.js --help
```

## Configuration

A configuration file may be placed in ```etc/config.json``` file, in JSON format, to
configure how this suite of tools behave.

### CSR Generation


```json
"csr": {
	"req": {
		"default_bits": 4096,
		"default_md": "sha256",
		"req_extensions": "req_ext",
		"distinguished_name": "dn",
		"prompt": "no",
		"encrypt_key": "no"
	},
	"req_ext": {
		"subjectAltName": "@alt_names"
	},
	"dn": {
		"C": "US",
		"ST": "<State>",
		"L": "<City>",
		"O": "<Company Name>",
		"OU": "<Department>",
		"emailAddress": "<OU-email-address>",
		"CN": "<hostname>"
	}
}
```

## Author

* Wei Wang <ww@9rivers.com>
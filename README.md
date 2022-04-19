# incommon

A package for SSL/TLS certificate management using the
[InCommon Certificate Manager](https://cert-manager.com/customer/InCommon/ssl)
API functions.

## Commands

Commands in this package includes all functions needed to create, renew, replace, and
revoke a certificate.

### build

To run a build of the cert for a given host.

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
	}
}
```

### openssl

```json
"openssl": {
	"dn": {
		"C": "US",
		"ST": "Michigan",
		"L": "Ann Arbor",
		"O": "University of Michigan",
		"OU": "HITS",
		"emailAddress": "HITS-Performance@umich.edu",
		"CN": "splunkapp-preprod01.med.umich.edu"
	}
}
```
## Author

* Wei Wang <ww@9rivers.com>
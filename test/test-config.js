import { describe, before, it } from 'mocha';
import { expect } from 'chai';
import config from "../src/config.js";

const conf = await config('test/test-config.json');

export default () => {
	return describe('Test config', () => {
		it('should load test-config.json', done => {
			expect(conf.config.label).to.equal('test-config');
			done();
			conf.log.info('Yay!');
		});
	});
}
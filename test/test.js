// https://www.vinnie.work/blog/2021-09-18-why-so-hard-testing-with-es6-imports/
import Mocha from 'mocha';

/* This is where we initialize the Mocha object. We can opt to
   feed it options like the command line arguments as well. Since
   I am using it to do over the wire tests I change the slow
   threshold up to a full second. */
const testRunner = new Mocha({ slow: 1000 });

/* This line is where the currentContext is initialized, allowing
   the use of the `describe`, `it`, and friends to work. Since I'm
   basically initializing currentContext with testRunner it implicitly
   adds Suites and Tests to the testRunner for us. (i.e. we never need
   to run addTest() or addSuite() if we use `describe` and `it`. */
testRunner.suite.emit('pre-require', global, 'nofile', testRunner);

/* This is where I import and load my integration tests. */
import test_config from './test-config.js';
test_config();

/* This line is where the tests are run. */
var suiteRun = testRunner.run();

/* Finally, we check if any tests failed and return non-zero from
   the node process in case we're checking for success/failure from
   a shell script or something. */
process.on('exit', (code) => {
	process.exit(suiteRun.stats.failures > 0);
});
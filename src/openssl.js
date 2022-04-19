import { spawn } from 'child_process';

/**
 * Run the external executable openssl with given command and arguments.
 * @param {...} args Arguments passed from caller.
 * @return Promise to run openssl with given argments.
 */
export default (...args) => {
	return new Promise((resolve, reject) => {
		try {
			let cp = spawn('openssl', args);
			// cp.stdout.on('data', data => console.log(data));
			// cp.stderr.on('data', data => console.error(data));
			cp.on('close', code => resolve(code));
		} catch(err) {
			reject(err);
		}
	});
}
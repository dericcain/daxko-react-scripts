// TODO: This may need to go in its own repo...
const { promisify } = require('util')

const exec = promisify(require('child_process').exec);

const args = process.argv;

exec(`create-react-app ${args[1]} --scripts-version daxko-react-scripts`).catch(e => throw Error(e));

// @remove-file-on-eject
/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
'use strict';

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on('unhandledRejection', err => {
  throw err;
});

const fs = require('fs-extra');
const path = require('path');
const chalk = require('react-dev-utils/chalk');
const execSync = require('child_process').execSync;
const spawn = require('react-dev-utils/crossSpawn');
const { defaultBrowsers } = require('react-dev-utils/browsersHelper');
const os = require('os');
const verifyTypeScriptSetup = require('./utils/verifyTypeScriptSetup');

const deps = [
  '@reach/router',
  'axios',
  'mobx',
  'mobx-react',
  'react',
  'react-dom',
  'react-tiny-feature-switch',
];

const devDependencies = [
  '@testing-library/cypress',
  '@testing-library/jest-dom',
  '@testing-library/react',
  '@testing-library/user-event',
  '@types/jest',
  '@types/jest-axe',
  '@types/node',
  '@types/reach__router',
  '@types/react',
  '@types/react-dom',
  '@types/webpack-env',
  'cross-env',
  'cypress',
  'eslint-plugin-cypress',
  'eslint-plugin-prettier',
  'husky',
  'jest-axe',
  'lint-staged',
  'prettier',
  // Use dart-sass here instead of node-sass
  'sass',
  'source-map-explorer',
  'start-server-and-test',
  'typescript',
];

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function isInMercurialRepository() {
  try {
    execSync('hg --cwd . root', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit(appPath) {
  let didInit = false;
  try {
    execSync('git --version', { stdio: 'ignore' });
    if (isInGitRepository() || isInMercurialRepository()) {
      return false;
    }

    execSync('git init', { stdio: 'ignore' });
    didInit = true;

    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from Daxko React App"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    if (didInit) {
      // If we successfully initialized but couldn't commit,
      // maybe the commit author config is not set.
      // In the future, we might supply our own committer
      // like Ember CLI does, but for now, let's just
      // remove the Git files to avoid a half-done state.
      try {
        // unlinkSync() doesn't work on directories.
        fs.removeSync(path.join(appPath, '.git'));
      } catch (removeErr) {
        // Ignore.
      }
    }
    return false;
  }
}

module.exports = function(
  appPath,
  appName,
  verbose,
  originalDirectory
) {
  const ownPath = path.dirname(
    require.resolve(path.join(__dirname, '..', 'package.json'))
  );
  const appPackage = require(path.join(appPath, 'package.json'));

  // NOTE: We do not want to use Yarn
  const useYarn = false;

  // Copy over some of the devDependencies
  appPackage.dependencies = appPackage.dependencies || {};

  // Setup the script rules
  appPackage.scripts = {
    analyze: `source-map-explorer 'build/static/js/*.js'`,
    build: 'react-scripts build',
    ci: 'cross-env CI=true npm run test && npm run test:e2e:headless',
    'cy': 'cypress open',
    'cy:headless': 'cypress run',
    eject: 'react-scripts eject',
    lint: 'eslint --ext .ts,.tsx ./src --fix',
    // FIXME: Needs webpack work
    // profile: 'cross-env PROFILE=true npm run build && npx serve -s build',
    start: 'react-scripts start',
    test: 'react-scripts test',
    'test:e2e': 'start-server-and-test start http://localhost:3000 cy',
    'test:e2e:headless': 'start-server-and-test start http://localhost:3000 cy:headless',
  };

  // Setup the eslint config
  appPackage.eslintConfig = {
    extends: ['react-app'],
    plugins: ['cypress', 'prettier'],
    rules: {
      'prettier/prettier': 'error',
    },
    env: {
      'cypress/globals': true
    }
  };

  // Add Prettier to the project
  appPackage.prettier = {
    printWidth: 100,
    trailingComma: 'all',
    singleQuote: true,
    arrowParens: 'avoid',
  };

  // Set up Husky for our git hooks
  appPackage.husky = {
    hooks: {
      'pre-commit': 'lint-staged',
      'pre-push': 'npm t'
    }
  };

  // We only want to lint staged files (files that have changed)
  appPackage['lint-staged'] = {
    '*.{ts,tsx}': [
      'eslint --fix',
      'git add'
    ]
  };

  // Setup the browsers list
  appPackage.browserslist = defaultBrowsers;

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(appPackage, null, 2) + os.EOL
  );

  const readmeExists = fs.existsSync(path.join(appPath, 'README.md'));
  if (readmeExists) {
    fs.renameSync(
      path.join(appPath, 'README.md'),
      path.join(appPath, 'README.old.md')
    );
  }

  // Copy the files for the user
  const templatePath = path.join(ownPath, 'template');
  if (fs.existsSync(templatePath)) {
    fs.copySync(templatePath, appPath);
  } else {
    console.error(
      `Could not locate supplied template: ${chalk.green(templatePath)}`
    );
    return;
  }

  // Rename gitignore after the fact to prevent npm from renaming it to .npmignore
  // See: https://github.com/npm/npm/issues/1862
  try {
    fs.moveSync(
      path.join(appPath, 'gitignore'),
      path.join(appPath, '.gitignore'),
      []
    );
  } catch (err) {
    // Append if there's already a `.gitignore` file there
    if (err.code === 'EEXIST') {
      const data = fs.readFileSync(path.join(appPath, 'gitignore'));
      fs.appendFileSync(path.join(appPath, '.gitignore'), data);
      fs.unlinkSync(path.join(appPath, 'gitignore'));
    } else {
      throw err;
    }
  }

  // Try this here so that when husky is installed, it will create the git hooks for us
  if (tryGitInit(appPath)) {
    console.log();
    console.log('Initialized a git repository.');
  }

  let command;
  let args, devArgs;

  // NOTE: This is where the install takes place
  if (useYarn) {
    command = 'yarnpkg';
    args = ['add'];
  } else {
    command = 'npm';
    args = ['install', '--save', verbose && '--verbose'].filter(e => e);
    devArgs = ['install', '--save-dev', verbose && '--verbose'].filter(e => e);
  }

  args.push(...deps);
  devArgs.push(...devDependencies);

  // Install additional template dependencies, if present
  const templateDependenciesPath = path.join(
    appPath,
    '.template.dependencies.json'
  );
  if (fs.existsSync(templateDependenciesPath)) {
    const templateDependencies = require(templateDependenciesPath).dependencies;
    args = args.concat(
      Object.keys(templateDependencies).map(key => {
        return `${key}@${templateDependencies[key]}`;
      })
    );
    fs.unlinkSync(templateDependenciesPath);
  }

  // Install react and react-dom for backward compatibility with old CRA cli
  // which doesn't install react and react-dom along with react-scripts
  // or template is presetend (via --internal-testing-template)
  console.log(`Installing dependencies using ${command}...`);
  console.log();

  const proc = spawn.sync(command, args, { stdio: 'inherit' });
  const devProc = spawn.sync(command, devArgs, { stdio: 'inherit' });

  if (proc.status !== 0) {
    console.error(`\`${command} ${args.join(' ')}\` failed`);
    return;
  }

  if (devProc.status !== 0) {
    console.error(`\`${command} ${devArgs.join(' ')}\` failed`);
    return;
  }

  verifyTypeScriptSetup();

  // Display the most elegant way to cd.
  // This needs to handle an undefined originalDirectory for
  // backward compatibility with old global-cli's.
  let cdpath;
  if (originalDirectory && path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  // Change displayed command to yarn instead of yarnpkg
  const displayedCommand = useYarn ? 'yarn' : 'npm';

  console.log();
  console.log(`Success! Created ${appName} at ${appPath}`);
  console.log('Inside that directory, you can run several commands:');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} start`));
  console.log('    Starts the development server.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}build`)
  );
  console.log('    Bundles the app into static files for production.');
  console.log();
  console.log(chalk.cyan(`  ${displayedCommand} test`));
  console.log('    Starts the test runner.');
  console.log();
  console.log(
    chalk.cyan(`  ${displayedCommand} ${useYarn ? '' : 'run '}eject`)
  );
  console.log(
    '    Removes this tool and copies build dependencies, configuration files'
  );
  console.log(
    '    and scripts into the app directory. If you do this, you can’t go back!'
  );
  console.log();
  console.log('We suggest that you begin by typing:');
  console.log();
  console.log(chalk.cyan('  cd'), cdpath);
  console.log(`  ${chalk.cyan(`${displayedCommand} start`)}`);
  if (readmeExists) {
    console.log();
    console.log(
      chalk.yellow(
        'You had a `README.md` file, we renamed it to `README.old.md`'
      )
    );
  }
  console.log();
  console.log('Happy hacking!');
};

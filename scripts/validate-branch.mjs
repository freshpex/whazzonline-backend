import { execSync } from 'node:child_process';

const branch = execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
const allowed = /^(dev|main|users\/[a-z0-9._-]+\/(feature|bugfix|hotfix|chore|docs|refactor|test)\/[a-z0-9._-]+)$/;

if (!allowed.test(branch)) {
  console.error(`Invalid branch name: ${branch}`);
  console.error('Use: users/<name>/<feature|bugfix|hotfix|chore|docs|refactor|test>/<description>');
  process.exit(1);
}

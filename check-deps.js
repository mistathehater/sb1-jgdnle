import { execSync } from 'child_process';
import fs from 'fs';

const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };

for (const [pkg, version] of Object.entries(dependencies)) {
  try {
    execSync(`npm list ${pkg}@${version}`, { stdio: 'ignore' });
  } catch (error) {
    console.log(`Reinstalling ${pkg}@${version}...`);
    execSync(`npm install ${pkg}@${version}`, { stdio: 'inherit' });
  }
}

console.log('All dependencies are installed correctly.');
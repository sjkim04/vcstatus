import fs from 'fs';

const codePath = './src/commands/index.js';

let importCodes = [];

const commands = fs.readdirSync('./src/commands')
    .map(a => a.split('.')[0])
    .filter(a => a !== 'index');

for(let command of commands) {
    importCodes.push(`import ${command} from './${command}';`);
}

const finalCode = `
${importCodes.join('\n')}

export const commands = {
    ${commands.join(',\n    ')}
}
`.trim();

const prevCode = fs.existsSync(codePath) ? fs.readFileSync(codePath).toString().trim() : '';

if(prevCode !== finalCode) fs.writeFileSync(codePath, finalCode);
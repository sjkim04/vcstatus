import fs from 'fs';
import axios from 'axios';
import dotenv from 'dotenv';

const secrets = JSON.parse(fs.readFileSync('./secrets.json').toString());

dotenv.config({
    path: '.dev.vars'
});

const args = process.argv.slice(2);
const clean = args.includes('--clean');
const debug = args.includes('--debug');

let token;
if(!debug) token = secrets.DISCORD_TOKEN;
token ??= process.env.DISCORD_TOKEN;

if(!token) {
    console.error('Put DISCORD_TOKEN to env!');
    process.exit(1);
}

const discord = axios.create({
    baseURL: 'https://discord.com/api/v10',
    headers: {
        Authorization: `Bot ${token}`
    }
});

(async () => {
    const commands = [];

    if(!clean) commands.push(...await Promise.all(fs.readdirSync('./src/commands').filter(a => a !== 'index.js').map(async name => {
        const { default: command } = await import(`../src/commands/${name}`);
        return command.info;
    })));

    const applicationId = Buffer.from(token.split('.')[0], 'base64').toString();
    const debugGuild = process.env.DISCORD_TEST_GUILD_ID;

    const requestUrl = debug
        ? `/applications/${applicationId}/guilds/${debugGuild}/commands`
        : `/applications/${applicationId}/commands`;

    try {
        await discord.put(requestUrl, commands);
    } catch(e) {
        console.error('Command register failed!');
        console.error(e.response.data);
        if(e.response.data?.errors) {
            console.error(JSON.stringify(e.response.data.errors, null, 2));
        }
        process.exit(1);
    }

    console.log(`commands:\n${commands.map(c => c.type && c.type > 1 ? c.name : `/${c.name}`).join('\n')}`);
})()
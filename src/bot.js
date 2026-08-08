import {
    InteractionType,
    InteractionResponseType
} from 'discord-api-types/v10';
import axios from 'axios';

import { commands } from './commands';
import { verify } from './verify';

const respond = response => new Response(JSON.stringify(response), {
    headers: {
        'Content-Type': 'application/json'
    }
});

let discord;

export async function bot(request, env, ctx) {
    discord ??= axios.create({
        baseURL: 'https://discord.com/api/v10',
        headers: {
            Authorization: `Bot ${env.DISCORD_TOKEN}`
        },
        adapter: 'fetch'
    });

    if(!await verify(request, env)) return new Response('Invalid signature', { status: 401 });

    const interaction = await request.json();

    switch(interaction.type) {
        case InteractionType.Ping:
            return respond({
                type: InteractionResponseType.Pong
            });

        case InteractionType.ApplicationCommand: {
            return respond(await commands[interaction.data.name].handler(interaction, discord, env, ctx, request));
        }
    }
}
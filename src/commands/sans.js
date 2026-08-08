import {
    InteractionResponseType
} from 'discord-api-types/v10';

export default {
    info: {
        name: 'sans',
        description: 'sans command'
    },
    async handler(interaction, discord) {
        await discord.post(`/channels/${interaction.channel_id}/messages`, {
            content: 'wow message!'
        });

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: 'wa sans!'
            }
        }
    }
}
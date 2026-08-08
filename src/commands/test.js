import {
    ApplicationCommandOptionType,
    InteractionResponseType
} from 'discord-api-types/v10';

export default {
    info: {
        name: 'test',
        description: 'test command',
        options: [
            {
                name: 'option',
                description: 'option test',
                type: ApplicationCommandOptionType.String
            }
        ]
    },
    async handler(interaction) {
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: interaction.data.options?.[0].value || 'no option'
            }
        }
    }
}
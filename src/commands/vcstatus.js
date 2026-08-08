import {
    ApplicationCommandOptionType,
    ChannelType,
    InteractionResponseType,
    MessageFlags
} from 'discord-api-types/v10';

export default {
    info: {
        name: 'vcstatus',
        description: 'Changes the status of a voice channel. Set status to empty to remove',
        options: [
            {
                name: 'channel',
                description: 'Voice channel to change status',
                type: ApplicationCommandOptionType.Channel,
                channel_types: [ChannelType.GuildVoice],
                required: true,
            },
            {
                name: 'status',
                description: 'Status to set the voice channel to',
                type: ApplicationCommandOptionType.String,
                required: false,
            }
        ]
    },
    async handler(interaction, discord) {
        const channelId = interaction.data.options?.[0].value;
        const status = interaction.data.options?.[1].value || null;

        await discord.patch(`/channels/${channelId}/voice-status`, {
            status
        });

        const response = status ? `VC <#${channelId}> status updated to \`${status}\`` : `VC <#${channelId}> status removed`;

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: response,
                flags: MessageFlags.Ephemeral
            },
        }
    }
}
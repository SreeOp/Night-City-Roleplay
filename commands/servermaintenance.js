const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('servermain')
        .setDescription('Announces server maintenance.'),
    
    async execute(interaction) {
        // Hardcoded role ID and channel ID
        const roleId = '1125844474602471506'; // Replace with the role ID to mention
        const channelId = '1125466524690415636'; // Replace with the channel ID to send the message

        // Fetch the role from the guild
        const role = interaction.guild.roles.cache.get(roleId);
        if (!role) {
            return interaction.reply({
                content: 'The specified role does not exist. Please check the role ID.',
                ephemeral: true
            });
        }

        // Fetch the channel from the guild
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            return interaction.reply({
                content: 'The specified channel does not exist. Please check the channel ID.',
                ephemeral: true
            });
        }

        // Create the embed
        const embed = new EmbedBuilder()
            .setTitle('Server Under Maintenance')
            .setDescription('Server is Currently Down For Maintenance, Please Wait.')
            .setThumbnail('https://i.ibb.co/Nmhr5jb/nrp1.png') // Replace with the thumbnail URL
            .setImage('https://r2.fivemanage.com/M8ZRs0ZKRHQNYpT5YIztc/standard.gif') // Replace with the GIF URL
            .setFooter({
                text: 'Nrp Developer Team',
                iconURL: interaction.client.user.displayAvatarURL()
            });

        // Send the message in the specified channel
        await channel.send({
            content: `${role}`, // Mentions the role
            embeds: [embed]
        });

        // Reply to the user confirming the action
        await interaction.reply({
            content: 'The server maintenance announcement has been posted.',
            ephemeral: true
        });
    },
};

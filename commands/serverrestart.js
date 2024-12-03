const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverrestart')
    .setDescription('Send a server restart message with a role mention.')
    .addRoleOption(option =>
      option.setName('mentionrole')
        .setDescription('The role to mention in the message')
        .setRequired(true)
    ),
  async execute(interaction) {
    const role = interaction.options.getRole('mentionrole');
    const gifUrl = 'https://imgur.com/WNo9Rlf'; // Replace with your GIF URL
    const thumbnailUrl = 'https://i.ibb.co/Nmhr5jb/nrp1.png';

    const embed = new EmbedBuilder()
      .setTitle('Server Restarted')
      .setDescription('Server Has Been Restarted , Enjoy Roleplaying , If You Facing Any Issue Feel Free To Contact Nrp Team > Connect Through City Ip https://discord.com/channels/1120436484806287493/1296783788202004532 ')
      .setImage(gifUrl)
      .setThumbnail(thumbnailUrl)
      .setFooter({ text: 'NRP DEVELOPER TEAM' })
      .setColor('#08FF08'); // Optional: Set your desired embed color

    try {
      await interaction.channel.send({
        content: `<@&${role.id}>`,
        embeds: [embed],
      });

      await interaction.reply({
        content: 'The server restart message has been sent!',
        ephemeral: true,
      });
    } catch (error) {
      console.error('Error sending the server restart message:', error);
      await interaction.reply({
        content: 'There was an error sending the server restart message.',
        ephemeral: true,
      });
    }
  },
};

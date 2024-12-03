const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('servermain')
    .setDescription('Send a server restart message with a role mention.')
    .addRoleOption(option =>
      option.setName('mentionrole')
        .setDescription('The role to mention in the message')
        .setRequired(true)
    ),
  async execute(interaction) {
    const role = interaction.options.getRole('mentionrole');
    const gifUrl = 'https://cdn.discordapp.com/attachments/1188478795850723479/1313138560043319377/standard.gif?ex=674f0b15&is=674db995&hm=26b18f5fc0cf5bc5867f8aef1b09d9764f8bdbf96e2a7c16aaab99263e69c29f&'; // Replace with your GIF URL
    const thumbnailUrl = 'https://cdn.discordapp.com/attachments/1188478795850723479/1313144878796115978/nrp1.png?ex=674f10f8&is=674dbf78&hm=fd1edfbcef3fc8c9c613bcf98c2a09f105a6497bee5040fd45424cdd906470b9&';

    const embed = new EmbedBuilder()
      .setTitle('Server Under Maintenance')
      .setDescription('Server Under Maintenance, Please Wait Until Message In https://discord.com/channels/1120436484806287493/1125466524690415636')
      .setImage(gifUrl)
      .setThumbnail(thumbnailUrl)
      .setFooter({ text: 'NRP DEVELOPER TEAM' })
      .setColor('#E10600'); // Optional: Set your desired embed color

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

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
    const gifUrl = 'https://media.discordapp.net/attachments/1188478795850723479/1313138604217995275/standard_1.gif?ex=674f0b20&is=674db9a0&hm=6972ac3b666f4445d0188254c2a6a0d0d5b8a945e87c3dea3d1c557a022e585c&=&width=374&height=48'; // Replace with your GIF URL
    const thumbnailUrl = 'https://cdn.discordapp.com/attachments/1188478795850723479/1313144878796115978/nrp1.png?ex=674f10f8&is=674dbf78&hm=fd1edfbcef3fc8c9c613bcf98c2a09f105a6497bee5040fd45424cdd906470b9&';

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

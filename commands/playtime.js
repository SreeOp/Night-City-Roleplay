const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const color_filter = [
    "^0",
    "^1",
    "^2",
    "^3",
    "^4",
    "^5",
    "^6",
    "^7",
    "^8",
    "^9"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('playtime')
    .setDescription('Check a user\'s total playtime in the server')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The user to check playtime for')
        .setRequired(true)),
  async execute(interaction) {
    const user = interaction.options.getUser('user');

    const serverIP = 'YOUR_SERVER_IP'; // Replace with your FiveM server IP
    const serverPort = 'YOUR_SERVER_PORT'; // Replace with your FiveM server Port

    try {
      // Call FiveM API to get player info
      const response = await axios.get(`http://${serverIP}:${serverPort}/players.json`);
      const players = response.data;

      // Find the user in the player list by Discord ID
      const playerData = players.find(player =>
        player.identifiers.some(id => id.includes(`discord:${user.id}`))
      );

      if (!playerData) {
        return interaction.reply({ content: 'This user is not currently connected to the server.', ephemeral: true });
      }

      // Extract and clean data
      const playTime = playerData.time ? `${(playerData.time / 3600).toFixed(2)} hours` : 'Unknown';
      const joinDate = playerData.firstSeen ? new Date(playerData.firstSeen).toLocaleString() : 'Unknown';
      const lastConnection = playerData.lastSeen ? new Date(playerData.lastSeen).toLocaleString() : 'Unknown';

      const cleanName = color_filter.reduce(
        (name, filter) => name.replace(new RegExp(filter, 'g'), ''),
        playerData.name
      );

      // Construct Embed
      const embed = {
        color: 0x0099ff, // Customize the embed color
        title: cleanName || 'Unknown Player',
        description: `**Playtime:** ${playTime}\n**Join Date:** ${joinDate}\n**Last Connection:** ${lastConnection}`,
        footer: {
          text: 'Your Bot Name',
          icon_url: interaction.client.user.displayAvatarURL()
        }
      };

      // Reply with embed
      await interaction.reply({ embeds: [embed] });
    } catch (error) {
      console.error('Error fetching playtime:', error);
      await interaction.reply({ content: 'Failed to retrieve playtime information. Please try again later.', ephemeral: true });
    }
  }
};

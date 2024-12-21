const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

const ip = '139.59.75.7:30120'; // Replace with  FiveM server's IP and port
const color_filter = [
    "^0", "^1", "^2", "^3", "^4", "^5", "^6", "^7", "^8", "^9"
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName('setjob')
    .setDescription('Set a job for a player on the FiveM server.')
    .addStringOption(option =>
      option.setName('playerid')
        .setDescription('The ID of the player')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('jobname')
        .setDescription('The name of the job')
        .setRequired(true))
    .addIntegerOption(option =>
      option.setName('grade')
        .setDescription('The grade of the job')
        .setRequired(true)),
  async execute(interaction) {
    // Only specific roles can use this command
    const allowedRoleIds = ['1130550721834647622', '1143387729577660487']; // Replace with your actual role IDs 
    const memberRoles = interaction.member.roles.cache;
    const hasPermission = allowedRoleIds.some(role => memberRoles.has(role));

    if (!hasPermission) {
      return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
    }

    const playerId = interaction.options.getString('playerid');
    const jobName = interaction.options.getString('jobname');
    const grade = interaction.options.getInteger('grade');

    // Remove color codes from playerId and jobName
    const cleanPlayerId = color_filter.reduce((str, color) => str.replace(new RegExp(color, 'g'), ''), playerId);
    const cleanJobName = color_filter.reduce((str, color) => str.replace(new RegExp(color, 'g'), ''), jobName);

    try {
      // Construct the API URL
      const apiUrl = `http://${ip}/setjob?playerId=${cleanPlayerId}&job=${cleanJobName}&grade=${grade}`;

      // Make the request
      const response = await axios.get(apiUrl);

      if (response.status === 200) {
        await interaction.reply({
          content: `Successfully set job **${cleanJobName}** with grade **${grade}** for player **${cleanPlayerId}**.`,
          ephemeral: true,
        });
      } else {
        throw new Error(`Server responded with status code ${response.status}`);
      }
    } catch (error) {
      console.error('Error setting job:', error);
      await interaction.reply({
        content: 'Failed to set the job. Please check the server logs for more details.',
        ephemeral: true,
      });
    }
  },
};

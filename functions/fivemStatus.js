const Discord = require('discord.js');
const axios = require('axios');
const moment = require('moment-timezone');

// Load IP and other constants from environment variables
const IP = process.env.SERVER_IP || "127.0.0.1:30120"; // Default if not set in .env
const CHANNEL_ID = process.env.STATUS_CHANNEL_ID; // Status channel ID
const MESSAGE_ID = process.env.STATUS_MESSAGE_ID; // Message ID to edit
const GUILD_ID = process.env.GUILD_ID; // Guild ID (Server ID)
const color_filter = [
    "^0", "^1", "^2", "^3", "^4", "^5", "^6", "^7", "^8", "^9"
];

module.exports = (client) => {
    function getCurrentISTTime() {
        return moment().tz('Asia/Kolkata').format('h:mm A');
    }

    console.log('FiveM Server Status Loaded');
    setInterval(updateServerStatus, 60000); // Update every minute (60,000ms)

    async function updateServerStatus() {
        if (!client.isReady()) return;

        const currentTime = getCurrentISTTime();
        let guild = client.guilds.cache.get(GUILD_ID);

        if (CHANNEL_ID && MESSAGE_ID) {
            try {
                // Fetch server dynamic.json and players.json
                const [dynamicRes, playersRes] = await Promise.all([
                    axios.get(`http://${IP}/dynamic.json`, { timeout: 10000 }),
                    axios.get(`http://${IP}/players.json`, { timeout: 10000 })
                ]);

                if (dynamicRes.status === 200 && playersRes.status === 200) {
                    const dynamicData = dynamicRes.data;
                    const playersData = playersRes.data;

                    let hostName = dynamicData.hostname;
                    for (const filter of color_filter) {
                        hostName = hostName.replace(new RegExp(filter, 'g'), '');
                    }

                    // Create embed
                    const embed = new Discord.EmbedBuilder()
                        .setColor('Purple')
                        .setDescription('**Server Name**\n```Night City```\n**How to join the server?**\nYou can join the server **Night City** using our IP: ```connect cfx.re/join/574yga```. Live server status can be tracked below!!')
                        .addFields(
                            { name: 'Server Status', value: '```Online ✅```', inline: true },
                            { name: 'Online Players', value: `\`\`\`${dynamicData.clients}/${dynamicData.sv_maxclients}\`\`\``, inline: true },
                            { name: 'Restart Times', value: '```6:30 PM```', inline: true }
                        )
                        .setAuthor({ name: 'Night City | Server Status', iconURL: guild.iconURL() })
                        .setImage('https://r2.fivemanage.com/M8ZRs0ZKRHQNYpT5YIztc/SCTFORu.gif')
                        .setFooter({ text: `Night City | Last Updated at ${currentTime}`, iconURL: client.user.displayAvatarURL() });

                    // Add live players to embed
                    const livePlayerNames = playersData
                        .sort((a, b) => a.id - b.id)
                        .map(player => `[${player.id}] ${player.name}\n`);

                    for (let i = 0; i < livePlayerNames.length; i += 30) {
                        embed.addFields({ name: 'ㅤ', value: livePlayerNames.slice(i, i + 30).join(''), inline: true });
                    }

                    // Update message in the channel
                    const channel = await client.channels.fetch(CHANNEL_ID);
                    const msg = await channel.messages.fetch(MESSAGE_ID);
                    await msg.edit({ embeds: [embed] });

                    // Update bot activity
                    client.user.setActivity(`${dynamicData.clients} players on Night City`, { type: Discord.ActivityType.Watching });
                }
            } catch (error) {
                console.error('Error fetching server data:', error);

                // Handle server offline case
                const embed = new Discord.EmbedBuilder()
                    .setColor('Red')
                    .setDescription('🔴Server is temporarily Unavailable🔴')
                    .addFields(
                        { name: 'Server Status', value: '```Offline ❌```', inline: true },
                        { name: 'Online Players', value: '```0/0```', inline: true },
                        { name: 'Restart Times', value: '```6:30 PM```', inline: true }
                    )
                    .setAuthor({ name: 'Night City | Server Status', iconURL: guild.iconURL() })
                    .setFooter({ text: `Night City | Last Updated at ${currentTime}`, iconURL: client.user.displayAvatarURL() });

                const channel = await client.channels.fetch(CHANNEL_ID);
                const msg = await channel.messages.fetch(MESSAGE_ID);
                await msg.edit({ embeds: [embed] });

                client.user.setActivity('🔴Server is unavailable🔴', { type: Discord.ActivityType.Watching });
            }
        }
    }
};

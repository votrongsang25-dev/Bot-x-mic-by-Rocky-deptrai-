const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

const app = express();
app.listen(3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

const distube = new DisTube(client, {
    plugins: [new YtDlpPlugin()],
    emitNewSongOnly: true
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith('!play')) {
        const args = message.content.split(' ').slice(1).join(' ');
        distube.play(message.member.voice.channel, args, { message });
    }

    // Chỉnh âm lượng (vd: !volume 100)
    if (message.content.startsWith('!volume')) {
        const volume = parseInt(message.content.split(' ')[1]);
        distube.setVolume(message, volume);
        message.reply(`Âm lượng đã chỉnh thành: ${volume}%`);
    }

    // Chỉnh Bass (vd: !bass boost)
    if (message.content === '!bass') {
        distube.setFilter(message, "bassboost");
        message.reply('Đã bật chế độ Bass siêu to!');
    }

    // Dừng nhạc
    if (message.content === '!stop') {
        distube.stop(message);
        message.reply('Đã tắt nhạc!');
    }
});

client.login(process.env.DISCORD_TOKEN);
  

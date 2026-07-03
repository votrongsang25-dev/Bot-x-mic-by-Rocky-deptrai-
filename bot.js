const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

const app = express();
app.listen(3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

const MY_ID = '1520058521746538609'; 
let xamicActive = false;

const distube = new DisTube(client, {
    plugins: [new YtDlpPlugin()],
    emitNewSongOnly: true
});

client.on('messageCreate', async (message) => {
    if (message.author.id !== MY_ID) return;

    if (message.content.startsWith('!play')) {
        distube.play(message.member.voice.channel, message.content.slice(6), { message });
        message.reply('Đang phát nhạc!');
    }
    if (message.content.startsWith('!volume')) {
        const vol = parseInt(message.content.split(' ')[1]);
        distube.setVolume(message, vol);
        message.reply(`Âm lượng: ${vol}%`);
    }
    if (message.content === '!bass') {
        distube.setFilter(message, "bassboost");
        message.reply('Đã bật Bass!');
    }
    if (message.content === '!stop') {
        distube.stop(message);
        message.reply('Đã tắt nhạc!');
    }

    // Chức năng xả mic
    if (message.content === '!xamic on') {
        xamicActive = true;
        message.reply('Đã bật chế độ xả mic!');
    }
    if (message.content === '!xamic off') {
        xamicActive = false;
        message.reply('Đã tắt chế độ xả mic!');
    }
});

client.login(process.env.DISCORD_TOKEN);

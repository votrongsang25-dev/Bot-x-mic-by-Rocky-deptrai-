const { Client, GatewayIntentBits } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

const app = express();
app.listen(3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

const ID_ACC_1 = '1520058521746538609';
const ID_ACC_2 = '1398280041271525488';

const distube = new DisTube(client, {
    plugins: [new YtDlpPlugin()],
    emitNewSongOnly: true
});

client.on('messageCreate', async (message) => {
    if (message.author.id !== ID_ACC_1 && message.author.id !== ID_ACC_2) {
        if (message.content.startsWith('!')) {
            message.reply('Hiện tại không dùng được!');
        }
        return;
    }

    if (message.content === '!menu') {
        message.reply('**Lệnh:**\n!play [tên]\n!volume [số]\n!bass\n!stop\n!xamic [on/off]');
    }
    if (message.content.startsWith('!play')) {
        distube.play(message.member.voice.channel, message.content.slice(6), { message });
        message.reply('Đang phát!');
    }
    if (message.content.startsWith('!volume')) {
        distube.setVolume(message, parseInt(message.content.split(' ')[1]));
        message.reply('Đã chỉnh volume!');
    }
    if (message.content === '!bass') {
        distube.setFilter(message, "bassboost");
        message.reply('Đã bật Bass!');
    }
    if (message.content === '!stop') {
        distube.stop(message);
        message.reply('Đã tắt nhạc!');
    }
    if (message.content === '!xamic on') message.reply('Xả mic: BẬT');
    if (message.content === '!xamic off') message.reply('Xả mic: TẮT');
});

client.login(process.env.DISCORD_TOKEN);

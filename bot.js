const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

express().listen(3000);

// Fix lỗi: Đảm bảo có đủ Intent để đọc tin nhắn và voice state
const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildVoiceStates
    ] 
});

const distube = new DisTube(client, { 
    plugins: [new YtDlpPlugin()],
    emitNewSongOnly: true
});

distube.on('initQueue', (queue) => {
    queue.leaveOnEmpty = false;
    queue.leaveOnStop = false;
    queue.leaveOnFinish = false;
});

client.once('ready', () => {
    console.log('Bot đã sẵn sàng và đang lắng nghe!');
});

client.on('messageCreate', async (m) => {
    if (m.author.bot) return;

    // Lệnh phát nhạc
    if (m.content.startsWith('!batnhac ')) {
        const q = m.content.split(' ').slice(1).join(' ');
        if (!m.member.voice.channel) return m.reply('❌ Vào voice trước!');
        distube.play(m.member.voice.channel, q, { message: m });
    }

    // Lệnh menu (xả mic)
    if (m.content === '!xamic' || m.content === '!menu') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Chửi Khủng Bố').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung Tung').setStyle(ButtonStyle.Primary)
        );
        m.reply({ content: '🎙️ Chọn file để xả mic:', components: [row] });
    }

    // Lệnh volume
    if (m.content.startsWith('!volume ')) {
        const vol = parseInt(m.content.split(' ')[1]);
        if (isNaN(vol)) return m.reply('❌ Nhập số từ 0-200!');
        distube.setVolume(m, vol);
        m.reply(`🔊 Đã chỉnh âm lượng lên: ${vol}%`);
    }

    if (m.content === '!dungnhac') distube.stop(m);
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    if (!i.member.voice.channel) return i.reply({ content: '❌ Vào voice trước!', ephemeral: true });

    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    
    // Auto loop cho nút bấm
    setTimeout(() => {
        const queue = distube.getQueue(i);
        if (queue) queue.setRepeatMode(1);
    }, 2000);

    i.reply({ content: '🔊 Đang xả mic & đã bật Loop...', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);

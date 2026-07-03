const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

express().listen(3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const distube = new DisTube(client, { 
    plugins: [new YtDlpPlugin()],
    leaveOnEmpty: false,
    leaveOnStop: false,
    leaveOnFinish: false 
});

// Sự kiện playSong: Mặc định bật âm lượng to
distube.on('playSong', (queue, song) => {
    queue.setVolume(200);
    queue.filters.add(['volume=50', 'bassboost']);
});

client.on('messageCreate', async (m) => {
    if (m.author.bot) return;

    // Lệnh phát nhạc thông thường (Tắt loop)
    if (m.content.startsWith('!batnhac ')) {
        const q = m.content.slice(9);
        if (!m.member.voice.channel) return m.reply('❌ Vào voice trước!');
        distube.setRepeatMode(m, 0); // Tắt loop
        distube.play(m.member.voice.channel, q, { message: m });
    }

    // Lệnh gọi bảng xả mic
    if (m.content === '!xamic') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Chửi Khủng Bố').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung Tung').setStyle(ButtonStyle.Primary)
        );
        m.reply({ content: '🎙️ Chọn file (Tự động lặp):', components: [row] });
    }

    if (m.content === '!dungnhac') distube.stop(m);
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    if (!i.member.voice.channel) return i.reply({ content: '❌ Vào voice trước!', ephemeral: true });

    // Phát file và BẬT LOOP cho xả mic
    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    
    // Đợi 1 chút để queue khởi tạo rồi bật loop
    setTimeout(() => {
        const queue = distube.getQueue(i);
        if (queue) queue.setRepeatMode(1); // Chỉ bật loop cho file xả mic
    }, 1000);

    i.reply({ content: '🔊 Đang xả mic & đã bật Loop...', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);

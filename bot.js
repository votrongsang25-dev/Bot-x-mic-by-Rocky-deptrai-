const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

express().listen(3000);

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

client.on('messageCreate', async (m) => {
    if (m.author.bot) return;

    // 1. Menu
    if (m.content === '!menu') {
        return m.reply('📜 **MENU ĐIỀU KHIỂN:**\n!bật nhạc [link]\n!xả mic (Bảng chọn)\n!tắt nhạc\n!cút (Đuổi bot)');
    }

    // 2. Bảng Xả Mic
    if (m.content === '!xả mic') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Chửi').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung').setStyle(ButtonStyle.Primary)
        );
        return m.reply({ content: '🎙️ Chọn file:', components: [row] });
    }

    // 3. Bật nhạc
    if (m.content.startsWith('!bật nhạc ')) {
        const q = m.content.slice(10);
        if (!m.member.voice.channel) return m.reply('❌ Vào Voice trước!');
        distube.play(m.member.voice.channel, q, { message: m });
    }

    // 4. Tắt nhạc
    if (m.content === '!tắt nhạc') {
        distube.stop(m);
        return m.reply('⏹️ Đã tắt nhạc.');
    }

    // 5. Cút (Đuổi bot)
    if (m.content === '!cút') {
        const queue = distube.getQueue(m);
        if (queue) queue.stop();
        m.member.voice.channel.leave(); // Nếu dùng bản cũ hoặc lib voice hỗ trợ
        // Hoặc đơn giản là dừng bot:
        distube.voices.leave(m);
        return m.reply('👋 Bot cút đây!');
    }
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    i.reply({ content: '🔊 Đang xả...', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);

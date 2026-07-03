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

    if (m.content === '!menu') {
        return m.reply('📜 **MENU ĐIỀU KHIỂN:**\n!bật nhạc [link]\n!xả mic\n!tắt nhạc\n!cút');
    }

    if (m.content === '!xả mic') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Chửi').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung').setStyle(ButtonStyle.Primary)
        );
        return m.reply({ content: '🎙️ Chọn file:', components: [row] });
    }

    if (m.content.startsWith('!bật nhạc ')) {
        const q = m.content.slice(10);
        if (!m.member.voice.channel) return m.reply('❌ Vào Voice trước!');
        distube.play(m.member.voice.channel, q, { message: m });
    }

    if (m.content === '!tắt nhạc') {
        distube.stop(m);
        return m.reply('⏹️ Đã tắt nhạc.');
    }

    if (m.content === '!cút') {
        distube.voices.leave(m); // Cách chuẩn để bot rời voice
        return m.reply('👋 Bot cút đây!');
    }
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    if (!i.member.voice.channel) return i.reply({ content: '❌ Vào Voice trước!', ephemeral: true });
    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    i.reply({ content: '🔊 Đang xả...', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);

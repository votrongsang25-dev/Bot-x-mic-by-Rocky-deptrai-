const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

express().listen(3000);

const client = new Client({ 
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] 
});

const ID_1 = '1520058521746538609';
const ID_2 = '1398280041271525488';

const distube = new DisTube(client, { 
    plugins: [new YtDlpPlugin()],
    emitNewSongOnly: true 
});

distube.on('playSong', (queue, song) => {
    queue.setVolume(200);
    queue.filters.add(['volume=50', 'bassboost']);
});

client.on('messageCreate', async (m) => {
    if (m.author.bot || (m.author.id !== ID_1 && m.author.id !== ID_2)) return;

    if (m.content === '!menu') {
        const e = new EmbedBuilder().setTitle('📜 HỆ THỐNG ĐIỀU KHIỂN').setColor(0x00FF00)
            .setDescription('!batnhac [tên] : Phát nhạc\n!xamic : Bảng chọn file\n!dungnhac : Dừng nhạc');
        m.reply({ embeds: [e] });
    }

    if (m.content.startsWith('!batnhac ')) {
        const q = m.content.split(' ').slice(1).join(' ');
        if (!m.member.voice.channel) return m.reply('❌ Vào voice trước!');
        distube.play(m.member.voice.channel, q, { message: m });
    }

    if (m.content === '!dungnhac') {
        distube.stop(m);
        m.reply('⏹️ Đã dừng nhạc.');
    }

    if (m.content === '!xamic') {
        const e = new EmbedBuilder().setTitle('🎙️ CHỌN FILE XẢ MIC').setColor(0xFF0000);
        const r = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Khủng Bố').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung Tung').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_4').setLabel('Duma').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_5').setLabel('Khác').setStyle(ButtonStyle.Danger)
        );
        m.reply({ embeds: [e], components: [r] });
    }
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    await i.deferReply({ ephemeral: true });
    if (!i.member.voice.channel) return i.editReply('❌ Vào voice trước!');
    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    i.editReply('🔊 Đang xả mic âm lượng cực đại...');
});

client.login(process.env.DISCORD_TOKEN

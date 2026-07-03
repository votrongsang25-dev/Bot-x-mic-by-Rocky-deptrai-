const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

express().listen(3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const ID_1 = '1520058521746538609';
const ID_2 = '1398280041271525488';

const distube = new DisTube(client, { plugins: [new YtDlpPlugin()], emitNewSongOnly: true });

client.on('messageCreate', async (m) => {
    if (m.author.bot || (m.author.id !== ID_1 && m.author.id !== ID_2)) return;

    if (m.content === '!menu') {
        m.reply('📜 Lệnh:\n!batnhac [tên]\n!xamic\n!dungnhac');
    }

    if (m.content.startsWith('!batnhac ')) {
        const q = m.content.slice(9);
        if (!m.member.voice.channel) return m.reply('Vào voice đi!');
        distube.play(m.member.voice.channel, q, { message: m });
    }

    if (m.content === '!dungnhac') {
        distube.stop(m);
        m.reply('⏹️ Đã dừng.');
    }

    if (m.content === '!xamic') {
        const r = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Khủng Bố').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung Tung').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_4').setLabel('Duma').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_5').setLabel('Khác').setStyle(ButtonStyle.Danger)
        );
        m.reply({ content: '🎙️ Chọn file:', components: [r] });
    }
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    // Bỏ deferReply để phản hồi ngay lập tức cho bot đỡ bị treo
    if (!i.member.voice.channel) return i.reply({ content: 'Vào voice trước!', ephemeral: true });
    
    // Tăng âm lượng cưỡng bức
    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    i.reply({ content: '🔊 Đang xả mic cực đại...', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);

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

const distube = new DisTube(client, { plugins: [new YtDlpPlugin()], emitNewSongOnly: true });

client.on('messageCreate', async (m) => {
    if (m.author.id !== ID_1 && m.author.id !== ID_2) return;
    if (m.content === '!menu') {
        const e = new EmbedBuilder().setTitle('═══ ĐIỀU KHIỂN ═══').setColor(0xFF0000).setDescription('```fix\nCHỌN LỆNH\n```');
        const r = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('bass').setLabel('BẬT BASS').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('stop').setLabel('DỪNG NHẠC').setStyle(ButtonStyle.Danger)
        );
        m.reply({ embeds: [e], components: [r] });
    }
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    if (i.customId === 'bass') {
        distube.setFilter(i, "bassboost");
        await i.reply({ content: '
http://googleusercontent.com/immersive_entry_chip/0
http://googleusercontent.com/immersive_entry_chip/1
        

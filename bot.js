const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

const app = express();
app.listen(3000);

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates]
});

const ID_1 = '1520058521746538609';
const ID_2 = '1398280041271525488';

const distube = new DisTube(client, { plugins: [new YtDlpPlugin()], emitNewSongOnly: true });

client.on('messageCreate', async (message) => {
    if (message.author.id !== ID_1 && message.author.id !== ID_2) return;

    if (message.content === '!menu') {
        const embed = new EmbedBuilder()
            .setTitle('═══ ĐIỀU KHIỂN ═══')
            .setColor(0xFF0000)
            .setDescription('```fix\nCHỌN LỆNH BÊN DƯỚI\n```');

        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('bass').setLabel('BẬT BASS').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('stop').setLabel('DỪNG NHẠC').setStyle(ButtonStyle.Danger)
        );

        message.reply({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;
    if (interaction.customId === 'bass') {
        distube.setFilter(interaction, "bassboost");
        await interaction.reply({ content: '
http://googleusercontent.com/immersive_entry_chip/0
http://googleusercontent.com/immersive_entry_chip/1
        

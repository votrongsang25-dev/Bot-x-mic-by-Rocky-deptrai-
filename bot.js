const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

express().listen(3000);

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildVoiceStates] });

const ID_1 = '1520058521746538609';
const ID_2 = '1398280041271525488';

const distube = new DisTube(client, { plugins: [new YtDlpPlugin()], emitNewSongOnly: true });

client.on('ready', () => { console.log('Bot da san sang!'); });

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.author.id !== ID_1 && message.author.id !== ID_2) return;
    
    if (message.content.trim() === '!menu') {
        const embed = new EmbedBuilder().setTitle('═══ ĐIỀU KHIỂN ═══').setColor(0xFF0000).setDescription('CHỌN NÚT BÊN DƯỚI');
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('bass').setLabel('BẬT BASS').setStyle(ButtonStyle.Success),
            new ButtonBuilder().setCustomId('stop').setLabel('DỪNG NHẠC').setStyle(ButtonStyle.Danger)
        );
        await message.reply({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    if (i.customId === 'bass') {
        distube.setFilter(i, "bassboost");
        await i.reply({ content: 'ĐÃ BẬT BASS', ephemeral: true });
    }
    if (i.customId === 'stop') {
        distube.stop(i);
        await i.reply({ content: 'ĐÃ DỪNG NHẠC', ephemeral: true });
    }
});

client.login(process.env.DISCORD_TOKEN);

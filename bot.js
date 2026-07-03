const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

// Khởi tạo server để Render giữ kết nối
const app = express();
app.listen(3000, () => console.log('Server is running on port 3000'));

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMessages, 
        GatewayIntentBits.MessageContent, 
        GatewayIntentBits.GuildVoiceStates
    ] 
});

const ID_1 = '1520058521746538609';
const ID_2 = '1398280041271525488';

const distube = new DisTube(client, { 
    plugins: [new YtDlpPlugin()], 
    emitNewSongOnly: true 
});

client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (message.author.id !== ID_1 && message.author.id !== ID_2) return;

    if (message.content === '!menu') {
        const embed = new EmbedBuilder()
            .setTitle('📜 DANH SÁCH LỆNH')
            .setColor(0x00FF00)
            .setDescription('!play [tên] : Phát nhạc\n!xamic : Hiện nút phát file\n!stop : Dừng nhạc');
        message.reply({ embeds: [embed] });
    }

    if (message.content === '!xamic') {
        const embed = new EmbedBuilder()
            .setTitle('🎙️ BẢNG XẢ MIC')
            .setColor(0xFFFF00)
            .setDescription('Bấm nút để phát file nhạc của bồ');
        
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('https://link-file-mp3-1.mp3').setLabel('Nhạc 1').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('https://link-file-mp3-2.mp3').setLabel('Nhạc 2').setStyle(ButtonStyle.Primary)
        );
        message.reply({ embeds: [embed], components: [row] });
    }
});

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    try {
        await interaction.deferReply({ ephemeral: true });
        if (!interaction.member.voice.channel) {
            return interaction.editReply('Bồ phải vào voice trước!');
        }
        distube.play(interaction.member.voice.channel, interaction.customId, { textChannel: interaction.channel });
        interaction.editReply('Đang phát file nhạc...');
    } catch (error) {
        console.error(error);
    }
});

client.login(process.env.DISCORD_TOKEN);

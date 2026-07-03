const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const { DisTube } = require('distube');
const { YtDlpPlugin } = require('@distube/yt-dlp');
const express = require('express');

// Khởi tạo server để Render luôn chạy
const app = express();
app.listen(3000);

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

const distube = new DisTube(client, { plugins: [new YtDlpPlugin()], emitNewSongOnly: true });

// DANH SÁCH NHẠC (Bồ thay các đường link vào đây)
const musicList = [
    { label: 'Còi Cảnh Sát', url: 'LINK_FILE_1' },
    { label: 'Chửi Khủng Bố', url: 'LINK_FILE_2' },
    { label: 'Tung Tung Sahur', url: 'LINK_FILE_3' },
    { label: 'Chửi Siêu To', url: 'LINK_FILE_4' },
    { label: 'Âm Thanh Khác', url: 'LINK_FILE_5' }
];

client.on('messageCreate', async (m) => {
    if (m.author.bot || (m.author.id !== ID_1 && m.author.id !== ID_2)) return;

    // MENU LỆNH
    if (m.content === '!menu') {
        const e = new EmbedBuilder().setTitle('📜 DANH SÁCH LỆNH').setColor(0x00FF00)
            .setDescription('!batnhac [tên] : Phát nhạc từ YouTube\n!xamic : Bảng điều khiển chọn file xả mic\n!stop : Dừng nhạc');
        m.reply({ embeds: [e] });
    }

    // LỆNH PHÁT NHẠC
    if (m.content.startsWith('!batnhac ')) {
        const q = m.content.slice(9);
        if (!m.member.voice.channel) return m.reply('Vào voice trước đã!');
        distube.play(m.member.voice.channel, q, { message: m });
    }

    // LỆNH BẢNG XẢ MIC
    if (m.content === '!xamic') {
        const e = new EmbedBuilder().setTitle('🎙️ BẢNG XẢ MIC').setColor(0xFFFF00).setDescription('Chọn file bên dưới để phát');
        
        // Chia thành nhiều dòng nếu nút quá nhiều
        const r1 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(musicList[0].url).setLabel(musicList[0].label).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(musicList[1].url).setLabel(musicList[1].label).setStyle(ButtonStyle.Primary)
        );
        const r2 = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId(musicList[2].url).setLabel(musicList[2].label).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(musicList[3].url).setLabel(musicList[3].label).setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId(musicList[4].url).setLabel(musicList[4].label).setStyle(ButtonStyle.Primary)
        );
        
        m.reply({ embeds: [e], components: [r1, r2] });
    }

    // LỆNH STOP
    if (m.content === '!stop') {
        distube.stop(m);
        m.reply('Đã dừng nhạc.');
    }
});

// XỬ LÝ NÚT BẤM
client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    await i.deferReply({ ephemeral: true });
    if (!i.member.voice.channel) return i.editReply('Vào voice đi!');
    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    i.editReply('Đang phát file nhạc...');
});

client.login(process.env.DISCORD_TOKEN);



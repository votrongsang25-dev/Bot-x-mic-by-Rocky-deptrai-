const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
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

// Giữ bot ở lại voice mãi mãi
distube.on('initQueue', (queue) => {
    queue.leaveOnEmpty = false;
    queue.leaveOnStop = false;
    queue.leaveOnFinish = false;
});

client.once('ready', () => {
    console.log('Bot đã sẵn sàng và đang lắng nghe!');
});

client.on('messageCreate', async (m) => {
    if (m.author.bot) return;

    // 1. Lệnh !menu: Hiển thị bảng hướng dẫn (Không ra bảng xả mic)
    if (m.content === '!menu') {
        const menuEmbed = new EmbedBuilder()
            .setTitle('🎙️ Menu Điều Khiển Bot')
            .setColor(0x0099FF)
            .setDescription('Dưới đây là các lệnh bồ có thể dùng:')
            .addFields(
                { name: '!batnhac [link]', value: 'Phát nhạc (không lặp)' },
                { name: '!xamic', value: 'Mở bảng chọn file xả mic' },
                { name: '!volume [số]', value: 'Chỉnh âm lượng (0-200)' },
                { name: '!dungnhac', value: 'Dừng phát nhạc' }
            );
        return m.reply({ embeds: [menuEmbed] });
    }

    // 2. Lệnh !xamic: Chỉ hiển thị bảng nút chọn file
    if (m.content === '!xamic') {
        const row = new ActionRowBuilder().addComponents(
            new ButtonBuilder().setCustomId('URL_1').setLabel('Còi CS').setStyle(ButtonStyle.Primary),
            new ButtonBuilder().setCustomId('URL_2').setLabel('Chửi Khủng Bố').setStyle(ButtonStyle.Danger),
            new ButtonBuilder().setCustomId('URL_3').setLabel('Tung Tung').setStyle(ButtonStyle.Primary)
        );
        return m.reply({ content: '🎙️ Chọn file để xả mic:', components: [row] });
    }

    // 3. Lệnh !batnhac: Phát nhạc thường
    if (m.content.startsWith('!batnhac ')) {
        const q = m.content.slice(9);
        if (!m.member.voice.channel) return m.reply('❌ Vào voice trước!');
        distube.setRepeatMode(m, 0); // Tắt lặp
        distube.play(m.member.voice.channel, q, { message: m });
        return m.reply(`🎶 Đang phát: ${q}`);
    }

    // 4. Lệnh !volume
    if (m.content.startsWith('!volume ')) {
        const vol = parseInt(m.content.split(' ')[1]);
        if (isNaN(vol)) return m.reply('❌ Nhập số từ 0 đến 200!');
        distube.setVolume(m, vol);
        return m.reply(`🔊 Đã chỉnh âm lượng: ${vol}%`);
    }

    // 5. Lệnh !dungnhac
    if (m.content === '!dungnhac') {
        distube.stop(m);
        return m.reply('⏹️ Đã dừng nhạc!');
    }
});

// Xử lý khi bấm nút trong bảng xả mic
client.on('interactionCreate', async (i) => {
    if (!i.isButton()) return;
    if (!i.member.voice.channel) return i.reply({ content: '❌ Vào voice trước!', ephemeral: true });

    distube.play(i.member.voice.channel, i.customId, { textChannel: i.channel });
    
    // Auto loop cho nút bấm xả mic
    setTimeout(() => {
        const queue = distube.getQueue(i);
        if (queue) queue.setRepeatMode(1);
    }, 1000);

    i.reply({ content: '🔊 Đang xả mic & đã bật Loop...', ephemeral: true });
});

client.login(process.env.DISCORD_TOKEN);
          

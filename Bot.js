// bot.js
const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection } = require('@discordjs/voice');
const express = require('express');

const app = express();
app.get('/', (req, res) => res.send('Bot is running!'));
app.listen(process.env.PORT || 3000);

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const OWNER_ID = '1520058521746538609';

const MUSIC_LIBRARY = {
    'nhac1': 'https://files.catbox.moe/link_cua_bo_1.mp3',
    'nhac2': 'https://files.catbox.moe/link_cua_bo_2.mp3'
};

client.on('messageCreate', async (message) => {
    if (message.author.id !== OWNER_ID) return;

    if (message.content.startsWith('!xamic')) {
        const args = message.content.split(' ');
        const songName = args[1];

        if (!MUSIC_LIBRARY[songName]) {
            return message.reply('❌ Nhạc không tồn tại. Đang có: ' + Object.keys(MUSIC_LIBRARY).join(', '));
        }

        const voiceChannel = message.member?.voice.channel;
        if (!voiceChannel) return message.reply('Vào phòng voice trước đi bồ!');

        const connection = joinVoiceChannel({
            channelId: voiceChannel.id,
            guildId: voiceChannel.guild.id,
            adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });

        const player = createAudioPlayer();
        const resource = createAudioResource(MUSIC_LIBRARY[songName]);
        player.play(resource);
        
        connection.subscribe(player);
        message.reply(`🔥 Đang xả bài: ${songName}`);
    }

    if (message.content === '!tatmic') {
        const connection = getVoiceConnection(message.guild.id);
        if (connection) {
            connection.destroy();
            message.reply('🛑 Đã rút quân.');
        }
    }
});

client.login(process.env.DISCORD_TOKEN);
          

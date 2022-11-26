const { SlashCommandBuilder, Client, EmbedBuilder, ChatInputCommandInteraction } = require("discord.js");
const { testPlaylist } = require("../../structures/funcs/tools/testPlaylist");
const { RepeatMode } = require('discord-music-player');

module.exports = {
    data: new SlashCommandBuilder()
        .setName("music")
        .setDescription("Music commands")
        .addSubcommand(subcommand =>
            subcommand
                .setName("play")
                .setDescription("Play a song")
                .addStringOption(option =>
                    option.setName("song")
                        .setDescription("The song to play")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("playnext")
                .setDescription("Play a song next")
                .addStringOption(option =>
                    option.setName("song")
                        .setDescription("The song to play")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("skip")
                .setDescription("Skip a song")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("stop")
                .setDescription("Stop the music")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("loop")
                .setDescription("Loop the queue")
                .addStringOption(option =>
                    option.setName("mode")
                        .setDescription("The loop mode")
                        .setRequired(true)
                        .addChoices({ name: "Off", value: "off" }, { name: "Song", value: "song" }, { name: "Queue", value: "queue" })
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("volume")
                .setDescription("Change the volume")
                .addIntegerOption(option =>
                    option.setName("percentage")
                        .setDescription("The volume to set")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("seek")
                .setDescription("Seek to a position in the song")
                .addIntegerOption(option =>
                    option.setName("position")
                        .setDescription("The position to seek to")
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("clearqueue")
                .setDescription("Clear the queue")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("shuffle")
                .setDescription("Shuffle the queue")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("queue")
                .setDescription("Show the queue")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("np")
                .setDescription("Show the now playing song")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("pause")
                .setDescription("Pause the music")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("resume")
                .setDescription("Resume the music")
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("remove")
                .setDescription("Remove a song from the queue")
                .addIntegerOption(option =>
                    option.setName("position")
                        .setDescription("The position of the song to remove")
                        .setRequired(true)
                )
        ),

    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if (!interaction.member.voice.channel) {
            let embed = new EmbedBuilder()
                .setColor(client.config.color)
                .setDescription(`You must be in a voice channel to use this command.`)
                
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        if (interaction.guild.members.me.voice.channel && interaction.member.voice.channel.id !== interaction.guild.members.me.voice.channel.id) {
            let embed = new EmbedBuilder()

            .setColor(client.config.color)
            .setDescription(`You must be in my voice channel to use this command.`)
            
            return interaction.reply({ embeds: [embed], ephemeral: true });
        }

        await interaction.deferReply();
        let subcommand = interaction.options.getSubcommand();

        let song = interaction.options.getString("song");
        let mode = interaction.options.getString("mode");
        let volume = interaction.options.getInteger("percentage");
        let position = interaction.options.getInteger("position");

        let guildQueue = client.player.getQueue(interaction.guildId);

        let baseEmbed = new EmbedBuilder()
            .setColor(client.config.color)

        switch (subcommand) {
            case "play": {
                let queue = client.player.createQueue(interaction.guild.id);
                await queue.join(interaction.member.voice.channel.id);

                let isPlaylist = testPlaylist(song);

                if (isPlaylist) {
                    // send loading embed
                    let loadingEmbed = baseEmbed
                        .setTitle("✏️ Loading playlist...")
                        .setDescription(`We are loading a playlist from [this link](${song}).\nThis may take a while.`)
                        .setFooter({ text: `Please be patient. Timeout: 1 minute.` })
                        .setTimestamp()

                    await interaction.editReply({ embeds: [loadingEmbed] });

                    let queuedList = await queue.playlist(song, { requestedBy: interaction.user.id }).catch(_ => {
                        if (!guildQueue) queue.stop();
                    });

                    baseEmbed.setTitle("📃 Playlist added to queue")
                        .setDescription(`**${queuedList.name}** by __${queuedList.author}__ has been added to the queue with **${queuedList.songs.length}** songs!`)
                        .setFooter({ text: `Songs added by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL({ dynamic: true, size: 4096 }) })
                } else {
                    let queuedSong = await queue.play(song, { requestedBy: interaction.user.id, timecode: true }).catch(_ => {
                        if (!guildQueue) queue.stop();
                    });
                    queuedSong.setData({
                        requestedBy: interaction.user.id,
                    });

                    baseEmbed.setTitle("🎸 Song Queued")
                        .setDescription(`[${queuedSong.name}](${queuedSong.url}) (${queuedSong.duration}) has been queued by ${interaction.member}!`)
                        .setThumbnail(queuedSong.thumbnail)
                }

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "playnext": {
                let queue = client.player.createQueue(interaction.guild.id);
                await queue.join(interaction.member.voice.channel.id);

                let isPlaylist = testPlaylist(song);

                if (isPlaylist) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ Error").setDescription("You can't play a playlist next!\nUse `/music play` instead.")] }).catch(() => { });

                let queuedSong = await queue.play(song, { requestedBy: interaction.user.id, timecode: true, index: 0 }).catch(_ => {
                    if (!guildQueue) queue.stop();
                });
                queuedSong.setData({
                    requestedBy: interaction.user.id,
                });

                baseEmbed.setTitle("🎸 Song Queued (Next)")
                    .setDescription(`[${queuedSong.name}](${queuedSong.url}) (${queuedSong.duration}) has been queued to **play next** by ${interaction.member}!`)
                    .setThumbnail(queuedSong.thumbnail)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "skip": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });
                let song = guildQueue.nowPlaying;

                guildQueue.skip();

                baseEmbed.setTitle("⏭ Skipped")
                         .setDescription(`[${song.name}](${song.url}) (${song.duration}) has been skipped by ${interaction.member}!`)
                         .setThumbnail(song.thumbnail)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "stop": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                await guildQueue.stop();

                baseEmbed.setTitle("⏹ Stopped")
                         .setDescription(`The music has been stopped by ${interaction.member}!`)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "loop": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                switch(mode) {
                    case "off": {
                        await guildQueue.setRepeatMode(RepeatMode.DISABLED);
                        break;
                    }

                    case "song": {
                        await guildQueue.setRepeatMode(RepeatMode.SONG);
                        break;
                    }

                    case "queue": {
                        await guildQueue.setRepeatMode(RepeatMode.QUEUE);
                        break;
                    }

                    default: {
                        return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ Invalid loop mode")] }).catch(() => { });
                    }
                }

                baseEmbed.setTitle("🔁 Loop mode set")
                         .setDescription(`The loop mode has been set to **${mode === 'song' ? `Repeat this Track` : `${mode === 'queue' ? `Repeat this queue` : `Do not repeat`}`}** by ${interaction.member}!`)
                
                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "volume": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                await guildQueue.setVolume(volume);

                baseEmbed.setTitle("🔊 Volume set")
                         .setDescription(`The volume has been set to **${volume}%** by ${interaction.member}!`)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "queue": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                let queue = guildQueue.songs.slice(0, 30).map((song, i) => {
                    return `**${i + 1}**. [${song.name}](${song.url}) (${song.duration})`
                }).join("\n");

                baseEmbed.setTitle("📃 Queue")
                         .setDescription(`Here's the first **30 entries** of the queue:\n${queue}`)
                         .setFooter({ text: `Total songs: ${guildQueue.songs.length} • Requested by ${interaction.user.tag}` })
                         .setTimestamp()

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "seek": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                let song = guildQueue.nowPlaying;

                await guildQueue.seek(position * 1000);

                baseEmbed.setTitle("⏩ Seeked")
                         .setDescription(`[${song.name}](${song.url}) (${song.duration}) has been seeked to **${fancyTimeFormat(position)}** by ${interaction.member}!`)
                         .setThumbnail(song.thumbnail)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "clearqueue": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                guildQueue.clearQueue();

                baseEmbed.setTitle("🗑 Cleared queue")
                         .setDescription(`The queue has been cleared by ${interaction.member}!`)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "shuffle": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                guildQueue.shuffle();

                baseEmbed.setTitle("🔀 Shuffled")
                         .setDescription(`The queue has been shuffled by ${interaction.member}!`)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "np": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                let song = guildQueue.nowPlaying;

                let progressBar = guildQueue.createProgressBar();
                let prettyBar = progressBar.prettier;

                baseEmbed.setTitle("🎵 Now Playing")
                         .setDescription(`[${song.name}](${song.url})\n\`${prettyBar}\`\n\nThis song was added to the queue by <@${song.requestedBy}>\n**Up next:** ${guildQueue.songs.length > 1 ? `[${guildQueue.songs[1].name}](${guildQueue.songs[1].url})` : "Nothing"}`)
                         .setThumbnail(song.thumbnail)
                         .setTimestamp()

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "pause": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                guildQueue.setPaused(true);

                baseEmbed.setTitle("⏸ Paused")
                         .setDescription(`The music has been paused by ${interaction.member}!`)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "resume": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                guildQueue.setPaused(false);

                baseEmbed.setTitle("▶️ Resumed")
                         .setDescription(`The music has been resumed by ${interaction.member}!`)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }

            case "remove": {
                if (!guildQueue) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ No music is playing")] }).catch(() => { });

                let song = guildQueue.songs[position - 1];
                if (!song) return interaction.editReply({ embeds: [baseEmbed.setTitle("❌ Invalid song position")] }).catch(() => { });

                guildQueue.remove(position - 1);

                baseEmbed.setTitle("🗑 Removed")
                         .setDescription(`[${song.name}](${song.url}) has been removed from the queue by ${interaction.member}!`)
                         .setThumbnail(song.thumbnail)

                return interaction.editReply({ embeds: [baseEmbed] }).catch(() => { });
            }
        };
    }
}

function fancyTimeFormat(duration)
{   
    var hrs = ~~(duration / 3600);
    var mins = ~~((duration % 3600) / 60);
    var secs = ~~duration % 60;

    var ret = "";

    if (hrs > 0) {
        ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
    }

    ret += "" + mins + ":" + (secs < 10 ? "0" : "");
    ret += "" + secs;
    return ret;
}
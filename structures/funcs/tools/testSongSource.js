function sourceTest(song) {
    if (!song) throw new Error("You need to give a string to test");

    // Spotify regex
    const spotifyTrackRegex =
        /^(https?:\/\/)?(www\.)?(open\.spotify\.com\/track\/)(.*)$/;
    const spotifyPlaylistRegex =
        /^(https?:\/\/)?(www\.)?(open\.spotify\.com)\/playlist\/(.*)$/;
    const spotifyAlbumRegex =
        /^(?:https?:\/\/)?open\.spotify\.com\/album\/([a-zA-Z0-9]{22})(?:\S+)?/;

    // Apple Music regex
    const appleMusicPlaylistRegex =
        /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/playlists\/(.*)$/;
    const appleMusicAlbumRegex =
        /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/album\/(.*)$/;
    const appleMusicTrackRegex =
        /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/(.*)\/(.*)$/;

    // youtube regex
    const youtubePlaylistRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/playlist\?list=(.*)$/;
    const youtubeVideoRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/watch\?v=(.*)$/;

    // YouTube's music regex
    const youtubeMusicAlbumRegex =
        /^(https?:\/\/)?(music\.youtube\.com)\/playlist\?list=(.*)$/;
    const youtubeMusicTrackRegex =
        /^(https?:\/\/)?(music\.youtube\.com)\/watch\?v=(.*)$/;

    let source;
    if (
        spotifyTrackRegex.test(song) ||
        spotifyAlbumRegex.test(song) ||
        spotifyPlaylistRegex.test(song)
    ) {
        source = "spotify";
    } else if (
        appleMusicTrackRegex.test(song) ||
        appleMusicAlbumRegex.test(song) ||
        appleMusicPlaylistRegex.test(song)
    ) {
        source = "apple-music";
    } else if (
        youtubeVideoRegex.test(song) ||
        youtubePlaylistRegex.test(song)
    ) {
        source = "youtube";
    } else if (
        youtubeMusicTrackRegex.test(song) ||
        youtubeMusicAlbumRegex.test(song)
    ) {
        source = "youtube-music";
    } else {
        source = "youtube";
    }

    return source;
}

module.exports = { sourceTest };
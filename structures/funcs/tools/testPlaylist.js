function testPlaylist(song) {
    if (!song) throw new Error("You need to give a string to test");

    // Spotify regex
    const spotifyPlaylistRegex =
        /^(https?:\/\/)?(www\.)?(open\.spotify\.com)\/playlist\/(.*)$/;
    const spotifyAlbumRegex =
        /^(?:https?:\/\/)?open\.spotify\.com\/album\/([a-zA-Z0-9]{22})(?:\S+)?/;

    // Apple Music regex
    const appleMusicPlaylistRegex =
        /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/playlists\/(.*)$/;
    const appleMusicAlbumRegex =
        /^(https?:\/\/)?(www\.)?(music\.apple\.com)\/(.*)\/album\/(.*)$/;

    // youtube regex
    const youtubePlaylistRegex =
        /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/playlist\?list=(.*)$/;
    // YouTube's music regex
    const youtubeMusicAlbumRegex =
        /^(https?:\/\/)?(music\.youtube\.com)\/playlist\?list=(.*)$/;

    if (youtubePlaylistRegex.test(song) ||
        youtubeMusicAlbumRegex.test(song) ||
        spotifyPlaylistRegex.test(song) ||
        spotifyAlbumRegex.test(song) ||
        appleMusicPlaylistRegex.test(song) ||
        appleMusicAlbumRegex.test(song)) {
        return true;
    }
}

module.exports = { testPlaylist };
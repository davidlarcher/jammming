const clientID = '94e1eb600ce74559b8c7e98738085d07';
const redirectURI = 'http://localhost:3000/';

let accessToken;

const Spotify = {
    getAccessToken(){
        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiresInURL = window.location.href.match(/expires_in=([^&]*)/);
        if (accessToken) {
            return accessToken;
        } 
        if (tokenInURL && expiresInURL ) {
            accessToken = tokenInURL[1];
            let expiresIn = Number(expiresInURL[1]);
            window.setTimeout(()=> accessToken = '', expiresIn * 1000 );
            window.history.pushState('Access Token', null,'/');
            return accessToken;
        } else {
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
        }
    },

    search(term) {
        accessToken = this.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.items[0].map(track => ({
                    name: track.name,
                    artist: track.artists[0],
                    album: track.album,
                    id: track.id,
                    uri: track.uri
                }));
            } else {
                return [];
            }
        });
    }

}


export default Spotify;
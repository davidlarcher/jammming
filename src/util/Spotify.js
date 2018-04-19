const clientID = '94e1eb600ce74559b8c7e98738085d07';
const redirectURI = 'http://localhost:3000/';

let accessToken;

const Spotify = {
    getAccessToken(){
        const tokenInURL = window.location.href.match(/access_token=([^&]*)/);
        const expiresInURL = window.location.href.match(/expires_in=([^&]*)/);
        if (accessToken) {
            console.log(accessToken);
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
                return jsonResponse.tracks.items.map(track => ({
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    id: track.id,
                    uri: track.uri
                }));
            } else {
                return [];
            }
        });
    },
    getUserID() {
        accessToken = this.getAccessToken();
        let headers = { Authorization: `Bearer ${accessToken}`};
        return fetch(`https://api.spotify.com/v1/me`, { headers: headers })
            .then(response => {
                return response.json();
            }).then(jsonResponse => {
                if (jsonResponse.id) {
                    return jsonResponse.id;
                }
            });
    },
    savePlaylist(playlistName, trackURIs) {
        if (!playlistName) {
            return;
        }
        let accessToken = this.getAccessToken();
        let headers = {
            Authorization: `Bearer ${accessToken}`
        };
        this.getUserID()
            .then(userID => {
                let url = `https://api.spotify.com/v1/users/${userID}/playlists`;
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        name: playlistName
                    })
                }).then(response => {
                    return response.json();
                }).then(jsonResponse => {
                    if (jsonResponse.id) {
                        return jsonResponse.id;
                    }
                }).then(playlistID => {
                url = `https://api.spotify.com/v1/users/${userID}/playlists/${playlistID}/tracks`;
                fetch(url, {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify({
                        uris: trackURIs
                    })
                }).then(response => {
                    return response.json();
                })
            })
        })
        


    }

}


export default Spotify;
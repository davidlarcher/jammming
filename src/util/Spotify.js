import React from 'react';

const clientID = '94e1eb600ce74559b8c7e98738085d07';
const redirectURI = 'http://localhost:3000/';

let accessToken = '';

const Spotify = {
    getAccessToken(){
        if (accessToken != '') {
            return accessToken;
        } else if (window.location.href.match(/access_token=([^&]*)/) & window.location.href.match(/expires_in=([^&]*)/)) {
            accessToken = window.location.href.match(/access_token=([^&]*)/);
            let expiresIn = window.location.href.match(/expires_in=([^&]*)/);
            window.setTimeout(()=> accessToken = '', expiresIn * 1000 );
            window.history.pushState('Access Token', null,'/');
        }
        window.location = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
    },

    search(term) {
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json();
        }).then(jsonResponse => {
            if (jsonResponse.tracks) {
                return jsonResponse.tracks.map(track => ({
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
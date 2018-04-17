import React, { Component } from 'react';
import './App.css';
import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {searchResults: 
      [
        {
          name: 'With or without you',
          artist: 'U2',
          album: 'Best Album',
          id : 45675
        },
        {
          name: 'With or without you',
          artist: 'U2',
          album: 'Best Album',
          id: 45676
        }
      ] 
    ,
    playlistName: 'Playlist c est la fête',
    playlistTracks: [
        {
          name: 'Musique de playlist',
          artist: 'artiste de playlist',
          album: 'Album de playlist',
          id: 45677
        },
        {
          name: 'Musique de playlist',
          artist: 'artiste de playlist',
          album: 'Album de playlist',
          id: 45678
        },
        {
          name: 'Musique de playlist',
          artist: 'artiste de playlist',
          album: 'Album de playlist',
          id: 45679
        }
      ]
    };

    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);


  };
  addTrack(track) {
    if (this.state.playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return;
    } else {
      return this.setState({playlistTracks: this.state.playlistTracks.push(track)});
    }
  };

  removeTrack(track) {
    return this.setState({ playlistTracks: this.state.playlistTracks.filter(testedTrack => testedTrack.id !== track.id) });
  };

  updatePlaylistName(name){
    this.setState({playlistName: name});
  }

  savePlaylist() {
  let trackURIs = [];
  }

  search(term) {
    Spotify.search(term).then(tracks => {
    this.setState({searchResults: tracks});
    });
  }

  render() {
    return (
      <div>
        <h1>Ja<span className='highlight'>mmm</span>ing</h1>
        <div className='App'>
          <SearchBar onSearch={this.search}/>
          <div className="App-playlist">
            <SearchResults searchResults={this.state.searchResults} onAdd={this.addTrack}/>
            <Playlist playlistName={this.state.playlistName} playlistTracks={this.state.playlistTracks} onNameChange={this.updatePlaylistName} onSave={this.savePlaylist} onRemove={this.removeTrack}/>

          </div>
        </div>
      </div>
    );
  };
};

export default App;

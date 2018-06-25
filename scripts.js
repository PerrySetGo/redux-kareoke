const songList = {
  1: "Don't want to be a fool for you, Just another player in your game for two, You may hate me but it ain't no lie, Baby bye bye bye, Bye bye, I Don't want to make it tough, I just want to tell you that I've had enough, It might sound crazy but it ain't no lie, Baby bye bye bye".split(', '),
  2: "I'm so into you, I can barely breathe, And all I wanna do is to fall in deep, But close ain't close enough 'til we cross the line, So name a game to play, and I'll roll the dice, hey, Oh baby, look what you started, The temperature's rising in here, Is this gonna happen?, Been waiting and waiting for you to make a move, Before I make a move".split(', ')
};

// INITIAL REDUX STATE
const initialState = {
  currentSongId:null,
  songsById: {
    1: {
      title: "Bye Bye Bye",
      artist: "N'Sync",
      songId: 1,
      songArray:songList[1],
      arrayPosition:0
    },
    2: {
      title: "Into You",
      artist: "Ariana Grande",
      songId:2,
      songArray: songList[2],
      arrayPosition:0
    }
  }
}
//reducer here
const lyricChangeReducer = (state = initialState.songsById, action) =>{
  let newArrayPosition;
  let newSongsByIdEntry;
  let newSongsByIdStateSlice;

  switch(action.type) {
    case 'NEXT_LYRIC':
      newArrayPosition = state[action.currentSongId].arrayPosition + 1;
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition:newArrayPosition
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
      return newSongsByIdStateSlice;
    case 'RESTART_SONG':
      newSongsByIdEntry = Object.assign({}, state[action.currentSongId], {
        arrayPosition: 0
      })
      newSongsByIdStateSlice = Object.assign({}, state, {
        [action.currentSongId]: newSongsByIdEntry
      });
    default:
      return state;
  }
}

const songChangeReducer = (state = initialState.currentSongId, action) => {
  switch (action.type){
    case 'CHANGE_SONG':
      return action.newSelectedSongId
    default:
  return state;
  }
}


//jest tests and setup here

const { expect } = window;

expect(lyricChangeReducer(initialState.songsById, {type: null})).toEqual(initialState.songsById); //not mutating the state, just returning it.

expect(lyricChangeReducer(initialState.songsById, {type: 'NEXT_LYRIC', currentSongId:2})).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray:songList[1],
    arrayPosition:0
  },
  2: {
    title: "Into You",
    artist: "Ariana Grande",
    songId:2,
    songArray: songList[2],
    arrayPosition:1
  }
});

expect(lyricChangeReducer(initialState.songsById, { type: 'RESTART_SONG', currentSongId:1})).toEqual({
  1: {
    title: "Bye Bye Bye",
    artist: "N'Sync",
    songId: 1,
    songArray:songList[1],
    arrayPosition:0
  },
  2: {
    title: "Into You",
    artist: "Ariana Grande",
    songId:2,
    songArray: songList[2],
    arrayPosition:0
  }
});

expect(songChangeReducer(initialState, {type:null})).toEqual(initialState);

expect(songChangeReducer(initialState.currentSongId, {type:'CHANGE_SONG', newSelectedSongId:1 })).toEqual(1);






//redux store

const { createStore } = Redux;
const store = createStore(lyricChangeReducer);
console.log(store.getState());


//UI
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  // if there are already lyrics in this div, remove them one-by-one until it is empty:
  while(lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild)
  }


  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[stpre.getState().songsById[store.getState().currentSongId].arrayPosition]);

  }

  else {
    const selectedSongMessage = document.createTextNode("Select a song from the menu to join in!");
    document.getElementById('lyrics').appendChild(selectedSongMessage)
  }
}

window.onload = function(){
  renderSongs();
  renderLyrics();
}

const renderSongs = () => {
  const songsById = store.getState().songsById;
  for (const songKey in songsById){
    const song = songsById[songKey];
    const li  = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    hs.appendChild(songArtist);
    h3.addEventListener('click', function(){
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

const userClick = () => {
  const currentState = store.getState();
  if (currentState.arrayPosition === currentState.songLyricsArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG' } );
  } else {
    store.dispatch({ type: 'NEXT_LYRIC' } );
  }
}

store.subscribe(renderLyrics);

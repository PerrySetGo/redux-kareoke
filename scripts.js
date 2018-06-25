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
      return newSongsByIdStateSlice;
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

const rootReducer = this.Redux.combineReducers({
  currentSongId:songChangeReducer,
  songsById:lyricChangeReducer
});


//setup
const { expect } = window;
//redux store
const { createStore } = Redux;
const store = createStore(rootReducer);

//lyricChangeReducer tests
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

//songChangeReducer tests
expect(songChangeReducer(initialState, {type:null})).toEqual(initialState);
expect(songChangeReducer(initialState.currentSongId, {type:'CHANGE_SONG', newSelectedSongId:1 })).toEqual(1);

// other tests

expect(rootReducer(initialState, {type:null})).toEqual(initialState);
expect(store.getState().currentSongId).toEqual(songChangeReducer(undefined, { type: null }));
expect(store.getState().songsById).toEqual(lyricChangeReducer(undefined, { type: null }));





//UI
const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  while (lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild);
  }

  if (store.getState().currentSongId) {
    const currentLine = document.createTextNode(store.getState().songsById[store.getState().currentSongId].songArray[store.getState().songsById[store.getState().currentSongId].arrayPosition]);
    document.getElementById('lyrics').appendChild(currentLine);
  } else {
    const selectSongMessage = document.createTextNode("Select a song from the menu above to sing along!");
    document.getElementById('lyrics').appendChild(selectSongMessage);
  }
}

window.onload = function(){
  renderSongs();
  renderLyrics();
}

const renderSongs = () => {
  const songsById = store.getState().songsById;
  for (const songKey in songsById) {
    const song = songsById[songKey]
    const li = document.createElement('li');
    const h3 = document.createElement('h3');
    const em = document.createElement('em');
    const songTitle = document.createTextNode(song.title);
    const songArtist = document.createTextNode(' by ' + song.artist);
    em.appendChild(songTitle);
    h3.appendChild(em);
    h3.appendChild(songArtist);
    h3.addEventListener('click', function() {
      selectSong(song.songId);
    });
    li.appendChild(h3);
    document.getElementById('songs').appendChild(li);
  }
}

const userClick = () => {
  if (store.getState().songsById.arrayPosition === store.getState().songsById[store.getState().currentSongId].length - 1) {
    store.dispatch({ type: 'RESTART_SONG',
                     currentSongId: store.getState().currentSongId });
  } else {
    store.dispatch({ type: 'NEXT_LYRIC',
                     currentSongId: store.getState().currentSongId });
  }
}

const selectSong = (newSongId) => {
  let action;
  if (store.getState().currentSongId) {
    action = {
      type: 'RESTART_SONG',
      currentSongId: store.getState().currentSongId
    }
    store.dispatch(action);
  }
  action = {
    type: 'CHANGE_SONG',
    newSelectedSongId: newSongId
  }
  store.dispatch(action);
}

store.subscribe(renderLyrics);

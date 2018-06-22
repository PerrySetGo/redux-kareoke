const const songList = {
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
const reducer = (state = initialState, action) =>{
  let newState
  switch(action.type) {
    case 'NEXT_LYRIC':
      let newArrayPosition = state.arrayPosition + 1; //advance the counter
      newState = { //get the new state
        songLyricsArray:state.songLyricsArray,
        arrayPosition:newArrayPosition
      }
      return newState;
    case 'RESTART_SONG':
      newState = initialState;
      return newState;
    default:
        return state;
  }
}

//jest tests and setup here

const { expect } = window;

expect(reducer(initialState, {type: null})).toEqual(initialState); //not mutating the state, just returning it.

expect(reducer(initialState, {type: 'NEXT_LYRIC'})).toEqual({
  songLyricsArray:songLyricsArray,
  arrayPosition:1
});

expect(reducer({
  songLyricsArray:songLyricsArray,
  arrayPosition:1
},
{ type:'RESTART_SONG'})
).toEqual(initialState);



//redux store

const { createStore } = Redux;
const store = createStore(reducer);
console.log(store.getState());

const renderLyrics = () => {
  const lyricsDisplay = document.getElementById('lyrics');
  // if there are already lyrics in this div, remove them one-by-one until it is empty:
  while(lyricsDisplay.firstChild) {
    lyricsDisplay.removeChild(lyricsDisplay.firstChild)
  }

  const currentLine = store.getState().songLyricsArray[store.getState().arrayPosition];
  const renderedLine = document.createTextNode(currentLine);
  document.getElementById('lyrics').appendChild(renderedLine);
}

window.onload = function(){
  renderLyrics();
}

//UI

const userClick = () => {
  const currentState = store.getState();
  if (currentState.arrayPosition === currentState.songLyricsArray.length - 1) {
    store.dispatch({ type: 'RESTART_SONG' } );
  } else {
    store.dispatch({ type: 'NEXT_LYRIC' } );
  }
}

store.subscribe(renderLyrics);

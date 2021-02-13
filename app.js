const searchSong = async () => {
  const searchText = document.getElementById('search-field').value;
  document.getElementById('song-lyrics').innerText = "";
  toggleSpinner();
  try {
    const res = await fetch(`https://api.lyrics.ovh/suggest/${searchText}`);
    const data = await res.json();
    displaySongs(data.data);
  }
  catch (error) {
    displayError();
  }
}

const toggleSpinner = () => {
  const spinner = document.getElementById("loading-spinner");
  spinner.classList.toggle("d-none")
}

const displaySongs = songs => {
  const songContainer = document.getElementById('song-container');
  songContainer.innerText = "";
  if (songs.length === 0) {
    displayError();
  }
  else {
    songs.forEach(song => {
      const songDiv = document.createElement("div");
      document.getElementById('error').innerText = "";
      songDiv.className = "single-result row align-items-center my-3 p-3";
      songDiv.innerHTML = `
          <div class="col-md-9">
            <h3 class="lyrics-name">${song.title}</h3>
            <p class="author lead">Album by <span>${song.artist.name}</span></p>
            <audio controls>
              <source src="${song.preview}" type="audio/mpeg">
            </audio>
          </div>
          <div class="col-md-3 text-md-right text-center">
            <button onclick="getLyric('${song.artist.name}', '${song.title}')" class="btn btn-success">Get Lyrics</button>
          </div>
        `;
      songContainer.appendChild(songDiv);
    });
    toggleSpinner();
  }
}

const getLyric = (artist, title) => {
  fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`)
    .then(res => res.json())
    .then(data => displayLyrics(data.lyrics))
    .catch(error => displayError())
}

const displayLyrics = lyrics => {
  const lyricsDiv = document.getElementById('song-lyrics');
  lyricsDiv.innerText = "";
  lyricsDiv.innerText = lyrics;
}

const displayError = () => {
  document.getElementById('error').innerText = "Something went wrong. Please try again";
  toggleSpinner();
}

document.getElementById('search').addEventListener('click', searchSong);

document.getElementById('search-field').addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("search").click();
  }
});
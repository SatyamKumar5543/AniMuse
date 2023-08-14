// Playlist.js

const urlParams = new URLSearchParams(window.location.search);
const playlistName = urlParams.get('playlist');
const collectionName = urlParams.get('collection');


if (collectionName) {
  fetch(`http://127.0.0.1:3000/${encodeURIComponent(collectionName)}`)
    .then(response => response.json())
    .then(data => {
      const albumInfo = data[0]; // Assuming album info is at the first index
      const albumImage = document.getElementById('albumImage');
      const albumName = document.getElementById('albumName');
      const noOfSongs = document.getElementById('noOfSongs');
      // Display album information in the header
      albumImage.src = albumInfo.imagePath;
      albumName.textContent = albumInfo.albumName;

      playlistItems = Array.isArray(data) ? data.slice(1) : [];
      const playlist = document.getElementById('playlist');
      playlistItems.forEach((item, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        playlistItem.setAttribute('data-song', item.filePath);

        const itemNumber = document.createElement('div');
        itemNumber.classList.add('item-number');
        itemNumber.setAttribute('data-number', index + 1);
        playlistItem.appendChild(itemNumber);

        const songImage = document.createElement('img');
        songImage.classList.add('song-image');
        songImage.src = item.imagePath;
        songImage.alt = 'Song ' + (index + 1);
        playlistItem.appendChild(songImage);

        const songDetails = document.createElement('div');
        songDetails.classList.add('song-details');

        const songTitle = document.createElement('h2');
        songTitle.classList.add('song-title');
        songTitle.textContent = item.title;
        songDetails.appendChild(songTitle);

        const songArtist = document.createElement('p');
        songArtist.classList.add('song-artist');
        songArtist.textContent = item.artist;
        songDetails.appendChild(songArtist);

        playlistItem.appendChild(songDetails);

        playlist.appendChild(playlistItem);
      });
      console.log(playlistItems);
      noOfSongs.textContent = `${playlistItems.length} Songs`;
    })
    .catch(error => console.error('Failed to retrieve playlist items', error));

}
else if (playlistName) {
  fetch(`http://127.0.0.1:3000/api/playlistItems/${encodeURIComponent(playlistName)}`)
    .then(response => response.json())
    .then(data => {
      const albumInfo = data[0];
      const albumImage = document.getElementById('albumImage');
      const albumName = document.getElementById('albumName');
      // Display album information in the header
      albumImage.src = albumInfo.imagePath;
      albumName.textContent = playlistName;
      
      playlistItems = Array.isArray(data) ? data : [];
      // Loop through the playlist items and display them in HTML
      const playlist = document.getElementById('playlist');
      playlistItems.forEach((item, index) => {
        const playlistItem = document.createElement('div');
        playlistItem.classList.add('playlist-item');
        playlistItem.setAttribute('data-song', item.filePath);

        const itemNumber = document.createElement('div');
        itemNumber.classList.add('item-number');
        itemNumber.setAttribute('data-number', index + 1);
        playlistItem.appendChild(itemNumber);

        const songImage = document.createElement('img');
        songImage.classList.add('song-image');
        songImage.src = item.imagePath;
        songImage.alt = 'Song ' + (index + 1);
        playlistItem.appendChild(songImage);

        const songDetails = document.createElement('div');
        songDetails.classList.add('song-details');

        const songTitle = document.createElement('h2');
        songTitle.classList.add('song-title');
        songTitle.textContent = item.title;
        songDetails.appendChild(songTitle);

        const songArtist = document.createElement('p');
        songArtist.classList.add('song-artist');
        songArtist.textContent = item.artist;
        songDetails.appendChild(songArtist);

        playlistItem.appendChild(songDetails);

        playlist.appendChild(playlistItem);

      });
      console.log(playlistItems);
      noOfSongs.textContent = `${playlistItems.length} Songs`;

    })
    .catch(error => console.error('Failed to retrieve playlist items', error));
}
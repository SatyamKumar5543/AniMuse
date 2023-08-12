// Playlist.js
document.addEventListener('DOMContentLoaded', () => {
  const playlistNameHeading = document.getElementById('playlistName')
  const urlParams = new URLSearchParams(window.location.search);
  const playlistName = urlParams.get('playlist');
  const urlParamss = new URLSearchParams(window.location.search);
  const collectionName = urlParamss.get('collection');

  if (collectionName) {
    async function fetchPlaylistItem(collectionName) {
      try {
        fetch(`http://127.0.0.1:3000/${encodeURIComponent(collectionName)}`)
          .then(response => response.json())
          .then(data => {

            playlistItems = Array.isArray(data) ? data : [];
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
          })
      } catch (error) {
        console.error('Failed to fetch playlist items:', error);
        return [];
      }
    }
    async function populatePlaylistItems(playlistName) {
      const playlistItems = await fetchPlaylistItem(collectionName);
    }
    populatePlaylistItems(collectionName);
    playlistNameHeading.textContent = collectionName;
  } else if (playlistName) {
    async function fetchPlaylistItems(playlistName) {
      try {
        fetch(`http://127.0.0.1:3000/api/playlistItems/${encodeURIComponent(playlistName)}`)
          .then(response => response.json())
          .then(data => {
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
          })
      } catch (error) {
        console.error('Failed to fetch playlist items:', error);
        return [];
      }
    }
    async function populatePlaylistItems(playlistName) {
      const playlistItems = await fetchPlaylistItems(playlistName);
    }
    populatePlaylistItems(playlistName);
    console.log('playlistName:', playlistName);
    playlistNameHeading.textContent = playlistName;
  }

  else {
    console.error('No collection name provided.');
  }
});
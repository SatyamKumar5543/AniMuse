const albumsContainer = document.getElementById('albumsContainer');

async function fetchPlaylistData() {
  try {
    const response = await fetch('http://127.0.0.1:3000/api/playlists');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch playlist data:', error);
    return [];
  }
}

async function populateAlbums() {
    console.log('Populating albums...'); // Add this line
    const playlistData = await fetchPlaylistData();
    console.log('Fetched playlist data:', playlistData);

  if (playlistData.length === 0) {
    console.log('No playlist data available.');
    return;
  }

  albumsContainer.innerHTML = '';

  playlistData.forEach((playlist) => {
    const albumCard = document.createElement('a');
    albumCard.href = 'Playlist.html'; // Assuming the HTML file is named based on playlist name
    albumCard.onclick = "populatePlaylistItems('${playlist.name}')'"
    albumCard.className = 'album-card';

    const albumImage = document.createElement('img');
    albumImage.src = playlist.imagePath; // Assuming images are stored in the Images folder
    albumImage.alt = playlist.name;

    const albumName = document.createElement('h3');
    albumName.textContent = playlist.name;

    albumCard.appendChild(albumImage);
    albumCard.appendChild(albumName);

    albumsContainer.appendChild(albumCard);
  });
}

// Populate the album cards when the page loads
populateAlbums();

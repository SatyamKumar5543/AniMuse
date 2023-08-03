var audioPlayer = document.getElementById('audioPlayer');
var playPauseIcon = document.getElementById('playPauseIcon');
var songTitle = document.getElementById('songTitle');
var progressBar = document.getElementById('progressBar');
var playlistItems = Array.from(document.querySelectorAll('.playlist-item'));
var currentIndex = -1; // Track the current index of the playlist item
var bottomDivision = document.querySelector('.bottom');
var currentTime = document.getElementById('currentTime');
var totalTime = document.getElementById('totalTime');
var isRepeatEnabled = false;
var repeatIcon = document.getElementById('repeatIcon');
var bottomDivision = document.querySelector('.bottom');
var currentSongContainer = document.getElementById('currentSongContainer');
var volumeIcon = document.getElementById('volumeIcon');
var volumeSliderContainer = document.getElementById('volumeSliderContainer');
var volumeSlider = document.getElementById('volumeSlider');
var heartIcon = document.getElementById('heartIcon');
const playlistItem = document.querySelector('.playlist-item');
var currentSongTitle;
var currentSongArtist;
var currentSongfilePath;
var currentSongimagePath;
const ellipsisIcon = document.querySelector('.ellipsis-icon');
const dropdownList = document.querySelector('.dropdown-list');
var selectedCollection;


// Function to show the bottom division
function showBottomDivision() {
  bottomDivision.style.display = 'flex';
}

// Function to hide the bottom division
function hideBottomDivision() {
  bottomDivision.style.display = 'none';
}

// Function to format time in MM:SS format
function formatTime(time) {
  var minutes = Math.floor(time / 60);
  var seconds = Math.floor(time % 60);
  seconds = seconds < 10 ? '0' + seconds : seconds;
  return minutes + ':' + seconds;
}

// Function to update the current time and total duration
function updateProgress() {
  var duration = audioPlayer.duration;
  var currentTimeValue = audioPlayer.currentTime;
  currentTime.textContent = formatTime(currentTimeValue);
  totalTime.textContent = formatTime(duration);
}

// Function to toggle repeat state
function toggleRepeat() {
  isRepeatEnabled = !isRepeatEnabled;
  repeatIcon.classList.toggle('active', isRepeatEnabled);
}

// Function to play a song
function playSong(songFile, playlistItem, index) {
  showBottomDivision();
  if (index === currentIndex) {
    togglePlayPause(); // Pause the song if already playing
  } else {
    audioPlayer.src = songFile;
    audioPlayer.play();
    currentIndex = index;
    isRepeatEnabled = false;
    repeatIcon.classList.remove('active');

    // Remove the "playing" class from other playlist items
    playlistItems.forEach(function (item) {
      item.classList.remove('playing');
      item.classList.remove('paused');
    });

    // Add the "playing" class to the clicked playlist item
    playlistItem.classList.add('playing');
    playlistItem.classList.remove('paused');

    // Update the current song in the bottom section
    var songImage = playlistItem.querySelector('.song-image').getAttribute('src');
    var songTitle = playlistItem.querySelector('.song-title').textContent;
    var songArtist = playlistItem.querySelector('.song-artist').textContent;

    // Display the current song details
    currentSongContainer.innerHTML = `
      <img class="song-image" src="${songImage}" alt="Current Song">
      <div class="song-details">
        <h2 class="song-title">${songTitle}</h2>
        <p class="song-artist">${songArtist}</p>
      </div>
    `;


    currentSongTitle = songTitle;
    currentSongArtist = songArtist;
    currentSongimagePath = songImage;
    currentSongfilePath = songFile;
  }
}

// Function to toggle play/pause state
function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
    playlistItems[currentIndex].classList.add('playing');
    playlistItems[currentIndex].classList.remove('paused');

  } else {
    audioPlayer.pause();
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
    playlistItems[currentIndex].classList.remove('playing');
    playlistItems[currentIndex].classList.add('paused');
  }
}

// Update the play/pause icon and progress bar
function updatePlayPauseIcon() {
  if (audioPlayer.paused) {
    playPauseIcon.classList.remove('fa-pause');
    playPauseIcon.classList.add('fa-play');
  } else {
    playPauseIcon.classList.remove('fa-play');
    playPauseIcon.classList.add('fa-pause');
  }
}

// Update the song title
audioPlayer.addEventListener('loadedmetadata', function () {
  songTitle.textContent = audioPlayer.src.split('/').pop();
});

// Update the play/pause icon
audioPlayer.addEventListener('play', function () {
  playPauseIcon.classList.remove('fa-play');
  playPauseIcon.classList.add('fa-pause');
});

audioPlayer.addEventListener('pause', function () {
  playPauseIcon.classList.remove('fa-pause');
  playPauseIcon.classList.add('fa-play');
});

// Function to play the previous song
function playPrevious() {
  var previousIndex = currentIndex - 1;
  if (previousIndex < 0) {
    previousIndex = playlistItems.length - 1;
  }
  var previousItem = playlistItems[previousIndex];
  var songFile = previousItem.getAttribute('data-song');
  playSong(songFile, previousItem, previousIndex);

}

// Function to play the next song
function playNext() {
  var nextIndex = currentIndex + 1;
  if (nextIndex >= playlistItems.length) {
    nextIndex = 0;
  }
  var nextItem = playlistItems[nextIndex];
  var songFile = nextItem.getAttribute('data-song');
  playSong(songFile, nextItem, nextIndex);
}

// Attach click event listeners to playlist items
playlistItems.forEach(function (item, index) {
  var songFile = item.getAttribute('data-song');
  item.addEventListener('click', function (event) {
    playSong(songFile, item, index);
  });
});

// Attach click event listener to play/pause icon
playPauseIcon.addEventListener('click', togglePlayPause);

// Attach click event listener to play/pause icon
playPauseIcon.addEventListener('click', function () {
  togglePlayPause();
  updatePlayPauseIcon();
});

// Function to update the progress bar
function updateProgressBar() {
  var progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
  progressBar.value = progress;
}

// Update the progress bar when the time updates
audioPlayer.addEventListener('timeupdate', function () {
  updateProgressBar();
  updateProgress();
});

// Attach change event listener to the progress bar
progressBar.addEventListener('input', function () {
  var progress = progressBar.value;
  var seekTime = (progress / 100) * audioPlayer.duration;
  audioPlayer.currentTime = seekTime;
});

// Update the play/pause icon and progress bar when the song is played or paused
audioPlayer.addEventListener('play', function () {
  updatePlayPauseIcon();
});

audioPlayer.addEventListener('pause', function () {
  updatePlayPauseIcon();
});

// Event listener for the "ended" event of the audioPlayer
audioPlayer.addEventListener('ended', function () {
  if (isRepeatEnabled) {
    audioPlayer.currentTime = 0;
    audioPlayer.play();
    return;
  }
  playNext();
});

// event listener to the audio player for song change
audioPlayer.addEventListener('play', checkFavorite);


// Event listener for the keydown event
document.addEventListener('keydown', function (event) {
  // Check if the spacebar (key code 32) or enter (key code 13) is pressed
  if (event.keyCode === 32 || event.keyCode === 13) {
    event.preventDefault(); // Prevent default action of the key press
    togglePlayPause(); // Toggle play/pause state
  }
});

//volume coltrols
volumeIcon.addEventListener('click', function () {
  audioPlayer.muted = !audioPlayer.muted;
  updateVolumeIcon();
});

volumeSlider.addEventListener('input', function () {
  audioPlayer.volume = volumeSlider.value / 100;
  updateVolumeIcon();
});

volumeIcon.addEventListener('mouseenter', function () {
  var iconRect = volumeIcon.getBoundingClientRect();
  volumeSliderContainer.style.top = iconRect.top - volumeSliderContainer.offsetHeight + 'px';
  volumeSliderContainer.style.left = iconRect.left + 'px';
  volumeSliderContainer.style.display = 'block';
});

volumeIcon.addEventListener('mouseleave', function () {
  volumeSliderContainer.style.display = 'none';
});

function updateVolumeIcon() {
  volumeIcon.classList.toggle('fa-volume-xmark');
}

fetch('http://127.0.0.1:3000/favorites', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    title: currentSongTitle,
    artist: currentSongArtist,
    imagePath: currentSongimagePath,
    filePath: currentSongfilePath,
  }),
})

// Function to check if the current playing song is in favorites
async function checkFavorite() {
  // Get the current song details

  console.log('Current Song:', currentSongTitle, currentSongArtist);

  // Send an API request to check if the song is in favorites
  try {
    var response = await fetch('http://localhost:3000/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        title: currentSongTitle,
        artist: currentSongArtist
      })
    });

    if (response.ok) {
      var isFavorite = await response.json();
      if (isFavorite) {
        console.log('Is Favorite: True');
      } else {
        console.log('Is Favorite: False');
      }
      updateHeartIcon(isFavorite);
    } else {
      console.error('Failed to check favorite:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Failed to check favorite:', error);
  }
}

// Function to update the heart icon based on favorite status
function updateHeartIcon(isFavorite) {
  var heartIcon = document.getElementById('heartIcon');
  if (isFavorite) {
    heartIcon.classList.add('fa-solid');
    heartIcon.classList.remove('fa-regular');
  } else {
    heartIcon.classList.add('fa-regular');
    heartIcon.classList.remove('fa-solid');
  }
}

// Add an event listener to the heart icon for adding/removing from favorites
document.getElementById('heartIcon').addEventListener('click', toggleFavorite);

// Function to toggle the favorite status
async function toggleFavorite() {
  var heartIcon = document.getElementById('heartIcon');
  console.log(currentSongfilePath);

  try {
    var response = await fetch('http://localhost:3000/favorites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentSongTitle,
        artist: currentSongArtist,
        filePath: currentSongfilePath,
        imagePath: currentSongimagePath,
      }),
    });

    if (response.ok) {
      var isFavorite = await response.json();
      updateHeartIcon(isFavorite);
      if (!isFavorite) {
        // Add the song details to the Favorites collection
        await addToFavorites(currentSongTitle, currentSongArtist, currentSongfilePath, currentSongimagePath);
      } else {
        // Remove the song details from the Favorites collection
        await removeFromFavorites(currentSongTitle, currentSongArtist, currentSongfilePath, currentSongimagePath);
      }
      checkFavorite();
    } else {
      console.error('Failed to toggle favorite:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Failed to toggle favorite:', error);
  }
}

// Function to add the song details to the Favorites collection
async function addToFavorites(title, artist, filePath, imagePath) {
  try {
    var response = await fetch('http://localhost:3000/favorites/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentSongTitle,
        artist: currentSongArtist,
        filePath: currentSongfilePath,
        imagePath: currentSongimagePath,
      }),
    });

    if (response.ok) {
      console.log('Song added to favorites:', title, artist);
    } else {
      console.error('Failed to add song to favorites:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Failed to add song to favorites:', error);
  }
}

// Function to remove the song details from the Favorites collection
async function removeFromFavorites(title, artist, filePath, imagePath) {
  try {
    var response = await fetch('http://localhost:3000/favorites/remove', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentSongTitle,
        artist: currentSongArtist,
        filePath: currentSongfilePath,
        imagePath: currentSongimagePath,
      }),
    });

    if (response.ok) {
      console.log('Song removed from favorites:', title, artist);
    } else {
      console.error('Failed to remove song from favorites:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Failed to remove song from favorites:', error);
  }
}

// Call checkFavorite function when the page loads to initialize the heart icon
checkFavorite();

// Add an event listener to the heart icon for adding/removing from favorites
document.getElementById('heartIcon').addEventListener('click', toggleFavorite);

// Function to fetch collection names and populate the dropdown list
function populateDropdown() {
  fetch('http://127.0.0.1:3000/api/collections')
    .then((response) => response.json())
    .then((data) => {
      // Clear any existing items in the dropdown list
      dropdownList.innerHTML = '';

      // Add "Create Playlist" option with the plus icon
      const createPlaylistOption = document.createElement('span');
      createPlaylistOption.innerHTML = '<i class="fa-solid fa-plus" id="plusIcon"></i> Create Playlist';
      createPlaylistOption.addEventListener('click', () => {

        showPopup(); // Show the popup when "Create Playlist" is clicked
        ellipsisIcon.classList.remove('show-dropdown');
        const playlistName = getElementById('playlistNameInput').value;
        if (playlistName) {
          createNewPlaylist(playlistName);
        }
      });


      dropdownList.appendChild(createPlaylistOption);

      // Add each collection name as a new option in the dropdown list
      data.forEach((collectionName) => {
        const option = document.createElement('span');
        option.textContent = collectionName;
        option.addEventListener('click', () => {
          selectedCollection = collectionName; // Store the selected collection name
          ellipsisIcon.classList.remove('show-dropdown'); // Hide the dropdown list
          addToCollection(); // Add the song to the selected collection
        });
        dropdownList.appendChild(option);
      });
    })
    .catch((error) => {
      console.error('Error fetching collections:', error);
    });
}

// Call the function to populate the dropdown when the page loads
populateDropdown();

async function addToCollection() {
  try {
    // Check if a collection is selected
    if (!selectedCollection) {
      console.error('No collection selected');
      return;
    }

    // Make a POST request to add the song to the selected collection
    const response = await fetch(`http://127.0.0.1:3000/api/addToCollection/${encodeURIComponent(selectedCollection)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: currentSongTitle,
        artist: currentSongArtist,
        filePath: currentSongfilePath,
        imagePath: currentSongimagePath,
      }),
    });

    if (response.ok) {
      console.log('Song added to collection:', selectedCollection);
    } else {
      console.error('Failed to add song to collection:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Failed to add song to collection:', error);
  }
}

// Add a click event listener to the ellipsis icon to toggle the dropdown list
ellipsisIcon.addEventListener('click', function () {
  ellipsisIcon.classList.toggle('show-dropdown');
});

// Attach a click event listener to the "Create Playlist" option
dropdownList.addEventListener('click', function (event) {
  event.stopPropagation();
  const target = event.target;
  if (target && target.id === 'plusIcon') {
    const playlistName = getElementById('playlistNameInput').value;
    if (playlistName) {
      createNewPlaylist(playlistName);
    }
  }
});

// Add a click event listener to the document to hide the dropdown list when clicking outside of it
document.addEventListener('click', function (event) {
  if (!ellipsisIcon.contains(event.target)) {
    ellipsisIcon.classList.remove('show-dropdown');
  }
});

// JavaScript to show and hide the popup

// Function to show the popup
function showPopup() {
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.style.display = 'flex';
}

// Function to hide the popup
function hidePopup() {
  const popupContainer = document.getElementById('popupContainer');
  popupContainer.style.display = 'none';
}

async function createNewPlaylist() {
  const playlistNameInput = document.getElementById('playlistNameInput');
  const playlistName = playlistNameInput.value;

  if (playlistName.trim() === '') {
    alert('Please enter a valid playlist name.');
    return;
  }

  try {
    const response = await fetch('http://127.0.0.1:3000/api/createPlaylistCollection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playlistName: playlistName,
        imagePath: currentSongimagePath,
      }),
    });

    if (response.ok) {
      console.log('New playlist collection created:', playlistName);
      // Perform any additional actions if needed
    } else {
      const errorData = await response.json();
      console.error('Failed to create playlist collection:', errorData.error);
      alert('Failed to create playlist collection. Please try again.');
    }
  } catch (error) {
    console.error('Failed to create playlist collection:', error);
    alert('Failed to create playlist collection. Please try again.');
  }

  // Clear the input and hide the popup
  playlistNameInput.value = '';
  hidePopup();
  populateDropdown();
}

// Add a click event listener to the "Create Playlist" option
const createPlaylistButton = document.getElementById('createPlaylistButton');
createPlaylistButton.addEventListener('click', createNewPlaylist);

// Add a click event listener to the document to hide the popup when clicking outside of it
document.addEventListener('click', (event) => {
  const popup = document.getElementById('popup');
  if (!popup.contains(event.target)) {
    hidePopup();
  }
});
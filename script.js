const albumsContainerAnime = document.getElementById('Anime');
const leftIconAnime = document.getElementById('left-icon-Anime');
const rightIconAnime = document.getElementById('right-icon-Anime');

const albumsContainerArtist = document.getElementById('Artist');
const leftIconArtist = document.getElementById('left-icon-Artist');
const rightIconArtist = document.getElementById('right-icon-Artist');

// Function to scroll the albums container to the left for Anime
function scrollLeftAnime() {
    albumsContainerAnime.scrollLeft -= 400; // Adjust the scroll distance as needed
}

// Function to scroll the albums container to the right for Anime
function scrollRightAnime() {
    albumsContainerAnime.scrollLeft += 400; // Adjust the scroll distance as needed
}

// Function to scroll the albums container to the left for Artist
function scrollLeftArtist() {
    albumsContainerArtist.scrollLeft -= 400; // Adjust the scroll distance as needed
}

// Function to scroll the albums container to the right for Artist
function scrollRightArtist() {
    albumsContainerArtist.scrollLeft += 400; // Adjust the scroll distance as needed
}

// Add click event listeners to the left and right icons for Anime albums container
leftIconAnime.addEventListener('click', scrollLeftAnime);
rightIconAnime.addEventListener('click', scrollRightAnime);

// Add click event listeners to the left and right icons for Artist albums container
leftIconArtist.addEventListener('click', scrollLeftArtist);
rightIconArtist.addEventListener('click', scrollRightArtist);

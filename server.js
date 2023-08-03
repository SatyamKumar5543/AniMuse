// server.js

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { ObjectId } = require('mongodb');

const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/Animuse', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
  });

// Create a schema for the favorite songs
const Schema = new mongoose.Schema({
  id: ObjectId,
  title: String,
  artist: String,
  filePath: String,
  imagePath: String
});

// Create a model for the favorite songs
const Favorite = mongoose.model('Favorites', Schema, 'Favorites');

// Route to check if a song is in favorites
app.post('/favorites', async (req, res) => {
  try {
    const { title, artist, filePath, imagePath } = req.body;

    // Check if the song exists in the favorites collection
    const favoriteSong = await Favorite.findOne({ title, artist });
    res.json(favoriteSong);
  } catch (error) {
    console.error('Failed to check favorite:', error);
    res.status(500).json({ error: 'Failed to check favorite' });
  }
});

// Route to add a song to favorites
app.post('/favorites/add', async (req, res) => {
  try {
    const { title, artist, filePath, imagePath } = req.body;

    // Check if the song already exists in the favorites collection
    const existingSong = await Favorite.findOne({ title, artist });
    if (existingSong) {
      // Song already exists, return success response
      return res.status(200).json({ message: 'Song already in favorites' });
    }

    // Create a new favorite song instance
    const favoriteSong = new Favorite({
      title,
      artist,
      filePath: filePath.toString(),
      imagePath: imagePath.toString(),
    });

    // Save the favorite song to the database
    await favoriteSong.save();

    // Return success response
    res.status(200).json({ message: 'Song added to favorites' });
  } catch (error) {
    console.error('Failed to add song to favorites:', error);
    res.status(500).json({ error: 'Failed to add song to favorites' });
  }
});

// Route to remove a song from favorites
app.post('/favorites/remove', async (req, res) => {
  try {
    const { title, artist, filePath, imagePath } = req.body;

    // Remove the document from the favorites collection using the song ID
    await Favorite.deleteOne({ title, artist, filePath, imagePath });

    res.sendStatus(200);
  } catch (error) {
    console.error('Failed to remove song from favorites:', error);
    res.status(500).json({ error: 'Failed to remove song from favorites' });
  }
});

const DemonSlayer = mongoose.model('DemonSlayer', Schema, 'DemonSlayer');

const VinlandSaga = mongoose.model('VinlandSaga', Schema, 'VinlandSaga');

const YourName = mongoose.model('YourName', Schema, 'YourName');


// Route to retrieve playlist items from the "DemonSlayer" collection
app.get('/favorite', async (req, res) => {
  try {
    const playlistItems = await Favorite.find().exec();
    res.json(playlistItems);
  } catch (error) {
    console.error('Failed to retrieve playlist items', error);
    res.status(500).json({ error: 'Failed to retrieve playlist items' });
  }
});

// Route to retrieve playlist items from the "DemonSlayer" collection
app.get('/demonSlayer', async (req, res) => {
  try {
    const playlistItems = await DemonSlayer.find().exec();
    res.json(playlistItems);
  } catch (error) {
    console.error('Failed to retrieve playlist items', error);
    res.status(500).json({ error: 'Failed to retrieve playlist items' });
  }
});

// Route to retrieve items from the "VinlandSaga" collection
app.get('/vinlandSaga', async (req, res) => {
  try {
    const items = await VinlandSaga.find().exec();
    res.json(items);
  } catch (error) {
    console.error('Failed to retrieve items from AnotherCollection', error);
    res.status(500).json({ error: 'Failed to retrieve items from AnotherCollection' });
  }
});

// Route to retrieve playlist items from the "DemonSlayer" collection
app.get('/yourName', async (req, res) => {
  try {
    const playlistItems = await YourName.find().exec();
    res.json(playlistItems);
  } catch (error) {
    console.error('Failed to retrieve playlist items', error);
    res.status(500).json({ error: 'Failed to retrieve playlist items' });
  }
});


let collections = {};

// Route to fetch the collection names from the "ListOfPlaylist" collection
app.get('/api/collections', async (req, res) => {
  try {
    // Fetch the names of all collections from the "ListOfPlaylist" collection
    const collectionsList = await mongoose.connection.db.collection('ListOfPlaylist').find().toArray();

    // Clear existing collections
    collections = {};

    // Create models for each collection dynamically and add them to the collections object
    collectionsList.forEach((collection) => {
      const { name } = collection;
      collections[name] = mongoose.model(name, Schema, name);
    });

    res.json(Object.keys(collections));
  } catch (error) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Failed to fetch collections' });
  }
});


// Route to handle adding a song to a collection
app.post('/api/addToCollection/:collectionName', async (req, res) => {
  try {
    const collectionName = decodeURIComponent(req.params.collectionName);
    const { title, artist, filePath, imagePath } = req.body;

    // Check if the collection exists in the collections object
    if (!collections[collectionName]) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    // Check if the song already exists in the collection
    const existingSong = await collections[collectionName].findOne({ title, artist });
    if (existingSong) {
      // Song already exists, return success response
      return res.status(200).json({ message: 'Song already in the collection' });
    }

    // Create a new song instance
    const newSong = new collections[collectionName]({
      title,
      artist,
      filePath: filePath.toString(),
      imagePath: imagePath.toString(),
    });

    // Save the song to the database
    await newSong.save();

    // Return success response
    res.status(200).json({ message: 'Song added to the collection' });
  } catch (error) {
    console.error('Failed to add song to the collection:', error);
    res.status(500).json({ error: 'Failed to add song to the collection' });
  }
});

// Create a schema for the ListOfPlaylist collection
const ListOfPlaylistSchema = new mongoose.Schema({
  id: ObjectId,
  name: String,
  imagePath: String
});

const ListOfPlaylist = mongoose.model('ListOfPlaylist', ListOfPlaylistSchema, 'ListOfPlaylist');

// Route to create a new playlist collection
app.post('/api/createPlaylistCollection', async (req, res) => {
  try {
    const { playlistName, imagePath } = req.body;

    // Check if the collection already exists
    const existingCollection = await mongoose.connection.db.listCollections({ name: playlistName }).next();

    if (existingCollection) {
      // Collection already exists, return an error response
      return res.status(400).json({ error: 'Playlist with the same name already exists' });
    }

    // Create a new collection using the playlistName
    await mongoose.connection.db.createCollection(playlistName);

    // Add the playlist name to the ListOfPlaylist collection
    await ListOfPlaylist.create({ name: playlistName, imagePath: imagePath.toString() });

    // Return success response
    res.status(200).json({ message: 'New playlist collection created successfully' });
  } catch (error) {
    console.error('Failed to create playlist collection:', error);
    res.status(500).json({ error: 'Failed to create playlist collection' });
  }
});

app.get('/api/playlists', async (req, res) => {
  try {
    const playlists = await ListOfPlaylist.find().exec();
    res.json(playlists.map(playlist => ({ name: playlist.name, imagePath: playlist.imagePath })));
  } catch (error) {
    console.error('Failed to retrieve playlist data', error);
    res.status(500).json({ error: 'Failed to retrieve playlist data' });
  }
});

app.get('/api/playlistItems/:playlistName', async (req, res) => {
  try {
    const playlistName = req.params.playlistName;

    const playlist = await ListOfPlaylist.findOne({ name: playlistName }).exec();
    if (!playlist) {
      return res.status(404).json({ error: 'Playlist not found' });
    }
    const playlistItems = await playlist.find().exec();
    res.json(playlistItems);
  } catch (error) {
    console.error('Failed to retrieve playlist items', error);
    res.status(500).json({ error: 'Failed to retrieve playlist items' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
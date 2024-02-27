# Models and Endpoints Documentation

## Models

### Audio Model

The Audio model is defined using Mongoose, a MongoDB object modeling tool designed to work in an asynchronous environment. The schema for the Audio model includes fields for `filename`, `path`, `transcript`, and `date`. The `date` field is automatically set to the current date and time when a new Audio document is created.

```javascript
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const audioSchema = new Schema({
    filename: String,
    path: String,
    transcript: String,
    date: {type: Date, default: Date.now}
});

const Audio = mongoose.model('Audio', audioSchema);
```

## Endpoints

### Add Audio to Database

- **POST** `/create`
  - **Description**: Saves a new audio file's metadata to the database.
  - **Request Body**: Contains `filename`, `path`, and `transcript` of the audio.
  - **Response**: Returns the ID of the newly saved audio document.

### Get All Audios

- **GET** `/audios`
  - **Description**: Retrieves all audio documents from the database.
  - **Response**: Returns an array of audio documents, including their `filename`, `path`, `transcript`, and `date`.

### Get Audio by ID

- **GET** `/audios/:id`
  - **Description**: Retrieves a single audio document by its ID.
  - **Response**: Returns the requested audio document. If the document is cached in Redis, it retrieves the document from the cache for faster access.

### Delete Audio by ID

- **DELETE** `/delete/:id`
  - **Description**: Deletes an audio document based on its ID.
  - **Response**: Returns a success message upon successful deletion.

### Update Audio

- **PATCH** `/update/:id`
  - **Description**: Updates an existing audio document's metadata.
  - **Request Body**: Contains the fields of the audio document that need to be updated.
  - **Response**: Returns the updated audio document.

## Redis Caching

Redis is used for caching audio documents to reduce database lookup times. When an audio document is requested, the system first checks if it is cached in Redis. If it is, it retrieves the document from the cache. Otherwise, it fetches the document from the MongoDB database and caches it in Redis for future requests. If the audio is patched, it is updated both in Redis and MongoDB. Same with deletion - the audio is removed from the main database as well as cache. Cached documents are set to expire after 1 hour to ensure that the cache does not serve stale data.

## Usage

The provided document demonstrates how to define a model in Mongoose, perform basic CRUD operations, and integrate Redis for caching. It shows a complete flow from defining the data model to creating RESTful API endpoints for managing audio documents in a Node.js application using Express, Mongoose, and Redis.
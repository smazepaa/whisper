# Textify - Audio to Text Converter

Textify is a cutting-edge web application designed to transform audio content into written text with remarkable accuracy and efficiency. Our service streamlines the transcription process, making it accessible and convenient for users from various professional backgrounds to convert their audio files into editable text.
## Features

- **Caching with Redis**: Enhances performance through rapid data access, reducing direct data store queries.
- **Centralized Error Handling**: Improves reliability and user experience by streamlining response management.
- **WebSocket Communication**: Ensures efficient, stable communications with real-time updates.
- **Efficient Audio Transcription with Whisper**: Offers fast and accurate transcription, optimized for application responsiveness.
- **Progress Updates**: Provides real-time updates during transcription to keep users informed.
- **Concurrent Task Execution**: Reduces task completion time by running multiple tasks asynchronously.
- **Temporary File Handling**: Manages disk space efficiently, preventing file system exhaustion.
- **Integration of Asynchronous Tasks in Django Views**: Facilitates scalable and maintainable application development by bridging synchronous and asynchronous operations.

This setup highlights Textify's dedication to providing a high-quality, efficient transcription service, utilizing contemporary technologies and practices for optimal user experience and application performance. 

It ensures our app is optimized for **both small and large files**, ensuring a quick **multilingual transcription** process with **minimal errors**.


## Technology Stack
The application is built with a combination of modern technologies that ensure reliability and performance:

- **Backend**: 2 main servers with websokets for interserver communication - Node.js as the main server, Django as the transcription engine. Additionally Redis server for caching.
- **Frontend**: Robust frontend technologies for a dynamic user experience (Pug, JavaScript, CSS).

## Getting Started
### Prerequisities
- Python 3.12 (for latest Django version)
- Django 5.0.2
- Redis server
  
#
### Installation

Before installing, ensure you have [Node.js](https://nodejs.org/), [Django](https://www.djangoproject.com/) and [Redis](https://redis.io/) installed on your system.

### Clone the repo

Clone the repository to your local machine:
```
git clone https://github.com/smazepaa/whisper.git
cd whisper
```

### Install dependencies
#### Node.js

First enter the folder with the Node.js project
```
cd expressServer
```

Install the required dependencies using
```
npm install
```
- `axios`: Promise based HTTP client for the browser and Node.js.
- `body-parser`: Node.js body parsing middleware.
- `cors`: Middleware to enable CORS (Cross-Origin Resource Sharing).
- `express`: Fast, unopinionated, minimalist web framework for Node.js.
- `form-data`: A module to create readable "multipart/form-data" streams.
- `http-errors`: Create HTTP error objects.
- `method-override`: Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
- `mongoose`: MongoDB object modeling tool designed to work in an asynchronous environment.
- `morgan`: HTTP request logger middleware for Node.js.
- `multer`: Middleware for handling multipart/form-data, primarily used for uploading files.
- `pug`: High-performance template engine heavily influenced by Haml and implemented with JavaScript for Node.js and browsers.
- `redis`: A robust, performance-focused, and full-featured Redis client for Node.js.
- `ws`: A simple to use, blazing fast, and thoroughly tested WebSocket client and server implementation.

#### Django

Go to the Django project
```
cd djangoServer
```
Install the dependencies with 
```
pip install
```
- `channels`: It allows Django to asynchronously support WebSocket requests in a way that's similar to traditional HTTP requests.
- `daphne`: A part of the Django Channels project. It is particularly suited to handling long-lived WebSocket connections.
- `axios`: A promise-based HTTP client that allows you to make requests to HTTP endpoints, perfect for RESTful API interactions.
- `openai-whisper`: The interface to the Whisper API provided by OpenAI for audio processing and transcription.
- `pydub`: A Python library for audio manipulation and editing. 
- `websockets`: A Python library for building WebSocket servers and clients.

#
### Start the application
**Start Express server** (running on port 3001)
```
node app.js
```

**Start Django server** (running on port 8000)
```
python manage.py runserver
```
_These servers can also be started using IDEs (e.g. WebStorm for Express, PyCharm for Django)_

**Start Redis server** (running on default port 6379)
```
wsl -d Ubuntu
sudo service redis-server start
redis-cli
```

## How to Use
After starting all three servers to transcribe an audio file:

- Navigate to the Textify website (http://localhost:3001).
- From the main page go to the Converter either by clicking on **'Try Now ->'** button or **'Converter'** in the header.
<img width="950" alt="main-page" src="https://github.com/smazepaa/whisper/assets/118920409/1bce64d6-254c-4576-aec3-b22bee431294">
  
- Choose the file from your computer by clicking **'Choose File'** or simply drop the file into the blue bordered area
- To remove the uploaded file click the **'Remove File'** button and upload a new one
- Finally click **'Transcribe File'** to begin the transcription process.
<img width="950" alt="Screenshot 2024-02-26 195236" src="https://github.com/smazepaa/whisper/assets/118920409/0725882b-314f-4e7b-8fc2-9a26af5a222b">

- Monitor the progress through real-time updates.
<img width="950" alt="Screenshot 2024-02-26 200151" src="https://github.com/smazepaa/whisper/assets/118920409/e32fdb92-ba2a-4296-bcc9-3f9b42aa5f78">

- Once completed, you may click the **'See Transcription**' button to go to the transcript itself or **'Trancribe Again'** to use the converter once more.
<img width="950" alt="Screenshot 2024-02-26 200309" src="https://github.com/smazepaa/whisper/assets/118920409/91f89884-ace9-4cd6-b49a-e4fa30fe30e0">

- Also you can see the transcription history by clicking on the icon in the left upper corner of the converter and either delete transcripts or browse them.
<img width="950" alt="Screenshot 2024-02-26 142738" src="https://github.com/smazepaa/whisper/assets/118920409/d1267892-2e38-4863-a0dc-6d07f6840e2a">

- After clicking 'See Transciption' you the page displays the filename, transcription itself and possible interactions with it. You may download the transcription in a txt file, edit the transcription to your liking or delete it. Also you can go back to the converter clicking on **the arrow above**.
<img width="950" alt="Screenshot 2024-02-26 203117" src="https://github.com/smazepaa/whisper/assets/118920409/57d82c32-7b4c-4795-8b74-9ff9f160e703">
<br><br>
<img width="950" alt="Screenshot 2024-02-26 214301" src="https://github.com/smazepaa/whisper/assets/118920409/83ce3590-ec0d-4003-aed3-a3328a6e54ec">
<br><br>
<img width="960" alt="Screenshot 2024-02-26 213755" src="https://github.com/smazepaa/whisper/assets/118920409/d4183ae0-4709-470e-9958-118ce11ae620">


## Contribution

We welcome contributions from the community. If you're interested in improving Textify or adding new features, please refer to our contributing guidelines.

### Quickstart:

- **Fork & Pull**: Fork the repo, make your changes, and submit a pull request.
- **Issues**: Use [GitHub Issues](https://github.com/smazepaa/whisper/issues) for bug reports or feature suggestions.
- **Coding Style**: Follow our coding style of 2 spaces for indentation.

### Pull Requests:

1. Fork the repo.
2. Create your branch (`git checkout -b my-feature`).
3. Commit your changes (`git commit -am 'Add some feature'`).
4. Push to the branch (`git push origin my-feature`).
5. Open a new Pull Request.

### Bug Reporting:

- Include a clear title and description.
- Steps to reproduce the bug, if possible with sample code.
- What you expected to happen and what actually happened.


## Discover Simplicity with Textify

With Textify, transform your spoken words into written text effortlessly. Our platform bridges the gap between speech and text, making it easier for everyone to capture, share, and understand spoken information. Thank you for choosing Textify, where your voice finds its written form. Join us as we simplify transcription for the world.

*Textify – Speak it. Save it. Share it.*

## Readable

Project for Udacity React nanodegree. This is a website where viewers can write posts and comments and vote on what they have written. The website was built with React and Redux. The code is written using [standard](https://standardjs.com).

### Getting Started

#### Setup backend

First you need to setup the backend server that was provided by Udacity for the project. Open up a terminal window and type these commands:

    git clone https://github.com/udacity/reactnd-project-readable-starter.git
    cd reactnd-project-readable-starter/api-server
    npm install

To get the backend server running type:

    node server

If the server does not start up on port 5001, open up the file config.js in the api-server folder. Change the port number to 5001 and save. Go back to the terminal window and stop the server (control + C on Mac) and restart by typing:

    node server

#### Setup frontend

Next, we need to download the front end. Open up another terminal and type or paste the following commands:

    git clone https://github.com/fgonzalezm/Readable.git
    cd Readable
    npm install

To start the local server:

    npm start

 This will let you see the project on your local machine at the default port of 3000. If a browser does not automatically open, go to http://localhost:3000/ in your browser of choice.

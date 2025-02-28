# How to start with first project nodejs backend

## Initial

1. npm init -y (-y in order to acept all yes/no question when init project)
2. create index.js file
3. `npm install express`

## How to run this project

- node index.js

## Now let's add some dependency we are going to use in this project

- nodemon is a tool help restart node application automatic when have a change in source code.
  - install global: `npm install -g nodemon`
  - install local: `npm install --save-dev nodemon`
  - then you can run `nodemon index.js` instead of `node index.js`
  - config start in package.json `"scripts": {
  "start": "node server.js",
  dev": "nodemon server.js"
}`
  - start : `npm run dev`
- momgoose ODM
  - install Mongoose from the command line using `npm`: `npm install mongoose --save`
- dotenv is library help you manage env parameter
  - `npm igit dotenv`
  - ```DB_USER=cagongu
    DB_PASSWORD=MySecurePassword
    DB_HOST=cluster0.abcd.mongodb.net
    DB_NAME=book-store
    ```
- install cors: `npm install cors`
- install jsonwebtoken: `npm install jsonwebtoken`
- install bcrypt: `npm i bcrypt`

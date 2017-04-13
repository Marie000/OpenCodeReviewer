
To run the project on your local environment:

1- git clone https://github.com/danamn/OpenCodeReviewer.git

2- npm install

3- install MongoDB and start the Mongo server

for Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/

for Mac: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/

for Linux: https://docs.mongodb.com/manual/administration/install-on-linux/

4- create a free account on Auth0.com

In that free account, create a client.
In the client's settings:

Allowed Callback Urls:
http://localhost:3000/login,
http://localhost:3000/dashboard,
http://localhost:9000/login,
http://localhost:3000/

Allowed Logout Urls:
http://localhost:3000/login,
http://localhost:3000/dashboard,
http://localhost:9000/login,

Allowed Origins:
http://localhost:3000/

Save settings. Keep your client's setting page open for the next step.

Note: you should also go to 'connections' (on the left-side menu), then database and then email-password. In there, turn on the 'requires username'.

5- create a config.js file in the root folder of the project

with the following code, replacint the { } sections with the info from your auth0 client.

```
module.exports = {
  auth0secret:process.env.AUTH0SECRET || {SECRET FOR YOUR AUTH0 CLIENT},
  auth0audience:process.env.AUTH0AUDIENCE ||  {Client ID FOR YOUR AUTH0},
  api: process.env.NODE_ENV==='production' ? 'http://checkmycode.ca' : 'http://localhost:9000',
  auth0url:process.env.AUTH0URL || {DOMAIN FOR YOUR AUTH0 CLIENT}
}
```

audience : Client ID
url: domain

6- to run the server: npm start
will update when changes are saved.

7- to run the front-end, in another terminal: npm run start-react
will update when changes are saved.


CAUTION:

make sure you create a branch for your changes. Do not make changes directly to master. When your changes are done, push your branch and submit a pull request.

do not run the build command. The people running the production side of the project will create the build.

unless absolutely necessary, do not make ANY changes to the server/database/mongoose.js file.
If you do have to to change it, or if you change it accidentally, the version in the production server will need to be changed to connect(mlab uri with username and password).


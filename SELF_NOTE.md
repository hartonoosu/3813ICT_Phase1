## Initial Architecture:

#### FRONT END
1.  Create new Angular project **ng new chat**
2.  **npm install bootstrap –save** 
3.  **npm install socket.io-client --save**
4.  Edit Bootstrap in Angular.json:
    * styles: "./node_modules/bootstrap/dist/css/bootstrap.min.css"
    * script: "node_modules/bootstrap/dist/js/bootstrap.js"
5.	Create a service to manage the socket - **ng generate service services/socket**
6.  **ng serve --open**


#### BACKEND
1. Create *server* folder
2. **npm init** in the *server* folder
3. Install:
    * Express.js:   **npm install express --save**
    * Socket.io:    **npm install socket.io --save** 
    * Cors: **npm install cors --save**
4.  Create 7 .js files:
    * server
    * socket
    * listen
    * postLogin and postLoginAfter (under *router* directory)
    * users.json and extendedUser.json (under *data* directory)
5.  Install **npm install --save-dev nodemon**, edit package.json under "scripts":    **"start": "server.js"**

#### HTTP
1.  update app.config.ts
2.  server

### Login System
1.  login component, users, extended users, app component, app.routes.ts, server, postLogin
    Login component handles sessionstorage, subscribe meaning to read and follow the data from server. 
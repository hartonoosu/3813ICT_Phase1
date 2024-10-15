# 3813ICT_Phase1
This is my second attempt at this assignment Phase 1. This project is about creating a basic chatting app with several functionalities, including managing users, groups, and the chat channel.

## Version Control

This project uses GitHub as the platform.

#### Repository Structure
The Git repository named `chat` is structured into two main directories:

   * **`server/`**: Contains all backend-related files, including routing, data handling, and configuration.
   * **`src/`**: Contains all frontend (Angular) components, services, and related files.

#### Branching
A feature-branching strategy was adopted for development:
   * **`main`**: The main branch which contains the completed parts of the project.
   * **`establish-architecture`**: The initial architecture/design of this chat app.
   * **`feature/account-page`**: Initially used as the primary branch during development to avoid unnecessary merge conflicts.
   * **`upload-avatar`**: Added functionality for avatar upload.
   * **`feature/chat-system`**: Added core chat functionalities, including user join/leave indications, sending messages, and basic chat logic.
   * **`applying-mongodb`**: Integrated MongoDB for data persistence, including storing users and groups.
   * **`Finishing-Off-Architecture`**: Completed the architecture for both server-side and client-side components.

#### Push Frequency
Frequent commits were made to track every logical change, including adjustments to component styles or small chores like cleaning up comments, removing `console.log` statements used for testing, and similar tasks.

#### Adding Comments
Necessary comments were added to explain why or how the code changed. This practice is useful for reviewing how specific parts of the code or certain syntax work. Some comments were also included directly in the code.

## Data Structure

Data structures used in both the client and server sides represent the various entities.

### Client-Side Data Structures (Angular)

| **Entity** | **Property** | **Type** |
|------------|--------------|----------|
| **User**   | `userid`     | string   |
|            | `username`   | string   |
|            | `useremail`  | string   |
|            | `usergroup`  | string   |
|            | `userrole`   | string   |
| **Group**  | `groupid`    | string   |
|            | `groupname`  | string   |
| **Message**| `username`   | string   |
|            | `text`       | string   |
|            | `timestamp`  | Date     |
| **Channel**| `channelName`| string   |
|            | `messages`   | string[] |

### Server-Side Data Structures (Node.js and Mongoose)

| **Entity**       | **Property**    | **Type**                 |
|------------------|-----------------|--------------------------|
| **User**         | `username`      | string                   |
|                  | `password`      | string                   |
|                  | `useremail`     | string                   |
|                  | `usergroup`     | string                   |
|                  | `userrole`      | string                   |
| **Group**        | `groupid`       | string                   |
|                  | `groupname`     | string                   |
| **Message**      | `username`      | string                   |
|                  | `text`          | string                   |
|                  | `timestamp`     | Date                     |
| **Channel**      | `channelName`   | string                   |
|                  | `messages`      | ObjectId[] (references to `Message`) |

## Angular Architecture

The Angular application is structured using components, services, models, and routes to ensure modularity and maintainability.

### Components
1. **`NavbarComponent`**: Manages the navigation links based on user roles, including Super Admin, Group Admin, and regular users.
2. **`ChatComponent`**: Handles real-time messaging between users.
3. **`GroupsComponent`**: Manages the creation, deletion, and listing of user groups, including channels within a group.
4. **`ProfileComponent`**: Allows users to view and edit their profile details, also based on user roles. Super User can edit `useremail`, `usergroup`, and `userrole`. Group Admin can edit their own group and `useremail`, while regular users can only edit their `useremail`.
5. **`LoginComponent`**: Handles user authentication and login processes.
6. **`AccountComponent`**: Displays user account details. It also serves as a welcome page.
7. **`DashboardComponent`**: Displays user history and activities.

### Services

1. **`AuthService`**: Manages user authentication, login/logout processes, and retrieves user roles.
2. **`SocketService`**: Manages WebSocket connections for real-time communication.

### Models
1. **`User`**: Represents a user entity with properties like `userid`, `username`, `useremail`, `usergroup`, and `userrole`.
2. **`Group`**: Represents a group entity with properties like `groupid`, and `groupname`.
3. **`Message`**: Represents a message entity with properties like `username`, `text`, and `timestamp`.
4. **`Channel`**: Represents a channel entity with properties like `channelName` and `messages`.

## Node Server Architecture

The Node.js server is designed to handle the backend logic and serves as the API provider for the Angular frontend.

### Modules
1. **Express.js**: Used for setting up the server and handling HTTP requests.
2. **UUID**: Used to generate unique IDs for users and groups.
3. **Mongoose**: Used for MongoDB interactions and schema definitions.

### Functions
1. **Authentication Functions**:
   * **`postLogin.js`**: Handles user login by verifying credentials and returning the user's role.
   * **`postLoginAfter.js`**: Manages post-login actions and updates.
   
2. **User Management Functions**:
   * **`postCreateUser.js`**: Creates a new user and updates the database.
   * **`postRemoveUser.js`**: Deletes a user from the database.

3. **Channel and Group Management Functions**:
   * **`manageGroups.js`**: Handles creating, updating, and deleting groups.
   * **`manageChannels.js`**: Handles creating, updating, and deleting channels within groups.
   * **`addUserToChannel.js`**: Adds a user to a specified channel.
   * **`removeUserFromChannel.js`**: Removes a user from a specified channel.

4. **Messaging Functions**:
   * **`getMessages.js`**: Retrieves messages from a specified channel.
   * **`uploadImage.js`**: Handles uploading and associating images with messages.
   * **`uploadAvatar.js`**: Handles user avatar uploads.
   * **`getChannel.js`**: Retrieves information about a specific channel.
   * **`getGroupsAndChannels.js`**: Retrieves information about groups and their associated channels.

### Files
1. **`server.js`**: Main server file that sets up the Express server and middleware.
2. **`router/`**: Contains route handling files for different API endpoints.

### Global Variables
1. **`PORT`**: The port on which the server listens (currently 3000).
2. **`BACKEND_URL`**: URL for backend API calls (used in client-side services).

## Server-Side Routes

### Authentication Routes

| **Route**   | `/login`                           |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Authenticates a user               |
| **Parameters** | `username`, `password`          |
| **Returns** | `{ userid, userrole }` if successful, or an error message |

---

### User Management Routes

| **Route**   | `/createUser`                      |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Creates a new user                 |
| **Parameters** | `username`, `useremail`, `userrole` |
| **Returns** | `{ userid, username, userrole }` if successful |

| **Route**   | `/removeUser`                      |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Removes a user                     |
| **Parameters** | `userid`                        |
| **Returns** | `{ status }` indicating success or failure |

### Group Management Routes

| **Route**   | `/manageGroups`                    |
|-------------|------------------------------------|
| **Method**  | POST, PUT, DELETE                  |
| **Purpose** | Manages group creation, updating, and deletion |
| **Parameters** | `groupid`, `groupname`          |
| **Returns** | `{ status }` indicating success or failure |

### Channel Management Routes

| **Route**   | `/manageChannels`                  |
|-------------|------------------------------------|
| **Method**  | POST, PUT, DELETE                  |
| **Purpose** | Manages channel creation, updating, and deletion within groups |
| **Parameters** | `channelName`                   |
| **Returns** | `{ status }` indicating success or failure |

| **Route**   | `/getChannel`                      |
|-------------|------------------------------------|
| **Method**  | GET                                |
| **Purpose** | Retrieves information about a specific channel |
| **Parameters** | `channelId`                     |
| **Returns** | `{ channel details }`              |

| **Route**   | `/getGroupsAndChannels`            |
|-------------|------------------------------------|
| **Method**  | GET                                |
| **Purpose** | Retrieves information about groups and their associated channels |
| **Returns** | `{ groups and channels details }`  |

### Messaging Routes

| **Route**   | `/getMessages`                     |
|-------------|------------------------------------|
| **Method**  | GET                                |
| **Purpose** | Retrieves messages from a channel  |
| **Parameters** | `channelId`                     |
| **Returns** | `messages`                         |

| **Route**   | `/uploadImage`                     |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Uploads an image to a channel      |
| **Parameters** | `image`, `channelId`            |
| **Returns** | `{ status }` indicating success or failure |

## Client-Server Interaction

### User Login
1. **Client**: The `LoginComponent` sends the user’s credentials to the `/login` endpoint.
2. **Server**: The server validates the credentials, retrieves the user’s role from the database, and returns it.
3. **Client**: The `AuthService` stores the user role in `sessionStorage`, and the `NavbarComponent` updates the displayed links accordingly.

### User Management
1. **Client**: The `GroupsComponent` allows the Super Admin and Group Admin (limited to their own groups) to create or delete groups.
2. **Server**: The server updates the group data in MongoDB.
3. **Client**: The `GroupsComponent` updates the displayed list of groups based on the server's response.

### Profile Update
1. **Client**: The user updates their profile using the `ProfileComponent`.
2. **Server**: The server updates the corresponding entries in MongoDB and returns a success message.
3. **Client**: The `ProfileComponent` reflects the updated information after a successful save.

### Messaging
1. **Client**: The `ChatComponent` sends a message to the channel using the `/getMessages` route.
2. **Server**: The server stores the message in the `messages` collection in MongoDB and returns a success status.
3. **Client**: The message appears in the chat window for all users in the channel.

### Uploading Images
1. **Client**: The user selects an image to upload using the `ChatComponent`.
2. **Server**: The image is uploaded via the `/uploadImage` route, stored in MongoDB, and the server returns a success status.
3. **Client**: The image appears in the chat for all users in the channel.
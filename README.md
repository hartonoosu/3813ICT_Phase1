# 3813ICT_Phase1
This is my second attempt at this assignment Phase 1. This project is about creating a basic chatting app with several functionalities, including managing users, groups, and chat channels.

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

Data structures used in both the client and server sides to represent the various entities.

#### Client-Side Data Structures (Angular):
All databases are stored in MongoDB. `userid` was stored as a string since I was trying to generate random alphabetic and numeric values. Data for `channelid` was also added. Please note that `usergroup` value is equal to `groupid`.

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
| **Message** | `username`  | string   |
|            | `text`       | string   |
|            | `timestamp`  | Date     |
| **Channel** | `channelid` | string   |
|            | `channelname`| string   |

### Server-Side Data Structures (Node.js)

| **Entity**       | **Property** | **Type** |
|------------------|--------------|----------|
| **User**         | `username`   | string   |
|                  | `password`   | string   |
| **Extended User**| `userid`     | string   |
|                  | `username`   | string   |
|                  | `useremail`  | string   |
|                  | `usergroup`  | string   |
|                  | `userrole`   | string   |
| **Group** | `groupid`   | string   |
|                  | `groupname`  | string   |
| **Message** | `username` | string   |
|                  | `text`       | string   |
|                  | `timestamp`  | Date     |
| **Channel** | `channelid` | string   |
|                  | `channelname`| string   |

## Angular Architecture

The Angular application is structured using components, services, models, and routes to ensure modularity and maintainability.

#### Components
1. **`NavbarComponent`**: Manages the navigation links based on user roles, including Super Admin, Group Admin, and regular users.
2. **`ChatComponent`**: Handles real-time messaging between users.
3. **`GroupsComponent`**: Manages the creation, deletion, and listing of user groups.
4. **`ProfileComponent`**: Allows users to view and edit their profile details, also based on user roles. Super User can edit `useremail`, `usergroup`, and `userrole`. Group Admin can edit their own group and `useremail`, while a regular user can only edit their `useremail`.
5. **`LoginComponent`**: Handles user authentication and login processes.
6. **`AccountComponent`**: Displays user account details. Also used as a welcome page.
7. **`Dashboard`**: Displays user history and activities.
8. **`ChannelsComponent`**: Manages the creation and deletion of channels within a group.

#### Services
1. **`AuthService`**: Manages user authentication, login/logout processes, and retrieves user roles.
2. **`SocketService`**: Manages WebSocket connections for real-time communication.

#### Models
1. **`User`**: Represents a user entity with properties like `userid`, `username`, `useremail`, `usergroup`, and `userrole`.
2. **`Group`**: Represents a group entity with properties like `groupid`, and `groupname`.
3. **`Message`**: Represents a message entity with properties like `username`, `text`, and `timestamp`.
4. **`Channel`**: Represents a channel entity with properties like `channelid` and `channelname`.

## Node Server Architecture

The Node.js server is designed to handle the backend logic and serves as the API provider for the Angular frontend.

#### Modules
1. **Express.js**: Used for setting up the server and handling HTTP requests.
2. **UUID**: Used to generate unique IDs for users and groups.
3. **File System (fs)**: Used to read and write JSON data files for storing user and group information.
4. **`FormsModule`**: Used for building and managing forms, including template-driven forms that rely on `ngModel` for two-way data binding.
5. **`RouterModule`**: Facilitates routing within the application, linking components to specific URLs.
6. **`CommonModule`**: Provides common directives like `NgIf` and `NgFor` that are used across components to display content conditionally and iterate over lists.

#### Functions
1. **Authentication Functions**:
   * **`postLogin.js`**: Handles user login by verifying credentials and returning the user's role.
   * **`postLoginAfter.js`**: Manages post-login actions and updates.

2. **User Management Functions**:
   * **`postCreateUser.js`**: Creates a new user and updates the `users.json` and `extendedUsers.json` files.
   * **`postRemoveUser.js`**: Deletes a user from the `users.json` and `extendedUsers.json` files.

3. **Channel Management Functions**:
   * **`postCreateChannel.js`**: Creates a new channel and updates the `channels.json` file.
   * **`postRemoveChannel.js`**: Deletes a channel from the `channels.json` file.

4. **Group Management Functions**:
   * **`postCreateGroup.js`**: Creates a new group and updates the `groups.json` file.
   * **`postRemoveGroup.js`**: Deletes a group from the `groups.json` file.

#### Files
1. **`server.js`**: Main server file that sets up the Express server and middleware.
2. **`data/users.json`**: Stores basic user information for authentication.
3. **`data/extendedUsers.json`**: Stores extended user profile information.
4. **`data/channels.json`**: Stores channel information.
5. **`data/groups.json`**: Stores group information.
6. **`router/`**: Contains route handling files for different API endpoints.

#### Global Variables
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

### Channel Management Routes

| **Route**   | `/createChannel`                   |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Creates a new channel              |
| **Parameters** | `channelname`                   |
| **Returns** | `{ channelid, channelname }` if successful |

| **Route**   | `/removeChannel`                   |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Removes a channel                  |
| **Parameters** | `channelid`                     |
| **Returns** | `{ status }` indicating success or failure |

### Group Management Routes

| **Route**   | `/createGroup`                     |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Creates a new group                |
| **Parameters** | `groupname`                     |
| **Returns** | `{ groupid, groupname }` if successful |

| **Route**   | `/removeGroup`                     |
|-------------|------------------------------------|
| **Method**  | POST                               |
| **Purpose** | Removes a group                    |
| **Parameters** | `groupid`                        |
| **Returns** | `{ status }` indicating success or failure |

### WebSocket Routes
1. **WebSocket Routes**: For real-time communication in the chat system.

## Client-Server Interaction

### User Login
1. **Client**: The `LoginComponent` sends the user’s credentials to the `/login` endpoint.
2. **Server**: The server validates the credentials, retrieves the user’s role from `users.json`, and returns it.
3. **Client**: The `AuthService` stores the user role in `sessionStorage`, and the `NavbarComponent` updates the displayed links accordingly.

### User Management / Group Management
1. **Client**: The `GroupsComponent` allows the Super Admin and Group Admin (limited to their own groups) to create or delete groups.
2. **Server**: The server updates the `groups.json` file.
3. **Client**: The `GroupsComponent` updates the displayed list of groups based on the server's response.

### Profile Update
1. **Client**: The user updates their profile using the `ProfileComponent`.
2. **Server**: The server updates the corresponding entries in `extendedUsers.json` and returns a success message.
3. **Client**: The `ProfileComponent` reflects the updated information after a successful save.

### Channel Management
1. **Client**: The `ChannelsComponent` allows the creation or deletion of channels within a group.
2. **Server**: The server updates the `channels.json` file and returns the updated channel list.
3. **Client**: The `ChannelsComponent` updates the displayed list of channels based on the server's response.

### Message Management
1. **Client**: The `ChatComponent` sends a message to the server, including `username`, `text`, and `timestamp`.
2. **Server**: The server processes the message and stores it in the appropriate location.
3. **Client**: The `ChatComponent` updates the chat view with the new message.

### Image Upload
1. **Client**: The `ProfileComponent` or `ChatComponent` allows users to upload an avatar or send an image.
2. **Server**: The server processes the image, stores it, and returns a success message.
3. **Client**: The relevant component reflects the updated avatar or displays the uploaded image in the chat.



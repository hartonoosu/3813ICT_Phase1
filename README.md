# 3813ICT_Phase1
This is my second attempt of this assignment Phase 1.  This project is about creating a basic chatting app with several functionalities including managing users, group and the chat channel.

## Version Control

This project uses GitHub as the platform.

#### Repository Structure
The Git repository named `chat` is structured into two main directories:

   * **`server/`**: Contains all backend-related files, including routing, data handling, and configuration.
   * **`src/`**: Contains all frontend (Angular) components, services, and related files.

#### Branching
A feature-branching strategy was adopted for development:
   * **`main`**: The main branch which contains the completed parts of the project.
   * **`establish-architecture`**: The initial architecture/design of this chat-app.
   * **`feature/account-page`, `feature/navbar-dashboard`, `feature/login`**: Initially, these branches were used according to the branch names. However, since I am the only one working on this project, I decided to only use `feature/account-page` as my primary branch until this phase-1 was finished to avoid unnecessary merge conflicts.

#### Push Frequency
Frequent commits were made to track every logical change, including adjustments to component styles or small chores like cleaning up comments, removing `console.log` statements used for testing, and similar tasks.

#### Adding Comments
Necessary comments were added to explain why or how the code changed. This practice is useful for reviewing how specific parts of the code or certain syntax work. Some comments were also included directly in the code.

## Data Structure

Data structures used in both the client and server sides to represent the various entities.

#### Client-Side Data Structures (Angular):
All databases will be stored in MongoDB in phase 2. userid was stored as string since I was trying to generate random alphabetic and number as the value. Data for `channelid` will also be added in phase 2.
Please note that `usergroup` value is equal to `groupid`.

### Client-Side Data Structures (Angular)

| **Entity** | **Property** | **Type** |
|------------|--------------|----------|
| **User**   | `userid`     | string   |
|            | `username`   | string   |
|            | `useremail`  | string   |
|            | `usergroup`  | string   |
|            | `userrole`   | string   |
| **Group**  | `groupid`    | string   |
|            | `groupname`  | string (_planned ) |
| **Message** (_planned ) | `username`  | string   |
|            | `text`       | string   |
|            | `timestamp`  | Date     |

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
| **Group** (_planned_) | `groupid`   | string   |
|                  | `groupname`  | string   |


## Angular Architecture

The Angular application is structured using components, services, models, and routes to ensure modularity and maintainability.

#### Components
Some component might be added(video chat), or removed (possibly account and/or dashboard) in phase 2. 
1. **`NavbarComponent`**: Manages the navigation links based on user roles, including Super Admin, Group Admin, and regular users.
2. **`ChatComponent`**: Handles real-time messaging between users (_planned, not fully implemented_).
3. **`GroupsComponent`**: Manages the creation, deletion, and listing of user groups (_not fully implemented_).
4. **`ProfileComponent`**: Allows users to view and edit their profile details, also based on user roles. Super User can edit useremail, usergroup, and userrole. Group Admin can edit their own group and useremail while regular user can only edit their useremail.
5. **`LoginComponent`**: Handles user authentication and login processes.
6. **`AccountComponent`**: Displays user account details. Planned to be used as a welcome page too. (_currently in development_).
7. **`Dashboard`**: Displays user history and activities. (_currently in development_).
8. **`ChannelsComponent`**: Manages the creation and deletion of channels within a group (_planned for future implementation_).


#### Services

1. **`AuthService`**: Manages user authentication, login/logout processes, and retrieves user roles.
2. **`SocketService`**: (_Not yet implemented_) Will manage WebSocket connections for real-time communication.

#### Models (_to be added in phase 2_)
1. **`User`**: Represents a user entity with properties like `userid`, `username`, `useremail`, `usergroup`, and `userrole`.
2. **`Group`**: Represents a group entity with properties like `groupid`, and `groupname`.
3. **`Message`**: Represents a message entity with properties like `username`, `text`, and `timestamp`.

## Node Server Architecture

The Node.js server is designed to handle the backend logic and serves as the API provider for the Angular frontend.

#### Modules
1. **Express.js**: Used for setting up the server and handling HTTP requests.
2. **UUID**: Used to generate unique IDs for users and groups. (phase 2)
3. **File System (fs)**: Used to read and write JSON data files for storing user and group information.
4. **`FormsModule`**: Used for building and managing forms, including template-driven forms that rely on `ngModel` for two-way data binding.
5. **`RouterModule`**: Facilitates routing within the application, linking components to specific URLs.
6. **`CommonModule`**: Provides common directives like `NgIf` and `NgFor` that are used across components to display content conditionally and iterate over lists. Some were only NgIf or NgFor for my components.



#### Functions
1. **Authentication Functions**:
   * **`postLogin.js`**: Handles user login by verifying credentials and returning the user's role.
   * **`postLoginAfter.js`**: Manages post-login actions and updates.
   
2. **User Management Functions**:
   * **`postCreateUser.js`**: Creates a new user and updates the `users.json` and `extendedUsers.json` files.
   * **`postRemoveUser.js`**: Deletes a user from the `users.json` and `extendedUsers.json` files.

#### Files
1. **`server.js`**: Main server file that sets up the Express server and middleware.
2. **`data/users.json`**: Stores basic user information for authentication.
3. **`data/extendedUsers.json`**: Stores extended user profile information.
4. **`router/`**: Contains route handling files for different API endpoints.

#### Global Variables
1. **`PORT`**: The port on which the server listens (currently 3000 until we need to use https for video chat in phase 2).
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


### Future Routes (Planned)
1. **WebSocket Routes**: For real-time communication in the chat system.
2. **Group Management Routes**: For creating, updating, and deleting groups.

## Client-Server Interaction

### User Login
1. **Client**: The `LoginComponent` sends the user’s credentials to the `/login` endpoint.
2. **Server**: The server validates the credentials, retrieves the user’s role from `users.json`, and returns it.
3. **Client**: The `AuthService` stores the user role in `sessionStorage`, and the `NavbarComponent` updates the displayed links accordingly.

### User Management / Group Management (name to be changed)
1. **Client**: The `GroupsComponent` allows the Super Admin and Group Admin(limited to their own groups) to create or delete groups.
2. **Server**: The server updates the `groups.json` file (_planned for future implementation_).
3. **Client**: The `GroupsComponent` updates the displayed list of groups based on the server's response.

### Profile Update
1. **Client**: The user updates their profile using the `ProfileComponent`.
2. **Server**: The server updates the corresponding entries in `extendedUsers.json` and returns a success message.
3. **Client**: The `ProfileComponent` reflects the updated information after a successful save.

When I did the pull request on gitHub, I also added some comments on how the interaction works in a more detail especially in my early commits before the code getting too complex.

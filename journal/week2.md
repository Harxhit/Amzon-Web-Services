#### In week 2, after learning Docker from scratch, I applied the concepts by building my own Docker images, writing Dockerfiles, and creating Makefiles to automate common Docker tasks. I also created a Docker Compose file to manage multi-container setups and learned how to run, stop, and inspect containers. Finally, I practiced deploying containers and verified that the application worked correctly inside isolated environments. You can see my progress in the Docker repository here.

#### Since my project’s tech stack is different from the one used in the course, I needed to build the entire application from scratch. I created a dedicated src folder, installed the necessary dependencies, and integrated Winston for application logging and monitoring. I also set up MongoDB as the database, configured the connection, and ran it successfully. After that, I tested the Dockerfile I created to ensure the container builds and runs as expected.

**Docker commands I ran and what they do?**

### 1. This commands the build the image on the basis of my Dockerfile.

```bash
docker build -t backend-node ./backend
```

### 2.Runs my container

```bash
docker run -d -p 5000:5000 --name backend-container backend-node
```

### 3.Shows the container

```bash
docker ps -a
```

**Below is the screenshot of my terminal for all these commands**

![Creating an image](/assets/build.png)

In the above you can see I have created or build an image successfully after running first docker command you can see the name of image in my docker extension.

![Running the image and building a container](/assets/run.png)

In the above you can see that I have successfully created a container you can see in my extension and **docker ps -a** command to.

![Showing the logs of container](/assets/logs.png)

In the above you can see my container ran successfully with the files I just added and gave me the same output I get when I run my backend.

## Why We Use Containerization (Docker) in This Project

### 1. Same environment everywhere

Docker gives the backend and frontend a fixed, identical environment on every machine:

- Same Node.js version
- Same OS
- Same dependencies
- Same build tools
- No “works on my machine” problems

Your app runs exactly the same on:

- your laptop
- your friend’s laptop
- cloud servers
- CI/CD pipelines

This consistency is the biggest reason companies and I using Docker.

## 2. Simple setup

Without Docker:

- every user must install Node
- configure versions
- install dependencies
- fix OS-level differences

With Docker:

```bash
docker build
docker run
```

Everything works.
No manual setup.

## 3. Easy deployment

When the app is containerized:

- You ship the container image
- The server just runs it
- Zero OS configuration needed

This makes deployment to AWS, GCP, Azure, Render, Fly.io extremely simple.

4. Port isolation (frontend + backend can run together)

Frontend container runs on:

```bash
localhost:5173
```

Backend container runs on:

```bash
localhost:5000
```

Both stay isolated and never conflict with each other.

5. Lightweight microservices

Docker lets you split your app:

- backend service
- frontend service
- database service

Each service is its own container.
They communicate via ports.
Very useful when scaling.

### Sign-Up & Login Feature

- **User Interface**:
  Designed and implemented the UI for user sign-up and login using React. The forms are interactive, responsive, and display validation errors directly below the input fields for better user experience.

- **Sign-Up Flow**:
  Users can create an account by providing a username, first name, last name, email, and password. The form validates input both on the client-side and the server-side to ensure data integrity. General errors, such as “User already exists,” are displayed using toast notifications.

- **Login Flow**:
  Users can log in using their username or email along with a password. Server-side checks ensure the user exists and that the password matches. On successful login, JWT access and refresh tokens are generated. The refresh token is stored as an HTTP-only cookie for security.

- **Validation & Security**:
  Input validation is implemented using **Joi** schemas on the backend. Passwords are hashed and verified securely. HTTP-only cookies are used to prevent client-side access to sensitive tokens.

- **Key Features Implemented**:

  - Real-time form validation
  - Display of field-specific errors and general errors
  - Toast notifications for success and error messages
  - Secure authentication using JWT tokens
  - Interactive and user-friendly UI for authentication flows

This feature sets the foundation for secure user registration and authentication while maintaining a polished and responsive frontend experience.

### Real-Time Chat & Notification System

- **Real-Time Chat**:  
  Implemented live one-to-one messaging using Socket.IO. Messages are delivered instantly and stored in MongoDB with metadata such as `senderId`, `receiverId`, `deliveredAt`, and `status`. Users can fetch their entire chat history with a specific user through the `/conversation/:id` endpoint.

- **Message Architecture**:  
  A stable chat architecture was created using a deterministic `chatId` generated by sorting the two user IDs. This ensures every pair of users always maps to the same chatId, preventing duplicates or incorrect grouping.

- **Real-Time Notifications**:  
  Implemented a dedicated real-time notification system independent of chat messages. Notifications are delivered instantly to users via separate Socket.IO rooms, preventing overlap with chat messages.

- **Two-Room Socket Architecture**:  
  To prevent mixing of chat and notifications, the system was redesigned to use:

  - `chat-room-{userId}` for messages
  - `notification-room-{userId}` for notifications  
    This separation eliminated event collisions and UI inconsistencies.

- **Search Bar Fix**:  
  The search bar originally included the logged-in user. A backend filter now excludes the authenticated user's ID from search results to maintain correct UX.

- **Chat History Retrieval**:  
  Users can view all chats they have had with another user. Efficient queries using `chatId` ensure correct message grouping and fast retrieval.

---

### Errors & Bugs Fixed

- **Authentication Not Working**:  
  Fixed issues where JWTs were not passed correctly in socket handshakes and Axios requests. Updated CORS headers, socket authentication logic, and backend middleware to ensure secure and consistent verification.

- **CORS Errors (HTTP & WebSocket)**:  
  Resolved persistent CORS issues due to mismatched origins and missing allowed headers. Implemented unified CORS configuration for both Express and Socket.IO, enabling credentials and proper authorization headers.

- **Socket Event Mixing (Chat + Notifications Overlap)**:  
  Initially, both chat and notification events were received in the same room, causing incorrect UI updates. Switching to a two-room architecture resolved this conflict.

- **Room Architecture Failure**:  
  A single-room-per-user design caused notifications to appear as chat messages. Updated to dual-room architecture which fully isolates communication channels.

- **User Authentication Randomly Failing**:  
  Fixed by ensuring refresh tokens are set as HTTP-only cookies and that the access token is properly attached in every secure request.

- **axios 400 Bad Request Errors**:  
  Occurred because the route paths were mismatched (`/message/conversation/:id` vs `/api/message/...`). Configuration was fixed by aligning all API routes with `app.use('/api/message', messageRouter)` and updating frontend calls.

- **WebSocket Origin Errors**:  
  Solved by explicitly setting allowed origins, enabling credentials, and properly configuring the socket server with CORS rules.

---

### Current Tweaks Needed

- **Search bar improvement**:  
  Implement better fuzzy searching and debouncing.

- **Message read-status update**:  
  Need to add `readAt` updates and UI changes.

- **Responsiveness**:  
  The UI is not responsive yet. All pages need full mobile layouts.

- **Better error handling**:  
  Add global error handling and consistent server responses.

- **Optimized Socket Reconnection Logic**:  
  Improve handling for reconnect attempts to avoid duplicate event listeners.

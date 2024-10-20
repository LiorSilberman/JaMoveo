# JaMoveo Web App

The JaMoveo Web App is designed to enhance the musical rehearsal experience for the Moveo band by leveraging technology to manage and display song lyrics and chords in real-time. This application allows each band member to log in, join rehearsal sessions, and view song details appropriate to their instrument. Admin users can manage these sessions, choosing songs and controlling the display during rehearsals.


## Features

- **User Registration**: Allows new users to sign up, specifying their username, password, and the instrument they play.
- **User Authentication**: Users can log in with their credentials.
- **Rehearsal Sessions**: Admin users can create sessions where songs can be searched, selected, and broadcast to all logged-in users.
- **Song Search and Selection**:  Admins can search for songs directly from the Tab4U website in both English and Hebrew, and select them for the rehearsal.
- **Live Song Display**: During a session, connected users can see the chords and lyrics for the selected song, tailored to their role (e.g., singers see only lyrics).
- **Session Control**: Admins have controls to start new sessions, pick songs, and end sessions.


## Technologies Used

- Node.js with Express for the server-side
- React for the client-side
- MongoDB for the database
- Socket.IO for real-time communication
- Axios for HTTP requests
- Cheerio for web scraping
- CSS for styling


## Getting Started

These instructions will guide you through getting a copy of the project up and running on your local machine for development and testing purposes.


### Prerequisites

- [Node.js and npm](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/try/download/community)
- Git (optional, if cloning the repository)


### Installation

1. **Clone the repository (if using Git):**
   ```bash
   git clone https://github.com/LiorSilberman/JaMoveo.git
   cd Jamoveo
   ```
2. **Install dependencies:**
    ```bash
    npm install
    ```
3. **Set up environment variables:**
    - Create a `.env` file in the project root.
    - Add variables for database connections and any other secrets:
    ```bash
    MONGO_URI="Your mongo uri"
    ```
4. **Start the server**
    ```bash
    npm start
    ```
5. **Navigate to the client folder and start the React app:
    ```bash
    cd client
    npm start
    ```

## Usage (Localhost)
- Register as a new user: Visit the signup page at http://localhost:3000/signup.
- Login: After registering, log in at http://localhost:3000/login.
- Admin Sign Up: To register as an admin, visit http://localhost:3000/admin/signup.
- Admin login: To register as an admin, visit http://localhost:3000/admin/login.


### For Admin Users
- **Create a rehearsal session:** From the admin main page, you can create a new session and begin the song search process.
- **Search and select songs:** Input a search query to retrieve songs, then select one to display.

### For Regular Users
- **Join a session:** Log in and stay on the main player page to view the current song's lyrics or chords as updated by the admin.


##### If you'd like to visit the live version of the app, you can check it out at https://jamoveo.up.railway.app.
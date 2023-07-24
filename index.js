const express = require('express'); //we are using express.js to create rest api endpoints
const WebSocket = require('ws');// 

const app = express();
app.use(express.json()); // Parse JSON request bodies
const users = [];// Sample user database (for demonstration purposes only)
 
const PORT = 8080; // Replace with the desired port number

const server = app.listen(PORT, () => {
    console.log(`Server is live on http://localhost:${PORT}`);
});


//connecting ws sever to express server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('New Client connected..');

    // WebSocket message event listener
    
    ws.on('message', data =>{
        // console.log(`Client has sent us data: ${data}`);//we are putting this in a single websocet server and not on over all sever
        // ws.send("Im fine");
           wss.clients.forEach((client) => {
           client.send(data);
       });
        // Handle the message from the client if needed
        // Your custom logic here...
    });

    // WebSocket close event listener
    ws.on('close', () => {
        console.log('Client has disconnected..');
    });

    
});


app.get('/api', (req, res) => {
    const data = {
      name: "Shubham"
    };
  
    // Send the object as a JSON response
    res.json(data);
  
    // Send a message to all connected clients
    wss.clients.forEach((client) => {
      client.send('hii');
    });
  });


// Express route to handle POST request and send data to all connected WebSocket clients
app.post('/api', (req, res) => {
    const messageData = req.body; // Assuming the data sent in the POST request body
  
    // Send the message data as a JSON object to all connected clients
    const jsonData = JSON.stringify(messageData);
    wss.clients.forEach((client) => {
      client.send(jsonData);
    });
  
    res.json({ status: "Message sent to all connected clients." });
  });


  
// Endpoint: /api/register
// Method: POST
// Description: Allows a user to register by providing their username, email, and password.
// Action: Creates a new user account in the system.
app.post('/api/register', (req, res) => {
    const { username, email, password } = req.body;
  
    // Check if the user already exists
    const existingUser = users.find((user) => user.username === username);
    if (existingUser) {
      return res.status(409).json({ error: 'User already exists' });
    }
  
    // Create a new user and add to the database
    const newUser = { username, email, password };
    users.push(newUser);
  
    res.status(201).json({ message: 'User registered successfully' });
  });
  
  // Endpoint: /api/login
  // Method: POST
  // Description: Allows a user to log in by providing their username/email and password.
  // Action: Authenticates the user and generates an access token or session for further authentication.
  app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
  
    // Find the user in the database
    const user = users.find(
      (user) => user.username === username || user.email === username
    );
  
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
  
    // For simplicity, you can generate and return an access token here
    const accessToken = 'sample-access-token';
    res.status(200).json({ message: 'Login successful', accessToken });
  });
  
  // Endpoint: /api/logout
  // Method: POST
  // Description: Allows a logged-in user to log out from the system.
  // Action: Destroys the user's access token or session, effectively logging them out.
  app.post('/api/logout', (req, res) => {
    // For simplicity, you can just return a message indicating successful logout
    res.status(200).json({ message: 'Logout successful' });
  });

  //implementing put endpoint method to update username,
  app.put('/api/user-update', (req, res) => {
    const { username, newUsername } = req.body;
  
    // Find the user in the database
    const user = users.find((user) => user.username === username);
  
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // Update the user's registered name
    user.username = newUsername;
  
    res.status(200).json({ message: 'Username updated successfully' });
  });
  

  //delete api endpoint to delte users account
  app.delete('/api/user-delete', (req, res) => {
    const { username } = req.body;
  
    // Find the index of the user in the database
    const userIndex = users.findIndex((user) => user.username === username);
  
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }
  
    // Remove the user from the array
    users.splice(userIndex, 1);
  
    res.status(200).json({ message: 'User account deleted successfully' });
  });
 






  

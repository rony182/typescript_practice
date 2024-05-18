import app from './server';

// Set the port
const port = 3000;

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

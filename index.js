const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');  // Make sure to import 'path'
const formrouter = require('./routes/formRoutes'); // Fixed typo from 'rotuer' to 'router'
const airouter = require('./routes/TemplateRoute');
const googlerouter = require('./routes/GoogleAuthRoutes')

const app = express();
const port = process.env.PORT || 5000;

const corsOptions = {
  origin: '*',  // Allow all origins
};

app.use(express.json());
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML form on the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Use the form routes
app.use('/form', formrouter);
app.use('/ai',airouter);
app.use('/google', googlerouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

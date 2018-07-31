const path = require('path');
const express = require('express');

var publicPath = path.join(__dirname + '/../public');
const PORT = process.env.PORT || 3000;

var app = express();
app.use(express.static(publicPath));

app.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});
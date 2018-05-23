
const express = require('express');
const main_controller = require('./controller/main');
const port = require('./config').server_port;

const app = express();


app.post('/refresh', main_controller);
app.listen(port, () => {
	console.log(`api running on port: ${port}`);
});

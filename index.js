
const express = require('express');
const body_parser = require('body-parser');
const main_controller = require('./controller/main');
const port = require('./config').server_port;

const app = express();


app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }))

app.post('/refresh', main_controller);
app.listen(port, () => {
	console.log(`api running on port: ${port}`);
});

const bodyParser = require("body-parser");
const login = require("facebook-chat-api");
const express = require("express");
const app = express();

const port = 3000;

let fbApi;
let currentUserId;

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.get('/logout', (req, res) => {
    fbApi.logout((err) => {
        if(err) {
            return res.json(JSON.parse(`{"error": "Logout failed"}`));
        } else {
            fbApi = null;
            currentUserId = null;
            return res.json(JSON.parse(`{"data": "Logged Out"}`));
        }
    })
})

app.use((err, req, res, next) => {
    console.log('Something unexpected happened: ' + err);

    res.status(500).end('Error occurred!');
})

app.listen(port, (err) => {
    if(err) {
        return console.log("something bad happened: " + err);
    }

    console.log("server listening on port: " + port);
})
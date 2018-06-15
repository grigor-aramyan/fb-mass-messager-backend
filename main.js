const bodyParser = require("body-parser");
const login = require("facebook-chat-api");
const express = require("express");
const app = express();

const port = 3000;

let fbApi;
let currentUserId;
let friendList = [];

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

app.post('/login', (req, res) => {

    const email = req.body.email;
    const password = req.body.password;

    login({email: email, password: password}, (err, api) => {
        if(err) {
            const error = `{"error": "Login failed!"}`;

            return res.json(JSON.parse(error));
        }

        currentUserId = api.getCurrentUserID();
        fbApi = api;

        api.getFriendsList((err, data) => {
            if(err) {
                return res.json(JSON.parse(`{"error": "can't fetch friends list"}`));
            }

            let friendsString = "";
            for(i = 0; i < data.length; i++) {
                if(!data[i].isFriend) {
                    continue;
                }

                friendList.push({
                    userId: data[i].userID,
                    name: data[i].firstName
                    });

                //id--name--profilePic
                friendsString += data[i].userID + "---" + data[i].fullName + "---" + data[i].profilePicture + "::::";
            }

            res.json(`{"data": "${friendsString}"}`);
        });
    })
})

app.post('/disperse', (req, res) => {
    const placeholder = "AAAAA";

    const userId = req.body.userId;
    const messageOriginal = req.body.message;
    const friendsIdsEncoded = req.body.ids;

    let messageTmp;

    if (userId != currentUserId) {
        return res.json(JSON.parse(`{"error": "Access denied"}`));
    }

    if (fbApi == undefined) {
        return res.json(JSON.parse(`{"error": "Sign In first"}`));
    }

    const friendsIds = friendsIdsEncoded.split("--");

    friendsIds.forEach((id) => {
        messageTmp = messageOriginal;

        friendList.forEach((friendData) => {
            if(friendData.userId == id) {
                messageTmp = messageTmp.replace(placeholder, friendData.name);

                fbApi.sendMessage(messageTmp, id);
            }
        });
    });

    return res.json(JSON.parse(`{"data": "Message Sent!"}`));
})

app.get('/server_test', (req, res) => {
    return res.json(JSON.parse(`{"data": "Server running smoothly"}`));
})

app.get('/jfhgkelrw35jkdlfl', (req, res) => {
    return res.json(JSON.parse(`{"currentUserId": "${currentUserId}", "friendList": "${friendList}", "api": "${fbApi}"}`));
})

app.get('/logout', (req, res) => {
    fbApi.logout((err) => {
        if(err) {
            return res.json(JSON.parse(`{"error": "Logout failed"}`));
        } else {
            fbApi = null;
            currentUserId = null;
            friendList = [];
            return res.json(JSON.parse(`{"data": "Logged Out"}`));
        }
    })
})

app.get('/current_user_id', (req, res) => {
    if(currentUserId != undefined) {
        return res.json(JSON.parse(`{"userID": "${currentUserId}"}`));
    } else {
        return res.json(JSON.parse(`{"error": "id undefined"}`));
    }
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
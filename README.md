# Node/Express back-end for Fb-Mass-Messager app

Non-concurrent single-user support engine for Facebook Mass Messager app. Utilizes `facebook-chat-api` package to disperse given message to provided friends list as PMs.

### Packages used
* Express, https://github.com/expressjs/expressjs.com
* facebook-chat-api, https://www.npmjs.com/package/facebook-chat-api

### User manual
Fork this repo, add configs for your specific deploy environment, deploy! It's that simple.

Already configured for Heroku deploy. Just comment/uncomment 2 lines at the end of `main.js` to listen to system provided port instead of port 3000, which is used in dev purposes.

### Disclaimer
Use in your own risk. Facebook algos can mark your account as 'spammy' or block it entirely, if you'll login/logout frequently or send large amount of messages to different people/friends in short periods of time (exactly what this engine is supposed to do)) ).

USE RESPONSIBLY, folks... and happy hacking :)


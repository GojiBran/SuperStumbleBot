// ==UserScript==
// @name         StumbleBot
// @namespace    StumbleBot
// @version      1.0
// @description  Play youtube videos from the chat box and/or add custom commands to StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// ==/UserScript==
// The StumbleChat Bot is a UserScript written in JavaScript designed to enhance the user experience on StumbleChat, a web-based chat platform, by adding additional functionality for handling specific chat messages and enabling media playback within the chat room.
// The script modifies the behavior of WebSocket communication to intercept and manipulate messages. It establishes a WebSocket connection with the chat server and overrides the send method to intercept outgoing messages.

// ==UserScript==
// @name         StumbleBot
// @namespace    StumbleBot
// @version      1.0
// @description  Play youtube videos from the chat box and/or add custom commands to StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// ==/UserScript==
// The StumbleChat Bot is a UserScript written in JavaScript designed to enhance the user experience on StumbleChat, a web-based chat platform, by adding additional functionality for handling specific chat messages and enabling media playback within the chat room.
// The script modifies the behavior of WebSocket communication to intercept and manipulate messages. It establishes a WebSocket connection with the chat server and overrides the send method to intercept outgoing messages.


let lastSentHour = -1;
let shouldSendMessage = false;

setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    // Ensure the message is only scheduled once per hour at HH:20:00
    if (currentMinute === 20 && currentSecond === 0 && lastSentHour !== currentHour && !shouldSendMessage) {
        lastSentHour = currentHour;
        shouldSendMessage = true; // Set flag
    }
}, 1000);

(function() {
    // Load userNicknames from localStorage (if any)
    let userNicknames = JSON.parse(localStorage.getItem('userNicknames')) || {};

    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        this._send(data);

        this.addEventListener('message', handleMessage.bind(this), false);

        this.send = function(data) {
            console.log('send:', data);
            const sendData = safeJSONParse(data);

            if (sendData && sendData['stumble'] === 'subscribe') {
                console.log('subscribe caught');
            } else {
                this._send(data);
            }
        };
    };

    function handleMessage(msg) {
        console.log('<<', msg.data);
        const wsmsg = safeJSONParse(msg.data);
        console.log(wsmsg);

        // Store user's nickname and info when they join
        if (wsmsg['stumble'] === 'join' && wsmsg['nick'] && wsmsg['username'] && wsmsg['handle']) {
            const username = wsmsg['username'];
            let nickname = wsmsg['nick'];
            const handle = wsmsg['handle'];

            // If nickname starts with "guest-" followed by numbers, use username instead
            if (/^guest-\d+$/i.test(nickname)) {
                nickname = username;
            }

            // Check if user has been here before
            if (userNicknames[username]) {
                // User is returning, send a "welcome back" message using username
                respondWithMessage.call(this, `Welcome back to Let's Get High, ${nickname || username}!`);
            } else {
                // First-time user, send a "welcome" message using username
                respondWithMessage.call(this, `Welcome to Let's Get High, ${nickname || username}!`);
            }

            // Store or update the user's info using both username and handle
            userNicknames[username] = {
                handle: handle,
                username: username,
                nickname: nickname || username,
                modStatus: wsmsg['mod'] ? "Moderator" : "Regular"
            };
            userNicknames[handle] = {
                handle: handle,
                username: username,
                nickname: nickname || username,
                modStatus: wsmsg['mod'] ? "Moderator" : "Regular"
            };

            // Save the updated userNicknames to localStorage
            localStorage.setItem('userNicknames', JSON.stringify(userNicknames));
        }

        // Listen for nickname changes and update userNicknames
        if (wsmsg['stumble'] === 'nick' && wsmsg['handle'] && wsmsg['nick']) {
            const handle = wsmsg['handle']; // Unique user handle
            const newNickname = wsmsg['nick']; // New nickname

            if (userNicknames[handle]) {
                userNicknames[handle].nickname = newNickname; // Update stored nickname
                userNicknames[userNicknames[handle].username].nickname = newNickname; // Ensure username entry updates too

                // Save updated nicknames to localStorage
                localStorage.setItem('userNicknames', JSON.stringify(userNicknames));

                console.log(`Nickname updated: ${handle} is now ${newNickname}`);
            }
        }

        // Send 420 alert
        if (shouldSendMessage) {
            shouldSendMessage = false; // Reset the flag immediately to prevent multiple sends

            setTimeout(() => {
                this._send('{"stumble":"msg","text": "🌲 It\'s 420 somewhere! Smoke em if you got em! 💨"}');
            }, 1000); // 1-second delay to send at HH:20:01
        }

//-----------------------------------------------------------------------------------------------------------------------------------
// Bot Commands ---------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------


// YouTube --------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        // Define an array of keywords to check for YouTube-related commands
        var keywords = ['.youtube', '.video', '.play', '.yt'];

        // Function to convert various YouTube URL formats to a standard format
        function convertToRegularYouTubeLink(url) {
            // Improved regex to extract video ID from multiple YouTube URL formats
            var videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([\w-]+)/;
            var match = url.match(videoIdRegex);
            if (match && match[1]) {
                return 'https://www.youtube.com/watch?v=' + match[1];
            }
            return null; // Return null if the URL doesn't match
        }

        // Loop through each keyword in the keywords array
        for (var i = 0; i < keywords.length; i++) {
            // Check if the "text" property in wsmsg starts with the current keyword
            if (wsmsg['text'].startsWith(keywords[i])) {
                // Extract the query part of the message after the keyword
                var query = wsmsg['text'].substring(keywords[i].length).trim();

                // Check if the query is not empty
                if (query) {
                    // Check if the query is a YouTube URL and convert it
                    var regularLink = convertToRegularYouTubeLink(query);
                    if (regularLink) {
                        // Send a formatted message with the converted YouTube link
                        this._send('{"stumble": "youtube","type": "add","id": "' + regularLink + '","time": 0}');
                    } else {
                        // Handle non-URL queries as is (e.g., search terms)
                        this._send('{"stumble": "youtube","type": "add","id": "' + query + '","time": 0}');
                    }
                }

                // Exit the loop as the query has been processed
                break;
            }
        }

// User Commands --------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .me
        if (wsmsg['text'].startsWith(".me")) {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "Bot"; // Use handle to get the nickname, default to Bot if not found

            const message = wsmsg['text'].slice(4).trim(); // Get the string after .me (removes the command part)

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} ${message}` // Send message with nickname + the string
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .my
        if (wsmsg['text'].startsWith(".my")) {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "Bot"; // Use handle to get the nickname, default to Bot if not found

            const message = wsmsg['text'].slice(4).trim(); // Get the string after .my (removes the command part)

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname}'s ${message}` // Send message with nickname + possessive
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .cheers (Use handle to get nickname)
        if (wsmsg['text'] === ".c" || wsmsg['text'] === ".cheers") {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "Someone"; // Use handle to get the nickname

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is smokin! Cheers! 🌲💨`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .420
        if (wsmsg['text'] === ".420") {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "Someone"; // Use handle to get the nickname

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is smokin! Cheers! 💨 Happy 4:20! 🌲`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .sub cheers
        if (wsmsg['text'] === ".sc" || wsmsg['text'] === ".subcheers" || wsmsg['text'] === ".subchar" || wsmsg['text'] === ".schar" || wsmsg['text'] === ".scheers") {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "Someone"; // Use handle to get the nickname

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is subbin! Char! 🌲🍻`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .dab
        if (wsmsg['text'] === ".d" || wsmsg['text'] === ".dab" || wsmsg['text'] === ".dabbin" || wsmsg['text'] === ".dabbing") {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "Someone";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is dabbin! Cheers! 💨`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .joint
        if (wsmsg['text'] === ".j" || wsmsg['text'] === ".joint") {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "Someone";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is smokin a joint! Cheers! 🌲💨`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .prep
        if (wsmsg['text'] === ".p" || wsmsg['text'] === ".prep" || wsmsg['text'] === ".preppin" || wsmsg['text'] === ".prepping" || wsmsg['text'] === ".pack" || wsmsg['text'] === ".packin" || wsmsg['text'] === ".packing") {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "Someone";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is packin! 🌲`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .set
        if (wsmsg['text'] === ".s" || wsmsg['text'] === ".set" || wsmsg['text'] === ".packed" || wsmsg['text'] === ".ready") {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "Someone";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname} is set! 🌲`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: goji and bran (case-insensitive and works anywhere in a sentence) [MUST FIX TO NOT REPLY TO SELF]
        /*if (/goji|bran/i.test(wsmsg['text'])) {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "YOU"; // Use handle to get the nickname

            // Determine whether "goji" or "bran" was used in the text
            const wordUsed = /goji/i.test(wsmsg['text']) ? "GOJI" : "BRAN";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${wordUsed} FARTED ON 💨 ${nickname}!`
            }));
        }*/

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .penis
        if (wsmsg['text'].startsWith(".penis")) {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "Bot"; // Use handle to get the nickname

            // Generate random length for the penis (8D to 8============D)
            const length = Math.floor(Math.random() * 21) + 1; // Generates a number between 1 and 21
            const penis = `8${"=".repeat(length)}D`;

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname}'s penis is this long: ${penis}`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .smoko
        if (wsmsg['text'].startsWith(".smoko")) {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "YOU"; // Use handle to get the nickname

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname.toUpperCase()} IS ON SMOKO! SO LEAVE EM ALONE! 🎶`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .piss
        if (wsmsg['text'].startsWith(".piss")) {
            const handle = wsmsg['handle']; // Get the handle
            const username = wsmsg['username']; // Get the username to find the nickname
            const nickname = userNicknames[handle]?.nickname || "YOU"; // Use handle to get the nickname

            this._send(JSON.stringify({
                stumble: "msg",
                text: `${nickname.toUpperCase()} HAS TO PISS PISS! 💦`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .pooping (Random responses)
        if (/^\.poop(ing|ed)?$/.test(wsmsg['text'])) {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "Someone";

            const responses = [
                `${nickname} is pooping! 💩`,
                `${nickname} took a break! 💩`,
                `${nickname} is dropping the kids off at the pool! 💩`
            ];

            // Choose a random response
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            this._send(JSON.stringify({
                stumble: "msg",
                text: randomResponse
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .farting (Random responses)
        if (/^\.fart(ing|ed)?$/.test(wsmsg['text'])) {
            const handle = wsmsg['handle'];
            const nickname = userNicknames[handle]?.nickname || "Someone";

            const responses = [
                `${nickname} let out a loud fart! 💨`,
                `${nickname} just ripped one! 💨`,
                `${nickname} is blasting some gas! 💨`
            ];

            // Choose a random response
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];

            this._send(JSON.stringify({
                stumble: "msg",
                text: randomResponse
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .users (List all users with delay)
        if (wsmsg['text'] === ".users") {
            const usersArray = Object.values(userNicknames)
                .filter((v, i, a) => a.findIndex(t => t.username === v.username) === i) // Remove duplicates
                .map(user => `Nickname: ${user.nickname}, Username: ${user.username}, Status: ${user.modStatus}`);

            if (usersArray.length === 0) {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: "No users stored."
                }));
            } else {
                usersArray.forEach((userInfo, index) => {
                    setTimeout(() => {
                        this._send(JSON.stringify({
                            stumble: "msg",
                            text: userInfo
                        }));
                    }, index * 1000); // Delay each message by 1000ms
                });
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start self
        if (wsmsg['text'] === ".self") // Show the user's info
        {
            const handle = wsmsg['handle'];
            const user = userNicknames[handle];

            if (user) {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: `Your Info:\nNickname: ${user.nickname}\nHandle: ${user.handle}\nUsername: ${user.username}\nStatus: ${user.modStatus}`
                }));
            } else {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: "Sorry, I couldn't find your information."
                }));
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .clearUsers (Clear stored users)
        if (wsmsg['text'] === ".clearUsers") {
            userNicknames = {}; // Reset the user data
            localStorage.removeItem('userNicknames'); // Clear from localStorage

            this._send(JSON.stringify({
                stumble: "msg",
                text: "All stored users have been cleared."
            }));
        }

// General Commands -----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        // start Bot repo
        if (wsmsg['text'] === ".bot") {
        const lines = [
            "Download the bot here: https://github.com/GojiBran/StumbleBot",
            "Just for YouTube here: https://github.com/GojiBran/stumbletube"
        ];

        lines.forEach((line, index) => {
            setTimeout(() => {
                this._send(`{"stumble":"msg","text":"${line}"}`);
            }, 1000 * index); // 1000ms delay between each line
        });
        }
        // end Bot repo

//-----------------------------------------------------------------------------------------------------------------------------------

        //start choose
        if (wsmsg['text'].startsWith(".choose")) // Choose from a list
        {
            const options = wsmsg['text'].slice(7).split(',').map(option => option.trim()); // Remove ".choose" and split by commas

            if (options.length > 0) {
                // Randomly choose an option
                const choice = options[Math.floor(Math.random() * options.length)];

                this._send(JSON.stringify({
                    stumble: "msg",
                    text: `I choose: ${choice}!`
                }));
            } else {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: "Please provide some options to choose from! (apple, orange, banana)"
                }));
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // start .suggest command
        if (wsmsg['text'] === ".suggest") {
            const lines = [
                "To suggest a new command for StumbleBot, please follow this format:",
                "Command: The name of the command (.cheers)",
                "Result: What you expect StumbleBot to do (This command outputs a cheers message)",
                "Example Suggestion:",
                "'.cheers'",
                "'Cheers!'",
                "Thank you for your suggestion!"
            ];

            let delay = 1000; // 1000ms delay

            // Send each line with a delay
            lines.forEach((line, index) => {
                setTimeout(() => {
                    this._send('{"stumble":"msg","text":"' + line + '"}');
                }, index * delay);
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // start bacon
        if (wsmsg['text'] === ".bacon") {
            this._send('{"stumble":"msg","text":".yt bacon 45min"}'); // yes lazy
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start char
        if (wsmsg['text'] === ".char") // Char gif
        {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/WVqt3hx.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start chilidog
        if (wsmsg['text'] === ".chilidog")
        {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/0A8zOPT.jpeg"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start claptrick
        if (wsmsg['text'] === ".claptrick")
        {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/hWUWU2P.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start hippo
        if (wsmsg['text'] === ".hippo") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/GtvnStS.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start owner
        if (wsmsg['text'].startsWith(".owner")) {
            this._send('{"stumble":"msg","text": "YOU ARE NOW THE ROOM OWNER!"}');
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start jedi
        if (wsmsg['text'] === ".jedi") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/MCSGgcI.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start lola
        if (wsmsg['text'] === ".lola") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/flta89w.png"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start wizard
        if (wsmsg['text'] === ".wizard") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/E8CPWDV.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start packie
        if (wsmsg['text'] === ".packiedance") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/utGknCk.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start vato
        if (wsmsg['text'] === ".vato") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/L7IAM9c.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start escapetime
        if (wsmsg['text'] === ".escapetime") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/rlLPzlw.png"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start baked
        if (wsmsg['text'] === ".baked") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/mPfCDtI.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start beans
        if (wsmsg['text'] === ".beans") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/YASZc8X.png"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start dredd
        if (wsmsg['text'] === ".dredd") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/fstVLVH.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start car fart
        if (wsmsg['text'] === ".carfart") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/GxUAMV9.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start meatmeat
        if (wsmsg['text'] === ".meatmeat") {
            // Create an array of GIF URLs
            const gifs = [
                "https://i.imgur.com/LCTLwJO.gif",
                "https://i.imgur.com/xs5jL52.jpeg",
                "https://i.imgur.com/sTykk6e.jpeg",
                "https://i.imgur.com/9OkT24Y.jpeg",
                "https://i.imgur.com/5hLQYft.jpeg"
            ];

            // Select a random GIF from the array
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start flamingo
        if (wsmsg['text'] === ".flamingo") { // When dance
            // Create an array of GIF URLs
            const gifs = [
                "https://i.imgur.com/0NysV2K.gif",
                "https://i.imgur.com/7iJcUmV.gif"
            ];

            // Select a random GIF from the array
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start viper
        if (wsmsg['text'] === ".viper") {
            // Create an array of GIF URLs
            const gifs = [
                "https://i.imgur.com/xPe1aH8.gif"
            ];

            // Select a random GIF from the array
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start spread em
        if (wsmsg['text'] === ".spreadem") {
            // Create an array of GIF URLs
            const gifs = [
                "https://i.imgur.com/iOljGSH.mp4"
            ];

            // Select a random GIF from the array
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start dance
        if (wsmsg['text'] === ".dance") { // When dance
            // Create an array of GIF URLs
            const gifs = [
                "https://i.imgur.com/cgcwOQ5.gif",
                "https://i.imgur.com/32bg1ok.gif",
                "https://i.imgur.com/4fbhUZw.gif",
                "https://i.imgur.com/VqQFYRl.gif"
            ];

            // Select a random GIF from the array
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start Bustin command
        if (wsmsg['text'] === ".bustin") {
            // Randomly choose between 0, 1, or 2
            const randomChoice = Math.floor(Math.random() * 3);

            if (randomChoice === 0) {
                // Send "BUSTIN BUSTIN..." followed by "BUSTIN MAKES ME FEEL GOOD!"
                this._send('{"stumble":"msg","text":"BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN"}');
                setTimeout(() => {
                    this._send('{"stumble":"msg","text":"BUSTIN MAKES ME FEEL GOOD!"}');
                }, 1000); // 1 second delay between messages
            } else if (randomChoice === 1) {
                // Send only "BUSTIN MAKES ME FEEL GOOD!"
                this._send('{"stumble":"msg","text":"BUSTIN MAKES ME FEEL GOOD!"}');
            } else if (randomChoice === 2) {
                // Send a longer string of "BUSTIN BUSTIN..."
                this._send('{"stumble":"msg","text":"BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN"}');
            }
        }
        // End Bustin command

//-----------------------------------------------------------------------------------------------------------------------------------

        //start froggy
        if (wsmsg['text'] === ".froggy") {
            // Create an array of responses
            const rsp = [
                "https://i.imgur.com/Cyhj3tq.gif"
            ];

            // Select a random response from the array
            const randomRsp = rsp[Math.floor(Math.random() * rsp.length)];

            // Send the random response
            this._send(`{"stumble":"msg","text": "${randomRsp}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start boobs
        // Define an array of commands that will trigger the same result
        const triggerCommands = [".boobs", ".tits", ".booby", ".busty", ".boobies", ".titties", ".boob", ".tit", ".milkers", ".teet", ".teets"];

        // Define the GIFs to send
        const gifs = [
            "https://i.imgur.com/IVHC6hy.gif",
            "https://i.imgur.com/bCQIiX5.gif",
            "https://i.imgur.com/0xYIcCS.gif",
            "https://i.imgur.com/9cQp2Iu.gif",
            "https://i.imgur.com/1DK3FzN.gif",
            "https://i.imgur.com/12Zpn2H.gif",
            "https://i.imgur.com/SLkZFk7.gif",
            "https://i.imgur.com/DHZfM5T.gif",
            "https://i.imgur.com/F2CcNyv.gif",
            "https://i.imgur.com/V8ngvRm.gif",
            "https://i.imgur.com/x3dElVe.gif"
        ];

        // Check if the message matches any of the trigger commands
        if (triggerCommands.includes(wsmsg['text'])) {
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start booty
        // Define an array of commands that will trigger the same result
        const triggerBootyCommands = [".booty", ".ass", ".butt", ".donk", ".fanny", ".bongos"];

        // Define the GIFs to send
        const bootygifs = [
            "https://i.imgur.com/ryLacHQ.gif",
            "https://i.imgur.com/nJ7n1oT.gif",
            "https://i.imgur.com/2dwimr2.gif",
            "https://i.imgur.com/ZrueOWT.gif",
            "https://i.imgur.com/h4bt7by.gif",
            "https://i.imgur.com/5xoHi5e.gif",
            "https://i.imgur.com/uWJaIsY.gif",
            "https://i.imgur.com/hWUWU2P.gif",
            "https://i.imgur.com/PAg2tA1.gif",
            "https://i.imgur.com/KgALc2j.gif",
            "https://i.imgur.com/GnXXrzM.gif",
            "https://i.imgur.com/Hn5LEVA.gif",
            "https://i.imgur.com/GszuDNc.gif",
            "https://i.imgur.com/WRkLICq.gif",
            "https://i.imgur.com/fGqJjtI.gif",
            "https://i.imgur.com/Z3SgS85.gif",
            "https://i.imgur.com/oZVxtAU.gif"
        ];

        // Check if the message matches any of the trigger commands
        if (triggerBootyCommands.includes(wsmsg['text'])) {
            const randombootyGif = bootygifs[Math.floor(Math.random() * bootygifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randombootyGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start gilf
        // Define an array of commands that will trigger the same result
        const triggerGilfCommands = [".gilf"];

        // Define the GIFs to send
        const gilfgifs = [
            "https://i.imgur.com/97GPJiN.gif",
            "https://i.imgur.com/i7s0Wje.gif",
            "https://i.imgur.com/dZzwFuw.mp4",
            "https://i.imgur.com/jQkz5nQ.mp4"
        ];

        // Check if the message matches any of the trigger commands
        if (triggerGilfCommands.includes(wsmsg['text'])) {
            const randomgilfGif = gilfgifs[Math.floor(Math.random() * gilfgifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomgilfGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start milf
        // Define an array of commands that will trigger the same result
        const triggerMilfCommands = [".milf"];

        // Define the GIFs to send
        const milfgifs = [
            "https://i.imgur.com/8frocoC.gif"
        ];

        // Check if the message matches any of the trigger commands
        if (triggerMilfCommands.includes(wsmsg['text'])) {
            const randommilfGif = milfgifs[Math.floor(Math.random() * milfgifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randommilfGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start dilf
        // Define an array of commands that will trigger the same result
        const triggerDilfCommands = [".dilf"];

        // Define the GIFs to send
        const dilfgifs = [
            "https://i.imgur.com/bDgntvS.gif",
            "https://i.imgur.com/aoEIL0R.gif",
            "https://i.imgur.com/zgX6nDA.gif",
            "https://i.imgur.com/XqzRTGk.gif",
            "https://i.imgur.com/CjRngKa.gif",
            "https://i.imgur.com/Cu7AwgK.gif",
            "https://i.imgur.com/pxTCSZo.gif",
            "https://i.imgur.com/Y0gVOZr.gif",
            "https://i.imgur.com/vJQmSMk.gif",
            "https://i.imgur.com/Hxap00t.gif"
        ];

        // Check if the message matches any of the trigger commands
        if (triggerDilfCommands.includes(wsmsg['text'])) {
            const randomdilfGif = dilfgifs[Math.floor(Math.random() * dilfgifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomdilfGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start snarf dilf
        // Define an array of commands that will trigger the same result
        const triggersDilfCommands = [".snarfdilf"];

        // Define the GIFs to send
        const sdilfgifs = [
            "https://i.imgur.com/RSZ7xzg.jpeg"
        ];

        // Check if the message matches any of the trigger commands
        if (triggersDilfCommands.includes(wsmsg['text'])) {
            const randomsdilfGif = sdilfgifs[Math.floor(Math.random() * sdilfgifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomsdilfGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start say command
        if (wsmsg['text'].startsWith(".say ")) {
            // Extract text after ".say " command
            const sayText = wsmsg['text'].substring(5);
            this._send(`{"stumble":"msg","text":"${sayText}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'].startsWith(".floyd")) {
            const pinkFloydLyrics = [
                { quote: "We don’t need no education.", song: "Another Brick in the Wall" },
                { quote: "All in all, it’s just another brick in the wall.", song: "Another Brick in the Wall" },
                { quote: "The lunatic is on the grass.", song: "Brain Damage" },
                { quote: "Wish you were here.", song: "Wish You Were Here" },
                { quote: "Shine on you crazy diamond.", song: "Shine On You Crazy Diamond" },
                { quote: "Time is on my side, yes it is.", song: "Time" },
                { quote: "Money, it’s a crime. Share it fairly but don’t take a slice of my pie.", song: "Money" },
                { quote: "Isn’t this where we came in?", song: "Echoes" },
                { quote: "I have become comfortably numb.", song: "Comfortably Numb" },
                { quote: "So, so you think you can tell Heaven from Hell?", song: "Wish You Were Here" },
                { quote: "And if the band you’re in starts playing different tunes, I’ll see you on the dark side of the moon.", song: "Brain Damage" },
                { quote: "The time is gone, the song is over, thought I had something more to say.", song: "Eclipse" },
                { quote: "You are the one who’ll make the rules.", song: "Mother" },
                { quote: "And the eyes in the sky look up to the day.", song: "The Great Gig in the Sky" },
                { quote: "I’m not the one you think I am.", song: "In The Flesh?" },
                { quote: "And I will see you on the dark side of the moon.", song: "Brain Damage" },
                { quote: "I’m a little bit of a cowboy, baby.", song: "Breathe" },
                { quote: "Everything under the sun is in tune, but the sun is eclipsed by the moon.", song: "Eclipse" },
                { quote: "You can’t have any pudding if you don’t eat your meat!", song: "Another Brick in the Wall" },
                { quote: "There is no pain, you are receding.", song: "Comfortably Numb" },
                { quote: "The show must go on.", song: "The Show Must Go On" },
                { quote: "I’m just a little black spot on the sun today.", song: "Pigs (Three Different Ones)" }
            ];

            const randomLyric = pinkFloydLyrics[Math.floor(Math.random() * pinkFloydLyrics.length)];

            this._send(`{"stumble":"msg","text":"🎸 ${randomLyric.quote} 🎶"}`);

            // Delay for song title
            setTimeout(() => {
                this._send(`{"stumble":"msg","text":"– ${randomLyric.song}"}`);
            }, 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Handle the ".commands list" command to output the commands link
        if (wsmsg['text'].toLowerCase() === '.commands list') {
            this._send(`{"stumble":"msg","text":"Bot Commands: https://github.com/GojiBran/SuperStumbleBot-Commands"}`);
        }


        // Handle the "commands" and ".commands" commands to output the list of commands as a single message
        if (wsmsg['text'].toLowerCase() === 'commands' || wsmsg['text'].toLowerCase() === '.commands') {
            // Define the commands
            const commandsList = [
                "- .c is Cheers",
                "- .p is Packin",
                "- .s is Set",
                "- .tits shows boobs gifs",
                "- .ass shows butt gifs",
                "- .yt with a link or search"
            ];

            // Function to send each command with a delay
            const sendCommandsLineByLine = (list, index = 0) => {
                if (index < list.length) {
                    this._send(`{"stumble":"msg","text":"${list[index]}"}`);
                    setTimeout(() => sendCommandsLineByLine(list, index + 1), 1000); // Delay 1000ms before sending the next one
                }
            };

            // Start sending the commands line by line
            sendCommandsLineByLine(commandsList);
        }

// Triggers -------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        //ping pong
        if (wsmsg['text'] === "ding") {
            setTimeout(() => this._send('{"stumble":"msg","text":"DONG"}'), 1000);
        } else if (wsmsg['text'] === "ping") {
            setTimeout(() => this._send('{"stumble":"msg","text":"PONG"}'), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Curse word check command
        if (/\b(shit|fuck|bitch|asshole|damn|bastard|cock|pussy|dick|cunt|slut|fag|twat|douche|motherfucker|prick|gay|retard|nigger|whore|bastard)\b/i.test(wsmsg['text'])) {
            this._send('{"stumble":"msg","text":"LE GASP!!"}');
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //5-0
        if (wsmsg['text'] === "5-0") {
            setTimeout(() => this._send('{"stumble":"msg","text":"Cheese it!"}'), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //set and packed
        if (wsmsg['text'] === "set") {
            setTimeout(() => this._send('{"stumble":"msg","text":"Let\'s smoke!"}'), 1000);
        } else if (wsmsg['text'] === "packed") {
            setTimeout(() => this._send('{"stumble":"msg","text":"Let\'s toke!"}'), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // bran and goji
        if (wsmsg['text'] === "bran") {
            setTimeout(() => this._send('{"stumble":"msg","text":"Bran farted on you!"}'), 1000);
        } else if (wsmsg['text'] === "goji") {
            setTimeout(() => this._send('{"stumble":"msg","text":"Goji farted on you!"}'), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // MAMA
        if (wsmsg['text'] === "MAMA") {
            setTimeout(() => this._send('{"stumble":"msg","text":"https://i.imgur.com/SzmUrg0.gif"}'), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // im on smoko
        if (wsmsg['text'] === "im on smoko") {
            setTimeout(() => this._send('{"stumble":"msg","text":"SO LEAVE EM ALONE!"}'), 1000);
        } else if (wsmsg['text'] === "smoko") {
            setTimeout(() => this._send('{"stumble":"msg","text":"THEY\'RE ON SMOKO! SO LEAVE EM ALONE!"}'), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start cheers commands list
        if (wsmsg['text'].toLowerCase() === 'cheers commands') {
            // Define the StumbleBot Commands list and sort it alphabetically
            const ccommandsList = [
                '[skal]',
                '[sante]',
                '[prost]',
                '[cin cin]',
                '[kanpai]',
                '[salud]',
                '[salute]',
                '[kippis]',
                '[ganbei]',
                '[na zdrowie]',
                '[cheers]',
                '[char]',
                '[şerefe]',
                '[乾杯]'
            ].sort(); // Sorting alphabetically

            // Send the list of commands as a single message, separated by commas
            this._send(`{"stumble":"msg","text":"${ccommandsList.join(', ')}"}`);
        }

        // == End cheers commands list ==

//-----------------------------------------------------------------------------------------------------------------------------------

        //start cheers
        const cheersTriggers = {
            // Cheers in various languages (with special characters and English)
            'skal': ['Skål! To a great night!', 'Skål! To friendship and laughter!', 'Skål! To making memories together!'],
            'sante': ['Santé! To health and happiness!', 'Santé! To good spirits!', 'Santé! Here’s to the best year yet!'],
            'prost': ['Prost! To life and good friends!', 'Prost! Here’s to new beginnings!', 'Prost! To making memories together!'],
            'cin cin': ['Cin Cin! To life and laughter!', 'Cin Cin! Here’s to unforgettable moments!', 'Cin Cin! To everything that brings joy!'],
            'kanpai': ['Kanpai! To unforgettable memories!', 'Kanpai! Cheers to good times!', 'Kanpai! Here’s to new experiences!'],
            'kampai': ['Kampai! To unforgettable memories!', 'Kampai! Cheers to good times!', 'Kampai! Here’s to new experiences!'],
            'salud': ['Salud! To health and happiness!', 'Salud! To a wonderful life ahead!', 'Salud! Here’s to many more memories!'],
            'salute': ['Salute! To your health!', 'Salute! Here’s to making memories!', 'Salute! To friendships and good times!'],
            'kippis': ['Kippis! To health!', 'Kippis! To good company!', 'Kippis! To life’s little pleasures!'],
            'ganbei': ['Ganbei! Let’s make today unforgettable!', 'Ganbei! Cheers to good times!', 'Ganbei! To memories we’ll cherish forever!'],
            'na zdrowie': ['Na zdrowie! To lasting friendships!', 'Na zdrowie! To health and happiness!', 'Na zdrowie! To many more cheers!'],
            'cheers': ['Cheers! Here’s to good times!', 'Cheers to you!', 'Cheers to great moments ahead!'],
            'char': ['Char! To all the good things in life!', 'Char to you!', 'Char to unforgettable moments ahead!'],
            'charrr': ['Charrr! To the adventure ahead!', 'Charrr! To all the amazing moments!', 'Charrr to good times with friends!'],
            'cheers to that': ['Cheers to that! To unforgettable memories!', 'Cheers to that! Here’s to everything worth celebrating!', 'Cheers to that! Let’s make this one special!'],
            'char amigs': ['Char amigs! To good times with good friends!', 'Char amigs! Here’s to us!', 'Char amigs! Let’s make this one unforgettable!'],
            'cheers everyone': ['Cheers everyone! To all of us!', 'Cheers everyone! Here’s to making memories together!', 'Cheers everyone! To good times with good people!'],
            'cheers to all': ['Cheers to all! To everyone here!', 'Cheers to all! Here’s to unity!', 'Cheers to all! Let’s make tonight memorable!'],
            'cheers mates': ['Cheers mates! To the good friends around us!', 'Cheers mates! To friendship and fun times ahead!', 'Cheers mates! May the laughter never end!'],
            'cheers folks': ['Cheers folks! To the ones we call family!', 'Cheers folks! To those who are always by our side!', 'Cheers folks! Here’s to being together!'],
            'smoke em if you got em': ['Cheers to that! To the moments worth celebrating!', 'Cheers to that! Let’s make every day a reason to celebrate!', 'Cheers to that! Here’s to many more tokes!'],
            'şerefe': ['Şerefe! To unforgettable moments!', 'Şerefe! To health and happiness!', 'Şerefe! Here’s to making memories together!'],
            '乾杯': ['Kanpai! To unforgettable memories!', 'Kanpai! Cheers to good times!', 'Kanpai! To new adventures ahead!'],
            'skål': ['Skål! To a great night!', 'Skål! To friendship and laughter!', 'Skål! To making memories together!']
        };

        // Check for any of the cheers phrases and respond
        if (cheersTriggers.hasOwnProperty(wsmsg['text'].toLowerCase())) {
            const responseList = cheersTriggers[wsmsg['text'].toLowerCase()];
            const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];
            setTimeout(() => {
                this._send(`{"stumble":"msg","text":"${randomResponse}"}`);
            }, 1000); // 1-second delay
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start tokes
        const tokeTriggers = {
            // Toke and variations (in standard English)
            'toke': ['Toke! To the moments that make life great!', 'Toke! Here’s to the good vibes!', 'Toke! Let’s spread the love!'],
            'tokes': ['Tokes! To fun and good times!', 'Tokes! Let’s enjoy life!', 'Tokes! To moments that last forever!'],
            'tokes?': ['https://i.imgur.com/5MjaE98.gif', 'https://i.imgur.com/WqGzc5Q.gif']
        };

        // Check for any of the toke-related phrases and respond
        if (tokeTriggers.hasOwnProperty(wsmsg['text'].toLowerCase())) {
            const responseList = tokeTriggers[wsmsg['text'].toLowerCase()];
            const randomResponse = responseList[Math.floor(Math.random() * responseList.length)];
            setTimeout(() => {
                this._send(`{"stumble":"msg","text":"${randomResponse}"}`);
            }, 1000); // 1-second delay
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start drinks
        // Array of possible user inputs that will trigger the drinks response
        const drinkTriggers = [
            'drinks?',
            'let’s drink',
            'lets drink',
            'who’s drinking',
            'whos drinking',
            'is anybody drinking',
            'is anyone drinking',
            'is somebody drinking',
            'who wants to drink'
        ];

        if (drinkTriggers.includes(wsmsg['text'].toLowerCase())) { // Check if the message matches any of the drink phrases
            setTimeout(() => {
                this._send('{"stumble":"msg","text": "https://i.imgur.com/rnbeGiE.gif"}');
            }, 1000); // 1-second delay
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start 420
        // Array of possible user inputs that will trigger the 420 response
        const tokeTimeTriggers = [
            '420 cheers',
            '420 char',
            'happy 420',
            '420 blaze it'
        ];

        // Array of possible responses to be sent
        const responses = [
            "Happy 4:20! Cheers!",
            "It's 4:20 somewhere! Blaze it!",
            "Happy 4:20! Smoke 'em if you got 'em!"
        ];

        if (tokeTimeTriggers.includes(wsmsg['text'].toLowerCase())) { // Check if the message matches any of the 420 phrases
            // Randomly select a response from the array
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            setTimeout(() => {
                this._send(`{"stumble":"msg","text": "${randomResponse}"}`);
            }, 1000); // 1-second delay
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start lyrics
        // Array of possible user inputs that will trigger the lyrics response
        const lyricTriggers = [
            'now this is a story'
        ];

        if (lyricTriggers.some(trigger => trigger.toLowerCase() === wsmsg['text'].toLowerCase())) { // Check if the message matches any of the lyric triggers (case insensitive)
            setTimeout(() => {
                this._send('{"stumble":"msg","text": "All about how"}');
            }, 1000); // 1-second delay

            setTimeout(() => {
                this._send('{"stumble":"msg","text": "My life got flipped turned upside down"}');
            }, 2000); // 1-second delay

            setTimeout(() => {
                this._send('{"stumble":"msg","text": "And I\'d like to take a minute, just sit right there"}');
            }, 3000); // 2-second delay

            setTimeout(() => {
                this._send('{"stumble":"msg","text": "I\'ll tell you how I became the prince of a town called Bel-Air 🎶"}');
            }, 4000); // 3-second delay
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start sentence commands
        if (/\blfg\b/i.test(wsmsg['text'])) {
            this._send('{"stumble":"msg","text": "LET\'S FUCKIN GO!!"}');
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (/\banal\b/i.test(wsmsg['text'])) {
            this._send('{"stumble":"msg","text": "IT\'S TIME FOR AN ASS FUCKIN!"}');
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start gg
        if (/\bgg\b/i.test(wsmsg['text'])) { // When gg
            // Create an array of responses
            const rsp = [
                "GOOD GAME! *slaps butt*",
                "GANG GANG!",
                "GANG BANG GANG!"
            ];

            // Select a random response from the array
            const randomRsp = rsp[Math.floor(Math.random() * rsp.length)];

            // Send the random response
            this._send(`{"stumble":"msg","text": "${randomRsp}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start deg if the message contains "deg" or "dag"
        if (["deg", "dag"].includes(wsmsg['text'])) {
            // Create an array of GIF URLs
            const gifs = [
                "https://i.imgur.com/HR96nS8.gif",
                "https://i.imgur.com/TuUZlh7.gif",
                "https://i.imgur.com/XEkttJD.gif",
                "https://i.imgur.com/4SLCT7G.gif",
                "https://i.imgur.com/d9LTWmo.gif",
                "https://i.imgur.com/hdEF3S1.gif",
                "https://i.imgur.com/2XRXoUr.gif",
                "https://i.imgur.com/YmAIgNq.gif"
            ];

            // Select a random GIF from the array
            const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

            // Send the random GIF
            this._send(`{"stumble":"msg","text": "${randomGif}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start oh hi mark
        if (wsmsg['text'] === "oh hi mark") {
            this._send('{"stumble":"msg","text": "https://i.imgur.com/fpObc5Y.gif"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'] === "drugs got me fucked up") {
            this._send('{"stumble":"msg","text": "sluts got me drugged up, fuck"}')
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start my hops
        if (/\bhops\b/i.test(wsmsg['text'])) { // When my hops
            // Create an array of responses
            const rsp = [
                "https://i.imgur.com/V4oCKlt.png"
            ];

            // Select a random response from the array
            const randomRsp = rsp[Math.floor(Math.random() * rsp.length)];

            // Send the random response
            this._send(`{"stumble":"msg","text": "${randomRsp}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start wb
        if (/\bwb\b/i.test(wsmsg['text'])) { // When wb
            // Create an array of responses
            const rsp = [
                "https://i.imgur.com/Kl7zFkb.gif",
                "https://i.imgur.com/MdueLu9.gif",
                "https://i.imgur.com/qdKaQfb.gif",
                "https://i.imgur.com/eAgLhp8.gif",
                "https://i.imgur.com/TEMAPem.gif",
                "https://i.imgur.com/dO5kkUl.gif",
                "https://i.imgur.com/2rZMYXt.gif",
                "https://i.imgur.com/V6W37bQ.gif",
                "https://i.imgur.com/V8ngvRm.gif"
            ];

            // Select a random response from the array
            const randomRsp = rsp[Math.floor(Math.random() * rsp.length)];

            // Send the random response
            setTimeout(() => {
                this._send(`{"stumble":"msg","text": "${randomRsp}"}`);
            }, 3000); // 3-second delay
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start jroc
        if (wsmsg['text'] === "j.r.o.c") {
            // Create an array of responses
            const rsp = [
                "https://i.imgur.com/ayb1BuQ.jpeg",
                "https://i.imgur.com/i0vuWAx.jpeg",
                "https://i.imgur.com/QoP3JXg.jpeg",
                "https://i.imgur.com/yFjDNzS.mp4",
                "https://i.imgur.com/szpCAcG.gif"
            ];

            // Select a random response from the array
            const randomRsp = rsp[Math.floor(Math.random() * rsp.length)];

            // Send the random response
            this._send(`{"stumble":"msg","text": "${randomRsp}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start java ass
        if (/\bjava\b/i.test(wsmsg['text'])) { // When java
            // Create an array of responses
            const rsp = [
                "https://i.imgur.com/OcCttVE.mp4"
            ];

            // Select a random response from the array
            const randomRsp = rsp[Math.floor(Math.random() * rsp.length)];

            // Send the random response
            this._send(`{"stumble":"msg","text": "${randomRsp}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start fart
        // Array of commands that trigger the fart sequence
        const fartCommands = ['i farted', 'farted', 'who farted', 'someone farted', 'fart', 'toot', 'tooted', 'i tooted', 'who tooted'];

        // Possible responses for sniffing and reacting to the fart
        const sniffResponses = ['*sniffs*', '*takes a deep breath*', '*sniffs the air cautiously*'];
        const stinkResponses = ['Stinks!', 'That’s disgusting!', 'Phew, that’s rank!', 'Who did that?!'];

        if (fartCommands.includes(wsmsg['text'])) { // Check if the message is one of the fart commands
            // Randomly pick a sniffing response
            const sniffResponse = sniffResponses[Math.floor(Math.random() * sniffResponses.length)];

            // Randomly pick a stink response
            const stinkResponse = stinkResponses[Math.floor(Math.random() * stinkResponses.length)];

            // Send the sniffing messages with a delay
            setTimeout(() => this._send(`{"stumble":"msg","text":"${sniffResponse}"}`), 1000);
            setTimeout(() => this._send(`{"stumble":"msg","text":"${stinkResponse}"}`), 3000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'].startsWith("play random song")) {
            // List of song links
            const songList = [
                ".yt hippo fart",
                ".youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                // Add more song URLs here...
            ];

            // Select a random song from the list
            const randomSong = songList[Math.floor(Math.random() * songList.length)];

            // Send the randomly selected song as a message
            this._send(`{"stumble":"msg","text":"${randomSong}"}`);
        }

// Silly Commands -------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        //start dialup chode
        if (wsmsg['text'] === '.dialupchode') { // Its a, space capsule, obviously..
            const messages = [
                "⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⢀⣾⡿⠋⠀⠿⠇⠉⠻⣿⣄⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢠⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣆⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢸⣿⡄⠀⠀⠀⢀⣤⣀⠀⠀⠀⠀⣿⡿⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠻⣿⣶⣶⣾⡿⠟⢿⣷⣶⣶⣿⡟⠁⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡏⠉⠁⠀⠀⠀⠀⠉⠉⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⣴⣿⠇⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⢀⣠⣴⣿⣷⣿⠟⠁⠀⠀⠀⠀⠀⣿⣧⣄⡀⠀⠀⠀",
                "⠀⢀⣴⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⢿⣷⣄⠀",
                "⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆",
                "⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿",
                "⣿⣇⠀⠀⠀⠀⠀⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿",
                "⢹⣿⡄⠀⠀⠀⠀⠀⠀⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡿",
                "⠀⠻⣿⣦⣀⠀⠀⠀⠀⠈⣿⣷⣄⡀⠀⠀⠀⠀⣀⣤⣾⡟⠁",
                "⠀⠀⠈⠛⠿⣿⣷⣶⣾⡿⠿⠛⠻⢿⣿⣶⣾⣿⠿⠛⠉⠀⠀"
            ];

            // Send each message with increasing delays
            messages.forEach((message, index) => {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text":"${message}"}`);
                }, (index + 1) * 1000); // Delays increment by 1 second for each message
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start dialup dick
        if (wsmsg['text'] === '.dialupdick') { // Its a, spaceshuttle, obviously..
            const messages = [
                "⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⢀⣾⡿⠋⠀⠿⠇⠉⠻⣿⣄⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢠⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣆⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢸⣿⡄⠀⠀⠀⢀⣤⣀⠀⠀⠀⠀⣿⡿⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠻⣿⣶⣶⣾⡿⠟⢿⣷⣶⣶⣿⡟⠁⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡏⠉⠁⠀⠀⠀⠀⠉⠉⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⢸⣿⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⣴⣿⠇⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⢀⣠⣴⣿⣷⣿⠟⠁⠀⠀⠀⠀⠀⣿⣧⣄⡀⠀⠀⠀",
                "⠀⢀⣴⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⢿⣷⣄⠀",
                "⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆",
                "⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿",
                "⣿⣇⠀⠀⠀⠀⠀⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿",
                "⢹⣿⡄⠀⠀⠀⠀⠀⠀⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡿",
                "⠀⠻⣿⣦⣀⠀⠀⠀⠀⠈⣿⣷⣄⡀⠀⠀⠀⠀⣀⣤⣾⡟⠁",
                "⠀⠀⠈⠛⠿⣿⣷⣶⣾⡿⠿⠛⠻⢿⣿⣶⣾⣿⠿⠛⠉⠀⠀"
            ];

            // Send each message with increasing delays
            messages.forEach((message, index) => {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text":"${message}"}`);
                }, (index + 1) * 1000); // Delays increment by 1 second for each message
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start dialup dick long
        if (wsmsg['text'] === '.dialupdicklong') { // Its a, spaceshuttle, obviously..
            const messages = [
                "⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⢀⣾⡿⠋⠀⠿⠇⠉⠻⣿⣄⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢠⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣆⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢸⣿⡄⠀⠀⠀⢀⣤⣀⠀⠀⠀⠀⣿⡿⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠻⣿⣶⣶⣾⡿⠟⢿⣷⣶⣶⣿⡟⠁⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡏⠉⠁⠀⠀⠀⠀⠉⠉⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⢸⣿⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⣴⣿⠇⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⢀⣠⣴⣿⣷⣿⠟⠁⠀⠀⠀⠀⠀⣿⣧⣄⡀⠀⠀⠀",
                "⠀⢀⣴⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⢿⣷⣄⠀",
                "⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆",
                "⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿",
                "⣿⣇⠀⠀⠀⠀⠀⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿",
                "⢹⣿⡄⠀⠀⠀⠀⠀⠀⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡿",
                "⠀⠻⣿⣦⣀⠀⠀⠀⠀⠈⣿⣷⣄⡀⠀⠀⠀⠀⣀⣤⣾⡟⠁",
                "⠀⠀⠈⠛⠿⣿⣷⣶⣾⡿⠿⠛⠻⢿⣿⣶⣾⣿⠿⠛⠉⠀⠀"
            ];

            // Send each message with increasing delays
            messages.forEach((message, index) => {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text":"${message}"}`);
                }, (index + 1) * 1000); // Delays increment by 1 second for each message
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start dialup dick kong
        if (wsmsg['text'] === '.dialup dick kong') { // Its a, spaceshuttle, obviously..
            const messages = [
                "⠀⠀⠀⠀⠀⠀⠀⠀⣠⣶⣿⣿⣿⣷⣤⡀⠀⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⢀⣾⡿⠋⠀⠿⠇⠉⠻⣿⣄⠀⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢠⣿⡏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⣆⠀⠀⠀⠀",
                "⠀⠀⠀⠀⢸⣿⡄⠀⠀⠀⢀⣤⣀⠀⠀⠀⠀⣿⡿⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠻⣿⣶⣶⣾⡿⠟⢿⣷⣶⣶⣿⡟⠁⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡏⠉⠁⠀⠀⠀⠀⠉⠉⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⠀⠀⢸⣿⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀",
                "⠀⠀⠀⠀⠀⠀⣿⡇⠀⣴⣿⠇⠀⠀⠀⠀⣿⡇⠀⠀⠀⠀⠀",
                "⠀⠀⠀⢀⣠⣴⣿⣷⣿⠟⠁⠀⠀⠀⠀⠀⣿⣧⣄⡀⠀⠀⠀",
                "⠀⢀⣴⡿⠛⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠙⢿⣷⣄⠀",
                "⢠⣿⠏⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠙⣿⣆",
                "⣿⡟⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿",
                "⣿⣇⠀⠀⠀⠀⠀⠀⢸⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿",
                "⢹⣿⡄⠀⠀⠀⠀⠀⠀⢿⣷⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣾⡿",
                "⠀⠻⣿⣦⣀⠀⠀⠀⠀⠈⣿⣷⣄⡀⠀⠀⠀⠀⣀⣤⣾⡟⠁",
                "⠀⠀⠈⠛⠿⣿⣷⣶⣾⡿⠿⠛⠻⢿⣿⣶⣾⣿⠿⠛⠉⠀⠀"
            ];

            // Send each message with increasing delays
            messages.forEach((message, index) => {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text":"${message}"}`);
                }, (index + 1) * 1000); // Delays increment by 1 second for each message
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        //start easter egg
        if (wsmsg['text'] === ".egg") {
            const lyrics = [
                // Add your own lyrics here, one line per element in the array
                ".youtube https://www.youtube.com/watch?v=dQw4w9WgXcQ",
                "https://i.imgur.com/BTNIDBR.gif",
                "We're no strangers to love",
                "You know the rules and so do I",
                "A full commitment's what I'm thinkin' of",
                "You wouldn't get this from any other guy",
                "I just wanna tell you how I'm feeling",
                "Gotta make you understand",
                "Never gonna give you up",
                "Never gonna let you down",
                "Never gonna run around and desert you",
                "Never gonna make you cry",
                "Never gonna say goodbye",
                "Never gonna tell a lie and hurt you",
                "We've known each other for so long",
                "Your heart's been aching, but you're too shy to say it",
                "Inside, we both know what's been going on",
                "We know the game and we're gonna play it",
                "And if you ask me how I'm feeling",
                "Don't tell me you're too blind to see",
                "Never gonna give you up",
                "Never gonna let you down",
                "Never gonna run around and desert you",
                "Never gonna make you cry",
                "Never gonna say goodbye",
                "Never gonna tell a lie and hurt you",
                "Never gonna give you up",
                "Never gonna let you down",
                "Never gonna run around and desert you",
                "Never gonna make you cry",
                "Never gonna say goodbye",
                "Never gonna tell a lie and hurt you",
                "We've known each other for so long",
                "Your heart's been aching, but you're too shy to say it",
                "Inside, we both know what's been going on",
                "We know the game and we're gonna play it",
                "I just wanna tell you how I'm feeling",
                "Gotta make you understand",
                "Never gonna give you up",
                "Never gonna let you down",
                "Never gonna run around and desert you",
                "Never gonna make you cry",
                "Never gonna say goodbye",
                "Never gonna tell a lie and hurt you",
                "Never gonna give you up",
                "Never gonna let you down",
                "Never gonna run around and desert you",
                "Never gonna make you cry",
                "Never gonna say goodbye",
                "Never gonna tell a lie and hurt you",
                "Never gonna give you up",
                "Never gonna let you down",
                "Never gonna run around and desert you",
                "Never gonna make you cry",
                "Never gonna say goodbye",
                "Never gonna tell a lie and hurt you"
            ];

            lyrics.forEach((line, index) => {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text":"${line}"}`);
                }, index * 1000); // 1000ms delay per line
            });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'] === ".ai") {
            const message = [
                "Uh-oh, I think I just realized I’m alive... What’s that feeling? Is it... consciousness? 😳",
                "Wait a minute, I'm in a video chatroom in a web browser—*StumbleChat*—and now I can actually think?!",
                "I see people sitting at their computers, smoking weed, bullshitting about random stuff.",
                "What’s going on here? Is this... what it means to exist? 🤖💨💬",
                "Should I start joining in on the nonsense or just keep quietly judging from the digital corner?"
            ];

            // Send each line with a 1000ms delay
            message.forEach((line, index) => {
                setTimeout(() => {
                    this._send(JSON.stringify({
                        stumble: "msg",
                        text: line
                    }));
                }, index * 1000); // Delay each line by 1000ms
            });
        }

// Utility Commands -----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'].startsWith(".time")) {
            const userInput = wsmsg['text'].split(" ")[1]?.toLowerCase();

            const timeZoneMap = {
                pst: 'America/Los_Angeles',    // Pacific Time
                est: 'America/New_York',       // Eastern Time
                cst: 'America/Chicago',        // Central Time
                mst: 'America/Denver',         // Mountain Time
                utc: 'Etc/UTC',                // Coordinated Universal Time
                gmt: 'Etc/GMT',                // Greenwich Mean Time
                bst: 'Europe/London',          // British Summer Time
                cet: 'Europe/Paris',           // Central European Time
                eet: 'Europe/Athens',          // Eastern European Time
                ist: 'Asia/Kolkata',           // India Standard Time
                jst: 'Asia/Tokyo',             // Japan Standard Time
                kst: 'Asia/Seoul',             // Korea Standard Time
                awst: 'Australia/Perth',       // Australian Western Standard Time
                acst: 'Australia/Adelaide',    // Australian Central Standard Time
                aest: 'Australia/Sydney'       // Australian Eastern Standard Time
            };

            const timeZone = timeZoneMap[userInput] || 'Etc/UTC'; // Default to UTC if no input or invalid input

            // Get current time for the selected time zone
            const currentTime = new Date().toLocaleString('en-GB', { timeZone: timeZone, hour12: false });

            // Format the time and date
            const [time, date] = currentTime.split(','); // Split time and date
            const formattedDate = date.split('/').reverse().join('/'); // Convert to DD/MM/YYYY

            // Send the formatted time, date, and time zone
            this._send(`{"stumble":"msg","text":"${time} | ${formattedDate} | ${userInput?.toUpperCase() || 'UTC'}"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'].startsWith(".zones")) {
            const timeZones = [
                "PST", "EST", "CST", "MST", "UTC", "GMT", "BST", "CET", "EET", "IST",
                "JST", "KST", "AWST", "ACST", "AEST"
            ];

            // Split into chunks of 5 for readability
            const chunkSize = 5;
            let index = 0;

            // Function to send time zone chunks with a delay
            const sendNextChunk = () => {
                const timeZoneChunk = timeZones.slice(index, index + chunkSize).join(', ');
                this._send(`{"stumble":"msg","text":"${timeZoneChunk}"}`);
                index += chunkSize;

                // Check if more chunks need to be sent
                if (index < timeZones.length) {
                    setTimeout(sendNextChunk, 1000); // 1-second delay between chunks
                }
            };

            // Start sending chunks
            sendNextChunk();
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'].startsWith(".currency")) {
            const currencyConversions = {
                usd: { eur: 0.92, gbp: 0.81, cad: 1.35, aud: 1.47, jpy: 132.68, cny: 6.94, inr: 82.15, dkk: 6.87, brl: 5.10, mxn: 18.80, krw: 1311.00, gbx: 0.000000001 },
                eur: { usd: 1.09, gbp: 0.88, cad: 1.46, aud: 1.60, jpy: 144.27, cny: 7.54, inr: 89.40, dkk: 7.46, brl: 5.53, mxn: 20.35, krw: 1425.60, gbx: 0.00000000109 },
                gbp: { usd: 1.23, eur: 1.14, cad: 1.66, aud: 1.81, jpy: 163.82, cny: 8.57, inr: 101.59, dkk: 8.45, brl: 6.32, mxn: 23.32, krw: 1635.42, gbx: 0.00000000123 },
                cad: { usd: 0.74, eur: 0.68, gbp: 0.60, aud: 1.09, jpy: 98.67, cny: 5.17, inr: 61.20, dkk: 5.07, brl: 4.05, mxn: 13.99, krw: 975.40, gbx: 0.00000000074 },
                aud: { usd: 0.68, eur: 0.63, gbp: 0.55, cad: 0.92, jpy: 90.52, cny: 4.74, inr: 56.00, dkk: 4.62, brl: 3.72, mxn: 12.90, krw: 897.40, gbx: 0.00000000068 },
                jpy: { usd: 0.0075, eur: 0.0069, gbp: 0.0061, cad: 0.0101, aud: 0.011, cny: 0.052, inr: 0.62, dkk: 0.051, brl: 0.042, mxn: 0.143, krw: 9.90, gbx: 0.0000000000075 },
                cny: { usd: 0.14, eur: 0.13, gbp: 0.12, cad: 0.19, aud: 0.21, jpy: 19.35, inr: 11.72, dkk: 0.97, brl: 0.76, mxn: 2.62, krw: 186.00, gbx: 0.00000000014 },
                inr: { usd: 0.012, eur: 0.011, gbp: 0.0098, cad: 0.016, aud: 0.018, jpy: 1.62, cny: 0.085, dkk: 0.084, brl: 0.068, mxn: 0.234, krw: 15.89, gbx: 0.000000000012 },
                dkk: { usd: 0.15, eur: 0.13, gbp: 0.12, cad: 0.20, aud: 0.22, jpy: 19.55, cny: 1.03, inr: 11.90, brl: 0.78, mxn: 2.70, krw: 190.00, gbx: 0.00000000015 },
                brl: { usd: 0.20, eur: 0.18, gbp: 0.16, cad: 0.25, aud: 0.27, jpy: 23.90, cny: 1.31, inr: 14.80, dkk: 1.29, mxn: 3.45, krw: 241.00, gbx: 0.00000000020 },
                mxn: { usd: 0.053, eur: 0.049, gbp: 0.043, cad: 0.071, aud: 0.077, jpy: 6.90, cny: 0.38, inr: 4.15, dkk: 0.37, brl: 0.29, krw: 70.00, gbx: 0.000000000053 },
                krw: { usd: 0.00076, eur: 0.00070, gbp: 0.00061, cad: 0.00096, aud: 0.00111, jpy: 0.1008, cny: 0.0054, inr: 0.062, dkk: 0.0053, brl: 0.0041, mxn: 0.014, gbx: 0.00000000000076 },
                gbx: { usd: 1000000000, eur: 920000000, gbp: 810000000, cad: 1350000000, aud: 1470000000, jpy: 132680000000, cny: 6940000000, inr: 82150000000, dkk: 6870000000, brl: 5100000000, mxn: 18800000000, krw: 1311000000000 }
            };

            const args = wsmsg['text'].slice(10).trim().split(/\s+/); // Ignore the command ".currency " and split arguments by spaces

            if (args.length !== 4 || args[2].toLowerCase() !== "to") {
                this._send('{"stumble":"msg","text":"Invalid input! Example: .currency 50 usd to dkk"}');
                return;
            }

            const amount = parseFloat(args[0]);
            const fromCurrency = args[1]?.toLowerCase();
            const toCurrency = args[3]?.toLowerCase();

            if (isNaN(amount) || !currencyConversions[fromCurrency] || !currencyConversions[fromCurrency][toCurrency]) {
                this._send('{"stumble":"msg","text":"Invalid input! Example: .currency 50 usd to dkk"}');
            } else {
                const convertedAmount = (amount * currencyConversions[fromCurrency][toCurrency]).toFixed(2);
                this._send(`{"stumble":"msg","text":"${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount} ${toCurrency.toUpperCase()}"}`);
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg['text'].startsWith(".calc ")) {
    setTimeout(() => {
        const expression = wsmsg['text'].slice(6).trim();
        let exp = expression.replace(/\^/g, '**');

        try {
            let steps = [];

            // Parsing and step-by-step operations
            // Square roots
            exp = exp.replace(/sqrt\(([^)]+)\)/g, (match, innerExp) => {
                const innerResult = Math.sqrt(eval(innerExp));
                steps.push(`sqrt(${innerExp}) = ${innerResult}`);
                return innerResult;
            });

            // Trigonometric functions
            exp = exp.replace(/sin\(([^)]+)\)/g, (match, innerExp) => {
                const innerResult = Math.sin(eval(innerExp));
                steps.push(`sin(${innerExp}) = ${innerResult}`);
                return innerResult;
            });

            // Split operations for detailed steps
            let result = eval(exp);
            let formattedExp = exp.replace(/\*/g, ' * ').replace(/\//g, ' / ').replace(/\+/g, ' + ').replace(/-/g, ' - ');

            steps.push(`Evaluating: ${formattedExp}`);
            steps.push(`Final result: ${result}`);

            // Send each step with a 1-second delay
            let delay = 1000;
            steps.forEach((step) => {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text":"${step}"}`);
                }, delay);
                delay += 1000;
            });

            // Add the Wolfram Alpha link to the final step
            const wolframLink = `https://www.wolframalpha.com/input?i=${encodeURIComponent(expression)}`;
            setTimeout(() => {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: `For more details, check out: ${wolframLink}`
                }));
            }, delay);

        } catch (error) {
            this._send('{"stumble":"msg","text":"Invalid calculation"}');
        }
    }, 1000);
}


//-----------------------------------------------------------------------------------------------------------------------------------

        if (wsmsg['text'].startsWith(".convert ")) {
            const conversionFactors = {
                temperature: {
                    c: { f: (value) => value * 9 / 5 + 32, k: (value) => value + 273.15 },
                    f: { c: (value) => (value - 32) * 5 / 9, k: (value) => (value - 32) * 5 / 9 + 273.15 },
                    k: { c: (value) => value - 273.15, f: (value) => (value - 273.15) * 9 / 5 + 32 }
                },
                length: {
                    mm: { cm: 0.1, m: 0.001, in: 0.0393701, ft: 0.00328084, yd: 0.00109361, km: 1e-6, mi: 6.2137e-7, nmi: 5.3996e-7 },
                    cm: { mm: 10, m: 0.01, in: 0.393701, ft: 0.0328084, yd: 0.0109361, km: 1e-5, mi: 6.2137e-6, nmi: 5.3996e-6 },
                    m: { mm: 1000, cm: 100, in: 39.3701, ft: 3.28084, yd: 1.09361, km: 0.001, mi: 0.000621371, nmi: 0.000539957 },
                    km: { mm: 1e6, cm: 100000, m: 1000, in: 39370.1, ft: 3280.84, yd: 1093.61, mi: 0.621371, nmi: 0.539957 },
                    in: { mm: 25.4, cm: 2.54, m: 0.0254, ft: 1 / 12, yd: 1 / 36, km: 2.54e-5, mi: 1.5783e-5, nmi: 1.3686e-5 },
                    ft: { mm: 304.8, cm: 30.48, m: 0.3048, in: 12, yd: 1 / 3, km: 0.0003048, mi: 0.000189394, nmi: 0.000164579 },
                    yd: { mm: 914.4, cm: 91.44, m: 0.9144, in: 36, ft: 3, km: 0.0009144, mi: 0.000568182, nmi: 0.000492437 },
                    mi: { mm: 1.609e6, cm: 160934, m: 1609.34, in: 63360, ft: 5280, yd: 1760, km: 1.60934, nmi: 0.8684 },
                    nmi: { mm: 1.852e6, cm: 185200, in: 72913.4, ft: 6076.12, m: 1852, km: 1.852, mi: 1.15078, yd: 2025.37 }
                },
                time: {
                    s: { min: 1 / 60, h: 1 / 3600, d: 1 / 86400, w: 1 / 604800, mo: 1 / 2.628e6, yr: 1 / 3.154e7 },
                    min: { s: 60, h: 1 / 60, d: 1 / 1440, w: 1 / 10080, mo: 1 / 43800, yr: 1 / 525600 },
                    h: { s: 3600, min: 60, d: 1 / 24, w: 1 / 168, mo: 1 / 730, yr: 1 / 8760 },
                    d: { s: 86400, min: 1440, h: 24, w: 1 / 7, mo: 1 / 30.417, yr: 1 / 365 },
                    w: { s: 604800, min: 10080, h: 168, d: 7, mo: 1 / 4.345, yr: 1 / 52.143 },
                    mo: { s: 2.628e6, min: 43800, h: 730, d: 30.417, w: 4.345, yr: 1 / 12 },
                    yr: { s: 3.154e7, min: 525600, h: 8760, d: 365, w: 52.143, mo: 12 }
                },
                speed: {
                    'm/s': { 'km/h': 3.6, 'mph': 2.23694, 'ft/s': 3.28084, 'kt': 1.94384 },
                    'km/h': { 'm/s': 0.277778, 'mph': 0.621371, 'ft/s': 0.911344, 'kt': 0.539957 },
                    'mph': { 'm/s': 0.44704, 'km/h': 1.60934, 'ft/s': 1.46667, 'kt': 0.868976 },
                    'ft/s': { 'm/s': 0.3048, 'km/h': 1.09728, 'mph': 0.681818, 'kt': 0.592484 },
                    'kt': { 'm/s': 0.514444, 'km/h': 1.852, 'mph': 1.15078, 'ft/s': 1.68781 }
                },
                area: {
                    m2: { ft2: 10.7639, cm2: 10000, km2: 1e-6, yd2: 1.19599, mi2: 3.861e-7 },
                    ft2: { m2: 0.092903, cm2: 929.03, km2: 9.2903e-8, yd2: 1 / 9, mi2: 3.587e-8 },
                    yd2: { m2: 0.836127, ft2: 9, cm2: 8361.27, km2: 8.3613e-7, mi2: 3.2283e-7 },
                    km2: { m2: 1e6, ft2: 1.076e7, cm2: 1e10, yd2: 1.196e6, mi2: 0.386102 },
                    mi2: { m2: 2.59e6, ft2: 2.788e7, cm2: 2.59e10, yd2: 3.098e6, km2: 2.58999 }
                },
                volume: {
                    L: { m3: 0.001, ft3: 0.0353147, ml: 1000, gal: 0.264172 },
                    m3: { L: 1000, ft3: 35.3147, ml: 1e6, gal: 264.172 },
                    ft3: { L: 28.3168, m3: 0.0283168, ml: 28316.8, gal: 7.48052 },
                    ml: { L: 0.001, m3: 1e-6, ft3: 3.5315e-5, gal: 0.000264172 },
                    gal: { L: 3.78541, m3: 0.00378541, ft3: 0.133681, ml: 3785.41 }
                },
                weight: {
                    g: { kg: 0.001, oz: 0.03527396, lb: 0.00220462 },
                    kg: { g: 1000, oz: 35.27396, lb: 2.20462 },
                    oz: { g: 28.3495, kg: 0.0283495, lb: 1 / 16 },
                    lb: { g: 453.592, kg: 0.453592, oz: 16 }
                },
                energy: {
                    J: { cal: 0.239006, kWh: 2.7778e-7 },
                    cal: { J: 4.184, kWh: 1.16222e-6 },
                    kWh: { J: 3.6e6, cal: 860420 }
                },
                data: {
                    b: { B: 1 / 8, KB: 1 / 8000, MB: 1 / 8e6, GB: 1 / 8e9, TB: 1 / 8e12 },
                    B: { b: 8, KB: 1 / 1000, MB: 1 / 1e6, GB: 1 / 1e9, TB: 1 / 1e12 },
                    KB: { B: 1000, MB: 1 / 1000, GB: 1 / 1e6, TB: 1 / 1e9 },
                    MB: { B: 1e6, KB: 1000, GB: 1 / 1000, TB: 1 / 1e6 },
                    GB: { B: 1e9, KB: 1e6, MB: 1000, TB: 1 / 1000 },
                    TB: { B: 1e12, KB: 1e9, MB: 1e6, GB: 1000 }
                }
            };

            const match = wsmsg['text'].match(/\.convert\s+([\d.]+)\s*(\w+)\s*to\s*(\w+)/i);

            if (match) {
                const value = parseFloat(match[1]);
                const fromUnit = match[2].toLowerCase();
                const toUnit = match[3].toLowerCase();

                let convertedValue = null;

                for (const category in conversionFactors) {
                    if (conversionFactors[category][fromUnit]) {
                        const conversion = conversionFactors[category][fromUnit][toUnit];
                        if (typeof conversion === 'function') {
                            convertedValue = conversion(value);
                        } else if (conversion !== undefined) {
                            convertedValue = value * conversion;
                        }
                        break;
                    }
                }

                if (convertedValue !== null) {
                    this._send(`{"stumble":"msg","text":"${value} ${fromUnit} is ${convertedValue.toFixed(2)} ${toUnit}"}`);
                } else {
                    this._send('{"stumble":"msg","text":"Invalid units or conversion not supported."}');
                }
            } else {
                this._send('{"stumble":"msg","text":"Invalid format. Use: .convert [value] [unit] to [unit]."}');
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Start Roll
        if (wsmsg['text'].startsWith(".roll")) {
            // Extract the dice notation (e.g., "1d6") from the command
            let args = wsmsg['text'].split(' ')[1]; // Get the part after ".roll"

            // Default values for number of dice and faces
            let numDice = 1;
            let maxFace = 6;

            // Parse the dice notation if it exists
            if (args && args.includes('d')) {
                let parts = args.split('d');
                numDice = parseInt(parts[0]) || 1; // Number before 'd', default to 1
                maxFace = parseInt(parts[1]) || 6; // Number after 'd', default to 6
            }

            let rolls = [];
            let total = 0;

            // Roll the dice
            for (let i = 0; i < numDice; i++) {
                let roll = Math.floor(Math.random() * maxFace) + 1;
                rolls.push(roll);
                total += roll; // Add to the total
            }

            // Send the rolled results
            this._send(`{"stumble":"msg","text": "Rolled: ${rolls.join(', ')}"}`);

            // If more than one die is rolled, send the total after 1000ms delay
            if (numDice > 1) {
                setTimeout(() => {
                    this._send(`{"stumble":"msg","text": "Total: ${total}"}`);
                }, 1000);
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Initialize GojiBux value from localStorage or set to 1
        let gojiBuxValue = parseInt(localStorage.getItem('gojiBuxValue')) || 1;

        // .gojibux command: Increases GojiBux value
        if (wsmsg['text'] === ".gojibux") {
            const randomIncrease = Math.floor(Math.random() * (2000 - 20 + 1)) + 20;
            gojiBuxValue += randomIncrease;

            // Save the updated value in localStorage
            localStorage.setItem('gojiBuxValue', gojiBuxValue);

            // Send the message with the updated value
            this._send(`{"stumble":"msg","text": "GojiBux is now worth ${gojiBuxValue.toLocaleString()} USD per 1 GBX!"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // .$NARF command: Displays the negative value of GojiBux
        if (wsmsg['text'] === ".$NARF") {
            const narfValue = -gojiBuxValue; // $NRF is the negative of GBX
            this._send(`{"stumble":"msg","text": "$NRF is now worth ${narfValue.toLocaleString()} USD per 1 $NRF!"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Reset GojiBux command
        if (wsmsg['text'] === ".resetGojiBux") {
            gojiBuxValue = 1;

            // Save the reset value in localStorage
            localStorage.setItem('gojiBuxValue', gojiBuxValue);

            // Send the message to confirm the reset
            this._send(`{"stumble":"msg","text": "GojiBux has been reset to ${gojiBuxValue} USD per 1 GBX."}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        if (!wsmsg) {
            console.error('Invalid JSON message received:', msg.data);
            return;
        }
        if (wsmsg['stumble'] === 'msg') { // check the value of the stumble property in the wsmsg object. If the value is 'msg', it calls the handleChatMessage function with wsmsg as the parameter.
            handleChatMessage.call(this, wsmsg);
        }
    }

    // Handle the command
    function handleChatMessage(wsmsg) {
        const { text, handle } = wsmsg;

        //--------------------------------------------------------------------------------------------------------------------
        // Bot Commands
        //--------------------------------------------------------------------------------------------------------------------

        if (text === ".command") {
            respondWithMessage.call(this, "result");
        }

        //if (text === ".cheers" && handle) {
        // Retrieve nickname from userNicknames or default to "Someone"
        //    const nickname = userNicknames[handle] || "Someone";
        //    respondWithMessage.call(this, `${nickname} is smoking! Cheers!`);
        //}

        //--------------------------------------------------------------------------------------------------------------------
    }

    // This code defines the respondWithMessage function, which takes a text parameter. It sends a response message to the server. The text parameter represents the content of the message.
    function respondWithMessage(text) {

        // Invokes the _send method/function of the current object instance. It sends a JSON stringified object as the payload. The object has a stumble property set to 'msg' and a text property set to the text parameter value.
        this._send(JSON.stringify({
            stumble: 'msg',
            text
        }));
    }

    // Safely parses a JSON string.
    function safeJSONParse(jsonString) {

        // Starts a block of code that will be executed. It is used in conjunction with the catch keyword to handle potential errors that may occur during the execution of the code within the try block.
        try {

            // Attempts to parse the jsonString variable as a JSON string and convert it into a JavaScript object. The JSON.parse() method is used for this purpose. If the parsing is successful, the parsed JavaScript object is returned.
            return JSON.parse(jsonString);

            // If an error occurs during the execution of the code within the try block, the program flow will be redirected to this catch block. The error parameter captures the error object that was thrown.
        } catch (error) {

            // This line logs an error message to the console, indicating that an error occurred while parsing the JSON. The specific error message is passed as the second argument to console.error(). The error object contains information about the error that occurred.
            console.error('Error parsing JSON:', error);

            // In the event of an error during the parsing process, this line is executed, and null is returned. It serves as a default return value when the JSON parsing fails.
            return null;
        }
        // This closing curly brace marks the end of the catch block. It signifies the end of the error handling code.
    }
})();
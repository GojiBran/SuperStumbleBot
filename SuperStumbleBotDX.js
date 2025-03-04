// ==UserScript==
// @name         SuperStumbleBotDX
// @namespace    SuperStumbleBotDX
// @icon         https://baskinbros.com/favicon.ico
// @version      1.0
// @description  Play YouTube videos from the chat box and/or add custom commands to StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// ==/UserScript==

//-----------------------------------------------------------------------------------------------------------------------------------
// Set Favicon
(function() {
    let link = document.createElement("link");
    link.rel = "icon";
    link.href = "https://baskinbros.com/favicon.ico";
    document.head.appendChild(link);
})();

//-----------------------------------------------------------------------------------------------------------------------------------
// Load user data from localStorage
let userList = JSON.parse(localStorage.getItem('userList')) || {};
let universalNotes = JSON.parse(localStorage.getItem("universalNotes")) || [];

//-----------------------------------------------------------------------------------------------------------------------------------
// Function to safely parse JSON
function safeJSONParse(data) {
    try {
        return JSON.parse(data);
    } catch (error) {
        console.warn("JSON parse error:", error);
        return null;
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------
// Time-Based Alerts (e.g., 4:20, 7:10, etc.)
let lastSentHour = -1;
let shouldSendMessage = false;
const alertTimes = [
    { hour: 16, minute: 20, message: "🤖 It’s 4:20! Light it up! 💨" },
    { hour: 7, minute: 10, message: "🤖 It’s 7:10! Dab time! 🔥💨" }
];

setInterval(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentSecond = now.getSeconds();

    alertTimes.forEach(alert => {
        if (
            currentHour === alert.hour &&
            currentMinute === alert.minute &&
            currentSecond === 0 &&
            lastSentHour !== currentHour
        ) {
            lastSentHour = currentHour;
            shouldSendMessage = true;
            respondWithMessage(alert.message);
        }
    });
}, 1000);

//-----------------------------------------------------------------------------------------------------------------------------------
// Override WebSocket Send (Ensures handleMessage is called)
(function() {
    WebSocket.prototype._send = WebSocket.prototype.send;
    WebSocket.prototype.send = function(data) {
        this._send(data);
        this.addEventListener("message", handleMessage.bind(this), false);

        this.send = function(data) {
            console.log("send:", data);
            const sendData = safeJSONParse(data);

            if (sendData && sendData["stumble"] === "subscribe") {
                console.log("subscribe caught");
            } else {
                this._send(data);
            }
        };
    };
})();

//-----------------------------------------------------------------------------------------------------------------------------------
// Handle Incoming Messages
function handleMessage(msg) {
    const data = msg.data;
    const wsmsg = safeJSONParse(data);

    if (!wsmsg) {
        console.warn("Failed to parse:", data);
        return;
    }

    console.log(wsmsg); // Debugging logs

    // Handle user events (join, leave, nickname change)
    if (wsmsg['stumble'] === 'join') {
        handleUserEvents(wsmsg);
        handleWelcomeMessage(wsmsg);
        return;
    }
    
    if (wsmsg['stumble'] === 'leave' || wsmsg['stumble'] === 'nick') {
        handleUserEvents(wsmsg);
        return;
    }

    // Handle commands (text-based messages)
    if (wsmsg['text'] && wsmsg['text'].startsWith(".")) {
        handleCommand(wsmsg);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------
// Handle User Events
function handleUserEvents(wsmsg) {
    const username = wsmsg['username'];
    const handle = wsmsg['handle'];
    const nickname = wsmsg['nick'] || username;
    const modStatus = wsmsg['mod'] ? "Moderator" : "Regular";

    userList[username] = {
        handle: handle,
        nickname: nickname,
        modStatus: modStatus
    };
    
    userList[handle] = userList[username];
    localStorage.setItem("userList", JSON.stringify(userList));
}

//-----------------------------------------------------------------------------------------------------------------------------------
// Handle Welcome Messages
function handleWelcomeMessage(wsmsg) {
    const username = wsmsg['username'];
    const nickname = userList[wsmsg['handle']]?.nickname || username;
    
    if (userList[username]) {
        respondWithMessage(`🤖 Welcome back, ${nickname}! 🎉`);
    } else {
        userList[username] = userList[wsmsg['handle']];
        localStorage.setItem("userList", JSON.stringify(userList));
        respondWithMessage(`🤖 Welcome to Let's Get High, ${nickname}! 🌟`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------
// Handle Chat Commands
function handleCommand(wsmsg) {
    const handle = wsmsg['handle'];
    const user = userList[handle];
    const text = wsmsg['text'].slice(1); // Remove "." prefix
    const [command, ...params] = text.split(" "); // Split command from parameters

    if (!user) {
        console.warn("Command received but user not found:", text);
        return;
    }

    // Command Dispatcher (Easily Expandable)
    const commands = {
        'self': handleSelfCommand,
        'me': handleMeCommand,
        'my': handleMyCommand,
        'note': handleNoteCommand,
        'notes': handleNotesCommand,
        'mynotes': handleMyNotesCommand,
        'clearnotes': handleClearNotesCommand,
        // Add new commands here in the format: 'command': functionName
    };

    if (commands[command]) {
        commands[command](params, user);
    } else {
        console.log(`Unknown command: ${command}`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------
// Utility: Respond with Message
function respondWithMessage(message) {
    WebSocket.prototype._send.call(this, JSON.stringify({ stumble: "msg", text: message }));
}

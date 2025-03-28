// ==UserScript==
// @name         SuperStumbleBot
// @namespace    SuperStumbleBot
// @icon         https://baskinbros.com/favicon.ico
// @version      1.0
// @description  Play youtube videos from the chat box and/or add custom commands to StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// ==/UserScript==

// Notes ---
// fix weed prices
// fix bank loading etc


(function() {
    let link = document.createElement("link");
    link.rel = "icon";
    link.href = "https://baskinbros.com/favicon.ico"; // Replace with your favicon URL
    document.head.appendChild(link);
})();

//-----------------------------------------------------------------------------------------------------------------------------------

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

//-----------------------------------------------------------------------------------------------------------------------------------

(function() {
    // Load userNicknames from localStorage (if any)
    let userNicknames = JSON.parse(localStorage.getItem('userNicknames')) || {};
    let userHandles = JSON.parse(localStorage.getItem('userHandles')) || {};


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

//-----------------------------------------------------------------------------------------------------------------------------------

function handleMessage(msg) {
        const data = msg.data;
        const wsmsg = safeJSONParse(data);
        if (wsmsg) {
            console.log(wsmsg); // Log the message to the browser console instead of a pop-up
        } else {
            console.warn('Failed to parse:', data);
        }

        // Store user's nickname and info when they join
        if (wsmsg['stumble'] === 'join' && wsmsg['nick'] && wsmsg['username'] && wsmsg['handle']) {
            const username = wsmsg['username'];
            let nickname = wsmsg['nick'];
            const handle = wsmsg['handle'];

            // If nickname starts with "guest-" followed by numbers, use username instead
            if (/^guest-\d+$/i.test(nickname)) {
                nickname = username;
            }

//-----------------------------------------------------------------------------------------------------------------------------------

            let welcomeMessage;
            if (username === "Goji") {
                welcomeMessage = `🤖 Ah hell, it's ${nickname || username}! I heard he eats ass. 🍑🔥`;
            } else if (username === "HippoTwatamus") {
                welcomeMessage = "🤖 Hungry hungry HippoTwatamus is here to gobble some balls! 🦛🍽️";
            } else if (username === "thilly") {
                welcomeMessage = "🤖 You tho Thilly! 😂🤪";
            } else if (username === "jedisnarf") {
                welcomeMessage = `🤖 The force is strong! Master of the chat, the force, and the game! ${nickname || username}! ⚡💪🏀`;
            } else if (username === "Greenisacolour") {
                welcomeMessage = "🤖 Roses are red, violets are blue, Elizabeth was your queen, welcome back Green! 📯📯📯";
            } else if (username === "KailesaKaos89") {
                welcomeMessage = "🤖 Beware, the Yokai emerges from the shadows... it's Kailesa!! 👹🌑";
            } else if (username === "Guyonthecouch") {
                welcomeMessage = "🤖 Hey GuyOnTheCouch, sorry to wake you... but you gotta try this! 🛋️😴🍔";
            } else if (username === "BatonDeFromage") {
                welcomeMessage = `🤖 A wild ${nickname || username} Cheese Stick appears! Someone grab the marinara! 🧀🍝`;
            } else if (username === "kangarooster") {
                welcomeMessage = "🤖 It's a kangaroo! It's a Rooster! No! It's a hat! 🦘🐓🎩";
            } else if (username === "Mysti") {
                welcomeMessage = `🤖 ${nickname || username}! HEY TEAM! 🔥👊`;
            } else if (username === "FatTabPirates") {
                welcomeMessage = `🤖 All rise! The honorable ${nickname || username} has entered the chat. ⚖️⚓`;
            } else if (username === "realmuchacha") {
                welcomeMessage = "🤖 Soggy’s here! Better grab a towel, it’s about to get wet! 💦🧻";
            } else if (username === "PeacefulTrees420") {
                welcomeMessage = `🤖 Hide your grandmas and pack a fresh bowl! ${nickname || username} has arrived! 🌲🔥💨`;
            } else if (username === "KonkeyDong") {
                welcomeMessage = "🤖 Cave has entered the game. Controls are janky, devs are dumb, 2/10 experience. 🎮⚠️";
            } else if (username === "SemperZombie") {
                welcomeMessage = "🤖 SemperZombie rises again! Remember: It's better to cum in the sink than sink in the cum. 🧟‍♀️💦";
            } else if (username === "indica") {
                welcomeMessage = "🤖 Indica's here! Assume the position! 💋🔥";
            } else if (username === "DSexpress") {
                welcomeMessage = "🤖 DS is in the building! Beats, gloves, and vibes ready to drop. 🎧🥊🎶";
            } else if (username === "Kicks") {
                welcomeMessage = "🤖 Sick of all his Kicks but still kickin it! 👟💥";
            } else if (username === "Vato") {
                welcomeMessage = "🤖 Pinche Vato! Siempre chingando. 🌮🔥";
            } else if (username === "The1nkedRabbit") {
                welcomeMessage = "🤖 You fell down the Rabbit hole! 🐇";
            } else if (username === "theinkedrabbit") {
                welcomeMessage = "🤖 You fell down the Rabbit hole! 🐇";
            } else if (username === "anonymousstoner") {
                welcomeMessage = "🤖 Le Mous is here, time to get your throat coat 🔥🔥🔥🔥";
            } else if (username === "AkwRdtrTl3") {
                welcomeMessage = "🤖 Hide your husbands, hide your wives, a Turtle arrives! 🐢🍌🍒";
            } else if (username === "DaCrimsonFucker") {
                welcomeMessage = "🤖 Is it blue? It green? It's CRIMSON! 😎😎😎";
            } else if (username === "LolaNAP") {
                welcomeMessage = "🤖 Oohh La La!! It's LOLA 😍😍";
            } else if (username === "Sed") {
                welcomeMessage = "🤖 Time for your daily bread, here comes Sed! 🍞";
            } else if (username === "hwyspdking") {
                welcomeMessage = "🤖 Have no fear, HwySpdKing is here! 👑";
            } else if (username === "rubysoho") {
                welcomeMessage = "🤖 Canna first? NO! Canna_Last! 🔥🔥";
            } else if (username === "sMoKaRu") {
                welcomeMessage = `🤖 All the angels wept when ${nickname || username} slept. 👼`;
            } else if (username === "Bee") {
                welcomeMessage = "🤖 Weeee! It's BEE!! 🐝🐝🐝😍";
            } else if (username === "BaskinBros") {
                welcomeMessage = "🤖 LE GASP!!";
            } else if (username === "MisterKors") {
                welcomeMessage = "🤖 Hide the french, hide the dutch, Belgium is in the hut! 🧇🧇🧇";
            } else if (username === "DrPatTCakes") {
                welcomeMessage = "🤖 Don't get the shakes, but here comes DrPatTCakes! 😨";
            } else if (username === "StarshineCity") {
                welcomeMessage = "🤖 Long skin? Short skin? No skin? OminousForeskin! 😎😎😎";
            } else if (username === "smokeyredhead420") {
                welcomeMessage = "🤖 Forget the blondes, forget the brunettes, it's all about the SmokeyRedHeads! 🥵";
            } else if (username === "Bladrcntrl") {
                welcomeMessage = "🤖 Kegels are great for optimal BladrCntrl! 🏆";
            } else if (username === "Rin") {
                welcomeMessage = "🤖 Rin’s here, classy like a Vienna sausage! 🌭✨";
            } else if (username === "MeowMix") {
                welcomeMessage = "🤖 Soft kitty, warm kitty, MeowMeowMeow.. 😺😺";
            } else if (username === "Hash710") {
                welcomeMessage = "🤖 It's a major major, sailor sailor! Ahoy! 🚢⚓";
            } else if (username === "zemo") {
                welcomeMessage = `🤖 Here comes ${nickname || username}! Hide the sharp objects and shoelaces! 🔪🧵`;
            } else if (username === "userone") {
                welcomeMessage = "🤖 OG Jew in da housee! 🔥🔥🔥";
            } else if (username === "gentlesoul69") {
                welcomeMessage = `🤖 ${nickname || username} IS IN BC, BABY! 🍁🏔️`;
            } else if (username === "scriptdefromage") {
                welcomeMessage = "🤖 IS THAT LJ OR AM I LOOKIN IN THE MIRROR?! 🤖";
            } else if (username === "bbblueyez18") {
                welcomeMessage = `🤖 The Crazy Flamingo Lady ${nickname || username} has arrived! 🤪🦩💙`;
            } else if (username === "LilNapkin") {
                welcomeMessage = `🤖 ${nickname || username} is in da house! 🏠`;
            } else if (username === "PostNutTranscendence") {
                welcomeMessage = `🤖 It's time to get jazzy! ${nickname || username} just nutted! 💦🎺🍤`;
            } else if (username === "kay10007") {
                welcomeMessage = "🤖 O KAY! 😆";
            } else if (username === "FROGGY") {
                welcomeMessage = "🤖 FEELIN FROGGY?! 🐸";
            } else if (username === "Thing2") {
                welcomeMessage = `🤖 I know a ${nickname || username} or seven! ⚔`;
            } else if (username === "jstme") {
                welcomeMessage = `🤖 Is it us? No, it's ${nickname || username}! 🧔`;
            } else if (userNicknames[username]) {
                welcomeMessage = `🤖 Welcome back to Let's Get High, ${nickname || username}! 🎉`;
            } else {
                welcomeMessage = `🤖 Welcome to Let's Get High, ${nickname || username}! 🌟`;
            }

            respondWithMessage.call(this, welcomeMessage);

//-----------------------------------------------------------------------------------------------------------------------------------

            // Store user info under username (persistent)
            userNicknames[username] = {
                handle: handle,
                username: username,
                nickname: nickname || username,
                modStatus: wsmsg['mod'] ? "Moderator" : "Regular"
            };

            // Map handle → username (for lookup during chats)
            userHandles[handle] = username;

            // Save updated userNicknames and userHandles to localStorage
            localStorage.setItem('userNicknames', JSON.stringify(userNicknames));
            localStorage.setItem('userHandles', JSON.stringify(userHandles));
        }

        // Listen for nickname changes and update userNicknames
        if (wsmsg['stumble'] === 'nick' && wsmsg['handle'] && wsmsg['nick']) {
            const handle = wsmsg['handle']; // Unique user handle
            const newNickname = wsmsg['nick']; // New nickname

            const username = userHandles[handle];
            if (userNicknames[username]) {
                userNicknames[username].nickname = newNickname;
            }

                // Save updated nicknames to localStorage
                localStorage.setItem('userNicknames', JSON.stringify(userNicknames));

                console.log(`Nickname updated: ${handle} is now ${newNickname}`);
            }

//-----------------------------------------------------------------------------------------------------------------------------------
// Bot Commands ---------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------


// YouTube --------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

    // Define an array of keywords to check for YouTube-related commands (case insensitive)
    /*var keywords = ['.youtube', '.video', '.play', '.yt'];

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
        // Check if the "text" property in wsmsg starts with the current keyword (case insensitive)
        if (wsmsg['text'].toLowerCase().startsWith(keywords[i])) {
            // Extract the query part of the message after the keyword
            var query = wsmsg['text'].substring(wsmsg['text'].indexOf(" ") + 1).trim();

            // Check if the query is not empty
            if (query && query !== keywords[i]) {
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
    }*/

// Define an array of keywords to check for YouTube-related commands (case insensitive)
var keywords = ['.youtube', '.video', '.play', '.yt'];

// Universal YouTube History Storage (ensure backward compatibility)
let youtubeHistory = JSON.parse(localStorage.getItem("youtubeHistory")) || [];

// Function to convert various YouTube URL formats to a standard format
function convertToRegularYouTubeLink(url) {
    var videoIdRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/|.*[?&]v=))([\w-]+)/;
    var match = url.match(videoIdRegex);
    return match && match[1] ? 'https://www.youtube.com/watch?v=' + match[1] : null;
}

// Function to save the last 10 played tracks
function saveToHistory(requester, trackName) {
    if (!trackName) return;  // Prevent saving if track is missing

    youtubeHistory.push({
        requester: requester || null,  // Store username or null if bot
        track: trackName
    });

    // Keep only the last 10 entries
    if (youtubeHistory.length > 10) {
        youtubeHistory.shift();
    }

    // Save to localStorage
    localStorage.setItem("youtubeHistory", JSON.stringify(youtubeHistory));
}

// Detect user invoking a YouTube command
for (var i = 0; i < keywords.length; i++) {
    if (wsmsg['text'].toLowerCase().startsWith(keywords[i])) {
        var query = wsmsg['text'].substring(wsmsg['text'].indexOf(" ") + 1).trim();
        if (query && query !== keywords[i]) {
            var finalLink = convertToRegularYouTubeLink(query) || query;

            // Send the YouTube link
            this._send('{"stumble": "youtube","type": "add","id": "' + finalLink + '","time": 0}');
        }
        break;
    }
}

// Detect system message confirming YouTube track added
if (wsmsg['stumble'] === "sysmsg" && wsmsg['text'].includes("has added YouTube track:")) {
    let lines = wsmsg['text'].split("\n");
    let trackName = lines.pop().trim();  // Extract track name

    if (!trackName) return;

    let firstLine = lines[0];  // Extract first line for requester info
    let requester = null;

    let match = firstLine.match(/^(.*?) \((.*?)\) has added YouTube track:/);
    if (match) {
        requester = match[2];  // Extract username if available
    }

    // Save to history
    saveToHistory(requester, trackName);
}

    // Handle .history command to display the last 10 played tracks
    if (wsmsg['text'].trim().toLowerCase() === ".history") {
        if (youtubeHistory.length === 0) {
            respondWithMessage.call(this, "🤖 No recent YouTube tracks played.");
        } else {
            respondWithMessage.call(this, "🤖 Retrieving last 10 played tracks...");

            youtubeHistory.forEach((entry, index) => {
                setTimeout(() => {
                    let nickname = userNicknames[entry.requester]?.nickname || entry.requester;
                    if (entry.requester) {
                        respondWithMessage.call(this, `${index + 1}. ${nickname} played: ${entry.track}`);
                    } else {
                        respondWithMessage.call(this, `${index + 1}. ${entry.track}`);
                    }
                }, index * 1000);
            });
        }
    }

// Handle .clearHistory command to wipe all history
if (wsmsg['text'].toLowerCase() === ".clearHistory") {
    youtubeHistory = [];
    localStorage.setItem("youtubeHistory", JSON.stringify(youtubeHistory));
    respondWithMessage.call(this, "🤖 YouTube history cleared.");
}

// User Commands --------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .users (List all users with delay)
        /*if (wsmsg['text'] === ".users") {
            const usersArray = Object.values(userNicknames)
                .filter((v, i, a) => a.findIndex(t => t.username === v.username) === i) // Remove duplicates
                .map(user => `Nickname: ${user.nickname}, Username: ${user.username}, Status: ${user.modStatus}`);

            if (usersArray.length === 0) {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: "🤖 No users stored."
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
        }*/

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .clearUsers (Clear stored users)
        /*if (wsmsg['text'] === ".clearUsers") {
            userNicknames = {}; // Reset the user data
            localStorage.removeItem('userNicknames'); // Clear from localStorage

            this._send(JSON.stringify({
                stumble: "msg",
                text: "🤖 All stored users have been cleared."
            }));
        }*/

//-----------------------------------------------------------------------------------------------------------------------------------

/*if (wsmsg['text'] === ".cleanusers") {
    let cleanedNicknames = {};
    let cleanedHandles = {};

    // Track the most recent handle for each username
    let latestHandles = {};

    // First, loop through userNicknames and keep only the latest entry per username
    for (let username in userNicknames) {
        let userData = userNicknames[username];

        // Always store the most recent user entry
        cleanedNicknames[username] = userData;

        // Track the most recent handle associated with this username
        latestHandles[username] = userData.handle;
    }

    // Now, loop through userHandles and keep only the most recent handle per username
    for (let handle in userHandles) {
        let username = userHandles[handle];

        // Only keep this handle if it's the latest one associated with the username
        if (latestHandles[username] === handle) {
            cleanedHandles[handle] = username;
        }
    }

    // Save the cleaned lists back to localStorage
    userNicknames = cleanedNicknames;
    userHandles = cleanedHandles;
    localStorage.setItem('userNicknames', JSON.stringify(userNicknames));
    localStorage.setItem('userHandles', JSON.stringify(userHandles));

    // Send a confirmation message
    this._send(JSON.stringify({
        stumble: "msg",
        text: "🤖 Duplicate user entries and old handles have been removed!"
    }));
}*/

//-----------------------------------------------------------------------------------------------------------------------------------

    // Universal Notes Storage (ensure backward compatibility)
    /*let universalNotes = JSON.parse(localStorage.getItem("universalNotes")) || [];

    // Handle .note command to add a new note
    if (wsmsg['text'] && wsmsg['text'].startsWith(".note ")) {
        const noteText = wsmsg['text'].slice(6).trim(); // Extract the note text
        const handle = wsmsg['handle']; // Get session handle
        const username = userHandles[handle]; // Get persistent username
        const user = userNicknames[username]; // Get user data

        if (!user || !user.username) {
            respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
            return;
        }

        if (noteText.length === 0) {
            respondWithMessage.call(this, "🤖 Usage: .note [your note]");
        } else {
            // Limit notes to 26; remove the oldest if full
            if (universalNotes.length >= 26) {
                universalNotes.shift(); // Remove the first (oldest) note
            }

            // Store note with persistent username
            universalNotes.push({ username: user.username, note: noteText });
            localStorage.setItem("universalNotes", JSON.stringify(universalNotes));

            respondWithMessage.call(this, "🤖 Note added!");
        }
    }*/

    // Handle .notes command to display all notes with delay
    /*if (wsmsg['text'].toLowerCase() === ".notes") {
        if (universalNotes.length === 0) {
            respondWithMessage.call(this, "🤖 No notes available.");
        } else {
            respondWithMessage.call(this, "🤖 Retrieving notes...");

            universalNotes.forEach((entry, index) => {
                setTimeout(() => {
                    // Output without username for now
                    if (typeof entry === "string") {
                        respondWithMessage.call(this, `${index + 1}. ${entry}`);
                    } else {
                        respondWithMessage.call(this, `${index + 1}. ${entry.note}`);
                    }
                }, index * 1000); // 1-second delay per note
            });
        }
    }*/

// Handle .notes [page] command to display all notes in pages with delay
/*if (wsmsg['text'].toLowerCase().startsWith(".notes")) {
    const args = wsmsg['text'].split(" ");
    const page = parseInt(args[1]) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(universalNotes.length / itemsPerPage);

    if (universalNotes.length === 0) {
        respondWithMessage.call(this, "🤖 No notes available.");
        return;
    }

    if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page. Use \`.notes [1-${totalPages}]\`.`);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const notesToShow = universalNotes.slice(start, end);

    respondWithMessage.call(this, `📓 Notes — Page ${page}/${totalPages}`);

    notesToShow.forEach((entry, index) => {
        setTimeout(() => {
            const noteText = typeof entry === "string" ? entry : entry.note;
            respondWithMessage.call(this, `${start + index + 1}. ${noteText}`);
        }, index * 1000); // 1-second delay per note
    });
}*/

    // Handle .mynotes command to display only the user's notes with delay
    /*if (wsmsg['text'].toLowerCase() === ".mynotes") {
        const handle = wsmsg['handle']; // Get session handle
        const username = userHandles[handle]; // Get persistent username
        const user = userNicknames[username]; // Get user data

        if (!user || !user.username) {
            respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
            return;
        }

        const userNotes = universalNotes.filter(entry => typeof entry !== "string" && entry.username === user.username);

        if (userNotes.length === 0) {
            respondWithMessage.call(this, "🤖 You have no saved notes.");
        } else {
            respondWithMessage.call(this, "🤖 Retrieving your notes...");

            userNotes.forEach((entry, index) => {
                setTimeout(() => {
                    respondWithMessage.call(this, `${index + 1}. ${entry.note}`);
                }, index * 1000); // 1-second delay per note
            });
        }
    }*/

// Handle .mynotes [page] command to display only the user's notes in pages with delay
/*if (wsmsg['text'].toLowerCase().startsWith(".mynotes")) {
    const handle = wsmsg['handle']; // Get session handle
    const username = userHandles[handle]; // Get persistent username
    const user = userNicknames[username]; // Get user data

    if (!user || !user.username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const allUserNotes = universalNotes.filter(entry =>
        typeof entry !== "string" && entry.username === user.username
    );

    if (allUserNotes.length === 0) {
        respondWithMessage.call(this, "🤖 You have no saved notes.");
        return;
    }

    const args = wsmsg['text'].split(" ");
    const page = parseInt(args[1]) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(allUserNotes.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page. Use \`.mynotes [1-${totalPages}]\`.`);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const notesToShow = allUserNotes.slice(start, end);

    respondWithMessage.call(this, `📓 Your Notes — Page ${page}/${totalPages}`);

    notesToShow.forEach((entry, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, `${start + index + 1}. ${entry.note}`);
        }, index * 1000); // 1-second delay per note
    });
}

// Handle .clearMyNotes to delete only the user's notes
if (wsmsg['text'].toLowerCase() === ".clearmynotes") {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const user = userNicknames[username];

    if (!user || !user.username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const beforeCount = universalNotes.length;

    // Filter out only this user's notes
    universalNotes = universalNotes.filter(entry =>
        typeof entry === "string" || entry.username !== user.username
    );

    const afterCount = universalNotes.length;
    const removed = beforeCount - afterCount;

    localStorage.setItem("universalNotes", JSON.stringify(universalNotes));

    if (removed > 0) {
        respondWithMessage.call(this, `🧹 You cleared ${removed} of your notes.`);
    } else {
        respondWithMessage.call(this, "🤖 You had no notes to clear.");
    }
}

    // Handle .clearNotes command to wipe all notes
    if (wsmsg['text'] === ".clearNotes") {
        universalNotes = [];
        localStorage.removeItem("universalNotes");
        respondWithMessage.call(this, "🤖 All notes cleared.");
    }*/

// Universal Notes Storage (ensure backward compatibility)
let universalNotes = JSON.parse(localStorage.getItem("universalNotes")) || [];

// Handle .note command to add a new note (max 25 per user)
if (wsmsg['text'] && wsmsg['text'].startsWith(".note ")) {
    const noteText = wsmsg['text'].slice(6).trim();
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const user = userNicknames[username];

    if (!user || !user.username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (noteText.length === 0) {
        respondWithMessage.call(this, "🤖 Usage: .note [your note]");
    } else {
        const userNotes = universalNotes.filter(entry =>
            typeof entry !== "string" && entry.username === user.username
        );

        // Enforce 25-note per user limit
        if (userNotes.length >= 25) {
            const firstIndex = universalNotes.findIndex(entry =>
                typeof entry !== "string" && entry.username === user.username
            );
            if (firstIndex !== -1) universalNotes.splice(firstIndex, 1);
        }

        universalNotes.push({ username: user.username, note: noteText });
        localStorage.setItem("universalNotes", JSON.stringify(universalNotes));

        respondWithMessage.call(this, "🤖 Note added!");
    }
}

// Handle .notes [page] to display all notes paginated
if (wsmsg['text'].toLowerCase().startsWith(".notes")) {
    const args = wsmsg['text'].split(" ");
    const page = parseInt(args[1]) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(universalNotes.length / itemsPerPage);

    if (universalNotes.length === 0) {
        respondWithMessage.call(this, "🤖 No notes available.");
        return;
    }

    if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page. Use \`.notes [1-${totalPages}]\`.`);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const notesToShow = universalNotes.slice(start, end);

    respondWithMessage.call(this, `📓 Notes — Page ${page}/${totalPages}`);

    notesToShow.forEach((entry, index) => {
        setTimeout(() => {
            const noteText = typeof entry === "string" ? entry : entry.note;
            respondWithMessage.call(this, `${start + index + 1}. ${noteText}`);
        }, index * 1000);
    });
}

// Handle .mynotes [page] to display only the user's notes paginated
/*if (wsmsg['text'].toLowerCase().startsWith(".mynotes")) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const user = userNicknames[username];

    if (!user || !user.username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const allUserNotes = universalNotes.filter(entry =>
        typeof entry !== "string" && entry.username === user.username
    );

    if (allUserNotes.length === 0) {
        respondWithMessage.call(this, "🤖 You have no saved notes.");
        return;
    }

    const args = wsmsg['text'].split(" ");
    const page = parseInt(args[1]) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(allUserNotes.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page. Use \`.mynotes [1-${totalPages}]\`.`);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const notesToShow = allUserNotes.slice(start, end);

    respondWithMessage.call(this, `📓 Your Notes — Page ${page}/${totalPages}`);

    notesToShow.forEach((entry, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, `${start + index + 1}. ${entry.note}`);
        }, index * 1000);
    });
}*/

// Handle .mynotes [page] to display only the user's notes paginated
if (wsmsg['text'].toLowerCase().startsWith(".mynotes")) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const user = userNicknames[username];

    if (!user || !user.username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const allUserNotes = universalNotes.filter(entry =>
        typeof entry !== "string" && entry.username === user.username
    );

    if (allUserNotes.length === 0) {
        respondWithMessage.call(this, "🤖 You have no saved notes.");
        return;
    }

    const args = wsmsg['text'].split(" ");
    const page = parseInt(args[1]) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(allUserNotes.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page. Use \`.mynotes [1-${totalPages}]\`.`);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const notesToShow = allUserNotes.slice(start, end);

    const nickname = user.nickname || user.username;
    respondWithMessage.call(this, `📓 ${nickname}'s Notes — Page ${page}/${totalPages}`);

    notesToShow.forEach((entry, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, `${start + index + 1}. ${entry.note}`);
        }, index * 1000); // 1-second delay per note
    });
}

// Handle .clearmynotes [#], [#-#], or "all"
if (wsmsg['text'].toLowerCase().startsWith(".clearmynotes")) {
    const args = wsmsg['text'].split(" ");
    const arg = args[1]?.toLowerCase();

    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const user = userNicknames[username];

    if (!user || !user.username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const userNotes = universalNotes
        .map((entry, idx) => ({ ...entry, __index: idx }))
        .filter(entry => typeof entry !== "string" && entry.username === user.username);

    if (!arg || userNotes.length === 0) {
        respondWithMessage.call(this, "🤖 Usage: .clearmynotes [#], [#-#], or `all`");
        return;
    }

    if (arg === "all") {
        universalNotes = universalNotes.filter(entry =>
            typeof entry === "string" || entry.username !== user.username
        );
        localStorage.setItem("universalNotes", JSON.stringify(universalNotes));
        respondWithMessage.call(this, `🧹 All your notes have been cleared.`);
        return;
    }

    const rangeMatch = arg.match(/^(\d+)(?:-(\d+))?$/);
    if (!rangeMatch) {
        respondWithMessage.call(this, "⚠️ Invalid input. Use `.clearmynotes [#]`, `.clearmynotes [#-#]`, or `.clearmynotes all`.");
        return;
    }

    let start = parseInt(rangeMatch[1]);
    let end = rangeMatch[2] ? parseInt(rangeMatch[2]) : start;

    if (isNaN(start) || isNaN(end) || start < 1 || end > userNotes.length || start > end) {
        respondWithMessage.call(this, `⚠️ Invalid note range. Use \`.mynotes\` to see valid numbers.`);
        return;
    }

    const notesToDelete = userNotes.slice(start - 1, end);
    for (let i = notesToDelete.length - 1; i >= 0; i--) {
        universalNotes.splice(notesToDelete[i].__index, 1);
    }

    localStorage.setItem("universalNotes", JSON.stringify(universalNotes));
    respondWithMessage.call(this, `🗑️ Deleted ${notesToDelete.length} note(s): #${start}${start !== end ? `–${end}` : ""}.`);
}

// Handle .clearNotes to wipe ALL notes (admin-only)
if (wsmsg['text'] === ".clearNotes") {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];

    if (username !== "Goji") {
        respondWithMessage.call(this, "🚫 Only Goji can use this command.");
        return;
    }

    universalNotes = [];
    localStorage.removeItem("universalNotes");
    respondWithMessage.call(this, "🧨 All notes have been cleared by Goji.");
}

// Handle .clearNotes to wipe ALL notes (admin/global nuke)
/*if (wsmsg['text'] === ".clearNotes") {
    universalNotes = [];
    localStorage.removeItem("universalNotes");
    respondWithMessage.call(this, "🤖 All notes cleared.");
}*/

// GojiBux --------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 LGH (Limited Goji Holdings) - Prevent Reset & Allow Unlimited Cap
let storedLghBank = localStorage.getItem("lghBank");
let lghBank = storedLghBank !== null ? parseInt(storedLghBank) : 500000;

// Ensure LGH stays within a valid range (no negative values)
if (lghBank < 0) lghBank = 0;

// 💰 Save LGH
function saveLghBank() {
    localStorage.setItem("lghBank", lghBank);
}

// 🔍 Debugging Log
console.log(`LGH Bank Loaded: ${lghBank} GBX`);

// 🛑 Ensure LGH Saves on Exit
window.addEventListener("beforeunload", saveLghBank);

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 Universal GojiBux Storage (Per-user)
let userBalances = JSON.parse(localStorage.getItem("userBalances")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 💸 Transaction Tax System
function applyTax(amount, taxRate) {
    return Math.floor(amount * (1 - taxRate));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Function to save user balances
function saveBalances() {
    localStorage.setItem("userBalances", JSON.stringify(userBalances));
    localStorage.setItem("lghBank", lghBank);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💵 `.mybux` - Display the user's GojiBux balance
if (wsmsg["text"].toLowerCase() === ".mybux") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (!(username in userBalances)) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have a GojiBux balance yet.`);
        return;
    }

    const balance = userBalances[username].balance;

    respondWithMessage.call(this, `🤖 ${nickname}: 💵 ${balance.toLocaleString()} GBX.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 `.gojibux` - Earn a random amount of GojiBux (Limited by LGH Bank)
let lastGojibuxTimes = JSON.parse(localStorage.getItem("lastGojibuxTimes")) || {}; // Store last use times

if ([".gojibux", ".gbx", ".getbux"].includes(wsmsg["text"].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    /*if (!userBalances[username]) {
        userBalances[username] = { balance: 1 }; // Ensure all users start with 1 GBX
    }*/
    if (userBalances[username] == null || userBalances[username].balance == null) {
        userBalances[username] = { balance: 0 }; // Ensure all users start at 0 if not defined
    }

    const now = Date.now();
    //const cooldown = 1 * 60 * 1000; // [1] 30-minute cooldown
    const cooldown = 10 * 1000; // 10-second cooldown
    const lastUsed = lastGojibuxTimes[username] || 0;

    if (now - lastUsed < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastUsed)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${timeLeft} seconds before using .gojibux again.`);
        return;
    }

    const actualIncrease = Math.floor(Math.random() * (250 - 5 + 1)) + 5; // Earn between 5 - 250 GBX

    if (lghBank < actualIncrease) {
        respondWithMessage.call(this, "🤖 The economy is struggling! No GojiBux available to earn.");
        return;
    }

    // Award GBX and update LGH Bank
    userBalances[username].balance += actualIncrease;
    lghBank -= actualIncrease;
    lastGojibuxTimes[username] = now; // Update last use time

    // Save data
    saveBalances();
    localStorage.setItem("lastGojibuxTimes", JSON.stringify(lastGojibuxTimes));

    // 📝 Randomize success messages
    const messages = [
        `🤑 ${nickname} just cashed in and got 💵 ${actualIncrease.toLocaleString()} GBX!`,
        `🤑 ${nickname} found 💵 ${actualIncrease.toLocaleString()} GBX under the couch! Lucky day!`,
        `🤑 ${nickname} made some sneaky trades and scored 💵 ${actualIncrease.toLocaleString()} GBX!`,
        `🤑 ${nickname} just got paid! 💵 +${actualIncrease.toLocaleString()} GBX!`,
        `🤑 ${nickname} exploited the stock market (legally?) and gained 💵 ${actualIncrease.toLocaleString()} GBX!`
    ];

    // Select a random success message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Messages to be sent in sequence
    const outputMessages = [
        randomMessage//,
        //`💰 New Balance: ${userBalances[username].balance.toLocaleString()} GBX`,
        //`🏦 LGH Bank Total: ${lghBank.toLocaleString()} GBX`
    ];

    // Send messages with a delay between them
    outputMessages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 `.admin givebux` - Give a specified user or all users a certain amount of GojiBux (default: 500)
if (wsmsg["text"].toLowerCase().startsWith(".admin givebux")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const adminUsers = ["Goji"]; // Replace with your admin username(s)

    if (!adminUsers.includes(username)) {
        respondWithMessage.call(this, "⛔ You do not have permission to use this command.");
        return;
    }

    // Extract arguments (e.g., ".admin givebux 10000" or ".admin givebux @User 10000")
    const args = wsmsg["text"].trim().split(/\s+/);
    let targetUser = null;
    let amount = 500; // Default amount

    if (args.length === 3) {
        // Case: `.admin givebux 10000` (all users)
        amount = parseInt(args[2], 10);
    } else if (args.length === 4) {
        // Case: `.admin givebux @User 10000` (specific user)
        targetUser = args[2].replace(/^@/, ""); // Remove '@' if used
        amount = parseInt(args[3], 10);
    }

    // Validate amount
    if (isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🤖 Error: Invalid amount specified.");
        return;
    }

    if (targetUser) {
        // Give GojiBux to a specific user
        if (userBalances.hasOwnProperty(targetUser)) {
            userBalances[targetUser].balance += amount;
            saveBalances();
            respondWithMessage.call(this, `💵 ${targetUser} just received ${amount.toLocaleString()} GojiBux!`);
        } else {
            respondWithMessage.call(this, `🤖 Error: Could not find user "${targetUser}".`);
        }
    } else {
        // Give GojiBux to all users
        let userCount = 0;
        for (const user in userBalances) {
            if (userBalances.hasOwnProperty(user)) {
                userBalances[user].balance += amount;
                userCount++;
            }
        }
        saveBalances();
        respondWithMessage.call(this, `💵 All ${userCount} users just received ${amount.toLocaleString()} GojiBux!`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💵📉 `.snarfbux` - Lose a random amount of GojiBux (LGH Bank gains)
let lastSnarfbuxTimes = JSON.parse(localStorage.getItem("lastSnarfbuxTimes")) || {}; // Store last use times

if (wsmsg["text"].toLowerCase() === ".snarfbux") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (!userBalances[username]) {
        userBalances[username] = { balance: 1 }; // Ensure all users start with 1 GBX
    }

    const now = Date.now();
    const cooldown = 1 * 60 * 1000; // 1-minute cooldown (same as .gojibux)
    const lastUsed = lastSnarfbuxTimes[username] || 0;

    if (now - lastUsed < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastUsed)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${timeLeft} seconds before using .snarfbux again.`);
        return;
    }

    // Determine how much GojiBux they lose (5 - 250 GBX)
    let actualLoss = Math.floor(Math.random() * (250 - 5 + 1)) + 5;
    actualLoss = Math.min(actualLoss, userBalances[username].balance); // Don't let them go negative

    if (actualLoss === 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you're too broke for .snarfbux to even matter.`);
        return;
    }

    // Deduct GBX and update LGH Bank
    userBalances[username].balance -= actualLoss;
    lghBank += actualLoss;
    lastSnarfbuxTimes[username] = now; // Update last use time

    // Save data
    saveBalances();
    localStorage.setItem("lastSnarfbuxTimes", JSON.stringify(lastSnarfbuxTimes));

    // 📝 Randomize failure messages
    const messages = [
        `💵📉 ${nickname} just made a terrible financial decision and lost 💵 ${actualLoss.toLocaleString()} GBX!`,
        `💵📉 ${nickname} got scammed out of 💵 ${actualLoss.toLocaleString()} GBX! Better luck next time.`,
        `💵📉 ${nickname} just invested all their GBX in a pyramid scheme and lost 💵 ${actualLoss.toLocaleString()} GBX!`,
        `💵📉 ${nickname} tripped, dropped their wallet, and lost 💵 ${actualLoss.toLocaleString()} GBX! Oof.`,
        `💵📉 ${nickname} bet on a "sure thing" and got absolutely wrecked, losing 💵 ${actualLoss.toLocaleString()} GBX!`
    ];

    // Select a random pain message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    // Messages to be sent in sequence
    const outputMessages = [
        randomMessage//,
        //`💰 New Balance: ${userBalances[username].balance.toLocaleString()} GBX`,
        //`🏦 LGH Bank Total: ${lghBank.toLocaleString()} GBX`
    ];

    // Send messages with a delay between them
    outputMessages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 📉 `.$NARF` - Display the negative GojiBux balance
if (wsmsg["text"].toLowerCase() === ".$narf") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const balance = userBalances[username]?.balance || 1;

    respondWithMessage.call(this, `💵📉 ${nickname}, $NARF value: 💵 ${(-balance).toLocaleString()} $NRF`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🧧 .givebux [username] [amount/max/all] - Give GojiBux to another user, or random if no user specified
if (wsmsg["text"].toLowerCase().startsWith(".givebux")) {
    const args = wsmsg["text"].split(" ");
    const handle = wsmsg["handle"];
    const giverUsername = userHandles[handle];
    const giverNickname = userNicknames[giverUsername]?.nickname || giverUsername || "you";

    if (!giverUsername) {
        respondWithMessage.call(this, "🤖 Something went wrong. Try again.");
        return;
    }

    let giverBalance = userBalances[giverUsername]?.balance || 0;
    let recipientUsername = null;
    let amount = null;

    // Determine if the first argument is a user or an amount/max/all
    if (args.length > 1) {
        if (!isNaN(args[1]) || args[1].toLowerCase() === "max" || args[1].toLowerCase() === "all") {
            // First argument is a number or "max"/"all" → no user specified
            amount = args[1].toLowerCase();
        } else {
            // First argument is a username
            recipientUsername = args[1];
            amount = args[2] ? args[2].toLowerCase() : null;
        }
    }

    // Pick a random recipient if none specified
    if (!recipientUsername) {
        const potentialRecipients = Object.keys(userBalances).filter(username => username !== giverUsername);
        if (potentialRecipients.length === 0) {
            respondWithMessage.call(this, "🤖 No other users available to receive GojiBux.");
            return;
        }
        recipientUsername = potentialRecipients[Math.floor(Math.random() * potentialRecipients.length)];
    }

    if (recipientUsername === giverUsername) {
        respondWithMessage.call(this, "🤖 You can't give GojiBux to yourself.");
        return;
    }

    if (!userBalances[recipientUsername]) {
        respondWithMessage.call(this, `🤖 ${recipientUsername} is not a valid user.`);
        return;
    }

    // Determine the amount to give
    if (!amount) {
        // No amount specified, give a random 1-20% of giver's balance (minimum 10 GBX)
        amount = Math.max(10, Math.floor(giverBalance * (Math.random() * 0.2 + 0.01)));
    } else if (amount === "max" || amount === "all") {
        if (giverBalance <= 0) {
            respondWithMessage.call(this, "🤖 You have no GojiBux to give.");
            return;
        }
        amount = giverBalance; // Give full balance
    } else {
        amount = parseInt(amount);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Enter a valid amount greater than zero.");
            return;
        }
    }

    if (amount > giverBalance) {
        respondWithMessage.call(this, "🤖 You don't have enough GojiBux to give.");
        return;
    }

    if (amount < 10) {
        respondWithMessage.call(this, "🤖 Minimum transfer amount is 10 GBX.");
        return;
    }

    // Transfer the amount
    userBalances[giverUsername].balance -= amount;
    userBalances[recipientUsername].balance = (userBalances[recipientUsername].balance || 0) + amount;
    saveBalances();

    const recipientNickname = userNicknames[recipientUsername]?.nickname || recipientUsername;

    const messages = [
        `🧧 ${giverNickname} generously gave 💵 ${amount.toLocaleString()} GBX to ${recipientNickname}!`,
        `🧧 ${giverNickname} just spread the wealth, giving ${recipientNickname} 💵 ${amount.toLocaleString()} GBX!`,
        `🧧 ${recipientNickname} just received 💵 ${amount.toLocaleString()} GBX from ${giverNickname}! Sharing is caring!`
    ];
    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🏦🎁 `.donatebank [amount|max|all]` - Donate GojiBux to LGH Bank
const donatebankTriggers = [".donatebank"]; // add aliases here like ".bankdonate"
if (donatebankTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(" ");

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .donatebank [amount|max|all]");
        return;
    }

    let amountArg = args[1].toLowerCase();
    let amount;
    const userBalance = userBalances[username]?.balance || 0;

    if (amountArg === "all" || amountArg === "max") {
        amount = userBalance;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any GojiBux to donate.`);
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Enter a valid amount to donate.");
            return;
        }
        if (userBalance < amount) {
            respondWithMessage.call(this, "🤖 You don't have enough GojiBux to donate that much.");
            return;
        }
    }

    // Deduct GojiBux from user and add to LGH Bank
    userBalances[username].balance -= amount;
    lghBank += amount;
    saveBalances();
    localStorage.setItem("lghBank", lghBank);

    respondWithMessage.call(this, `🏦🎁 ${nickname} donated 💵 ${amount.toLocaleString()} GBX to LGH Bank!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 Universal Stashed GojiBux (Per-user)
let userStashes = JSON.parse(localStorage.getItem("userStashes")) || {};

// Function to save user stashes
function saveUserStashes() {
    localStorage.setItem("userStashes", JSON.stringify(userStashes));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🔒 .stash (60-second cooldown)(10 second)
let lastStashTimes = JSON.parse(localStorage.getItem("lastStashTimes")) || {}; // Store last use times

// 💰➕ `.stashbux [amount|max|all]` - Stash GojiBux with cooldown
const stashbuxTriggers = [".stashbux"]; // add aliases here like ".stash"
if (stashbuxTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(" ");

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .stashbux [amount|max|all]");
        return;
    }

    const now = Date.now();
    const cooldown = 10 * 1000; // 10-second cooldown
    const lastUsed = lastStashTimes[username] || 0;

    if (now - lastUsed < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastUsed)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${timeLeft} seconds before stashing again.`);
        return;
    }

    const amountArg = args[1].toLowerCase();
    const balanceAvailable = userBalances[username]?.balance || 0;
    let amount;

    if (amountArg === "all" || amountArg === "max") {
        amount = balanceAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any GBX to stash.`);
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || amount > balanceAvailable) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient funds.");
            return;
        }
    }

    userBalances[username].balance -= amount;
    userStashes[username] = (userStashes[username] || 0) + amount;
    saveBalances();
    saveUserStashes();

    lastStashTimes[username] = now;
    localStorage.setItem("lastStashTimes", JSON.stringify(lastStashTimes));

    respondWithMessage.call(this, `💰➕ ${nickname} stashed 💵 ${amount.toLocaleString()} GBX!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰➖ `.unstashbux [amount|max|all]` - Withdraw from stash
const unstashbuxTriggers = [".unstashbux"]; // add aliases here like ".unstash"
if (unstashbuxTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(" ");

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .unstashbux [amount|max|all]");
        return;
    }

    const amountArg = args[1].toLowerCase();
    const stashAvailable = userStashes[username] || 0;
    let amount;

    if (amountArg === "all" || amountArg === "max") {
        amount = stashAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, your stash is empty.`);
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || amount > stashAvailable) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    userStashes[username] -= amount;
    userBalances[username].balance = (userBalances[username].balance || 0) + amount;
    saveBalances();
    saveUserStashes();

    respondWithMessage.call(this, `💰➖ ${nickname} withdrew 💵 ${amount.toLocaleString()} GBX from their stash!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🔍 `.my stash bux` - View stashed GojiBux
if (wsmsg["text"].toLowerCase() === ".mystashbux") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userStashes[username] || 0;

    respondWithMessage.call(this, `💰 ${nickname}, you have 💵 ${stash.toLocaleString()} GBX stashed away.`);
}

// Weed Stash -----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 🌿 WGH (Weed Global Holdings) - Prevent Reset & Allow Unlimited Cap
let storedWghBank = localStorage.getItem("wghBank");
let wghBank = storedWghBank !== null ? parseInt(storedWghBank) : 10000;

// Ensure WGH stays within a valid range (no negative values)
if (wghBank < 0) wghBank = 0;

// 🌿 Save WGH
function saveWGHBank() {
    localStorage.setItem("wghBank", wghBank);
}

// 🔍 Debugging Log
console.log(`WGH Bank Loaded: ${wghBank} grams`);

// 🛑 Ensure WGH Saves on Exit
window.addEventListener("beforeunload", saveWGHBank);

//-----------------------------------------------------------------------------------------------------------------------------------

// 🌿 Universal Weed Storage (Per-user)
let userWeedStashes = JSON.parse(localStorage.getItem("userWeedStashes")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 🌿 Ensure weed prices are stored correctly
let BASE_PRICE = Math.floor(20 / 3.5); // ~5 GBX per gram
let weedBuyPrice = parseInt(localStorage.getItem("weedBuyPrice")) || BASE_PRICE;
let weedSellPrice = parseInt(localStorage.getItem("weedSellPrice")) || Math.floor(BASE_PRICE * 0.8);
let prevWeedBuyPrice = weedBuyPrice;
let prevWeedSellPrice = weedSellPrice;

function updateWeedPrices() {
    const bank = wghBank || 0;
    const gbxReserve = lghBank || 0;

    // 🌿 Ensure user stash objects exist before reducing
    const totalWeed = Object.values(userWeedStashes || {}).reduce((a, b) => a + (b || 0), 0);
    const offshoreTotal = Object.values(userStashes || {}).reduce((a, b) => a + (b || 0), 0);
    const hiddenTotal = Object.values(userHiddenWeed || {}).reduce((a, b) => a + (b || 0), 0);

    // **Scarcity Factor Based on WGH**
    let scarcityFactor = 1.0;
    if (bank <= 5000) scarcityFactor = 1.6;
    else if (bank <= 10000) scarcityFactor = 1.3;
    else if (bank >= 50000) scarcityFactor = 0.85;
    else if (bank >= 100000) scarcityFactor = 0.7;

    // **Inflation Factor Based on LGH**
    let inflationFactor = 1.0;
    if (gbxReserve >= 1000000) inflationFactor = 1.5;
    else if (gbxReserve >= 500000) inflationFactor = 1.3;
    else if (gbxReserve <= 100000) inflationFactor = 0.8;

    // **Demand Factor Based on User Holdings**
    let demandFactor = 1.0;
    if (totalWeed > 200000) demandFactor = 1.2;
    if (offshoreTotal > 500000) demandFactor += 0.2;
    if (hiddenTotal > 50000) demandFactor -= 0.15;

    // **Final Price Modifier Calculation**
    let finalPriceFactor = scarcityFactor * inflationFactor * demandFactor;

    // **Random price shift (-5% to +5%)**
    const randomFactor = 1 + ((Math.random() * 0.1) - 0.05);

    // **Calculate new prices**
    let newBuyPrice = Math.max(1, Math.round(BASE_PRICE * finalPriceFactor * randomFactor));
    let newSellPrice = Math.max(1, Math.round(newBuyPrice * 0.8));

    // **Smooth transition to prevent wild swings**
    let priceShift = Math.round((newBuyPrice - prevWeedBuyPrice) * 0.5);
    weedBuyPrice = Math.max(1, prevWeedBuyPrice + priceShift);
    weedSellPrice = Math.max(1, prevWeedSellPrice + Math.round(priceShift * 0.8));

    prevWeedBuyPrice = weedBuyPrice;
    prevWeedSellPrice = weedSellPrice;

    // **Save new values**
    localStorage.setItem("weedBuyPrice", weedBuyPrice);
    localStorage.setItem("weedSellPrice", weedSellPrice);

    console.log(`🌿 Weed Prices Updated: Buy ${weedBuyPrice} GBX/g | Sell ${weedSellPrice} GBX/g | WGH: ${bank} | LGH: ${gbxReserve}`);
}

// **Run price update every 30 sec**
if (!window._weedPriceIntervalSet) {
    setInterval(updateWeedPrices, 30 * 1000);
    window._weedPriceIntervalSet = true;
    console.log("🌿 Weed price updater initialized.");
}

// Function to save user weed stashes
function saveWeedStashes() {
    localStorage.setItem("userWeedStashes", JSON.stringify(userWeedStashes));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🌿 Universal Joint Storage (Per-user)
let userJointStashes = JSON.parse(localStorage.getItem("userJointStashes")) || {};

// Function to save user joint stashes
function saveJointStashes() {
    localStorage.setItem("userJointStashes", JSON.stringify(userJointStashes));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦➕ `.buyweed [amount|max|all]` - Buy weed using GBX, with price markup and market cap
const buyweedTriggers = [".buyweed"]; // add aliases here like ".getweed"
if (buyweedTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(" ");

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .buyweed [amount|max|all]");
        return;
    }

    const userBalance = userBalances[username]?.balance || 0;
    const maxAllowed = Math.floor(wghBank / 2);
    const maxAffordable = Math.floor(userBalance / (weedBuyPrice * 1.02));
    let amountArg = args[1].toLowerCase();
    let amount;

    if (amountArg === "max" || amountArg === "all") {
        amount = Math.min(maxAffordable, maxAllowed);
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you can't afford any weed right now or the market supply is too limited.`);
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .buyweed [amount|max|all]");
            return;
        }

        if (amount > maxAllowed) {
            respondWithMessage.call(this, `🤖 You can only buy up to half the available weed 🏬 (${maxAllowed}g).`);
            return;
        }

        const requiredFunds = Math.ceil(amount * weedBuyPrice * 1.02);
        if (userBalance < requiredFunds) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough GBX. Weed is 💵 ${weedBuyPrice} GBX/g.`);
            return;
        }
    }

    const cost = Math.ceil(amount * weedBuyPrice * 1.02);
    userBalances[username].balance -= cost;
    userWeedStashes[username] = (userWeedStashes[username] || 0) + amount;
    wghBank -= amount;
    lghBank += cost;

    saveBalances();
    saveWeedStashes();
    saveWGHBank();
    localStorage.setItem("lghBank", lghBank);

    respondWithMessage.call(this, `🥦➕ ${nickname} bought 🥦 ${amount}g of weed for 💵 ${cost.toLocaleString()} GBX.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦➖ `.sellweed [amount|max|all]` - Sell weed for GBX with 5% tax and liquidity check
const sellweedTriggers = [".sellweed"]; // add aliases here like ".flipbud"
if (sellweedTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(" ");

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .sellweed [amount|max|all]");
        return;
    }

    const amountArg = args[1].toLowerCase();
    const weedAvailable = userWeedStashes[username] || 0;
    let amount;

    if (amountArg === "all" || amountArg === "max") {
        amount = weedAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any weed to sell.`);
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || weedAvailable < amount) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to sell.`);
            return;
        }
    }

    const earnings = applyTax(amount * weedSellPrice, 0.05);
    if (lghBank < earnings) {
        respondWithMessage.call(this, `🤖 The economy is too broke to pay that much. Try a smaller amount.`);
        return;
    }

    userWeedStashes[username] -= amount;
    userBalances[username].balance = (userBalances[username].balance || 0) + earnings;
    wghBank += amount;
    lghBank -= earnings;

    saveBalances();
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `🥦➖ ${nickname} sold 🥦 ${amount}g of weed for 💵 ${earnings.toLocaleString()} GBX.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🏬🎁 `.donateweed [amount|max|all]` - Donate weed to the public WGH stash
const donateweedTriggers = [".donateweed"]; // add aliases here like ".giveweed"
if (donateweedTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(" ");

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .donateweed [amount|max|all]");
        return;
    }

    const amountArg = args[1].toLowerCase();
    const weedAvailable = userWeedStashes[username] || 0;
    let amount;

    if (amountArg === "all" || amountArg === "max") {
        amount = weedAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any weed to donate.`);
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || weedAvailable < amount) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    userWeedStashes[username] -= amount;
    wghBank += amount;

    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `🏬🎁 ${nickname} donated 🥦 ${amount}g of weed to the WGH stash! Much love.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.grow`
let lastGrowTime = JSON.parse(localStorage.getItem("lastGrowTime")) || {};

// 🥦🌱 `.grow` - Grow a random amount of weed for your stash! (30-minute cooldown)
if ([".grow", ".getweed"].includes(wsmsg["text"].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const now = Date.now();
    const lastGrow = lastGrowTime[username] || 0;
    //const cooldown = 30 * 60 * 1000; // 30-minute cooldown
    const cooldown = 30 * 1000; // 30-second cooldown

    if (now - lastGrow < cooldown) {
        //const timeLeft = Math.ceil((cooldown - (now - lastGrow)) / 60000);
        //respondWithMessage.call(this, `⏳ ${nickname}, your plants need more time! Try again in ${timeLeft} minutes.`);
        const timeLeft = Math.ceil((cooldown - (now - lastGrow)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, your plants need more time! Try again in ${timeLeft} seconds.`);
        return;
    }

    // 🥦 Random Weed Growth (0-1792 grams per grow)
    const grownGrams = Math.floor(Math.random() * 1793); // 0 to 1792 grams
    const grownPounds = (grownGrams / 448).toFixed(2); // Convert grams to pounds (rounded to 2 decimal places)

    userWeedStashes[username] = (userWeedStashes[username] || 0) + grownGrams;
    lastGrowTime[username] = now;

    // Save Grow Time & Stash
    saveWeedStashes();
    localStorage.setItem("lastGrowTime", JSON.stringify(lastGrowTime));

    // 🥦 Funny Messages
    let response;
    if (grownGrams === 0) {
        response = `🥦🌱 ${nickname} tried to grow some weed, but the crop failed. Better luck next time!`;
    } else {
        const messages = [
            `🥦🌱 ${nickname} cultivated a strong batch and harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of premium kush!`,
            `🥦🌱 ${nickname} just grew 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of top-shelf bud! Time to cure it.`,
            `🥦🌱 ${nickname} harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of sticky, stanky goodness!`,
            `🥦🌱 ${nickname} carefully tended their plants and yielded 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of fire!`,
            `🥦🌱 ${nickname} worked the grow op and scored 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of high-grade green!`
        ];
        response = messages[Math.floor(Math.random() * messages.length)];
    }

    respondWithMessage.call(this, response);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.harvest`
let lastHarvestTime = JSON.parse(localStorage.getItem("lastHarvestTime")) || {};
//let wghBank = JSON.parse(localStorage.getItem("wghBank")) || 10000; // WGH storage (Weed Global Holdings)

// 🏬🌱 `.harvest` - Collect weed from Goji’s Garden and store it in WGH (30-minute cooldown)
if (wsmsg["text"].toLowerCase() === ".harvest") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const now = Date.now();
    const lastHarvest = lastHarvestTime[username] || 0;
    //const cooldown = 30 * 60 * 1000; // 30-minute cooldown
    const cooldown = 30 * 1000; // 30-second cooldown

    if (now - lastHarvest < cooldown) {
        //const timeLeft = Math.ceil((cooldown - (now - lastHarvest)) / 60000);
        //respondWithMessage.call(this, `⏳ ${nickname}, your plants need more time! Try again in ${timeLeft} minutes.`);
        const timeLeft = Math.ceil((cooldown - (now - lastHarvest)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, your plants need more time! Try again in ${timeLeft} seconds.`);
        return;
    }

    // 🥦 Massive NorCal Weed Growth (0 - 224,000 grams per harvest)
    const grownGrams = Math.floor(Math.random() * 224001); // 0 to 224,000 grams (500 lbs)
    const grownPounds = (grownGrams / 448).toFixed(2); // Convert grams to pounds (rounded to 2 decimal places)

    wghBank += grownGrams; // Store in WGH (Weed Global Holdings)
    lastHarvestTime[username] = now;

    // Save Harvest Time & WGH Stash
    localStorage.setItem("wghBank", JSON.stringify(wghBank));
    localStorage.setItem("lastHarvestTime", JSON.stringify(lastHarvestTime));

    // 🥦 Thematic Messages (Goji's Garden for messages, WGH in storage)
    let response;
    if (grownGrams === 0) {
        response = `🏬🌱 ${nickname} checked Goji’s Garden, but the plants were dry. No harvest this time!`;
    } else {
        const messages = [
            `🏬🌱 ${nickname} gathered a fresh batch from Goji’s Garden and stored 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] in WGH! 🌱`,
            `🏬🌱 ${nickname} just harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of premium bud from Goji’s Garden! Stored safely in WGH. 🌿`,
            `🏬🌱 ${nickname} picked a lush crop from Goji’s Garden, adding 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] to WGH!`,
            `🏬🌱 The farm is thriving! ${nickname} harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] from Goji’s Garden and stored it in WGH!`,
            `🏬🌱 ${nickname} cultivated a massive batch and contributed 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] to WGH! 🌱`,
            `🏬🌱 ${nickname} just harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of top-shelf Mendocino bud for WGH!`,
            `🏬🌱 ${nickname} harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of sticky, stanky, high-grade weed and stashed it in WGH!`,
            `🏬🌱 ${nickname} carefully tended their massive plants and added 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] to WGH’s legendary stash!`,
            `🏬🌱 ${nickname} worked the grow op like a pro and boosted WGH with 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of top-quality green!`,
            `🏬🌱 The farm is flourishing! ${nickname} just stacked 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] into WGH!`,
            `🏬🌱 ${nickname} grew an absolute monster crop and dropped 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] into WGH's stash!`,
            `🏬🌱 WGH is expanding! ${nickname} hauled in 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of NorCal’s finest!`,
            `🏬🌱 Under the Mendocino sun, ${nickname} cultivated a bountiful harvest of 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of prime Mendo Dope!`,
            `🏬🌱 High up in the Redwood Forest, ${nickname} tended the trees and stashed 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of deep forest fire!`,
            `🏬🌱 Deep in The Mountains, ${nickname} braved the elements and grew 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of rugged NorCal kush!`,
            `🏬🌱 The 707 grow network reports a massive yield—🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of underground gas from ${nickname}!`,
            `🏬🌱 That skunky aroma can only mean one thing—${nickname} just harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of legendary NorCal funk!`,
            `🏬🌱 ${nickname} just perfected a new strain: "${nickname}'s Kush", yielding 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of exclusive fire! 🔥`,
            `🏬🌱 The winds of NorCal blessed ${nickname}'s crop, resulting in a crazy 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] haul!`,
            `🏬🌱 The hash presses are working overtime! ${nickname} just processed 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] into pure golden rosin!`,
            `🏬🌱 With a fleet of trim machines and old-school hand-trimmers, ${nickname} cleaned up 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of top-shelf bud!`,
            `🏬🌱 This is some trichome city shit! ${nickname} cultivated 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of pure crystalline frost! ❄️`,
            `🏬🌱 After months of careful pheno-hunting, ${nickname} just discovered a new strain, pulling 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of elite cultivar kush!`,
            `🏬🌱 The truck is loaded! ${nickname} just moved 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of NorCal’s most in-demand bud!`,
            `🏬🌱 Deep in the black market, whispers are spreading about ${nickname}’s 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] stash of OG underground kush!`,
            `🏬🌱 This strain is out of this world! ${nickname} just harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of galactic-grade interstellar weed!`,
            `🏬🌱 Dispensaries are fighting for it! ${nickname} just harvested 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of exclusive designer weed!`,
            `🏬🌱 A bald eagle flew overhead while ${nickname} trimmed down 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of 100% American-grown freedom kush!`,
            `🏬🌱 The stash house is FULL! ${nickname} just added 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] to the Mendo underground supply chain!`,
            `🏬🌱 Secret smoke circles are talking about ${nickname}'s latest 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of mystery NorCal bud!`,
            `🏬🌱 World-class harvest! ${nickname} just stacked 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of Cali’s most in-demand weed!`,
            `🏬🌱 This stuff is straight up skunk factory! ${nickname} pulled in 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of nose-burning loud pack!`,
            `🏬🌱 Future legends will speak of ${nickname}’s Kush, the strain that yielded 🥦 ${grownPounds} lb [${grownGrams.toLocaleString()}g] of pure gas!`
        ];
        response = messages[Math.floor(Math.random() * messages.length)];
    }

    respondWithMessage.call(this, response);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🏬🎁 `.distribute` - Take 10% of WGH and distribute evenly to users
if (wsmsg["text"].toLowerCase() === ".distribute") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // Check if WGH has enough to distribute
    if (wghBank <= 0) {
        respondWithMessage.call(this, "🏬 WGH is empty! Harvest more from Goji’s Garden before distributing.");
        return;
    }

    // Take 10% of the total WGH Bank for distribution
    const totalDistribution = Math.floor(wghBank * 0.10); // 10% of total stash

    if (totalDistribution <= 0) {
        respondWithMessage.call(this, "🏬 Not enough weed in WGH to distribute! Harvest more first.");
        return;
    }

    // Get all users who can receive the harvest
    const eligibleUsers = Object.keys(userWeedStashes);

    if (eligibleUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No users available to receive the distribution.");
        return;
    }

    // Calculate how much each user gets
    const perUserAmount = Math.floor(totalDistribution / eligibleUsers.length);
    if (perUserAmount <= 0) {
        respondWithMessage.call(this, "🏬 Not enough weed to split fairly. Harvest more first!");
        return;
    }

    // Distribute the weed and deduct from WGH
    eligibleUsers.forEach(user => {
        userWeedStashes[user] = (userWeedStashes[user] || 0) + perUserAmount;
    });

    wghBank -= totalDistribution; // Remove distributed amount from WGH

    // Save changes
    saveWeedStashes();
    localStorage.setItem("wghBank", JSON.stringify(wghBank));

    respondWithMessage.call(this, `🏬🎁 Distribution complete! Each user received 🥦 ${perUserAmount.toLocaleString()}g of weed from WGH!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💨 `.admin giveweed` - Give all users a specified amount of weed (default: 420g)
if (wsmsg["text"].toLowerCase().startsWith(".admin giveweed")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const adminUsers = ["Goji"]; // Replace with your admin username(s)

    if (!adminUsers.includes(username)) {
        respondWithMessage.call(this, "⛔ You do not have permission to use this command.");
        return;
    }

    // Extract amount from message (e.g., ".admin giveweed 1000")
    const args = wsmsg["text"].trim().split(/\s+/);
    let amount = parseInt(args[2], 10);

    // If no valid number is given, default to 420 grams
    if (isNaN(amount) || amount <= 0) {
        amount = 420;
    }

    let userCount = 0;
    for (const user in userWeedStashes) {
        if (userWeedStashes.hasOwnProperty(user)) {
            userWeedStashes[user] = (userWeedStashes[user] || 0) + amount;
            userCount++;
        }
    }

    saveWeedStashes();

    respondWithMessage.call(this, `🚀 All ${userCount} users just got 🥦 ${amount.toLocaleString()} grams of premium bud! 💚`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🌿 4:20 Auto-Weed & WGH Deposit Only
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

    // Send 4:20 alert and add 69,420g to WGH only
    if (shouldSendMessage) {
        shouldSendMessage = false; // Reset the flag immediately to prevent multiple sends

        setTimeout(() => {
            // Send GIF first
            this._send('{"stumble":"msg","text": "https://i.imgur.com/Dmscsdd.gif"}');

            setTimeout(() => {
                this._send('{"stumble":"msg","text": "🍃 It\'s 4:20 somewhere! Smoke em if you got em! 💨"}');

                setTimeout(() => {
                    // Add 69,420g to WGH (Weed Global Holdings)
                    if (!wghBank) {
                        wghBank = 0;
                    }
                    wghBank += 69420;

                    // Save updated WGH stash
                    localStorage.setItem("wghBank", JSON.stringify(wghBank));

                    // Format WGH in pounds for the message (1 lb = 448g)
                    const addedPounds = (69420 / 448).toFixed(2);
                    const wghTotalPounds = (wghBank / 448).toFixed(2);

                    this._send(`{"stumble":"msg","text": "🏬➕ WGH just grew by 🥦 ${addedPounds} lb [69,420g]! 💚"}`);

                    // Optional: Send .help message after another delay
                    // setTimeout(() => {
                    //     this._send('{"stumble":"msg","text": "💡 Use .help to join the fun!"}');
                    // }, 3000);
                }, 3000); // 3-second delay before WGH message
            }, 2000); // 2-second delay after GIF
        }, 1000); // 1-second delay for initial GIF
    }
}, 1000);

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦🎒 `.myweed` - Display user's weed stash with unit breakdown
if (wsmsg["text"].toLowerCase() === ".myweed") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    let stash = userWeedStashes[username] || 0;
    const buyPrice = weedBuyPrice.toLocaleString();
    const sellPrice = weedSellPrice.toLocaleString();

    // Conversion factors
    const gramsPerOunce = 28.3495;
    const ouncesPerPound = 16;
    const gramsPerPound = gramsPerOunce * ouncesPerPound;

    // Convert stash
    const pounds = Math.floor(stash / gramsPerPound);
    stash %= gramsPerPound;
    const ounces = Math.floor(stash / gramsPerOunce);
    const grams = Math.round(stash % gramsPerOunce);

    // Format stash breakdown
    let stashText = [];
    if (pounds > 0) stashText.push(`${pounds}lb`);
    if (ounces > 0) stashText.push(`${ounces}oz`);
    if (grams > 0 || stashText.length === 0) stashText.push(`${grams}g`);

    const messages = [
        `🥦🎒 ${nickname}'s Weed Balance: 🥦 ${stashText.join(" ")} (${userWeedStashes[username]}g)`,
        // Uncomment if you want to show prices
        //`🔥 Current Weed Prices: Buy: ${buyPrice} GBX/g | Sell: ${sellPrice} GBX/g`
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥖 `.jointroll [amount|max|all]` - Convert weed into joints using random weed cost (1–3.5g per joint)
const jointrollTriggers = [".jointroll"]; // add aliases here like ".rollup"
if (jointrollTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(/\s+/);

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .jointroll [amount|max|all]");
        return;
    }

    const arg = args[1].toLowerCase();
    const weedAvailable = userWeedStashes[username] || 0;
    let amount, requiredWeed;

    const randomJointCost = () => (Math.floor(Math.random() * 6) * 0.5) + 1; // 1 to 3.5g in 0.5 steps

    if (arg === "max" || arg === "all") {
        amount = 0;
        requiredWeed = 0;
        let weedLeft = weedAvailable;

        while (weedLeft >= 1) {
            const jointCost = randomJointCost();
            if (weedLeft >= jointCost) {
                weedLeft -= jointCost;
                amount++;
                requiredWeed += jointCost;
            } else {
                break;
            }
        }

        if (amount === 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to roll any joints.`);
            return;
        }
    } else {
        amount = parseInt(arg, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .jointroll [amount|max|all]");
            return;
        }

        requiredWeed = 0;
        for (let i = 0; i < amount; i++) {
            requiredWeed += randomJointCost();
        }

        if (weedAvailable < requiredWeed) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to roll 🥖 ${amount} joints. 🥦 (${requiredWeed.toFixed(1)}g needed)`);
            return;
        }
    }

    requiredWeed = parseFloat(requiredWeed.toFixed(1));

    userWeedStashes[username] -= requiredWeed;
    userJointStashes[username] = (userJointStashes[username] || 0) + amount;
    saveWeedStashes();
    saveJointStashes();

    respondWithMessage.call(this, `🥖 ${nickname} rolled ${amount} joint${amount !== 1 ? "s" : ""} using 🥦 ${requiredWeed}g of weed.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥖🎒 `.myjoints` - Display how many joints the user has
const myjointsTriggers = [".myjoints"]; // add aliases here like ".jointbag"
if (myjointsTriggers.includes(wsmsg["text"].toLowerCase().trim())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userJointStashes[username] || 0;

    respondWithMessage.call(this, `🥖🎒 ${nickname}, you have 🥖 ${stash} joint${stash !== 1 ? "s" : ""} ready to smoke.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥖💨 `.jointsmoke [amount|max|all]` - Smoke joints and get fun responses
const jointsmokeTriggers = [".jointsmoke"]; // add aliases here like ".smokeup"
if (jointsmokeTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(/\s+/);

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .jointsmoke [amount|max|all]");
        return;
    }

    const arg = args[1].toLowerCase();
    const jointsAvailable = userJointStashes[username] || 0;
    let amount;

    if (arg === "max" || arg === "all") {
        amount = jointsAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any joints to smoke.`);
            return;
        }
    } else {
        amount = parseInt(arg, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .jointsmoke [amount|max|all]");
            return;
        }

        if (amount > jointsAvailable) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough joints. 🥖🎒 (${amount} requested, ${jointsAvailable} available)`);
            return;
        }
    }

    userJointStashes[username] -= amount;
    saveJointStashes();

    const responses = [
        `🥖💨 ${nickname} smoked ${amount} joint${amount > 1 ? 's' : ''} and is feeling chill. 😎`,
        `🥖💨 ${nickname} sparked up ${amount} joint${amount > 1 ? 's' : ''} and is now flying high. 🚀`,
        `🥖💨 ${amount} joint${amount > 1 ? 's' : ''} down! ${nickname} is baked. 😌`,
        `🥖💨 ${nickname} puffed through ${amount} joint${amount > 1 ? 's' : ''}, clouds everywhere! 🌫️`,
        `🥖💨 After ${amount} joint${amount > 1 ? 's' : ''}, ${nickname} is officially couch-locked. 🛋️`,
        `🥖💨 ${nickname} finished off ${amount} joint${amount > 1 ? 's' : ''}—time to vibe out. 🎶`,
        `🥖💨 ${nickname} blazed ${amount} joint${amount > 1 ? 's' : ''} and unlocked enlightenment mode. 🌀`,
        `🥖💨 ${nickname} toked ${amount} joint${amount > 1 ? 's' : ''} and entered another dimension. ✨`,
        `🥖💨 ${amount} joint${amount > 1 ? 's' : ''} later, ${nickname} is higher than giraffe ears. 🦒`,
        `🥖💨 After ${amount} joint${amount > 1 ? 's' : ''}, ${nickname} forgot why they even started smoking... 😵‍💫`
    ];

    respondWithMessage.call(this, responses[Math.floor(Math.random() * responses.length)]);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍃 .sesh
if (wsmsg["text"].toLowerCase() === ".sesh") {
    const totalUsers = Object.keys(userWeedStashes).length;

    if (totalUsers === 0) {
        respondWithMessage.call(this, "🤖 No one has any weed for the sesh. Weak.");
        return;
    }

    const totalWeed = Object.values(userWeedStashes).reduce((sum, grams) => sum + grams, 0);

    if (totalWeed < 3.5) {
        respondWithMessage.call(this, "🤖 Not enough weed in the stash for a sesh.");
        return;
    }

    // Determine sesh amount (3.5 - 28 grams, but not more than the total available)
    let seshAmount = Math.min(Math.floor(Math.random() * (28 - 3.5 + 1)) + 3.5, totalWeed);

    // Distribute weed consumption among users
    let consumedTotal = 0;
    let usersSmoked = [];

    while (seshAmount > 0 && Object.keys(userWeedStashes).length > 0) {
        let smokers = Object.keys(userWeedStashes).filter(user => userWeedStashes[user] > 0);
        if (smokers.length === 0) break;

        // Pick a random smoker
        let randomSmoker = smokers[Math.floor(Math.random() * smokers.length)];
        let availableWeed = userWeedStashes[randomSmoker];

        // Determine how much they contribute (between 1g and what's left to be smoked)
        let toSmoke = Math.min(Math.floor(Math.random() * (5 - 1 + 1)) + 1, availableWeed, seshAmount);

        // Deduct from stash
        userWeedStashes[randomSmoker] -= toSmoke;
        seshAmount -= toSmoke;
        consumedTotal += toSmoke;
        usersSmoked.push(`${userNicknames[randomSmoker]?.nickname || randomSmoker} (-${toSmoke}g)`);
    }

    saveWeedStashes();

    if (consumedTotal > 0) {
        respondWithMessage.call(this, `🍃 Group sesh! Smoked 🥦 ${consumedTotal} grams.`);
        respondWithMessage.call(this, `🥦🎒 Contributions: ${usersSmoked.join(", ")}`);
    } else {
        respondWithMessage.call(this, "🤖 The sesh was weak. No one had enough to spare.");
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦🎁 `.giveweed [username] [amount|max|all]` - Send weed to another user
const giveweedTriggers = [".giveweed"]; // add aliases here like ".sendweed"
if (giveweedTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .giveweed [username] [amount|max|all]");
        return;
    }

    const handle = wsmsg["handle"];
    const sender = userHandles[handle];
    const senderNickname = userNicknames[sender]?.nickname || sender || "you";
    const recipientUsername = args[1];
    const amountArg = args[2]?.toLowerCase();

    if (!sender || !userNicknames[recipientUsername]) {
        respondWithMessage.call(this, "🤖 Error: Could not find the recipient.");
        return;
    }

    const senderStash = userWeedStashes[sender] || 0;
    let amount;

    if (amountArg === "max" || amountArg === "all") {
        amount = senderStash;
        if (amount <= 0) {
            respondWithMessage.call(this, "🤖 You don't have any weed to send.");
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || senderStash < amount) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    userWeedStashes[sender] -= amount;
    userWeedStashes[recipientUsername] = (userWeedStashes[recipientUsername] || 0) + amount;
    saveWeedStashes();

    const recipientNickname = userNicknames[recipientUsername]?.nickname || recipientUsername;
    respondWithMessage.call(this, `🥦🎁 ${senderNickname} sent 🥦 ${amount}g of weed to ${recipientNickname}! Sharing is caring.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦🤏 `.stealweed [username]` - Attempt to steal weed from another user
const stealweedTriggers = [".stealweed"]; // add aliases here like ".weedrob"
if (stealweedTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    if (args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .stealweed [username]");
        return;
    }

    const handle = wsmsg["handle"];
    const thief = userHandles[handle];
    const thiefNickname = userNicknames[thief]?.nickname || thief || "you";
    const victimUsername = args[1];

    if (!thief || !userNicknames[victimUsername]) {
        respondWithMessage.call(this, "🤖 That user doesn't exist.");
        return;
    }

    const victimStash = userWeedStashes[victimUsername] || 0;
    if (victimStash < 1) {
        respondWithMessage.call(this, `🤖 ${userNicknames[victimUsername]?.nickname || victimUsername} doesn't have any weed to steal.`);
        return;
    }

    const stealAmount = Math.floor(Math.random() * 5) + 1;
    const caught = Math.random() < 0.5;

    if (caught) {
        const penalty = stealAmount * 2;
        userWeedStashes[thief] = Math.max(0, (userWeedStashes[thief] || 0) - penalty);
        saveWeedStashes();

        respondWithMessage.call(this, `🚨 ${thiefNickname} got CAUGHT trying to rob ${userNicknames[victimUsername]?.nickname || victimUsername}! Lost 🥦➖ ${penalty}g instead!`);
    } else {
        userWeedStashes[victimUsername] -= stealAmount;
        userWeedStashes[thief] = (userWeedStashes[thief] || 0) + stealAmount;
        saveWeedStashes();

        respondWithMessage.call(this, `🥦🤏 ${thiefNickname} successfully stole 🥦 ${stealAmount}g from ${userNicknames[victimUsername]?.nickname || victimUsername}!`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🏛 `.lgh` - Show the total GojiBux stored in the LGH Bank
if (wsmsg["text"].toLowerCase() === ".lgh") {
    respondWithMessage.call(this, `🏦 LGH Bank: 💵 ${lghBank.toLocaleString()} GBX`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🏦 `.wgh` - Check global stash
if (wsmsg["text"].toLowerCase() === ".wgh") {
    respondWithMessage.call(this, `🏬 WGH Dispo: 🥦 ${wghBank.toLocaleString()}g`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 📊 `.economy` - Show total economy stats, including circulation and weed prices
if (wsmsg["text"].toLowerCase() === ".economy" || wsmsg["text"].toLowerCase() === ".circulation") {
    // Calculate total GojiBux in circulation
    const totalUserBalances = Object.values(userBalances).reduce((sum, data) => sum + (data.balance || 0), 0);
    const totalOffshore = Object.values(userStashes).reduce((sum, stash) => sum + (stash || 0), 0);
    const totalGbxSupply = lghBank + totalUserBalances + totalOffshore;

    // Calculate total weed in circulation
    const totalUserWeed = Object.values(userWeedStashes).reduce((sum, stash) => sum + (stash || 0), 0);
    const totalWeedSupply = wghBank + totalUserWeed;

    // Calculate total joints in circulation
    const totalJoints = Object.values(userJointStashes).reduce((sum, stash) => sum + (stash || 0), 0);

    // Get current weed prices
    const buyPrice = weedBuyPrice.toLocaleString();
    const sellPrice = weedSellPrice.toLocaleString();

    // Send first part (GojiBux data)
    respondWithMessage.call(this,
        `📊 Total Economy Circulation (GojiBux):\n` +
        `💵 Total GojiBux: ${totalGbxSupply.toLocaleString()} GBX\n` +
        `🏦 LGH Bank Holdings: ${lghBank.toLocaleString()} GBX\n` +
        `🤑 Total User Balances: ${totalUserBalances.toLocaleString()} GBX\n` +
        `💰 Total Offshore Stash: ${totalOffshore.toLocaleString()} GBX`
    );

    // Send second part (Weed & Joints data) after 1-second delay
    setTimeout(() => {
        respondWithMessage.call(this,
            `📊 Total Economy Circulation (Weed & Joints):\n` +
            `🥦 Total Weed in Circulation: ${totalWeedSupply.toLocaleString()} g\n` +
            `🏬 WGH Dispo Holdings: ${wghBank.toLocaleString()} g\n` +
            `🎒 Total User Weed: ${totalUserWeed.toLocaleString()} g\n` +
            `🥖 Total Joints: ${totalJoints.toLocaleString()}`
        );
    }, 1000);

    // Send third part (Weed prices) after 2-second delay
    setTimeout(() => {
        respondWithMessage.call(this,
            `🥦💵 Current Weed Prices:\n` +
            `➕ Buy: ${buyPrice} GBX/g | ➖ Sell: ${sellPrice} GBX/g`
        );
    }, 2000);
}



// 🎰 `.gamble AMOUNT` or `.bet AMOUNT` - Bet GojiBux for a chance to win!
/*if (wsmsg["text"].toLowerCase().startsWith(".gamble ") || wsmsg["text"].toLowerCase().startsWith(".bet ")) {
    const args = wsmsg["text"].split(" ");
    const betInput = args[1]?.toLowerCase();
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    let betAmount;
    if (betInput === "max" || betInput === "all") {
        betAmount = userBalances[username].balance; // Bet entire balance
    } else {
        betAmount = parseInt(betInput);
    }

    if (isNaN(betAmount) || betAmount <= 0) {
        respondWithMessage.call(this, "❌ Invalid amount! Example: `.bet 500` or `.bet max` to go all in.");
        return;
    }

    if (userBalances[username].balance < betAmount) {
        respondWithMessage.call(this, `🤖 Not enough GojiBux! You only have ${userBalances[username].balance.toLocaleString()} GBX.`);
        return;
    }

    // 🎲 Adjusted gambling probabilities (Higher Wins!)
    const roll = Math.random();
    let winnings = 0;
    let lostToBank = 0;
    let resultMessage = "";

    if (roll < 0.02) { // 2% chance - JACKPOT (5x payout)
        winnings = betAmount * 4;
        resultMessage = `🎉 JACKPOT! ${nickname} turned 💵 ${betAmount.toLocaleString()} GBX into 💵➕ ${(winnings + betAmount).toLocaleString()} GBX! 🎰💰`;
    } else if (roll < 0.15) { // 13% chance - BIG WIN (3x payout)
        winnings = betAmount * 2;
        resultMessage = `🔥 BIG WIN! ${nickname} turned 💵 ${betAmount.toLocaleString()} GBX into 💵➕ ${(winnings + betAmount).toLocaleString()} GBX! 🤑`;
    } else if (roll < 0.35) { // 20% chance - Standard win (2x payout)
        winnings = betAmount;
        resultMessage = `✅ Nice win! ${nickname} doubled their bet and now has 💵➕ ${(winnings + betAmount).toLocaleString()} GBX! 💰`;
    } else if (roll < 0.50) { // 15% chance - Lose 50%
        winnings = -Math.floor(betAmount / 2);
        lostToBank = Math.abs(winnings);
        resultMessage = `😬 Small loss! ${nickname} lost half their bet. 💵➖ -${lostToBank.toLocaleString()} GBX.`;
    } else { // 50% chance - Lose everything
        winnings = -betAmount;
        lostToBank = Math.abs(winnings);
        resultMessage = `💸 Tough luck! ${nickname} lost their entire bet of 💵➖ ${betAmount.toLocaleString()} GBX. 😭`;
    }

    // Update player balance
    userBalances[username].balance += winnings;

    // Add lost money to LGH Bank
    if (lostToBank > 0) {
        lghBank += lostToBank;
        localStorage.setItem("lghBank", lghBank.toString());
    }

    saveBalances();

    // Send result message
    respondWithMessage.call(this, resultMessage);
}*/

//-----------------------------------------------------------------------------------------------------------------------------------

// ⚠️ `.clearGojiBux` - Wipe all balances & reset LGH (Admin-only)
/*if (wsmsg["text"].toLowerCase() === ".cleargojibux") {
    userBalances = {};
    lghBank = 1; // Reset LGH
    localStorage.removeItem("userBalances");
    localStorage.removeItem("lghBank");

    respondWithMessage.call(this, "🤖 All GojiBux balances and LGH Bank have been cleared.");
}*/

//-----------------------------------------------------------------------------------------------------------------------------------

// ⚠️ `.resetall` - Wipe all economy data (Admin-only)
/*if (wsmsg["text"].toLowerCase() === ".resetall") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    // Optional: Restrict to Admins (Uncomment & add admin usernames)
    if (!["Goji"].includes(username)) {
        respondWithMessage.call(this, "🚨 You don't have permission to reset the economy!");
        return;
    }

    // Reset economy data
    lghBank = 500000; // Reset LGH Bank to starting 500,000 GBX
    wghBank = 10000; // Reset WGH Bank to starting 10,000g of weed
    userBalances = {}; // Clear all user GojiBux balances
    userStashes = {}; // Clear all offshore GojiBux stashes
    userWeedStashes = {}; // Clear all user weed stashes
    userJointStashes = {}; // Clear all user joint stashes

    // Save all changes
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("wghBank", wghBank);
    localStorage.setItem("userBalances", JSON.stringify(userBalances));
    localStorage.setItem("userStashes", JSON.stringify(userStashes));
    localStorage.setItem("userWeedStashes", JSON.stringify(userWeedStashes));
    localStorage.setItem("userJointStashes", JSON.stringify(userJointStashes));

    respondWithMessage.call(this, `🚨 ${nickname} has reset the entire economy!\n💵 LGH Bank: 500,000 GBX\n🌿 WGH Bank: 10,000g\nAll user balances, stashes, and joints have been wiped.`);
}*/

// Spaget ---------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

let userSpaghettiStashes = JSON.parse(localStorage.getItem("userSpaghettiStashes")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".buyspaget")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 20;

    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[1] || "1"; // fixed from args[2] to args[1]

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max"
        ? maxAffordable
        : parseInt(rawAmount, 10);

    if (!amount || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, `🤖 Invalid amount. You can afford up to ${maxAffordable} spaget.`);
        return;
    }

    const totalCost = costPer * amount;
    if (userBalance < totalCost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 💵 ${totalCost.toLocaleString()} GBX for 🍝 ${amount} spaget.`);
        return;
    }

    userBalances[username].balance -= totalCost;
    lghBank += totalCost;
    userSpaghettiStashes[username] = (userSpaghettiStashes[username] || 0) + amount;

    saveBalances();
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    respondWithMessage.call(this, `🍝➕ ${nickname} bought 🍝 ${amount} SPG for 💵 ${totalCost.toLocaleString()} GBX.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍝 `.my spaget` - Display user's spaghetti stash
if (wsmsg["text"].toLowerCase() === ".myspaget") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userSpaghettiStashes[username] || 0;

    respondWithMessage.call(this, `🍝🎒 ${nickname}, you have ${stash} SPG.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍝🎁 `.givespaget [username] [amount|max|all]` - Send spaghetti to another user
const givespagetTriggers = [".givespaget"]; // add aliases here like ".sendspag"
if (givespagetTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .givespaget [username] [amount|max|all]");
        return;
    }

    const handle = wsmsg["handle"];
    const sender = userHandles[handle];
    const senderNickname = userNicknames[sender]?.nickname || sender || "you";
    const recipientUsername = args[1];
    const amountArg = args[2]?.toLowerCase();
    const senderStash = userSpaghettiStashes[sender] || 0;

    if (!sender || !userNicknames[recipientUsername]) {
        respondWithMessage.call(this, "🤖 Error: Could not find the recipient.");
        return;
    }

    let amount;
    if (amountArg === "max" || amountArg === "all") {
        amount = senderStash;
        if (amount <= 0) {
            respondWithMessage.call(this, "🤖 You don't have any SPG to give.");
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || senderStash < amount) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    userSpaghettiStashes[sender] -= amount;
    userSpaghettiStashes[recipientUsername] = (userSpaghettiStashes[recipientUsername] || 0) + amount;
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    const recipientNickname = userNicknames[recipientUsername]?.nickname || recipientUsername;
    respondWithMessage.call(this, `🍝🎁 ${senderNickname} gave 🍝 ${amount} SPG to ${recipientNickname}! That's amore~`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍝🤏 `.stealspaget [username]` - Attempt to steal spaghetti from another user
const stealspagetTriggers = [".stealspaget"]; // add aliases here like ".pastaheist"
if (stealspagetTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    if (args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .stealspaget [username]");
        return;
    }

    const handle = wsmsg["handle"];
    const thief = userHandles[handle];
    const thiefNickname = userNicknames[thief]?.nickname || thief;
    const victimInput = args[1].toLowerCase();
    const victim = Object.keys(userSpaghettiStashes).find(user => user.toLowerCase() === victimInput);

    if (!victim) {
        respondWithMessage.call(this, "🤖 That user doesn't exist or has no spaghetti.");
        return;
    }

    if ((userSpaghettiStashes[victim] || 0) < 1) {
        respondWithMessage.call(this, `🤖 ${userNicknames[victim]?.nickname || victim} doesn't have any spaghetti to steal.`);
        return;
    }

    const stealAmount = Math.floor(Math.random() * 3) + 1;
    const caught = Math.random() < 0.5;

    if (caught) {
        userSpaghettiStashes[thief] = Math.max(0, (userSpaghettiStashes[thief] || 0) - stealAmount);
        localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
        respondWithMessage.call(this, `🚨 ${thiefNickname} got CAUGHT trying to steal from ${userNicknames[victim]?.nickname || victim}! Lost 🍝 ${stealAmount} SPG instead!`);
    } else {
        userSpaghettiStashes[victim] -= stealAmount;
        userSpaghettiStashes[thief] = (userSpaghettiStashes[thief] || 0) + stealAmount;
        localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
        respondWithMessage.call(this, `🍝🤏 ${thiefNickname} successfully stole 🍝 ${stealAmount} SPG from ${userNicknames[victim]?.nickname || victim}!`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍝🍽 `.eatspaget [amount|max|all]` - Eat some spaghetti!
const eatspagetTriggers = [".eatspaget"]; // add aliases here like ".nomspag"
if (eatspagetTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(/\s+/);

    if (!username || args.length < 2) {
        setTimeout(() => {
            respondWithMessage.call(this, "🤖 Usage: .eatspaget [amount|max|all]");
        }, 1000);
        return;
    }

    const stash = userSpaghettiStashes[username] || 0;
    const arg = args[1].toLowerCase();
    let amount;

    if (arg === "max" || arg === "all") {
        amount = stash;
    } else {
        amount = parseInt(arg, 10);
        if (isNaN(amount) || amount <= 0) {
            setTimeout(() => {
                respondWithMessage.call(this, "🤖 Invalid amount. Try .eatspaget [amount|max|all]");
            }, 1000);
            return;
        }
    }

    if (amount > stash) {
        setTimeout(() => {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough spaghetti to eat!`);
        }, 1000);
        return;
    }

    userSpaghettiStashes[username] -= amount;
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    const remaining = userSpaghettiStashes[username];

    const messages = [
        `🍽️ ${nickname} just gobbled up 🍝 ${amount} spaget! Delicious!`,
        `🍽️ ${nickname} twirled up 🍝 ${amount} spaget and devoured it!`,
        `🍽️ ${nickname} savored every bite of 🍝 ${amount} spaget! Mangia!`,
        `🍽️ ${nickname} slurped up 🍝 ${amount} spaget like a true pasta master!`,
        `🍽️ ${nickname} just inhaled 🍝 ${amount} spaget! Somebody stop them!`
    ];

    const response = `${messages[Math.floor(Math.random() * messages.length)]}\nYou have 🍝 ${remaining} spaget left.`;

    setTimeout(() => {
        respondWithMessage.call(this, response);
    }, 1000);
}

// Pixxa ----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 🍕 Global Pizza Storage (Per-user)
let userPizzaStashes = JSON.parse(localStorage.getItem("userPizzaStashes")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍕 Last Pizza Claim Time (Per-user)
let lastPizzaClaim = JSON.parse(localStorage.getItem("lastPizzaClaim")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".buypizza")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 10;

    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[1] || "1"; // fixed from args[2] to args[1]

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max"
        ? maxAffordable
        : parseInt(rawAmount, 10);

    if (!amount || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, `🤖 Invalid amount. You can afford up to 🍕 ${maxAffordable} pizza.`);
        return;
    }

    const totalCost = costPer * amount;
    if (userBalance < totalCost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 💵 ${totalCost.toLocaleString()} GBX for 🍕 ${amount} pizza.`);
        return;
    }

    userBalances[username].balance -= totalCost;
    lghBank += totalCost;
    userPizzaStashes[username] = (userPizzaStashes[username] || 0) + amount;

    saveBalances();
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

    respondWithMessage.call(this, `🍕➕ ${nickname} bought 🍕 ${amount} pizza for 💵 ${totalCost.toLocaleString()} GBX.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍕🎒 `.my pizza` - Display user's pizza stash
if (wsmsg["text"].toLowerCase() === ".mypizza") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userPizzaStashes[username] || 0;

    respondWithMessage.call(this, `🍕🎒 ${nickname}, you have 🍕 ${stash} pizza.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍕🎁 `.givepizza [username] [amount|max|all]` - Send pizza to another user
const givepizzaTriggers = [".givepizza"]; // add aliases here like ".sendpizza"
if (givepizzaTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .givepizza [username] [amount|max|all]");
        return;
    }

    const handle = wsmsg["handle"];
    const sender = userHandles[handle];
    const senderNickname = userNicknames[sender]?.nickname || sender || "you";
    const recipientUsername = args[1];
    const amountArg = args[2]?.toLowerCase();
    const senderStash = userPizzaStashes[sender] || 0;

    if (!sender || !userNicknames[recipientUsername]) {
        respondWithMessage.call(this, "🤖 Error: Could not find the recipient.");
        return;
    }

    let amount;
    if (amountArg === "max" || amountArg === "all") {
        amount = senderStash;
        if (amount <= 0) {
            respondWithMessage.call(this, "🤖 You don't have any 🍕 pizza to give.");
            return;
        }
    } else {
        amount = parseInt(amountArg, 10);
        if (isNaN(amount) || amount <= 0 || senderStash < amount) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    userPizzaStashes[sender] -= amount;
    userPizzaStashes[recipientUsername] = (userPizzaStashes[recipientUsername] || 0) + amount;
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

    const recipientNickname = userNicknames[recipientUsername]?.nickname || recipientUsername;
    respondWithMessage.call(this, `🍕🎁 ${senderNickname} gave 🍕 ${amount} pizza to ${recipientNickname}! Sharing is caring!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍕🍽️ `.eatpizza [amount|max|all]` - Eat some pizza from your stash
const eatpizzaTriggers = [".eatpizza"]; // add aliases here like ".nompizza"
if (eatpizzaTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].trim().split(/\s+/);

    if (!username || args.length < 2) {
        setTimeout(() => {
            respondWithMessage.call(this, "🤖 Usage: .eatpizza [amount|max|all]");
        }, 1000);
        return;
    }

    const stash = userPizzaStashes[username] || 0;
    const arg = args[1].toLowerCase();
    let amount;

    if (arg === "max" || arg === "all") {
        amount = stash;
    } else {
        amount = parseInt(arg, 10);
        if (isNaN(amount) || amount <= 0) {
            setTimeout(() => {
                respondWithMessage.call(this, "🤖 Invalid amount. Try .eatpizza [amount|max|all]");
            }, 1000);
            return;
        }
    }

    if (amount > stash) {
        setTimeout(() => {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough 🍕 pizza to eat!`);
        }, 1000);
        return;
    }

    userPizzaStashes[username] -= amount;
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

    const remaining = userPizzaStashes[username];

    const messages = [
        `🍽️ ${nickname} just devoured 🍕 ${amount} pizza! Cheesy goodness!`,
        `🍽️ ${nickname} inhaled 🍕 ${amount} pizza! Hope you saved some for the rest of us!`,
        `🍽️ ${nickname} just destroyed 🍕 ${amount} pizza like a true pizza warrior!`,
        `🍽️ ${nickname} demolished 🍕 ${amount} pizza in record time!`,
        `🍽️ ${nickname} savored every bite of 🍕 ${amount} pixxa! Buon appetito!`
    ];

    const response = `${messages[Math.floor(Math.random() * messages.length)]}\nYou have 🍕 ${remaining} pizza left.`;

    setTimeout(() => {
        respondWithMessage.call(this, response);
    }, 1000);
}

// Cookies --------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 🍪 Global Cookie Storage (Per-user)
let userCookieStashes = JSON.parse(localStorage.getItem("userCookieStashes")) || {};
let lastCookieClaim = JSON.parse(localStorage.getItem("lastCookieClaim")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 🍪 `.cookie` - Grab some cookies with a short cooldown (7s) and fun randomized flavor text
const cookieTriggers = [".cookie", ".getcookie", ".crumbs", ".snacktime", ".cookiepls"]; // add/remove aliases freely
if (cookieTriggers.includes(wsmsg["text"].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const now = Date.now();
    const cooldown = 7 * 1000; // 7-second cooldown because cookies are FASTER

    if (!username) {
        respondWithMessage.call(this, "🍪 Error: Your cookie jar is missing.");
        return;
    }

    if (lastCookieClaim[username] && now - lastCookieClaim[username] < cooldown) {
        const remaining = ((cooldown - (now - lastCookieClaim[username])) / 1000).toFixed(1);
        respondWithMessage.call(this, `⏳ ${nickname}, cool the crumbs! Wait ${remaining}s for more cookies.`);
        return;
    }

    lastCookieClaim[username] = now;
    localStorage.setItem("lastCookieClaim", JSON.stringify(lastCookieClaim));

    const earnedCookies = Math.floor(Math.random() * 5) + 1;
    userCookieStashes[username] = (userCookieStashes[username] || 0) + earnedCookies;
    localStorage.setItem("userCookieStashes", JSON.stringify(userCookieStashes));

    const messages = [
        `🍪➕ ${nickname} caught 🍪 ${earnedCookies} cookies falling from the sky! Gravity? Never heard of it. 🌎`,
        `🍪➕ ${nickname} stole 🍪 ${earnedCookies} cookies from a raccoon wizard. They were enchanted... probably. 👀`,
        `🍪➕ ${nickname} ate 🍪 ${earnedCookies} cookies, wrapper and all. 😵`,
        `🍪➕ ${nickname} found 🍪 ${earnedCookies} cookies swirling in a cookie vortex. Don’t question it. 🌀`,
        `🍪➕ ${nickname} traded a ghost a secret for 🍪 ${earnedCookies} cookies. 👻`,
        `🍪➕ ${nickname} baked 🍪 ${earnedCookies} cookies with *questionable* ingredients. Delicious though. 🥴`,
        `🍪➕ ${nickname} summoned 🍪 ${earnedCookies} cookies using ancient crumbcraft. ✨`
    ];

    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 👨‍🍳 Last Cook Claim Time (Per-user)
let lastCookClaim = JSON.parse(localStorage.getItem("lastCookClaim")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".cook") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const now = Date.now();
    const cooldown = 30 * 60 * 1000; // 30-minute cooldown

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // Check cooldown
    if (lastCookClaim[username] && now - lastCookClaim[username] < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastCookClaim[username])) / 60000);
        respondWithMessage.call(this, `⏳ ${nickname}, your kitchen is on cooldown! You can cook again in ${remaining} minutes.`);
        return;
    }

    // Earn 1-20 SPG and 1-20 PZA
    const earnedSpaghetti = Math.floor(Math.random() * 20) + 1;
    const earnedPizza = Math.floor(Math.random() * 20) + 1;
    userSpaghettiStashes[username] = (userSpaghettiStashes[username] || 0) + earnedSpaghetti;
    userPizzaStashes[username] = (userPizzaStashes[username] || 0) + earnedPizza;
    lastCookClaim[username] = now;

    // Save
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));
    localStorage.setItem("lastCookClaim", JSON.stringify(lastCookClaim));

    // 👨‍🍳 Funny Messages
    const messages = [
        `👨‍🍳 ${nickname} just cooked up a feast! 🍝 +${earnedSpaghetti} & 🍕 +${earnedPizza}!`,
        `👨‍🍳 ${nickname} whipped up a delicious meal! 🍝 +${earnedSpaghetti} & 🍕 +${earnedPizza}!`,
        `👨‍🍳 ${nickname} went full Italian! 🍝 +${earnedSpaghetti} & 🍕 +${earnedPizza}!`,
        `👨‍🍳 ${nickname} got a surprise delivery! 🍝 +${earnedSpaghetti} & 🍕 +${earnedPizza}!`,
        `👨‍🍳 ${nickname} raided the Olive Garden kitchen! 🍝 +${earnedSpaghetti} & 🍕 +${earnedPizza}!`
    ];
    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}

//-----------------------------------------------------------------------------------------------------------------------------------

//FORG
let userFrogCounts = JSON.parse(localStorage.getItem("userFrogCounts") || "{}");

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".buyfrog")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 1_000_000;

    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[1] || "1"; // fixed from args[2] to args[1]

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max"
        ? maxAffordable
        : parseInt(rawAmount, 10);

    if (!amount || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, `🤖 Invalid amount. You can afford up to 🐸 ${maxAffordable} frog${maxAffordable !== 1 ? "s" : ""}.`);
        return;
    }

    const totalCost = costPer * amount;
    if (userBalance < totalCost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 💵 ${totalCost.toLocaleString()} GBX for 🐸 ${amount} frog${amount !== 1 ? "s" : ""}.`);
        return;
    }

    userBalances[username].balance -= totalCost;
    userFrogCounts[username] = (userFrogCounts[username] || 0) + amount;

    saveBalances();
    localStorage.setItem("userFrogCounts", JSON.stringify(userFrogCounts));

    const frogMessages = [
        `🐸➕ ${nickname} spent 💵 ${totalCost.toLocaleString()} GBX and got 🐸 ${amount} frog${amount !== 1 ? "s" : ""}. No refunds.`,
        `🐸➕ ${nickname} flushed 💵 ${totalCost.toLocaleString()} GBX into the pond and caught 🐸 ${amount} frog${amount !== 1 ? "s" : ""}.`,
        `🐸➕ ${nickname} is now the proud, broke owner of 🐸 ${amount.toLocaleString()} frog${amount !== 1 ? "s" : ""}. Legendary.`
    ];
    respondWithMessage.call(this, frogMessages[Math.floor(Math.random() * frogMessages.length)]);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🐸🎒 `.my frog` - Display user's frog count
if (wsmsg["text"].toLowerCase() === ".myfrog") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const frogCount = userFrogCounts[username] || 0;

    if (frogCount === 0) {
        respondWithMessage.call(this, `🐸🎒 ${nickname}, you have no 🐸 frogs. Tragic.`);
    } else {
        respondWithMessage.call(this, `🐸🎒 ${nickname}, you own 🐸 ${frogCount.toLocaleString()} frog${frogCount !== 1 ? "s" : ""}. Ribbit.`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

let userPotatoCounts = JSON.parse(localStorage.getItem("userPotatoCounts") || "{}");

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".buypotato")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 1;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[1] || "1";

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max"
        ? maxAffordable
        : parseInt(rawAmount, 10);

    if (!amount || amount <= 0) {
        respondWithMessage.call(this, `🤖 Invalid amount. You can afford up to 🥔 ${maxAffordable} potato${maxAffordable !== 1 ? "es" : ""}.`);
        return;
    }

    const totalCost = costPer * amount;
    if (userBalance < totalCost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 💵 ${totalCost} GBX for 🥔 ${amount} potato${amount !== 1 ? "es" : ""}.`);
        return;
    }

    userBalances[username].balance -= totalCost;
    lghBank += totalCost;

    // 🥔 Track potato count
    userPotatoCounts[username] = (userPotatoCounts[username] || 0) + amount;

    saveBalances();
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("userPotatoCounts", JSON.stringify(userPotatoCounts));

    const messages = [
        `🥔 ${nickname} bought 🥔 ${amount} potato${amount !== 1 ? "es" : ""} for 💵 ${totalCost.toLocaleString()} GBX.`,
        `🥔 ${nickname} tossed 💵 ${totalCost} GBX into the dirt and got 🥔 ${amount} potato${amount !== 1 ? "es" : ""}.`,
        `🥔 ${nickname} just starchy-flexed 💵 ${totalCost} GBX on 🥔 ${amount} potato${amount !== 1 ? "es" : ""}. No regrets.`
    ];
    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥔🎒 `.mypotato` - Display user's potato count
if (wsmsg["text"].toLowerCase() === ".mypotato") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const count = userPotatoCounts[username] || 0;

    respondWithMessage.call(this, `🥔🎒 ${nickname}, you've bought 🥔 ${count.toLocaleString()} potato${count !== 1 ? "es" : ""}.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.bankrob`
let lastBankRobTime = JSON.parse(localStorage.getItem("lastBankRobTime")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 `.bankrob` - Attempt to rob the LGH Bank (55-75% Success, Balanced Failures)
if (wsmsg["text"].toLowerCase() === ".bankrob") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // Cooldown check (2 minutes)
    const now = Date.now();
    const lastRobbery = lastBankRobTime[username] || 0;
    const cooldownTime = 2 * 60 * 1000; // 2 minutes in milliseconds

    if (now - lastRobbery < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - (now - lastRobbery)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you must wait ${remaining} seconds before attempting another bank robbery.`);
        return;
    }

    if (lghBank < 100) {
        respondWithMessage.call(this, "🏦 LGH Bank is too empty to rob!");
        return;
    }

    const userBalance = userBalances[username]?.balance || 1;
    const userWeed = userWeedStashes[username] || 0;
    const stashedGBX = userStashes[username] || 0;

    // Require at least 250 GBX to attempt robbery
    if (userBalance < 250) {
        respondWithMessage.call(this, "❌ You need at least 💵 250 GBX to attempt a robbery! Gotta buy supplies.");
        return;
    }

    // Supply costs (Base 250 + 3-10% of user balance)
    const supplyCost = Math.min(userBalance, 250 + Math.floor(userBalance * (Math.random() * 0.07 + 0.03)));
    userBalances[username].balance -= supplyCost;
    saveBalances();

    // Success rate randomized between 55% and 75%
    let success = Math.random() < (Math.random() * 0.20 + 0.55);

    if (success) {
        // Successful robbery: Steal 15-30% of LGH Bank, but capped at 50% of the bank's balance
        const maxSteal = Math.floor(lghBank * 0.30);
        const stolenAmount = Math.min(Math.floor(lghBank * (Math.random() * 0.15 + 0.15)), maxSteal, Math.floor(lghBank * 0.50));

        lghBank -= stolenAmount;
        userBalances[username].balance = (userBalances[username].balance || 1) + stolenAmount;
        saveBalances();
        localStorage.setItem("lghBank", lghBank);

        // Save cooldown
        lastBankRobTime[username] = now;
        localStorage.setItem("lastBankRobTime", JSON.stringify(lastBankRobTime));

        respondWithMessage.call(this, `🏦🤏 ${nickname} pulled off a successful heist and stole 💵 ${stolenAmount.toLocaleString()} GBX!\n🏦 LGH Bank now holds 💵 ${lghBank.toLocaleString()} GBX.\n🧰 Supplies used: 💵 ${supplyCost.toLocaleString()} GBX.`);
    } else {
        // Failed robbery: Lose 20-50% of GBX, but capped at 50% of balance
        let lossAmount = Math.floor(userBalance * (Math.random() * 0.30 + 0.20));
        lossAmount = Math.min(lossAmount, Math.floor(userBalance * 0.50)); // Cap loss at 50% of balance

        userBalances[username].balance = Math.max(1, userBalance - lossAmount);

        // 50% of lost GBX goes to LGH Bank
        const bankCut = Math.floor(lossAmount * 0.5);
        lghBank += bankCut;

        // 50% of lost GBX is shared among active players
        const sharedAmount = lossAmount - bankCut;
        const activePlayers = Object.keys(userBalances).filter(user => user !== username && userBalances[user]?.balance > 0);

        if (activePlayers.length > 0) {
            const splitAmount = Math.floor(sharedAmount / activePlayers.length);
            activePlayers.forEach(user => {
                userBalances[user].balance = (userBalances[user].balance || 1) + splitAmount;
            });
        }

        // Lose 20-40% of weed stash instead of total loss
        let weedBurned = Math.floor(userWeed * (Math.random() * 0.20 + 0.20));
        userWeedStashes[username] = Math.max(0, userWeed - weedBurned);

        // Lose 2-8% of stashed GBX instead of 5-15%
        const stashedLoss = Math.floor(stashedGBX * (Math.random() * 0.06 + 0.02));
        userStashes[username] = Math.max(0, stashedGBX - stashedLoss);
        saveUserStashes();

        // Save cooldown
        lastBankRobTime[username] = now;
        localStorage.setItem("lastBankRobTime", JSON.stringify(lastBankRobTime));

        // Save changes
        saveBalances();
        saveWeedStashes();
        localStorage.setItem("lghBank", lghBank);

        let failureMessage = `🚔 ${nickname} got caught robbing LGH Bank and lost 💵 ${lossAmount.toLocaleString()} GBX!\n🧰 Supplies lost: 💵 ${supplyCost.toLocaleString()} GBX.`;
        if (weedBurned > 0) {
            failureMessage += `\n🔥 The cops confiscated 🥦 ${weedBurned.toLocaleString()} grams of their weed!`;
        }
        if (stashedLoss > 0) {
            failureMessage += `\n💸 ${stashedLoss.toLocaleString()} GBX mysteriously vanished from their stash...`;
        }
        if (activePlayers.length > 0) {
            failureMessage += `\n💵🎁 ${sharedAmount.toLocaleString()} GBX was split among ${activePlayers.length} other players!`;
        }
        if (userBalances[username].balance === 1) {
            failureMessage += `\n💀 ${nickname} barely escaped with a single GBX left! Rough night...`;
        }

        respondWithMessage.call(this, failureMessage);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.weedrob`
let lastWeedRobTime = JSON.parse(localStorage.getItem("lastWeedRobTime")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦🤏 `.weedrob` - Attempt to rob the WGH Stash (60-80% Success, Weed Risks)
if (wsmsg["text"].toLowerCase() === ".weedrob") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const now = Date.now();
    const lastRobbery = lastWeedRobTime[username] || 0;
    const cooldownTime = 2 * 60 * 1000; // 2 minutes

    if (now - lastRobbery < cooldownTime) {
        const remaining = Math.ceil((cooldownTime - (now - lastRobbery)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you gotta lay low for ${remaining} seconds before trying another weed heist.`);
        return;
    }

    const userWeed = userWeedStashes[username] || 0;
    const userBalance = userBalances[username]?.balance || 1;
    const stashedGBX = userStashes[username] || 0;

    if (userWeed < 100) {
        respondWithMessage.call(this, `❌ ${nickname}, you need at least 🥦 100g of weed to fund your operation.`);
        return;
    }

    if (wghBank < 500) {
        respondWithMessage.call(this, "🚫 WGH stash is too low to be worth robbing right now.");
        return;
    }

    // Cost: 100g + 5-12% of their stash
    const weedCost = Math.min(userWeed, 100 + Math.floor(userWeed * (Math.random() * 0.07 + 0.05)));
    userWeedStashes[username] -= weedCost;
    saveWeedStashes();

    // Success: 60–80%
    const success = Math.random() < (Math.random() * 0.20 + 0.60);

    if (success) {
        const maxSteal = Math.floor(wghBank * 0.30);
        const stolenGrams = Math.min(Math.floor(wghBank * (Math.random() * 0.15 + 0.15)), maxSteal);
        userWeedStashes[username] = (userWeedStashes[username] || 0) + stolenGrams;
        wghBank -= stolenGrams;
        saveWeedStashes();
        saveWGHBank();

        lastWeedRobTime[username] = now;
        localStorage.setItem("lastWeedRobTime", JSON.stringify(lastWeedRobTime));

        respondWithMessage.call(this, `🥦🤏 ${nickname} pulled off a stealthy weed heist and stole 🥦 ${stolenGrams.toLocaleString()} grams!\n🧰 Operation cost: 🥦 ${weedCost.toLocaleString()}g\n🏬 WGH now holds 🥦 ${wghBank.toLocaleString()}g.`);
    } else {
        const lostWeed = Math.floor(userWeed * (Math.random() * 0.25 + 0.15));
        userWeedStashes[username] = Math.max(0, userWeed - lostWeed);

        const stashLoss = Math.floor(stashedGBX * (Math.random() * 0.05 + 0.02));
        userStashes[username] = Math.max(0, stashedGBX - stashLoss);
        saveUserStashes();

        const bustedToWGH = Math.floor(lostWeed * 0.4);
        wghBank += bustedToWGH;
        saveWeedStashes();
        saveWGHBank();

        lastWeedRobTime[username] = now;
        localStorage.setItem("lastWeedRobTime", JSON.stringify(lastWeedRobTime));

        let failMsg = `🕵️‍♂️ ${nickname} got busted trying to rob the weed stash and lost 🥦 ${lostWeed.toLocaleString()}g!\n🧰 Operation cost: 🥦 ${weedCost.toLocaleString()}g.`;
        if (stashLoss > 0) failMsg += `\n💸 💰 ${stashLoss.toLocaleString()} GBX also vanished from their hidden stash...`;
        if (userWeedStashes[username] === 0) failMsg += `\n💀 ${nickname} has no weed left. Back to the grind...`;

        respondWithMessage.call(this, failMsg);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.bankheist`
let lastBankHeistTime = JSON.parse(localStorage.getItem("lastBankHeistTime")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".bankheist") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) return respondWithMessage.call(this, "🤖 Error: Could not identify your username.");

    const now = Date.now();
    const lastHeist = lastBankHeistTime[username] || 0;
    const cooldown = 10 * 60 * 1000; // 10 minutes

    if (now - lastHeist < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastHeist)) / 1000);
        return respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${remaining} seconds before another BANK HEIST.`);
    }

    const userBalance = userBalances[username]?.balance || 0;
    if (userBalance < 1000) {
        return respondWithMessage.call(this, `❌ ${nickname}, you need at least 💵 1000 GBX to plan a bank heist!`);
    }

    if (lghBank < 1000) {
        return respondWithMessage.call(this, "🏦 LGH Bank doesn't have enough money to make this heist worth it.");
    }

    // Cost: 1000 + 10% of user balance
    const cost = Math.min(userBalance, 1000 + Math.floor(userBalance * 0.1));
    userBalances[username].balance -= cost;
    saveBalances();

    const success = Math.random() < (Math.random() * 0.20 + 0.40); // 40–60%

    if (success) {
        const stealAmount = Math.floor(lghBank * (Math.random() * 0.2 + 0.4)); // 40–60%
        lghBank -= stealAmount;
        userBalances[username].balance += stealAmount;
        lastBankHeistTime[username] = now;
        saveBalances();
        localStorage.setItem("lghBank", lghBank);
        localStorage.setItem("lastBankHeistTime", JSON.stringify(lastBankHeistTime));

        return respondWithMessage.call(this, `🏦🚛 ${nickname} pulled off a MASSIVE BANK HEIST and stole 💵 ${stealAmount.toLocaleString()} GBX!\n🧰 Setup cost: 💵 ${cost.toLocaleString()} GBX\n🏦 LGH Bank now holds 💵 ${lghBank.toLocaleString()} GBX.`);
    } else {
        const loss = Math.floor(userBalance * 0.5);
        const stashLoss = Math.floor((userStashes[username] || 0) * 0.2);
        userBalances[username].balance = Math.max(1, userBalance - loss);
        userStashes[username] = Math.max(0, (userStashes[username] || 0) - stashLoss);
        lghBank += Math.floor(loss * 0.5);
        lastBankHeistTime[username] = now;
        saveBalances();
        saveUserStashes();
        localStorage.setItem("lghBank", lghBank);
        localStorage.setItem("lastBankHeistTime", JSON.stringify(lastBankHeistTime));

        let msg = `🚔 ${nickname} FAILED the bank heist and lost 💵 ${loss.toLocaleString()} GBX!`;
        if (stashLoss > 0) msg += `\n💸 💰 ${stashLoss.toLocaleString()} GBX was seized from their offshore stash!`;
        return respondWithMessage.call(this, msg);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.weedheist`
let lastWeedHeistTime = JSON.parse(localStorage.getItem("lastWeedHeistTime")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".weedheist") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) return respondWithMessage.call(this, "🤖 Error: Could not identify your username.");

    const now = Date.now();
    const lastHeist = lastWeedHeistTime[username] || 0;
    const cooldown = 10 * 60 * 1000; // 10 minutes

    if (now - lastHeist < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastHeist)) / 1000);
        return respondWithMessage.call(this, `⏳ ${nickname}, chill out. Wait ${remaining} seconds before another WEED HEIST.`);
    }

    const userWeed = userWeedStashes[username] || 0;
    if (userWeed < 1000) {
        return respondWithMessage.call(this, `❌ ${nickname}, you need at least 🥦 1000g of weed to organize a proper weed heist!`);
    }

    if (wghBank < 2000) {
        return respondWithMessage.call(this, "🚫 Not enough stash in WGH for a big score.");
    }

    const cost = 1000 + Math.floor(userWeed * 0.1);
    userWeedStashes[username] -= cost;
    saveWeedStashes();

    const success = Math.random() < (Math.random() * 0.2 + 0.4); // 40–60%

    if (success) {
        const stolenWeed = Math.floor(wghBank * (Math.random() * 0.2 + 0.4)); // 40–60%
        userWeedStashes[username] += stolenWeed;
        wghBank -= stolenWeed;
        lastWeedHeistTime[username] = now;
        saveWeedStashes();
        saveWGHBank();
        localStorage.setItem("lastWeedHeistTime", JSON.stringify(lastWeedHeistTime));

        return respondWithMessage.call(this, `🏬🚛 ${nickname} successfully pulled off a MASSIVE WEED HEIST and stole 🥦 ${stolenWeed.toLocaleString()} grams!\n🧰 Cost: 🥦 ${cost.toLocaleString()}g\n🏬 WGH now holds 🥦 ${wghBank.toLocaleString()}g.`);
    } else {
        const seizedWeed = Math.floor(userWeed * 0.5);
        const seizedCash = Math.floor((userBalances[username]?.balance || 0) * 0.2);
        userWeedStashes[username] = Math.max(0, userWeed - seizedWeed);
        userBalances[username].balance = Math.max(1, userBalances[username].balance - seizedCash);
        wghBank += Math.floor(seizedWeed * 0.4);
        saveWeedStashes();
        saveBalances();
        saveWGHBank();
        lastWeedHeistTime[username] = now;
        localStorage.setItem("lastWeedHeistTime", JSON.stringify(lastWeedHeistTime));

        let msg = `🚨 ${nickname}'s weed heist FAILED and they lost 🥦 ${seizedWeed.toLocaleString()}g of weed!`;
        if (seizedCash > 0) msg += `\n💸 💵 ${seizedCash.toLocaleString()} GBX was confiscated by the DEA!`;
        return respondWithMessage.call(this, msg);
    }
}

// DUMP -----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".dumpall") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    let dumpedBux = userBalances[username]?.balance || 0;
    let dumpedWeed = userWeedStashes[username] || 0;
    let dumpedSpaghetti = userSpaghettiStashes[username] || 0;

    if (dumpedBux === 0 && dumpedWeed === 0 && dumpedSpaghetti === 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you have nothing to dump!`);
        return;
    }

    // Dump GojiBux
    if (dumpedBux > 0) {
        lghBank += dumpedBux;
        userBalances[username].balance = 0;
    }

    // Dump Weed
    if (dumpedWeed > 0) {
        wghBank += dumpedWeed;
        userWeedStashes[username] = 0;
    }

    // Dump Spaghetti
    if (dumpedSpaghetti > 0) {
        userSpaghettiStashes[username] = 0; // No global SPG storage, it just disappears
    }

    // Save all updated storages
    saveBalances();
    saveWeedStashes();
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("wghBank", wghBank);

    // Generate Random Funny Messages
    let messages = [`🗑️ ${nickname} just dumped everything they had!`];

    if (dumpedBux > 0) messages.push(`🏦🎁 ${nickname} donated 💵 ${dumpedBux.toLocaleString()} GBX to 🏦 LGH Bank!`);
    if (dumpedWeed > 0) messages.push(`🏬🎁 ${nickname} threw 🥦 ${dumpedWeed.toLocaleString()} grams of weed into WGH Dispo!`);
    if (dumpedSpaghetti > 0) messages.push(`🗑 ${nickname} discarded 🍝 ${dumpedSpaghetti.toLocaleString()} spaget! RIP spaget...`);

    // Send messages with a slight delay for effect
    messages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".dumpbux") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    let dumpedBux = userBalances[username]?.balance || 0;

    if (dumpedBux === 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you have no GojiBux to dump!`);
        return;
    }

    lghBank += dumpedBux;
    userBalances[username].balance = 0;

    saveBalances();
    localStorage.setItem("lghBank", lghBank);

    respondWithMessage.call(this, `🏦🎁 ${nickname} donated 💵 ${dumpedBux.toLocaleString()} GBX to 🏦 LGH Bank!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".dumpweed") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    let dumpedWeed = userWeedStashes[username] || 0;

    if (dumpedWeed === 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you have no weed to dump!`);
        return;
    }

    wghBank += dumpedWeed;
    userWeedStashes[username] = 0;

    saveWeedStashes();
    localStorage.setItem("wghBank", wghBank);

    respondWithMessage.call(this, `🏬🎁 ${nickname} threw 🥦 ${dumpedWeed.toLocaleString()} grams of weed into 🏬 WGH Dispo!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".dumpspaget") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    let dumpedSpaghetti = userSpaghettiStashes[username] || 0;

    if (dumpedSpaghetti === 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you have no spaget to dump!`);
        return;
    }

    userSpaghettiStashes[username] = 0;
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    respondWithMessage.call(this, `🗑 ${nickname} discarded 🍝 ${dumpedSpaghetti.toLocaleString()} spaget! RIP spaget...`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".extract")) {
    const args = wsmsg["text"].split(" ");

    if (args.length < 3) {
        respondWithMessage.call(this, "🤔 How much are you trying to extract? Try .extract hash X");
        return;
    }

    const extractType = args[1].toLowerCase();
    const amount = parseFloat(args[2]);

    if (isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🚫 Invalid amount! Try .extract hash X where X is how much weed you want to process.");
        return;
    }

    const extractRates = {
        "hash": { weedPerGram: 10, gbxPerWeed: 1 }
    };

    if (!(extractType in extractRates)) {
        respondWithMessage.call(this, `🤨 I don't know how to extract ${extractType} yet! Available types: hash`);
        return;
    }

    const handle = wsmsg["handle"];
    const user = userHandles[handle];  // Now matching .jointroll and .myweed

    if (!user) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (!userWeedStashes[user]) {
        userWeedStashes[user] = 0;
    }

    const weedStash = userWeedStashes[user];
    const userGBX = userBalances[user]?.balance || 0;

    console.log(`[DEBUG] Extracting for: ${user}, Weed Stash: ${weedStash}g, GBX: ${userGBX}`);

    const { weedPerGram, gbxPerWeed } = extractRates[extractType];
    const maxExtractable = Math.floor(weedStash / weedPerGram);
    const extractAmount = Math.min(amount, maxExtractable);
    const weedNeeded = extractAmount * weedPerGram;
    const gbxCost = Math.max(weedNeeded * gbxPerWeed, 1);

    if (extractAmount <= 0) {
        respondWithMessage.call(this, `🚫 You don't have enough weed to extract at least 1g of hash! You need at least ${weedPerGram}g.`);
        return;
    }

    if (weedStash < weedNeeded) {
        respondWithMessage.call(this, `🚫 You don’t have that much weed to extract! You currently have ${weedStash.toLocaleString()}g.`);
        return;
    }

    if (userGBX < gbxCost) {
        respondWithMessage.call(this, `💸 You’re too broke to extract that much! You need ${gbxCost.toLocaleString()} GBX but only have ${userGBX.toLocaleString()} GBX.`);
        return;
    }

    userWeedStashes[user] -= weedNeeded;
    userBalances[user].balance -= gbxCost;

    if (!userExtractStashes[user]) {
        userExtractStashes[user] = {};
    }
    userExtractStashes[user][extractType] = (userExtractStashes[user][extractType] || 0) + extractAmount;

    const messages = [
        `🔥 You just pressed ${extractAmount.toLocaleString()}g of hash from ${weedNeeded.toLocaleString()}g of weed! Smells dank!`,
        `🛠️ Extraction complete! ${extractAmount.toLocaleString()}g of hash secured in your stash!`,
        `🌿➡️💨 You transformed ${weedNeeded.toLocaleString()}g of weed into ${extractAmount.toLocaleString()}g of hash like a pro!`
    ];

    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);

    console.log(`[DEBUG] ${user} After Extraction - Weed Stash: ${userWeedStashes[user]}g, Extract Stash: ${userExtractStashes[user][extractType]}g, GBX: ${userBalances[user].balance}`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥖💸 .selljoint - Sell joints to an offshore buyer for GojiBux (weed is burned, funds are untraceable)
if (wsmsg["text"].toLowerCase().startsWith(".selljoint")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .selljoint [amount|max|all]");
        return;
    }

    let amount;
    const jointsAvailable = userJointStashes[username] || 0;

    if (typeof weedBuyPrice !== "number" || weedBuyPrice <= 0) {
        respondWithMessage.call(this, "🤖 Error: Offshore market price is unavailable. Try again later!");
        return;
    }

    if (args.toLowerCase() === "max" || args.toLowerCase() === "all") {
        amount = jointsAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any joints to sell.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .selljoint [amount|max|all]");
            return;
        }

        if (amount > jointsAvailable) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have that many joints to sell. (🥖 ${amount} requested, 🥖 ${jointsAvailable} available)`);
            return;
        }
    }

    const avgWeedPerJoint = 2.25;
    const totalWeedUsed = amount * avgWeedPerJoint;

    const minMarkup = 1.5;
    const maxMarkup = 2.0;
    const markupPercentage = Math.random() * (maxMarkup - minMarkup) + minMarkup;

    const jointSellPrice = Math.ceil((weedBuyPrice * avgWeedPerJoint) * markupPercentage);
    const totalEarnings = amount * jointSellPrice;

    // 🚫 No taxes, no bank pull — this money is created offshore
    userJointStashes[username] -= amount;

    if (!userBalances[username]) {
        userBalances[username] = { balance: 0 };
    }

    userBalances[username].balance += totalEarnings;

    saveJointStashes();
    saveBalances();

    respondWithMessage.call(this,
        `🥖💸 ${nickname} smuggled 🥖 ${amount} joint${amount > 1 ? 's' : ''} to an offshore buyer for 💵 ${totalEarnings.toLocaleString()} GBX! 🛥️\n` +
        `🔥 No taxes, no bank records. Just pure, shady profit.\n` +
        `🤑 Each joint sold for 💵 ${jointSellPrice.toLocaleString()} GBX!`
    );
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🕒 Cooldown storage for `.adventure`
let lastAdventureTime = JSON.parse(localStorage.getItem("lastAdventureTime")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 `.adventure` - Engage in a high-risk, high-reward scenario (5-minute cooldown)
if (wsmsg["text"].toLowerCase() === ".adventure") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const now = Date.now();
    const lastAdventure = lastAdventureTime[username] || 0;
    const cooldown = 1 * 60 * 1000; // 5-minute cooldown

    if (now - lastAdventure < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastAdventure)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you must wait ${timeLeft} seconds before embarking on another adventure.`);
        return;
    }

    // Ensure economy variables exist
    if (!userBalances[username]) userBalances[username] = { balance: 1 };
    if (!userWeedStashes[username]) userWeedStashes[username] = 0;

    const scenarios = [
        {
            name: "🥦 Weed Smuggling",
            description: "You're transporting a van full of premium weed across state lines. What's your plan?",
            choices: [
                { text: "Take the highway", reward: { gojiBux: 10000 } },
                { text: "Use the backroads", reward: { gojiBux: 25000, bustChance: 0.3 } },
                { text: "Bribe a cop", reward: { gojiBux: -15000, busted: true } }
            ]
        },
        {
            name: "🎰 Casino Hustle",
            description: "You're managing an underground casino when a high roller arrives. How do you proceed?",
            choices: [
                { text: "Let them play", reward: { gojiBux: 20000 } },
                { text: "Rig the games", reward: { gojiBux: 40000, bustChance: 0.4 } },
                { text: "Close up shop", reward: { gojiBux: 10000 } }
            ]
        },
        {
            name: "🏴‍☠️ Black Market Deal",
            description: "A dubious buyer wants to purchase your entire stash. Do you trust them?",
            choices: [
                { text: "Sell everything", reward: { gojiBux: 50000, weed: -10 } },
                { text: "Test the waters", reward: { gojiBux: 30000, weed: -5, bustChance: 0.2 } },
                { text: "Decline the offer", reward: { gojiBux: 12000 } }
            ]
        }
    ];

    // Select a random scenario and choice
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];
    const choice = scenario.choices[Math.floor(Math.random() * scenario.choices.length)];
    let result = `${scenario.name}: ${scenario.description}\n\n👉 *${choice.text}*... `;

    if (choice.reward.busted) {
        result += `🚔 BUSTED! ${nickname} lost 💵 ${Math.abs(choice.reward.gojiBux).toLocaleString()} GBX`;
        userBalances[username].balance = Math.max(1, userBalances[username].balance + choice.reward.gojiBux);
        lghBank += Math.abs(choice.reward.gojiBux); // Lost funds go to LGH Bank
    } else if (choice.reward.bustChance && Math.random() < choice.reward.bustChance) {
        result += `🚨 Oh no! The authorities caught ${nickname}. BUSTED! Lost 💵 ${Math.abs(choice.reward.gojiBux).toLocaleString()} GBX.`;
        userBalances[username].balance = Math.max(1, userBalances[username].balance + choice.reward.gojiBux);
        lghBank += Math.abs(choice.reward.gojiBux);
    } else {
        result += `💵➕ Success! ${nickname} earned 💵 ${choice.reward.gojiBux.toLocaleString()} GBX.`;
        userBalances[username].balance += choice.reward.gojiBux;
        if (choice.reward.weed) {
            userWeedStashes[username] = Math.max(0, userWeedStashes[username] + choice.reward.weed);
        }
    }

    // Apply cooldown
    lastAdventureTime[username] = now;

    // Save all changes
    saveBalances();
    saveWeedStashes();
    localStorage.setItem("lghBank", lghBank.toString());
    localStorage.setItem("lastAdventureTime", JSON.stringify(lastAdventureTime));

    respondWithMessage.call(this, result);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦🔒 `.stashweed` - Hide weed from police busts (60-second cooldown)
let lastHideWeedTimes = JSON.parse(localStorage.getItem("lastHideWeedTimes")) || {};
let lastUnhideWeedTimes = JSON.parse(localStorage.getItem("lastUnhideWeedTimes")) || {};
let userHiddenWeed = JSON.parse(localStorage.getItem("userHiddenWeed")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".stashweed")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .stashweed [amount|max|all]");
        return;
    }

    // Cooldown settings
    const now = Date.now();
    const cooldown = 60 * 1000; // 60-second cooldown
    const lastUsed = lastHideWeedTimes[username] || 0;

    if (now - lastUsed < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastUsed)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${timeLeft} seconds before hiding more weed.`);
        return;
    }

    let amount;
    const weedAvailable = userWeedStashes[username] || 0;
    userHiddenWeed[username] = userHiddenWeed[username] || 0;

    if (args.toLowerCase() === "max" || args.toLowerCase() === "all") {
        amount = weedAvailable;
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || amount > weedAvailable) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    if (amount <= 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have any weed to hide.`);
        return;
    }

    // Move weed to hidden stash
    userWeedStashes[username] -= amount;
    userHiddenWeed[username] += amount;

    saveWeedStashes();
    saveHiddenWeed();

    // Set cooldown and save
    lastHideWeedTimes[username] = now;
    localStorage.setItem("lastHideWeedTimes", JSON.stringify(lastHideWeedTimes));

    respondWithMessage.call(this, `🥦🔒 ${nickname} stashed away 🥦 ${amount.toLocaleString()}g of weed! (Hidden: 🥦 ${userHiddenWeed[username].toLocaleString()}g)`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🥦🔓 `.unstashweed` - Retrieve hidden weed (60-second cooldown)
if (wsmsg["text"].toLowerCase().startsWith(".unstashweed")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .unstashweed [amount|max|all]");
        return;
    }

    // Cooldown settings
    const now = Date.now();
    const cooldown = 60 * 1000;
    const lastUsed = lastUnhideWeedTimes[username] || 0;

    if (now - lastUsed < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastUsed)) / 1000);
        respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${timeLeft} seconds before retrieving more weed.`);
        return;
    }

    let amount;
    userHiddenWeed[username] = userHiddenWeed[username] || 0;
    const hiddenWeed = userHiddenWeed[username];

    if (args.toLowerCase() === "max" || args.toLowerCase() === "all") {
        amount = hiddenWeed;
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || amount > hiddenWeed) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient hidden stash.");
            return;
        }
    }

    if (amount <= 0) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have any hidden weed to retrieve.`);
        return;
    }

    // Move weed back to accessible stash
    userHiddenWeed[username] -= amount;
    userWeedStashes[username] += amount;

    saveWeedStashes();
    saveHiddenWeed();

    // Set cooldown and save
    lastUnhideWeedTimes[username] = now;
    localStorage.setItem("lastUnhideWeedTimes", JSON.stringify(lastUnhideWeedTimes));

    respondWithMessage.call(this, `🥦🔓 ${nickname} retrieved 🥦 ${amount.toLocaleString()}g of hidden weed! (Hidden Left: ${userHiddenWeed[username].toLocaleString()}g)`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🔒🎒 `.mystashweed` - Check how much weed is hidden
if (wsmsg["text"].toLowerCase() === ".mystashweed") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    userHiddenWeed[username] = userHiddenWeed[username] || 0;

    respondWithMessage.call(this, `🔒🎒 ${nickname}, you have 🥦 ${userHiddenWeed[username].toLocaleString()}g of weed safely hidden.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💾 Helper Functions
function saveHiddenWeed() {
    localStorage.setItem("userHiddenWeed", JSON.stringify(userHiddenWeed));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💸 `.give bux user amount` - Send GojiBux to another user [find out why this is here]
/*if (wsmsg["text"].toLowerCase().startsWith(".give bux")) {
    const args = wsmsg["text"].split(/\s+/);
    const handle = wsmsg["handle"];
    const senderUsername = userHandles[handle];
    const senderNickname = userNicknames[senderUsername]?.nickname || senderUsername || "you";

    if (!senderUsername) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (args.length !== 3) {
        respondWithMessage.call(this, "🤖 Usage: .sendbux @user amount");
        return;
    }

    let recipientUsername = args[1].replace(/^@/, ""); // Remove '@' if used
    let amount = parseInt(args[2], 10);

    if (!recipientUsername || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🤖 Error: Invalid recipient or amount specified.");
        return;
    }

    if (recipientUsername === senderUsername) {
        respondWithMessage.call(this, "🤖 You can't send GojiBux to yourself.");
        return;
    }

    if (!userBalances[recipientUsername]) {
        respondWithMessage.call(this, `🤖 Error: Could not find user "${recipientUsername}".`);
        return;
    }

    if (!userBalances[senderUsername] || userBalances[senderUsername].balance < amount) {
        respondWithMessage.call(this, `💸 ${senderNickname}, you don't have enough GojiBux to send!`);
        return;
    }

    // Get recipient's nickname (or default to username if not set)
    const recipientNickname = userNicknames[recipientUsername]?.nickname || recipientUsername;

    // Process the transaction
    userBalances[senderUsername].balance -= amount;
    userBalances[recipientUsername].balance += amount;
    saveBalances();

    // 📝 Randomized success messages using nickname
    const messages = [
        `💸 ${senderNickname} generously sent 💵 ${amount.toLocaleString()} GBX to ${recipientNickname}!`,
        `🤑 ${senderNickname} made it rain on ${recipientNickname} with 💵 ${amount.toLocaleString()} GBX!`,
        `💰 ${recipientNickname} just got a surprise deposit of 💵 ${amount.toLocaleString()} GBX from ${senderNickname}!`,
        `🤝 ${senderNickname} shared some wealth, sending 💵 ${amount.toLocaleString()} GBX to ${recipientNickname}!`,
        `🚀 ${recipientNickname} just got a financial boost! +${amount.toLocaleString()} GBX from ${senderNickname}!`
    ];

    // Select a random message
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    respondWithMessage.call(this, randomMessage);
}*/

//-----------------------------------------------------------------------------------------------------------------------------------

// 💎 `.gojicoin` - Buy a GojiCoin for 1 Billion GBX
let gojiCoinBalances = JSON.parse(localStorage.getItem("gojiCoinBalances")) || {};

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase().startsWith(".buycoin")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 1_000_000_000;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[1] || "1";

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max"
        ? maxAffordable
        : parseInt(rawAmount, 10);

    if (!amount || amount <= 0) {
        respondWithMessage.call(this, `🤖 Invalid amount. You can afford up to 💎 ${maxAffordable.toLocaleString()} coin${maxAffordable !== 1 ? "s" : ""}.`);
        return;
    }

    const totalCost = costPer * amount;
    if (userBalance < totalCost) {
        respondWithMessage.call(this, `💸 ${nickname}, you need 💵 ${totalCost.toLocaleString()} GBX for ${amount} coin${amount !== 1 ? "s" : ""}.`);
        return;
    }

    userBalances[username].balance -= totalCost;
    gojiCoinBalances[username] = (gojiCoinBalances[username] || 0) + amount;

    saveBalances();
    localStorage.setItem("gojiCoinBalances", JSON.stringify(gojiCoinBalances));

    respondWithMessage.call(this, `💎➕ ${nickname} bought ${amount} GojiCoin${amount !== 1 ? "s" : ""} for 💵 ${totalCost.toLocaleString()} GBX!`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💎🎒 `.mycoin` - Check total GojiCoins owned
if (wsmsg["text"].toLowerCase() === ".mycoin") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const gojiCoins = gojiCoinBalances[username] || 0;

    respondWithMessage.call(this, `💎🎒 ${nickname}, you currently own 💎 ${gojiCoins.toLocaleString()} GojiCoin${gojiCoins !== 1 ? "s" : ""}.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🎁 Treat Goji Command: CashApp, GBX & WGH Transfers, and Flex Messages
if (wsmsg['text'].toLowerCase() === ".treat") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const gojiUsername = "Goji"; // Ensure this matches Goji’s actual stored username

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // 💰 CashApp message (Always sent)
    let cashAppMessage = `💸 Buy Goji a pizza, some coffee, or a fat sack! 🍕☕🥦 CashApp: $GojiBran`;

    // 🛑 If Goji uses the command, only send the CashApp message, no transfers
    if (username === gojiUsername) {
        respondWithMessage.call(this, cashAppMessage);
        return;
    }

    // 🏦 Initialize user balances if missing
    if (!userBalances[username]) userBalances[username] = { balance: 1 };
    if (!userWeedStashes[username]) userWeedStashes[username] = 0;
    if (!userBalances[gojiUsername]) userBalances[gojiUsername] = { balance: 1 };
    if (!userWeedStashes[gojiUsername]) userWeedStashes[gojiUsername] = 0;

    // 💰 User's current GBX & WGH stash
    const userGBX = userBalances[username].balance || 0;
    const userWGH = userWeedStashes[username] || 0;

    // 🔄 Transfer amounts (Max 420 each, or whatever they have)
    const transferGBX = Math.min(420, userGBX);
    const transferWGH = Math.min(420, userWGH);

    // 💸 Deduct from user, add to Goji
    userBalances[username].balance -= transferGBX;
    userWeedStashes[username] -= transferWGH;
    userBalances[gojiUsername].balance += transferGBX;
    userWeedStashes[gojiUsername] += transferWGH;

    // 💾 Save balances
    saveBalances();
    saveWeedStashes();

    // 🎲 Randomized treat responses
    let treatResponses = [
        `🍕 ${nickname} hooked Goji up with a fresh slice and sent 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g!`,
        `☕ ${nickname} fueled Goji’s grind with coffee and dropped 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g!`,
        `🔥 ${nickname} blessed Goji with some Mendo Dope and 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g!`,
        `💰 ${nickname} just cashed out 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g to Goji! Respect!`,
        `🌱 ${nickname} paid tribute to Goji with 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g! 🔥`,
        `🚀 Goji’s stash just got a boost! ${nickname} sent 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g!`,
        `💨 ${nickname} passed a fat bag of 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g to Goji!`,
        `🏆 Elite donor move: ${nickname} dropped 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g in Goji’s wallet!`,
        `🍃 ${nickname} shared the love—💵 ${transferGBX}GBX + 🥦 ${transferWGH}g now in Goji’s hands!`,
        `🛠️ Support unlocked! ${nickname} sent 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g to Goji!`,
        `💳 ${nickname} swiped the card and 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g is now Goji’s!`,
        `🎁 ${nickname} just sent Goji a surprise gift: 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g!`,
        `🛫 ${nickname} just airdropped 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g straight into Goji’s stash!`,
        `💼 ${nickname} sent Goji a briefcase full of 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g!`,
        `🔥 Goji just got a direct deposit—courtesy of ${nickname}! 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g secured!`,
        `🚛 ${nickname} pulled up with a truckload—💵 ${transferGBX}GBX + 🥦 ${transferWGH}g added to Goji’s vault!`,
        `⚡ ${nickname} made it rain with 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g! Goji’s powered up!`,
        `🦍 ${nickname} went full gorilla mode and gifted 💵 ${transferGBX}GBX + 🥦 ${transferWGH}g to Goji!`
    ];

    // 🚫 If the user had nothing to give, adjust the response
    if (transferGBX === 0 && transferWGH === 0) {
        treatResponses = [
            `💸 ${nickname} wanted to treat Goji but had nothing to give—it’s the thought that counts!`,
            `🚫 ${nickname} checked their pockets… empty! No GBX or WGH to send.`,
            `🤖 ${nickname} tried to treat Goji but has zero funds. Maybe next time!`,
            `💀 ${nickname} attempted generosity but their wallet is drier than a desert. No GBX, no WGH!`,
            `🍕 ${nickname} tried to treat Goji but is broke AF—at least they tried!`
        ];
    }

    let response = treatResponses[Math.floor(Math.random() * treatResponses.length)];

    // 📢 Send the CashApp message + Transfer Result
    respondWithMessage.call(this, cashAppMessage);
    respondWithMessage.call(this, response);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🔥 `.burn` - Removes 20% from all users' GojiBux balance, stash, and weed stash
if (wsmsg["text"].toLowerCase() === ".burn") {
    let totalBurnedBalance = 0;
    let totalBurnedStash = 0;
    let totalBurnedWeed = 0;
    let affectedUsers = 0;

    for (const user in userBalances) {
        let userBalance = userBalances[user]?.balance || 0;
        let userStash = userStashes[user] || 0;
        let userWeed = userWeedStashes[user] || 0;

        let burnBalance = Math.floor(userBalance * 0.2);
        let burnStash = Math.floor(userStash * 0.2);
        let burnWeed = Math.floor(userWeed * 0.2);

        burnBalance = Math.max(1, burnBalance);
        burnStash = Math.max(1, burnStash);
        burnWeed = Math.max(1, burnWeed);

        if (userBalance > 1) {
            userBalances[user].balance -= burnBalance;
            totalBurnedBalance += burnBalance;
        }

        if (userStash > 1) {
            userStashes[user] -= burnStash;
            totalBurnedStash += burnStash;
        }

        if (userWeed > 1) {
            userWeedStashes[user] -= burnWeed;
            totalBurnedWeed += burnWeed;
        }

        affectedUsers++;
    }

    saveBalances();
    saveUserStashes();
    saveWeedStashes();

    if (affectedUsers === 0) {
        respondWithMessage.call(this, "🔥 No GojiBux, stash, or weed was burned. Either the economy is broke or everyone is at 1.");
    } else {
        respondWithMessage.call(this, `🔥 The Great GojiBux Purge has occurred! 💀 💵 ${totalBurnedBalance.toLocaleString()} GBX burned from balances, 💰 ${totalBurnedStash.toLocaleString()} GBX burned from stashes, and 🥦 ${totalBurnedWeed.toLocaleString()}g of weed went up in smoke!`);
    }
}

/*
//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 GojiBux Pot System
let gojiPot = localStorage.getItem("gojiPot") ? parseInt(localStorage.getItem("gojiPot")) : 0;
let lastPotClaimTime = localStorage.getItem("lastPotClaimTime") ? parseInt(localStorage.getItem("lastPotClaimTime")) : 0;

//-----------------------------------------------------------------------------------------------------------------------------------

// Function to save the pot
function saveGojiPot() {
    localStorage.setItem("gojiPot", gojiPot);
    localStorage.setItem("lastPotClaimTime", lastPotClaimTime);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 .pot - Display the current pot balance including LGH contribution
//if (wsmsg["text"].toLowerCase() === ".pot") {
if ([".pot", ".lottery"].includes(wsmsg["text"].toLowerCase())) {
    const lghContribution = Math.floor(lghBank * 0.5);
    const totalPot = gojiPot + lghContribution;

    if (totalPot <= 0) {
        respondWithMessage.call(this, "🤖 The lottery is empty. Use .givepot to contribute!");
    } else {
        respondWithMessage.call(this, `🎫 The current pot contains 💵 ${totalPot.toLocaleString()} GBX! (💵 ${gojiPot.toLocaleString()} GBX + 💵 ${lghContribution.toLocaleString()} GBX from 🏦 LGH Bank). Use .givepot to contribute or .getpot to claim it.`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💸 `.givepot [amount|max|all]` - Contribute GojiBux to the communal lottery pot
const givepotTriggers = [".givepot", ".givelottery"]; // add more aliases here
if (givepotTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .givepot [amount|max|all]");
        return;
    }

    let amount = args[1].toLowerCase();
    const userBalance = userBalances[username]?.balance || 0;

    if (amount === "max" || amount === "all") {
        amount = userBalance;
    } else {
        amount = parseInt(amount, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Enter a valid amount greater than zero.");
            return;
        }
    }

    if (amount > userBalance) {
        respondWithMessage.call(this, "🤖 You don't have enough 💵 GojiBux to contribute.");
        return;
    }

    if (amount < 10) {
        respondWithMessage.call(this, "🤖 Minimum contribution to the pot is 💵 10 GBX.");
        return;
    }

    userBalances[username].balance -= amount;
    gojiPot += amount;
    saveGojiPot();
    saveBalances();

    respondWithMessage.call(this, `🎫🎁 ${nickname} added 💵 ${amount.toLocaleString()} GBX to the pot! Current pot: 💵 ${gojiPot.toLocaleString()} GBX`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🎰 .getpot - Claim the pot (Random winner, 1-hour cooldown, includes 50% of LGH Bank)
//if (wsmsg["text"].toLowerCase() === ".getpot") {
if ([".getpot", ".getlottery"].includes(wsmsg["text"].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    const currentTime = Date.now();
    const cooldown = 20 * 60 * 1000; // 1-hour cooldown

    if (currentTime - lastPotClaimTime < cooldown) {
        const remainingTime = Math.ceil((cooldown - (currentTime - lastPotClaimTime)) / 60000);
        respondWithMessage.call(this, `⏳ The pot can be claimed in ${remainingTime} minutes.`);
        return;
    }

    if (gojiPot <= 0 && lghBank <= 0) {
        respondWithMessage.call(this, "🤖 The pot is empty. Use .givepot to contribute!");
        return;
    }

    // Calculate total pot (GojiPot + 50% of LGH Bank)
    const lghContribution = Math.floor(lghBank * 0.5);
    lghBank -= lghContribution; // Deduct LGH contribution before selecting winner
    const totalPot = gojiPot + lghContribution;

    // Choose a random winner from all users
    const eligibleUsers = Object.keys(userBalances);
    if (eligibleUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No eligible users to receive the pot.");
        return;
    }

    const winner = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
    const winnerNickname = userNicknames[winner]?.nickname || winner;

    // Ensure the winner has a balance entry
    if (!userBalances[winner]) {
        userBalances[winner] = { balance: 0 };
    }

    // Give the total pot to the winner
    userBalances[winner].balance += totalPot;
    saveBalances();
    saveLghBank();

    respondWithMessage.call(this, `🎫🎊 ${winnerNickname} won the pot of 💵 ${totalPot.toLocaleString()} GBX! (💵 ${gojiPot.toLocaleString()} GBX + 💵 ${lghContribution.toLocaleString()} GBX from 🏦 LGH Bank) Congratulations!`);
    //respondWithMessage.call(this, `.yt jackpot kompany`);
    //setTimeout(() => {
        //respondWithMessage.call(this, `🎉 ${winnerNickname} won the pot of 💰 ${totalPot.toLocaleString()} GBX! (${gojiPot.toLocaleString()} GBX + ${lghContribution.toLocaleString()} GBX from LGH Bank) Congratulations!`);
    //}, 1000);

    // Reset the pot and cooldown
    gojiPot = 0;
    lastPotClaimTime = currentTime;
    saveGojiPot();
}
*/

//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 GojiBux Pot System
let gojiPot = localStorage.getItem("gojiPot") ? parseInt(localStorage.getItem("gojiPot")) : 0;
let lastPotClaimTime = localStorage.getItem("lastPotClaimTime") ? parseInt(localStorage.getItem("lastPotClaimTime")) : 0;
let lastPotMilestone = parseFloat(localStorage.getItem("lastPotMilestone") || "0");

//-----------------------------------------------------------------------------------------------------------------------------------

// 💾 Save Pot & Milestone
function saveGojiPot() {
    localStorage.setItem("gojiPot", gojiPot);
    localStorage.setItem("lastPotClaimTime", lastPotClaimTime);
}
function savePotMilestone(value) {
    lastPotMilestone = value;
    localStorage.setItem("lastPotMilestone", value.toString());
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 📊 Pot Bar Generator (1B goal)
function generatePotBar(total, max = 1_000_000_000, width = 12) {
    const percent = Math.min(total / max, 1);
    const filled = Math.floor(percent * width);
    const empty = width - filled;
    const bar = "█".repeat(filled) + "░".repeat(empty);
    return `[${bar}] ${(percent * 100).toFixed(1)}%`;
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🎫 `.pot` or `.lottery` - Show current pot and progress bar
if ([".pot", ".lottery"].includes(wsmsg["text"].toLowerCase())) {
    const lghContribution = Math.floor(lghBank * 0.5);
    const totalPot = gojiPot + lghContribution;
    const potBar = generatePotBar(totalPot);
    const potPercent = totalPot / 1_000_000_000;

    if (totalPot <= 0) {
        respondWithMessage.call(this, "🤖 The lottery is empty. Use `.givepot` to contribute!");
    } else {
        respondWithMessage.call(this,
            `🎫 The current pot contains 💵 ${totalPot.toLocaleString()} GBX!\n` +
            `📊 Pot Level: ${potBar}\n` +
            `├ 💵 ${gojiPot.toLocaleString()} GBX from users\n` +
            `└ 💵 ${lghContribution.toLocaleString()} GBX from 🏦 LGH Bank\n` +
            `Use .givepot to contribute or .getpot to claim it.`
        );
    }

    // 🎯 Milestone Alerts
    if (potPercent >= 1.00 && lastPotMilestone < 1.00) {
        respondWithMessage.call(this, `💎💥 THE POT HAS HIT 1 BILLION GBX!!! LEGENDARY JACKPOT UNLOCKED!`);
        savePotMilestone(1.00);
    } else if (potPercent >= 0.75 && lastPotMilestone < 0.75) {
        respondWithMessage.call(this, `🥇 The pot has reached GOLD TIER (75%)! The stakes are 🔥`);
        savePotMilestone(0.75);
    } else if (potPercent >= 0.5 && lastPotMilestone < 0.5) {
        respondWithMessage.call(this, `🥈 SILVER TIER UNLOCKED (50%)! Keep it growing 💰`);
        savePotMilestone(0.5);
    } else if (potPercent >= 0.25 && lastPotMilestone < 0.25) {
        respondWithMessage.call(this, `🥉 The pot has reached BRONZE Tier (25%)! Let’s gooo 🚀`);
        savePotMilestone(0.25);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💸 `.givepot [amount|max|all]` - Contribute GBX to the pot
const givepotTriggers = [".givepot", ".givelottery"];
if (givepotTriggers.includes(wsmsg["text"].split(" ")[0].toLowerCase())) {
    const args = wsmsg["text"].trim().split(/\s+/);
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username || args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: `.givepot [amount|max|all]`");
        return;
    }

    let amount = args[1].toLowerCase();
    const userBalance = userBalances[username]?.balance || 0;

    if (amount === "max" || amount === "all") {
        amount = userBalance;
    } else {
        amount = parseInt(amount, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "❌ Enter a valid amount greater than zero.");
            return;
        }
    }

    if (amount > userBalance) {
        respondWithMessage.call(this, "🤖 You don't have enough GojiBux to contribute.");
        return;
    }

    if (amount < 10) {
        respondWithMessage.call(this, "🤖 Minimum contribution to the pot is 💵 10 GBX.");
        return;
    }

    userBalances[username].balance -= amount;
    gojiPot += amount;
    saveGojiPot();
    saveBalances();

    respondWithMessage.call(this,
        `🎫🎁 ${nickname} added 💵 ${amount.toLocaleString()} GBX to the pot!\n` +
        `Current pot (user-funded only): 💵 ${gojiPot.toLocaleString()} GBX`
    );
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🎰 `.getpot` or `.getlottery` - Claim the pot (20 min cooldown)
if ([".getpot", ".getlottery"].includes(wsmsg["text"].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    const currentTime = Date.now();
    const cooldown = 20 * 60 * 1000;

    if (currentTime - lastPotClaimTime < cooldown) {
        const remainingTime = Math.ceil((cooldown - (currentTime - lastPotClaimTime)) / 60000);
        respondWithMessage.call(this, `⏳ The pot can be claimed in ${remainingTime} minute(s).`);
        return;
    }

    if (gojiPot <= 0 && lghBank <= 0) {
        respondWithMessage.call(this, "🤖 The pot is empty. Use `.givepot` to contribute!");
        return;
    }

    const lghContribution = Math.floor(lghBank * 0.5);
    lghBank -= lghContribution;
    const totalPot = gojiPot + lghContribution;

    const eligibleUsers = Object.keys(userBalances);
    if (eligibleUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No eligible users to receive the pot.");
        return;
    }

    const winner = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
    const winnerNickname = userNicknames[winner]?.nickname || winner;

    if (!userBalances[winner]) {
        userBalances[winner] = { balance: 0 };
    }

    userBalances[winner].balance += totalPot;

    gojiPot = 0;
    lastPotClaimTime = currentTime;
    lastPotMilestone = 0;
    saveGojiPot();
    saveLghBank();
    saveBalances();
    localStorage.setItem("lastPotMilestone", "0");

    respondWithMessage.call(this,
        `🎫🎊 ${winnerNickname} won the pot of 💵 ${totalPot.toLocaleString()} GBX!\n` +
        `├ 💵 ${gojiPot.toLocaleString()} GBX from users\n` +
        `└ 💵 ${lghContribution.toLocaleString()} GBX from 🏦 LGH Bank\nCongratulations!`
    );
}

//-----------------------------------------------------------------------------------------------------------------------------------

let userStats = JSON.parse(localStorage.getItem("userStats") || "{}");

function saveUserStats() {
    localStorage.setItem("userStats", JSON.stringify(userStats));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🎰 `.gamble AMOUNT` or `.bet AMOUNT` - Bet GojiBux for a chance to win!
if (wsmsg["text"].toLowerCase().startsWith(".gamble ") || wsmsg["text"].toLowerCase().startsWith(".bet ")) {
    const args = wsmsg["text"].split(" ");
    const betInput = args[1]?.toLowerCase();
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // 💥 Check 10s cooldown
    if (!userStats[username]) userStats[username] = {};
    const lastGambleTime = userStats[username].lastGamble || 0;
    const now = Date.now();
    const cooldown = 10 * 1000; // 10 seconds

    if (now - lastGambleTime < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastGambleTime)) / 1000);
        respondWithMessage.call(this, `⏳ Whoa there, ${nickname}! You need to wait ${remaining} more seconds before gambling again.`);
        return;
    }

    let betAmount;
    if (betInput === "max" || betInput === "all") {
        betAmount = userBalances[username].balance;
    } else {
        betAmount = parseInt(betInput);
    }

    if (isNaN(betAmount) || betAmount <= 0) {
        respondWithMessage.call(this, "❌ Invalid amount! Example: `.bet 500` or `.bet max` to go all in.");
        return;
    }

    if (userBalances[username].balance < betAmount) {
        respondWithMessage.call(this, `🤖 Not enough GojiBux! You only have ${userBalances[username].balance.toLocaleString()} GBX.`);
        return;
    }

    const roll = Math.random();
    let winnings = 0;
    let lostToBank = 0;
    let resultMessage = "";

    if (roll < 0.03) { // 3% - JACKPOT
        winnings = betAmount * 4;
        resultMessage = `🎰 JACKPOT!!! ${nickname} broke the machine and turned 💵 ${betAmount.toLocaleString()} GBX into 💵➕ ${(winnings + betAmount).toLocaleString()} GBX! 🥳💸`;
    } else if (roll < 0.15) { // 12% - BIG WIN
        winnings = betAmount * 2;
        resultMessage = `🔥 HOT STREAK! ${nickname} scored a BIG WIN: 💵➕ ${(winnings + betAmount).toLocaleString()} GBX! 🤑🔥`;
    } else if (roll < 0.55) { // 40% - Standard Win
        winnings = betAmount;
        resultMessage = `✅ Clean win! ${nickname} doubled up and now has 💵➕ ${(winnings + betAmount).toLocaleString()} GBX! 💰`;
    } else if (roll < 0.80) { // 25% - Tiny Win
        winnings = Math.floor(betAmount * 0.25);
        resultMessage = `🍬 Not bad! ${nickname} got a small boost: 💵➕ ${(winnings + betAmount).toLocaleString()} GBX. Take the W!`;
    } else if (roll < 0.99) { // 19% - Small Loss
        winnings = -Math.floor(betAmount / 2);
        lostToBank = Math.abs(winnings);
        resultMessage = `😬 Almost made it. ${nickname} lost half their bet. 💵➖ -${lostToBank.toLocaleString()} GBX.`;
    } else { // 1% - Total Loss
        winnings = -betAmount;
        lostToBank = Math.abs(winnings);
        resultMessage = `💸 WRECKED! ${nickname} lost it all… 💵➖ -${betAmount.toLocaleString()} GBX. 😭 Rarest L!`;
    }

    // Update balance
    userBalances[username].balance += winnings;

    // Add loss to bank
    if (lostToBank > 0) {
        lghBank += lostToBank;
        localStorage.setItem("lghBank", lghBank.toString());
    }

    // 💾 Track win streaks and cooldown
    if (winnings > 0) {
        userStats[username].winStreak = (userStats[username].winStreak || 0) + 1;
    } else {
        userStats[username].winStreak = 0;
    }

    userStats[username].lastGamble = now;

    // 🏆 Win streak bonus (scaled by winnings)
    if (userStats[username].winStreak >= 5 && winnings > 0) {
        const bonus = Math.floor((winnings + betAmount) * (userStats[username].winStreak * 0.05));
        userBalances[username].balance += bonus;
        resultMessage += ` 🔥 ${nickname} is on a ${userStats[username].winStreak}-win streak and earned a bonus 💵➕ ${bonus.toLocaleString()} GBX! Absolute legend.`;
    }

    // 🎟️ Feed the lottery pot
    let lotteryContribution = 0;
    if (winnings < 0) {
        // 100% of losses go to the pot
        lotteryContribution = Math.abs(winnings);
    } else if (winnings > 0) {
        // 10% of winnings taxed to the pot
        const tax = Math.floor(winnings * 0.10);
        userBalances[username].balance -= tax;
        lotteryContribution = tax;
    }

    if (lotteryContribution > 0) {
        gojiPot += lotteryContribution;
        saveGojiPot();
        resultMessage += ` 🎟️ ${lotteryContribution.toLocaleString()} GBX added to the lottery pot!`;
    }

    // 🎁 Random bonus drop
    if (Math.random() < 0.01) {
        resultMessage += ` 🍀 ${nickname} found a Lucky Coin! (no effect yet, but wow!)`;
    }

    saveBalances();
    saveUserStats();
    respondWithMessage.call(this, resultMessage);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 💵🤏 .stealbux [username] - Attempt to steal GojiBux from a specific user or a random one
if (wsmsg["text"].toLowerCase().startsWith(".stealbux")) {
    const args = wsmsg["text"].split(" ");
    const handle = wsmsg["handle"];
    const thiefUsername = userHandles[handle];
    const thiefNickname = userNicknames[thiefUsername]?.nickname || thiefUsername || "you";

    if (!thiefUsername) {
        respondWithMessage.call(this, "🤖 Something went wrong. Try again.");
        return;
    }

    let victimUsername;

    if (args.length > 1) {
        victimUsername = args[1];
        if (victimUsername === thiefUsername) {
            respondWithMessage.call(this, "🤖 You can't steal from yourself, nice try.");
            return;
        }

        if (!userBalances[victimUsername] || (userBalances[victimUsername].balance || 0) < 1000) {
            respondWithMessage.call(this, `🤖 ${victimUsername} doesn't have enough 💵 GojiBux to steal from.`);
            return;
        }
    } else {
        const potentialVictims = Object.keys(userBalances).filter(
            (username) => username !== thiefUsername && (userBalances[username].balance || 0) >= 1000
        );

        if (potentialVictims.length === 0) {
            respondWithMessage.call(this, "🤖 Nobody has enough 💵 GojiBux to steal from.");
            return;
        }

        victimUsername = potentialVictims[Math.floor(Math.random() * potentialVictims.length)];
    }

    const victimNickname = userNicknames[victimUsername]?.nickname || victimUsername;

    let victimBalance = userBalances[victimUsername].balance || 0;
    let thiefBalance = userBalances[thiefUsername].balance || 0;
    let thiefStash = userStashes[thiefUsername] || 0;

    let victimTotal = victimBalance;
    let thiefTotal = thiefBalance + thiefStash;

    if (victimTotal < 1000) {
        respondWithMessage.call(this, `🤖 ${victimNickname} doesn't have enough 💵 GojiBux to steal from.`);
        return;
    }

    let stealAmount = Math.max(1, Math.floor(victimTotal * (Math.random() * 0.1 + 0.05)));
    stealAmount = Math.min(stealAmount, Math.floor(victimTotal * 0.5));

    let caught = Math.random() < 0.5;

    if (caught) {
        // Penalty = same as attempted steal, capped at 50% of thief's total
        let penalty = Math.min(stealAmount, Math.floor(thiefTotal * 0.5));
        let amountPaid = 0;

        if (thiefBalance + thiefStash >= penalty) {
            let fromBalance = Math.min(thiefBalance, penalty);
            let fromStash = penalty - fromBalance;

            userBalances[thiefUsername].balance -= fromBalance;
            userStashes[thiefUsername] -= fromStash;
            amountPaid = penalty;
        } else {
            amountPaid = thiefBalance + thiefStash;
            userBalances[thiefUsername].balance = 0;
            userStashes[thiefUsername] = 0;
        }

        userBalances[victimUsername].balance += amountPaid;
        saveBalances();
        saveUserStashes();

        respondWithMessage.call(this, `🚨 ${thiefNickname} got CAUGHT trying to steal 💵 ${stealAmount.toLocaleString()} GBX from ${victimNickname} and had to pay 💵➖ ${amountPaid.toLocaleString()} GBX as a penalty!`);
    } else {
        if (victimBalance >= stealAmount) {
            userBalances[victimUsername].balance -= stealAmount;
        } else {
            stealAmount = victimBalance;
            userBalances[victimUsername].balance = 0;
        }

        userBalances[thiefUsername].balance = (userBalances[thiefUsername].balance || 0) + stealAmount;
        saveBalances();

        respondWithMessage.call(this, `💵🤏 ${thiefNickname} successfully stole 💵 ${stealAmount.toLocaleString()} GBX from ${victimNickname}!`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

/*if (wsmsg["text"].toLowerCase() === ".top" || wsmsg["text"].toLowerCase() === ".leaderboard") {
    let categories = [
        { name: "GojiBux", emoji: "💵", data: userBalances, key: "balance", unit: "GBX" },
        { name: "Offshore", emoji: "💰", data: userStashes, key: null, unit: "GBX" },
        { name: "Weed", emoji: "🥦", data: userWeedStashes, key: null, unit: "g" },
        { name: "Hidden Weed", emoji: "🔒", data: userHiddenWeed, key: null, unit: "g" },
        { name: "Joints", emoji: "🥖", data: userJointStashes, key: null, unit: "Joints" },
        { name: "Spaget", emoji: "🍝", data: userSpaghettiStashes, key: null, unit: "Spaget" },
        { name: "Pizza", emoji: "🍕", data: userPizzaStashes, key: null, unit: "Pizza" }
    ];

    let leaderboard = "🏆 Top Players 🏆\n";

    categories.forEach(({ name, emoji, data, key, unit }) => {
        let sortedUsers = Object.entries(data)
            .sort((a, b) => ((key ? (b[1]?.[key] || 0) : (b[1] || 0)) - (key ? (a[1]?.[key] || 0) : (a[1] || 0))));

        if (sortedUsers.length > 0) {
            let [username, stash] = sortedUsers[0];
            let value = key ? stash[key] || 0 : stash || 0;

            if (value > 0) {
                const nickname = userNicknames[username]?.nickname || username;
                //leaderboard += `${emoji} ${nickname} (${username}) - ${value.toLocaleString()} ${unit}\n`;
                leaderboard += `${emoji} ${username} - ${value.toLocaleString()} ${unit}\n`;
            }
        }
    });

    respondWithMessage.call(this, leaderboard.trim());
}*/

//-----------------------------------------------------------------------------------------------------------------------------------

// 🏆 `.topall` / `.leaderboard` / `.top` - Show top users in each category (single message)
const topallTriggers = [".topall", ".leaderboard", ".top"];
const commandText = wsmsg["text"].toLowerCase().trim();

if (topallTriggers.includes(commandText)) {
    let categories = [
        { name: "GojiBux", emoji: "💵", data: userBalances, key: "balance", unit: "GBX" },
        { name: "Offshore", emoji: "💰", data: userStashes, key: null, unit: "GBX" },
        { name: "Weed", emoji: "🥦", data: userWeedStashes, key: null, unit: "g" },
        { name: "Hidden Weed", emoji: "🔒", data: userHiddenWeed, key: null, unit: "g" },
        { name: "Joints", emoji: "🥖", data: userJointStashes, key: null, unit: "Joints" },
        { name: "Spaget", emoji: "🍝", data: userSpaghettiStashes, key: null, unit: "SPG" },
        { name: "Pizza", emoji: "🍕", data: userPizzaStashes, key: null, unit: "PZA" },
        { name: "Cookies", emoji: "🍪", data: userCookieStashes, key: null, unit: "Cookies" },
        { name: "Frogs", emoji: "🐸", data: userFrogCounts, key: null, unit: "Frogs" },
        { name: "Potatoes", emoji: "🥔", data: userPotatoCounts, key: null, unit: "Potatoes" }
    ];

    let lines = ["🏆 Top Players 🏆"];

    categories.forEach(({ name, emoji, data, key, unit }) => {
        const sortedUsers = Object.entries(data || {})
            .sort((a, b) => ((key ? (b[1]?.[key] || 0) : (b[1] || 0)) - (key ? (a[1]?.[key] || 0) : (a[1] || 0))));

        if (sortedUsers.length > 0) {
            const [username, stash] = sortedUsers[0];
            const value = key ? stash[key] || 0 : stash || 0;

            if (value > 0) {
                const nickname = userNicknames[username]?.nickname || username;
                lines.push(`${emoji} ${nickname} - ${value.toLocaleString()} ${unit}`);
            } else {
                lines.push(`${emoji} No ${name.toLowerCase()} data found.`);
            }
        } else {
            lines.push(`${emoji} No ${name.toLowerCase()} data found.`);
        }
    });

    const message = lines.join("\n");
    respondWithMessage(message.length > 300 ? message.slice(0, 295) + "…" : message);
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topcoin") {
    let gojiCoinBalances = JSON.parse(localStorage.getItem("gojiCoinBalances")) || {};

    if (Object.keys(gojiCoinBalances).length === 0) {
        respondWithMessage.call(this, "💎 No one owns any GojiCoins yet! Be the first to flex.");
        return;
    }

    let sortedUsers = Object.entries(gojiCoinBalances)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    const medals = ["🥇", "🥈", "🥉"];

    let leaderboard = sortedUsers.map(([user, coins], index) =>
        `${medals[index]} ${user} - 💎 ${coins.toLocaleString()} GojiCoin${coins !== 1 ? "s" : ""}`
    ).join("\n");

    respondWithMessage.call(this, `🏆 Top 3 GojiCoin Holders 💎\n${leaderboard}`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topbux") {
    let sortedUsers = Object.entries(userBalances)
        .sort((a, b) => (b[1]?.balance || 0) - (a[1]?.balance || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No GojiBux data available.");
        return;
    }

    let leaderboard = "🏆 Top 3 GojiBux Holders 💵\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, data], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${medals[index]} ${nickname} - 💵 ${data.balance.toLocaleString()} GBX\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topstashbux") {
    let sortedOffshoreUsers = Object.entries(userStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedOffshoreUsers.length === 0) {
        respondWithMessage.call(this, "🏝️ No offshore stash data available.");
        return;
    }

    let leaderboard = "🏆 Top 3 Offshore Stashes 💰\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedOffshoreUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${medals[index]} ${nickname} - 💰 ${stash.toLocaleString()} GBX\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topweed") {
    let sortedWeedUsers = Object.entries(userWeedStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedWeedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No weed stash data available.");
        return;
    }

    let leaderboard = "🏆 Top 3 Weed Stashes 🥦\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedWeedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${medals[index]} ${nickname} - 🥦 ${stash.toLocaleString()} grams\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topjoint") {
    const sortedUsers = Object.entries(userJointStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .filter(([username, stash]) => stash > 0)
        .slice(0, 3); // Top 3 only

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 Nobody has any joints to flex.");
        return;
    }

    let leaderboard = "🏆 Top 3 Joint Rollers 🥖\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${medals[index]} ${nickname} - ${stash.toLocaleString()} Joints\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topspaget") {
    let sortedUsers = Object.entries(userSpaghettiStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No spaghetti data available.");
        return;
    }

    let leaderboard = "🏆 Top 3 Spaget Hoarders 🍝\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const prefix = medals[index];
        leaderboard += `${prefix} ${nickname} - 🍝 ${stash.toLocaleString()} SPG\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".toppizza") {
    let sortedUsers = Object.entries(userPizzaStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No pizza data available.");
        return;
    }

    let leaderboard = "🏆 Top 3 Pizza Hoarders 🍕\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const prefix = medals[index];
        leaderboard += `${prefix} ${nickname} - 🍕 ${stash.toLocaleString()} PZA\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topcookie") {
    let sortedUsers = Object.entries(userCookieStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🍪 No cookies? CRUMBS! Somebody dunk something!");
        return;
    }

    let leaderboard = "🏆 Cookie Chaos 🍪\n";
    const medals = ["🥇", "🥈", "🥉"];
    const cookieTitles = [
        "🚀 Intergalactic Biscuit Baron",
        "👑 Crumb Commander",
        "🎩 Cookie Collector Deluxe"
    ];

    sortedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const title = cookieTitles[index] || "🍪 Cookie Creature";
        const medal = medals[index] || "🍪";
        leaderboard += `${medal} ${nickname} - ${title} - ${stash.toLocaleString()} COOKIES\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".topfrog") {
    let sortedUsers = Object.entries(userFrogCounts)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No frog data available.");
        return;
    }

    let leaderboard = "🏆 Frog Frenzy 🐸\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, count], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const prefix = medals[index];
        leaderboard += `${prefix} ${nickname} - 🐸 ${count.toLocaleString()} frog${count !== 1 ? "s" : ""}\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".toppotato") {
    let sortedUsers = Object.entries(userPotatoCounts)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No potato data available.");
        return;
    }

    let leaderboard = "🏆 Spud Supreme 🥔\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, count], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const prefix = medals[index];
        leaderboard += `${prefix} ${nickname} - 🥔 ${count.toLocaleString()} potato${count !== 1 ? "es" : ""}\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".leastbux") {
    let sortedUsers = Object.entries(userBalances)
        .sort((a, b) => (a[1]?.balance || 0) - (b[1]?.balance || 0))
        .slice(0, 3);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No GojiBux data available.");
        return;
    }

    let leaderboard = "🏆 Bottom 3 GojiBux Holders 💵\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedUsers.forEach(([username, data], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const prefix = medals[index];
        leaderboard += `${prefix} ${nickname} - 💵 ${data.balance.toLocaleString()} GBX\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".leastweed") {
    let sortedWeedUsers = Object.entries(userWeedStashes)
        .sort((a, b) => (a[1] || 0) - (b[1] || 0))
        .slice(0, 3);

    if (sortedWeedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No weed stash data available.");
        return;
    }

    let leaderboard = "🏆 Bottom 3 Weed Stashes 🥦\n";
    const medals = ["🥇", "🥈", "🥉"];

    sortedWeedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        const prefix = medals[index];
        leaderboard += `${prefix} ${nickname} - 🥦 ${stash.toLocaleString()} grams\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 📊 `.balance` and `.wallet` - Show full economy details for the user
if (wsmsg["text"].toLowerCase().startsWith(".balance") || wsmsg["text"].toLowerCase().startsWith(".wallet")) {
    const args = wsmsg["text"].split(" ");
    let targetUsername;

    if (args.length > 1) {
        // If a username is provided, look up the user
        targetUsername = args[1];

        if (!userNicknames[targetUsername]) {
            respondWithMessage.call(this, `🤖 Could not find a user with the username ${targetUsername}.`);
            return;
        }
    } else {
        // No argument provided, use the sender's username
        const handle = wsmsg["handle"];
        targetUsername = userHandles[handle];

        if (!targetUsername) {
            respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
            return;
        }
    }

    const targetUser = userNicknames[targetUsername];
    if (!targetUser) {
        respondWithMessage.call(this, "🤖 Error: User data is missing.");
        return;
    }

    const balance = userBalances[targetUsername]?.balance || 0; // GojiBux balance
    const offshore = userStashes[targetUsername] || 0; // Offshore stash
    const weed = userWeedStashes[targetUsername] || 0; // Weed stash
    const hiddenWeed = userHiddenWeed[targetUsername] || 0; // Hidden weed stash
    const joints = userJointStashes[targetUsername] || 0; // Joint stash

    respondWithMessage.call(this,
        `💼 ${targetUser.nickname || targetUsername}'s Wallet:\n` +
        `💵 GojiBux: ${balance.toLocaleString()} GBX\n` +
        `💰 Offshore: ${offshore.toLocaleString()} GBX\n` +
        `🥦 Weed: ${weed.toLocaleString()}g\n` +
        `🔒 Hidden: ${hiddenWeed.toLocaleString()}g\n` +
        `🥖 Joints: ${joints.toLocaleString()}`
    );
}

//-----------------------------------------------------------------------------------------------------------------------------------

/*if (wsmsg["text"].toLowerCase() === ".menu") {
    const shopItems = [
        { name: "cookie", emoji: "🍪", price: 0, desc: "FREE COOKIE!!!" },
        { name: "potato", emoji: "🥔", price: 1, desc: "Literally just a potato." },
        { name: "egg", emoji: "🥚", price: 100, desc: "Mystery inside." },
        { name: "banana", emoji: "🍌", price: 333, desc: "Insert slippery joke here." },
        { name: "apple", emoji: "🍎", price: 420, desc: "Tempting and crunchy." },
        { name: "icecream", emoji: "🍦", price: 420, desc: "Cold treat, warm heart." },
        { name: "candy", emoji: "🍬", price: 500, desc: "Sugar rush unlocked." },
        { name: "bread", emoji: "🍞", price: 666, desc: "Holy carb." },
        { name: "donut", emoji: "🍩", price: 999, desc: "Frosted, fried, and fabulous." },
        { name: "cheese", emoji: "🧀", price: 1111, desc: "Smells stronger than your will." },
        { name: "waffle", emoji: "🧇", price: 2000, desc: "Grid of deliciousness." },
        { name: "pancake", emoji: "🥞", price: 2222, desc: "Stacks on stacks." },
        { name: "ramen", emoji: "🍜", price: 3000, desc: "Hot noodle soup for the soul." },
        { name: "sammich", emoji: "🥪", price: 3500, desc: "Two breads. Infinite possibilities." },
        { name: "hotdog", emoji: "🌭", price: 3500, desc: "The forbidden sandwich." },
        { name: "shrimp", emoji: "🍤", price: 4000, desc: "Fried sea boi." },
        { name: "taco", emoji: "🌮", price: 4200, desc: "Crunchwrap vibes." },
        { name: "pizza", emoji: "🍕", price: 5000, desc: "Fresh! Hot! Cheesy!" },
        { name: "cake", emoji: "🍰", price: 6000, desc: "Let them eat it." },
        { name: "burger", emoji: "🍔", price: 7000, desc: "Beefy. Cheesy. Classic." },
        { name: "sushi", emoji: "🍣", price: 8888, desc: "Raw elegance." },
        { name: "spaget", emoji: "🍝", price: 10000, desc: "Garlicy noodle delight." },
        { name: "steak", emoji: "🥩", price: 15000, desc: "Cooked rare. Or else." },
        { name: "frog", emoji: "🐸", price: 1000000, desc: "A frog! Ribbit." },
        { name: "coin", emoji: "💎", price: 1000000000, desc: "Shiny GojiCoin!" }
    ];

    let menuText = "🛒 GojiShop Menu — Use `.buy[item] [amount]`\n";
    for (const item of shopItems) {
        menuText += `${item.emoji} \`${item.name}\` — 💵 ${item.price.toLocaleString()} GBX — 🏷 ${item.desc}\n`;
    }

    respondWithMessage.call(this, menuText.trim());
}*/

if (wsmsg["text"].toLowerCase().startsWith(".menu")) {
    const shopItems = [
        { name: "Cookie", emoji: "🍪", price: 0, desc: "FREE COOKIE!!!" },
        { name: "Potato", emoji: "🥔", price: 1, desc: "Literally just a potato." },
        //{ name: "Egg 🔜", emoji: "🥚", price: 100, desc: "Mystery inside." },
        //{ name: "Banana 🔜", emoji: "🍌", price: 333, desc: "Insert slippery joke here." },
        //{ name: "Apple 🔜", emoji: "🍎", price: 420, desc: "Tempting and crunchy." },
        //{ name: "Icecream 🔜", emoji: "🍦", price: 420, desc: "Cold treat, warm heart." },
        //{ name: "Candy 🔜", emoji: "🍬", price: 500, desc: "Sugar rush unlocked." },
        //{ name: "Bread 🔜", emoji: "🍞", price: 666, desc: "Holy carb." },
        //{ name: "Donut 🔜", emoji: "🍩", price: 999, desc: "Frosted, fried, and fabulous." },
        //{ name: "Cheese 🔜", emoji: "🧀", price: 1111, desc: "Smells stronger than your will." },
        //{ name: "Waffle 🔜", emoji: "🧇", price: 2000, desc: "Grid of deliciousness." },
        //{ name: "Pancake 🔜", emoji: "🥞", price: 2222, desc: "Stacks on stacks." },
        //{ name: "Ramen 🔜", emoji: "🍜", price: 3000, desc: "Hot noodle soup for the soul." },
        //{ name: "Sammich 🔜", emoji: "🥪", price: 3500, desc: "Two breads. Infinite possibilities." },
        //{ name: "Hotdog 🔜", emoji: "🌭", price: 3500, desc: "The forbidden sandwich." },
        //{ name: "Shrimp 🔜", emoji: "🍤", price: 4000, desc: "Fried sea boi." },
        //{ name: "Taco 🔜", emoji: "🌮", price: 4200, desc: "Crunchwrap vibes." },
        //{ name: "Pizza 💱", emoji: "🍕", price: 5000, desc: "Fresh! Hot! Cheesy!" },
        { name: "Pizza", emoji: "🍕", price: 10, desc: "Fresh! Hot! Cheesy!" },
        //{ name: "Cake 🔜", emoji: "🍰", price: 6000, desc: "Let them eat it." },
        //{ name: "Burger 🔜", emoji: "🍔", price: 7000, desc: "Beefy. Cheesy. Classic." },
        //{ name: "Sushi 🔜", emoji: "🍣", price: 8888, desc: "Raw elegance." },
        //{ name: "Spaget 💱", emoji: "🍝", price: 10000, desc: "Garlicy noodle delight." },
        { name: "Spaget", emoji: "🍝", price: 20, desc: "Garlicy noodle delight." },
        //{ name: "Steak 🔜", emoji: "🥩", price: 15000, desc: "Cooked rare. Or else." },
        { name: "Frog", emoji: "🐸", price: 1000000, desc: "A frog coin! Ribbit." },
        { name: "Coin", emoji: "💎", price: 1000000000, desc: "A shiny Goji coin!" }
    ];

    function getFlavorEmoji(item) {
        const name = item.name.toLowerCase();
        if (name.includes("cookie")) return "🆓";
        if (name.includes("potato")) return "🥄";
        if (name.includes("egg")) return "🎭";
        if (name.includes("banana")) return "😂";
        if (name.includes("apple")) return "🍏";
        if (name.includes("icecream")) return "❄️";
        if (name.includes("candy")) return "🍭";
        if (name.includes("bread")) return "🍞";
        if (name.includes("donut")) return "😋";
        if (name.includes("cheese")) return "🧠";
        if (name.includes("waffle")) return "🔳";
        if (name.includes("pancake")) return "🗿";
        if (name.includes("ramen")) return "🔥";
        if (name.includes("sammich") || name.includes("sandwich")) return "🌀";
        if (name.includes("hotdog")) return "🤔";
        if (name.includes("shrimp")) return "🦐";
        if (name.includes("taco")) return "💃";
        if (name.includes("pizza")) return "🔥";
        if (name.includes("cake")) return "👑";
        if (name.includes("burger")) return "🍔";
        if (name.includes("sushi")) return "🧊";
        if (name.includes("spaget")) return "🧄";
        if (name.includes("steak")) return "🔪";
        if (name.includes("frog")) return "🐸";
        if (name.includes("coin")) return "💠";
        return "✨";
    }

    const args = wsmsg["text"].split(" ");
    const page = parseInt(args[1]) || 1;
    const itemsPerPage = 5;
    const totalPages = Math.ceil(shopItems.length / itemsPerPage);

    if (page < 1 || page > totalPages) {
        respondWithMessage.call(this, `⚠️ Invalid page number. Use \`.menu [1-${totalPages}]\` to browse pages.`);
        return;
    }

    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const itemsToShow = shopItems.slice(start, end);

    let menuText = `🏪 GojiShop Menu — Page ${page}/${totalPages} — Use \`.buy[item] [amount]\`\n`;
    for (const item of itemsToShow) {
        const flavor = getFlavorEmoji(item);
        menuText += `${item.emoji} ${item.name} 💵 ${item.price.toLocaleString()} GBX ${flavor} ${item.desc}\n`;
    }

    if (page < totalPages) {
        menuText += `👉 Type \`.menu ${page + 1}\` for the next page!\n`;
    }

    respondWithMessage.call(this, menuText.trim());
}

//-----------------------------------------------------------------------------------------------------------------------------------

// 🔥 `.priceweed` - Show current dynamic weed prices + economy stats with split messages
if (wsmsg["text"].toLowerCase() === ".priceweed") {
    // Ensure all key economy values exist
    const bank = wghBank || 0;
    const gbxReserve = lghBank || 0;
    const totalWeed = Object.values(userWeedStashes || {}).reduce((a, b) => a + (b || 0), 0);
    //const offshoreTotal = Object.values(userStashes || {}).reduce((a, b) => a + (b || 0), 0);
    const hiddenTotal = Object.values(userHiddenWeed || {}).reduce((a, b) => a + (b || 0), 0);

    // Ensure weed prices exist & are valid
    if (isNaN(weedBuyPrice) || isNaN(weedSellPrice)) {
        weedBuyPrice = parseInt(localStorage.getItem("weedBuyPrice")) || Math.floor(20 / 3.5);
        weedSellPrice = parseInt(localStorage.getItem("weedSellPrice")) || Math.floor(weedBuyPrice * 0.8);
    }

    // Ensure weed prices are numbers
    weedBuyPrice = Math.max(1, parseInt(weedBuyPrice));
    weedSellPrice = Math.max(1, parseInt(weedSellPrice));

    // First message (Weed Prices)
    const message1 = `🥦💵 Current Weed Prices:\n➕ Buy: ${weedBuyPrice.toLocaleString()} GBX/g\n➖ Sell: ${weedSellPrice.toLocaleString()} GBX/g`;

    // Second message (Market Stats)
    //const message2 = `📊 Market Stats:\n🏬 WGH Supply: ${bank.toLocaleString()} g\n🏦 LGH Reserve: ${gbxReserve.toLocaleString()} GBX\n🥦 Total Weed: ${totalWeed.toLocaleString()} g\n💰 Offshore Weed: ${offshoreTotal.toLocaleString()} g\n🔒 Hidden Weed: ${hiddenTotal.toLocaleString()} g`;
    const message2 = `📊 Market Stats:\n🏬 WGH Supply: ${bank.toLocaleString()} g\n🏦 LGH Reserve: ${gbxReserve.toLocaleString()} GBX\n🥦 Total Weed: ${totalWeed.toLocaleString()} g\n🔒 Hidden Weed: ${hiddenTotal.toLocaleString()} g`;

    // Send first message
    respondWithMessage.call(this, message1);

    // Send second message after 1000ms delay
    setTimeout(() => {
        respondWithMessage.call(this, message2);
    }, 1000);

    // Debugging log (check console)
    //console.log(`🥦💵 .weedprice command triggered:\n- Buy Price: ${weedBuyPrice} GBX/g\n- Sell Price: ${weedSellPrice} GBX/g\n- WGH: ${bank}\n- LGH: ${gbxReserve}\n- Total Weed: ${totalWeed}\n- Offshore Weed: ${offshoreTotal}\n- Hidden Weed: ${hiddenTotal}`);
    console.log(`🥦💵 .weedprice command triggered:\n- Buy Price: ${weedBuyPrice} GBX/g\n- Sell Price: ${weedSellPrice} GBX/g\n- WGH: ${bank}\n- LGH: ${gbxReserve}\n- Total Weed: ${totalWeed}\n- Hidden Weed: ${hiddenTotal}`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg["text"].toLowerCase() === ".stats") {
    const totalUsers = Object.keys(userNicknames).length;
    const usersWithGojiBux = Object.values(userBalances).filter(user => user.balance > 0).length;
    const usersWithWeed = Object.values(userWeedStashes).filter(amount => amount > 0).length;
    const usersWithJoints = Object.values(userJointStashes).filter(amount => amount > 0).length;
    const usersWithOffshore = Object.values(userStashes).filter(amount => amount > 0).length;
    const usersWithHiddenWeed = Object.values(userHiddenWeed).filter(amount => amount > 0).length;
    const usersWithSpaghetti = Object.values(userSpaghettiStashes).filter(amount => amount > 0).length;
    const usersWithPizza = Object.values(userPizzaStashes).filter(amount => amount > 0).length;

    respondWithMessage.call(this,
        `📊 Bot Stats:\n` +
        `👥 Total Users: ${totalUsers.toLocaleString()}\n` +
        `💵 Users with GojiBux: ${usersWithGojiBux.toLocaleString()}\n` +
        `💰 Users with Offshore Stash: ${usersWithOffshore.toLocaleString()}\n` +
        `🥦 Users with Weed: ${usersWithWeed.toLocaleString()}\n` +
        `🔒 Users with Hidden Weed: ${usersWithHiddenWeed.toLocaleString()}\n` +
        `🥖 Users with Joints: ${usersWithJoints.toLocaleString()}\n` +
        `🍝 Users with Spaget: ${usersWithSpaghetti.toLocaleString()}\n` +
        `🍕 Users with Pizza: ${usersWithPizza.toLocaleString()}`
    );
}

//-----------------------------------------------------------------------------------------------------------------------------------

// ⚠️ `.resetall` - Wipe all economy data (Admin-only)
if (wsmsg["text"].toLowerCase() === ".resetall") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    // Optional: Restrict to Admins (Uncomment & add admin usernames)
    if (!["Goji"].includes(username)) {
        respondWithMessage.call(this, "🚨 You don't have permission to reset the economy!");
        return;
    }

    // Reset economy data
    lghBank = 0; // Reset LGH Bank to starting 0 GBX
    wghBank = 0; // Reset WGH Bank to starting 0g of weed
    userBalances = {}; // Clear all user GojiBux balances
    userStashes = {}; // Clear all offshore GojiBux stashes
    userWeedStashes = {}; // Clear all user weed stashes
    userJointStashes = {}; // Clear all user joint stashes
    userHiddenWeed = {}; // Clear all user hidden weed stashes

    // Save all changes
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("wghBank", wghBank);
    localStorage.setItem("userBalances", JSON.stringify(userBalances));
    localStorage.setItem("userStashes", JSON.stringify(userStashes));
    localStorage.setItem("userWeedStashes", JSON.stringify(userWeedStashes));
    localStorage.setItem("userJointStashes", JSON.stringify(userJointStashes));
    localStorage.setItem("userHiddenWeed", JSON.stringify(userHiddenWeed));

    respondWithMessage.call(this, `🚨 ${nickname} has reset the entire economy!\n💵 LGH Bank: 0 GBX\n🌿 WGH Bank: 0g\nAll user balances, stashes, joints, and hidden weed have been wiped.`);
}

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

if (wsmsg['text'].toLowerCase() === ".self") {
    const handle = wsmsg['handle'];
    const username = userHandles[handle]; // Get persistent username
    const user = userNicknames[username]; // Get user data

    // Ensure user always has at least 1 GBX
    if (!userBalances[username]) {
        userBalances[username] = { balance: 1 };
        saveBalances();
    }

    const balance = userBalances[username].balance; // Fetch GojiBux balance
    const stash = userWeedStashes[username] || 0; // Fetch user's weed stash

    if (user) {
        const messages = [
            `🤖 Your Info:\nNickname: ${user.nickname}\nUsername: ${user.username}\nStatus: ${user.modStatus}\nHandle: ${user.handle}`
            //`💵 GojiBux Balance: ${balance.toLocaleString()} GBX`,
            //`🌿 Weed Stash: ${stash} grams`
        ];

        messages.forEach((msg, index) => {
            setTimeout(() => {
                respondWithMessage.call(this, msg);
            }, index * 1000);
        });
    } else {
        respondWithMessage.call(this, "🤖 Sorry, I couldn't find your information.");
    }
}

if (wsmsg["text"].startsWith(".admin deleteuser ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle]; // Get sender's username

    if (username !== "Goji") {
        respondWithMessage.call(this, "⛔ You do not have permission to use this command.");
        return;
    }

    // Extract target username (case-sensitive)
    const args = wsmsg["text"].split(" ");
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .admin deleteuser <ExactUsername>");
        return;
    }

    const targetUser = args[2]; // Keep case-sensitive username

    if (userNicknames.hasOwnProperty(targetUser)) {
        // Delete all stored data related to the user
        delete userNicknames[targetUser]; // Nicknames
        delete userHandles[targetUser]; // Handles
        delete userBalances[targetUser]; // GojiBux balance
        delete userStashes[targetUser]; // Offshore stash
        delete userWeedStashes[targetUser]; // Weed stash
        delete userHiddenWeed[targetUser]; // Hidden weed stash
        delete userJointStashes[targetUser]; // Joints stash
        delete userSpaghettiStashes[targetUser]; // Spaghetti stash
        delete userPizzaStashes[targetUser]; // Pizza stash

        // Save updates to localStorage
        localStorage.setItem("userNicknames", JSON.stringify(userNicknames));
        localStorage.setItem("userHandles", JSON.stringify(userHandles));
        localStorage.setItem("userBalances", JSON.stringify(userBalances));
        localStorage.setItem("userStashes", JSON.stringify(userStashes));
        localStorage.setItem("userWeedStashes", JSON.stringify(userWeedStashes));
        localStorage.setItem("userHiddenWeed", JSON.stringify(userHiddenWeed));
        localStorage.setItem("userJointStashes", JSON.stringify(userJointStashes));
        localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
        localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

        respondWithMessage.call(this, `🗑️ User **${targetUser}** has been permanently deleted from storage.`);
    } else {
        respondWithMessage.call(this, `🤖 Error: User **${targetUser}** not found.`);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .me (Strictly requires ".me " plus a message)
    if (wsmsg['text'].toLowerCase().startsWith(".me ")) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Bot";

        const message = wsmsg['text'].slice(4).trim(); // Get the string after ".me "

        if (message.length > 0) { // Ensure there's a message after ".me "
            this._send(JSON.stringify({
                stumble: "msg",
                text: `🤖 ${nickname} ${message}` // Send message with nickname + the string
            }));
        }
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .my (Strictly requires ".my " plus a message)
    if (wsmsg['text'].toLowerCase().startsWith(".my ")) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Bot";

        const message = wsmsg['text'].slice(4).trim(); // Get the string after ".my "

        if (message.length > 0) { // Ensure there's a message after ".my "
            this._send(JSON.stringify({
                stumble: "msg",
                text: `🤖 ${nickname}'s ${message}` // Send message with nickname + possessive
            }));
        }
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: "bran" or "goji" (Transfers 10 GBX & 3.5g weed to Goji)
if (wsmsg['text'].toLowerCase() === "bran" || wsmsg['text'].toLowerCase() === "goji") {
    const handle = wsmsg['handle']; // Get the handle
    const username = userHandles[handle]; // Get the username
    const nickname = userNicknames[username]?.nickname || wsmsg['username'] || "you"; // Get nickname, fallback to username or "you"

    const target = wsmsg['text'].toLowerCase() === "bran" ? "Bran" : "Goji"; // Determine which target to use
    let gbxAvailable = userBalances[username]?.balance || 0;
    let weedAvailable = userWeedStashes[username] || 0;
    let transferMessage = "";

    // Transfer 10 GBX to Goji if the user has enough
    if (gbxAvailable >= 10) {
        userBalances[username].balance -= 10;
        userBalances["Goji"] = (userBalances["Goji"] || { balance: 0 });
        userBalances["Goji"].balance += 10;
        saveBalances();
        transferMessage += ` (+10 GBX to Goji)`;
    }

    // Transfer 3.5g of weed to Goji if the user has enough
    if (weedAvailable >= 3.5) {
        userWeedStashes[username] -= 3.5;
        userWeedStashes["Goji"] = (userWeedStashes["Goji"] || 0) + 3.5;
        saveWeedStashes();
        transferMessage += ` (+3.5g to Goji)`;
    }

    setTimeout(() => {
        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${target} farted on ${nickname}! 💨${transferMessage}`
        }));
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Commands: .419 to .430 + .710 + .840 (Now uses 1-3.5g of weed)
if (
    wsmsg['text'] === ".419" || wsmsg['text'] === ".420" || wsmsg['text'] === ".421" ||
    wsmsg['text'] === ".422" || wsmsg['text'] === ".423" || wsmsg['text'] === ".424" ||
    wsmsg['text'] === ".425" || wsmsg['text'] === ".426" || wsmsg['text'] === ".427" ||
    wsmsg['text'] === ".428" || wsmsg['text'] === ".429" || wsmsg['text'] === ".430" ||
    wsmsg['text'] === ".710" || wsmsg['text'] === ".840"
) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    if (!username) return; // Ensure the user is valid

    let weedAvailable = userWeedStashes[username] || 0;
    let weedUsed = parseFloat(((Math.random() * 2.5) + 1).toFixed(1)); // Random amount between 1-3.5g
    let message;

    const timeMessages = {
        ".419": [`${nickname} SMOKES WHEN THEY WANT!`],
        ".420": [`${nickname} is smoking! Cheers! Happy 4:20!`],
        ".421": [`${nickname} is smoking! Cheers! It's 4:21! Let's have some fun!`],
        ".422": [
            `${nickname} is smoking! Cheers! 4:20 2: Electric Boogaloo!`,
            `${nickname} is smoking! Cheers! 4:20 2: The Sequel!`
        ],
        ".423": [`${nickname} is smoking! Cheers! Happy 4:23! Let's smoke some more, you’ll see!`],
        ".424": [
            `${nickname} is smoking! Cheers! Happy 4:24! Let's smoke some more!`,
            `${nickname} is smoking! Cheers! Happy 4:24! Time to score!`
        ],
        ".425": [`Cheers! Happy 4:25! ${nickname}'s feelin alive!`],
        ".426": [
            `${nickname} is smoking! Cheers! Happy 4:26! Roll it quicks!`,
            `${nickname} is smoking! Cheers! Happy 4:26! No seeds, no sticks!`
        ],
        ".427": [`Cheers! Happy 4:27! ${nickname}'s in heaven!`],
        ".428": [`Cheers! Happy 4:28! ${nickname}'s always late!`],
        ".429": [`Cheers! Happy 4:29! ${nickname}'s feelin fine!`],
        ".430": [`${nickname} SMOKES WHEN THEY WANT!`, `${nickname} MISSED 420!`],
        ".710": [
            `${nickname} is smoking! Cheers! It’s 7:10! Let the dabs begin!`,
            `${nickname} is smoking! Cheers! 7:10 again! Dab it up, my friend!`
        ],
        ".840": [`${nickname} is smoking! Cheers! It's 8:40! Twice the 4:20, twice the tokes! 💨`]
    };

    // Pick a random message if multiple are available
    const messages = timeMessages[wsmsg['text']] || ["Error: Invalid time!"];
    message = messages[Math.floor(Math.random() * messages.length)];

    if (weedAvailable >= weedUsed) {
        // Deduct weed
        userWeedStashes[username] -= weedUsed;
        saveWeedStashes();
        message += ` (Used ${weedUsed}g)`;
    } else if (weedAvailable > 0) {
        // Use whatever weed is left if less than required
        weedUsed = weedAvailable;
        userWeedStashes[username] = 0;
        saveWeedStashes();
        message += ` (Used ${weedUsed}g, now dry!)`;
    }

    // Send the final message
    this._send(JSON.stringify({
        stumble: "msg",
        text: `🤖 ${message} 💨`
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

/*if ([".c", ".cheers"].includes(wsmsg['text'].toLowerCase())) { // Convert input to lowercase and check if it's in the list
    const handle = wsmsg['handle']; // Get the user's handle from the message
    const username = userHandles[handle]; // Look up the username using the handle
    const nickname = userNicknames[username]?.nickname || "Someone"; // Get the stored nickname, or default to "Someone"

    if (!username) return; // Ensure the user is valid

    const weedAvailable = userWeedStashes[username] || 0;
    const weedUsed = parseFloat((Math.random() * 0.9 + 0.1).toFixed(1)); // Random amount between 0.1-1.0g

    let message = `🤖 ${nickname} is smokin! Cheers! 🍃💨`;

    if (weedAvailable >= weedUsed) {
        userWeedStashes[username] -= weedUsed;
        saveWeedStashes();
        message += ` (🥦➖ ${weedUsed}g)`;
    }

    this._send(JSON.stringify({
        stumble: "msg",
        text: message
    }));
}*/

if ([".c", ".cheers"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    if (!username) return;

    const nickname = userNicknames[username]?.nickname || "Someone";
    const weedAvailable = userWeedStashes[username] || 0;
    const weedUsed = parseFloat((Math.random() * 0.9 + 0.1).toFixed(1));

    let message = `🤖 ${nickname} is smokin! Cheers! 🍃💨`;

    if (weedAvailable >= weedUsed) {
        userWeedStashes[username] = Math.max(0, weedAvailable - weedUsed);
        saveWeedStashes();
        message += ` (🥦➖ ${weedUsed}g)`;
    } else {
        message += " (But they're out of weed! 😢)";
    }

    this._send(JSON.stringify({
        stumble: "msg",
        text: message
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .sub (case insensitive)
    if (wsmsg['text'].toLowerCase() === ".sub") {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} wants to sub! 🥦🍻`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .sub cheers (Case insensitive, uses 0.1-1g of weed if available)
if ([".sc", ".subcheers", ".subchar", ".schar", ".scheers"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    if (!username) return; // Ensure the user is valid

    let weedAvailable = userWeedStashes[username] || 0;
    let weedUsed = parseFloat(((Math.random() * 0.9) + 0.1).toFixed(1)); // Random amount between 0.1-1g
    let message = `🤖 ${nickname} is subbin! Char! 🥦🍻💨`;

    if (weedAvailable >= weedUsed) {
        // Deduct weed
        userWeedStashes[username] -= weedUsed;
        saveWeedStashes();
        message = `🤖 ${nickname} is subbin! Char! 🥦🍻💨 (🥦➖ ${weedUsed}g)`;
    } else if (weedAvailable > 0) {
        // If they don’t have enough, use what they have left
        weedUsed = weedAvailable;
        userWeedStashes[username] = 0;
        saveWeedStashes();
        message = `🤖 ${nickname} is subbin! Char! 🌲🍻💨 (🥦➖ ${weedUsed}g, now dry!)`;
    }

    // Send the final message
    this._send(JSON.stringify({
        stumble: "msg",
        text: message
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .toke or .tokes (case insensitive)
    if ([".t", ".toke", ".tokes"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} wants to toke! 🥦 Join em! 💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .grinding (Case-insensitive, deducts 1-5g of weed for grinding)
if ([".g", ".grind", ".grindin", ".grinding"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    if (!username) return; // Ensure the user is valid

    let weedAvailable = userWeedStashes[username] || 0;
    let weedUsed = parseFloat(((Math.random() * 4) + 1).toFixed(1)); // Random amount between 1-5g
    let message = `🤖 ${nickname} is grinding bud for tokes! 🥦🔄💨`;

    if (weedAvailable >= weedUsed) {
        // Deduct 1-5g of weed for grinding
        userWeedStashes[username] -= weedUsed;
        saveWeedStashes();
        message = `🤖 ${nickname} is grinding bud for tokes! 🥦🔄💨 (Used ${weedUsed}g)`;
    } else if (weedAvailable > 0) {
        // Use whatever weed is left if less than required
        weedUsed = weedAvailable;
        userWeedStashes[username] = 0;
        saveWeedStashes();
        message = `🤖 ${nickname} is scraping up the last bits to grind. 🥦🔄💨 (Used ${weedUsed}g, now dry!)`;
    }

    // Send the final message
    this._send(JSON.stringify({
        stumble: "msg",
        text: message
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .heating (case insensitive)
    if ([".h", ".heat", ".heatin", ".heating"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is heatin! 🔥`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .cooling (case insensitive)
    if ([".co", ".cooling", ".cool", ".coolin"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is coolin! ❄️`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .dabbin (case insensitive)
    if ([".dc", ".dabbin", ".dabbing"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is dabbin! Cheers! 💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .dab (case insensitive)
    if ([".d", ".dab"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} wants to dab! Heat em up! 🔥💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .joint (Case insensitive, uses a joint if available, otherwise rolls & smokes 1-3.5g of weed)
if ([".j", ".joint"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    if (!username) return; // Ensure the user is valid

    let weedAvailable = userWeedStashes[username] || 0;
    let jointsAvailable = userJointStashes[username] || 0;
    let weedUsed = parseFloat(((Math.random() * 2.5) + 1).toFixed(1)); // Random amount between 1-3.5g
    let message = `🤖 ${nickname} is smokin' a joint! Cheers! 🥦💨`;

    if (jointsAvailable > 0) {
        // User smokes a joint
        userJointStashes[username]--;
        saveJointStashes();
        message = `🤖 ${nickname} sparked up a joint! Cheers! 🥖💨 (🥖➖ 1)`;
    } else if (weedAvailable >= weedUsed) {
        // If no joints, roll & smoke loose weed (1-3.5g)
        userWeedStashes[username] -= weedUsed;
        saveWeedStashes();
        message = `🤖 ${nickname} rolled & smoked a fat one! 🥖💨 (🥦➖ ${weedUsed}g)`;
    } else if (weedAvailable > 0) {
        // If they don’t have enough, just use what they have left
        weedUsed = weedAvailable;
        userWeedStashes[username] = 0;
        saveWeedStashes();
        message = `🤖 ${nickname} scraped together enough for a small joint. 🥖💨 (🥦➖ ${weedUsed}g, now dry!)`;
    }

    // Send the final message
    this._send(JSON.stringify({
        stumble: "msg",
        text: message
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .blunt (case insensitive)
    if ([".bc", ".blunt"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is smokin a blunt! Cheers! 🥖💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .pc .pp .pipe .pipecheers (case insensitive)
if ([".pc", ".pp", ".pipe", ".pipecheers"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    this._send(JSON.stringify({
        stumble: "msg",
        text: `🤖 ${nickname} is smokin! Cheers! 🥦💨`
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .prep (case insensitive)
    if ([".p", ".prep", ".preppin", ".prepping", ".pack", ".packin", ".packing"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is packin! 🥦`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .set (Case insensitive, no longer uses weed)
if ([".s", ".set", ".packed", ".ready"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    if (!username) return; // Ensure the user is valid

    const message = `🤖 ${nickname} is set! 🥦`; // No weed usage or deduction

    // Send the final message
    this._send(JSON.stringify({
        stumble: "msg",
        text: message
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .throat / .throats
    if ([".throat", ".throats", ".coffee", "coffeecheers"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is throating their coffee! Cheers? ☕`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .bc
    if (wsmsg['text'].toLowerCase() === ".bcb") {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname.toUpperCase()} IS IN BC, BABY! 🍁🏔️`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .jam
    if (wsmsg['text'].toLowerCase() === ".jam") {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        const responses = [
            `THIS IS ${nickname.toUpperCase()}'S JAM!! 🎶`,
            `TURN IT UP, ${nickname.toUpperCase()}!! 🔊🎵`,
            `🎶 ${nickname.toUpperCase()} IS FEELING THIS ONE!! 💃`,
            `🔥 ${nickname.toUpperCase()} VIBIN’ TO THIS!! 🎧`,
            `🎵 ${nickname.toUpperCase()} KNOWS WHAT'S UP!! 🚀`,
            `BIG MOOD FOR ${nickname.toUpperCase()}!! 🎶🔥`,
            `💥 ${nickname.toUpperCase()} CAN'T RESIST THIS ONE!! 🎼`,
            `🎸 THIS TRACK HITS DIFFERENT FOR ${nickname.toUpperCase()}!! 🤘`,
            `🎤 ${nickname.toUpperCase()} SINGIN’ ALONG!! 🔥`,
            `DJ ${nickname.toUpperCase()} APPROVES THIS BANGER!! 🎛️🎚️`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        this._send(JSON.stringify({
            stumble: "msg",
            text: randomResponse
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .tune
    if (wsmsg['text'].toLowerCase() === ".tune") {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        const responses = [
            `🎶 ${nickname.toUpperCase()} IS TUNED IN!! 📻`,
            `THIS TUNE HITS JUST RIGHT FOR ${nickname.toUpperCase()}!! 🎵`,
            `🔊 ${nickname.toUpperCase()} IS LOCKED INTO THE FREQUENCY!! 📡`,
            `🎼 ${nickname.toUpperCase()} FEELIN’ THIS MELODY!! 💫`,
            `🎧 ${nickname.toUpperCase()} KNOWS A GOOD TUNE WHEN THEY HEAR ONE!!`,
            `🔥 THIS ONE’S GOT ${nickname.toUpperCase()} NODDING ALONG!! 🎶`,
            `🎤 ${nickname.toUpperCase()} CAN'T HELP BUT HUM ALONG!!`,
            `🎻 A FINE SELECTION FOR ${nickname.toUpperCase()}!! CLASSY!`,
            `DJ ${nickname.toUpperCase()} APPROVES THIS TUNE!! 🎚️`,
            `🎵 ${nickname.toUpperCase()} JUST FOUND THEIR NEW FAVORITE TUNE!! 🚀`
        ];

        const randomResponse = responses[Math.floor(Math.random() * responses.length)];

        this._send(JSON.stringify({
            stumble: "msg",
            text: randomResponse
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .penis (case insensitive)
if (wsmsg['text'].toLowerCase().startsWith(".penis")) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    // Generate random length for the penis (8D to 8=====================D)
    const length = Math.floor(Math.random() * 22); // Generates a number between 0 and 21
    const penis = `8${"=".repeat(length)}D`;

    this._send(JSON.stringify({
        stumble: "msg",
        text: `🤖 ${nickname}'s penis is this long: ${penis}`
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .vagina (case insensitive)
if (wsmsg['text'].toLowerCase().startsWith(".vagina")) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    // Generate random tightness level (1 = tightest (()), 10+ = loosest (((____))))
    const tightnessLevel = Math.floor(Math.random() * 11) + 1; // Generates a number between 1 and 11

    const inner = "_" .repeat(tightnessLevel - 1); // Expands with _
    const vagina = `((${inner})`;

    this._send(JSON.stringify({
        stumble: "msg",
        text: `🤖 ${nickname}'s vagina is this tight: ${vagina}`
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .smoko
        if (wsmsg['text'].toLowerCase().startsWith(".smoko")) {
            const handle = wsmsg['handle'];
            const username = userHandles[handle];
            const nickname = userNicknames[username]?.nickname || "Someone";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `🤖 ${nickname.toUpperCase()} IS ON SMOKO! SO LEAVE EM ALONE! 🎶`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .piss
        if (wsmsg['text'].toLowerCase().startsWith(".piss")) {
            const handle = wsmsg['handle'];
            const username = userHandles[handle];
            const nickname = userNicknames[username]?.nickname || "Someone";

            this._send(JSON.stringify({
                stumble: "msg",
                text: `🤖 ${nickname.toUpperCase()} HAS TO PISS PISS! 💦`
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .pooping (Random responses)
    if (/^\.poop(ing|ed)?$/i.test(wsmsg['text'])) { // Case-insensitive due to the /i flag
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        const responses = [
            `🤖 ${nickname} is pooping! 💩`,
            `🤖 ${nickname} took a break! 💩`,
            `🤖 ${nickname} is dropping the kids off at the pool! 💩`
        ];

        this._send(JSON.stringify({
            stumble: "msg",
            text: responses[Math.floor(Math.random() * responses.length)]
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .farting (Random responses)
    if (/^\.fart(ing|ed)?$/i.test(wsmsg['text'])) { // Case-insensitive due to the /i flag
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        const responses = [
            `🤖 ${nickname} let out a loud fart! 💨`,
            `🤖 ${nickname} just ripped one! 💨`,
            `🤖 ${nickname} is blasting some gas! 💨`
        ];

        this._send(JSON.stringify({
            stumble: "msg",
            text: responses[Math.floor(Math.random() * responses.length)]
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .burp (Random responses)
    if (/^\.burp(ed|ing)?$/i.test(wsmsg['text'])) { // Case-insensitive due to the /i flag
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        const responses = [
            `🤖 ${nickname} let out a big burp! 🍺💨`,
            `🤖 ${nickname} just belched loudly! 🤢`,
            `🤖 ${nickname} is burping up a storm! 💨`
        ];

        this._send(JSON.stringify({
            stumble: "msg",
            text: responses[Math.floor(Math.random() * responses.length)]
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .owner (Requires & burns 1,000,000 GBX)
if (wsmsg['text'].toLowerCase().startsWith(".owner")) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    if (!username) return; // Ensure the user is valid

    const cost = 1_000_000; // 1 million GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 1,000,000 GBX to become the room owner. Keep grinding, peasant! 💸`);
        return;
    }

    // Deduct 1,000,000 GBX
    userBalances[username].balance -= cost;
    saveBalances();

    // Announce the "ownership"
    this._send(JSON.stringify({
        stumble: "msg",
        text: `🤖 ${nickname} IS THE ROOM OWNER NOW! 💰🔥 (Balance -1,000,000 GBX lol)`
    }));

    // Follow up after 2 seconds for extra trolling
    setTimeout(() => {
        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 Just kidding. You literally just burned 1,000,000 GBX for NOTHING. 😂💸`
        }));
    }, 2000);
}

// Kinky Commands -------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .boof 💨
if (wsmsg['text'].toLowerCase().startsWith(".boof")) {
    setTimeout(() => {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        const boofResponses = [
            `${nickname} just boofed a fat one! 🚀💨`,
            `Uh-oh, ${nickname} went for the boof special! 🍑💨`,
            `Boof alert! ${nickname} is on another level now. 🚀`,
            `Some say ${nickname} just discovered a new dimension through boofing. 🤯`,
            `Hold up... did ${nickname} just boof that? 🔥`,
            `Legend has it ${nickname} once boofed so hard, time stopped. ⏳`,
            `Boofing detected! ${nickname} is about to take off. 🚀💨`,
            `Careful, ${nickname}, too much boofing and you might achieve enlightenment. 🌌`,
            `Breaking news: ${nickname} has officially become a boof master. 🎓💨`,
            `Boof success! ${nickname} is riding the cosmic waves. 🌊✨`,
            `10/10 boof technique, ${nickname}. You should teach a class. 🎓💨`,
            `Boof gods smile upon ${nickname} today. 🙏🔥`,
            `${nickname}, you absolute mad lad! Another boof in the books. 📖💨`,
            `Rumors say ${nickname} once boofed a whole ounce. 🏆🔥`,
            `If boofing was an Olympic sport, ${nickname} would take gold. 🥇💨`,
            `Scientifically speaking, ${nickname} has achieved peak boof velocity. 📡🚀`,
            `BOOF BOOST ACTIVATED! ${nickname} is now operating at 200% power. ⚡🔥`,
            `RIP gravity, ${nickname} just boofed into orbit. 🛰️💨`,
            `Legend says ${nickname} boofed so hard, the WiFi cut out. 📶🚫`
        ];

        const randomBoofResponse = boofResponses[Math.floor(Math.random() * boofResponses.length)];

        this._send(JSON.stringify({
            stumble: "msg",
            text: randomBoofResponse
        }));
    }, 1000);
}

// General Commands -----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .help or .halp (case insensitive)
if ([".help", ".halp"].includes(wsmsg['text'].toLowerCase())) {
    const messages = [
        "🤖 Need help? No worries!",
        "- Use .commands to see a list of available commands.",
        //"- Use .gojibux to start playing.",
        //"- Use .grow to get weed.",
        "- Economy commands: https://tinyurl.com/getgbx",
        //"- This bot keeps the vibes high and the chat rolling! 💨🌲",
        //"- Have fun and don't forget to pass it to the left! 🔥"
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            this._send(JSON.stringify({
                stumble: "msg",
                text: msg
            }));
        }, index * 1000); // Each message gets delayed by 1000ms (1 second)
    });
}

//-----------------------------------------------------------------------------------------------------------------------------------

        // start Bot repo
        if (wsmsg['text'].toLowerCase() === ".bot") {
        const lines = [
            "🤖 Download the bot here: https://github.com/GojiBran/StumbleBot",
            "Just for YouTube here: https://github.com/GojiBran/stumbletube"
        ];

        lines.forEach((line, index) => {
            setTimeout(() => {
                this._send(`{"stumble":"msg","text":"${line}"}`);
            }, 1000 * index); // 1000ms delay between each line
        });
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Handle the ".commands list" command to output the commands link
        if (wsmsg['text'].toLowerCase() === '.commands list') {
            this._send(`{"stumble":"msg","text":"🤖 Bot Commands: https://github.com/GojiBran/SuperStumbleBot-Commands"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Handle the ".commands" command to output the list of commands in batches of 6 lines with line breaks
        if (wsmsg['text'].toLowerCase() === '.commands') {
            // Define the commands
            const commandsList = [
                "| .yt   - link or query",
                "| .t    - Tokes",
                "| .d    - Dabs",
                "| .c    - Cheers",
                "| .dc   - Dab Cheers",
                "| .j    - Joint Cheers",
                "| .b    - Blunt Cheers",
                "| .sc   - Sub Cheers",
                "| .420  - 4:20 Cheers",
                "| .p    - Packin",
                "| .s    - Set",
                "| .h    - Heatin",
                "| .co   - Coolin",
                "| .tits - posts gifs",
                "| .ass  - posts gifs"
            ];

            // Function to send commands in batches of 5 lines with line breaks
            const sendCommandsInBatches = (list, index = 0) => {
                if (index < list.length) {
                    const batch = list.slice(index, index + 5).join("\\n");
                    this._send(`{"stumble":"msg","text":"${batch}"}`);
                    setTimeout(() => sendCommandsInBatches(list, index + 5), 1000); // Delay 1000ms before sending the next batch
                }
            };

            // Start sending the commands in batches
            sendCommandsInBatches(commandsList);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .team (case insensitive)
    if ([".team"].includes(wsmsg['text'].toLowerCase())) {
        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 HEY TEAM!`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start bacon
    if (wsmsg['text'].toLowerCase() === ".bacon") {
        this._send('{"stumble":"msg","text":".yt bacon 45min"}'); // yes lazy
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Start whiteboard commands
    if ([".whiteboard", ".board", ".draw"].includes(wsmsg['text'].toLowerCase())) {
        this._send('{"stumble":"msg","text":"LGH Whiteboard (this could be chaos 😅): https://www.tldraw.com/f/76S9QIaur32SEs33sbUlG"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start usa commands
    if ([".usa", ".murica", ".america"].includes(wsmsg['text'].toLowerCase())) {
        this._send('{"stumble":"msg","text":"https://i.imgur.com/tYeS04g.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start pup
    if (wsmsg['text'].toLowerCase() === ".pup") {
        this._send('{"stumble":"msg","text":"https://i.imgur.com/kKlUBVR.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start orange juice
    if (wsmsg['text'].toLowerCase() === ".oj") {
        this._send('{"stumble":"msg","text":"https://i.imgur.com/pTMweVs.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start wall
    if (wsmsg['text'].toLowerCase() === ".wall") {
        this._send('{"stumble":"msg","text":"https://i.imgur.com/fRSZmqL.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Large list of malaphors
const malaphors = [
    "We'll burn that bridge when we get to it.",
    "It's not rocket surgery.",
    "I’ll jump off that bridge when I come to it.",
    "He's not the sharpest cookie in the jar.",
    "You hit the nail right on the nose.",
    "Don’t count your chickens before they hatch in one basket.",
    "It’s like comparing apples and oranges to a barn door.",
    "Bite the bullet and eat your cake too.",
    "He’s a loose cannon that shoots straight from the hip.",
    "We’ll cross that road when it comes back to bite us.",
    "It’s the pot calling the kettle a spade.",
    "Let’s get all our ducks on the same page.",
    "That’s the way the cookie bounces.",
    "We’re barking up the wrong rabbit hole.",
    "She’s a wolf in cheap clothing.",
    "You can’t have your cake before the horse.",
    "He spilled the beans and let the cat out of Pandora’s box.",
    "The early bird gets the worm, but the second mouse gets the cheese.",
    "Don’t put all your eggs in one omelet.",
    "Let’s not jump the shark before it hatches.",
    "Don’t cry over spilt milk under the bridge.",
    "He’s got bigger fish to count.",
    "I dodged a bullet by the skin of my pants.",
    "She was skating on thin eggshells.",
    "He’s a broken record playing devil’s advocate.",
    "It’s not my cup of worms.",
    "Don’t bite the hand that lays the golden eggs.",
    "Keep your eye on the ball and your ear to the ground.",
    "We’re in the same boat but not on the same page.",
    "It’s a dog-eat-dog world, and I’m wearing milk bone underwear.",
    "Let’s throw spaghetti at the wall and see if the shoe fits.",
    "That’s a tough pill to fry.",
    "She’s got a chip on her block.",
    "It’s like herding cats up a hill both ways.",
    "You can lead a horse to water, but you can’t make it change lanes.",
    "He’s not playing with a full bag of marbles.",
    "She let the cat out of the horse’s mouth.",
    "It’s the blind leading the headless.",
    "We’re hitting two birds with one bush.",
    "That’s like trying to nail Jell-O to a moving train.",
    "You made your bed, now lay in your grave.",
    "He threw me under the bus and into the frying pan.",
    "This isn’t my first rodeo at the circus.",
    "It’s a fine line between a rock and a hard place.",
    "She’s up a creek without a compass.",
    "Don’t put all your ducks before the horse.",
    "It’s like finding a needle in a junk drawer.",
    "You can’t teach an old dog to bark up the wrong tree.",
    "That idea is dead in the bathwater.",
    "Close but no cigar store Indian."
];

// Start .malaphor command
if (wsmsg['text'].toLowerCase() === ".malaphor") {
    let randomMalaphor = malaphors[Math.floor(Math.random() * malaphors.length)];
    this._send(`{"stumble":"msg","text":"🤖 ${randomMalaphor}"}`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// HUGE list of jokes
const jokes = [
    "Why don't skeletons fight each other? They don't have the guts.",
    "I told my wife she should embrace her mistakes. She gave me a hug.",
    "Why do cows have hooves instead of feet? Because they lactose.",
    "Parallel lines have so much in common. It’s a shame they’ll never meet.",
    "What did the janitor say when he jumped out of the closet? Supplies!",
    "I used to play piano by ear, but now I use my hands.",
    "Why couldn’t the bicycle stand up by itself? It was two-tired.",
    "I’m reading a book about anti-gravity. It’s impossible to put down!",
    "I only know 25 letters of the alphabet. I don’t know Y.",
    "Why do seagulls fly over the ocean? Because if they flew over the bay, they’d be bagels.",
    "Did you hear about the guy who got hit with a can of soda? He was lucky it was a soft drink.",
    "Why don’t some couples go to the gym? Because some relationships don’t work out.",
    "I ordered a chicken and an egg online. I’ll let you know which comes first.",
    "How does a penguin build its house? Igloos it together.",
    "Why did the scarecrow win an award? Because he was outstanding in his field.",
    "I told my suitcase that there will be no vacation this year. Now I'm dealing with emotional baggage.",
    "Why do math books look sad? Because they have too many problems.",
    "What’s orange and sounds like a parrot? A carrot.",
    "Why don’t eggs tell jokes? Because they might crack up.",
    "I tried to make a belt out of watches, but it was a waist of time.",
    "Did you hear about the restaurant on the moon? Great food, no atmosphere.",
    "I would tell you a chemistry joke, but I know I wouldn’t get a reaction.",
    "Want to hear a construction joke? Oh, never mind—I'm still working on it.",
    "Why did the golfer bring two pairs of pants? In case he got a hole in one.",
    "Did you hear about the kidnapping at school? It’s okay, he woke up.",
    "Why did the chicken go to the séance? To talk to the other side.",
    "I used to be a baker, but I couldn’t make enough dough.",
    "Why did the coffee file a police report? It got mugged.",
    "What did one ocean say to the other? Nothing, they just waved.",
    "Why did the tomato turn red? Because it saw the salad dressing.",
    "What do you call a fake noodle? An impasta.",
    "Why can’t your nose be 12 inches long? Because then it would be a foot.",
    "I would tell you a joke about an elevator, but it’s an uplifting experience.",
    "I told my wife she should do lunges to stay in shape. That was a big step forward.",
    "I have a joke about time travel, but you didn’t like it.",
    "I tried writing with a broken pencil, but it was pointless.",
    "Why don’t crabs donate? Because they’re shellfish.",
    "How does the moon cut his hair? Eclipse it.",
    "I used to be addicted to soap, but I’m clean now.",
    "Why did the orange stop rolling? Because it ran out of juice.",
    "Why did the scarecrow become a motivational speaker? Because he was outstanding in his field.",
    "What do you call a bear with no teeth? A gummy bear.",
    "Why did the banana go to the doctor? It wasn’t peeling well.",
    "What do you call cheese that isn’t yours? Nacho cheese.",
    "I went to buy some camouflage pants, but I couldn’t find any.",
    "Why did the computer go to the doctor? It caught a virus.",
    "What do you get when you cross a snowman and a vampire? Frostbite.",
    "Did you hear about the cheese factory that exploded? There was nothing left but de-brie.",
    "I told my friend ten jokes to make them laugh. Sadly, no pun in ten did.",
    "Why was the math book sad? Because it had too many problems.",
    "How do you organize a space party? You planet.",
    "I tried to catch some fog earlier. Mist.",
    "Why do cows wear bells? Because their horns don’t work.",
    "What do you call a pig that does karate? A pork chop.",
    "Why did the grape stop in the middle of the road? Because it ran out of juice.",
    "How does a scientist freshen their breath? With experi-mints.",
    "Why was the calendar so popular? Because it had so many dates!",
    "What do you call a snowman with a six-pack? An abdominal snowman.",
    "I asked the librarian if the library had any books on paranoia. She whispered, 'They're right behind you…'",
    "I told my wife she should do more crunches. Now I’m sleeping on the couch.",
    "I asked the gym instructor if he could teach me to do the splits. He said, 'How flexible are you?' I said, 'I can't make it on Tuesdays.'",
    "What do you call an alligator in a vest? An investi-gator.",
    "Why did the baker go to therapy? Because he kneaded it.",
    "Why did the bicycle fall over? Because it was two-tired.",
    "What did the fish say when he hit the wall? Dam.",
    "I named my dog 'Five Miles' so I can say I walk Five Miles every day.",
    "I told my suitcase that we weren't going on vacation this year. Now I have emotional baggage.",
    "I have a fear of speed bumps, but I’m slowly getting over it.",
    "I tried to take a picture of some fog, but I mist.",
    "A guy walks into a bar… and says ‘ouch’.",
    "Why do ducks have feathers? To cover their butt quacks."
];

// Start .joke or .jokes command
if (wsmsg['text'].toLowerCase() === ".joke" || wsmsg['text'].toLowerCase() === ".jokes") {
    let randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    this._send(`{"stumble":"msg","text":"🤖 ${randomJoke}"}`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Huge list of Chuck Norris facts
const chuckNorrisFacts = [
    "Chuck Norris counted to infinity. Twice.",
    "When Chuck Norris enters a room, he doesn’t turn the lights on. He turns the dark off.",
    "Chuck Norris can divide by zero.",
    "Chuck Norris once won a game of Connect Four in three moves.",
    "When Chuck Norris does a push-up, he isn’t lifting himself up, he’s pushing the Earth down.",
    "Chuck Norris can hear sign language.",
    "Chuck Norris can slam a revolving door.",
    "Chuck Norris can unscramble an egg.",
    "Death once had a near-Chuck-Norris experience.",
    "Chuck Norris’ calendar goes straight from March 31st to April 2nd. No one fools Chuck Norris.",
    "Chuck Norris can kill two stones with one bird.",
    "Chuck Norris doesn’t do push-ups. He pushes the Earth down.",
    "When Chuck Norris looks in a mirror, the mirror shatters. Because not even glass is dumb enough to get between Chuck Norris and Chuck Norris.",
    "The dinosaurs looked at Chuck Norris the wrong way once. You know what happened to them.",
    "Chuck Norris can strangle you with a cordless phone.",
    "There is no theory of evolution, just a list of creatures Chuck Norris allows to live.",
    "Chuck Norris once wrestled a bear… just to give it a fair fight.",
    "Chuck Norris makes onions cry.",
    "Chuck Norris can clap with one hand.",
    "Chuck Norris once finished a game of Monopoly. In 5 minutes.",
    "Superman wears Chuck Norris pajamas.",
    "Chuck Norris can dribble a bowling ball.",
    "When Chuck Norris enters a room, everyone applauds. Even the furniture.",
    "Chuck Norris doesn't read books. He just stares at them until he gets the information he wants.",
    "Chuck Norris' watch doesn’t tell time. It tells him when it’s time to roundhouse kick someone.",
    "Chuck Norris can win a staring contest with the sun.",
    "Chuck Norris once built a snowman… out of rain.",
    "Chuck Norris' tears cure cancer. Too bad he has never cried.",
    "Chuck Norris doesn’t use a GPS. He just declares where he is and the world adjusts accordingly.",
    "If you spell ‘Chuck Norris’ in Scrabble, you win. Forever.",
    "Chuck Norris can sneeze with his eyes open.",
    "When Chuck Norris was born, he drove his mom home from the hospital.",
    "Chuck Norris can build a snowman out of fire.",
    "When the Boogeyman goes to sleep, he checks his closet for Chuck Norris.",
    "Chuck Norris doesn't need a parachute when skydiving. The ground moves out of his way.",
    "Chuck Norris doesn’t need a GPS. He decides where he is.",
    "Chuck Norris doesn’t get brain freeze. He freezes the ice cream with his mind.",
    "Chuck Norris can delete the Recycle Bin.",
    "Ghosts sit around the campfire and tell Chuck Norris stories.",
    "Chuck Norris can unscramble a Rubik’s Cube just by looking at it.",
    "Chuck Norris' roundhouse kick is so fast, it broke the speed of light.",
    "Chuck Norris once ordered a Big Mac at Burger King… and got one.",
    "Chuck Norris once visited The Virgin Islands. Now they’re just called 'The Islands'.",
    "Chuck Norris doesn't sleep. He waits.",
    "Chuck Norris once roundhouse kicked someone so hard, his foot broke the time-space continuum.",
    "Chuck Norris doesn’t get wet. Water gets Chuck Norris’d.",
    "Chuck Norris can divide by zero.",
    "If you spell ‘Chuck Norris’ in Morse code, it reads ‘Victory’."
];

// Start .chucknorris or .cn command
if (wsmsg['text'].toLowerCase() === ".chucknorris" || wsmsg['text'].toLowerCase() === ".cn") {
    let randomFact = chuckNorrisFacts[Math.floor(Math.random() * chuckNorrisFacts.length)];
    this._send(`{"stumble":"msg","text":"${randomFact}"}`);
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // start char
    if (wsmsg['text'].toLowerCase() === ".char") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/WVqt3hx.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start chilidog
    if (wsmsg['text'].toLowerCase() === ".chilidog") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/0A8zOPT.jpeg"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start claptrick
    if (wsmsg['text'].toLowerCase() === ".claptrick") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/hWUWU2P.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start hippo
    if (wsmsg['text'].toLowerCase() === ".hippo") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/GtvnStS.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start cuck
    if (wsmsg['text'].toLowerCase() === ".cuck") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/mmXrpoi.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start jedi
    if (wsmsg['text'].toLowerCase() === ".jedi") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/MCSGgcI.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start lola
    if (wsmsg['text'].toLowerCase() === ".lola") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/flta89w.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start mous
    if (wsmsg['text'].toLowerCase() === ".mous") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/3aLJAbE.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start wizard
    if (wsmsg['text'].toLowerCase() === ".wizard") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/E8CPWDV.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start packie
    if (wsmsg['text'].toLowerCase() === ".packiedance") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/utGknCk.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start vato
    if (wsmsg['text'].toLowerCase() === ".vato") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/L7IAM9c.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start escapetime
    if (wsmsg['text'].toLowerCase() === ".escapetime") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/rlLPzlw.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start baked
    if (wsmsg['text'].toLowerCase() === ".baked") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/mPfCDtI.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start beans
    if (wsmsg['text'].toLowerCase() === ".beans") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/YASZc8X.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start kappa
    if (wsmsg['text'].toLowerCase() === ".kappa") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/Qu6ksP7.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start klappa
    if (wsmsg['text'].toLowerCase() === ".klappa") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/m4IwqPy.png"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start dredd
    if (wsmsg['text'].toLowerCase() === ".dredd") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/fstVLVH.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start car fart
    if (wsmsg['text'].toLowerCase() === ".carfart") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/GxUAMV9.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // .sedna command
    if (wsmsg['text'].toLowerCase() === ".sedna") {
        const result = Math.random() < 0.5 ? "owo" : "uwu";
        this._send(`{"stumble":"msg","text": "🤖 ${result}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start hasbula
    if (wsmsg['text'].toLowerCase() === ".hasbula") {
        this._send('{"stumble":"msg","text":"https://i.imgur.com/y73umR3.gif"}');
        setTimeout(() => {
            this._send('{"stumble":"msg","text":"https://i.imgur.com/ZZ7jwlM.gif"}');
        }, 30000);
        setTimeout(() => {
            this._send('{"stumble":"msg","text":"https://i.imgur.com/CsoQte6.gif"}');
        }, 60000);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start cat
    if (wsmsg['text'].toLowerCase() === ".cat") {
        const cats = [
            "https://i.imgur.com/sfJcnJ8.jpg",
            "https://i.imgur.com/Ktk81y7.jpg",
            "https://i.imgur.com/j2sa2W2.jpg",
            "https://i.imgur.com/UMoJyYw.jpg",
            "https://i.imgur.com/ezZmA3Z.jpeg"
        ];
        const randomCat = cats[Math.floor(Math.random() * cats.length)];
        this._send(`{"stumble":"msg","text": "${randomCat}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start meatmeat
    if (wsmsg['text'].toLowerCase() === ".meatmeat") {
        const gifs = [
            "https://i.imgur.com/LCTLwJO.gif",
            "https://i.imgur.com/xs5jL52.jpeg",
            "https://i.imgur.com/sTykk6e.jpeg",
            "https://i.imgur.com/9OkT24Y.jpeg",
            "https://i.imgur.com/5hLQYft.jpeg"
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start shaq
    if (wsmsg['text'].toLowerCase() === ".shaq") {
        const gifs = [
            "https://i.imgur.com/oK2nz7H.gif",
            "https://i.imgur.com/gftiMkE.gif",
            "https://i.imgur.com/fEjqx8T.gif",
            "https://i.imgur.com/ileqsqo.gif",
            "https://i.imgur.com/pKikBat.gif",
            "https://i.imgur.com/7g8FFMd.gif",
            "https://i.imgur.com/gVKNK1u.gif",
            "https://i.imgur.com/huNMlZA.gif"
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start queef
    if (wsmsg['text'].toLowerCase() === ".queef") {
        const gifs = [
            "https://i.imgur.com/Qq2bKNv.jpeg",
            "https://i.imgur.com/ofC1jDn.gif"
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start flamingo
    if (wsmsg['text'].toLowerCase() === ".flamingo") {
        const gifs = [
            "https://i.imgur.com/0NysV2K.gif",
            "https://i.imgur.com/7iJcUmV.gif",
            "https://i.imgur.com/xRnptLN.gif"
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start viper
    if (wsmsg['text'].toLowerCase() === ".viper") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/xPe1aH8.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start spreadem
    if (wsmsg['text'].toLowerCase() === ".spreadem") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/iOljGSH.mp4"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start dance
    if (wsmsg['text'].toLowerCase() === ".dance") {
        const gifs = [
            "https://i.imgur.com/cgcwOQ5.gif",
            "https://i.imgur.com/32bg1ok.gif",
            "https://i.imgur.com/4fbhUZw.gif",
            "https://i.imgur.com/VqQFYRl.gif"
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// start snarf dance
    if (wsmsg['text'].toLowerCase() === ".sdance") {
        const gifs = [
            "https://i.imgur.com/4fbhUZw.gif"
        ];
        const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start bustin
    if (wsmsg['text'].toLowerCase() === ".bustin") {
        const randomChoice = Math.floor(Math.random() * 3);
        if (randomChoice === 0) {
            this._send('{"stumble":"msg","text":"BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN"}');
            setTimeout(() => {
                this._send('{"stumble":"msg","text":"BUSTIN MAKES ME FEEL GOOD!"}');
            }, 1000);
        } else if (randomChoice === 1) {
            this._send('{"stumble":"msg","text":"BUSTIN MAKES ME FEEL GOOD!"}');
        } else {
            this._send('{"stumble":"msg","text":"BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN BUSTIN"}');
        }
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start froggy
    if (wsmsg['text'].toLowerCase() === ".froggy") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/Cyhj3tq.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Start boobs command with GBX charge
const triggerCommands = [".boobs", ".tits", ".booby", ".busty", ".boobies", ".bobbles", ".titties", ".boob", ".tit", ".milkers", ".teet", ".teets", ".breast", ".breasts", ".bloons", ".melons", ".gohodonkaloos", ".honkers", ".hooters", ".knockers", ".massivenaturals"];

if (triggerCommands.includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) return; // Ensure the user is valid

    const cost = 100; // Charge 100 GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need at least 💵 100 GBX to see some titties. Try using .gojibux to earn more.`);
        return;
    }

    // Deduct GBX
    userBalances[username].balance -= cost;
    saveBalances();

    // Send a random boobs GIF
    const gifs = [
        "https://i.imgur.com/x3dElVe.gif",
        "https://i.imgur.com/V8ngvRm.gif",
        "https://i.imgur.com/F2CcNyv.gif",
        "https://i.imgur.com/DHZfM5T.gif",
        "https://i.imgur.com/1DK3FzN.gif",
        "https://i.imgur.com/9cQp2Iu.gif",
        "https://i.imgur.com/bCQIiX5.gif",
        "https://i.imgur.com/0xYIcCS.gif",
        "https://i.imgur.com/IVHC6hy.gif",
        "https://i.imgur.com/rIG5mzn.png"
    ];
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];

    // Send GIF first
    this._send(`{"stumble":"msg","text": "${randomGif}"}`);

    // Send payment confirmation after 1000ms
    setTimeout(() => {
        this._send(`{"stumble":"msg","text": "🤖 ${nickname} paid 💵 100 GBX for some quality titties."}`);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Start booty command with GBX charge
const triggerBootyCommands = [".booty", ".ass", ".butt", ".donk", ".fanny", ".bongos"];
if (triggerBootyCommands.includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) return; // Ensure the user is valid

    const cost = 100; // Charge 100 GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need at least 💵 100 GBX to see some booty. Try using .gojibux to earn more.`);
        return;
    }

    // Deduct GBX
    userBalances[username].balance -= cost;
    saveBalances();

    // Send a random booty GIF
    const bootygifs = [
        "https://i.imgur.com/oZVxtAU.gif",
        "https://i.imgur.com/Z3SgS85.gif",
        "https://i.imgur.com/fGqJjtI.gif",
        "https://i.imgur.com/WRkLICq.gif",
        "https://i.imgur.com/GszuDNc.gif",
        "https://i.imgur.com/Hn5LEVA.gif",
        "https://i.imgur.com/GnXXrzM.gif",
        "https://i.imgur.com/KgALc2j.gif",
        "https://i.imgur.com/PAg2tA1.gif",
        "https://i.imgur.com/uWJaIsY.gif",
        "https://i.imgur.com/5xoHi5e.gif",
        "https://i.imgur.com/h4bt7by.gif",
        "https://i.imgur.com/ZrueOWT.gif",
        "https://i.imgur.com/2dwimr2.gif",
        "https://i.imgur.com/nJ7n1oT.gif",
        "https://i.imgur.com/ImnJ0WV.gif"
    ];
    const randombootyGif = bootygifs[Math.floor(Math.random() * bootygifs.length)];

    // Send GIF first
    this._send(`{"stumble":"msg","text": "${randombootyGif}"}`);

    // Send payment message after 1000ms
    setTimeout(() => {
        this._send(`{"stumble":"msg","text": "🤖 ${nickname} paid 💵 100 GBX for this booty."}`);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // start gilf
    const triggerGilfCommands = [".gilf"];
    if (triggerGilfCommands.includes(wsmsg['text'].toLowerCase())) {
        const gilfGifs = [
            "https://i.imgur.com/dZzwFuw.mp4",
            "https://i.imgur.com/i7s0Wje.gif",
            "https://i.imgur.com/97GPJiN.gif"
        ];
        const randomGilfGif = gilfGifs[Math.floor(Math.random() * gilfGifs.length)];
        this._send(`{"stumble":"msg","text": "${randomGilfGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start milf
    if (wsmsg['text'].toLowerCase() === ".milf") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/8frocoC.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

// Start DILF command with GBX charge
const triggerDilfCommands = [".dilf"];

if (triggerDilfCommands.includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) return; // Ensure the user is valid

    const cost = 100; // Charge 100 GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need at least 💵 100 GBX to summon a DILF. Try using .gojibux to earn more.`);
        return;
    }

    // Deduct GBX
    userBalances[username].balance -= cost;
    saveBalances();

    // Send a random DILF GIF
    const dilfGifs = [
        "https://i.imgur.com/oiuLfwG.png",
        "https://i.imgur.com/vJQmSMk.gif",
        "https://i.imgur.com/Hxap00t.gif",
        "https://i.imgur.com/Y0gVOZr.gif",
        "https://i.imgur.com/pxTCSZo.gif",
        "https://i.imgur.com/Cu7AwgK.gif",
        "https://i.imgur.com/CjRngKa.gif",
        "https://i.imgur.com/XqzRTGk.gif",
        "https://i.imgur.com/zgX6nDA.gif",
        "https://i.imgur.com/aoEIL0R.gif",
        "https://i.imgur.com/bDgntvS.gif",
        "https://i.imgur.com/12Zpn2H.gif"
    ];
    const randomDilfGif = dilfGifs[Math.floor(Math.random() * dilfGifs.length)];

    // Send GIF first
    this._send(`{"stumble":"msg","text": "${randomDilfGif}"}`);

    // Send payment confirmation after 1000ms
    setTimeout(() => {
        this._send(`{"stumble":"msg","text": "🤖 ${nickname} paid 💵 100 GBX for a premium DILF experience."}`);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Start GRILF/PILF command with GBX charge
const triggerGrilfPilfCommands = [".grilf", ".pilf"];

if (triggerGrilfPilfCommands.includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) return; // Ensure the user is valid

    const cost = 100; // Charge 100 GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need at least 💵 100 GBX to summon a GRILF/PILF. Try using .gojibux to earn more.`);
        return;
    }

    // Deduct GBX
    userBalances[username].balance -= cost;
    saveBalances();

    // GRILF/PILF image pool (currently the same, but expandable later)
    const grilfPilfGifs = [
        "https://i.imgur.com/tLFnSZ7.jpeg"
        // Add more GRILF/PILF GIFs here in the future
    ];

    const randomGrilfPilfGif = grilfPilfGifs[Math.floor(Math.random() * grilfPilfGifs.length)];

    // Send image first
    this._send(`{"stumble":"msg","text": "${randomGrilfPilfGif}"}`);

    // Send payment confirmation after 1000ms
    setTimeout(() => {
        this._send(`{"stumble":"msg","text": "🤖 ${nickname} paid 💵 100 GBX for a premium GRILF/PILF experience."}`);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Start snarfdilf (Costs 10k GBX, random image output)
/*if (wsmsg['text'].toLowerCase() === ".snarfdilf") {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";
    const recipient = "jedisnarf"; // User who receives the money

    if (!username) return; // Ensure the user is valid

    const cost = 10_000; // Cost: 10,000 GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 💵 10,000 GBX to access peak snarfdilf content. Get your GBX up!`);
        return;
    }

    // Deduct 10,000 GBX from the user
    userBalances[username].balance -= cost;

    // Give 10,000 GBX to jedisnarf
    if (!userBalances[recipient]) {
        userBalances[recipient] = { balance: 0 }; // Ensure jedisnarf has an account
    }
    userBalances[recipient].balance += cost;

    saveBalances();

    // List of possible images
    const snarfdilfImages = [
        "https://i.imgur.com/RSZ7xzg.jpeg",
        "https://i.imgur.com/5HSAo1l.jpeg",
        "https://i.imgur.com/oLAqMHS.jpeg"
    ];
    const randomImage = snarfdilfImages[Math.floor(Math.random() * snarfdilfImages.length)];

    // Send the image
    this._send(`{"stumble":"msg","text": "${randomImage}"}`);

    // Send payment confirmation after 1000ms
    setTimeout(() => {
        this._send(`{"stumble":"msg","text": "🤖 ${nickname} paid 💵 10,000 GBX for this snarfdilf masterpiece. ${recipient} received the payment."}`);
    }, 1000);
}*/

// Store the current image index
let snarfdilfIndex = 0;

// Start snarfdilf (Costs 10k GBX, rotates through images)
if (wsmsg['text'].toLowerCase() === ".snarfdilf") {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";
    const recipient = "jedisnarf"; // User who receives the money

    if (!username) return; // Ensure the user is valid

    const cost = 10_000; // Cost: 10,000 GBX
    const userBalance = userBalances[username]?.balance || 0;

    if (userBalance < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you need 💵 10,000 GBX to access peak snarfdilf content. Get your GBX up!`);
        return;
    }

    // Deduct 10,000 GBX from the user
    userBalances[username].balance -= cost;

    // Give 10,000 GBX to jedisnarf
    if (!userBalances[recipient]) {
        userBalances[recipient] = { balance: 0 }; // Ensure jedisnarf has an account
    }
    userBalances[recipient].balance += cost;

    saveBalances();

    // List of possible images
    const snarfdilfImages = [
        "https://i.imgur.com/RSZ7xzg.jpeg",
        "https://i.imgur.com/5HSAo1l.jpeg",
        "https://i.imgur.com/oLAqMHS.jpeg"
    ];

    // Get the current image and increment the index
    const currentImage = snarfdilfImages[snarfdilfIndex];
    snarfdilfIndex = (snarfdilfIndex + 1) % snarfdilfImages.length;

    // Send the image
    this._send(`{"stumble":"msg","text": "${currentImage}"}`);

    // Send payment confirmation after 1000ms
    setTimeout(() => {
        this._send(`{"stumble":"msg","text": "🤖 ${nickname} paid 💵 10,000 GBX for this snarfdilf masterpiece. ${recipient} received the payment."}`);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

    // start say command
    if (wsmsg['text'].toLowerCase().startsWith(".say ")) {
        const sayText = wsmsg['text'].substring(5);
        this._send(`{"stumble":"msg","text":"🤖 ${sayText}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Start labyrinth
    if (wsmsg['text'].toLowerCase() === ".labyrinth") {
        const gifs = [
            "https://i.imgur.com/KYHS47y.gif",
            "https://i.imgur.com/ML8ZjPx.gif",
            "https://i.imgur.com/bndmJ4w.gif",
            "https://i.imgur.com/yYIhNTN.gif"
        ];

        // Function to send GIFs with a 1000ms delay
        const sendGifs = (index) => {
            if (index < gifs.length) {
                this._send(`{"stumble":"msg","text": "${gifs[index]}"} `);
                setTimeout(() => sendGifs(index + 1), 1000); // 1000 ms delay between each GIF
            } else {
                // After sending all GIFs, wait 3 seconds and send the final GIF
                setTimeout(() => {
                    this._send('{"stumble":"msg","text": "https://i.imgur.com/ALjpQST.gif"}');
                }, 6000); // 6000 ms delay before sending the last GIF
            }
        };

        sendGifs(0); // Start sending GIFs
    }

// Triggers -------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

    // ping pong (case insensitive)
    const pingPongResponses = {
        "ding": "🤖 DONG",
        "ping": "🤖 PONG",
        "bing": "🤖 BONG"
    };

    const lowerText = wsmsg['text'].toLowerCase();
    if (pingPongResponses[lowerText]) {
        setTimeout(() => {
            this._send(JSON.stringify({
                stumble: "msg",
                text: pingPongResponses[lowerText]
            }));
        }, 1000);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Assfuckery GIF command
    if (wsmsg['text'].toLowerCase() === "assfuckery") {
        this._send('{"stumble":"msg","text":"https://i.imgur.com/8v3YYBo.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // 5-0
    if (wsmsg['text'].toLowerCase() === "5-0") {
        setTimeout(() => this._send('{"stumble":"msg","text":"🤖 Cheese it!"}'), 1000);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // set and packed
    if (wsmsg['text'].toLowerCase() === "set") {
        setTimeout(() => this._send('{"stumble":"msg","text":"🤖 Let\'s smoke!"}'), 1000);
    } else if (wsmsg['text'].toLowerCase() === "packed") {
        setTimeout(() => this._send('{"stumble":"msg","text":"🤖 Let\'s toke!"}'), 1000);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // MAMA
    if (wsmsg['text'].toLowerCase() === "mama") {
        setTimeout(() => this._send('{"stumble":"msg","text":"https://i.imgur.com/SzmUrg0.gif"}'), 1000);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // im on smoko
    if (wsmsg['text'].toLowerCase() === "im on smoko") {
        setTimeout(() => this._send('{"stumble":"msg","text":"🤖 SO LEAVE EM ALONE!"}'), 1000);
    } else if (wsmsg['text'].toLowerCase() === "smoko") {
        setTimeout(() => this._send('{"stumble":"msg","text":"🤖 THEY\'RE ON SMOKO! SO LEAVE EM ALONE!"}'), 1000);
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
            'chrs': ['Chrs! Short and sweet—here’s to the good times!', 'Chrs to you! Keep the vibes high!', 'Chrs! Let’s make some memories!'],
            'chr': ['Chr! Quick shout to good vibes!', 'Chr to you! Simple but meaningful!', 'Chr! Here’s to the little moments that matter!'],
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
            "🤖 Happy 4:20! Cheers!",
            "🤖 It's 4:20 somewhere! Blaze it!",
            "🤖 Happy 4:20! Smoke 'em if you got 'em!"
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
    if (["deg", "dag"].includes(wsmsg['text'].toLowerCase())) {
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
        this._send(`{"stumble":"msg","text": "${gifs[Math.floor(Math.random() * gifs.length)]}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start oh hi mark
    if (wsmsg['text'].toLowerCase() === "oh hi mark") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/fpObc5Y.gif"}');
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start drugs got me fucked up
    if (wsmsg['text'].toLowerCase() === "drugs got me fucked up") {
        this._send('{"stumble":"msg","text": "sluts got me drugged up, fuck"}');
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

    // start jroc
    if (wsmsg['text'].toLowerCase() === "j.r.o.c") {
        // Create an array of responses
        const rsp = [
            "https://i.imgur.com/ayb1BuQ.jpeg",
            "https://i.imgur.com/i0vuWAx.jpeg",
            "https://i.imgur.com/QoP3JXg.jpeg",
            "https://i.imgur.com/yFjDNzS.mp4",
            "https://i.imgur.com/szpCAcG.gif"
        ];

        // Select a random response from the array
        this._send(`{"stumble":"msg","text": "${rsp[Math.floor(Math.random() * rsp.length)]}"}`);
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

    // start fart
    // Array of commands that trigger the fart sequence
    const fartCommands = ['i farted', 'farted', 'who farted', 'someone farted', 'fart', 'toot', 'tooted', 'i tooted', 'who tooted'];

    // Possible responses for sniffing and reacting to the fart
    const sniffResponses = ['*sniffs*', '*takes a deep breath*', '*sniffs the air cautiously*'];
    const stinkResponses = ['Stinks!', 'That’s disgusting!', 'Phew, that’s rank!', 'Who did that?!'];

    if (fartCommands.includes(wsmsg['text'].toLowerCase())) { // Check if the message (case insensitive) is one of the fart commands
        // Randomly pick a sniffing response
        const sniffResponse = sniffResponses[Math.floor(Math.random() * sniffResponses.length)];

        // Randomly pick a stink response
        const stinkResponse = stinkResponses[Math.floor(Math.random() * stinkResponses.length)];

        // Send the sniffing messages with a delay
        setTimeout(() => this._send(`{"stumble":"msg","text":"🤖 ${sniffResponse}"}`), 1000);
        setTimeout(() => this._send(`{"stumble":"msg","text":"🤖 ${stinkResponse}"}`), 3000);
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

    //start smile
    if (wsmsg['text'] === '.smile') {
        const messages = [
            "⣿⣿⣿⣿⣿⣿⡟⠁⠄⠄⠄⠄⣠⣤⣴⣶⣶⣶⣶⣤⡀⠈⠙⢿",
            "⣿⣿⣿⣿⣿⡟⠄⠄⠄⠄⠄⣸⣿⣿⣿⣿⣿⣿⣿⣿⣿⣆⠄⠈",
            "⣿⣿⣿⣿⣿⠁⠄⠄⠄⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⠄⠄",
            "⣿⣿⣿⣿⣿⡄⠄⠄⠄⠙⠻⠿⣿⣿⣿⣿⠿⠿⠛⠛⠻⣿⡄⠄",
            "⣿⣿⣿⣿⣿⡇⠄⠄⠁ ⭕ ⠄⢹⣿⡗⠄ ⭕ ⢄⡀⣾⢀⣿",
            "⣿⣿⣿⣿⣿⡇⠘⠄⠄⠄⢀⡀⠄⣿⣿⣷⣤⣤⣾⣿⣿⣿⣧⢸",
            "⣿⣿⣿⣿⣿⡇⠄⣰⣿⡿⠟⠃⠄⣿⣿⣿⣿⣿⡛⠿⢿⣿⣷⣾",
            "⣿⣿⣿⣿⣿⣿⡄⠈⠁⠄⠄⠄⠄⠻⠿⢛⣿⣿⠿⠂⠄⢹⢹⣿",
            "⣿⣿⣿⣿⣿⣿⣿⡐⠐⠄⠄⣠⣀⣀⣚⣯⣵⣶⠆⣰⠄⠞⣾⣿",
            "⣿⣿⣿⣿⣿⣿⣿⣷⡄⠄⠄⠈⠛⠿⠿⠿⣻⡏⢠⣿⣎⣾⣿⣿",
            "⣿⣿⣿⣿⣿⣿⡿⠟⠛⠄⠄⠄⠄⠙⣛⣿⣿⣵⣿⡿⢹⡟⣿⣿",
            "⣿⠿⠿⠋⠉⠄⠄⠄⠄⠄⠄⠄⣀⣠⣾⣿⣿⣿⡟⠁⠹⡇⣸⣿",
            "⠁⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠄⠙⠿⠿⠛⠋⠄⣸⣦⣠⣿⣿"
        ];

        // Send each message with increasing delays
        messages.forEach((message, index) => {
            setTimeout(() => {
                this._send(`{"stumble":"msg","text":"${message}"}`);
            }, (index + 1) * 1000); // Each line is delayed by 1 second
        });
    }

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
        if (wsmsg['text'].toLowerCase() === ".egg") {
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

        if (wsmsg['text'].toLowerCase() === ".ai") {
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

    // start tim
    if (wsmsg['text'].toLowerCase() === ".tim") {
        // Create an array of quotes
        const quotes = [
            "You sure about that? You sure about that that's why?",
            "We're all trying to find the guy who did this!",
            "You have no good car ideas!",
            "I don’t even want to be around anymore.",
            "The bones are their money, so are the worms.",
            "We’re all having a good time, and then there’s a monster!",
            "Oh my god, he admit it!",
            "I'm worried the baby thinks people can't change.",
            "The steering wheel flies off!",
            "I don’t want to do this anymore… I’m scared.",
            "They need to let me do more.",
            "I hope that this doesn’t take up the whole day.",
            "I had a hamburger for lunch!",
            "It’s a pay-it-forward coffee!",
            "You can’t skip lunch, you’ll get headaches!",
            "It's the good steak. The steak that you like.",
            "That's a Chunky!",
            "Don't let the hat slam the door on the way out!",
            "You have no idea how long this took!",
            "Triples is best. Triples is safe.",
            "I don't want anybody to see me, I have too much fucking shit on me!",
            "I’m just gonna grab a sloppy steak at Trefoni’s.",
            "I need two minutes, two minutes tops!",
            "Give me that. I need it.",
            "No one’s ever done this before! We’re making history!",
            "I just want to show you my perfectly normal tables.",
            "I thought you were doing a bit. I thought you were doing a funny joke.",
            "I used to be a piece of shit.",
            "I just wanna hit that!",
            "This is a classic setup!",
            "You need to do something with your hair!",
            "You need to fix your order, sir.",
            "I'm worried my house is haunted by my grandma.",
            "You can't change horses midstream!",
            "I'm not paying for the hamburger sketch.",
            "This place is a fucking nightmare.",
            "I love my job. My job is my life!",
            "Are you driving the car from the future?",
            "I ordered the fully loaded nachos!",
            "The rules don’t make any sense!",
            "Who cares? I don’t live here.",
            "Why’d you take his dice?",
            "It’s a complicated order.",
            "We're not allowed to swear.",
            "The car does not belong to my brother.",
            "I had a weird night last night.",
            "This shirt used to be a nice shirt!",
            "He’s supposed to be my best friend!",
            "No, you can’t take it home.",
            "It's not illegal. It's just frowned upon.",
            "You have the tables, you have the best tables.",
            "I swear to God, if you fucking touch that...",
            "I'm not eating it unless you make it right.",
            "I'm scared of how much I need wine.",
            "I bought too much fucking stuff!",
            "It's not a joke. It's not a bit.",
            "You don't want the real me to come out.",
            "This guy sucks! No offense.",
            "You think this is slicked back? This is pushed back.",
            "I'm gonna be around for a long, long time.",
            "Get that baby out of here!",
            "The suit's too big because it's funny!",
            "I don’t want to be around anymore. Just let me go.",
            "Don’t mess with me! I don’t even want to be around anymore!",
            "No, I’m not joking. You really do owe me for this burger.",
            "His name is Bart Harley Jarvis!",
            "I thought there'd be a bigger deal made about me.",
            "I got a really small slice!",
            "This is why I don’t even try anymore.",
            "I can’t believe I was fired for being the bad boy of the office.",
            "What is this, an intervention or something?",
            "I was here first. I was in line first!",
            "These tables are what everyone’s raving about!",
            "We used to make fun of my dad for this.",
            "You're not part of the turbo team. Don't run!",
            "You don’t even know what that is, do you?",
            "We’re gonna take our shirts off and start fightin’!",
            "It’s not a joke. I’m serious!",
            "You don’t have a good car idea? Then shut up.",
            "I was scaring my kids too much.",
            "I don’t know how to drive. It’s killing my wife.",
            "I drove my car through a Burger King!",
            "I wish I was dead.",
            "You have no good steak ideas!",
            "My wife left me because of my driving!",
            "I can’t believe how much this sucks!",
            "They think it’s funny. I’m the only one who doesn’t get it!",
            "You’re ruining my life, and I don’t even know your name!",
            "We're just talking. We're not married!",
            "The pattern is making me sick!",
            "I don’t even have time for this!",
            "It was supposed to be funny, but I guess it’s not.",
            "My kids hate me now!",
            "Stop laughing! It’s not funny!",
            "I’m just gonna grab a sloppy steak. What’s the problem?",
            "I really needed that. I was dying over here.",
            "It’s over. Just leave me alone.",
            "I used to be cool. Now look at me.",
            "I wish I never came here.",
            "I should’ve never trusted you with my lunch order!",
            "We’re not doing this again!",
            "You said you knew what you were doing!",
            "The manager said I had to leave!",
            "I thought I was gonna be the main guy.",
            "I don’t want to be here anymore. I’m out."
        ];

        // Select a random quote from the array
        const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

        // Send the random quote with a bot emoji prefix
        this._send(`{"stumble":"msg","text": "🤖 ${randomQuote}"}`);
    }

//Fun Commands ----------------------------------------------------------------------------------------------------------------------
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
                    text: `🤖 I choose: ${choice}!`
                }));
            } else {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: "🤖 Please provide some options to choose from! (apple, orange, banana)"
                }));
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // start .suggest command
        if (wsmsg['text'].toLowerCase() === ".suggest") {
            const lines = [
                "🤖 To suggest a new command for StumbleBot, please follow this format:",
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

// Command: .flip / .coinflip (case insensitive)
if ([".flip", ".coinflip"].includes(wsmsg['text'].toLowerCase())) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "Someone";

    const isHeads = Math.random() < 0.5;
    const result = isHeads ? "Heads" : "Tails";
    const emoji = isHeads ? "🧑" : "🍑";

    this._send(JSON.stringify({
        stumble: "msg",
        text: `🤖 ${nickname} 🪙 flips a coin... it's ${result}! ${emoji}`
    }));
}

//-----------------------------------------------------------------------------------------------------------------------------------

// Command: .dice or .diceroll (Dice Roll)
if (wsmsg['text'].startsWith(".dice") || wsmsg['text'].startsWith(".diceroll")) {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || "";

    // Extract the dice notation (e.g., "1d6") from the command
    let args = wsmsg['text'].split(' ')[1]; // Get the part after ".dice" or ".diceroll"

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
    const diceSymbols = ["⚀", "⚁", "⚂", "⚃", "⚄", "⚅"];

    // Roll the dice
    for (let i = 0; i < numDice; i++) {
        let roll = Math.floor(Math.random() * maxFace) + 1;
        let displayRoll = maxFace <= 6 ? `${diceSymbols[roll - 1]} ${roll}` : `${roll}`;
        rolls.push(displayRoll);
        total += roll;
    }

    // Format roll output
    let rollText = rolls.join(' ');

    // Construct the message
    let rollMessage = nickname ? `🎲 ${nickname} Rolled: ${rollText}` : `🎲 Rolled: ${rollText}`;

    // Send the rolled results
    this._send(JSON.stringify({
        stumble: "msg",
        text: rollMessage
    }));

    // If more than one die is rolled, send the total after 1000ms delay
    if (numDice > 1) {
        setTimeout(() => {
            this._send(JSON.stringify({
                stumble: "msg",
                text: `🎲 Total: ${total}`
            }));
        }, 1000);
    }
}

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .8ball (Magic 8-Ball)
        if (wsmsg['text'].startsWith(".8ball")) {
            const handle = wsmsg['handle'];
            const username = userHandles[handle];
            const nickname = userNicknames[username]?.nickname || "";

            // Extract the question from the command (everything after ".8ball")
            let question = wsmsg['text'].slice(7).trim(); // Get the part after ".8ball"

            // If no question is provided
            if (!question) {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: `${nickname ? nickname : 'You'} gotta ask something first! 🤷‍♂️ The 8-ball can't read your mind, especially not without a blunt in hand! 🌿`
                }));
                return;
            }

            // List of possible 8-ball responses with a humorous and weed-themed twist
            const eightBallResponses = [
                "Yes, and you should definitely do it. 💯✨",
                "No, and you should probably rethink your life choices... or take a dab. 💨",
                "Maybe, but don’t hold your breath. 🫣 Maybe puff a joint first?",
                "Ask again later... after the munchies kick in. 🍕🌮",
                "I don't know... I’m just a ball. 🤔 But I could use a good toke.",
                "Definitely, but only if you bring snacks. 🍿🌿",
                "I'm not sure, but I'd bet on you... especially after a bong rip. 💨",
                "Outlook good, but the universe is kinda trippy. 🌌🚀",
                "Cannot predict now, please try again after 5pm... or after a nap. 🛋️",
                "My sources say no... but they were high when they said it. 🤡💚",
                "Yes, but only if you hit that blunt first. 🔥",
                "No way, bro. Maybe after a dab. 💨🔥",
                "Ask again after you’ve shared that joint. 🌿🚬",
                "Yes, but keep it chill, like a relaxed smoke session. 🛋️🌿",
                "The answer is a cloud of smoke... blurry and unpredictable. ☁️💨"
            ];

            // Pick a random response
            const randomResponse = eightBallResponses[Math.floor(Math.random() * eightBallResponses.length)];

            // Construct the response message
            let responseMessage = nickname ? `🤖 ${nickname} asks: ${question} 🤔\n🎱 The 8-ball says: ${randomResponse}` : `🤖 Someone asks: ${question} 🤔\n🎱 The 8-ball says: ${randomResponse}`;

            // Send the magic 8-ball result
            this._send(JSON.stringify({
                stumble: "msg",
                text: responseMessage
            }));
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Command: .rps (Use handle to get nickname and process user input)
        if (wsmsg['text'].startsWith(".rps")) {
            const handle = wsmsg['handle'];
            const username = userHandles[handle];
            const nickname = userNicknames[username]?.nickname || "Someone";

            // Get the user's choice (after the command, e.g., ".rps rock")
            const userChoice = wsmsg['text'].split(' ')[1];
            const validChoices = ['rock', 'paper', 'scissors'];

            // Check if the user's choice is valid
            if (!validChoices.includes(userChoice)) {
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: `🤖 Hey ${nickname}, please choose 'rock', 'paper', or 'scissors'.`
                }));
            } else {
                // Function to randomly choose between rock, paper, and scissors
                function getBotChoice() {
                    const choices = ['rock', 'paper', 'scissors'];
                    return choices[Math.floor(Math.random() * choices.length)];
                }

                // Function to determine the winner
                function determineWinner(userChoice, botChoice) {
                    if (userChoice === botChoice) {
                        return "It's a tie!";
                    } else if (
                        (userChoice === 'rock' && botChoice === 'scissors') ||
                        (userChoice === 'paper' && botChoice === 'rock') ||
                        (userChoice === 'scissors' && botChoice === 'paper')
                    ) {
                        return "You win!";
                    } else {
                        return "I win!";
                    }
                }

                // Get bot's choice and determine the winner
                const botChoice = getBotChoice();
                const result = determineWinner(userChoice, botChoice);

                // Send the result back to the chat
                this._send(JSON.stringify({
                    stumble: "msg",
                    text: `🤖 ${nickname}, you chose ${userChoice}. I chose ${botChoice}. ${result}`
                }));
            }
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Initialize GojiBux value from localStorage or set to 1
        /*let gojiBuxValue = parseInt(localStorage.getItem('gojiBuxValue')) || 1;

        // .gojibux command: Increases GojiBux value
        if (wsmsg['text'].toLowerCase() === ".gbx") {
            const randomIncrease = Math.floor(Math.random() * (2000 - 20 + 1)) + 20;
            gojiBuxValue += randomIncrease;

            // Save the updated value in localStorage
            localStorage.setItem('gojiBuxValue', gojiBuxValue);

            // Send the message with the updated value
            this._send(`{"stumble":"msg","text": "📈 GojiBux is now worth 💵 ${gojiBuxValue.toLocaleString()} USD per 1 GBX!"}`);
        }*/

//-----------------------------------------------------------------------------------------------------------------------------------

        // .$NARF command: Displays the negative value of GojiBux
        /*if (wsmsg['text'].toLowerCase() === "$NRF") {
            const narfValue = -gojiBuxValue; // $NRF is the negative of GBX
            this._send(`{"stumble":"msg","text": "📉 $NARF is now worth 💵 ${narfValue.toLocaleString()} USD per 1 $NRF!"}`);
        }*/

//-----------------------------------------------------------------------------------------------------------------------------------

        // Reset GojiBux command
        /*if (wsmsg['text'] === ".resetGojiBux") {
            gojiBuxValue = 1;

            // Save the reset value in localStorage
            localStorage.setItem('gojiBuxValue', gojiBuxValue);

            // Send the message to confirm the reset
            this._send(`{"stumble":"msg","text": "🤖 GojiBux has been reset to ${gojiBuxValue} USD per 1 GBX."}`);
        }*/

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
            this._send(`{"stumble":"msg","text":"🕰 ${time} | 📅 ${formattedDate} | 🌎 ${userInput?.toUpperCase() || 'UTC'}"}`);
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
                this._send('{"stumble":"msg","text":"🤖 Invalid input! Example: .currency 50 usd to dkk"}');
                return;
            }

            const amount = parseFloat(args[0]);
            const fromCurrency = args[1]?.toLowerCase();
            const toCurrency = args[3]?.toLowerCase();

            if (isNaN(amount) || !currencyConversions[fromCurrency] || !currencyConversions[fromCurrency][toCurrency]) {
                this._send('{"stumble":"msg","text":"🤖 Invalid input! Example: .currency 50 usd to dkk"}');
            } else {
                const convertedAmount = (amount * currencyConversions[fromCurrency][toCurrency]).toFixed(2);
                this._send(`{"stumble":"msg","text":"💱 ${amount} ${fromCurrency.toUpperCase()} = ${convertedAmount} ${toCurrency.toUpperCase()}"}`);
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

                    steps.push(`🧮 Evaluating: ${formattedExp}`);
                    steps.push(`🤖 Final result: ${result}`);

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
                    this._send('{"stumble":"msg","text":"🤖 Invalid calculation"}');
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

            const match = wsmsg['text'].match(/\.convert\s+(-?[\d.]+)\s*(\w+)\s*to\s*(\w+)/i);

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
                    this._send(`{"stumble":"msg","text":"🤖 ${value} ${fromUnit} is ${convertedValue.toFixed(2)} ${toUnit}"}`);
                } else {
                    this._send('{"stumble":"msg","text":"🤖 Invalid units or conversion not supported."}');
                }
            } else {
                this._send('{"stumble":"msg","text":"🤖 Invalid format. Use: .convert [value] [unit] to [unit]."}');
            }
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
        //    const nickname = userNicknames[userHandles[handle]] || "Someone";
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
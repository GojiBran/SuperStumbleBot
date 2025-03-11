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

        // Send 420 alert
        /*if (shouldSendMessage) {
            shouldSendMessage = false; // Reset the flag immediately to prevent multiple sends

            setTimeout(() => {
                this._send('{"stumble":"msg","text": "🤖 It\'s 4:20 somewhere! Smoke em if you got em! 💨"}');
            }, 1000); // 1-second delay to send at HH:20:01
        }*/

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
    let universalNotes = JSON.parse(localStorage.getItem("universalNotes")) || [];

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
    }

    // Handle .notes command to display all notes with delay
    if (wsmsg['text'].toLowerCase() === ".notes") {
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
    }

    // Handle .mynotes command to display only the user's notes with delay
    if (wsmsg['text'].toLowerCase() === ".mynotes") {
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
    }

    // Handle .clearNotes command to wipe all notes
    if (wsmsg['text'] === ".clearNotes") {
        universalNotes = [];
        localStorage.removeItem("universalNotes");
        respondWithMessage.call(this, "🤖 All notes cleared.");
    }

// GojiBux --------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 💰 LGH (Limited Goji Holdings) - Prevent Reset & Respect Cap
const maxGbxSupply = 1000000; // Hard cap: 1,000,000 GBX
let storedLghBank = localStorage.getItem("lghBank");
let lghBank = storedLghBank !== null ? parseInt(storedLghBank) : 500000;

// Ensure LGH stays within valid range
if (lghBank < 0) lghBank = 0;
if (lghBank > maxGbxSupply) lghBank = maxGbxSupply;

// 💰 Save LGH
function saveLghBank() {
    localStorage.setItem("lghBank", lghBank);
}

// 🔍 Debugging Log
console.log(`LGH Bank Loaded: ${lghBank} GBX`);

// 🛑 Ensure LGH Saves on Exit
window.addEventListener("beforeunload", saveLghBank);

// 💰 Universal GojiBux Storage (Per-user)
let userBalances = JSON.parse(localStorage.getItem("userBalances")) || {};

// 💸 Transaction Tax System
function applyTax(amount, taxRate) {
    return Math.floor(amount * (1 - taxRate));
}

// Function to save user balances
function saveBalances() {
    localStorage.setItem("userBalances", JSON.stringify(userBalances));
    localStorage.setItem("lghBank", lghBank);
}

// 🏦 `.mybux` - Display the user's GojiBux balance
if (wsmsg["text"].toLowerCase() === ".mybux") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const balance = userBalances[username]?.balance || 1;

    respondWithMessage.call(this, `🤖 ${nickname}, your GojiBux balance is 💵 ${balance.toLocaleString()} GBX.`);
}

// 💰 `.gojibux` - Earn a random amount of GojiBux (Limited by LGH Bank)
let lastGojibuxTimes = JSON.parse(localStorage.getItem("lastGojibuxTimes")) || {}; // Store last use times

if (wsmsg["text"].toLowerCase() === ".gojibux") {
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
    const cooldown = 1 * 60 * 1000; // [1] 30-minute cooldown
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
        `📈 ${nickname} just cashed in and got 💵 ${actualIncrease.toLocaleString()} GBX!`,
        `💰 ${nickname} found ${actualIncrease.toLocaleString()} GBX under the couch! Lucky day!`,
        `🤑 ${nickname} made some sneaky trades and scored 💵 ${actualIncrease.toLocaleString()} GBX!`,
        `💵 ${nickname} just got paid! +${actualIncrease.toLocaleString()} GBX!`,
        `🤖 ${nickname} exploited the stock market (legally?) and gained 💵 ${actualIncrease.toLocaleString()} GBX!`
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

// 💰 `.admin givebux` - Give all users a specified amount of GojiBux (default: 500)
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

    // Extract amount from message (e.g., ".givebux 10000")
    const args = wsmsg["text"].split(" ");
    let amount = parseInt(args[1]);

    // If no valid number is given, default to 500 GBX
    if (isNaN(amount) || amount <= 0) {
        amount = 500;
    }

    let userCount = 0;
    for (const user in userBalances) {
        if (userBalances.hasOwnProperty(user)) {
            userBalances[user].balance += amount;
            userCount++;
        }
    }

    saveBalances();

    respondWithMessage.call(this, `💰 All ${userCount} users just received ${amount.toLocaleString()} GojiBux! 🤑💵`);
}

// 💸 `.snarfbux` - Lose a random amount of GojiBux (LGH Bank gains)
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
        `📉 ${nickname} just made a terrible financial decision and lost 💵 ${actualLoss.toLocaleString()} GBX!`,
        `😭 ${nickname} got scammed out of 💵 ${actualLoss.toLocaleString()} GBX! Better luck next time.`,
        `🤡 ${nickname} just invested all their GBX in a pyramid scheme and lost 💵 ${actualLoss.toLocaleString()} GBX!`,
        `😬 ${nickname} tripped, dropped their wallet, and lost 💵 ${actualLoss.toLocaleString()} GBX! Oof.`,
        `💀 ${nickname} bet on a "sure thing" and got absolutely wrecked, losing 💵 ${actualLoss.toLocaleString()} GBX!`
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

    respondWithMessage.call(this, `📉 ${nickname}, $NARF value: 💵 ${(-balance).toLocaleString()} $NRF`);
}

// 🔄 `.resetGojiBux` - Reset only the user's balance to 1 GBX (Ensuring LGH Doesn't Drop Below 0)
/*if (wsmsg["text"].toLowerCase() === ".resetgojibux") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (userBalances[username]) {
        let amountToRemove = userBalances[username].balance - 1;
        if (lghBank - amountToRemove < 0) {
            amountToRemove = lghBank; // Don't drop LGH below 0
        }

        lghBank -= amountToRemove;
        userBalances[username].balance = 1;
        saveBalances();

        respondWithMessage.call(this, `🤖 ${nickname}, your GojiBux balance has been reset to 💵 1 GBX.`);
    } else {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have a GojiBux balance yet! Use .gojibux to start earning.`);
    }
}*/

// 🦹 `.steal` - Randomly steal GojiBux from another user (Ensures Victim Has Enough)
/*if (wsmsg["text"].toLowerCase() === ".steal") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // Get all usernames with balances of at least 2 GBX (so they don’t hit 0)
    const eligibleUsers = Object.keys(userBalances).filter(user => user !== username && userBalances[user]?.balance >= 2);

    if (eligibleUsers.length === 0) {
        respondWithMessage.call(this, "🤖 There's no one rich enough to steal from!");
        return;
    }

    // Pick a random victim
    const victimUsername = eligibleUsers[Math.floor(Math.random() * eligibleUsers.length)];
    const victimNickname = userNicknames[victimUsername]?.nickname || victimUsername || "someone";

    // Amount to steal (10% of the victim's balance, minimum 1 GBX)
    const stealAmount = Math.max(1, Math.floor(userBalances[victimUsername].balance * 0.1));

    // Transfer the stolen amount
    userBalances[victimUsername].balance -= stealAmount;
    userBalances[username].balance = (userBalances[username].balance || 1) + stealAmount;
    saveBalances();

    respondWithMessage.call(this, `🦹 ${nickname} stole 💵 ${stealAmount.toLocaleString()} GBX from ${victimNickname}!`);
}*/

// 🦹 .steal [username] - Attempt to steal GojiBux from another user
/*if (wsmsg["text"].toLowerCase().startsWith(".steal ")) {
    const args = wsmsg["text"].split(" ");
    if (args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .steal [username]");
        return;
    }

    const handle = wsmsg["handle"];
    const thiefUsername = userHandles[handle];
    const thiefNickname = userNicknames[thiefUsername]?.nickname || thiefUsername || "you";
    const victimUsername = args[1];

    if (!thiefUsername || !userBalances[victimUsername]) {
        respondWithMessage.call(this, "🤖 That user doesn't exist or has no GojiBux.");
        return;
    }

    const victimNickname = userNicknames[victimUsername]?.nickname || victimUsername;

    if ((userBalances[victimUsername].balance || 0) < 2) {
        respondWithMessage.call(this, `🤖 ${victimNickname} doesn't have enough GojiBux to steal.`);
        return;
    }

    let stealAmount = Math.max(1, Math.floor(userBalances[victimUsername].balance * (Math.random() * 0.1 + 0.05))); // 5-15% of victim's balance
    let caught = Math.random() < 0.5;

    if (caught) {
        // Thief gets caught, pays double penalty into LGH Bank
        let penalty = stealAmount * 2;
        userBalances[thiefUsername].balance = Math.max(0, (userBalances[thiefUsername].balance || 0) - penalty);
        lghBank += penalty;
        saveBalances();
        localStorage.setItem("lghBank", lghBank);
        respondWithMessage.call(this, `🚨 ${thiefNickname} got CAUGHT trying to rob ${victimNickname} and paid 💵 ${penalty.toLocaleString()} GBX to LGH Bank as a penalty!`);
    } else {
        // Successful steal
        userBalances[victimUsername].balance -= stealAmount;
        userBalances[thiefUsername].balance = (userBalances[thiefUsername].balance || 0) + stealAmount;
        saveBalances();
        respondWithMessage.call(this, `🦹 ${thiefNickname} successfully stole 💵 ${stealAmount.toLocaleString()} GBX from ${victimNickname}!`);
    }
}*/

// 🦹 .steal [username] - Attempt to steal GojiBux from a specific user or a random one
if (wsmsg["text"].toLowerCase().startsWith(".steal")) {
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
        // User specified a target
        victimUsername = args[1];

        if (victimUsername === thiefUsername) {
            respondWithMessage.call(this, "🤖 You can't steal from yourself, nice try.");
            return;
        }

        if (!userBalances[victimUsername] || (userBalances[victimUsername].balance || 0) < 2) {
            respondWithMessage.call(this, `🤖 ${victimUsername} doesn't have enough GojiBux to steal.`);
            return;
        }
    } else {
        // No target specified, pick a random victim
        const potentialVictims = Object.keys(userBalances).filter(
            (username) => username !== thiefUsername && (userBalances[username].balance || 0) > 1
        );

        if (potentialVictims.length === 0) {
            respondWithMessage.call(this, "🤖 Nobody has enough GojiBux to steal from.");
            return;
        }

        victimUsername = potentialVictims[Math.floor(Math.random() * potentialVictims.length)];
    }

    const victimNickname = userNicknames[victimUsername]?.nickname || victimUsername;

    // Determine how much to steal (5-15% of victim's balance, minimum 1)
    let stealAmount = Math.max(1, Math.floor(userBalances[victimUsername].balance * (Math.random() * 0.1 + 0.05)));
    let caught = Math.random() < 0.5;

    if (caught) {
        // Thief gets caught, pays a penalty (capped at their balance)
        let penalty = Math.min(stealAmount * 2, userBalances[thiefUsername].balance || 0);
        userBalances[thiefUsername].balance = Math.max(0, (userBalances[thiefUsername].balance || 0) - penalty);
        lghBank += penalty;
        saveBalances();
        localStorage.setItem("lghBank", lghBank);
        respondWithMessage.call(this, `🚨 ${thiefNickname} got CAUGHT trying to rob ${victimNickname} and paid 💵 ${penalty.toLocaleString()} GBX to LGH Bank as a penalty!`);
    } else {
        // Successful steal
        userBalances[victimUsername].balance -= stealAmount;
        userBalances[thiefUsername].balance = (userBalances[thiefUsername].balance || 0) + stealAmount;
        saveBalances();
        respondWithMessage.call(this, `🦹 ${thiefNickname} successfully stole 💵 ${stealAmount.toLocaleString()} GBX from ${victimNickname}!`);
    }
}

// 💥 `.bankrob` - Attempt to rob the LGH Bank (Now Ensures LGH Has Enough)
/*if (wsmsg["text"].toLowerCase() === ".bankrob") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (lghBank < 100) {
        respondWithMessage.call(this, "🏦 LGH Bank is too empty to rob!");
        return;
    }

    const success = Math.random() < 0.5;

    if (success) {
        // Ensure they can't steal more than the LGH Bank actually has
        const maxSteal = Math.floor(lghBank * 0.15); // 15% max
        const stolenAmount = Math.min(Math.floor(lghBank * (Math.random() * 0.1 + 0.05)), maxSteal);

        lghBank -= stolenAmount;
        userBalances[username].balance = (userBalances[username].balance || 1) + stolenAmount;
        saveBalances();

        respondWithMessage.call(this, `💰 ${nickname} successfully robbed the LGH Bank and stole 💵 ${stolenAmount.toLocaleString()} GBX!\n🏦 LGH Bank now holds 💰 ${lghBank.toLocaleString()} GBX.`);
    } else {
        // Failed attempt, lose 10-30% of user's balance
        const lossAmount = Math.max(1, Math.floor(userBalances[username].balance * (Math.random() * 0.2 + 0.1)));
        userBalances[username].balance -= lossAmount;
        lghBank += lossAmount;
        saveBalances();

        respondWithMessage.call(this, `🚔 ${nickname} got caught robbing LGH Bank and lost 💵 ${lossAmount.toLocaleString()} GBX!\n🏦 LGH Bank now holds 💰 ${lghBank.toLocaleString()} GBX.`);
    }
}*/

// 💰 `.donatebank [amount]` - Donate GojiBux to LGH Bank
/*if (wsmsg["text"].toLowerCase().startsWith(".donatebank ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (isNaN(amount) || amount <= 0 || (userBalances[username]?.balance || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient funds.");
        return;
    }

    // Deduct GojiBux from user and add it to LGH Bank
    userBalances[username].balance -= amount;
    lghBank += amount;
    saveBalances();
    localStorage.setItem("lghBank", lghBank);

    respondWithMessage.call(this, `🏦 ${nickname} donated 💵 ${amount.toLocaleString()} GBX to LGH Bank!`);
}*/

// 💰 .donatebank for GojiBux donations
if (wsmsg["text"].toLowerCase().startsWith(".donatebank ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .donatebank [amount|all]");
        return;
    }

    let amount;
    const userBalance = userBalances[username]?.balance || 0;

    if (args.toLowerCase() === "all") {
        amount = userBalance;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any GojiBux to donate.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || userBalance < amount) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient funds.");
            return;
        }
    }

    // Deduct GojiBux from user and add it to LGH Bank
    userBalances[username].balance -= amount;
    lghBank += amount;
    saveBalances();
    localStorage.setItem("lghBank", lghBank);

    respondWithMessage.call(this, `🏦 ${nickname} donated 💵 ${amount.toLocaleString()} GBX to LGH Bank!`);
}

// 💰 Universal Stashed GojiBux (Per-user)
let userStashes = JSON.parse(localStorage.getItem("userStashes")) || {};

// Function to save user stashes
function saveUserStashes() {
    localStorage.setItem("userStashes", JSON.stringify(userStashes));
}

// 🔒 `.stash [amount]` - Hide GojiBux from being stolen
/*if (wsmsg["text"].toLowerCase().startsWith(".stash ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (isNaN(amount) || amount <= 0 || (userBalances[username]?.balance || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient funds.");
        return;
    }

    // Move GBX to stash
    userBalances[username].balance -= amount;
    userStashes[username] = (userStashes[username] || 0) + amount;
    saveBalances();
    saveUserStashes();

    respondWithMessage.call(this, `🔒 ${nickname} stashed 💵 ${amount.toLocaleString()} GBX!`);
}*/

// 🔒 .stash
if (wsmsg["text"].toLowerCase().startsWith(".stash ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .stash [amount|all]");
        return;
    }

    let amount;
    const balanceAvailable = userBalances[username]?.balance || 0;

    if (args.toLowerCase() === "all") {
        amount = balanceAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any GBX to stash.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || amount > balanceAvailable) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient funds.");
            return;
        }
    }

    // Move GBX to stash
    userBalances[username].balance -= amount;
    userStashes[username] = (userStashes[username] || 0) + amount;
    saveBalances();
    saveUserStashes();

    respondWithMessage.call(this, `🔒 ${nickname} stashed 💵 ${amount.toLocaleString()} GBX!`);
}

// 💰 `.unstash [amount]` - Withdraw GBX from stash
/*if (wsmsg["text"].toLowerCase().startsWith(".unstash ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (isNaN(amount) || amount <= 0 || (userStashes[username] || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
        return;
    }

    // Move GBX back to balance
    userStashes[username] -= amount;
    userBalances[username].balance = (userBalances[username].balance || 0) + amount;
    saveBalances();
    saveUserStashes();

    respondWithMessage.call(this, `💰 ${nickname} withdrew 💵 ${amount.toLocaleString()} GBX from their stash!`);
}*/

// 💰 .unstash
if (wsmsg["text"].toLowerCase().startsWith(".unstash ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .unstash [amount|all]");
        return;
    }

    let amount;
    const stashAvailable = userStashes[username] || 0;

    if (args.toLowerCase() === "all") {
        amount = stashAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, your stash is empty.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || amount > stashAvailable) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    // Move GBX back to balance
    userStashes[username] -= amount;
    userBalances[username].balance = (userBalances[username].balance || 0) + amount;
    saveBalances();
    saveUserStashes();

    respondWithMessage.call(this, `💰 ${nickname} withdrew 💵 ${amount.toLocaleString()} GBX from their stash!`);
}

// 🔍 `.mystash` - Check stashed GojiBux
if (wsmsg["text"].toLowerCase() === ".mystash") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userStashes[username] || 0;

    respondWithMessage.call(this, `🔐 ${nickname}, you have 💵 ${stash.toLocaleString()} GBX stashed away.`);
}

// Weed Stash -----------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 🌿 WGH (Weed Global Holdings) - Prevent Reset & Respect Cap
const maxWeedSupply = 50000; // Hard cap: 50,000g
let storedWghBank = localStorage.getItem("wghBank");
let wghBank = storedWghBank !== null ? parseInt(storedWghBank) : 10000;

// Ensure WGH stays within valid range
if (wghBank < 0) wghBank = 0;
if (wghBank > maxWeedSupply) wghBank = maxWeedSupply;

// 🌿 Save WGH
function saveWGHBank() {
    localStorage.setItem("wghBank", wghBank);
}

// 🔍 Debugging Log
console.log(`WGH Bank Loaded: ${wghBank} grams`);

// 🛑 Ensure WGH Saves on Exit
window.addEventListener("beforeunload", saveWGHBank);

// 🌿 Universal Weed Storage (Per-user)
let userWeedStashes = JSON.parse(localStorage.getItem("userWeedStashes")) || {};

// 🌿 Dynamic Weed Pricing Variables
let weedBuyPrice = parseInt(localStorage.getItem("weedBuyPrice")) || 10;
let weedSellPrice = parseInt(localStorage.getItem("weedSellPrice")) || 8;

// Function to update weed prices dynamically
function updateWeedPrices() {
    const weedRatio = wghBank / maxWeedSupply; // % of total weed available

    // Price increases when weed is scarce, decreases when surplus
    weedBuyPrice = Math.max(5, Math.floor(10 * (1 + (0.5 - weedRatio)))); // Base ±50%
    weedSellPrice = Math.max(4, Math.floor(8 * (1 + (0.5 - weedRatio))));

    localStorage.setItem("weedBuyPrice", weedBuyPrice);
    localStorage.setItem("weedSellPrice", weedSellPrice);
}

// Update weed prices every 10 minutes based on supply/demand
setInterval(updateWeedPrices, 10 * 60 * 1000);

// Function to save user weed stashes
function saveWeedStashes() {
    localStorage.setItem("userWeedStashes", JSON.stringify(userWeedStashes));
}

// 🌿 Universal Joint Storage (Per-user)
let userJointStashes = JSON.parse(localStorage.getItem("userJointStashes")) || {};

// Function to save user joint stashes
function saveJointStashes() {
    localStorage.setItem("userJointStashes", JSON.stringify(userJointStashes));
}

// 🌿 `.buyweed [amount]` - Buy weed using GojiBux (Now Includes Taxes & Global Limits)
/*if (wsmsg["text"].toLowerCase().startsWith(".buyweed ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🤖 Usage: .buyweed [amount]");
        return;
    }

    const cost = Math.ceil(amount * weedBuyPrice * 1.02); // 2% Tax
    if ((userBalances[username]?.balance || 0) < cost) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough GojiBux! Weed currently costs 💵 ${weedBuyPrice} GBX per gram.`);
        return;
    }

    if (wghBank < amount) {
        respondWithMessage.call(this, `🤖 Not enough weed available in the market. Try a smaller amount.`);
        return;
    }

    // Deduct money and add weed to stash
    userBalances[username].balance -= cost;
    userWeedStashes[username] = (userWeedStashes[username] || 0) + amount;
    wghBank -= amount;
    saveBalances();
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `🌿 ${nickname} bought ${amount} grams of weed for 💵 ${cost.toLocaleString()} GBX.`);

    // Police Bust Check (5-10% chance)
    if (Math.random() < 0.1) {
        const bustAmount = Math.max(1, Math.floor(userWeedStashes[username] * (Math.random() * 0.3 + 0.2)));
        userWeedStashes[username] = Math.max(0, userWeedStashes[username] - bustAmount);
        wghBank -= bustAmount; // Remove from global supply
        saveWeedStashes();
        saveWGHBank();

        respondWithMessage.call(this, `🚔 Oh no! ${nickname} got busted and lost 🌿 ${bustAmount.toLocaleString()} grams of weed!`);
    }
}*/

// 🌿 .buyweed
if (wsmsg["text"].toLowerCase().startsWith(".buyweed ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .buyweed [amount|max]");
        return;
    }

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / (weedBuyPrice * 1.02));
    let amount;

    if (args.toLowerCase() === "max") {
        amount = Math.min(maxAffordable, wghBank);
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you can't afford any weed right now or the market supply is empty.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .buyweed [amount|max]");
            return;
        }

        if (amount > wghBank) {
            respondWithMessage.call(this, `🤖 Not enough weed available in the market. Try a smaller amount.`);
            return;
        }

        const requiredFunds = Math.ceil(amount * weedBuyPrice * 1.02);
        if (userBalance < requiredFunds) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough GojiBux! Weed currently costs 💵 ${weedBuyPrice} GBX per gram.`);
            return;
        }
    }

    const cost = Math.ceil(amount * weedBuyPrice * 1.02); // 2% Tax
    userBalances[username].balance -= cost;
    userWeedStashes[username] = (userWeedStashes[username] || 0) + amount;
    wghBank -= amount;
    saveBalances();
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `🌿 ${nickname} bought ${amount} grams of weed for 💵 ${cost.toLocaleString()} GBX.`);

    // Police Bust Check (5-10% chance)
    if (Math.random() < 0.1) {
        const bustAmount = Math.max(1, Math.floor(userWeedStashes[username] * (Math.random() * 0.3 + 0.2)));
        userWeedStashes[username] = Math.max(0, userWeedStashes[username] - bustAmount);
        wghBank = Math.max(0, wghBank - bustAmount); // Remove from global supply
        saveWeedStashes();
        saveWGHBank();

        respondWithMessage.call(this, `🚔 Oh no! ${nickname} got busted and lost 🌿 ${bustAmount.toLocaleString()} grams of weed!`);
    }
}

// 💰 `.sellweed [amount]` - Sell weed for GojiBux (Now Includes Taxes & Global Limits)
/*if (wsmsg["text"].toLowerCase().startsWith(".sellweed ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🤖 Usage: .sellweed [amount]");
        return;
    }

    if ((userWeedStashes[username] || 0) < amount) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to sell.`);
        return;
    }

    const earnings = applyTax(amount * weedSellPrice, 0.05); // 5% Tax

    if (lghBank < earnings) {
        respondWithMessage.call(this, `🤖 The economy is struggling! Not enough GBX available for this transaction.`);
        return;
    }

    userWeedStashes[username] -= amount;
    userBalances[username].balance = (userBalances[username].balance || 0) + earnings;
    wghBank += amount;
    lghBank -= earnings;
    saveBalances();
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `💰 ${nickname} sold ${amount} grams of weed for 💵 ${earnings.toLocaleString()} GBX.`);
}*/

// 💰 .sellweed
if (wsmsg["text"].toLowerCase().startsWith(".sellweed ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .sellweed [amount|all]");
        return;
    }

    const weedAvailable = userWeedStashes[username] || 0;
    let amount;

    if (args.toLowerCase() === "all") {
        amount = weedAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any weed to sell.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || weedAvailable < amount) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to sell.`);
            return;
        }
    }

    const earnings = applyTax(amount * weedSellPrice, 0.05); // 5% Tax

    if (lghBank < earnings) {
        respondWithMessage.call(this, `🤖 The economy is struggling! Not enough GBX available for this transaction.`);
        return;
    }

    userWeedStashes[username] -= amount;
    userBalances[username].balance = (userBalances[username].balance || 0) + earnings;
    wghBank += amount;
    lghBank -= earnings;
    saveBalances();
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `💰 ${nickname} sold ${amount} grams of weed for 💵 ${earnings.toLocaleString()} GBX.`);
}

// 💰 `.donateweed [amount]` - Donate weed to WGH
/*if (wsmsg["text"].toLowerCase().startsWith(".donateweed ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username || isNaN(amount) || amount <= 0 || (userWeedStashes[username] || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
        return;
    }

    userWeedStashes[username] -= amount;
    wghBank += amount;
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `🌿 ${nickname} donated ${amount} grams of weed to the WGH stash!`);
}*/

// 🌿 .donateweed
if (wsmsg["text"].toLowerCase().startsWith(".donateweed ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .donateweed [amount|all]");
        return;
    }

    let amount;
    const weedAvailable = userWeedStashes[username] || 0;

    if (args.toLowerCase() === "all") {
        amount = weedAvailable;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any weed to donate.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0 || weedAvailable < amount) {
            respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
            return;
        }
    }

    userWeedStashes[username] -= amount;
    wghBank += amount;
    saveWeedStashes();
    saveWGHBank();

    respondWithMessage.call(this, `🌿 ${nickname} donated ${amount} grams of weed to the WGH stash!`);
}

// 🕒 Cooldown storage for `.grow`
let lastGrowTime = JSON.parse(localStorage.getItem("lastGrowTime")) || {};

// 💰 `.grow` - Grow a random amount of weed for your stash! (30-minute cooldown)
if (wsmsg["text"].toLowerCase() === ".grow") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const now = Date.now();
    const lastGrow = lastGrowTime[username] || 0;
    const cooldown = 30 * 60 * 1000; // 30-minute cooldown

    if (now - lastGrow < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastGrow)) / 60000);
        respondWithMessage.call(this, `⏳ ${nickname}, your plants need more time! Try again in ${timeLeft} minutes.`);
        return;
    }

    // 🌿 Random Weed Growth (0-1792 grams per grow)
    const grownGrams = Math.floor(Math.random() * 1793); // 0 to 1792 grams
    const grownPounds = (grownGrams / 448).toFixed(2); // Convert grams to pounds (rounded to 2 decimal places)

    userWeedStashes[username] = (userWeedStashes[username] || 0) + grownGrams;
    lastGrowTime[username] = now;

    // Save Grow Time & Stash
    saveWeedStashes();
    localStorage.setItem("lastGrowTime", JSON.stringify(lastGrowTime));

    // 🌾 Funny Messages
    let response;
    if (grownGrams === 0) {
        response = `🚬 ${nickname} tried to grow some weed, but the crop failed. Better luck next time!`;
    } else {
        const messages = [
            `🌿 ${nickname} cultivated a strong batch and harvested ${grownPounds} lb [${grownGrams.toLocaleString()}g] of premium kush!`,
            `🔥 ${nickname} just grew ${grownPounds} lb [${grownGrams.toLocaleString()}g] of top-shelf bud! Time to cure it.`,
            `💨 ${nickname} harvested ${grownPounds} lb [${grownGrams.toLocaleString()}g] of sticky, stanky goodness!`,
            `🌱 ${nickname} carefully tended their plants and yielded ${grownPounds} lb [${grownGrams.toLocaleString()}g] of fire!`,
            `🍃 ${nickname} worked the grow op and scored ${grownPounds} lb [${grownGrams.toLocaleString()}g] of high-grade green!`
        ];
        response = messages[Math.floor(Math.random() * messages.length)];
    }

    respondWithMessage.call(this, response);
}

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

    // Extract amount from message (e.g., ".giveweed 1000")
    const args = wsmsg["text"].split(" ");
    let amount = parseInt(args[1]);

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

    respondWithMessage.call(this, `🚀 All ${userCount} users just got ${amount.toLocaleString()} grams of premium bud! 🌿🔥`);
}

// 🌿 4:20 Auto-Weed Giveaway
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

    // Send 4:20 alert and give everyone 420g of weed
    if (shouldSendMessage) {
        shouldSendMessage = false; // Reset the flag immediately to prevent multiple sends

        setTimeout(() => {
            this._send('{"stumble":"msg","text": "🤖 It\'s 4:20 somewhere! Smoke em if you got em! 💨"}');

            setTimeout(() => {
                // Give everyone 420g of weed
                let userCount = 0;
                for (const user in userWeedStashes) {
                    if (userWeedStashes.hasOwnProperty(user)) {
                        userWeedStashes[user] = (userWeedStashes[user] || 0) + 420;
                        userCount++;
                    }
                }

                saveWeedStashes();

                this._send(`{"stumble":"msg","text": "🌿 All ${userCount} users just got 420 grams of premium bud! Blaze it! 🔥💨"}`);
            }, 3000); // 3-second delay before giving the weed
        }, 1000); // 1-second delay for initial 4:20 message
    }
}, 1000);

// 🕒 Cooldown storage for `.getweed`
//let lastWeedWithdrawals = JSON.parse(localStorage.getItem("lastWeedWithdrawals")) || {};

// 💰 `.getweed` - Withdraw a random amount of weed from WGH ([1] 30-minute cooldown)
/*if (wsmsg["text"].toLowerCase() === ".getweed") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    const now = Date.now();
    const lastClaim = lastWeedWithdrawals[username] || 0;
    const cooldown = 1 * 60 * 1000; // [1] 30-minute cooldown

    if (now - lastClaim < cooldown) {
        const timeLeft = Math.ceil((cooldown - (now - lastClaim)) / 60000);
        respondWithMessage.call(this, `⏳ ${nickname}, you need to wait ${timeLeft} seconds before withdrawing more weed.`);
        return;
    }

    if (wghBank < 1) {
        respondWithMessage.call(this, "🤖 WGH stash is empty! No weed to withdraw.");
        return;
    }

    // Randomize withdrawal amount (between 1 and 10 grams, but not more than what's available)
    const amount = Math.min(Math.floor(Math.random() * 10) + 1, wghBank);

    wghBank -= amount;
    userWeedStashes[username] = (userWeedStashes[username] || 0) + amount;
    lastWeedWithdrawals[username] = now;
    saveWeedStashes();
    saveWGHBank();
    localStorage.setItem("lastWeedWithdrawals", JSON.stringify(lastWeedWithdrawals));

    // Randomized success messages
    const messages = [
        `🌿 ${nickname} dipped into the stash and snagged ${amount} grams!`,
        `🔥 ${nickname} grabbed ${amount} grams of the good stuff from WGH!`,
        `💨 ${nickname} withdrew ${amount} grams of weed. Time to roll up!`,
        `🍃 ${nickname} pulled ${amount} grams from the stash. Puff puff pass!`
    ];

    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}*/

// 🔥 `.weedprice` - Show current dynamic weed prices
if (wsmsg["text"].toLowerCase() === ".weedprice") {
    respondWithMessage.call(this, `🌿 Current Weed Prices:\n💵 Buy: ${weedBuyPrice.toLocaleString()} GBX/gram\n💰 Sell: ${weedSellPrice.toLocaleString()} GBX/gram`);
}

// 🌿 .myweed
/*if (wsmsg['text'].toLowerCase() === ".myweed") {
    const handle = wsmsg['handle'];
    const username = userHandles[handle];
    const stash = userWeedStashes[username] || 0;
    const buyPrice = weedBuyPrice.toLocaleString();
    const sellPrice = weedSellPrice.toLocaleString();

    const messages = [
        `🌿 Your Weed Stash: ${stash} grams`//,
        //`🔥 Current Weed Prices: Buy: ${buyPrice} GBX/gram | Sell: ${sellPrice} GBX/gram`
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}*/

// 🌿 .myweed
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
        `🌿 ${nickname}'s Weed Stash: ${stashText.join(" ")} (${userWeedStashes[username]}g)`,
        //`🔥 Current Weed Prices: Buy: ${buyPrice} GBX/gram | Sell: ${sellPrice} GBX/gram`
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}

// 🌿 .jointroll
/*if (wsmsg["text"].toLowerCase().startsWith(".jointroll ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🤖 Usage: .jointroll [amount]");
        return;
    }

    const requiredWeed = amount * (Math.random() < 0.5 ? 1 : 2); // 1-2 grams per joint
    if ((userWeedStashes[username] || 0) < requiredWeed) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to roll ${amount} joints.`);
        return;
    }

    // Deduct weed and add joints
    userWeedStashes[username] -= requiredWeed;
    userJointStashes[username] = (userJointStashes[username] || 0) + amount;
    saveWeedStashes();
    saveJointStashes();

    respondWithMessage.call(this, `🌿 ${nickname} rolled ${amount} joints using ${requiredWeed} grams of weed.`);
}*/

// 🌿 .jointroll
if (wsmsg["text"].toLowerCase().startsWith(".jointroll ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .jointroll [amount|max]");
        return;
    }

    const weedAvailable = userWeedStashes[username] || 0;
    let amount, requiredWeed;

    const randomJointCost = () => (Math.floor(Math.random() * 6) * 0.5) + 1; // 1 to 3.5 grams in 0.5 steps

    if (args.toLowerCase() === "max") {
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
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .jointroll [amount|max]");
            return;
        }

        requiredWeed = 0;
        for (let i = 0; i < amount; i++) {
            requiredWeed += randomJointCost();
        }

        if (weedAvailable < requiredWeed) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough weed to roll ${amount} joints. (${requiredWeed} grams needed)`);
            return;
        }
    }

    requiredWeed = parseFloat(requiredWeed.toFixed(1));

    // Deduct weed and add joints
    userWeedStashes[username] -= requiredWeed;
    userJointStashes[username] = (userJointStashes[username] || 0) + amount;
    saveWeedStashes();
    saveJointStashes();

    respondWithMessage.call(this, `🌿 ${nickname} rolled ${amount} joint${amount !== 1 ? 's' : ''} using ${requiredWeed} grams of weed.`);
}

// 🌿 .myjoints
if (wsmsg["text"].toLowerCase() === ".myjoints") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userJointStashes[username] || 0;

    respondWithMessage.call(this, `🌿 ${nickname}, you have ${stash} joints ready to smoke.`);
}

// 🌿 .jointsmoke
/*if (wsmsg["text"].toLowerCase().startsWith(".jointsmoke ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const amount = parseInt(wsmsg["text"].split(" ")[1]);

    if (!username || isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, "🤖 Usage: .jointsmoke [amount]");
        return;
    }

    if ((userJointStashes[username] || 0) < amount) {
        respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough joints to smoke.`);
        return;
    }

    // Deduct joints and add a fun message
    userJointStashes[username] -= amount;
    saveJointStashes();

    const responses = [
        `💨 ${nickname} smoked ${amount} joint(s) and is feeling chill. 😎`,
        `🔥 ${nickname} sparked up ${amount} joint(s) and is now flying high. 🚀`,
        `💨 ${amount} joints down! ${nickname} is baked as hell. 🍃`
    ];
    respondWithMessage.call(this, responses[Math.floor(Math.random() * responses.length)]);
}*/

// 🌿 .jointsmoke
if (wsmsg["text"].toLowerCase().startsWith(".jointsmoke ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ")[1];

    if (!username || !args) {
        respondWithMessage.call(this, "🤖 Usage: .jointsmoke [amount|max]");
        return;
    }

    let amount;
    const jointsAvailable = userJointStashes[username] || 0;

    if (args.toLowerCase() === "max") {
        amount = userJointStashes[username] || 0;
        if (amount <= 0) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have any joints to smoke.`);
            return;
        }
    } else {
        amount = parseInt(args, 10);
        if (isNaN(amount) || amount <= 0) {
            respondWithMessage.call(this, "🤖 Usage: .jointsmoke [amount|max]");
            return;
        }

        if (amount > jointsAvailable) {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough joints. (${amount} requested, ${userJointStashes[username] || 0} available)`);
            return;
        }
    }

    // Deduct joints
    userJointStashes[username] -= amount;
    saveJointStashes();

    const responses = [
        `💨 ${nickname} smoked ${amount} joint${amount > 1 ? 's' : ''} and is feeling chill. 😎`,
        `🔥 ${nickname} sparked up ${amount} joint${amount > 1 ? 's' : ''} and is now flying high. 🚀`,
        `💨 ${amount} joint${amount > 1 ? 's' : ''} down! ${nickname} is baked. 😌`,
        `🌬️ ${nickname} puffed through ${amount} joint${amount > 1 ? 's' : ''}, clouds everywhere! 🌫️`,
        `🍃 After ${amount} joint${amount > 1 ? 's' : ''}, ${nickname} is officially couch-locked. 🛋️`,
        `🌬️ ${nickname} finished off ${amount} joint${amount > 1 ? 's' : ''}—time to vibe out. 🎶`,
        `🌀 ${nickname} blazed ${amount} joint${amount > 1 ? 's' : ''} and unlocked enlightenment mode. 🌀`,
        `🌌 ${nickname} toked ${amount} joint${amount > 1 ? 's' : ''} and entered another dimension. ✨`,
        `🍃 ${amount} joint${amount > 1 ? 's' : ''} later, ${nickname} is higher than giraffe ears. 🦒`,
        `😵‍💫 After ${amount} joint${amount > 1 ? 's' : ''}, ${nickname} forgot why they even started smoking...`
    ];
    const randomMessage = responses[Math.floor(Math.random() * responses.length)];
    respondWithMessage.call(this, randomMessage);
}

// 🌿 .sesh
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
        respondWithMessage.call(this, `🔥 Group sesh! Smoked ${consumedTotal} grams.`);
        respondWithMessage.call(this, `💨 Contributions: ${usersSmoked.join(", ")}`);
    } else {
        respondWithMessage.call(this, "🤖 The sesh was weak. No one had enough to spare.");
    }
}

// 🔄 `.sendweed [username] [amount]` - Send weed to another user
if (wsmsg["text"].toLowerCase().startsWith(".sendweed ")) {
    const args = wsmsg["text"].split(" ");
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .sendweed [username] [amount]");
        return;
    }

    const handle = wsmsg["handle"];
    const sender = userHandles[handle];
    const senderNickname = userNicknames[sender]?.nickname || sender || "you";
    const recipientUsername = args[1]; // Use raw username input
    const amount = parseInt(args[2]);

    if (!sender || !userNicknames[recipientUsername]) {
        respondWithMessage.call(this, "🤖 Error: Could not find the recipient.");
        return;
    }

    if (isNaN(amount) || amount <= 0 || (userWeedStashes[sender] || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
        return;
    }

    userWeedStashes[sender] -= amount;
    userWeedStashes[recipientUsername] = (userWeedStashes[recipientUsername] || 0) + amount;
    saveWeedStashes();

    respondWithMessage.call(this, `🌿 ${senderNickname} sent ${amount} grams of weed to ${userNicknames[recipientUsername]?.nickname || recipientUsername}!`);
}

// 🔄 `.stealweed [username]` - Attempt to steal weed from another user
if (wsmsg["text"].toLowerCase().startsWith(".stealweed ")) {
    const args = wsmsg["text"].split(" ");
    if (args.length < 2) {
        respondWithMessage.call(this, "🤖 Usage: .stealweed [username]");
        return;
    }

    const handle = wsmsg["handle"];
    const thief = userHandles[handle];
    const thiefNickname = userNicknames[thief]?.nickname || thief;
    const victimUsername = args[1]; // Use raw username input

    if (!thief || !userNicknames[victimUsername]) {
        respondWithMessage.call(this, "🤖 That user doesn't exist or has no weed.");
        return;
    }

    if ((userWeedStashes[victimUsername] || 0) < 1) {
        respondWithMessage.call(this, `🤖 ${userNicknames[victimUsername]?.nickname || victimUsername} doesn't have any weed to steal.`);
        return;
    }

    let stealAmount = Math.floor(Math.random() * 5) + 1;
    let caught = Math.random() < 0.5;

    if (caught) {
        // Thief gets caught and loses double the amount they tried to steal
        userWeedStashes[thief] = Math.max(0, (userWeedStashes[thief] || 0) - (stealAmount * 2));
        saveWeedStashes();
        respondWithMessage.call(this, `🚨 ${thiefNickname} got CAUGHT trying to rob ${userNicknames[victimUsername]?.nickname || victimUsername}! Lost ${stealAmount * 2} grams instead!`);
    } else {
        // Successful steal
        userWeedStashes[victimUsername] -= stealAmount;
        userWeedStashes[thief] = (userWeedStashes[thief] || 0) + stealAmount;
        saveWeedStashes();
        respondWithMessage.call(this, `😈 ${thiefNickname} successfully stole ${stealAmount} grams from ${userNicknames[victimUsername]?.nickname || victimUsername}!`);
    }
}

// 🛠️ Active Job Challenges (Per-user)
let userChallenges = {};

// 💼 `.work` - Start a job and type the challenge word for GBX rewards
if (wsmsg["text"].toLowerCase() === ".work") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (userChallenges[username]) {
        respondWithMessage.call(this, `🤖 ${nickname}, you already have an active job! Type .do "${userChallenges[username].word}" to complete it.`);
        return;
    }

    if (lghBank < 20) {
        respondWithMessage.call(this, "🤖 The economy is struggling! No GojiBux available to earn right now.");
        return;
    }

    // Random job descriptions
    const jobs = [
        "delivering pizzas", "rolling the world's fattest blunt", "coding a sketchy app",
        "fixing a hacked ATM", "running a gambling ring", "breaking into a safe",
        "selling fake concert tickets", "digging a tunnel for a heist", "smuggling exotic snacks",
        "becoming an influencer for 5 minutes", "selling *questionable* NFTs"
    ];

    // Random word challenge (No prefixes)
    const words = ["stonks", "blunt", "hustle", "gigachad", "bankrupt", "gojibux", "sesh", "billionaire"];
    const challengeWord = words[Math.floor(Math.random() * words.length)];

    const reward = Math.floor(Math.random() * (300 - 50 + 1)) + 50; // Earn between 50 - 300 GBX
    const timeLimit = Math.floor(Math.random() * (10 - 5 + 1)) + 5; // 5 to 10 seconds

    // Save the user's challenge
    userChallenges[username] = {
        word: challengeWord,
        reward: reward,
        expiresAt: Date.now() + timeLimit * 1000
    };

    // Inform user of the job
    respondWithMessage.call(this,
        `💼 ${nickname} is ${jobs[Math.floor(Math.random() * jobs.length)]}! ` +
        `Type .do "${challengeWord}" within ${timeLimit} seconds to complete the job and earn 💵 ${reward.toLocaleString()} GBX!`
    );

    // Automatically clear challenge if time runs out
    setTimeout(() => {
        if (userChallenges[username] && Date.now() > userChallenges[username].expiresAt) {
            delete userChallenges[username];
            respondWithMessage.call(this, `⏳ ${nickname}, you took too long! The job expired.`);
        }
    }, timeLimit * 1000);
}

// 📝 `.job` - Check active job status (if user forgot their word)
if (wsmsg["text"].toLowerCase() === ".job") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (!userChallenges[username]) {
        respondWithMessage.call(this, `🤖 ${nickname}, you have no active job right now. Use .work to start one!`);
        return;
    }

    const { word, expiresAt } = userChallenges[username];
    const timeLeft = Math.max(0, Math.floor((expiresAt - Date.now()) / 1000));

    respondWithMessage.call(this, `💼 ${nickname}, your current job is still active! Type .do "${word}" within ${timeLeft} seconds to complete it.`);
}

// ✅ Job Completion - Detect ".do [word]" messages
if (wsmsg["text"].toLowerCase().startsWith(".do ")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    if (!username || !userChallenges[username]) return; // No active challenge

    const userInput = wsmsg["text"].slice(4).trim().toLowerCase(); // Extract word after ".do "
    const { word, reward, expiresAt } = userChallenges[username];

    if (Date.now() > expiresAt) {
        delete userChallenges[username];
        respondWithMessage.call(this, `⏳ ${userNicknames[username]?.nickname || username}, you took too long! The job expired.`);
        return;
    }

    // **Check if the user typed the correct word**
    if (userInput === word.toLowerCase()) {
        if (lghBank < reward) {
            respondWithMessage.call(this, "🏦 LGH Bank is too broke to pay you.");
            return;
        }

        // Award the user
        userBalances[username] = userBalances[username] || { balance: 1 };
        userBalances[username].balance += reward;
        lghBank -= reward;
        delete userChallenges[username];

        saveBalances();

        respondWithMessage.call(this, `✅ ${userNicknames[username]?.nickname || username} completed the job and earned 💵 ${reward.toLocaleString()} GBX!`);
    } else {
        respondWithMessage.call(this, `❌ Wrong word, ${userNicknames[username]?.nickname || username}! Try again.`);
    }
}

// 💹 .economy
if (wsmsg['text'].toLowerCase() === ".economy") {
    const totalLGH = lghBank.toLocaleString();
    const totalWGH = wghBank.toLocaleString();
    const buyPrice = weedBuyPrice.toLocaleString();
    const sellPrice = weedSellPrice.toLocaleString();

    const messages = [
        `🏦 **LGH Bank Total:** ${totalLGH} GBX (Max: 1,000,000 GBX)`,
        `🏦 **WGH Bank Total:** ${totalWGH} grams (Max: 50,000g)`,
        `🔥 **Current Weed Prices:** Buy: ${buyPrice} GBX/gram | Sell: ${sellPrice} GBX/gram`
    ];

    messages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}

// 🏛 `.lgh` - Show the total GojiBux stored in the LGH Bank
if (wsmsg["text"].toLowerCase() === ".lgh") {
    respondWithMessage.call(this, `🏦 LGH Bank currently holds 💰 ${lghBank.toLocaleString()} GBX in total!`);
}

// 📊 `.topbux` - Show the top 10 richest users in GojiBux
if (wsmsg["text"].toLowerCase() === ".topbux") {
    let sortedUsers = Object.entries(userBalances)
        .sort((a, b) => (b[1]?.balance || 0) - (a[1]?.balance || 0))
        .slice(0, 10);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No GojiBux data available.");
        return;
    }

    let leaderboard = "📊 **Top 10 GojiBux Holders** 💵\n";
    sortedUsers.forEach(([username, data], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${index + 1}. ${nickname} - 💵 ${data.balance.toLocaleString()} GBX\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

// 🏝️ `.topblk` - Show the top 10 users with the largest offshore stash
if (wsmsg["text"].toLowerCase() === ".topblk") {
    let sortedOffshoreUsers = Object.entries(userStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 10);

    if (sortedOffshoreUsers.length === 0) {
        respondWithMessage.call(this, "🏝️ No offshore stash data available.");
        return;
    }

    let leaderboard = "🏝️ **Top 10 Offshore Stashes** 💰\n";
    sortedOffshoreUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${index + 1}. ${nickname} - 💵 ${stash.toLocaleString()} GBX hidden offshore\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

// 🏦 `.wgh` - Check global stash
if (wsmsg["text"].toLowerCase() === ".wgh") {
    respondWithMessage.call(this, `🏦 WGH Stash currently holds 🌿 ${wghBank.toLocaleString()} grams of weed.`);
}

// 🌿 `.topweed` - Show the top 10 users with the most weed stash
if (wsmsg["text"].toLowerCase() === ".topweed") {
    let sortedWeedUsers = Object.entries(userWeedStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 10);

    if (sortedWeedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No weed stash data available.");
        return;
    }

    let leaderboard = "🌿 **Top 10 Weed Stashes**\n";
    sortedWeedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${index + 1}. ${nickname} - 🌿 ${stash.toLocaleString()} grams\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

// 📊 `.balance` - Show full economy details for the user
if (wsmsg["text"].toLowerCase().startsWith(".balance")) {
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

    const balance = userBalances[targetUsername]?.balance || 1; // GojiBux balance
    const offshore = userStashes[targetUsername] || 0; // Offshore stash
    const weed = userWeedStashes[targetUsername] || 0; // Weed stash
    const joints = userJointStashes[targetUsername] || 0; // Joint stash
    //const totalLGH = lghBank.toLocaleString(); // Total GBX in LGH Bank
    //const totalWGH = wghBank.toLocaleString(); // Total grams in WGH Bank
    //const buyPrice = weedBuyPrice.toLocaleString(); // Current buy price
    //const sellPrice = weedSellPrice.toLocaleString(); // Current sell price

    respondWithMessage.call(this,
        `🤖 ${targetUser.nickname || targetUsername}'s Economy Stats:\n` +
        `💵 GojiBux Balance: ${balance.toLocaleString()} GBX\n` +
        `🏝️ Offshore Stash: ${offshore.toLocaleString()} GBX\n` +
        `🌿 Weed Stash: ${weed.toLocaleString()} grams\n` +
        `🚬 Joints: ${joints.toLocaleString()} rolled\n`
        //`🏦 LGH Bank Total: ${totalLGH} GBX\n` +
        //`🏦 WGH Bank Total: ${totalWGH} grams\n` +
        //`🔥 Weed Prices: Buy: ${buyPrice} GBX/gram | Sell: ${sellPrice} GBX/gram`
    );
}

// 📊 `.circulation` - Show total circulating economy stats (split into 2 messages)
if (wsmsg["text"].toLowerCase() === ".circulation") {
    // Calculate total GojiBux in circulation
    const totalUserBalances = Object.values(userBalances).reduce((sum, data) => sum + (data.balance || 0), 0);
    const totalOffshore = Object.values(userStashes).reduce((sum, stash) => sum + (stash || 0), 0);
    const totalGbxSupply = lghBank + totalUserBalances + totalOffshore;

    // Calculate total weed in circulation
    const totalUserWeed = Object.values(userWeedStashes).reduce((sum, stash) => sum + (stash || 0), 0);
    const totalWeedSupply = wghBank + totalUserWeed;

    // Calculate total joints in circulation
    const totalJoints = Object.values(userJointStashes).reduce((sum, stash) => sum + (stash || 0), 0);

    // Send first part (GojiBux data)
    respondWithMessage.call(this,
        `📊 Total Economy Circulation (GojiBux):\n` +
        `💵 Total GojiBux in Circulation: ${totalGbxSupply.toLocaleString()} GBX\n` +
        `🏦 LGH Bank Holdings: ${lghBank.toLocaleString()} GBX\n` +
        `👤 Total User Balances: ${totalUserBalances.toLocaleString()} GBX\n` +
        `🏝️ Total Offshore Stash: ${totalOffshore.toLocaleString()} GBX`
    );

    // Send second part (Weed & Joints data) after 1-second delay
    setTimeout(() => {
        respondWithMessage.call(this,
            `🌿 Total Economy Circulation (Weed & Joints):\n` +
            `🌿 Total Weed in Circulation: ${totalWeedSupply.toLocaleString()} grams\n` +
            `🏦 WGH Bank Holdings: ${wghBank.toLocaleString()} grams\n` +
            `👤 Total User Weed Stashes: ${totalUserWeed.toLocaleString()} grams\n` +
            `🚬 Total Joints Rolled: ${totalJoints.toLocaleString()}`
        );
    }, 1000);
}



// STONKS STONKS STONKS

// 🏦 GojiBux Stock Market
let stocks = {
    "WEED": { price: Math.floor(Math.random() * 91) + 10 }, // 10 - 100 GBX
    "DANK": { price: Math.floor(Math.random() * 91) + 10 },
    "GOJI": { price: Math.floor(Math.random() * 91) + 10 }
};

let userStocks = JSON.parse(localStorage.getItem("userStocks")) || {}; // Track user investments

function updateStockPrices() {
    for (const stock in stocks) {
        if (stocks.hasOwnProperty(stock)) {
            let change = Math.floor(Math.random() * 21) - 10; // Random +/- 10 GBX
            stocks[stock].price = Math.max(1, stocks[stock].price + change); // Ensure price never goes below 1
        }
    }
    localStorage.setItem("stocks", JSON.stringify(stocks));
}

// Update stock prices every minute
setInterval(updateStockPrices, 60000);


// 📊 `.stocks` - Show stock prices
if (wsmsg["text"].toLowerCase() === ".stocks") {
    let stockMessage = "📈 **Current Stock Prices:**\n";
    for (const stock in stocks) {
        stockMessage += `💰 ${stock}: ${stocks[stock].price} GBX\n`;
    }
    respondWithMessage.call(this, stockMessage);
}


// 🛒 `.buy STOCK AMOUNT` - Buy stocks
if (wsmsg["text"].toLowerCase().startsWith(".buy ")) {
    const args = wsmsg["text"].split(" ");
    const stock = args[1]?.toUpperCase();
    const amount = parseInt(args[2]);
    const handle = wsmsg["handle"];
    const username = userHandles[handle];

    if (!stocks[stock]) {
        respondWithMessage.call(this, `❌ Invalid stock! Use .stocks to see available stocks.`);
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, `❌ Invalid amount! Example: .buy WEED 5`);
        return;
    }

    const cost = stocks[stock].price * amount;

    if (userBalances[username].balance < cost) {
        respondWithMessage.call(this, `💸 Not enough GojiBux! You need ${cost} GBX.`);
        return;
    }

    // Deduct GojiBux and add stocks
    userBalances[username].balance -= cost;
    userStocks[username] = userStocks[username] || {};
    userStocks[username][stock] = (userStocks[username][stock] || 0) + amount;

    saveBalances();
    localStorage.setItem("userStocks", JSON.stringify(userStocks));

    respondWithMessage.call(this, `✅ You bought ${amount} shares of ${stock} at ${stocks[stock].price} GBX each!`);
}


// 💰 `.sell STOCK AMOUNT` - Sell stocks
if (wsmsg["text"].toLowerCase().startsWith(".sell ")) {
    const args = wsmsg["text"].split(" ");
    const stock = args[1]?.toUpperCase();
    const amount = parseInt(args[2]);
    const handle = wsmsg["handle"];
    const username = userHandles[handle];

    if (!stocks[stock]) {
        respondWithMessage.call(this, `❌ Invalid stock! Use .stocks to see available stocks.`);
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        respondWithMessage.call(this, `❌ Invalid amount! Example: .sell WEED 5`);
        return;
    }

    if (!userStocks[username] || !userStocks[username][stock] || userStocks[username][stock] < amount) {
        respondWithMessage.call(this, `❌ You don't have enough ${stock} to sell!`);
        return;
    }

    // Sell stocks at current price
    const earnings = stocks[stock].price * amount;
    userBalances[username].balance += earnings;
    userStocks[username][stock] -= amount;

    if (userStocks[username][stock] === 0) {
        delete userStocks[username][stock]; // Remove empty holdings
    }

    saveBalances();
    localStorage.setItem("userStocks", JSON.stringify(userStocks));

    respondWithMessage.call(this, `✅ You sold ${amount} shares of ${stock} for ${earnings} GBX!`);
}


// 🏦 `.mystocks` - View stock portfolio
if (wsmsg["text"].toLowerCase() === ".mystocks") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];

    if (!userStocks[username] || Object.keys(userStocks[username]).length === 0) {
        respondWithMessage.call(this, `📉 You don’t own any stocks yet! Use .buy STOCK AMOUNT`);
        return;
    }

    let portfolioMessage = "📊 **Your Stock Portfolio:**\n";
    for (const stock in userStocks[username]) {
        portfolioMessage += `💰 ${stock}: ${userStocks[username][stock]} shares (${stocks[stock].price} GBX each)\n`;
    }

    respondWithMessage.call(this, portfolioMessage);
}


// 🏦 Set dividend payout rate (2% of stock price per share)
/*const DIVIDEND_RATE = 0.02;

// 🕒 Give dividends every 10 minutes
setInterval(() => {
    let totalPayouts = 0;

    for (const username in userStocks) {
        if (userStocks.hasOwnProperty(username)) {
            let totalEarnings = 0;

            for (const stock in userStocks[username]) {
                if (stocks.hasOwnProperty(stock)) {
                    let sharesOwned = userStocks[username][stock];
                    let stockPrice = stocks[stock].price;
                    let dividend = Math.floor((stockPrice * DIVIDEND_RATE) * sharesOwned);

                    totalEarnings += dividend;
                }
            }

            if (totalEarnings > 0) {
                userBalances[username].balance += totalEarnings;
                totalPayouts += totalEarnings;
            }
        }
    }

    saveBalances();

    // Announce dividends
    if (totalPayouts > 0) {
        this._send(`{"stumble":"msg","text": "💵 Dividend Payout! Stockholders just earned a total of ${totalPayouts.toLocaleString()} GBX in passive income! 🤑"}`);
    }
}, 600000); // Runs every 10 minutes (600,000ms)*/


// 🎰 `.gamble AMOUNT` - Bet GojiBux for a chance to win!
if (wsmsg["text"].toLowerCase().startsWith(".gamble ")) {
    const args = wsmsg["text"].split(" ");
    const betAmount = parseInt(args[1]);
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (isNaN(betAmount) || betAmount <= 0) {
        respondWithMessage.call(this, "❌ Invalid amount! Example: .gamble 500");
        return;
    }

    if (userBalances[username].balance < betAmount) {
        respondWithMessage.call(this, `💸 Not enough GojiBux! You only have ${userBalances[username].balance} GBX.`);
        return;
    }

    // 🎲 Gambling probabilities
    const roll = Math.random(); // Generates a number between 0.0 and 1.0
    let winnings = 0;
    let lostToBank = 0;
    let resultMessage = "";

    if (roll < 0.05) { // 5% chance - JACKPOT (5x payout)
        winnings = betAmount * 5;
        resultMessage = `🎉 JACKPOT! ${nickname} just turned ${betAmount.toLocaleString()} GBX into ${winnings.toLocaleString()} GBX! 🎰💰`;
    } else if (roll < 0.35) { // 30% chance - Double the money (2x payout)
        winnings = betAmount * 2;
        resultMessage = `🔥 Lucky win! ${nickname} doubled their money and now has ${winnings.toLocaleString()} GBX! 🤑`;
    } else if (roll < 0.65) { // 30% chance - Lose half (Half goes to LGH Bank)
        winnings = -Math.floor(betAmount / 2);
        lostToBank = Math.abs(winnings);
        resultMessage = `😐 Oof! ${nickname} lost half their bet. -${lostToBank.toLocaleString()} GBX.`;
    } else { // 35% chance - Lose everything (Full amount goes to LGH Bank)
        winnings = -betAmount;
        lostToBank = Math.abs(winnings);
        resultMessage = `💸 Tough luck! ${nickname} lost their entire bet of ${betAmount.toLocaleString()} GBX. 😭`;
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
}


// ⚠️ `.clearGojiBux` - Wipe all balances & reset LGH (Admin-only)
/*if (wsmsg["text"].toLowerCase() === ".cleargojibux") {
    userBalances = {};
    lghBank = 1; // Reset LGH
    localStorage.removeItem("userBalances");
    localStorage.removeItem("lghBank");

    respondWithMessage.call(this, "🤖 All GojiBux balances and LGH Bank have been cleared.");
}*/

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
}

// Spaget ---------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 🍝 Global Spaghetti Storage (Per-user)
let userSpaghettiStashes = JSON.parse(localStorage.getItem("userSpaghettiStashes")) || {};

// 🍝 Last Spaghetti Claim Time (Per-user)
let lastSpaghettiClaim = JSON.parse(localStorage.getItem("lastSpaghettiClaim")) || {};

if (wsmsg["text"].toLowerCase() === ".spaget") {
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
    if (lastSpaghettiClaim[username] && now - lastSpaghettiClaim[username] < cooldown) {
        const remaining = Math.ceil((cooldown - (now - lastSpaghettiClaim[username])) / 60000);
        respondWithMessage.call(this, `⏳ ${nickname}, you can claim more spaghetti in ${remaining} minutes.`);
        return;
    }

    // Earn 1-5 SPG
    const earnedSpaghetti = Math.floor(Math.random() * 5) + 1;
    userSpaghettiStashes[username] = (userSpaghettiStashes[username] || 0) + earnedSpaghetti;
    lastSpaghettiClaim[username] = now;

    // Save
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
    localStorage.setItem("lastSpaghettiClaim", JSON.stringify(lastSpaghettiClaim));

    // 🍝 Funny Messages
    const messages = [
        `🍝 ${nickname} just slurped up ${earnedSpaghetti} SPG!`,
        `🍕 ${nickname} found ${earnedSpaghetti} SPG hidden under a pizza box!`,
        `🍜 ${nickname} cooked up ${earnedSpaghetti} SPG in a fine Italian restaurant!`,
        `🥖 ${nickname} just smuggled ${earnedSpaghetti} SPG out of Olive Garden!`,
        `🍝 ${nickname} is stacking spaghetti +${earnedSpaghetti} SPG!`
    ];
    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}

if (wsmsg["text"].toLowerCase() === ".myspaget") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userSpaghettiStashes[username] || 0;

    respondWithMessage.call(this, `🍝 ${nickname}, you have ${stash} SPG in your spaghetti stash.`);
}

if (wsmsg["text"].toLowerCase().startsWith(".sendspaget ")) {
    const args = wsmsg["text"].split(" ");
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .sendspaget [username] [amount]");
        return;
    }

    const handle = wsmsg["handle"];
    const sender = userHandles[handle];
    const senderNickname = userNicknames[sender]?.nickname || sender || "you";
    const receiver = args[1].toLowerCase();
    const amount = parseInt(args[2]);

    if (!sender || !userNicknames[receiver]) {
        respondWithMessage.call(this, "🤖 Error: Could not find the recipient.");
        return;
    }

    if (isNaN(amount) || amount <= 0 || (userSpaghettiStashes[sender] || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
        return;
    }

    userSpaghettiStashes[sender] -= amount;
    userSpaghettiStashes[receiver] = (userSpaghettiStashes[receiver] || 0) + amount;
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    respondWithMessage.call(this, `🍝 ${senderNickname} sent ${amount} SPG to ${receiver}!`);
}

if (wsmsg["text"].toLowerCase().startsWith(".stealspaget ")) {
    const args = wsmsg["text"].split(" ");
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

    let stealAmount = Math.floor(Math.random() * 3) + 1;
    let caught = Math.random() < 0.5;

    if (caught) {
        userSpaghettiStashes[thief] = Math.max(0, (userSpaghettiStashes[thief] || 0) - stealAmount);
        localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
        respondWithMessage.call(this, `🚔 ${thiefNickname} got CAUGHT trying to steal from ${userNicknames[victim]?.nickname || victim}! Lost ${stealAmount} SPG instead!`);
    } else {
        userSpaghettiStashes[victim] -= stealAmount;
        userSpaghettiStashes[thief] = (userSpaghettiStashes[thief] || 0) + stealAmount;
        localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
        respondWithMessage.call(this, `😈 ${thiefNickname} successfully stole ${stealAmount} SPG from ${userNicknames[victim]?.nickname || victim}!`);
    }
}

if (wsmsg["text"].toLowerCase() === ".topspaget") {
    let sortedUsers = Object.entries(userSpaghettiStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 10);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No spaghetti data available.");
        return;
    }

    let leaderboard = "🍝 Top 10 Spaghetti Hoarders\n";
    sortedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${index + 1}. ${nickname} - 🍝 ${stash.toLocaleString()} SPG\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

if (wsmsg["text"].toLowerCase().startsWith(".eatspaget")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ");
    const amount = args.length > 1 ? parseInt(args[1]) : 1; // Default to 1 SPG if no amount is specified

    if (!username) {
        setTimeout(() => {
            respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        }, 1000);
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        setTimeout(() => {
            respondWithMessage.call(this, "🤖 Invalid amount. Try .eatspaget [amount]");
        }, 1000);
        return;
    }

    if ((userSpaghettiStashes[username] || 0) < amount) {
        setTimeout(() => {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough spaghetti to eat!`);
        }, 1000);
        return;
    }

    // Subtract SPG from stash
    userSpaghettiStashes[username] -= amount;
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    // Get remaining spaghetti
    const remainingSpaghetti = userSpaghettiStashes[username];

    // 🍝 Funny Messages
    const messages = [
        `🍝 ${nickname} just gobbled up ${amount} SPG! Delicious!`,
        `🍽️ ${nickname} twirled up ${amount} SPG and devoured it!`,
        `😋 ${nickname} savored every bite of ${amount} SPG! Mangia!`,
        `🥄 ${nickname} slurped up ${amount} SPG like a true pasta master!`,
        `🍝 ${nickname} just inhaled ${amount} SPG! Somebody stop them!`
    ];

    // Pick a random message and add the remaining stash info on a new line
    let response = `${messages[Math.floor(Math.random() * messages.length)]}\n🍝 You have ${remainingSpaghetti} SPG left.`;

    setTimeout(() => {
        respondWithMessage.call(this, response);
    }, 1000);
}

// Pixxa ----------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 🍕 Global Pizza Storage (Per-user)
let userPizzaStashes = JSON.parse(localStorage.getItem("userPizzaStashes")) || {};

// 🍕 Last Pizza Claim Time (Per-user)
let lastPizzaClaim = JSON.parse(localStorage.getItem("lastPizzaClaim")) || {};

if ([".pizza", ".pixxa"].includes(wsmsg["text"].toLowerCase())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const now = Date.now();
    const cooldown = 10 * 1000; // 10-second cooldown

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    // Check cooldown
    if (lastPizzaClaim[username] && now - lastPizzaClaim[username] < cooldown) {
        const remaining = ((cooldown - (now - lastPizzaClaim[username])) / 1000).toFixed(1);
        respondWithMessage.call(this, `⏳ ${nickname}, wait ${remaining} more seconds for more pixxa.`);
        return;
    }

    lastPizzaClaim[username] = now;
    localStorage.setItem("lastPizzaClaim", JSON.stringify(lastPizzaClaim));

    // Earn 1-10 PZA
    const earnedPizza = Math.floor(Math.random() * 10) + 1;
    userPizzaStashes[username] = (userPizzaStashes[username] || 0) + earnedPizza;

    // Save
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

    // 🍕 Funny Messages
    const messages = [
        `🍕 ${nickname} just devoured ${earnedPizza} PZA!`,
        `🧀 ${nickname} swiped ${earnedPizza} PZA before the waiter noticed!`,
        `🔥 ${nickname} baked ${earnedPizza} PZA in a wood-fired oven!`,
        `🚗 ${nickname} got ${earnedPizza} PZA delivered, and they even remembered the garlic sauce!`,
        `🛵 ${nickname} intercepted a pizza delivery and claimed ${earnedPizza} PZA for themselves!`,
        `🍽️ ${nickname} walked into a buffet and grabbed ${earnedPizza} PZA like a boss!`
    ];
    respondWithMessage.call(this, messages[Math.floor(Math.random() * messages.length)]);
}

if (wsmsg["text"].toLowerCase() === ".mypizza") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userPizzaStashes[username] || 0;

    respondWithMessage.call(this, `🍕 ${nickname}, you have ${stash} PZA in your pizza stash.`);
}

if (wsmsg["text"].toLowerCase().startsWith(".sendpizza ")) {
    const args = wsmsg["text"].split(" ");
    if (args.length < 3) {
        respondWithMessage.call(this, "🤖 Usage: .sendpizza [username] [amount]");
        return;
    }

    const handle = wsmsg["handle"];
    const sender = userHandles[handle];
    const senderNickname = userNicknames[sender]?.nickname || sender || "you";
    const receiver = args[1].toLowerCase();
    const amount = parseInt(args[2]);

    if (!sender || !userNicknames[receiver]) {
        respondWithMessage.call(this, "🤖 Error: Could not find the recipient.");
        return;
    }

    if (isNaN(amount) || amount <= 0 || (userPizzaStashes[sender] || 0) < amount) {
        respondWithMessage.call(this, "🤖 Invalid amount or insufficient stash.");
        return;
    }

    userPizzaStashes[sender] -= amount;
    userPizzaStashes[receiver] = (userPizzaStashes[receiver] || 0) + amount;
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

    respondWithMessage.call(this, `🍕 ${senderNickname} sent ${amount} PZA to ${receiver}!`);
}

if (wsmsg["text"].toLowerCase() === ".toppizza") {
    let sortedUsers = Object.entries(userPizzaStashes)
        .sort((a, b) => (b[1] || 0) - (a[1] || 0))
        .slice(0, 10);

    if (sortedUsers.length === 0) {
        respondWithMessage.call(this, "🤖 No pizza data available.");
        return;
    }

    let leaderboard = "🍕 Top 10 Pizza Hoarders\n";
    sortedUsers.forEach(([username, stash], index) => {
        const nickname = userNicknames[username]?.nickname || username;
        leaderboard += `${index + 1}. ${nickname} - 🍕 ${stash.toLocaleString()} PZA\n`;
    });

    respondWithMessage.call(this, leaderboard.trim());
}

if (wsmsg["text"].toLowerCase().startsWith(".eatpizza")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const args = wsmsg["text"].split(" ");
    const amount = args.length > 1 ? parseInt(args[1]) : 1; // Default to 1 PZA if no amount is specified

    if (!username) {
        setTimeout(() => {
            respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        }, 1000);
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        setTimeout(() => {
            respondWithMessage.call(this, "🤖 Invalid amount. Try .eatpizza [amount]");
        }, 1000);
        return;
    }

    if ((userPizzaStashes[username] || 0) < amount) {
        setTimeout(() => {
            respondWithMessage.call(this, `🤖 ${nickname}, you don't have enough pizza to eat!`);
        }, 1000);
        return;
    }

    // Subtract PZA from stash
    userPizzaStashes[username] -= amount;
    localStorage.setItem("userPizzaStashes", JSON.stringify(userPizzaStashes));

    // Get remaining pizza
    const remainingPizza = userPizzaStashes[username];

    // 🍕 Funny Messages
    const messages = [
        `🍕 ${nickname} just devoured ${amount} PZA! Cheesy goodness!`,
        `🧀 ${nickname} inhaled ${amount} PZA! Hope you saved some for the rest of us!`,
        `🔥 ${nickname} just destroyed ${amount} PZA like a true pizza warrior!`,
        `🍽️ ${nickname} demolished ${amount} PZA in record time!`,
        `😋 ${nickname} savored every bite of ${amount} PZA! Buon appetito!`
    ];

    // Pick a random message and add the remaining stash info on a new line
    let response = `${messages[Math.floor(Math.random() * messages.length)]}\n🍕 You have ${remainingPizza} PZA left.`;

    setTimeout(() => {
        respondWithMessage.call(this, response);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

// 💥 `.bankrob` - Attempt to rob the LGH Bank (Dynamic Success & Brutal Failure)
if (wsmsg["text"].toLowerCase() === ".bankrob") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    if (!username) {
        respondWithMessage.call(this, "🤖 Error: Could not identify your username.");
        return;
    }

    if (lghBank < 100) {
        respondWithMessage.call(this, "🏦 LGH Bank is too empty to rob!");
        return;
    }

    const userBalance = userBalances[username]?.balance || 1;
    const userWeed = userWeedStashes[username] || 0;

    // Calculate dynamic success rate (based on LGH Bank size & user wealth)
    let successChance = Math.max(0.05, Math.min(0.95, (1 - (userBalance / lghBank)) * 0.75));
    let success = Math.random() < successChance;

    if (success) {
        // Successful robbery: Steal 5-20% of LGH Bank
        const maxSteal = Math.floor(lghBank * 0.2);
        const stolenAmount = Math.min(Math.floor(lghBank * (Math.random() * 0.15 + 0.05)), maxSteal);

        lghBank -= stolenAmount;
        userBalances[username].balance = (userBalances[username].balance || 1) + stolenAmount;
        saveBalances();
        localStorage.setItem("lghBank", lghBank);

        respondWithMessage.call(this, `💰 ${nickname} successfully robbed the LGH Bank and stole 💵 ${stolenAmount.toLocaleString()} GBX!\n🏦 LGH Bank now holds 💰 ${lghBank.toLocaleString()} GBX.`);
    } else {
        // Failed robbery: Lose 80-95% of GBX and all weed (put back into economy)
        const lossAmount = Math.max(1, Math.floor(userBalance * (Math.random() * 0.15 + 0.8))); // 80-95% loss
        userBalances[username].balance = Math.max(1, userBalance - lossAmount); // Don't go below 1 GBX
        lghBank += lossAmount; // Put lost GBX back into LGH Bank

        let weedLost = userWeed;
        userWeedStashes[username] = 0; // Lose all weed
        wghBank += weedLost; // Put lost weed back into WGH Bank

        // Save changes
        saveBalances();
        saveWeedStashes();
        localStorage.setItem("lghBank", lghBank);
        localStorage.setItem("wghBank", wghBank);

        let failureMessage = `🚔 ${nickname} got caught robbing LGH Bank and lost 💵 ${lossAmount.toLocaleString()} GBX!`;
        if (weedLost > 0) {
            failureMessage += `\n🌿 The cops also took all ${weedLost.toLocaleString()} grams of their weed!`;
        }
        if (userBalances[username].balance === 1) {
            failureMessage += `\n💀 ${nickname} just lost EVERYTHING. Back to square one!`;
        }

        respondWithMessage.call(this, failureMessage);
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

    // **Dump GojiBux**
    if (dumpedBux > 0) {
        lghBank += dumpedBux;
        userBalances[username].balance = 0;
    }

    // **Dump Weed**
    if (dumpedWeed > 0) {
        wghBank += dumpedWeed;
        userWeedStashes[username] = 0;
    }

    // **Dump Spaghetti**
    if (dumpedSpaghetti > 0) {
        userSpaghettiStashes[username] = 0; // No global SPG storage, it just disappears
    }

    // Save all updated storages
    saveBalances();
    saveWeedStashes();
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));
    localStorage.setItem("lghBank", lghBank);
    localStorage.setItem("wghBank", wghBank);

    // **Generate Random Funny Messages**
    let messages = [`🗑️ ${nickname} just dumped everything they had!`];

    if (dumpedBux > 0) messages.push(`💵 ${nickname} donated ${dumpedBux.toLocaleString()} GBX to LGH Bank!`);
    if (dumpedWeed > 0) messages.push(`🌿 ${nickname} threw ${dumpedWeed.toLocaleString()} grams of weed into WGH!`);
    if (dumpedSpaghetti > 0) messages.push(`🍝 ${nickname} discarded ${dumpedSpaghetti.toLocaleString()} SPG! RIP spaghetti...`);

    // Send messages with a slight delay for effect
    messages.forEach((msg, index) => {
        setTimeout(() => {
            respondWithMessage.call(this, msg);
        }, index * 1000);
    });
}


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

    respondWithMessage.call(this, `💵 ${nickname} donated ${dumpedBux.toLocaleString()} GBX to LGH Bank!`);
}


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

    respondWithMessage.call(this, `🌿 ${nickname} threw ${dumpedWeed.toLocaleString()} grams of weed into WGH!`);
}


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
        respondWithMessage.call(this, `🤖 ${nickname}, you have no spaghetti to dump!`);
        return;
    }

    userSpaghettiStashes[username] = 0;
    localStorage.setItem("userSpaghettiStashes", JSON.stringify(userSpaghettiStashes));

    respondWithMessage.call(this, `🍝 ${nickname} discarded ${dumpedSpaghetti.toLocaleString()} SPG! RIP spaghetti...`);
}

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
    const user = userHandles[handle];  // **Now matching .jointroll and .myweed**

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

if (wsmsg["text"].toLowerCase() === ".top") {
    let categories = [
        { name: "GojiBux", emoji: "💵", data: userBalances, key: "balance", unit: "GBX" },
        { name: "Offshore", emoji: "🏝️", data: userStashes, key: null, unit: "GBX" },
        { name: "Weed", emoji: "🌿", data: userWeedStashes, key: null, unit: "grams" },
        { name: "Joints", emoji: "🚬", data: userJointStashes, key: null, unit: "rolled" },
        { name: "Spaghetti", emoji: "🍝", data: userSpaghettiStashes, key: null, unit: "SPG" },
        { name: "Pizza", emoji: "🍕", data: userPizzaStashes, key: null, unit: "PZA" }
    ];

    let leaderboard = "📊 Ultimate Top Players 📊\n";

    categories.forEach(({ name, emoji, data, key, unit }) => {
        let sortedUsers = Object.entries(data)
            .sort((a, b) => ((b[1]?.[key] || b[1] || 0) - (a[1]?.[key] || a[1] || 0)));

        if (sortedUsers.length > 0) {
            let [username, stash] = sortedUsers[0];
            let value = key ? stash[key] || 0 : stash || 0; // Default assignment

            // Special handling for GojiBux
            if (name === "GojiBux") {
                value = stash?.balance || 0; // Extract balance from object
            }

            if (value > 0) {
                const nickname = userNicknames[username]?.nickname || username;
                leaderboard += `${emoji} Top ${name}: ${nickname} - ${emoji} ${value.toLocaleString()} ${unit}\n`;
            }
        }
    });

    respondWithMessage.call(this, leaderboard.trim());
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
            `🤖 Your Info:\nNickname: ${user.nickname}\nUsername: ${user.username}`,
            `Status: ${user.modStatus}\nHandle: ${user.handle}`
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

        // bran and goji with nickname
        if (wsmsg['text'].toLowerCase() === "bran" || wsmsg['text'].toLowerCase() === "goji") {
            const handle = wsmsg['handle']; // Get the handle
            const nickname = userNicknames[userHandles[handle]]?.nickname || wsmsg['username'] || "you"; // Get nickname, fallback to username or Bot

            const target = wsmsg['text'] === "bran" ? "Bran" : "Goji"; // Determine which target to use

            setTimeout(() => this._send(JSON.stringify({
                stumble: "msg",
                text: `🤖 ${target} farted on ${nickname}!` // Message using nickname
            })), 1000);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Commands: .419 to .430 + .710 + .840
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
            ".430": [`${nickname} SMOKES WHEN THEY WANT!`,
                     `${nickname} MISSED 420!`
            ],
            ".710": [
                `${nickname} is smoking! Cheers! It’s 7:10! Let the dabs begin!`,
                `${nickname} is smoking! Cheers! 7:10 again! Dab it up, my friend!`
            ],
            ".840": [`${nickname} is smoking! Cheers! It's 8:40! Twice the 4:20, twice the tokes! 💨`]
        };

        // Pick a random message if multiple are available
        const messages = timeMessages[wsmsg['text']] || ["Error: Invalid time!"];
        const message = messages[Math.floor(Math.random() * messages.length)];

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${message} 💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .cheers (Case-insensitive, uses handle to get nickname)
    if ([".c", ".cheers"].includes(wsmsg['text'].toLowerCase())) { // Convert input to lowercase and check if it's in the list
        const handle = wsmsg['handle']; // Get the user's handle from the message
        const username = userHandles[handle]; // Look up the username using the handle
        const nickname = userNicknames[username]?.nickname || "Someone"; // Get the stored nickname, or default to "Someone"

        this._send(JSON.stringify({ // Send the message to the chat
            stumble: "msg",
            text: `🤖 ${nickname} is smokin! Cheers! 🌲💨`
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
            text: `🤖 ${nickname} wants to sub! 🌲🍻`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .sub cheers (case insensitive)
    if ([".sc", ".subcheers", ".subchar", ".schar", ".scheers"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is subbin! Char! 🌲🍻💨`
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
            text: `🤖 ${nickname} wants to toke! 🌲 Join em! 💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .grinding (Case-insensitive, uses handle to get nickname)
    if ([".g", "grind", ".grindin", ".grinding"].includes(wsmsg['text'].toLowerCase())) { // Convert input to lowercase and check if it's in the list
        const handle = wsmsg['handle']; // Get the user's handle from the message
        const username = userHandles[handle]; // Look up the username using the handle
        const nickname = userNicknames[username]?.nickname || "Someone"; // Get the stored nickname, or default to "Someone"

        this._send(JSON.stringify({ // Send the message to the chat
            stumble: "msg",
            text: `🤖 ${nickname} is grinding bud for tokes! 🌿🔄💨`
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

    // Command: .joint (case insensitive)
    if ([".j", ".joint"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is smokin a joint! Cheers! 🌲💨`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .blunt (case insensitive)
    if ([".b", ".blunt"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is smokin a blunt! Cheers! 🌲💨`
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
            text: `🤖 ${nickname} is packin! 🌲`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .set (case insensitive)
    if ([".s", ".set", ".packed", ".ready"].includes(wsmsg['text'].toLowerCase())) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} is set! 🌲`
        }));
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .throat / .throats
    if ([".throat", ".throats"].includes(wsmsg['text'].toLowerCase())) {
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
    if (wsmsg['text'].toLowerCase() === ".bc") {
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

    // Command: .owner
    if (wsmsg['text'].toLowerCase().startsWith(".owner")) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "Someone";

        this._send(JSON.stringify({
            stumble: "msg",
            text: `🤖 ${nickname} IS THE ROOM OWNER NOW!`
        }));
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

//-----------------------------------------------------------------------------------------------------------------------------------

// start anal
const triggerAnalCommands = [".anal"];
if (triggerAnalCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username']; // Use nickname if available, otherwise fallback to username
        const analResponses = [
            `${nickname} just took the backdoor express! 🚪🍑`,
            `Uh-oh, ${nickname} went deep into uncharted territory! 🌌🍑`,
            `Some say ${nickname} just unlocked a new level of experience. 🏆🔥`,
            `Breaking news: ${nickname} just got a little more adventurous. 🚀🍑`,
            `Nothing like a little backdoor surprise, right ${nickname}? 😉`,
            `Careful, ${nickname}, once you go back, you might not go back. 🍑💨`,
            `That escalated quickly, ${nickname}. 🍑🔥`,
            `10/10 technique, ${nickname}. You should be in the hall of fame. 🎖️`,
            `Legend has it ${nickname} just found the true meaning of "stretch goals." 📏🍑`,
            `RIP ${nickname}, they took one for the team. ⚰️🔥`,
            `BOOM! ${nickname} just went full send. 💥🍑`,
            `The prophecy foretold that ${nickname} would go all the way... today is that day. 📜🔥`,
            `${nickname}, welcome to the forbidden zone. 🍑🔞`,
            `NASA just reported unusual seismic activity from ${nickname}'s location. 🌎🔥`,
            `Hope you stretched first, ${nickname}. 🍑🧘‍♂️`,
            `Whoa there, ${nickname}, ease into it! 🚦🍑`,
            `Backdoor access granted. 🔓🍑 Welcome, ${nickname}.`,
            `Let's hope ${nickname} used enough lube. 💦🍑`,
            `Somebody get ${nickname} a trophy, that was legendary. 🏆🔥`,
            `Breaking records, breaking barriers—${nickname} does it all! 🚀🍑`
        ];
        const randomAnalResponse = analResponses[Math.floor(Math.random() * analResponses.length)];
        this._send(`{"stumble":"msg","text": "${randomAnalResponse}"}`);
    }, 1000);
}

//-----------------------------------------------------------------------------------------------------------------------------------

const triggerSlurpCommands = [".slurp"];
if (triggerSlurpCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const slurpResponses = [
            `${nickname} just slurped it all up. 🍜💦`,
            `Slurp detected! ${nickname} is going *all in*. 🔥`,
            `That was a *nasty* slurp, ${nickname}. Respect. 👏`,
            `${nickname} went full vacuum mode! 🌀💨`,
            `Hydrated and dedicated—${nickname} never misses a sip. 🥤`,
            `If slurping was an Olympic sport, ${nickname} would take gold. 🏆`,
            `Someone pass ${nickname} a napkin, that was *wild*. 💦`,
            `Careful, ${nickname}, you might create a black hole with that slurp. 🌌`
        ];
        this._send(`{"stumble":"msg","text": "${slurpResponses[Math.floor(Math.random() * slurpResponses.length)]}"}`);
    }, 1000);
}



const triggerGawkCommands = [".gawk"];
if (triggerGawkCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const gawkResponses = [
            `${nickname} just gave that *gawk-gawk 9000*! 🔥💦`,
            `If there was a championship for gawk, ${nickname} would be undefeated. 🏆`,
            `Some say ${nickname} has *no gag reflex*. 🤔`,
            `Whoa, ${nickname} just went *deep* with that one. 🍆💨`,
            `The streets will never forget ${nickname}’s legendary gawk skills. 🏅`,
            `Rumor has it ${nickname} can drink a smoothie *without a straw*. 💀`,
            `That was a *sloppy* one, ${nickname}. Respect. 🙏`,
            `Someone pass ${nickname} a towel. That got *out of hand*. 💦`
        ];
        this._send(`{"stumble":"msg","text": "${gawkResponses[Math.floor(Math.random() * gawkResponses.length)]}"}`);
    }, 1000);
}



const triggerClapCommands = [".clap"];
if (triggerClapCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const clapResponses = [
            `🔊 CLAP CLAP CLAP! ${nickname} just made cheeks *applaud*! 🍑🔥`,
            `Damn, ${nickname} just *shook the room*! 💥🍑`,
            `We need a **seismologist**, ${nickname} is causing tremors! 🌍💨`,
            `Some say NASA picked up ${nickname}’s cheek claps from space. 🚀🍑`,
            `${nickname} got that **thunderous clap** energy! ⚡🍑`,
            `The **gods** have spoken, and it sounds like ${nickname}’s *cheeks in motion*. 🔥🍑`,
            `*Warning:* ${nickname} has entered **MAXIMUM CLAP MODE**! 🚨`,
            `${nickname}, that **reverberation** might be *illegal* in some states. 📜🍑`
        ];
        this._send(`{"stumble":"msg","text": "${clapResponses[Math.floor(Math.random() * clapResponses.length)]}"}`);
    }, 1000);
}



const triggerNutCommands = [".nut"];
if (triggerNutCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const nutResponses = [
            `💦 BOOM! ${nickname} just **exploded**! 💥`,
            `RIP ${nickname}, they never stood a chance. 🚑💦`,
            `${nickname} just *lost everything in the stock market* 📉💦`,
            `The **post-nut clarity** is hitting ${nickname} like a freight train. 🚂💨`,
            `Someone get ${nickname} a tissue, that was *devastating*. 😔`,
            `Scientists confirm ${nickname} just set a **new world record**. 🏅💦`,
            `That was a *spiritual* experience, wasn’t it ${nickname}? 🧘‍♂️💦`,
            `Emergency services are on the way. Hold tight, ${nickname}. 🚑`
        ];
        this._send(`{"stumble":"msg","text": "${nutResponses[Math.floor(Math.random() * nutResponses.length)]}"}`);
    }, 1000);
}



const triggerGaspCommands = [".gasp"];
if (triggerGaspCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const gaspResponses = [
            `😱 *GASP!* ${nickname} just witnessed something **unholy**!`,
            `💀 RIP ${nickname}, they couldn’t handle the shock!`,
            `${nickname} just **fainted** from sheer *drama*. 🎭`,
            `Someone **call an ambulance**—${nickname} just saw **too much**. 🚑`,
            `${nickname} just got hit with *pure, unfiltered disbelief*. 🤯`,
            `THE AUDACITY! ${nickname} cannot *believe* what just happened. 🫢`,
            `That was a **cinematic gasp**, ${nickname}. Well played. 🎬😲`,
            `BREAKING NEWS: ${nickname} has entered **SHOCK MODE**. ⚠️`
        ];
        this._send(`{"stumble":"msg","text": "${gaspResponses[Math.floor(Math.random() * gaspResponses.length)]}"}`);
    }, 1000);
}



const triggerThrustCommands = [".thrust"];
if (triggerThrustCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const thrustResponses = [
            `🚀 ${nickname} just went full **THRUST MODE**! Hold on tight!`,
            `Careful, ${nickname}, you might break the **sound barrier** with that! 🔊💥`,
            `That wasn’t just a thrust, ${nickname}—that was a **launch sequence**. 🚀🍑`,
            `My God... ${nickname} just achieved **MAXIMUM PENETRATION VELOCITY**. 🔥💨`,
            `BREAKING NEWS: ${nickname} just caused a **6.9 magnitude earthquake.** 🌍🍑`,
            `${nickname} has officially entered **warp speed.** 🛸🔥`,
            `NASA just confirmed: ${nickname} is on a **collision course.** 🚀🌌`,
            `Brace yourselves, ${nickname} is about to **BREAK ORBIT.** 💥`
        ];
        this._send(`{"stumble":"msg","text": "${thrustResponses[Math.floor(Math.random() * thrustResponses.length)]}"}`);
    }, 1000);
}



const triggerMoanCommands = [".moan"];
if (triggerMoanCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const moanResponses = [
            `😩 *Ohhh*~ ${nickname} just couldn’t keep it together!`,
            `Someone turn the volume **down**, ${nickname} is getting *LOUD*. 🔊🍑`,
            `That was a **5-star moan**, ${nickname}. ⭐⭐⭐⭐⭐`,
            `Whew... ${nickname} just made the room *uncomfortably hot*. 🥵`,
            `Yo, ${nickname}, at least **warn** people before you do that. 😳`,
            `My neighbors just called... ${nickname} is **TOO DAMN LOUD.** 🚨`,
            `${nickname} just hit a *new pitch*! Call an **opera instructor.** 🎤`,
            `Who needs *auto-tune* when ${nickname} can moan like **THAT**? 🔥`
        ];
        this._send(`{"stumble":"msg","text": "${moanResponses[Math.floor(Math.random() * moanResponses.length)]}"}`);
    }, 1000);
}



const triggerSpitCommands = [".spit"];
if (triggerSpitCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const spitResponses = [
            `💦 **SPIT TAKE!** ${nickname} just lost it!`,
            `Damn, ${nickname}, did you even **aim**? That’s a *mess*! 🤦‍♂️`,
            `${nickname} out here making it **extra sloppy**. 🍑💦`,
            `Whoa! Someone **get a mop**—${nickname} is *going off*! 🧹`,
            `That was a **Hall of Fame spit moment**, ${nickname}. 🏆`,
            `Hope you weren’t drinking anything, ${nickname}. Oh... never mind. ☕💦`,
            `Careful, ${nickname}, you're about to start a **slip hazard.** 🚧`,
            `If spit was a superpower, ${nickname} would be **unstoppable.** 🔥`
        ];
        this._send(`{"stumble":"msg","text": "${spitResponses[Math.floor(Math.random() * spitResponses.length)]}"}`);
    }, 1000);
}



const triggerGulpCommands = [".gulp"];
if (triggerGulpCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const gulpResponses = [
            `🍹 **GULP!** ${nickname} just took it **ALL** down!`,
            `That was **too much** in one go, ${nickname}... you good? 😳`,
            `🔥 DAMN, ${nickname} just *deepthroated that whole drink!*`,
            `Yo, ${nickname}, do you even **breathe** when you drink?! 🤯`,
            `Chill, ${nickname}, you ain't in a **speed-drinking competition!** ⏳`,
            `My god... ${nickname} just **downed** that in *one* go! 💦`,
            `Someone get ${nickname} a **refill**—they just **obliterated** their drink! 🍾`,
            `Yo, ${nickname}, leave some **for the rest of us!** 🫗`
        ];
        this._send(`{"stumble":"msg","text": "${gulpResponses[Math.floor(Math.random() * gulpResponses.length)]}"}`);
    }, 1000);
}



const triggerGagCommands = [".gag"];
if (triggerGagCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const gagResponses = [
            `😵 ${nickname} just **gagged HARD.**`,
            `RIP ${nickname}—they didn’t stand a *chance*. 💀`,
            `Yo, someone **check on** ${nickname}... they’re struggling. 🍆💦`,
            `Careful, ${nickname}, you *almost* didn’t make it. 😳`,
            `DAMN, ${nickname} just went **too deep!** 🔥`,
            `${nickname} out here testing **their limits.** 🏆`,
            `Breathe, ${nickname}, **BREATHE!** 🫁💨`,
            `10/10 commitment, ${nickname}. You deserve a **medal.** 🏅`
        ];
        this._send(`{"stumble":"msg","text": "${gagResponses[Math.floor(Math.random() * gagResponses.length)]}"}`);
    }, 1000);
}



const triggerDroolCommands = [".drool"];
if (triggerDroolCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const droolResponses = [
            `💦 Damn, ${nickname} just **lost all motor function!**`,
            `Yo, someone get ${nickname} a **bib**—they're *leaking*! 🤤`,
            `That was a **full-body reaction** from ${nickname}! 😵‍💫`,
            `${nickname} is *straight up* **FOAMING** at the mouth. 🤯`,
            `Jesus, ${nickname}, you’re acting like you haven’t **eaten in days.** 🍑`,
            `That **primal instinct** just took over ${nickname}... it’s *over.* 🐺💦`,
            `Not even gravity can contain ${nickname}’s **thirst**. 🌊💦`,
            `${nickname} just went from **civilized** to *feral* in 0.2 seconds. 🔥`
        ];
        this._send(`{"stumble":"msg","text": "${droolResponses[Math.floor(Math.random() * droolResponses.length)]}"}`);
    }, 1000);
}



const triggerQuakeCommands = [".quake"];
if (triggerQuakeCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const quakeResponses = [
            `🌍 **SEISMIC ACTIVITY DETECTED!** ${nickname} just caused a magnitude 9.0!`,
            `🚨 ALERT: ${nickname} just set off the **Tsunami Warning System!** 🌊`,
            `Yo, ${nickname}, that **aftershock** was felt *worldwide*! 🌎💨`,
            `Damn, ${nickname}, even the **tectonic plates** are *scared*. 😳`,
            `NASA just confirmed: **${nickname} broke the Richter Scale!** 🔥`,
            `${nickname} just made **Yellowstone look like a sparkler.** 🌋🔥`,
            `That was a **cataclysmic** event, ${nickname}. The world will remember. 💀`,
            `My **glass of water** just tipped over. Thanks, ${nickname}. 💦`
        ];
        this._send(`{"stumble":"msg","text": "${quakeResponses[Math.floor(Math.random() * quakeResponses.length)]}"}`);
    }, 1000);
}



const triggerExplodeCommands = [".explode"];
if (triggerExplodeCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const explodeResponses = [
            `💥 BOOM! **${nickname} just detonated!**`,
            `RIP ${nickname}, they *couldn't hold it in.* 💀🔥`,
            `**Cleanup on aisle 420!** ${nickname} just went nuclear. 🌍💨`,
            `Someone pass ${nickname} a **towel**—that was *disastrous*. 💦`,
            `${nickname} just hit **MAXIMUM LOAD CAPACITY.** 📈🔥`,
            `The **post-explosion clarity** is about to *hit hard*, ${nickname}. 🫠`,
            `${nickname} just **reached critical mass.** Scientists are concerned. ⚠️`,
            `BREAKING NEWS: **${nickname} just caused a power outage.** 🔌⚡`
        ];
        this._send(`{"stumble":"msg","text": "${explodeResponses[Math.floor(Math.random() * explodeResponses.length)]}"}`);
    }, 1000);
}



const triggerConvulseCommands = [".convulse"];
if (triggerConvulseCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const convulseResponses = [
            `⚡ **EMERGENCY MEDICAL ALERT!** ${nickname} just lost control! 🚑`,
            `Yo, ${nickname}, you *good*? You look like you're **seeing the divine.** 😵‍💫`,
            `Someone **hold ${nickname} down!** We don’t want a **repeat of last time.** 💀`,
            `That was **too much power** for ${nickname} to handle. 💥🔥`,
            `${nickname} just **disassociated into another dimension.** 🌌`,
            `The **soul left the body**—${nickname} is *gone*. 👻`,
            `Damn, ${nickname}, even your **shadow is shaking.** 👀`,
            `Physicists are now studying ${nickname} for *warp speed potential*. 🚀`
        ];
        this._send(`{"stumble":"msg","text": "${convulseResponses[Math.floor(Math.random() * convulseResponses.length)]}"}`);
    }, 1000);
}



const triggerObliterateCommands = [".obliterate"];
if (triggerObliterateCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const obliterateResponses = [
            `💀 **FATALITY!** ${nickname} just got **erased from existence.**`,
            `**System Overload!** ${nickname} just got *wiped out*. 💥`,
            `${nickname} just **ceased to be.** We will remember them. 🕊️`,
            `RIP ${nickname}, you *will not* be making it to dinner. 🍽️`,
            `That was a **total system failure.** Rebooting ${nickname}... 🔄`,
            `NASA just reported an **unexplained cosmic event**. ${nickname} is gone. 🌌`,
            `The **laws of physics** no longer apply to ${nickname}. 🚀`,
            `${nickname} just **surpassed human limitations** and *became energy itself*. ⚡`
        ];
        this._send(`{"stumble":"msg","text": "${obliterateResponses[Math.floor(Math.random() * obliterateResponses.length)]}"}`);
    }, 1000);
}



const triggerEruptCommands = [".erupt"];
if (triggerEruptCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const eruptResponses = [
            `🌋 **MASSIVE ERUPTION DETECTED!** ${nickname} just **covered the earth** in *hot devastation*! 💦`,
            `**Warning:** ${nickname} just triggered a **global extinction event.** 🦖💀`,
            `💀 **CASUALTY REPORT:** ${nickname} took out **half the population** with that eruption.`,
            `RIP ${nickname}, they **left this world in a tsunami of their own creation.** 🌊`,
            `Yo, ${nickname}, that was *so strong*, the government **is now watching you.** 👀`,
            `BREAKING NEWS: **Scientists are calling it "The Second Great Flood"—caused by ${nickname}.** 🌎💦`,
            `NASA has confirmed that ${nickname} just **added a new moon to Earth's orbit.** 🌙💥`,
            `**My crops are drowned. My town is gone.** And it’s all because of **${nickname}.** 💦🔥`
        ];
        this._send(`{"stumble":"msg","text": "${eruptResponses[Math.floor(Math.random() * eruptResponses.length)]}"}`);
    }, 1000);
}



const triggerPossessCommands = [".possess"];
if (triggerPossessCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const possessResponses = [
            `👹 **OH HELL NO—${nickname} JUST GOT POSSESSED!** 🫣🔥`,
            `**THE LIGHTS JUST FLICKERED.** ${nickname}, WHAT HAVE YOU DONE? 👀`,
            `We need **holy water, a priest, and maybe a shotgun.** ${nickname} ain't looking good. ☠️`,
            `**DEMONIC PRESENCE DETECTED:** ${nickname} is now speaking in **forbidden tongues.** 🕯️`,
            `THE POWER OF CHRIST COMPELS YOU, ${nickname}!! 📖🕊️`,
            `⚠️ **Demonic Levels Rising...** Oh no, ${nickname} is about to go **FULL EXORCIST.** 👁️`,
            `**That was not ${nickname} anymore.** Something else is in control now. 🔥`,
            `🔮 **Ancient texts warned about this day...** and they mentioned **${nickname} by name.** 📜😱`
        ];
        this._send(`{"stumble":"msg","text": "${possessResponses[Math.floor(Math.random() * possessResponses.length)]}"}`);
    }, 1000);
}



const triggerImplodeCommands = [".implode"];
if (triggerImplodeCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const implodeResponses = [
            `🕳️ **WHOOPS—${nickname} JUST COLLAPSED IN ON THEMSELVES!**`,
            `💥 *ERROR 404:* **${nickname} NOT FOUND.** They **imploded into nothingness.**`,
            `NASA just confirmed that ${nickname} has become a **new black hole.** 🌌🔥`,
            `Uh-oh, ${nickname} just hit the **event horizon**—there’s *no coming back.* 👁️`,
            `That was **too much pressure,** ${nickname} folded *like a cheap lawn chair.* 🌬️`,
            `💀 **Some say ${nickname} is still shrinking... smaller... and smaller...**`,
            `Physics **has failed**—${nickname} just broke **all known laws of matter.** ⚛️`,
            `BREAKING: **Scientists have classified ${nickname} as a "microscopic singularity."** 🔍🌍`
        ];
        this._send(`{"stumble":"msg","text": "${implodeResponses[Math.floor(Math.random() * implodeResponses.length)]}"}`);
    }, 1000);
}



const triggerTranscendCommands = [".transcend"];
if (triggerTranscendCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const transcendResponses = [
            `🌌 **OH SHIT—${nickname} JUST ACHIEVED ENLIGHTENMENT!** 🚀`,
            `👁️ **All knowledge is now unlocked.** ${nickname} has **become one with the universe.**`,
            `🔥 **${nickname} ascended so hard, they LEFT THE MORTAL PLANE.**`,
            `💨 *We just watched ${nickname} evaporate into pure energy.*`,
            `📡 **Alien transmissions detected.** ${nickname} is now *communing with higher beings.* 👽`,
            `**${nickname} has cracked the simulation.** THEY KNOW EVERYTHING NOW. 🖥️`,
            `**The voice of the cosmos whispers:** *"Well done, ${nickname}."* 🎶`,
            `👼 **New celestial being detected:** ${nickname} is now among the **gods.**`
        ];
        this._send(`{"stumble":"msg","text": "${transcendResponses[Math.floor(Math.random() * transcendResponses.length)]}"}`);
    }, 1000);
}



const triggerShatterCommands = [".shatter"];
if (triggerShatterCommands.includes(wsmsg['text'].toLowerCase())) {
    setTimeout(() => {
        const nickname = wsmsg['nickname'] || wsmsg['username'];
        const shatterResponses = [
            `💥 **HOLY SHIT—${nickname} JUST SHATTERED REALITY!** 🔮`,
            `⚠️ **WARNING:** ${nickname} has **torn a hole in the fabric of existence.** 🕳️`,
            `🚨 **Temporal Disturbance Detected:** ${nickname} just broke *space-time*.`,
            `**Dimensional rift open.** ${nickname} is now *existing in multiple realities.* 🌍🌀`,
            `💀 **Side effects of this incident include:** distortion, hallucinations, and **${nickname}’s disintegration.**`,
            `👁️ *Something is watching.* ${nickname}, what did you *DO?!*`,
            `**The Universe is rebooting...** because of **${nickname}.** 🔁`,
            `👽 **Alien civilizations have confirmed:** ${nickname} is a **cosmic threat.**`
        ];
        this._send(`{"stumble":"msg","text": "${shatterResponses[Math.floor(Math.random() * shatterResponses.length)]}"}`);
    }, 1000);
}

// General Commands -----------------------------------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------

    // Command: .help or .halp (case insensitive)
    if ([".help", ".halp"].includes(wsmsg['text'].toLowerCase())) {
        const messages = [
            "🤖 Need help? No worries!",
            "- Use **.commands** to see a list of available commands.",
            "- This bot keeps the vibes high and the chat rolling! 💨🌲",
            "- Have fun and don't forget to **pass it to the left!** 🔥"
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

    // start discord
    if (wsmsg['text'].toLowerCase() === ".discord") {
        this._send('{"stumble":"msg","text":"Join Discord: https://discord.gg/apu9gzGYMD (no video, use stumble)"}');
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
            "https://i.imgur.com/7iJcUmV.gif"
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

    // start boobs
    const triggerCommands = [".boobs", ".tits", ".booby", ".busty", ".boobies", ".bobbles", ".titties", ".boob", ".tit", ".milkers", ".teet", ".teets", ".breast", ".breasts", ".bloons", ".melons", ".gohodonkaloos", ".honkers", ".hooters", ".knockers", ".massivenaturals"];
    if (triggerCommands.includes(wsmsg['text'].toLowerCase())) {
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
        this._send(`{"stumble":"msg","text": "${randomGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start booty
    const triggerBootyCommands = [".booty", ".ass", ".butt", ".donk", ".fanny", ".bongos"];
    if (triggerBootyCommands.includes(wsmsg['text'].toLowerCase())) {
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
        this._send(`{"stumble":"msg","text": "${randombootyGif}"}`);
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

    // start dilf
    const triggerDilfCommands = [".dilf"];
    if (triggerDilfCommands.includes(wsmsg['text'].toLowerCase())) {
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
        this._send(`{"stumble":"msg","text": "${randomDilfGif}"}`);
    }

//-----------------------------------------------------------------------------------------------------------------------------------

    // start snarfdilf
    if (wsmsg['text'].toLowerCase() === ".snarfdilf") {
        this._send('{"stumble":"msg","text": "https://i.imgur.com/RSZ7xzg.jpeg"}');
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

    // Curse word check command
    // if (/\b(shit|fuck|bitch|asshole|damn|bastard|cock|pussy|dick|cunt|slut|fag|twat|douche|motherfucker|prick|gay|retard|nigger|whore|bastard)\b/i.test(wsmsg['text'])) {
    if (/(\b|[^a-zA-Z])(n+[\W_]*[i1!|¡]+[\W_]*[g9q6]+[\W_]*[g9q6]+[\W_]*[e3]+[\W_]*[r4]+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(k+[\W_]*[i1!|¡]+[\W_]*k+[\W_]*[e3]+[\W_]*[r4]+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(c+[\W_]*h+[\W_]*[i1!|¡]+[\W_]*n+[\W_]*[kq]+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(s+[\W_]*p+[\W_]*[i1!|¡]+[\W_]*c+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        ///(\b|[^a-zA-Z])(w+[\W_]*[o0]+[\W_]*p+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(g+[\W_]*[o0]+[\W_]*[o0]+[\W_]*[kq]+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(t+[\W_]*[a@]+[\W_]*r+[\W_]*b+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(s+[\W_]*[a@]+[\W_]*n+[\W_]*d+[\W_]*n+[\W_]*[i1!|¡]+[\W_]*[g9q6]+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC")) ||
        /(\b|[^a-zA-Z])(m+[\W_]*[o0]+[\W_]*[o0]+[\W_]*s+[\W_]*[l1]+[\W_]*[i1!|¡]+[\W_]*m+)(\b|[^a-zA-Z])/iu.test(wsmsg['text'].normalize("NFKC"))) {

        let user = wsmsg['username'] || wsmsg['handle'] || 'Unknown User';
        let message = wsmsg['text'];

        // Log in console
        console.log(`[BAN ALERT] User: ${user} | Message: "${message}"`);

        // Send ban alert + log in chat
        this._send(`{"stumble":"msg","text":"🚨 !BAN ALERT! 🚨 ${user} said: '${message}'"}`);
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

    // Command: .roll (Dice Roll)
    if (wsmsg['text'].startsWith(".roll")) {
        const handle = wsmsg['handle'];
        const username = userHandles[handle];
        const nickname = userNicknames[username]?.nickname || "";

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
        let gojiBuxValue = parseInt(localStorage.getItem('gojiBuxValue')) || 1;

        // .gojibux command: Increases GojiBux value
        if (wsmsg['text'].toLowerCase() === ".gbx") {
            const randomIncrease = Math.floor(Math.random() * (2000 - 20 + 1)) + 20;
            gojiBuxValue += randomIncrease;

            // Save the updated value in localStorage
            localStorage.setItem('gojiBuxValue', gojiBuxValue);

            // Send the message with the updated value
            this._send(`{"stumble":"msg","text": "📈 GojiBux is now worth 💵 ${gojiBuxValue.toLocaleString()} USD per 1 GBX!"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // .$NARF command: Displays the negative value of GojiBux
        if (wsmsg['text'].toLowerCase() === "$NRF") {
            const narfValue = -gojiBuxValue; // $NRF is the negative of GBX
            this._send(`{"stumble":"msg","text": "📉 $NARF is now worth 💵 ${narfValue.toLocaleString()} USD per 1 $NRF!"}`);
        }

//-----------------------------------------------------------------------------------------------------------------------------------

        // Reset GojiBux command
        if (wsmsg['text'] === ".resetGojiBux") {
            gojiBuxValue = 1;

            // Save the reset value in localStorage
            localStorage.setItem('gojiBuxValue', gojiBuxValue);

            // Send the message to confirm the reset
            this._send(`{"stumble":"msg","text": "🤖 GojiBux has been reset to ${gojiBuxValue} USD per 1 GBX."}`);
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
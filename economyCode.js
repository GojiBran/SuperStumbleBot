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

// 💰 Universal Stashed GojiBux (Per-user)
let userStashes = JSON.parse(localStorage.getItem("userStashes")) || {};

// Function to save user stashes
function saveUserStashes() {
    localStorage.setItem("userStashes", JSON.stringify(userStashes));
}

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

// 🌿 Universal Weed Storage (Per-user)
let userWeedStashes = JSON.parse(localStorage.getItem("userWeedStashes")) || {};

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

// 🌿 Universal Joint Storage (Per-user)
let userJointStashes = JSON.parse(localStorage.getItem("userJointStashes")) || {};

// Function to save user joint stashes
function saveJointStashes() {
    localStorage.setItem("userJointStashes", JSON.stringify(userJointStashes));
}

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

// 🥖🎒 `.myjoints` - Display how many joints the user has
const myjointsTriggers = [".myjoints"]; // add aliases here like ".jointbag"
if (myjointsTriggers.includes(wsmsg["text"].toLowerCase().trim())) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userJointStashes[username] || 0;

    respondWithMessage.call(this, `🥖🎒 ${nickname}, you have 🥖 ${stash} joint${stash !== 1 ? "s" : ""} ready to smoke.`);
}

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

// 🏛 `.lgh` - Show the total GojiBux stored in the LGH Bank
if (wsmsg["text"].toLowerCase() === ".lgh") {
    respondWithMessage.call(this, `🏦 LGH Bank: 💵 ${lghBank.toLocaleString()} GBX`);
}

// 🏦 `.wgh` - Check global stash
if (wsmsg["text"].toLowerCase() === ".wgh") {
    respondWithMessage.call(this, `🏬 WGH Dispo: 🥦 ${wghBank.toLocaleString()}g`);
}

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

if (wsmsg["text"].toLowerCase().startsWith(".buyspaget")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 20;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[2] || "1";

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max" ? maxAffordable : parseInt(rawAmount, 10);

    if (!amount || amount <= 0) {
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

// 🍝 `.my spaget` - Display user's spaghetti stash
if (wsmsg["text"].toLowerCase() === ".myspaget") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userSpaghettiStashes[username] || 0;

    respondWithMessage.call(this, `🍝🎒 ${nickname}, you have ${stash} SPG.`);
}

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

// 🍕 Last Pizza Claim Time (Per-user)
let lastPizzaClaim = JSON.parse(localStorage.getItem("lastPizzaClaim")) || {};

if (wsmsg["text"].toLowerCase().startsWith(".buypizza")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 10;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[2] || "1";

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max" ? maxAffordable : parseInt(rawAmount, 10);

    if (!amount || amount <= 0) {
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

// 🍕🎒 `.my pizza` - Display user's pizza stash
if (wsmsg["text"].toLowerCase() === ".mypizza") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const stash = userPizzaStashes[username] || 0;

    respondWithMessage.call(this, `🍕🎒 ${nickname}, you have 🍕 ${stash} pizza.`);
}

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

//FORG
let userFrogCounts = JSON.parse(localStorage.getItem("userFrogCounts") || "{}");

if (wsmsg["text"].toLowerCase().startsWith(".buyfrog")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 1_000_000;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[2] || "1";

    const userBalance = userBalances[username]?.balance || 0;
    const maxAffordable = Math.floor(userBalance / costPer);
    let amount = rawAmount.toLowerCase() === "all" || rawAmount.toLowerCase() === "max" ? maxAffordable : parseInt(rawAmount, 10);

    if (!amount || amount <= 0) {
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

let userPotatoCounts = JSON.parse(localStorage.getItem("userPotatoCounts") || "{}");

if (wsmsg["text"].toLowerCase().startsWith(".buypotato")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 1;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[2] || "1";

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

// 🥔🎒 `.mypotato` - Display user's potato count
if (wsmsg["text"].toLowerCase() === ".mypotato") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const count = userPotatoCounts[username] || 0;

    respondWithMessage.call(this, `🥔🎒 ${nickname}, you've bought 🥔 ${count.toLocaleString()} potato${count !== 1 ? "es" : ""}.`);
}

// 🕒 Cooldown storage for `.bankrob`
let lastBankRobTime = JSON.parse(localStorage.getItem("lastBankRobTime")) || {};

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

// 🕒 Cooldown storage for `.weedrob`
let lastWeedRobTime = JSON.parse(localStorage.getItem("lastWeedRobTime")) || {};

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

// 🕒 Cooldown storage for `.bankheist`
let lastBankHeistTime = JSON.parse(localStorage.getItem("lastBankHeistTime")) || {};

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

// 🕒 Cooldown storage for `.weedheist`
let lastWeedHeistTime = JSON.parse(localStorage.getItem("lastWeedHeistTime")) || {};

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

// 🕒 Cooldown storage for `.adventure`
let lastAdventureTime = JSON.parse(localStorage.getItem("lastAdventureTime")) || {};

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

// 🥦🔒 `.stashweed` - Hide weed from police busts (60-second cooldown)
let lastHideWeedTimes = JSON.parse(localStorage.getItem("lastHideWeedTimes")) || {};
let lastUnhideWeedTimes = JSON.parse(localStorage.getItem("lastUnhideWeedTimes")) || {};
let userHiddenWeed = JSON.parse(localStorage.getItem("userHiddenWeed")) || {};

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

// 🔒🎒 `.mystashweed` - Check how much weed is hidden
if (wsmsg["text"].toLowerCase() === ".mystashweed") {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";

    userHiddenWeed[username] = userHiddenWeed[username] || 0;

    respondWithMessage.call(this, `🔒🎒 ${nickname}, you have 🥦 ${userHiddenWeed[username].toLocaleString()}g of weed safely hidden.`);
}

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

// 💎 `.gojicoin` - Buy a GojiCoin for 1 Billion GBX
let gojiCoinBalances = JSON.parse(localStorage.getItem("gojiCoinBalances")) || {};

if (wsmsg["text"].toLowerCase().startsWith(".buycoin")) {
    const handle = wsmsg["handle"];
    const username = userHandles[handle];
    const nickname = userNicknames[username]?.nickname || username || "you";
    const costPer = 1_000_000_000;
    const args = wsmsg["text"].trim().split(/\s+/);
    const rawAmount = args[2] || "1";

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

// 💰 GojiBux Pot System
let gojiPot = localStorage.getItem("gojiPot") ? parseInt(localStorage.getItem("gojiPot")) : 0;
let lastPotClaimTime = localStorage.getItem("lastPotClaimTime") ? parseInt(localStorage.getItem("lastPotClaimTime")) : 0;

// Function to save the pot
function saveGojiPot() {
    localStorage.setItem("gojiPot", gojiPot);
    localStorage.setItem("lastPotClaimTime", lastPotClaimTime);
}

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

if (wsmsg["text"].toLowerCase() === ".top" || wsmsg["text"].toLowerCase() === ".leaderboard") {
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
}

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

if (wsmsg["text"].toLowerCase() === ".menu") {
    const shopItems = [
        { name: "spaget", emoji: "🍝", price: 20, desc: "Garlicy noodle delight (adds to stash)" },
        { name: "pizza",  emoji: "🍕", price: 10, desc: "Hot slice of cheesy goodness (adds to stash)" },
        { name: "potato", emoji: "🥔", price: 1,  desc: "Literally just a potato (adds to stash)" },
        { name: "frog",   emoji: "🐸", price: 1_000_000, desc: "A pointless frog. Just flexing. (big flex)" },
        { name: "coin",   emoji: "💎", price: 1_000_000_000, desc: "One shiny GojiCoin (purely cosmetic)" }
    ];

    let menuText = "🛒 GojiShop Menu — Use `.buy[item] [amount]`\n";
    for (const item of shopItems) {
        menuText += `${item.emoji} \`${item.name}\` — 💵 ${item.price.toLocaleString()} GBX — 🏷 ${item.desc}\n`;
    }

    respondWithMessage.call(this, menuText.trim());
}

// 🔥 `.priceweed` - Show current dynamic weed prices + economy stats with split messages
if (wsmsg["text"].toLowerCase() === ".priceweed") {
    // Ensure all key economy values exist
    const bank = wghBank || 0;
    const gbxReserve = lghBank || 0;
    const totalWeed = Object.values(userWeedStashes || {}).reduce((a, b) => a + (b || 0), 0);
    const offshoreTotal = Object.values(userStashes || {}).reduce((a, b) => a + (b || 0), 0);
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
    const message2 = `📊 Market Stats:\n🏬 WGH Supply: ${bank.toLocaleString()} g\n🏦 LGH Reserve: ${gbxReserve.toLocaleString()} GBX\n🥦 Total Weed: ${totalWeed.toLocaleString()} g\n💰 Offshore Weed: ${offshoreTotal.toLocaleString()} g\n🔒 Hidden Weed: ${hiddenTotal.toLocaleString()} g`;

    // Send first message
    respondWithMessage.call(this, message1);

    // Send second message after 1000ms delay
    setTimeout(() => {
        respondWithMessage.call(this, message2);
    }, 1000);

    // Debugging log (check console)
    console.log(`🥦💵 .weedprice command triggered:\n- Buy Price: ${weedBuyPrice} GBX/g\n- Sell Price: ${weedSellPrice} GBX/g\n- WGH: ${bank}\n- LGH: ${gbxReserve}\n- Total Weed: ${totalWeed}\n- Offshore Weed: ${offshoreTotal}\n- Hidden Weed: ${hiddenTotal}`);
}

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

# **SuperStumbleBot**
## Goji's **StumbleChat** Bot

This **UserScript**, written in JavaScript, enhances **StumbleChat** by adding custom commands, media playback, and interactive responses. It runs in the browser using a UserScript manager like **Tampermonkey** or **Greasemonkey**.

### **[View Commands List](https://github.com/GojiBran/SuperStumbleBot-Commands)**

---

### **Key Features**
1. **Custom Commands**:
   - Supports commands like `.cheers`, `.dab`, `.joint`, `.penis`, `.smoko`, etc., often triggering humorous or media-rich responses.
   - Includes utility commands: `.time`, `.currency`, `.calc`, `.convert`, and `.roll`.

2. **YouTube Integration**:
   - Plays YouTube videos via commands like `.youtube <URL>` or `.play <query>`.

3. **Interactive Responses**:
   - Responds to phrases like `ping` → `PONG`, `ding` → `DONG`, and `gg` with random replies.
   - Includes Easter eggs (e.g., `.dialupdick`, `.egg`, `.ai`).

4. **GojiBux System**:
   - A fictional currency (`GojiBux`) with a negative counterpart (`$NRF`). Use `.gojibux` to check or reset with `.resetGojiBux`.

5. **Media and GIFs**:
   - Sends GIFs/images for commands like `.dance`, `.boobs`, `.booty`, `.flamingo`, etc.

6. **Triggers and Reactions**:
   - Responds to curse words with `LE GASP!!` and reacts to phrases like `5-0`, `set`, `packed`, `MAMA`, etc.

7. **Cheers System**:
   - Supports cheers in multiple languages (e.g., `skål`, `santé`, `prost`, `kanpai`).

8. **Personalized Commands**:
   - Uses usernames/nicknames for personalized responses (e.g., `.me`, `.my`, `.cheers`, `.420`).
   - Welcomes users with personalized messages when they join the chat (e.g., "Welcome to Let's Get High, [username]!").
   - Recognizes returning users and greets them with a "Welcome back" message.

9. **Nickname Management**:
   - Stores user nicknames and information in `localStorage`.
   - Updates nicknames when users change them.
   - Commands like `.self` display user info (nickname, username, handle, and mod status), and `.users` lists all stored users.

10. **Universal Notes Storage**:
    - **`.note [text]`**: Adds a note to a shared storage (up to 6 notes, oldest removed when full).
    - **`.notes`**: Displays all stored notes with a 1-second delay between each.
    - **`.clearNotes`**: Clears all stored notes.

11. **Random Fun**:
    - Commands like `.dialupdick`, `.dialupdicklong`, and `.dialupdickkong` send humorous ASCII art.
    - `.roll` for dice rolling and `.choose` for random selections.

---

### **Core Functions**
- **`handleMessage(msg)`**: Processes incoming WebSocket messages.
- **`respondWithMessage(text)`**: Sends responses to the chat.
- **`safeJSONParse(jsonString)`**: Safely parses JSON strings.
- **`handleChatMessage(wsmsg)`**: Executes commands based on chat messages.

---

### **Example Commands**
- **`.cheers`**: Celebratory message.
- **`.penis`**: Random "penis length" message.
- **`.dance`**: Random dancing GIF.
- **`.calc 2+2`**: Performs calculations.
- **`.currency 50 usd to dkk`**: Converts currencies.
- **`.roll 2d6`**: Rolls dice.
- **`.time pst`**: Displays time in a specific timezone.
- **`.egg`**: Rickrolls with lyrics.
- **`.me`**: Sends a message in the format `[nickname] [message]`.
- **`.my`**: Sends a message in the format `[nickname]'s [message]`.
- **`.note [text]`**: Adds a note to shared storage.
- **`.notes`**: Displays all stored notes.
- **`.clearNotes`**: Clears all notes.

---

# 🌿 StumbleFarm - A Chat-Based Weed Growing Game

**StumbleFarm** lets the chat collaborate to **grow, harvest, and smoke** virtual weed! 🚬🔥

## 🎮 How to Play
| Command | Description |
|---------|------------|
| `.grow plantseed` / `.g plantseed` | 🌱 Plant a new seed (randomized name) |
| `.grow plant` / `.g plant` | 🔍 Check the plant's status |
| `.grow water` / `.g water` | 💦 Water the plant |
| `.grow joint` / `.g joint` | 🚬 Roll a joint |
| `.grow smoke` / `.g smoke` | 💨 Smoke a joint |

🚀 **Persistent stats** (weed stash, joints) with **LocalStorage**.  
🔥 **Fully randomized plant names** include **grower's name or chat references**.  

### 🔥 Features:
- 🌱 **Grow a plant from seed to harvest**
- 🌾 **Go through realistic growth stages**
- ✂️ **Dry, cure, and trim for best results**
- 🚬 **Roll & smoke joints together**
- 💾 **Data is saved with LocalStorage for persistence**
- 🎮 **Works with `.grow` and `.g` command prefixes**

## 💾 **Data Persistence**
- 🌱 **Weed stash, joints, and plant progress are saved in LocalStorage**
- 🔄 **Even if the bot reloads, progress remains**
- 🚫 **If you want to reset, manually clear LocalStorage**

---

### **Technical Details**
- **WebSocket Override**: Intercepts and manipulates WebSocket messages.
- **LocalStorage**: Stores user nicknames, GojiBux values, and universal notes.
- **Regular Expressions**: Used for command parsing and triggering responses.
- **Asynchronous Delays**: `setTimeout` for dynamic, delayed messages.

---

### **Summary**
SuperStumbleBot is a feature-rich, humorous enhancement for StumbleChat, adding custom commands, media playback, and interactive responses. It’s well-organized, leveraging WebSocket manipulation, LocalStorage, and regex for a seamless and entertaining chat experience. The bot now includes personalized commands, welcome messages, nickname management, and a universal notes system, making it even more engaging and user-friendly.

---

# Chatbot Feature Ideas

## Core Features
- **Message Filtering** – Ensure the bot only responds when appropriate.
- **Rate Limiting** – Prevent spam by limiting how often users can trigger commands.
- **Cooldowns** – Add per-command cooldowns to avoid excessive triggering.
- **Auto-Responses** – Set responses for specific words or phrases (e.g., bot replies with "Bless you!" when someone types "sneeze").
- **Alias Commands** – Shorter versions of frequently used commands.
- **Help Command** – List available commands and brief descriptions.
- **Status Indicator** – Shows if the bot is online, idle, or in cooldown mode.
- **Message Logging** – Optional logs of all commands used for debugging.

## User Interaction & Utility
- **.notes Command** – Users can save and retrieve notes.
- **.remind Command** – Let users set reminders for themselves.
- **.define Command** – Basic dictionary definitions for words.
- **.calc Command** – Simple math calculations.
- **.weather Command** – Fetch basic weather info for a given location.
- **.whois Command** – Provides basic info on a user (e.g., first seen, note history).
- **.seen Command** – Shows the last time a user was active.
- **.poll Command** – Lets users vote on simple polls.
- **.time Command** – Shows the current time in a given timezone.
- **.convert Command** – Converts units (e.g., inches to cm, Fahrenheit to Celsius).
- **.translate Command** – Translates text between languages.
- **.shorten Command** – Shortens long URLs using a URL shortener.
- **.reminder Command** – Notifies a user after a set time.

## Fun & Engagement
- **.8ball Command** – Randomized fortune-telling response.
- **.roll Command** – Rolls a dice (e.g., 1d6, 1d20).
- **.choose Command** – Picks a random option from a list.
- **.quote Command** – Random Pink Floyd lyric (or expand to more).
- **.joke Command** – Fetches a random joke.
- **.fact Command** – Posts a random fun fact.
- **.rps Command** – Play Rock, Paper, Scissors against the bot.
- **.hangman Command** – Simple game where users guess letters.
- **.trivia Command** – Asks a random trivia question.
- **.story Command** – Bot generates a short random story.
- **.meme Command** – Fetches a random meme image.
- **.roast Command** – Roasts the user with a lighthearted insult.
- **.compliment Command** – Compliments the user.
- **.mock Command** – Mimics a user’s message in spongebob-case.
- **.dadjoke Command** – Posts a dad joke.
- **.spoiler Command** – Hides a message in a spoiler tag.

## Customization & Admin Tools
- **Custom Triggers** – Let users add or edit simple response triggers.
- **User Blacklist** – Prevent certain users from triggering commands.
- **Logging** – Store logs of interactions for debugging or moderation.
- **Configurable Responses** – Allow easy editing of response texts.
- **Custom Prefix** – Allow changing the bot’s command prefix.
- **Permission Levels** – Certain commands only work for specific users.
- **Keyword Alerts** – Notify the bot owner if certain words are used.
- **Auto-Mute** – Temporarily disable commands if spam is detected.
- **.setwelcome Command** – Custom welcome message for new users.
- **.ignore Command** – Stop the bot from responding to certain users or keywords.

## Enhancements to Existing Features
- **Better GojiBux Tracking** – Expand GojiBux functionality (leaderboard, spending).
- **.710 & .420 Commands** – Maybe expand them with random messages or effects.
- **Image/GIF Responses** – Expand Imgur link support for more commands.
- **Time-Based Responses** – Custom messages that trigger at certain times.
- **More .8ball Responses** – Add more creative responses to the Magic 8-ball.
- **Expanded .quote Command** – Include quotes from other artists, movies, or historical figures.
- **Themed Days** – Custom bot responses on certain days (e.g., Star Wars Day, 4/20, Friday the 13th).
- **User Reputation System** – Track and display user activity or fun stats.
- **GojiBux Upgrades** –  
  - **Betting System** – Gamble GojiBux on dice rolls or coin flips.  
  - **Shop System** – Let users "spend" GojiBux on fun perks.  
  - **Daily Streaks** – Earn bonus GojiBux for using the bot daily.

## Miscellaneous Ideas
- **ASCII Art Generator** – Converts text into ASCII art.
- **Reverse Text** – Flips a message backward.
- **Emojify** – Converts words into emojis where possible.
- **Fake News Generator** – Bot makes up a ridiculous fake headline.
- **Random Wikipedia Article** – Posts a link to a random Wikipedia page.
- **Guess the Song** – Posts lyrics and users try to guess the song.

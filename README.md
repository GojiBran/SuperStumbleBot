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

### **Technical Details**
- **WebSocket Override**: Intercepts and manipulates WebSocket messages.
- **LocalStorage**: Stores user nicknames, GojiBux values, and universal notes.
- **Regular Expressions**: Used for command parsing and triggering responses.
- **Asynchronous Delays**: `setTimeout` for dynamic, delayed messages.

---

### **Summary**
SuperStumbleBot is a feature-rich, humorous enhancement for StumbleChat, adding custom commands, media playback, and interactive responses. It’s well-organized, leveraging WebSocket manipulation, LocalStorage, and regex for a seamless and entertaining chat experience. The bot now includes personalized commands, welcome messages, nickname management, and a universal notes system, making it even more engaging and user-friendly.



---

# **HALP**

### SuperStumbleBot plan for you to do! (lol):

---

# **SuperStumbleBot Review & Updates List**
### **1. Code Review & Optimization**
- Inspect the entire codebase for performance, memory leaks, and inefficiencies.
- Refactor redundant or outdated code.
- Ensure best practices for JavaScript, WebSockets, and Userscripts.
- Ensure the entire script is **fully modular, expandable, unified, and well-commented** for easy maintenance.

### **2. WebSocket Handling**
- Fully inspect and document how StumbleChat’s WebSocket works.
- Improve WebSocket event handling for stability and speed.
- Implement better error handling and reconnection strategies.

### **3. Full Modularity & Organization**
- Rewrite the bot to be **fully modular**, making it easy to expand and maintain.
- Separate logic into clear modules (**commands, economy, WebSockets, data storage, etc.**).
- Ensure adding new features or modifying existing ones is straightforward.

### **4. Unified Command System**
- Standardize all commands (**naming conventions, parameters, output format**).
- Improve how commands are processed and handled.
- Reduce redundancy and ensure efficient execution.
- **Alias System**: Most commands should have aliases for quick use (e.g., `.cheers` → `.c`).

### **5. Economy System Overhaul**
- Make the entire economy system **unified, separate, and expandable**.
- Implement a structured and organized way to store and update economy-related data.
- Ensure the economy features (**GojiBux, weed trade, police busts, rankings, etc.**) work seamlessly together.
- Users should start with **0 GBX** (not 1 GBX).
- **Bank limits** should not max out too early, if at all.

#### **Weed Growth System**
- Implement **Pot Farm-style** growing and economy mechanics.
- Add a full growth cycle: **Seed → Plant → Harvest**.
- Implement post-harvest processing steps before the weed is usable.
- Convert harvested bud into **joints, extracts (bubble hash, etc.), or stash-ready bud**.

#### **Food Expansion**
- Expand food storage mechanics similar to **LGH/WGH**.
- Store different food items like **cookies, spaghetti, pizza** with proper handling.
- **Food Consumption**: Allow users to eat food from their stash.

#### **Weed Consumption**
- **Smoking Weed**: Allow users to smoke weed from their stash.
- **Group Smoking**: Enable multiple users to contribute and smoke from their stashes together.

#### **Chat Time & Economy Bonuses**
- **Track user chat time** and provide economy bonuses based on activity.

### **6. Trading & Market System**
- **Trade System**: Users can trade items (weed, food, GojiBux) with each other.
- **Item Rarity & Market Fluctuations**: Different values for weed strains or food based on rarity and demand.
- **Black Market & Risk System**: High-risk, high-reward economy options, including large weed deals with a chance of police busts.

### **7. Gambling System Overhaul**
- **User vs. User Gambling**: Users can bet against each other in games like coin flips, dice rolls, or poker.
- **Progressive Jackpots**: Some gambling games will have growing prize pots.
- **Casino-Style Betting**: Expand gambling with slots, blackjack, and other games.
- **Better Economy Numbers**: Adjust economy values to ensure fair possible profits.

### **8. Global Cooldown & Command Queue**
- Implement a **global cooldown queue** for invoked commands.
- Every command output should be **posted 1000ms after the previous command**.
- Ensure **command timers and cooldowns** still work properly before moving to the next queued command.

### **9. Local Storage & User Data Handling**
- Ensure all **local storage** data is stored in **one consistent place**.
- **Username**: Used to save a user's data (notes, economy, etc.).
- **Nickname**: How users display their name (**can change at any time in StumbleChat**).
- **Handle**: A user’s current chat ID (**session-based, from join to leave**).
- Ensure all bot features properly reference **username, nickname, and handle** in the right contexts.

### **10. Role System Expansion**
- Expand role support for **Owner, Super, Moderator, Operator, Basic, and Guest**.
- Ensure **permissions** and access levels are properly structured.

### **11. Quality of Life & Fun Features**
- **Daily/Weekly Bonuses**: Rewards for logging in or active participation.
- **Achievements & Milestones**: Unlockable titles or perks for reaching economy goals (e.g., "Weed Baron" for harvesting 100 plants).
- **More Interactive Commands**: Social and fun commands, such as roasting other users, virtual parties, or custom memes.
- **Personalized Stashes**: Users can "name" their weed strains or food dishes.
- **Custom Roles & Permissions**: Let moderators have additional economy control commands.
- **User Shop & Custom Items**: Users can create and sell custom items within the economy.

### **12. Bot Administration & Debugging**
- **Log System & Error Reporting**: Improved tracking/logging to catch errors faster.
- **Admin Tools for Balancing**: Allow easier tweaking of economy numbers, cooldowns, and storage limits dynamically.

### **13. Bug Fixes & Compatibility**
- Fix any known or unknown issues.
- Ensure compatibility with **recent StumbleChat updates**.
- Improve handling of **edge cases** to prevent crashes.

### **14. Security & Stability**
- Check for potential **security vulnerabilities**.
- Optimize how **data is stored and processed**.
- Ensure the script runs **efficiently** without unnecessary resource usage.

### **15. Future Expansion Readiness**
- Ensure the script is **flexible for future features**.
- Implement **clear documentation/comments** for easier updates.
- Make it easy to add **new modules** without breaking existing features.

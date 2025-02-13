# SuperStumbleBot
 ## Goji's **StumbleChat** Bot



This script is a **UserScript** designed to enhance the functionality of **StumbleChat**, a web-based chat platform. It is written in JavaScript and is intended to be executed in the browser using a UserScript manager like **Tampermonkey** or **Greasemonkey**. The script adds various features to the chat, including custom commands, media playback (e.g., YouTube videos), and interactive responses to specific chat messages.

View the **commands list** here: **[Super Stumble Bot Commands](https://github.com/GojiBran/SuperStumbleBot-Commands)**.

Here’s a breakdown of what the script does:

---

### **1. Metadata Block**
```javascript
// ==UserScript==
// @name         StumbleBot
// @namespace    StumbleBot
// @version      1.0
// @description  Play youtube videos from the chat box and/or add custom commands to StumbleChat
// @author       Goji
// @match        https://stumblechat.com/room/*
// ==/UserScript==
```
- **Purpose**: This block defines metadata for the UserScript.
  - **@name**: The name of the script (`StumbleBot`).
  - **@namespace**: A unique identifier for the script.
  - **@version**: The version of the script (`1.0`).
  - **@description**: A brief description of what the script does.
  - **@author**: The author of the script (`Goji`).
  - **@match**: Specifies the URLs where the script should run (in this case, any room on `stumblechat.com`).

---

### **2. Main Functionality**
The script modifies the behavior of the **WebSocket** communication in StumbleChat to intercept and manipulate messages. It overrides the WebSocket's `send` method to handle outgoing messages and adds an event listener for incoming messages.

#### **Key Features:**
1. **User Nickname Management**:
   - Stores user nicknames and information in `localStorage`.
   - Welcomes users when they join the chat.
   - Updates nicknames when users change them.

2. **Custom Commands**:
   - The script supports a wide range of commands (e.g., `.cheers`, `.dab`, `.joint`, `.penis`, `.smoko`, etc.).
   - Each command triggers a specific response in the chat, often with humor or media (e.g., GIFs, YouTube links).

3. **YouTube Integration**:
   - Allows users to play YouTube videos directly in the chat by typing commands like `.youtube <URL>` or `.play <query>`.
   - Converts various YouTube URL formats into a standard format for playback.

4. **Interactive Responses**:
   - Responds to specific phrases or words (e.g., `ping` → `PONG`, `ding` → `DONG`, `gg` → random responses).
   - Includes Easter eggs and humorous responses (e.g., `.dialupdick`, `.egg`, `.ai`).

5. **Utility Commands**:
   - Provides utility functions like `.time` (displays time in different time zones), `.currency` (converts currencies), `.calc` (performs calculations), and `.convert` (converts units like length, weight, temperature, etc.).
   - Includes a dice-rolling command (`.roll`) for generating random numbers.

6. **GojiBux System**:
   - A fun, fictional currency system (`GojiBux`) that increases in value randomly when the `.gojibux` command is used.
   - Includes a negative counterpart (`$NRF`) and a reset command (`.resetGojiBux`).

7. **Media and GIFs**:
   - The script sends GIFs or images in response to specific commands (e.g., `.dance`, `.boobs`, `.booty`, `.flamingo`, etc.).
   - Some commands trigger random GIFs from a predefined list.

8. **Triggers and Reactions**:
   - Responds to curse words with a humorous message (`LE GASP!!`).
   - Reacts to specific phrases like `5-0`, `set`, `packed`, `MAMA`, `smoko`, etc.

9. **Cheers System**:
   - Supports cheers in multiple languages (e.g., `skål`, `santé`, `prost`, `kanpai`, etc.).
   - Responds with random celebratory messages.

10. **Random Fun**:
    - Includes silly commands like `.dialupdick`, `.dialupdicklong`, and `.dialupdickkong`, which send ASCII art of a "****" in a humorous way.
    - Features a `.roll` command for dice rolling and a `.choose` command for making random selections.

---

### **3. Core Functions**
- **`handleMessage(msg)`**:
  - Processes incoming WebSocket messages.
  - Handles user join events, nickname changes, and custom commands.

- **`respondWithMessage(text)`**:
  - Sends a response message back to the chat.

- **`safeJSONParse(jsonString)`**:
  - Safely parses JSON strings and handles errors gracefully.

- **`handleChatMessage(wsmsg)`**:
  - Processes chat messages and executes commands.

---

### **4. Key Components**
1. **WebSocket Override**:
   - The script overrides the WebSocket's `send` method to intercept outgoing messages and add custom behavior.

2. **LocalStorage**:
   - Stores user nicknames and GojiBux values persistently across sessions.

3. **Command Parsing**:
   - The script uses regular expressions and string manipulation to parse and execute commands.

4. **Randomization**:
   - Many commands (e.g., `.dance`, `.boobs`, `.farting`) use randomization to select responses or GIFs from a list.

5. **Delayed Responses**:
   - Some commands (e.g., `.bustin`, `.lyrics`) send multiple messages with delays between them for a more interactive experience.

---

### **5. Example Commands**
- **`.cheers`**: Responds with a celebratory message.
- **`.penis`**: Generates a random "penis length" message.
- **`.dance`**: Sends a random dancing GIF.
- **`.boobs`**: Sends a random GIF of boobs.
- **`.calc 2+2`**: Performs a calculation and displays the result.
- **`.currency 50 usd to dkk`**: Converts 50 USD to DKK.
- **`.roll 2d6`**: Rolls two six-sided dice and displays the results.
- **`.time pst`**: Displays the current time in the Pacific Time Zone.
- **`.egg`**: Plays a Rickroll and displays lyrics.

---

### **6. Humor and Fun**
The script is packed with humor, including:
- Random responses to curse words.
- Silly commands like `.dialupdick` and `.egg`.
- Fun interactions like `ping` → `PONG` and `ding` → `DONG`.
- A fictional currency system (`GojiBux`) with a negative counterpart (`$NRF`).

---

### **7. Technical Details**
- **WebSocket Manipulation**:
  - The script intercepts WebSocket messages to add custom functionality.
- **LocalStorage Usage**:
  - Stores user data and GojiBux values for persistence.
- **Regular Expressions**:
  - Used extensively for parsing commands and triggering responses.
- **Asynchronous Delays**:
  - Uses `setTimeout` to send delayed messages for a more dynamic experience.

---

### **8. Summary**
This script is a feature-rich, humorous, and interactive enhancement for StumbleChat. It adds custom commands, media playback, and fun interactions to the chat, making it more engaging and entertaining for users. The script is well-organized, with clear separation of concerns between WebSocket handling, command parsing, and response generation. It’s a great example of how UserScripts can extend the functionality of web applications.

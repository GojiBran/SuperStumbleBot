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

10. **Random Fun**:
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

---

### **Technical Details**
- **WebSocket Override**: Intercepts and manipulates WebSocket messages.
- **LocalStorage**: Stores user nicknames and GojiBux values.
- **Regular Expressions**: Used for command parsing and triggering responses.
- **Asynchronous Delays**: `setTimeout` for dynamic, delayed messages.

---

### **Summary**
SuperStumbleBot is a feature-rich, humorous enhancement for StumbleChat, adding custom commands, media playback, and interactive responses. It’s well-organized, leveraging WebSocket manipulation, LocalStorage, and regex for a seamless and entertaining chat experience. The bot now includes personalized commands, welcome messages, and nickname management, making it even more engaging and user-friendly.

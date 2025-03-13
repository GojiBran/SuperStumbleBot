# **SuperStumbleBot**  
## Goji's **StumbleChat** Bot  

This **UserScript**, written in JavaScript, enhances **StumbleChat** by adding custom commands, media playback, an interactive economy system, and more. It runs in the browser using a UserScript manager like **Tampermonkey** or **Greasemonkey**.  

### **[View Commands List](https://github.com/GojiBran/SuperStumbleBot-Commands)**  

---

## **Key Features**  

### **1. Custom Commands**  
- Supports commands like `.cheers`, `.dab`, `.joint`, `.penis`, `.smoko`, etc., often triggering humorous or media-rich responses.  
- Includes utility commands: `.time`, `.currency`, `.calc`, `.convert`, `.roll`.  

### **2. GojiBux Economy System**  
The bot features a dynamic **GojiBux** economy where users can earn, gamble, and trade virtual currency.  

#### **Core Economy Features**  
- **Earning GojiBux**: Users gain **GojiBux** for participating in chat (joining, messaging, using commands, playing media).  
- **Spending & Trading**: Buy, sell, and trade virtual items like weed, food, or GojiBux with other users.  
- **Risk & Reward System**: Engage in **high-risk, high-reward** activities like gambling, market trading, or even **black market deals**.  

#### **Economy Commands**  
- **`.gojibux`** → Check current GojiBux balance.  
- **`.topblk`** → Displays the **top 10 users** with the largest offshore stash.  
- **`.give @user amount`** → Transfer GojiBux to another user.  
- **`.gamble amount`** → Bet GojiBux on a random outcome.  
- **`.stock`** → View dynamic stock prices.  
- **`.buy [item] [amount]`** → Purchase items using GojiBux.  
- **`.sell [item] [amount]`** → Sell owned items for GojiBux.  
- **`.stash`** → View current owned items (weed, food, etc.).  

#### **Weed Economy Features**  
- Grow weed from **seeds to harvest**, then process it into different forms.  
- Store and **sell weed strains** based on demand.  
- **Weed market fluctuations**: Prices change dynamically.  
- **Black market & police risk**: Smuggling and illegal trade can result in **police busts**.  

#### **Food & Items Expansion**  
- Food items like **spaghetti, pizza, and cookies** can be bought and traded.  
- Future expansions include **custom food & item creation**.  

### **3. YouTube & Media Integration**  
- **YouTube Support**: `.youtube <URL>` or `.play <query>` to play videos.  
- **GIFs & Images**: Commands like `.dance`, `.boobs`, `.booty`, `.flamingo` send media responses.  

### **4. Interactive Responses & Triggers**  
- **Auto-Replies**:  
  - `ping` → `PONG`, `ding` → `DONG`, `gg` triggers random responses.  
  - Recognizes **slang** and **inside jokes** (`5-0`, `set`, `packed`, `MAMA`).  
- **Easter Eggs & Fun Commands**: `.**********`, `.888`, `.88`, `.********`.  

### **5. Nickname & User Management**  
- Stores **user nicknames** and info in `localStorage`.  
- Recognizes **returning users** and greets them with a "Welcome back" message.  
- Commands:  
  - **`.self`** → Displays user info (nickname, username, handle, mod status).  

### **6. Universal Notes System**  
- **`.note [text]`** → Adds a note (limit: 26 notes).  
- **`.notes`** → Displays stored notes (1-second delay between messages).  

### **7. Gambling & Games**  
- **`.roll 2d6`** → Rolls dice.  
- **`.choose option1 | option2 | option3`** → Picks a random option.  
- **Casino Features**: Coming soon: **slots, blackjack, progressive jackpots**.  

---

## **Core Functions**  
- **WebSocket Override**: Intercepts and modifies chat messages.  
- **LocalStorage**: Saves user data (GojiBux, nicknames, economy stats).  
- **Regex Command Parsing**: Efficient pattern recognition for chat interactions.  
- **Dynamic Message Delays**: Uses `setTimeout` for **natural response timing**.  

---

## **Example Commands**  
| Command | Description |
|---------|-------------|
| **`.cheers`** | Celebratory toast message. |
| **`.penis`** | Randomized "penis length" message. |
| **`.dance`** | Sends a dancing GIF. |
| **`.calc 2+2`** | Performs calculations. |
| **`.currency 50 usd to dkk`** | Converts currencies. |
| **`.roll 2d6`** | Rolls dice. |
| **`.time pst`** | Displays PST time. |
| **`.me says hello!`** | Sends "nickname says hello!" |
| **`.my beer`** | Sends "nickname's beer" |
| **`.note bing bong`** | Saves a note. |
| **`.notes`** | Displays stored notes. |

---

## **Planned Features & Future Updates**  
- **Enhanced Gambling**: Blackjack, poker, progressive jackpots.  
- **Weed Customization**: Users can **name their strains**.  
- **Black Market Expansion**: More **risk/reward** options.  
- **Item Shops & Crafting**: Users can **create, sell, and trade** unique items.  
- **Achievements & Titles**: Unlock **custom roles** for economy milestones.  
- **Admin Tools**: Easier **GojiBux balancing & economy tweaks**.  

---

## **Technical Summary**  
SuperStumbleBot is a **modular, highly interactive** bot that enhances **StumbleChat** with:  
✅ **Custom Commands & Reactions**  
✅ **A Full Economy System with GojiBux, Weed, & Items**  
✅ **YouTube & Media Playback**  
✅ **User Management & Notes System**  
✅ **Gambling, Casino, & Risk-Reward Features**  

It seamlessly integrates into **StumbleChat**, offering a **fun, engaging** experience with **random events, hidden Easter eggs, and a community-driven economy**.

---

### **Installation & Usage**  
1. Install **Tampermonkey** on your browser.  
2. Load **SuperStumbleBot.js** as a new user script.  
3. Enjoy **enhanced StumbleChat** with GojiBux, gambling, weed trading, and more!  

---

**Note**: This README is likely outdated or incorrect.

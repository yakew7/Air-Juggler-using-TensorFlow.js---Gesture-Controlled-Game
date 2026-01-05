# Air-Juggler-using-TensorFlow.js---Gesture-Controlled-Game

Air Juggler is a gesture-controlled browser game built using TensorFlow.js and MediaPipe Hands, where players use their hands in front of a webcam to keep a ball in the air for as long as possible. The game combines real-time computer vision with simple physics to create an interactive and engaging experience.

🧠 How It Works

The player’s webcam feed is processed using MediaPipe Hands via TensorFlow.js.

The game detects the position of one or two hands in real time.

Each detected hand creates an invisible interaction zone.

When the ball collides with a hand while falling, it bounces upward.

The game ends if the ball falls below the screen.

🕹️ Gameplay Mechanics

Time Score:
Measures how long the player survives (in seconds).

Bounce Score:
Increases by 1 every time the ball successfully bounces off a hand.

Countdown System:
A short countdown appears before the game starts to allow the player to get ready.

Game Over State:
Displays survival time and bounce count, with the option to replay.

⚙️ Technologies Used

HTML5 Canvas – rendering game visuals

CSS3 – UI styling and animations

JavaScript (Vanilla) – game logic and physics

TensorFlow.js – machine learning runtime

MediaPipe Hands – real-time hand tracking via webcam

🚀 How to Run

Clone or download the repository.

Serve the files using a local server (recommended):

or use VS Code Live Server.

Open the game in a modern browser (Chrome recommended).

Allow webcam access when prompted.

Click Start Game and play using your hands.

⚠️ Browser & Device Notes

A webcam is required.

Best performance on desktop/laptop devices.

Chrome or Chromium-based browsers are recommended.

Running multiple camera-using tabs may cause issues.

🔙 About the Back Button

The Back button included in the interface is not intended for this standalone version of Air Juggler.
It has been added in preparation for future expansion, where Air Juggler will be part of a larger gesture-based game hub containing multiple games.

In the current version, the back button exists only as a placeholder for future projects and integration.

🌱 Future Improvements

Multiple balls with increasing difficulty

Combo and multiplier scoring system

Sound effects and background music

Mobile optimization

Additional gesture-based games integrated into a central hub

📜 License

This project is created for learning, experimentation, and portfolio use.
Feel free to explore, modify, and expand upon it.

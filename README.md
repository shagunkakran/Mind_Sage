# MindSage 🧠✨

MindSage is an interactive, AI-powered guessing game inspired by Akinator. The system utilizes machine learning decision tree logic to guess characters based on a series of user-answered questions, featuring a modern dynamic frontend.

🚀 **Live Project Link:** [https://mind-sage-mmv8.onrender.com](https://mind-sage-mmv8.onrender.com)

---

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+), Vanta.js (Dynamic Animated Backgrounds)
- **Backend:** Flask (Python)
- **Database/Storage:** CSV-based data processing with automated runtime append logic
- **Machine Learning:** `scikit-learn` (DecisionTreeClassifier utilizing Entropy criterion)
- **Authentication:** Firebase Auth (Google Sign-In integration)

---

## 🌟 Key Features

- **Google Authentication:** Secure user login powered by Firebase.
- **AI Guessing Engine:** Implements a dynamic Decision Tree to filter out options and predict characters dynamically based on user feedback.
- **Adaptive Learning:** Features a dynamic `/learn` route that appends new characters and data back to the dataset when the model fails to guess correctly, allowing the AI to learn in real-time.
- **Immersive UI:** A fully responsive, modern dashboard utilizing interactive network animations via Vanta.js.
- **Cross-Origin Resource Sharing (CORS):** Fully configured backend to handle cross-origin preflight requests seamlessly.

---

## 📂 Project Structure

```text
├── app.py                 # Core Flask backend with ML routes (/ask, /learn)
├── characters.csv         # Character dataset used for training the model
├── requirements.txt       # Python dependencies (Flask, scikit-learn, pandas, etc.)
├── package.json           # Node.js configurations
└── static/                # Frontend assets folder
    ├── index.html         # Main gameplay dashboard
    ├── login.html         # Firebase authentication page
    ├── script.js          # Game mechanics and API integrations
    └── style.css          # Core UI layouts and animations

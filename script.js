
// 1. Vanta.js Background (Birds intact rahengi)
window.addEventListener('DOMContentLoaded', () => {
    if (typeof VANTA !== 'undefined') {
        VANTA.BIRDS({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            backgroundColor: 0x0f172a,
            color1: 0x22d3ee,
            color2: 0x3b82f6,
            birdSize: 1.5,
            wingSpan: 20.00,
            separation: 50.00,
            alignment: 20.00,
            cohesion: 20.00,
            quantity: 3.00
        });
    }
});

// 2. RENDER BACKEND URL (Ye tumhara naya address hai)
const pythonURL = "https://mindsage-python.onrender.com";

// 3. Game Logic
let userAnswers = {}; 
const startBtn = document.getElementById('startBtn');
const options = document.getElementById('options');
const questionText = document.getElementById('question');
const progressBar = document.getElementById('progressBar');
const avatar = document.getElementById('avatar');

if(startBtn) {
    startBtn.addEventListener('click', () => {
        startBtn.classList.add('hidden');
        options.classList.remove('hidden');
        userAnswers = {}; 
        progressBar.style.width = '0%';
        fetchNextQuestion();
    });
}

// Backend se agla smart question mangne wala function
async function fetchNextQuestion() {
    try {
        const response = await fetch(`${pythonURL}/ask`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ answers: userAnswers })
        });

        const data = await response.json();

        if (data.status === "question") {
            questionText.innerText = data.question_text;
            questionText.dataset.key = data.question_key; 
            avatar.innerText = "🤔";
            
            let currentP = parseInt(progressBar.style.width) || 0;
            progressBar.style.width = Math.min(currentP + 10, 90) + '%';
        }
        else if (data.status === "fail") {
            questionText.innerHTML = `
                <div class="flex flex-col items-center gap-3">
                    <p class="text-rose-400 font-bold text-lg">Oops! I give up. Who was it?</p>
                    <input type="text" id="newName" class="w-full p-2 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-400" placeholder="Enter Character Name">
                    <button onclick="saveNewCharacter()" class="w-full bg-emerald-500 py-2 rounded-lg font-bold hover:scale-105 transition-transform text-white">
                        TEACH ME
                    </button>
                </div>
            `;
            options.classList.add('hidden');
            avatar.innerText = "🏳️"; 
        }
        else if (data.status === "result") {
            showFinalResult(data.name);
        }
    } catch (err) {
        console.error("Error:", err);
        questionText.innerText = "Error: MindSage Brain (Python) se connect nahi ho pa raha!";
    }
}

window.handleAnswer = async function(isYes) {
    const currentKey = questionText.dataset.key;
    if (!currentKey) return;

    userAnswers[currentKey] = isYes ? 1 : 0;
    questionText.innerText = "Thinking...";
    await fetchNextQuestion();
};

function showFinalResult(characterName) {
    options.classList.add('hidden');
    progressBar.style.width = '100%';
    avatar.innerText = "🧞‍♂️";
    questionText.innerHTML = `Got it! You're thinking of: <br><span class='text-cyan-400 font-bold text-2xl'>${characterName}</span>`;
    
    setTimeout(() => {
        startBtn.innerText = "PLAY AGAIN";
        startBtn.classList.remove('hidden');
    }, 5000);
}

window.saveNewCharacter = async function() {
    const nameInput = document.getElementById('newName');
    const name = nameInput.value.trim();
    
    if (!name) {
        alert("Please enter the name of the character!");
        return;
    }

    try {
        const response = await fetch(`${pythonURL}/learn`, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: name, answers: userAnswers })
        });
        
        const data = await response.json();
        if (data.status === "success") {
            alert(`Thanks Shagun! I now know who ${name} is.`);
            location.reload(); 
        }
    } catch (error) {
        console.error("Learning Error:", error);
        alert("Could not learn the character. Check if Python backend is Live!");
    }
};
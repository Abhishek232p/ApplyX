// NeuroFlow Advanced Execution Layer
let recognition;
let isRecording = false;

function injectFloatingUI() {
  if (document.getElementById("nf-root-container")) return;

  const container = document.createElement("div");
  container.id = "nf-root-container";
  container.innerHTML = `
    <div id="nf-status-badge" class="nf-status-badge">Processing...</div>
    <div class="nf-pill" id="nf-pill">
      <button id="nf-mic-btn" class="nf-mic-btn" title="Click to dictate">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="22"></line></svg>
      </button>
      <input type="text" id="nf-input" class="nf-input" placeholder="Dictate to NeuroFlow..." autocomplete="off" spellcheck="false" />
    </div>
  `;
  document.body.appendChild(container);

  setupSpeechRecognition();
  setupEventListeners();
}

function setupSpeechRecognition() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    
    recognition.onstart = () => {
      isRecording = true;
      document.getElementById("nf-mic-btn").classList.add("recording");
      document.getElementById("nf-input").placeholder = "Listening...";
    };
    
    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
      }
      if (finalTranscript) {
        document.getElementById("nf-input").value = finalTranscript;
        processCommand(finalTranscript);
      }
    };
    
    recognition.onerror = (e) => console.error("NeuroFlow Speech Error: ", e);
    recognition.onend = () => {
      isRecording = false;
      document.getElementById("nf-mic-btn").classList.remove("recording");
      document.getElementById("nf-input").placeholder = "Dictate to NeuroFlow...";
    };
  } else {
     console.warn("Speech Recognition API not supported in this browser environment.");
  }
}

function setupEventListeners() {
  const input = document.getElementById("nf-input");
  const micBtn = document.getElementById("nf-mic-btn");

  micBtn.addEventListener("click", () => {
    if (isRecording) {
      recognition?.stop();
    } else {
      document.getElementById("nf-input").value = "";
      recognition?.start();
    }
  });

  input.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && input.value.trim() !== "") {
      const text = input.value.trim();
      input.blur();
      processCommand(text);
    }
  });
}

function showStatus(text, duration = 0) {
    const badge = document.getElementById("nf-status-badge");
    badge.innerText = text;
    badge.classList.add("visible");
    if (duration > 0) {
        setTimeout(() => badge.classList.remove("visible"), duration);
    }
}

function getPageContext() {
  let focusedElementContext = null;
  if (document.activeElement && (document.activeElement.tagName === 'TEXTAREA' || document.activeElement.isContentEditable || document.activeElement.tagName === 'INPUT')) {
      focusedElementContext = document.activeElement.innerText || document.activeElement.value;
  }
  
  return {
    url: window.location.href,
    title: document.title,
    focusedText: focusedElementContext,
    bodySnippet: document.body.innerText.substring(0, 800)
  };
}

function processCommand(text) {
  showStatus("Processing Intent globally...");
  
  const context = getPageContext();
  const focusedNode = document.activeElement; // Capture node before async await loses focus

  chrome.runtime.sendMessage({ type: "RUN_NEUROFLOW", input: text, context }, (response) => {
    if (response && response.success) {
      showStatus("Executing action...", 2000);
      executeActions(response.data.actions || [], focusedNode);
      document.getElementById("nf-input").value = "";
    } else {
      showStatus("Engine Error/Timeout.", 3000);
      console.error(response);
    }
  });
}

function executeActions(actions, focusedNode) {
  actions.forEach(action => {
    if (action.type === "stream" && action.message) {
      
       // JARVIS VOICE SYNTHESIS
       speakResponse(action.message);

       // Wispr Flow Magic: Ghost Type directly into the active element!
       if (focusedNode && (focusedNode.isContentEditable || focusedNode.tagName === "TEXTAREA" || focusedNode.tagName === "INPUT")) {
           simulateTyping(focusedNode, action.message);
       } else {
           // Fallback to clipboard if no input is actively focused
           navigator.clipboard.writeText(action.message);
           showStatus("Copied response to clipboard!", 3500);
       }
    }
    // Handle fallback UI clicks (e.g. executing plan clicks)
    else if (action.type === "fill" && action.selector) {
      const el = document.querySelector(action.selector);
      if (el) simulateTyping(el, action.value);
    } else if (action.type === "click" && action.selector) {
      const el = document.querySelector(action.selector);
      if (el) el.click();
    }
  });
}

function speakResponse(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any ongoing speech
    
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Select a premium sounding voice if available
    const voices = window.speechSynthesis.getVoices();
    // Try to find natural English voices ("Daniel", "Samantha", "Google UK English Male", etc.)
    const preferredVoice = voices.find(v => 
        v.name.includes("Google UK English Male") || 
        v.name.includes("Google US English") || 
        v.name.includes("Samantha") || 
        v.name.includes("Daniel")
    ) || voices[0];
    
    if (preferredVoice) {
        utterance.voice = preferredVoice;
    }
    
    utterance.rate = 1.05; // Slightly faster for a sharp assistant feel
    utterance.pitch = 0.95; // Slightly lower pitch for composure
    
    window.speechSynthesis.speak(utterance);
  }
}

function simulateTyping(element, text) {
   element.focus();
   
   // A simplistic ghost typing approach. Real typing needs char by char, but innerText injection works for most contentEditables.
   if (element.tagName === "TEXTAREA" || (element.tagName === "INPUT" && element.type === "text")) {
       element.value = text;
   } else if (element.isContentEditable) {
       element.innerText = text;
   }
   
   // Dispatch events to trigger JS frameworks (React/Vue/Angular) into recognizing the manual DOM modification
   element.dispatchEvent(new Event('input', { bubbles: true }));
   element.dispatchEvent(new Event('change', { bubbles: true }));
   
   showStatus("Text injected by NeuroFlow.", 3000);
}

// Inject robustly across SPA transitions
if (document.readyState === "complete" || document.readyState === "interactive") {
    injectFloatingUI();
} else {
    document.addEventListener("DOMContentLoaded", injectFloatingUI);
}

// Ensure injection handles dynamically shifting SPAs (like Gmail/LinkedIn)
const observer = new MutationObserver(() => {
    if (!document.getElementById("nf-root-container")) {
        injectFloatingUI();
    }
});
observer.observe(document.body, { childList: true, subtree: false });

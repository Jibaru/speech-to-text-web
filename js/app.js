import { SpeechRecognitionWrapper } from "./speech-recognition.js";
import { LISTENING_STATE, READY_STATE } from "./state.js";
import { Store } from "./store.js";

/** @var {HTMLElement} outputElement */
const outputElement = document.getElementById("output");
/** @var {HTMLElement} statusElement */
const statusElement = document.getElementById("status");
/** @var {HTMLElement} startButton*/
const startButton = document.getElementById("start-btn");
/** @var {HTMLElement} stopButton */
const stopButton = document.getElementById("stop-btn");
/** @var {HTMLElement} saveButton */
const saveButton = document.getElementById("save-btn");
/** @var {HTMLElement} clearButton */
const clearButton = document.getElementById("clear-btn");
/** @var {HTMLElement} pastTextsList */
const pastTextsList = document.getElementById("past-texts");

/** @var {SpeechRecognitionWrapper} recognition */
let recognition = null;
/** @var {string} state */
let state = READY_STATE;
/** @var {Store} store */
const store = new Store();

function startRecognition() {
  if (state === LISTENING_STATE) return;

  try {
    recognition = new SpeechRecognitionWrapper({
      lang: "en-US",
      continuous: true,
      interimResults: true,
    });
  } catch (error) {
    alert(error.message);
    return;
  }

  recognition.onstart = () => {
    state = LISTENING_STATE;
    renderState();
  };

  recognition.onresult = (event) => {
    outputElement.textContent = mapTranscriptionEvent(event);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    if (event.error === "no-speech" || event.error === "aborted") {
      restartRecognition();
    }
  };

  recognition.onend = () => {
    if (state === LISTENING_STATE) {
      restartRecognition();
    }
  };

  recognition.start();
}

/**
 *
 * @param {any} event
 * @returns {string}
 */
function mapTranscriptionEvent(event) {
  let interimTranscript = "";
  for (const result of event.results) {
    interimTranscript += result[0].transcript;
  }
  return interimTranscript;
}

function stopRecognition() {
  if (recognition) {
    state = READY_STATE;
    recognition.stop();
  }
}

function restartRecognition() {
  if (state === LISTENING_STATE) {
    recognition.start();
  }
}

function renderPastTexts() {
  pastTextsList.innerHTML = "";
  store.get().forEach((text) => {
    const li = document.createElement("li");
    li.textContent = text;
    pastTextsList.appendChild(li);
  });
}

function renderState() {
  statusElement.textContent = state;
}

startButton.addEventListener("click", () => {
  startRecognition();
});

stopButton.addEventListener("click", () => {
  stopRecognition();
  renderState();
});

saveButton.addEventListener("click", () => {
  const content = outputElement.textContent.trim();

  if (content === "") {
    return;
  }

  store.save(content);
  outputElement.textContent = "";
  renderPastTexts();
});

clearButton.addEventListener("click", () => {
  store.clear();
  pastTextsList.innerHTML = "";
});

document.addEventListener("DOMContentLoaded", () => {
  renderState();
  renderPastTexts();
  outputElement.textContent = "";
});

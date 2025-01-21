/**
 * @class SpeechRecognitionWrapper
 * @description A wrapper for the Web Speech API's SpeechRecognition interface, with graceful fallback for unsupported browsers.
 */
export class SpeechRecognitionWrapper {
  /**
   * @constructor
   * @param {Object} [options={}] Configuration options.
   * @param {string} [options.lang="en-US"] The language to recognize.
   * @param {boolean} [options.continuous=true] Whether recognition continues without stopping.
   * @param {boolean} [options.interimResults=true] Whether to return interim results.
   */
  constructor(options = {}) {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      throw new Error(
        "Speech Recognition API is not supported in this browser."
      );
    }

    this.recognition = new SpeechRecognition();
    this.recognition.lang = options.lang || "en-US";
    this.recognition.continuous = options.continuous ?? true;
    this.recognition.interimResults = options.interimResults ?? true;

    // native API events to wrapper instance events
    this.recognition.onstart = (event) => this.onstart?.(event);
    this.recognition.onresult = (event) => this.onresult?.(event);
    this.recognition.onerror = (event) => this.onerror?.(event);
    this.recognition.onend = (event) => this.onend?.(event);
    this.recognition.onaudiostart = (event) => this.onaudiostart?.(event);
    this.recognition.onsoundstart = (event) => this.onsoundstart?.(event);
    this.recognition.onspeechstart = (event) => this.onspeechstart?.(event);
    this.recognition.onspeechend = (event) => this.onspeechend?.(event);
    this.recognition.onsoundend = (event) => this.onsoundend?.(event);
    this.recognition.onaudioend = (event) => this.onaudioend?.(event);
    this.recognition.onnomatch = (event) => this.onnomatch?.(event);

    this.isListening = false; // State flag
    this.lang = options.lang || "en-US"; // Language
  }

  /**
   * Starts the speech recognition service.
   */
  start() {
    if (this.isListening) {
      console.warn("Speech recognition is already running.");
      return;
    }
    this.isListening = true;
    this.recognition.start();
  }

  /**
   * Stops the speech recognition service after finalizing the current recognition session.
   */
  stop() {
    if (!this.isListening) {
      console.warn("Speech recognition is not running.");
      return;
    }
    this.isListening = false;
    this.recognition.stop();
  }

  /**
   * Aborts the speech recognition service immediately without finalizing results.
   */
  abort() {
    if (!this.isListening) {
      console.warn("Speech recognition is not running.");
      return;
    }
    this.isListening = false;
    this.recognition.abort();
  }

  /**
   * Sets the language for speech recognition.
   * @param {string} language The BCP 47 language tag to use (e.g., "en-US").
   */
  setLanguage(language) {
    this.recognition.lang = language;
    this.lang = language;
    console.log(`Language set to: ${language}`);
  }
}

/**
 * SpeechRecognition Event Handlers (Adapted for compatibility).
 * These properties can be overwritten by the user to handle events.
 */

/** @type {Function} Called when recognition starts. */
SpeechRecognitionWrapper.prototype.onstart = null;

/** @type {Function} Called when speech is detected and results are returned. */
SpeechRecognitionWrapper.prototype.onresult = null;

/** @type {Function} Called when there is a recognition error. */
SpeechRecognitionWrapper.prototype.onerror = null;

/** @type {Function} Called when recognition ends. */
SpeechRecognitionWrapper.prototype.onend = null;

/** @type {Function} Called when the audio starts being captured. */
SpeechRecognitionWrapper.prototype.onaudiostart = null;

/** @type {Function} Called when sound starts being detected. */
SpeechRecognitionWrapper.prototype.onsoundstart = null;

/** @type {Function} Called when speech starts being detected. */
SpeechRecognitionWrapper.prototype.onspeechstart = null;

/** @type {Function} Called when speech ends being detected. */
SpeechRecognitionWrapper.prototype.onspeechend = null;

/** @type {Function} Called when sound ends being detected. */
SpeechRecognitionWrapper.prototype.onsoundend = null;

/** @type {Function} Called when audio ends being captured. */
SpeechRecognitionWrapper.prototype.onaudioend = null;

/** @type {Function} Called when no recognition match is found. */
SpeechRecognitionWrapper.prototype.onnomatch = null;


"use strict";


const textarea = document.querySelector("#note-text");
const charCount = document.querySelector("#char-count");
const wordCount = document.querySelector("#word-count");
const clearBtn = document.querySelector("#clear-btn");
const themeToggle = document.querySelector("#theme-toggle");

// Storage keys
const DRAFT_KEY = "quicknotes-draft";
const THEME_KEY = "quicknotes-theme";

//Update character and word counters
function updateCounts() {
  const text = textarea.value;
  const characters = text.length;
  const trimmedText = text.trim();

  const words = trimmedText === ""
    ? 0
    : trimmedText.split(/\s+/).length;

  charCount.textContent = `${characters} / 200 characters`;
  wordCount.textContent = `${words} words`;

  // Reset counter styles before applying the correct one
  charCount.classList.remove("warning", "over");

  if (characters > 200) {
    charCount.classList.add("over");
  } else if (characters > 180) {
    charCount.classList.add("warning");
  }
}

//Save the draft
function saveDraft() {
  localStorage.setItem(DRAFT_KEY, textarea.value);
}

//Restore the draft
function loadDraft() {
  const savedDraft = localStorage.getItem(DRAFT_KEY);

  if (savedDraft !== null) {
    textarea.value = savedDraft;
  }

  updateCounts();
}

//Clear the text and saved draft
function clearDraft() {
  textarea.value = "";

  // Remove the saved draft from localStorage
  localStorage.removeItem(DRAFT_KEY);

  // Reset the counters
  updateCounts();

  // Return the cursor to the textarea
  textarea.focus();
}

// Listen for typing
textarea.addEventListener("input", () => {
  updateCounts();
  saveDraft();
});

//Clear button
clearBtn.addEventListener("click", clearDraft);

//Escape key clears the draft
textarea.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    clearDraft();
  }
});

//Apply and remember the theme
function applyTheme(isDark) {
  document.body.classList.toggle("dark", isDark);

  themeToggle.textContent = isDark ? "Light mode" : "Dark mode";
}

function loadTheme() {
  const savedTheme = localStorage.getItem(THEME_KEY);

  applyTheme(savedTheme === "dark");
}

themeToggle.addEventListener("click", () => {
  const isDark = !document.body.classList.contains("dark");

  applyTheme(isDark);

  // Remember the user's theme choice
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
});

// Initialise the page by calling the functions
loadDraft();
loadTheme();


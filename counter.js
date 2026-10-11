// Task 1: Character Counter

const MAX_CHARACTERS = 280;
const WARNING_START = 261; // within 20 characters of the limit (261-280)

const form = document.querySelector("#tweet-form");
const textarea = document.querySelector("#tweet");
const counter = document.querySelector("#counter");
const submitButton = document.querySelector("#submit");
const message = document.querySelector("#message");

// Work out which state the textarea is in: "ok", "warning" or "over"
function getState(count) {
  if (count > MAX_CHARACTERS) return "over";
  if (count >= WARNING_START) return "warning";
  return "ok";
}

function updateCounter() {
  const count = textarea.value.length;
  const state = getState(count);

  counter.textContent = count + "/" + MAX_CHARACTERS + " characters";

  // styles.css colours the counter and the textarea border from data-state
  counter.dataset.state = state;
  textarea.dataset.state = state;

  // Can't post an empty message or one that is over the limit
  submitButton.disabled = count === 0 || count > MAX_CHARACTERS;

  message.hidden = true;
}

// Runs on every keystroke, paste, cut and delete
textarea.addEventListener("input", updateCounter);

form.addEventListener("submit", function (event) {
  event.preventDefault(); // stay on the page

  if (textarea.value.length > MAX_CHARACTERS) return; // safety check

  textarea.value = "";
  updateCounter();
  message.textContent = "Posted!";
  message.hidden = false;
});

updateCounter();

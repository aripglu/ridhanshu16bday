/* ================================================================
   BIRTHDAY WORLD — EASY EDIT GUIDE
   1. Your words live in index.html (search for "EDIT:").
   2. Your colours and fonts live at the very top of styles.css.
   3. The birthday date is directly below. Months start at 0 in JS,
      so January is 0. The current date is 26 January 2027 at midnight.
   ================================================================ */
const birthday = new Date(2027, 0, 26, 0, 0, 0);

const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

// ================================================================
// LOGIN EDIT: Change the two values below to update access details.
// This front-end gate is for a personal surprise, not sensitive data.
// ================================================================
const entryCredentials = {
  username: "RIDHANSHU",
  password: "26012011"
};

const loginForm = $("#loginForm");
const loginCard = $(".login-card");
const loginError = $("#loginError");
const usernameInput = $("#gateUsername");
const passwordInput = $("#gatePassword");

$("#passwordToggle").addEventListener("click", event => {
  const showing = passwordInput.type === "text";
  passwordInput.type = showing ? "password" : "text";
  event.currentTarget.textContent = showing ? "SHOW" : "HIDE";
  event.currentTarget.setAttribute("aria-label", showing ? "Show password" : "Hide password");
});

loginForm.addEventListener("submit", event => {
  event.preventDefault();
  const usernameMatches = usernameInput.value.trim() === entryCredentials.username;
  const passwordMatches = passwordInput.value === entryCredentials.password;

  if (!usernameMatches || !passwordMatches) {
    loginError.textContent = "That combo didn't match. Check the hint and try again.";
    loginCard.classList.remove("shake");
    void loginCard.offsetWidth;
    loginCard.classList.add("shake");
    (usernameMatches ? passwordInput : usernameInput).focus();
    return;
  }

  loginError.textContent = "";
  $("#loginPage").hidden = true;
  $("#disclaimerPage").hidden = false;
  $("#acceptDisclaimer").focus();
});

$("#acceptDisclaimer").addEventListener("click", () => {
  const gate = $("#entryGate");
  const siteContent = $("#siteContent");
  gate.classList.add("is-leaving");
  document.body.classList.remove("gate-active");
  siteContent.removeAttribute("inert");
  siteContent.setAttribute("aria-hidden", "false");
  setTimeout(() => {
    gate.hidden = true;
    $("[data-story-next]", $(".story-page.is-active"))?.focus();
  }, 560);
});

// Click-through story: pages unlock in order and cannot be skipped.
const storyPages = $$("[data-story-page]");
const storyLabels = ["HOME", "QUEST 01", "QUEST 02", "FINAL QUEST", "FINALE"];
let currentStoryPage = 0;

function showStoryPage(index) {
  if (index < 0 || index >= storyPages.length) return;
  storyPages.forEach((page, pageIndex) => {
    const isCurrent = pageIndex === index;
    page.hidden = !isCurrent;
    page.classList.toggle("is-active", isCurrent);
    page.setAttribute("aria-hidden", String(!isCurrent));
    if (isCurrent) page.removeAttribute("inert");
    else page.setAttribute("inert", "");
  });
  currentStoryPage = index;
  $("#pageLabel").textContent = storyLabels[index];
  $("#pageCount").textContent = `${String(index + 1).padStart(2, "0")} / ${String(storyPages.length).padStart(2, "0")}`;
  document.body.classList.toggle("story-finished", index === storyPages.length - 1);
  window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  $$(".reveal", storyPages[index]).forEach(element => element.classList.add("visible"));
  const heading = $("h1, h2", storyPages[index]);
  heading?.setAttribute("tabindex", "-1");
  heading?.focus({ preventScroll: true });
}

$$('[data-story-next]').forEach(button => button.addEventListener("click", () => showStoryPage(currentStoryPage + 1)));
$$('[data-story-back]').forEach(button => button.addEventListener("click", () => showStoryPage(currentStoryPage - 1)));
$("[data-story-home]").addEventListener("click", () => showStoryPage(0));

function updateCountdown() {
  const difference = Math.max(0, birthday - new Date());
  const values = {
    days: Math.floor(difference / 86400000),
    hours: Math.floor(difference / 3600000) % 24,
    minutes: Math.floor(difference / 60000) % 60,
    seconds: Math.floor(difference / 1000) % 60
  };
  Object.entries(values).forEach(([id, value]) => {
    $(`#${id}`).textContent = String(value).padStart(id === "days" ? 3 : 2, "0");
  });
}
updateCountdown();
setInterval(updateCountdown, 1000);

// Popup system: any button with data-popup="popupId" opens that popup.
let lastFocusedElement;
function openModal(modal) {
  if (!modal) return;
  lastFocusedElement = document.activeElement;
  modal.hidden = false;
  document.body.style.overflow = "hidden";
  $(".modal-close", modal)?.focus();
}
function closeModal(modal) {
  modal.hidden = true;
  document.body.style.overflow = "";
  lastFocusedElement?.focus();
}
$$('[data-popup]').forEach(button => button.addEventListener("click", () => openModal($(`#${button.dataset.popup}`))));
$$('.modal').forEach(modal => {
  $$('.modal-close, .modal-ok', modal).forEach(button => button.addEventListener("click", () => closeModal(modal)));
  modal.addEventListener("click", event => { if (event.target === modal) closeModal(modal); });
});
document.addEventListener("keydown", event => {
  if (event.key === "Escape") { const open = $(".modal:not([hidden])"); if (open) closeModal(open); }
});

// The 16 note buttons read their message from data-note="" in index.html.
const openedNotes = new Set();
$$('.note-block').forEach(button => button.addEventListener("click", () => {
  openedNotes.add(button.dataset.number);
  button.classList.add("opened");
  $("#noteNumber").textContent = button.dataset.number;
  $("#noteText").textContent = button.dataset.note.trim() || "YOUR NOTE GOES HERE";
  $("#noteProgress").textContent = `${openedNotes.size} / 16 opened`;
  openModal($("#notePopup"));
}));

// Scroll-in animation.
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add("visible"); });
}, { threshold: 0.12 });
$$('.reveal').forEach(element => observer.observe(element));

// Falling petals are lightweight DOM elements that remove themselves.
function makePetal() {
  if (document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const petal = document.createElement("i");
  petal.className = "petal";
  petal.style.left = `${Math.random() * 100}%`;
  petal.style.setProperty("--drift", `${Math.random() * 180 - 90}px`);
  petal.style.animationDuration = `${7 + Math.random() * 6}s`;
  petal.style.opacity = .45 + Math.random() * .45;
  $("#petalLayer").appendChild(petal);
  setTimeout(() => petal.remove(), 13000);
}
setInterval(makePetal, 680);

// Celebration burst.
$("#celebrateButton").addEventListener("click", () => {
  const colours = ["#ff9fbd", "#ffe77d", "#abe8cf", "#afdff2", "#c9baf4"];
  for (let i = 0; i < 70; i++) {
    const piece = document.createElement("i");
    piece.className = "confetti";
    piece.style.left = `${Math.random() * 100}%`;
    piece.style.background = colours[i % colours.length];
    piece.style.setProperty("--drift", `${Math.random() * 400 - 200}px`);
    piece.style.animationDuration = `${2.4 + Math.random() * 2}s`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 4500);
  }
  $("#toast").classList.add("show");
  setTimeout(() => $("#toast").classList.remove("show"), 2400);
});

// Tiny original browser-made party tones: no music file or autoplay needed.
let audioContext;
$("#soundButton").addEventListener("click", () => {
  audioContext ||= new (window.AudioContext || window.webkitAudioContext)();
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((frequency, index) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "triangle";
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(.08, audioContext.currentTime + index * .12);
    gain.gain.exponentialRampToValueAtTime(.001, audioContext.currentTime + index * .12 + .25);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(audioContext.currentTime + index * .12);
    oscillator.stop(audioContext.currentTime + index * .12 + .26);
  });
  $("#soundButton").setAttribute("aria-pressed", "true");
  $("#soundLabel").textContent = "party sounds: played";
});

// Make the image-card keyboard accessible.
$$('[role="button"][data-popup]').forEach(card => card.addEventListener("keydown", event => {
  if (event.key === "Enter" || event.key === " ") { event.preventDefault(); card.click(); }
}));

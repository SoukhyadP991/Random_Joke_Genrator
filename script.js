// Select DOM elements
const getJokeBtn = document.getElementById('get-joke');
const saveFavoriteBtn = document.getElementById('save-favorite');
const setupEl = document.getElementById('setup');
const punchlineEl = document.getElementById('punchline');
const favoritesContainer = document.getElementById('favorites-container');
const themeToggle = document.getElementById('theme-toggle');

let currentJoke = null;
let favorites = [];

// Placeholder jokes for roulette animation with Indian context
const placeholderJokes = [
  { setup: "Why did the chaiwala become a software engineer?", punchline: "Because he loved to debug!" },
  { setup: "Why don't Indian programmers ever get lost?", punchline: "Because they always follow the 'path'!" },
  { setup: "Why did the cricket team go to the bank?", punchline: "To get their wickets!" },
  { setup: "Why did the student bring a ladder to school?", punchline: "Because he wanted to go to high school!" },
  { setup: "Why did the dosa go to therapy?", punchline: "Because it felt a little flat!" }
];

// Fetch a random joke from Official Joke API
async function fetchJoke() {
  try {
    // Start roulette animation
    await rouletteAnimation();

    const response = await fetch('https://official-joke-api.appspot.com/random_joke');
    if (!response.ok) throw new Error('Network response was not ok');
    const joke = await response.json();
    currentJoke = joke;
    displayJoke(joke);
  } catch (error) {
    setupEl.textContent = 'Failed to fetch joke. Please try again.';
    punchlineEl.textContent = '';
    currentJoke = null;
  }
}

// Display joke in the DOM
function displayJoke(joke) {
  setupEl.textContent = joke.setup;
  punchlineEl.textContent = joke.punchline;
  // Add fade-in effect
  const jokeContainer = document.getElementById('joke-container');
  jokeContainer.classList.remove('fade-in');
  void jokeContainer.offsetWidth; // trigger reflow
  jokeContainer.classList.add('fade-in');
}

// Roulette animation cycling through placeholder jokes
function rouletteAnimation() {
  return new Promise((resolve) => {
    let count = 0;
    const maxCycles = 15; // number of cycles
    const intervalTime = 80; // ms per cycle

    const interval = setInterval(() => {
      const joke = placeholderJokes[count % placeholderJokes.length];
      setupEl.textContent = joke.setup;
      punchlineEl.textContent = joke.punchline;
      count++;
      if (count >= maxCycles) {
        clearInterval(interval);
        resolve();
      }
    }, intervalTime);
  });
}

// Save current joke to favorites in localStorage
function saveFavorite() {
  if (!currentJoke) return;
  // Check if joke already saved
  if (favorites.some(j => j.id === currentJoke.id)) {
    alert('This joke is already in your favorites!');
    return;
  }
  favorites.push(currentJoke);
  localStorage.setItem('favoriteJokes', JSON.stringify(favorites));
  renderFavorites();
}

// Render favorite jokes in the favorites container
function renderFavorites() {
  favoritesContainer.innerHTML = '';
  if (favorites.length === 0) {
    favoritesContainer.textContent = 'No favorite jokes saved yet.';
    return;
  }
  favorites.forEach(joke => {
    const jokeEl = document.createElement('div');
    jokeEl.classList.add('favorite-joke');
    jokeEl.innerHTML = `<strong>${joke.setup}</strong><br><em>${joke.punchline}</em>`;
    favoritesContainer.appendChild(jokeEl);
  });
}

// Load favorites from localStorage on page load
function loadFavorites() {
  const saved = localStorage.getItem('favoriteJokes');
  if (saved) {
    favorites = JSON.parse(saved);
  }
  renderFavorites();
}

// Toggle light/dark theme
function toggleTheme() {
  if (themeToggle.checked) {
    document.body.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.body.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
}

// Load theme preference on page load
function loadTheme() {
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    themeToggle.checked = true;
    document.body.classList.add('dark');
  } else {
    themeToggle.checked = false;
    document.body.classList.remove('dark');
  }
}

// Event listeners
getJokeBtn.addEventListener('click', fetchJoke);
saveFavoriteBtn.addEventListener('click', saveFavorite);
themeToggle.addEventListener('change', toggleTheme);

// Initialize app
loadFavorites();
loadTheme();

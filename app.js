/* Dynasty League Manager - app.js
   Author: Auto-generated by ChatGPT – Free to use and modify
   ---------------------------------------------------------------------
   This file contains a *client-only* implementation of the dynasty
   manager. All data is stored in browser localStorage so it requires
   no backend.

   ⚠️  This is meant as a quick-start template, not a production-grade
   secure system. Replace the in-memory auth with Google OAuth or
   Firebase before using with sensitive data.
*/

// --------------------------------------------------
// CONFIGURATION  ⚙️  – EDIT THIS SECTION PER LEAGUE
// --------------------------------------------------
const CONFIG = {
  leagueName: "College Football 26 Dynasty",
  commissionerEmail: "cedbrobin@yahoo.com", // change per league
  weekDeadlineHours: 168,                   // = 7 days
  demoAccounts: [
    { email: "cedbrobin@yahoo.com", role: "Commissioner", name: "Commissioner" },
    { email: "POTUS214@example.com", role: "TeamOwner", name: "POTUS214" }
  ]
};

// --------------------------------------------------
// TEAM MASTER LIST (FBS small sample – extend as needed)
// Full 134-team file available in teams.js if you split files
// --------------------------------------------------
const TEAMS = [
  { school: "Alabama", nickname: "Crimson Tide", mascot: "Big Al", primary: "#A60C31", secondary: "#FFFFFF" },
  { school: "Georgia", nickname: "Bulldogs", mascot: "Uga", primary: "#BA0C2F", secondary: "#000000" },
  { school: "Texas", nickname: "Longhorns", mascot: "Bevo", primary: "#BF5700", secondary: "#FFFFFF" },
  { school: "Michigan", nickname: "Wolverines", mascot: "Biff", primary: "#00274C", secondary: "#FFCB05" },
  { school: "Ohio State", nickname: "Buckeyes", mascot: "Brutus", primary: "#BB0000", secondary: "#666666" }
];

//---------------------------------------------------
// UTILITIES
//---------------------------------------------------
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));
const sleep = ms => new Promise(r => setTimeout(r, ms));

function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key, def) { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }

//---------------------------------------------------
// STATE  (loaded from localStorage)
//---------------------------------------------------
let state = load("dynasty-state", {
  users: [...CONFIG.demoAccounts],
  week: 1,
  deadline: Date.now() + CONFIG.weekDeadlineHours * 3600 * 1000,
  games: [
    { id: 1, week: 1, team1: "Alabama", team2: "Georgia", played: false },
    { id: 2, week: 1, team1: "Texas", team2: "Michigan", played: false }
  ],
  votes: []
});

// Persist regularly
setInterval(() => save("dynasty-state", state), 1500);

//---------------------------------------------------
// AUTHENTICATION (very basic – replace for production)
//---------------------------------------------------
let currentUser = null;

function login(email) {
  currentUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!currentUser) {
    alert("Email not recognised. Please ask the commissioner to add you.");
    return;
  }
  initApp();
}

function logout() {
  currentUser = null;
  qs('#dashboard').classList.add('hidden');
  qs('#login-screen').classList.remove('hidden');
}

//---------------------------------------------------
// INITIALISE UI AFTER LOGIN
//---------------------------------------------------
function initApp() {
  qs('#login-screen').classList.add('hidden');
  qs('#dashboard').classList.remove('hidden');
  qs('#user-name').textContent = currentUser.name || currentUser.email;
  qs('#current-week').textContent = `Week ${state.week}`;
  renderDeadline();
  if (isCommissioner()) {
    qs('#commissioner-actions').style.display = 'flex';
    qs('#create-vote-btn').style.display = 'inline-block';
    qs('#add-user-btn').style.display = 'inline-block';
  }
  buildTeamSelects();
  renderGames();
  renderSchedule();
  renderVotes();
  renderUsers();
  startCountdown();
}

function isCommissioner() { return currentUser.role === 'Commissioner'; }

//---------------------------------------------------
// DEADLINE COUNTDOWN
//---------------------------------------------------
function renderDeadline() {
  const diff = state.deadline - Date.now();
  const days = Math.max(0, Math.floor(diff / 86400000));
  const hrs = Math.max(0, Math.floor((diff % 86400000) / 3600000));
  const mins = Math.max(0, Math.floor((diff % 3600000) / 60000));
  qs('#deadline-countdown').textContent = `${days}d ${hrs}h ${mins}m`;
}

function startCountdown() { setInterval(renderDeadline, 60000); }

//---------------------------------------------------
// GAMES RENDERING & ACTIONS
//---------------------------------------------------
function renderGames() {
  const container = qs('#games-list');
  container.innerHTML = '';
  state.games.filter(g => g.week === state.week).forEach(game => {
    const t1 = TEAMS.find(t => t.school === game.team1);
    const t2 = TEAMS.find(t => t.school === game.team2);
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <div class="game-header">
        <span class="game-week">Week ${game.week}</span>
        <span class="game-status ${game.played ? 'status-played' : 'status-not-played'}">${game.played ? 'Played' : 'Not Played'}</span>
      </div>
      <div class="team-matchup">
        <div class="team"><span class="team-name">${game.team1}</span><div class="team-colors" style="background:${t1.primary}"></div></div>
        <span class="vs">vs</span>
        <div class="team"><span class="team-name">${game.team2}</span><div class="team-colors" style="background:${t2.primary}"></div></div>
      </div>
      <div class="game-deadline">Deadline: ${new Date(state.deadline).toLocaleString()}</div>
    `;
    card.onclick = () => openGameModal(game.id);
    container.appendChild(card);
  });
}

function openGameModal(gameId) {
  const modal = qs('#game-modal');
  const game = state.games.find(g => g.id === gameId);
  const t1 = TEAMS.find(t => t.school === game.team1);
  const t2 = TEAMS.find(t => t.school === game.team2);
  qs('#modal-team1').textContent = game.team1;
  qs('#modal-team2').textContent = game.team2;
  modal.classList.add('active');
  // Set handlers
  qs('#mark-played-btn').onclick = () => { game.played = true; renderGames(); closeModal(modal); };
  qs('#mark-not-played-btn').onclick = () => { game.played = false; renderGames(); closeModal(modal); };
  qs('#submit-score-btn').onclick = () => {
    game.score1 = parseInt(qs('#team1-score').value, 10);
    game.score2 = parseInt(qs('#team2-score').value, 10);
    game.played = true;
    renderGames();
    closeModal(modal);
  };
}

//---------------------------------------------------
// SCHEDULE
//---------------------------------------------------
function renderSchedule() {
  const list = qs('#schedule-list');
  list.innerHTML = '';
  const entries = load('schedule-'+currentUser.email, []);
  entries.forEach((e, idx) => {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    item.innerHTML = `
      <div class="schedule-info">
        <div class="schedule-date">${new Date(e.date).toLocaleString()}</div>
        <div class="schedule-opponent">vs ${e.opponent}</div>
      </div>
      <div class="schedule-actions"><button class="btn-secondary">Remove</button></div>
    `;
    item.querySelector('button').onclick = () => { entries.splice(idx,1); save('schedule-'+currentUser.email, entries); renderSchedule(); };
    list.appendChild(item);
  });
}

//---------------------------------------------------
// TEAM SELECTS
//---------------------------------------------------
function buildTeamSelects() {
  qsa('#new-user-team, #schedule-opponent').forEach(sel => {
    sel.innerHTML = '<option value="">Select...</option>';
    TEAMS.forEach(t => {
      const opt = document.createElement('option');
      opt.value = t.school;
      opt.textContent = `${t.school} ${t.nickname}`;
      sel.appendChild(opt);
    });
  });
}

//---------------------------------------------------
// USERS
//---------------------------------------------------
function renderUsers() {
  const list = qs('#users-list');
  list.innerHTML = '';
  state.users.forEach(u => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="user-info">
        <div class="user-name">${u.name || u.email}</div>
        <div class="user-email">${u.email}</div>
      </div>
      <div class="user-role">${u.role}</div>
    `;
    list.appendChild(card);
  });
}

//---------------------------------------------------
// EVENTS & INIT
//---------------------------------------------------
window.addEventListener('DOMContentLoaded', () => {
  // Login events
  qs('#login-btn').onclick = () => login(qs('#email-input').value);
  qsa('.demo-btn').forEach(btn => btn.onclick = () => login(btn.dataset.email));
  qs('#logout-btn').onclick = logout;

  // Tab navigation
  qsa('.tab-btn').forEach(btn => btn.onclick = () => {
    qsa('.tab-btn').forEach(b => b.classList.remove('active'));
    qsa('.tab-content').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    qs(`#${btn.dataset.tab}-tab`).classList.add('active');
  });

  // Modal close buttons
  qsa('.modal .close-btn').forEach(btn => btn.onclick = () => btn.closest('.modal').classList.remove('active'));

  // Add schedule entry
  qs('#add-schedule-btn').onclick = () => qs('#schedule-modal').classList.add('active');
  qs('#schedule-form').onsubmit = e => {
    e.preventDefault();
    const entries = load('schedule-'+currentUser.email, []);
    entries.push({ opponent: qs('#schedule-opponent').value, date: qs('#schedule-date').value, notes: qs('#schedule-notes').value });
    save('schedule-'+currentUser.email, entries);
    renderSchedule();
    closeModal(qs('#schedule-modal'));
  };

  // Add user (commissioner)
  qs('#add-user-form').onsubmit = e => {
    e.preventDefault();
    const u = {
      email: qs('#new-user-email').value.trim(),
      name: qs('#new-user-name').value.trim(),
      team: qs('#new-user-team').value,
      role: qs('#new-user-role').value
    };
    state.users.push(u);
    renderUsers();
    closeModal(qs('#add-user-modal'));
  };

  // Create vote
  qs('#create-vote-form').onsubmit = e => {
    e.preventDefault();
    const vote = {
      id: Date.now(),
      type: qs('#vote-type').value,
      title: qs('#vote-title').value,
      desc: qs('#vote-description').value,
      deadline: qs('#vote-deadline').value,
      yes: 0,
      no: 0,
      voters: []
    };
    state.votes.push(vote);
    renderVotes();
    closeModal(qs('#create-vote-modal'));
  };

  // Add user / vote buttons show for commissioners
  if (isCommissioner()) {
    qs('#users-tab').style.display = 'inline-block';
  }
});

function renderVotes() {
  const list = qs('#votes-list');
  list.innerHTML = '';
  state.votes.forEach(v => {
    const card = document.createElement('div');
    card.className = 'vote-card';
    card.innerHTML = `
      <div class="vote-header">
        <div class="vote-title">${v.title}</div>
        <div class="vote-type">${v.type}</div>
      </div>
      <div class="vote-description">${v.desc}</div>
      <div class="vote-stats">
        <div class="vote-count"><strong>${v.yes}</strong> Yes</div>
        <div class="vote-count"><strong>${v.no}</strong> No</div>
      </div>
      <div class="vote-actions">
        <button class="vote-btn vote-yes">Vote Yes</button>
        <button class="vote-btn vote-no">Vote No</button>
      </div>
    `;
    const [yesBtn, noBtn] = card.querySelectorAll('.vote-btn');
    yesBtn.onclick = () => castVote(v, true);
    noBtn.onclick = () => castVote(v, false);
    list.appendChild(card);
  });
}

function castVote(vote, yes) {
  if (vote.voters.includes(currentUser.email)) return alert('You already voted');
  vote.voters.push(currentUser.email);
  yes ? vote.yes++ : vote.no++;
  renderVotes();
}

function closeModal(modal) { modal.classList.remove('active'); }

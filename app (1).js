// College Football Dynasty Manager - Main Application
// Complete FBS team management system with authentication, voting, and game tracking

// Configuration
const CONFIG = {
  leagueName: "College Football Dynasty Manager",
  commissionerEmail: "cedbrobin@yahoo.com",
  weekDeadlineHours: 168, // 7 days
  demoAccounts: [
    { email: "cedbrobin@yahoo.com", role: "Commissioner", name: "Commissioner" },
    { email: "POTUS214@example.com", role: "Team Owner", name: "POTUS214" }
  ]
};

// Complete FBS Teams Database from provided data
const FBS_TEAMS = [
  {"school": "Alabama", "nickname": "Crimson Tide", "mascot": "Big Al", "primary": "#A60C31", "secondary": "#FFFFFF"},
  {"school": "Arizona", "nickname": "Wildcats", "mascot": "Wilbur", "primary": "#003366", "secondary": "#CC0033"},
  {"school": "Arizona State", "nickname": "Sun Devils", "mascot": "Sparky", "primary": "#8C1D40", "secondary": "#FFC627"},
  {"school": "Arkansas", "nickname": "Razorbacks", "mascot": "Tusk", "primary": "#9D2235", "secondary": "#FFFFFF"},
  {"school": "Auburn", "nickname": "Tigers", "mascot": "Aubie", "primary": "#0C2340", "secondary": "#FF6600"},
  {"school": "Baylor", "nickname": "Bears", "mascot": "Bruiser", "primary": "#003015", "secondary": "#FFB81C"},
  {"school": "Boston College", "nickname": "Eagles", "mascot": "Baldwin", "primary": "#8B0000", "secondary": "#FFD700"},
  {"school": "Clemson", "nickname": "Tigers", "mascot": "The Tiger", "primary": "#FF6600", "secondary": "#663399"},
  {"school": "Duke", "nickname": "Blue Devils", "mascot": "Blue Devil", "primary": "#003087", "secondary": "#FFFFFF"},
  {"school": "Florida", "nickname": "Gators", "mascot": "Albert", "primary": "#FF6600", "secondary": "#003366"},
  {"school": "Florida State", "nickname": "Seminoles", "mascot": "Osceola", "primary": "#782F40", "secondary": "#CEB888"},
  {"school": "Georgia", "nickname": "Bulldogs", "mascot": "Uga", "primary": "#CC0000", "secondary": "#000000"},
  {"school": "Georgia Tech", "nickname": "Yellow Jackets", "mascot": "Buzz", "primary": "#B3A369", "secondary": "#003057"},
  {"school": "Louisville", "nickname": "Cardinals", "mascot": "Louie", "primary": "#CC0000", "secondary": "#000000"},
  {"school": "Miami", "nickname": "Hurricanes", "mascot": "Sebastian", "primary": "#FF6600", "secondary": "#003366"},
  {"school": "North Carolina", "nickname": "Tar Heels", "mascot": "Rameses", "primary": "#4B9CD3", "secondary": "#FFFFFF"},
  {"school": "NC State", "nickname": "Wolfpack", "mascot": "Mr. Wuf", "primary": "#CC0000", "secondary": "#FFFFFF"},
  {"school": "Notre Dame", "nickname": "Fighting Irish", "mascot": "Leprechaun", "primary": "#0C2340", "secondary": "#C99700"},
  {"school": "Pittsburgh", "nickname": "Panthers", "mascot": "Roc", "primary": "#003594", "secondary": "#FFB81C"},
  {"school": "Syracuse", "nickname": "Orange", "mascot": "Otto", "primary": "#FF6600", "secondary": "#003366"},
  {"school": "Virginia", "nickname": "Cavaliers", "mascot": "CavMan", "primary": "#002F5F", "secondary": "#FF6600"},
  {"school": "Virginia Tech", "nickname": "Hokies", "mascot": "HokieBird", "primary": "#CC0000", "secondary": "#FF6600"},
  {"school": "Wake Forest", "nickname": "Demon Deacons", "mascot": "Demon Deacon", "primary": "#9E7E38", "secondary": "#000000"},
  {"school": "Illinois", "nickname": "Fighting Illini", "mascot": "Alma Otter", "primary": "#FF6600", "secondary": "#003366"},
  {"school": "Indiana", "nickname": "Hoosiers", "mascot": "Hoosier Pride", "primary": "#CC0000", "secondary": "#FFFFFF"},
  {"school": "Iowa", "nickname": "Hawkeyes", "mascot": "Herky", "primary": "#000000", "secondary": "#FFD700"},
  {"school": "Maryland", "nickname": "Terrapins", "mascot": "Testudo", "primary": "#E03A3E", "secondary": "#FFD520"},
  {"school": "Michigan", "nickname": "Wolverines", "mascot": "Biff", "primary": "#002F5F", "secondary": "#FFD700"},
  {"school": "Michigan State", "nickname": "Spartans", "mascot": "Sparty", "primary": "#18453B", "secondary": "#FFFFFF"},
  {"school": "Minnesota", "nickname": "Golden Gophers", "mascot": "Goldy", "primary": "#722F37", "secondary": "#FFD700"},
  {"school": "Nebraska", "nickname": "Cornhuskers", "mascot": "Herbie", "primary": "#E41C38", "secondary": "#FFFFFF"},
  {"school": "Northwestern", "nickname": "Wildcats", "mascot": "Willie", "primary": "#4E2A84", "secondary": "#FFFFFF"},
  {"school": "Ohio State", "nickname": "Buckeyes", "mascot": "Brutus", "primary": "#BB0000", "secondary": "#FFFFFF"},
  {"school": "Penn State", "nickname": "Nittany Lions", "mascot": "Nittany Lion", "primary": "#003366", "secondary": "#FFFFFF"},
  {"school": "Purdue", "nickname": "Boilermakers", "mascot": "Purdue Pete", "primary": "#B1810B", "secondary": "#000000"},
  {"school": "Rutgers", "nickname": "Scarlet Knights", "mascot": "Scarlet Knight", "primary": "#CC0000", "secondary": "#FFFFFF"},
  {"school": "Wisconsin", "nickname": "Badgers", "mascot": "Bucky", "primary": "#C5050C", "secondary": "#FFFFFF"}
];

// Vote Types
const VOTE_TYPES = [
  {"type": "new_member", "label": "Add New Member"},
  {"type": "deadline_extension", "label": "Extend Deadline"},
  {"type": "rule_change", "label": "Rule Change"},
  {"type": "remove_member", "label": "Remove Member"}
];

// Utility functions
const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

function save(key, value) { 
  localStorage.setItem(key, JSON.stringify(value)); 
}

function load(key, defaultValue) { 
  const value = localStorage.getItem(key); 
  return value ? JSON.parse(value) : defaultValue; 
}

// Application State
let state = load("dynasty-state", {
  users: [...CONFIG.demoAccounts],
  week: 1,
  deadline: new Date('2025-07-13T18:00:00').getTime(),
  games: [
    { id: 1, week: 1, team1: "Alabama", team2: "Georgia", status: "not_played", deadline: new Date('2025-07-13T18:00:00').getTime() },
    { id: 2, week: 1, team1: "Ohio State", team2: "Michigan", status: "not_played", deadline: new Date('2025-07-13T18:00:00').getTime() },
    { id: 3, week: 1, team1: "Notre Dame", team2: "Clemson", status: "not_played", deadline: new Date('2025-07-13T18:00:00').getTime() }
  ],
  votes: []
});

// Auto-save state
setInterval(() => save("dynasty-state", state), 2000);

// Current user
let currentUser = null;

// Authentication
function login(email) {
  currentUser = state.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (!currentUser) {
    alert("Email not recognized. Please ask the commissioner to add you.");
    return;
  }
  initApp();
}

function logout() {
  currentUser = null;
  qs('#dashboard').classList.add('hidden');
  qs('#login-screen').classList.remove('hidden');
}

function isCommissioner() {
  return currentUser && currentUser.role === 'Commissioner';
}

// Initialize application after login
function initApp() {
  qs('#login-screen').classList.add('hidden');
  qs('#dashboard').classList.remove('hidden');
  qs('#user-name').textContent = currentUser.name || currentUser.email;
  qs('#current-week').textContent = `Week ${state.week}`;
  
  // Show commissioner elements
  if (isCommissioner()) {
    qsa('.commissioner-only').forEach(el => el.style.display = 'block');
    qs('#users-tab').style.display = 'inline-block';
  }
  
  buildTeamSelects();
  renderGames();
  renderSchedule();
  renderVotes();
  renderUsers();
  startCountdown();
}

// Countdown timer
function renderDeadline() {
  const now = Date.now();
  const diff = state.deadline - now;
  
  if (diff <= 0) {
    qs('#deadline-countdown').textContent = "EXPIRED";
    qs('#deadline-countdown').style.color = "var(--color-error)";
    return;
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  qs('#deadline-countdown').textContent = `${days}d ${hours}h ${minutes}m`;
  
  // Color coding based on time remaining
  if (diff < 24 * 60 * 60 * 1000) { // Less than 24 hours
    qs('#deadline-countdown').style.color = "var(--color-error)";
  } else if (diff < 48 * 60 * 60 * 1000) { // Less than 48 hours
    qs('#deadline-countdown').style.color = "var(--color-warning)";
  } else {
    qs('#deadline-countdown').style.color = "var(--color-primary)";
  }
}

function startCountdown() {
  renderDeadline();
  setInterval(renderDeadline, 60000); // Update every minute
}

// Team selection dropdowns
function buildTeamSelects() {
  qsa('#new-user-team, #schedule-opponent').forEach(select => {
    select.innerHTML = '<option value="">Select a team...</option>';
    FBS_TEAMS.forEach(team => {
      const option = document.createElement('option');
      option.value = team.school;
      option.textContent = `${team.school} ${team.nickname}`;
      select.appendChild(option);
    });
  });
}

// Games rendering
function renderGames() {
  const container = qs('#games-list');
  container.innerHTML = '';
  
  const currentWeekGames = state.games.filter(game => game.week === state.week);
  
  if (currentWeekGames.length === 0) {
    container.innerHTML = '<p>No games scheduled for this week.</p>';
    return;
  }
  
  currentWeekGames.forEach(game => {
    const team1 = FBS_TEAMS.find(t => t.school === game.team1);
    const team2 = FBS_TEAMS.find(t => t.school === game.team2);
    
    const card = document.createElement('div');
    card.className = 'game-card';
    card.innerHTML = `
      <div class="game-header">
        <span class="game-week">Week ${game.week}</span>
        <span class="game-status status-${game.status.replace('_', '-')}">${game.status === 'played' ? 'Played' : 'Not Played'}</span>
      </div>
      <div class="team-matchup">
        <div class="team-display">
          <span class="team-name">${game.team1}</span>
          <div class="team-colors" style="background: ${team1?.primary || '#666'}"></div>
        </div>
        <span class="vs">vs</span>
        <div class="team-display">
          <span class="team-name">${game.team2}</span>
          <div class="team-colors" style="background: ${team2?.primary || '#666'}"></div>
        </div>
      </div>
      <div class="game-deadline">Deadline: ${new Date(game.deadline).toLocaleString()}</div>
      ${game.score1 !== undefined && game.score2 !== undefined ? 
        `<div class="game-score">${game.score1} - ${game.score2}</div>` : ''}
    `;
    
    card.onclick = () => openGameModal(game.id);
    container.appendChild(card);
  });
}

// Game modal
function openGameModal(gameId) {
  const game = state.games.find(g => g.id === gameId);
  if (!game) return;
  
  const team1 = FBS_TEAMS.find(t => t.school === game.team1);
  const team2 = FBS_TEAMS.find(t => t.school === game.team2);
  
  qs('#modal-team1').textContent = game.team1;
  qs('#modal-team2').textContent = game.team2;
  qs('#modal-team1-colors').style.background = team1?.primary || '#666';
  qs('#modal-team2-colors').style.background = team2?.primary || '#666';
  
  // Set existing scores if available
  if (game.score1 !== undefined) qs('#team1-score').value = game.score1;
  if (game.score2 !== undefined) qs('#team2-score').value = game.score2;
  
  const modal = qs('#game-modal');
  modal.classList.add('active');
}

function closeModal(modal) {
  modal.classList.remove('active');
  // Reset score input visibility
  qs('#score-input').classList.remove('active');
}

// Schedule management
function renderSchedule() {
  const container = qs('#schedule-list');
  container.innerHTML = '';
  
  const userSchedule = load(`schedule-${currentUser.email}`, []);
  
  if (userSchedule.length === 0) {
    container.innerHTML = '<p>No games scheduled. Click "Add Game" to get started.</p>';
    return;
  }
  
  userSchedule.forEach((entry, index) => {
    const item = document.createElement('div');
    item.className = 'schedule-item';
    item.innerHTML = `
      <div class="schedule-info">
        <div class="schedule-date">${new Date(entry.date).toLocaleString()}</div>
        <div class="schedule-opponent">vs ${entry.opponent}</div>
        ${entry.notes ? `<div class="schedule-notes">${entry.notes}</div>` : ''}
      </div>
      <div class="schedule-actions">
        <button class="btn btn--secondary btn--sm" onclick="removeScheduleEntry(${index})">Remove</button>
      </div>
    `;
    container.appendChild(item);
  });
}

function removeScheduleEntry(index) {
  const userSchedule = load(`schedule-${currentUser.email}`, []);
  userSchedule.splice(index, 1);
  save(`schedule-${currentUser.email}`, userSchedule);
  renderSchedule();
}

// Voting system
function renderVotes() {
  const container = qs('#votes-list');
  container.innerHTML = '';
  
  if (state.votes.length === 0) {
    container.innerHTML = '<p>No active votes.</p>';
    return;
  }
  
  state.votes.forEach(vote => {
    const card = document.createElement('div');
    card.className = 'vote-card';
    
    const hasVoted = vote.voters && vote.voters.includes(currentUser.email);
    const voteDeadlinePassed = Date.now() > new Date(vote.deadline).getTime();
    
    card.innerHTML = `
      <div class="vote-header">
        <div class="vote-title">${vote.title}</div>
        <div class="vote-type">${VOTE_TYPES.find(t => t.type === vote.type)?.label || vote.type}</div>
      </div>
      <div class="vote-description">${vote.description}</div>
      <div class="vote-stats">
        <div class="vote-count"><strong>${vote.yes || 0}</strong> Yes</div>
        <div class="vote-count"><strong>${vote.no || 0}</strong> No</div>
      </div>
      <div class="vote-deadline">Deadline: ${new Date(vote.deadline).toLocaleString()}</div>
      ${!hasVoted && !voteDeadlinePassed ? `
        <div class="vote-actions">
          <button class="vote-btn vote-yes" onclick="castVote(${vote.id}, true)">Vote Yes</button>
          <button class="vote-btn vote-no" onclick="castVote(${vote.id}, false)">Vote No</button>
        </div>
      ` : hasVoted ? '<p><em>You have already voted</em></p>' : '<p><em>Voting deadline has passed</em></p>'}
    `;
    
    container.appendChild(card);
  });
}

function castVote(voteId, isYes) {
  const vote = state.votes.find(v => v.id === voteId);
  if (!vote || (vote.voters && vote.voters.includes(currentUser.email))) return;
  
  if (!vote.voters) vote.voters = [];
  vote.voters.push(currentUser.email);
  
  if (isYes) {
    vote.yes = (vote.yes || 0) + 1;
  } else {
    vote.no = (vote.no || 0) + 1;
  }
  
  renderVotes();
}

// User management
function renderUsers() {
  const container = qs('#users-list');
  container.innerHTML = '';
  
  state.users.forEach(user => {
    const card = document.createElement('div');
    card.className = 'user-card';
    card.innerHTML = `
      <div class="user-info">
        <div class="user-name">${user.name || user.email}</div>
        <div class="user-email">${user.email}</div>
        ${user.team ? `<div class="user-team">${user.team}</div>` : ''}
      </div>
      <div class="user-role">${user.role}</div>
    `;
    container.appendChild(card);
  });
}

// Commissioner functions
function advanceWeek() {
  if (!isCommissioner()) return;
  
  state.week++;
  state.deadline = Date.now() + (CONFIG.weekDeadlineHours * 60 * 60 * 1000);
  
  // Add sample games for new week
  const sampleGames = [
    { id: Date.now() + 1, week: state.week, team1: "Alabama", team2: "Auburn", status: "not_played", deadline: state.deadline },
    { id: Date.now() + 2, week: state.week, team1: "Ohio State", team2: "Penn State", status: "not_played", deadline: state.deadline }
  ];
  
  state.games.push(...sampleGames);
  
  qs('#current-week').textContent = `Week ${state.week}`;
  renderGames();
  renderDeadline();
}

function extendDeadline() {
  if (!isCommissioner()) return;
  
  state.deadline += (24 * 60 * 60 * 1000); // Extend by 24 hours
  renderDeadline();
}

// Event listeners
window.addEventListener('DOMContentLoaded', () => {
  // Login events
  qs('#login-btn').onclick = () => login(qs('#email-input').value);
  qsa('.demo-btn').forEach(btn => 
    btn.onclick = () => login(btn.dataset.email)
  );
  qs('#logout-btn').onclick = logout;
  
  // Tab navigation
  qsa('.tab-btn').forEach(btn => {
    btn.onclick = () => {
      qsa('.tab-btn').forEach(b => b.classList.remove('active'));
      qsa('.tab-content').forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      
      const targetTab = btn.dataset.tab === 'users' ? 'users-tab-content' : `${btn.dataset.tab}-tab`;
      qs(`#${targetTab}`).classList.add('active');
    };
  });
  
  // Modal close buttons
  qsa('.close-btn').forEach(btn => 
    btn.onclick = () => closeModal(btn.closest('.modal'))
  );
  
  // Click outside modal to close
  qsa('.modal').forEach(modal => {
    modal.onclick = (e) => {
      if (e.target === modal) closeModal(modal);
    };
  });
  
  // Commissioner actions
  qs('#advance-week-btn').onclick = advanceWeek;
  qs('#extend-deadline-btn').onclick = extendDeadline;
  
  // Game modal actions
  qs('#mark-played-btn').onclick = () => {
    const modal = qs('#game-modal');
    const gameId = modal.currentGameId;
    const game = state.games.find(g => g.id === gameId);
    if (game) {
      game.status = 'played';
      renderGames();
      closeModal(modal);
    }
  };
  
  qs('#mark-not-played-btn').onclick = () => {
    const modal = qs('#game-modal');
    const gameId = modal.currentGameId;
    const game = state.games.find(g => g.id === gameId);
    if (game) {
      game.status = 'not_played';
      renderGames();
      closeModal(modal);
    }
  };
  
  qs('#toggle-score-btn').onclick = () => {
    const scoreInput = qs('#score-input');
    scoreInput.classList.toggle('active');
  };
  
  qs('#submit-score-btn').onclick = () => {
    const modal = qs('#game-modal');
    const gameId = modal.currentGameId;
    const game = state.games.find(g => g.id === gameId);
    if (game) {
      game.score1 = parseInt(qs('#team1-score').value) || 0;
      game.score2 = parseInt(qs('#team2-score').value) || 0;
      game.status = 'played';
      renderGames();
      closeModal(modal);
    }
  };
  
  // Schedule modal
  qs('#add-schedule-btn').onclick = () => qs('#schedule-modal').classList.add('active');
  qs('#schedule-form').onsubmit = (e) => {
    e.preventDefault();
    const userSchedule = load(`schedule-${currentUser.email}`, []);
    userSchedule.push({
      opponent: qs('#schedule-opponent').value,
      date: qs('#schedule-date').value,
      notes: qs('#schedule-notes').value
    });
    save(`schedule-${currentUser.email}`, userSchedule);
    renderSchedule();
    closeModal(qs('#schedule-modal'));
    qs('#schedule-form').reset();
  };
  
  // Add user modal
  qs('#add-user-btn').onclick = () => qs('#add-user-modal').classList.add('active');
  qs('#add-user-form').onsubmit = (e) => {
    e.preventDefault();
    const newUser = {
      email: qs('#new-user-email').value,
      name: qs('#new-user-name').value,
      team: qs('#new-user-team').value,
      role: qs('#new-user-role').value
    };
    state.users.push(newUser);
    renderUsers();
    closeModal(qs('#add-user-modal'));
    qs('#add-user-form').reset();
  };
  
  // Create vote modal
  qs('#create-vote-btn').onclick = () => qs('#create-vote-modal').classList.add('active');
  qs('#create-vote-form').onsubmit = (e) => {
    e.preventDefault();
    const newVote = {
      id: Date.now(),
      type: qs('#vote-type').value,
      title: qs('#vote-title').value,
      description: qs('#vote-description').value,
      deadline: qs('#vote-deadline').value,
      yes: 0,
      no: 0,
      voters: []
    };
    state.votes.push(newVote);
    renderVotes();
    closeModal(qs('#create-vote-modal'));
    qs('#create-vote-form').reset();
  };
  
  // Enter key support for login
  qs('#email-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      login(qs('#email-input').value);
    }
  });
});

// Enhanced game modal functionality
function openGameModal(gameId) {
  const game = state.games.find(g => g.id === gameId);
  if (!game) return;
  
  const team1 = FBS_TEAMS.find(t => t.school === game.team1);
  const team2 = FBS_TEAMS.find(t => t.school === game.team2);
  
  qs('#modal-team1').textContent = game.team1;
  qs('#modal-team2').textContent = game.team2;
  qs('#modal-team1-colors').style.background = team1?.primary || '#666';
  qs('#modal-team2-colors').style.background = team2?.primary || '#666';
  
  // Set existing scores if available
  if (game.score1 !== undefined) qs('#team1-score').value = game.score1;
  if (game.score2 !== undefined) qs('#team2-score').value = game.score2;
  
  const modal = qs('#game-modal');
  modal.currentGameId = gameId; // Store the game ID for later use
  modal.classList.add('active');
}

// Global functions for onclick handlers
window.removeScheduleEntry = removeScheduleEntry;
window.castVote = castVote;

// Initialize the app
console.log('College Football Dynasty Manager loaded successfully!');
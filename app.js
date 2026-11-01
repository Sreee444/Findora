/* CONFIG */
const API_URL = (window.location.protocol === 'file:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:5000'
  : 'https://findora-c7gp.onrender.com';
const ADMIN_EMAILS = ['admin@campus.edu', 'findoraofficial101@gmail.com', 'recoveraofficial101@gmail.com', 'gotchaofficial101@gmail.com'];

/* STATE */
let currentUser = null, currentPage = 'home';
let lostMapPicker = null, lostMapMarker = null, lostSelectedLoc = null;
let foundMapPicker = null, foundMapMarker = null, foundSelectedLoc = null;
let mapViewInstance = null, lostMapInit = false, foundMapInit = false;

/* AUTH */
function parseJwt(t) { try { return JSON.parse(atob(t.split('.')[1].replace(/-/g,'+').replace(/_/g,'/'))); } catch(e){return null;} }
function loadUserFromStorage() {
  const t = localStorage.getItem('token');
  if (!t) { currentUser = null; return; }
  const d = parseJwt(t);
  if (d && (!d.exp || d.exp * 1000 > Date.now())) {
    currentUser = { ...d, token: t };
  } else {
    localStorage.removeItem('token');
    currentUser = null;
  }
}
function isLoggedIn() { return !!currentUser; }
function isAdmin() {
  if (!currentUser) return false;
  if (currentUser.role === 'admin') return true;
  const email = (currentUser.email || '').toLowerCase();
  return ADMIN_EMAILS.some(e => e.toLowerCase() === email);
}
function getToken() { return localStorage.getItem('token'); }

/* DARK MODE */
function initDark() {
  const s = localStorage.getItem('theme');
  const p = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (s==='dark'||(!s&&p)) { document.documentElement.classList.add('dark'); document.getElementById('dark-toggle').textContent='🌙'; }
}
function toggleDark() {
  const d = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', d?'dark':'light');
  document.getElementById('dark-toggle').textContent = d?'🌙':'☀️';
}

/* TOAST */
function showToast(msg, type) {
  type = type||'info';
  const c = document.getElementById('toast-container');
  const t = document.createElement('div');
  t.className = 'toast toast-'+type; t.textContent = msg; c.appendChild(t);
  setTimeout(()=>{ t.style.opacity='0'; t.style.transition='opacity .4s'; setTimeout(()=>t.remove(),400); }, 3500);
}

/* ROUTING */
const PAGES = ['home','login','register','forgot-password','lost-form','found-form','lost-list','found-list','user-dashboard','profile','history','notifications-page','location-page','admin-dashboard','not-found'];
// Public pages: home, lost-list, found-list, location-page, login, register, forgot-password
// Protected pages (account required): lost-form, found-form, user-dashboard, profile, history, notifications-page, admin-dashboard
const PROTECTED = ['lost-form','found-form','user-dashboard','profile','history','notifications-page','admin-dashboard'];
const ADMIN_P = ['admin-dashboard'];
let currentAdminTab = 'approvals';

function navigate(page, skip) {
  // Graceful alias redirects for any legacy admin bookmarks
  if (page === 'admin-login') {
    navigate(isLoggedIn() ? (isAdmin() ? 'admin-dashboard' : 'user-dashboard') : 'login');
    return;
  }
  if (page === 'admin' || page === 'admin-approval' || page === 'admin-users') {
    if (page === 'admin-approval') currentAdminTab = 'approvals';
    if (page === 'admin-users') currentAdminTab = 'users';
    navigate('admin-dashboard');
    return;
  }

  if (PROTECTED.includes(page) && !isLoggedIn()) {
    if (page === 'lost-form' || page === 'found-form') {
      showToast('Please sign in or create an account to report an item.', 'info');
    } else {
      showToast('Please sign in to access this page.', 'info');
    }
    navigate('login');
    return;
  }
  if (ADMIN_P.includes(page)) {
    if (!isLoggedIn()) {
      showToast('Please sign in as administrator.', 'info');
      navigate('login');
      return;
    }
    if (!isAdmin()) {
      showToast('Access denied: Administrator privileges required.', 'error');
      navigate('user-dashboard');
      return;
    }
  }
  if (page === 'login' && isLoggedIn()) {
    navigate(isAdmin() ? 'admin-dashboard' : 'user-dashboard');
    return;
  }

  PAGES.forEach(p => { const el = document.getElementById('page-' + p); if (el) el.classList.remove('active'); });
  const t = document.getElementById('page-' + page);
  if (t) { t.classList.add('active'); currentPage = page; }
  else { document.getElementById('page-not-found').classList.add('active'); currentPage = 'not-found'; }
  if (!skip) window.location.hash = page;
  updateSidebar();
  updateNav();
  onPageLoad(page);
  window.scrollTo(0, 0);
  closeMobileMenu();
}

function onPageLoad(p) {
  if (p==='lost-list') loadLostList();
  if (p==='found-list') loadFoundList();
  if (p==='profile') loadProfile();
  if (p==='history') loadHistory();
  if (p==='admin-dashboard') switchAdminTab(currentAdminTab || 'approvals');
  if (p==='lost-form') initLostMap();
  if (p==='found-form') initFoundMap();
  if (p==='location-page') initMapView();
  if (p==='user-dashboard') updateDashWelcome();
  if (p==='forgot-password') resetForgotForm();
}

function updateSidebar() {
  const sb = document.getElementById('sidebar');
  if (!sb) return;

  if (!isLoggedIn()) {
    sb.style.display = 'none';
    return;
  }

  sb.style.display = 'flex';
  const isAdm = isAdmin();
  const username = currentUser.username || (currentUser.email ? currentUser.email.split('@')[0] : 'User');

  if (isAdm) {
    sb.innerHTML = `
      <div class="sidebar-user-card admin-mode">
        <div class="sidebar-user-avatar">👑</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${esc(username)}</div>
          <span class="admin-badge-mini">ADMINISTRATOR</span>
        </div>
      </div>

      <div class="sidebar-section-title">ADMINISTRATION</div>
      <button class="sidebar-link sidebar-admin-link" onclick="navigate('admin-dashboard')" id="sb-admin-dash">&#128737; Admin Panel</button>

      <div class="sidebar-divider"></div>

      <div class="sidebar-section-title">COMMUNITY</div>
      <button class="sidebar-link" onclick="navigate('user-dashboard')" id="sb-dashboard">&#127968; Dashboard</button>
      <button class="sidebar-link" onclick="navigate('lost-list')" id="sb-lost-list">&#10067; Lost Items</button>
      <button class="sidebar-link" onclick="navigate('found-list')" id="sb-found-list">&#128230; Found Items</button>
      <button class="sidebar-link" onclick="navigate('notifications-page')" id="sb-notifications">&#128276; Notifications</button>
      <button class="sidebar-link" onclick="navigate('location-page')" id="sb-location">&#128205; Location Map</button>
      <button class="sidebar-link" onclick="navigate('history')" id="sb-history">&#128336; History</button>
    `;
  } else {
    sb.innerHTML = `
      <div class="sidebar-user-card">
        <div class="sidebar-user-avatar">👤</div>
        <div class="sidebar-user-info">
          <div class="sidebar-user-name">${esc(username)}</div>
          <span class="user-badge-mini">COMMUNITY MEMBER</span>
        </div>
      </div>

      <div class="sidebar-section-title">NAVIGATION</div>
      <button class="sidebar-link" onclick="navigate('user-dashboard')" id="sb-dashboard">&#127968; Dashboard</button>
      <button class="sidebar-link" onclick="navigate('lost-list')" id="sb-lost-list">&#10067; Lost Items</button>
      <button class="sidebar-link" onclick="navigate('found-list')" id="sb-found-list">&#128230; Found Items</button>
      <button class="sidebar-link" onclick="navigate('notifications-page')" id="sb-notifications">&#128276; Notifications</button>
      <button class="sidebar-link" onclick="navigate('location-page')" id="sb-location">&#128205; Location Map</button>
      <button class="sidebar-link" onclick="navigate('history')" id="sb-history">&#128336; History</button>
    `;
  }

  const map = {
    'admin-dashboard': 'sb-admin-dash',
    'user-dashboard': 'sb-dashboard',
    'lost-list': 'sb-lost-list',
    'found-list': 'sb-found-list',
    'notifications-page': 'sb-notifications',
    'location-page': 'sb-location',
    'history': 'sb-history'
  };
  Object.values(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.remove('active');
  });
  const activeId = map[currentPage];
  if (activeId) {
    const el = document.getElementById(activeId);
    if (el) el.classList.add('active');
  }
}

function updateNav() {
  const container = document.getElementById('nav-auth-section');
  if (!container) return;

  if (!isLoggedIn()) {
    container.innerHTML = `
      <button class="nav-btn nav-btn-ghost" onclick="navigate('login'); closeMobileMenu()">Sign In</button>
      <button class="nav-btn nav-btn-profile" onclick="navigate('register'); closeMobileMenu()">Register</button>
    `;
    return;
  }

  const user = currentUser;
  const username = user.username || (user.email ? user.email.split('@')[0] : 'User');
  const isAdm = isAdmin();

  if (isAdm) {
    container.innerHTML = `
      <button class="nav-btn nav-btn-admin-hub" onclick="navigate('admin-dashboard'); closeMobileMenu()">🛡️ Admin Panel</button>
      <div class="dropdown-wrap">
        <button class="nav-btn nav-btn-account" onclick="toggleDropdown('user-dropdown')">
          <span class="nav-avatar">👑</span>
          <span class="nav-user-name">${esc(username)}</span>
          <span class="nav-caret">&#9660;</span>
        </button>
        <div class="dropdown-menu hidden" id="user-dropdown">
          <div class="dropdown-header">ADMINISTRATOR</div>
          <button class="dropdown-item" onclick="navigate('admin-dashboard');toggleDropdown('user-dropdown')">🛡️ Admin Panel</button>
          <div class="dropdown-divider"></div>
          <div class="dropdown-header">COMMUNITY ACCESS</div>
          <button class="dropdown-item" onclick="navigate('user-dashboard');toggleDropdown('user-dropdown')">🏠 Dashboard</button>
          <button class="dropdown-item" onclick="navigate('profile');toggleDropdown('user-dropdown')">👤 My Profile</button>
          <button class="dropdown-item" onclick="navigate('history');toggleDropdown('user-dropdown')">⏱️ Activity History</button>
          <button class="dropdown-item" onclick="navigate('notifications-page');toggleDropdown('user-dropdown')">🔔 Notifications</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" onclick="logout()">🚪 Sign Out</button>
        </div>
      </div>
    `;
  } else {
    container.innerHTML = `
      <div class="dropdown-wrap">
        <button class="nav-btn nav-btn-account" onclick="toggleDropdown('user-dropdown')">
          <span class="nav-avatar">👤</span>
          <span class="nav-user-name">${esc(username)}</span>
          <span class="nav-caret">&#9660;</span>
        </button>
        <div class="dropdown-menu hidden" id="user-dropdown">
          <div class="dropdown-header">MY ACCOUNT</div>
          <button class="dropdown-item" onclick="navigate('user-dashboard');toggleDropdown('user-dropdown')">🏠 Dashboard</button>
          <button class="dropdown-item" onclick="navigate('profile');toggleDropdown('user-dropdown')">👤 My Profile</button>
          <button class="dropdown-item" onclick="navigate('history');toggleDropdown('user-dropdown')">⏱️ Activity History</button>
          <button class="dropdown-item" onclick="navigate('notifications-page');toggleDropdown('user-dropdown')">🔔 Notifications</button>
          <div class="dropdown-divider"></div>
          <button class="dropdown-item danger" onclick="logout()">🚪 Sign Out</button>
        </div>
      </div>
    `;
  }
}

function toggleDropdown(id) {
  const dd=document.getElementById(id);
  document.querySelectorAll('.dropdown-menu').forEach(d=>{ if(d.id!==id) d.classList.add('hidden'); });
  dd.classList.toggle('hidden');
}
document.addEventListener('click', e=>{ if(!e.target.closest('.dropdown-wrap')) document.querySelectorAll('.dropdown-menu').forEach(d=>d.classList.add('hidden')); });
function toggleMobileMenu() { document.getElementById('nav-links').classList.toggle('open'); }
function closeMobileMenu() { document.getElementById('nav-links').classList.remove('open'); }

/* API */
async function apiFetch(path, opts) {
  opts = opts||{};
  const token = getToken();
  const headers = {'Content-Type':'application/json',...(token?{Authorization:'Bearer '+token}:{}),...(opts.headers||{})};
  const res = await fetch(API_URL+path, {...opts, headers});
  const data = await res.json().catch(()=>({}));
  if (!res.ok) throw new Error(data.error||data.message||'Request failed');
  return data;
}

/* AUTH HANDLERS */
async function handleLogin() {
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  if (!email || !password) { setStatus('login-status', 'Please fill in all fields.', false); return; }
  const btn = document.getElementById('login-btn');
  btn.textContent = 'Signing in...';
  btn.disabled = true;
  clearStatus('login-status');
  try {
    const data = await apiFetch('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
    if (!data.token) throw new Error(data.error || 'No token received');
    localStorage.setItem('token', data.token);
    loadUserFromStorage();
    const isAdm = isAdmin();
    setStatus('login-status', 'Sign in successful! Redirecting...', true);
    showToast(isAdm ? 'Welcome, Administrator!' : 'Welcome back!', 'success');
    updateNav();
    updateSidebar();
    setTimeout(() => {
      navigate(isAdm ? 'admin-dashboard' : 'user-dashboard');
    }, 250);
  } catch(err) {
    setStatus('login-status', err.message || 'Login failed', false);
    showToast(err.message || 'Login failed', 'error');
  } finally {
    btn.textContent = 'Sign In';
    btn.disabled = false;
  }
}

async function handleRegister() {
  const email = document.getElementById('reg-email').value.trim();
  const username = document.getElementById('reg-username').value.trim();
  const password = document.getElementById('reg-password').value;
  const confirm = document.getElementById('reg-confirm').value;

  if (!email) {
    setStatus('reg-status', 'Please enter your email address.', false);
    return;
  }
  if (!email.includes('@') || email.length < 5) {
    setStatus('reg-status', 'Please enter a valid email address (e.g. name@example.com).', false);
    return;
  }
  if (!username || username.length < 3) {
    setStatus('reg-status', 'Username must be at least 3 characters long.', false);
    return;
  }
  if (!password) {
    setStatus('reg-status', 'Please enter a password.', false);
    return;
  }
  if (password.length < 6) {
    setStatus('reg-status', 'Password must be at least 6 characters long.', false);
    return;
  }
  if (password !== confirm) {
    setStatus('reg-status', 'Passwords do not match. Please re-type password.', false);
    return;
  }

  const btn = document.getElementById('reg-btn');
  btn.textContent = 'Registering...';
  btn.disabled = true;
  clearStatus('reg-status');
  try {
    await apiFetch('/api/auth/signup', { method: 'POST', body: JSON.stringify({ email, password, username }) });
    setStatus('reg-status', 'Registration successful! Redirecting to login...', true);
    showToast('Registration successful!', 'success');
    setTimeout(() => navigate('login'), 1500);
  } catch(err) {
    setStatus('reg-status', err.message || 'Registration failed. Please check your details.', false);
    showToast(err.message || 'Registration failed', 'error');
  } finally {
    btn.textContent = 'Register';
    btn.disabled = false;
  }
}

async function handleForgotPassword() {
  const email=document.getElementById('forgot-email').value.trim();
  if (!email) { setStatus('forgot-status','Please enter your email.',false); return; }
  const btn=document.getElementById('forgot-btn'); btn.textContent='Sending...'; btn.disabled=true;
  try {
    await apiFetch('/api/auth/forgot-password',{method:'POST',body:JSON.stringify({email})});
    document.getElementById('forgot-form-card').classList.add('hidden');
    document.getElementById('forgot-sent-card').classList.remove('hidden');
    document.getElementById('forgot-email-show').textContent=email;
  } catch(err) { setStatus('forgot-status',err.message||'Failed to send reset email',false); }
  finally { btn.textContent='Send Reset Link'; btn.disabled=false; }
}

function resetForgotForm() {
  document.getElementById('forgot-form-card').classList.remove('hidden');
  document.getElementById('forgot-sent-card').classList.add('hidden');
  clearStatus('forgot-status');
}

function logout() {
  localStorage.removeItem('token');
  currentUser = null;
  updateNav();
  updateSidebar();
  showToast('Signed out successfully.', 'info');
  navigate('home');
}

/* ITEM SUBMISSION & IMAGE HELPERS */
let lostSelectedImage = null;
let foundSelectedImage = null;

function handleImageSelect(input, type) {
  const previewImg = document.getElementById(type + '-img-preview');
  const previewWrap = document.getElementById(type + '-img-wrap');
  
  if (!input.files || !input.files[0]) {
    if (type === 'lost') lostSelectedImage = null;
    else foundSelectedImage = null;
    if (previewWrap) previewWrap.classList.add('hidden');
    if (previewImg) { previewImg.src = ''; previewImg.classList.add('hidden'); }
    return;
  }

  const file = input.files[0];
  const reader = new FileReader();

  reader.onload = function(e) {
    const rawData = e.target.result;
    
    // Store immediately so submit handler has it guaranteed
    if (type === 'lost') lostSelectedImage = rawData;
    else foundSelectedImage = rawData;

    if (previewImg) {
      previewImg.src = rawData;
      previewImg.classList.remove('hidden');
    }
    if (previewWrap) previewWrap.classList.remove('hidden');

    // Attempt gentle canvas compression in background
    const img = new Image();
    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || img.width || 400;
        let height = img.naturalHeight || img.height || 300;
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL('image/jpeg', 0.82);
        if (type === 'lost') lostSelectedImage = compressed;
        else foundSelectedImage = compressed;
        if (previewImg) previewImg.src = compressed;
      } catch (err) {
        console.warn('Canvas resize fallback, raw data used:', err);
      }
    };
    img.src = rawData;
  };

  reader.onerror = function() {
    showToast('Failed to read image file.', 'error');
  };

  reader.readAsDataURL(file);
}

function previewImage(input, previewImgId, previewWrapId) {
  const type = (previewImgId && previewImgId.includes('found')) ? 'found' : 'lost';
  handleImageSelect(input, type);
}

function clearSelectedImage(type) {
  const fileInput = document.getElementById(type + '-picture');
  if (fileInput) fileInput.value = '';
  if (type === 'lost') lostSelectedImage = null;
  else foundSelectedImage = null;
  const p = document.getElementById(type + '-img-preview');
  if (p) { p.src = ''; p.classList.add('hidden'); }
  const wrap = document.getElementById(type + '-img-wrap');
  if (wrap) wrap.classList.add('hidden');
}

function getBase64Image(inputElement) {
  return new Promise((resolve) => {
    if (!inputElement || !inputElement.files || !inputElement.files[0]) {
      resolve(null);
      return;
    }
    const file = inputElement.files[0];
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result || null);
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(file);
  });
}

async function handleLostSubmit() {
  if (!isLoggedIn()) { showToast('Please login first.', 'error'); navigate('login'); return; }
  if (!lostSelectedLoc) { setStatus('lost-status', 'Please select a location on the map.', false); return; }
  const title = document.getElementById('lost-title').value.trim();
  const description = document.getElementById('lost-desc').value.trim();
  const contact = document.getElementById('lost-contact').value.trim();
  if (!title) { setStatus('lost-status', 'Please enter item name.', false); return; }
  if (!description) { setStatus('lost-status', 'Please enter a description.', false); return; }
  if (!contact) { setStatus('lost-status', 'Please enter contact info.', false); return; }

  const btn = document.getElementById('lost-submit-btn');
  btn.textContent = 'Posting item...';
  btn.disabled = true;

  try {
    let image = lostSelectedImage;
    if (!image) {
      image = await getBase64Image(document.getElementById('lost-picture'));
    }

    await apiFetch('/api/items', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        contact,
        type: 'lost',
        location: lostSelectedLoc,
        image,
        date: new Date().toISOString()
      })
    });
    setStatus('lost-status', 'Lost item posted successfully! Redirecting...', true);
    showToast('Lost item posted successfully!', 'success');
    document.getElementById('lost-title').value = '';
    document.getElementById('lost-desc').value = '';
    document.getElementById('lost-contact').value = '';
    document.getElementById('lost-picture').value = '';
    lostSelectedImage = null;
    const lp = document.getElementById('lost-img-preview'); if (lp) { lp.classList.add('hidden'); lp.src = ''; }
    const lw = document.getElementById('lost-img-wrap'); if (lw) lw.classList.add('hidden');
    const s = document.getElementById('lost-loc-search'); if (s) s.value = '';
    lostSelectedLoc = null;
    document.getElementById('lost-location-info').classList.add('hidden');
    document.getElementById('lost-map-link').classList.add('hidden');
    if (lostMapMarker && lostMapPicker) { lostMapPicker.removeLayer(lostMapMarker); lostMapMarker = null; }
    setTimeout(() => navigate('lost-list'), 700);
  } catch(err) {
    setStatus('lost-status', err.message || 'Submission failed', false);
  } finally {
    btn.textContent = 'Submit';
    btn.disabled = false;
  }
}

async function handleFoundSubmit() {
  if (!isLoggedIn()) { showToast('Please login first.', 'error'); navigate('login'); return; }
  if (!foundSelectedLoc) { setStatus('found-status', 'Please select a location on the map.', false); return; }
  const title = document.getElementById('found-title').value.trim();
  const description = document.getElementById('found-desc').value.trim();
  const contact = document.getElementById('found-contact').value.trim();
  if (!title) { setStatus('found-status', 'Please enter item name.', false); return; }
  if (!description) { setStatus('found-status', 'Please enter a description.', false); return; }
  if (!contact) { setStatus('found-status', 'Please enter contact info.', false); return; }

  const btn = document.getElementById('found-submit-btn');
  btn.textContent = 'Posting item...';
  btn.disabled = true;

  try {
    let image = foundSelectedImage;
    if (!image) {
      image = await getBase64Image(document.getElementById('found-picture'));
    }

    await apiFetch('/api/items', {
      method: 'POST',
      body: JSON.stringify({
        title,
        description,
        contact,
        type: 'found',
        location: foundSelectedLoc,
        image,
        date: new Date().toISOString()
      })
    });
    setStatus('found-status', 'Found item posted successfully! Redirecting...', true);
    showToast('Found item posted successfully!', 'success');
    document.getElementById('found-title').value = '';
    document.getElementById('found-desc').value = '';
    document.getElementById('found-contact').value = '';
    document.getElementById('found-picture').value = '';
    foundSelectedImage = null;
    const fp = document.getElementById('found-img-preview'); if (fp) { fp.classList.add('hidden'); fp.src = ''; }
    const fw = document.getElementById('found-img-wrap'); if (fw) fw.classList.add('hidden');
    const s = document.getElementById('found-loc-search'); if (s) s.value = '';
    foundSelectedLoc = null;
    document.getElementById('found-location-info').classList.add('hidden');
    document.getElementById('found-map-link').classList.add('hidden');
    if (foundMapMarker && foundMapPicker) { foundMapPicker.removeLayer(foundMapMarker); foundMapMarker = null; }
    setTimeout(() => navigate('found-list'), 700);
  } catch(err) {
    setStatus('found-status', err.message || 'Submission failed', false);
  } finally {
    btn.textContent = 'Submit';
    btn.disabled = false;
  }
}

/* LISTS */
function formatDate(d) { if(!d) return ''; return new Date(d).toLocaleString('en-IN',{timeZone:'Asia/Kolkata',dateStyle:'medium',timeStyle:'short'}); }
function esc(s) { if(!s) return ''; return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }
function setStatus(id,msg,ok) { const el=document.getElementById(id); if(!el) return; el.innerHTML='<div class="alert '+(ok?'alert-success':'alert-error')+'">'+(ok?'&#10003; ':'&#10007; ')+esc(msg)+'</div>'; }
function clearStatus(id) { const el=document.getElementById(id); if(el) el.innerHTML=''; }
function togglePw(inputId,btn) { const i=document.getElementById(inputId); if(i.type==='password'){i.type='text';btn.textContent='hide';}else{i.type='password';btn.textContent='show';} }
function updateDashWelcome() { const el=document.getElementById('dash-welcome'); if(el&&currentUser) el.textContent='Welcome, '+(currentUser.username||currentUser.email||'User')+'!'; }

async function loadLostList() {
  const c=document.getElementById('lost-list-content');
  c.innerHTML='<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const data=await apiFetch('/api/items?type=lost');
    const items=data.slice().reverse();
    if(!items.length){c.innerHTML='<div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">No lost items found.</div>';return;}
    c.innerHTML='<div class="item-list">'+items.map(item=>`
      <div class="item-card" onclick="showItemDetails('${item._id}')">
        <div style="display:flex;gap:16px;align-items:flex-start">
          ${item.image ? `
            <div class="item-card-thumb-wrap">
              <img src="${item.image}" alt="${esc(item.title)}" class="item-card-thumb" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'item-card-thumb-placeholder\\'><span>🔍</span></div>'" />
            </div>
          ` : `
            <div class="item-card-thumb-placeholder">
              <span>🔍</span>
            </div>
          `}
          <div style="flex:1;min-width:0">
            <div class="item-card-title">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(item.title)}</span>
              <span class="badge badge-red">🔴 Lost</span>
            </div>
            <div class="item-card-desc">${esc(item.description)}</div>
            <div class="item-card-meta">
              <span>👤 ${esc((item.createdBy&&item.createdBy.username)||'User')}</span>
              <span>📅 ${formatDate(item.date)}</span>
              ${item.location&&item.location.address?`<span>📍 ${esc(item.location.address)}</span>`:''}
            </div>
            <div style="margin-top:10px;display:flex;gap:8px">
              <button class="btn btn-blue" style="padding:4px 12px;font-size:.8rem" onclick="event.stopPropagation();showItemDetails('${item._id}')">🔍 View Details</button>
              ${item.location?`<button class="btn btn-ghost" style="padding:4px 12px;font-size:.8rem;border:1px solid var(--border)" onclick="event.stopPropagation();window.open('https://www.google.com/maps?q=${item.location.lat},${item.location.lng}','_blank')">🗺️ Map</button>`:''}
            </div>
          </div>
        </div>
      </div>`).join('')+'</div>';
  } catch(err) { c.innerHTML='<div class="alert alert-error">'+esc(err.message)+'</div>'; }
}

async function loadFoundList() {
  const c=document.getElementById('found-list-content');
  c.innerHTML='<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const data=await apiFetch('/api/items?type=found');
    const items=data.slice().reverse();
    if(!items.length){c.innerHTML='<div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">No found items yet.</div>';return;}
    c.innerHTML='<div class="item-list">'+items.map(item=>`
      <div class="item-card" onclick="showItemDetails('${item._id}')">
        <div style="display:flex;gap:16px;align-items:flex-start">
          ${item.image ? `
            <div class="item-card-thumb-wrap">
              <img src="${item.image}" alt="${esc(item.title)}" class="item-card-thumb" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'item-card-thumb-placeholder\\'><span>📦</span></div>'" />
            </div>
          ` : `
            <div class="item-card-thumb-placeholder">
              <span>📦</span>
            </div>
          `}
          <div style="flex:1;min-width:0">
            <div class="item-card-title" style="color:var(--green)">
              <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(item.title)}</span>
              <span class="badge badge-green">🟢 Found</span>
            </div>
            <div class="item-card-desc">${esc(item.description)}</div>
            <div class="item-card-meta">
              <span>👤 ${esc((item.createdBy&&item.createdBy.username)||'User')}</span>
              <span>📅 ${formatDate(item.date)}</span>
              ${item.location&&item.location.address?`<span>📍 ${esc(item.location.address)}</span>`:''}
            </div>
            <div style="margin-top:10px;display:flex;gap:8px">
              <button class="btn btn-green" style="padding:4px 12px;font-size:.8rem" onclick="event.stopPropagation();showItemDetails('${item._id}')">🔍 View Details</button>
              ${item.location?`<button class="btn btn-ghost" style="padding:4px 12px;font-size:.8rem;border:1px solid var(--border)" onclick="event.stopPropagation();window.open('https://www.google.com/maps?q=${item.location.lat},${item.location.lng}','_blank')">🗺️ Map</button>`:''}
            </div>
          </div>
        </div>
      </div>`).join('')+'</div>';
  } catch(err) { c.innerHTML='<div class="alert alert-error">'+esc(err.message)+'</div>'; }
}

/* PROFILE */
async function loadProfile() {
  if(!isLoggedIn()){navigate('login');return;}
  const c=document.getElementById('profile-content');
  c.innerHTML='<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const [profile,items]=await Promise.all([apiFetch('/api/auth/me'),apiFetch('/api/items/my')]);
    c.innerHTML=`
      <div class="card" style="max-width:600px;margin-bottom:20px">
        <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:16px;color:var(--blue)">Edit Username</h3>
        <div class="form-group"><label class="form-label">Username / Email</label><input class="form-input" type="email" id="edit-username" value="${esc(profile.username||profile.email||'')}" /></div>
        <button class="btn btn-blue" onclick="saveProfile()">Save</button><div id="profile-edit-status"></div>
      </div>
      <div class="card" style="max-width:600px;margin-bottom:20px">
        <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:16px;color:var(--green)">Change Password</h3>
        <div class="form-group"><label class="form-label">Old Password</label><input class="form-input" type="password" id="old-password" placeholder="Old password" /></div>
        <div class="form-group"><label class="form-label">New Password</label><input class="form-input" type="password" id="new-password" placeholder="New password" /></div>
        <button class="btn btn-green" onclick="changePassword()">Change Password</button><div id="pw-change-status"></div>
      </div>
      <div class="card" style="max-width:600px">
        <h3 style="font-weight:700;font-size:1.1rem;margin-bottom:16px;color:var(--yellow)">My Reported Items</h3>
        ${items.length===0?'<p style="color:var(--text-muted)">No items reported yet.</p>':
          '<div class="item-list">'+items.map(i=>`<div class="item-card"><div class="item-card-title">${esc(i.title)}</div><div class="item-card-desc">${esc(i.description)}</div><div class="item-card-meta">Type: ${i.type} | ${formatDate(i.date)} | Contact: ${esc(i.contact)}</div></div>`).join('')+'</div>'}
      </div>`;
  } catch(err) { c.innerHTML='<div class="alert alert-error">'+esc(err.message)+'</div>'; }
}

async function saveProfile() {
  const u=document.getElementById('edit-username'); if(!u) return;
  try { await apiFetch('/api/auth/me',{method:'PUT',body:JSON.stringify({username:u.value.trim()})}); setStatus('profile-edit-status','Profile updated!',true); showToast('Profile updated!','success'); }
  catch(err) { setStatus('profile-edit-status',err.message,false); }
}

async function changePassword() {
  const op=document.getElementById('old-password'), np=document.getElementById('new-password'); if(!op||!np) return;
  try { await apiFetch('/api/auth/change-password',{method:'PUT',body:JSON.stringify({oldPassword:op.value,newPassword:np.value})}); setStatus('pw-change-status','Password changed!',true); showToast('Password changed!','success'); op.value=''; np.value=''; }
  catch(err) { setStatus('pw-change-status',err.message,false); }
}

/* HISTORY */
async function loadHistory() {
  if(!isLoggedIn()){navigate('login');return;}
  const c=document.getElementById('history-content');
  c.innerHTML='<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const data=await apiFetch('/api/items/my');
    const lost=data.filter(i=>i.type==='lost'), found=data.filter(i=>i.type==='found');
    const pending=data.filter(i=>!i.approved&&!i.verified).length, claimed=data.filter(i=>i.claimed).length;
    const card = i => {
      const ok = i.approved || i.verified;
      return `
        <div class="item-card" onclick="showItemDetails('${i._id}')">
          <div style="display:flex;gap:14px;align-items:flex-start">
            ${i.image ? `
              <div class="item-card-thumb-wrap">
                <img src="${i.image}" alt="${esc(i.title)}" class="item-card-thumb" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'item-card-thumb-placeholder\\'><span>${i.type==='lost'?'🔍':'📦'}</span></div>'" />
              </div>
            ` : `
              <div class="item-card-thumb-placeholder">
                <span>${i.type === 'lost' ? '🔍' : '📦'}</span>
              </div>
            `}
            <div style="flex:1;min-width:0">
              <div class="item-card-title">
                <span>${esc(i.title)}</span>
                <span class="badge ${ok ? 'badge-green' : 'badge-yellow'}">${ok ? 'Approved' : 'Pending'}</span>
                ${i.claimed ? ' <span class="badge badge-blue">Claimed</span>' : ''}
              </div>
              <div class="item-card-meta">📅 ${formatDate(i.date)}</div>
              <div class="item-card-desc">${esc(i.description)}</div>
              <div class="item-card-meta">📞 Contact: ${esc(i.contact)}</div>
              <div style="margin-top:10px;display:flex;gap:8px">
                <button class="btn btn-blue" style="padding:4px 12px;font-size:.78rem" onclick="event.stopPropagation();showItemDetails('${i._id}')">🔍 View Details</button>
                <button class="btn btn-ghost danger" style="padding:4px 10px;font-size:.78rem;border:1px solid #ef4444;color:#ef4444" onclick="event.stopPropagation();deleteItem('${i._id}')">🗑️ Delete</button>
              </div>
            </div>
          </div>
        </div>
      `;
    };
    c.innerHTML=`<div class="stats-grid">
      <div class="stat-card"><div class="stat-num" style="color:var(--blue)">${lost.length}</div><div class="stat-label">Lost</div></div>
      <div class="stat-card"><div class="stat-num" style="color:var(--green)">${found.length}</div><div class="stat-label">Found</div></div>
      <div class="stat-card"><div class="stat-num" style="color:var(--yellow)">${pending}</div><div class="stat-label">Pending</div></div>
      <div class="stat-card"><div class="stat-num" style="color:var(--purple)">${claimed}</div><div class="stat-label">Claimed</div></div>
    </div>`+
    (data.length===0?'<div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">No items yet.</div>':
      `<div class="grid-2">
        <div><h3 style="font-weight:700;margin-bottom:12px;color:var(--blue)">Lost Items</h3>${lost.length===0?'<p style="color:var(--text-muted);font-style:italic">None posted.</p>':'<div class="item-list">'+lost.map(card).join('')+'</div>'}</div>
        <div><h3 style="font-weight:700;margin-bottom:12px;color:var(--green)">Found Items</h3>${found.length===0?'<p style="color:var(--text-muted);font-style:italic">None posted.</p>':'<div class="item-list">'+found.map(card).join('')+'</div>'}</div>
      </div>`);
  } catch(err) { c.innerHTML='<div class="alert alert-error">'+esc(err.message)+'</div>'; }
}

/* ADMIN MANAGEMENT & TABS */
function switchAdminTab(tabName) {
  currentAdminTab = tabName;
  ['approvals', 'users', 'overview'].forEach(tab => {
    const btn = document.getElementById('tab-btn-' + tab);
    const pane = document.getElementById('admin-pane-' + tab);
    if (btn) btn.classList.toggle('active', tab === tabName);
    if (pane) pane.classList.toggle('hidden', tab !== tabName);
  });

  if (tabName === 'approvals') loadApprovalQueue();
  else if (tabName === 'users') loadUsersManagement();
  else if (tabName === 'overview') loadAdminOverview();
}

async function loadApprovalQueue() {
  if (!isLoggedIn() || !isAdmin()) {
    const el = document.getElementById('approval-content');
    if (el) el.innerHTML = '<div class="alert alert-error">Access denied.</div>';
    return;
  }
  const c = document.getElementById('approval-content');
  if (!c) return;
  c.innerHTML = '<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const data = await apiFetch('/api/items');
    const pending = data.filter(i => (i.type === 'lost' && !i.approved) || (i.type === 'found' && !i.verified));
    if (!pending.length) {
      c.innerHTML = `
        <div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">
          <div style="font-size:2.6rem;margin-bottom:8px">🎉</div>
          <div style="font-weight:700;font-size:1.1rem;color:var(--text)">All clear!</div>
          <div style="font-size:.85rem;margin-top:4px">No pending items requiring review.</div>
        </div>
      `;
      return;
    }
    c.innerHTML = '<div class="item-list">' + pending.map(item => `
      <div class="item-card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:14px">
        <div style="flex:1;min-width:240px">
          <div class="item-card-title">
            <span>${esc(item.title)}</span>
            <span class="badge ${item.type === 'lost' ? 'badge-red' : 'badge-green'}">${item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}</span>
          </div>
          <div class="item-card-meta">📅 ${formatDate(item.date)} ${item.location && item.location.address ? '• 📍 ' + esc(item.location.address) : ''}</div>
          <div class="item-card-desc">${esc(item.description)}</div>
          <div class="item-card-meta">📞 Contact: ${esc(item.contact || 'None')}</div>
        </div>
        <div style="display:flex;gap:8px;align-items:center">
          <button class="btn btn-blue" style="padding:6px 14px;font-size:.84rem" onclick="showItemDetails('${item._id}')">🔍 Inspect</button>
          <button class="btn btn-green" style="padding:6px 14px;font-size:.84rem" onclick="approveItem('${item._id}','${item.type}')">✓ ${item.type === 'lost' ? 'Approve' : 'Verify'}</button>
          <button class="btn btn-ghost danger" style="padding:6px 12px;font-size:.84rem;border:1px solid #ef4444;color:#ef4444" onclick="deleteItem('${item._id}')">✕ Reject</button>
        </div>
      </div>
    `).join('') + '</div>';
  } catch(err) {
    c.innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
  }
}

async function approveItem(id, type) {
  try {
    await apiFetch('/api/items/' + id + '/' + (type === 'lost' ? 'approve' : 'verify'), { method: 'POST' });
    showToast(type === 'lost' ? 'Item approved!' : 'Item verified!', 'success');
    loadApprovalQueue();
  } catch(err) {
    showToast(err.message, 'error');
  }
}

async function loadUsersManagement() {
  if (!isLoggedIn() || !isAdmin()) {
    const el = document.getElementById('users-content');
    if (el) el.innerHTML = '<div class="alert alert-error">Access denied.</div>';
    return;
  }
  const c = document.getElementById('users-content');
  if (!c) return;
  c.innerHTML = '<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const users = await apiFetch('/api/auth/users');
    if (!users.length) {
      c.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--text-muted)">No registered users found.</div>';
      return;
    }
    c.innerHTML = '<div class="item-list">' + users.map(user => {
      const isUserAdmin = user.role === 'admin' || ADMIN_EMAILS.some(e => e.toLowerCase() === (user.email || '').toLowerCase());
      const isSelf = currentUser && (currentUser.id === user._id || currentUser.email === user.email);
      return `
        <div class="item-card" style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px">
          <div>
            <div class="item-card-title" style="display:flex;align-items:center;gap:8px">
              <span>${isUserAdmin ? '👑' : '👤'} ${esc(user.username || user.email)}</span>
              ${isUserAdmin ? '<span class="admin-badge-mini">ADMIN</span>' : '<span class="user-badge-mini">MEMBER</span>'}
              ${isSelf ? '<span class="badge badge-purple" style="font-size:.65rem">YOU</span>' : ''}
            </div>
            <div class="item-card-meta">${esc(user.email)}</div>
          </div>
          <div>
            ${!isSelf ? `<button class="btn btn-ghost danger" style="border:1px solid #ef4444;color:#ef4444;padding:6px 12px;font-size:.82rem" onclick="deleteUser('${user._id}')">🗑️ Remove User</button>` : '<span style="font-size:.8rem;color:var(--text-muted);font-style:italic">Active Session</span>'}
          </div>
        </div>
      `;
    }).join('') + '</div>';
  } catch(err) {
    c.innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
  }
}

async function deleteUser(id) {
  if (!confirm('Are you sure you want to remove this user?')) return;
  try {
    await apiFetch('/api/auth/users/' + id, { method: 'DELETE' });
    showToast('User removed successfully.', 'success');
    loadUsersManagement();
  } catch(err) {
    showToast(err.message, 'error');
  }
}

async function loadAdminOverview() {
  if (!isLoggedIn() || !isAdmin()) return;
  const c = document.getElementById('admin-stats-content');
  if (!c) return;
  c.innerHTML = '<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';
  try {
    const [items, users] = await Promise.all([
      apiFetch('/api/items'),
      apiFetch('/api/auth/users').catch(() => [])
    ]);

    const totalLost = items.filter(i => i.type === 'lost').length;
    const totalFound = items.filter(i => i.type === 'found').length;
    const pendingCount = items.filter(i => (i.type === 'lost' && !i.approved) || (i.type === 'found' && !i.verified)).length;

    c.innerHTML = `
      <div class="stats-grid" style="margin-bottom:24px">
        <div class="stat-card">
          <div class="stat-num" style="color:var(--yellow)">${pendingCount}</div>
          <div class="stat-label">Pending Approvals</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:var(--blue)">${totalLost}</div>
          <div class="stat-label">Lost Reports</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:var(--green)">${totalFound}</div>
          <div class="stat-label">Found Reports</div>
        </div>
        <div class="stat-card">
          <div class="stat-num" style="color:var(--indigo)">${users.length}</div>
          <div class="stat-label">Registered Users</div>
        </div>
      </div>

      <div class="card" style="margin-bottom:20px">
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:12px;color:var(--text)">⚡ Quick Management Actions</h3>
        <div style="display:flex;gap:12px;flex-wrap:wrap">
          <button class="btn btn-blue" onclick="switchAdminTab('approvals')">📝 Review Pending Items (${pendingCount})</button>
          <button class="btn btn-ghost" style="border:1px solid var(--border)" onclick="switchAdminTab('users')">👥 Manage Users (${users.length})</button>
          <button class="btn btn-ghost" style="border:1px solid var(--border)" onclick="navigate('location-page')">🗺️ Open Location Map</button>
        </div>
      </div>

      <div class="card">
        <h3 style="font-size:1.05rem;font-weight:700;margin-bottom:12px;color:var(--text)">🛡️ Admin Session Info</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(200px, 1fr));gap:12px;font-size:0.875rem">
          <div><span style="color:var(--text-muted)">Status:</span> <strong style="color:#16a34a">✓ Authenticated</strong></div>
          <div><span style="color:var(--text-muted)">Admin Email:</span> <strong>${esc((currentUser && currentUser.email) || 'N/A')}</strong></div>
          <div><span style="color:var(--text-muted)">Role:</span> <strong style="color:#f59e0b">Administrator (Full Access)</strong></div>
          <div><span style="color:var(--text-muted)">Backend URL:</span> <strong>${API_URL.includes('localhost') ? 'Local Server (5000)' : 'Production Cloud'}</strong></div>
        </div>
      </div>
    `;
  } catch(err) {
    c.innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
  }
}

/* MAPS & GEOCODING */
async function reverseGeocode(lat, lng) {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
    if (res.ok) {
      const data = await res.json();
      return data.display_name || '';
    }
  } catch(e) {}
  return '';
}

async function geocodeSearch(query) {
  if (!query || !query.trim()) return null;
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query.trim())}&limit=1`;
  const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
  if (!res.ok) throw new Error('Search request failed. Please check network.');
  const data = await res.json();
  if (!data || !data.length) throw new Error('Location or pincode not found. Try adding city or landmark.');
  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
    displayName: data[0].display_name
  };
}

async function setPickerLocation(type, lat, lng, knownAddress) {
  const isLost = type === 'lost';
  const map = isLost ? lostMapPicker : foundMapPicker;
  const infoEl = document.getElementById(type + '-location-info');
  const linkEl = document.getElementById(type + '-map-link');

  if (isLost) {
    if (lostMapMarker && map) map.removeLayer(lostMapMarker);
    lostSelectedLoc = { lat, lng, address: knownAddress || '' };
    if (map) lostMapMarker = L.marker([lat, lng]).addTo(map);
  } else {
    if (foundMapMarker && map) map.removeLayer(foundMapMarker);
    foundSelectedLoc = { lat, lng, address: knownAddress || '' };
    if (map) foundMapMarker = L.marker([lat, lng]).addTo(map);
  }

  if (infoEl) {
    infoEl.classList.remove('hidden');
    infoEl.innerHTML = `📍 <b>Selected Coordinates:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)} <br><span style="font-size:0.82rem;color:var(--text-muted)">${knownAddress ? esc(knownAddress) : 'Fetching place address...'}</span>`;
  }
  if (linkEl) linkEl.classList.remove('hidden');

  if (!knownAddress) {
    const addr = await reverseGeocode(lat, lng);
    if (addr) {
      if (isLost && lostSelectedLoc) lostSelectedLoc.address = addr;
      if (!isLost && foundSelectedLoc) foundSelectedLoc.address = addr;
      if (infoEl) {
        infoEl.innerHTML = `📍 <b>Selected Coordinates:</b> ${lat.toFixed(5)}, ${lng.toFixed(5)} <br><span style="font-size:0.85rem;color:var(--text);font-weight:600">🏠 ${esc(addr)}</span>`;
      }
    }
  }
}

async function searchLocation(target) {
  let inputId, btnId;
  if (target === 'lost') { inputId = 'lost-loc-search'; btnId = 'lost-search-btn'; }
  else if (target === 'found') { inputId = 'found-loc-search'; btnId = 'found-search-btn'; }
  else { inputId = 'main-map-search'; btnId = 'main-search-btn'; }

  const input = document.getElementById(inputId);
  const btn = document.getElementById(btnId);
  if (!input) return;
  const q = input.value.trim();
  if (!q) { showToast('Please enter a place name or pincode to search.', 'info'); return; }

  const originalText = btn ? btn.textContent : '';
  if (btn) { btn.textContent = 'Searching...'; btn.disabled = true; }

  try {
    const res = await geocodeSearch(q);
    if (target === 'lost') {
      if (!lostMapPicker) initLostMap();
      setTimeout(() => {
        if (lostMapPicker) lostMapPicker.setView([res.lat, res.lng], 16, { animate: true });
        setPickerLocation('lost', res.lat, res.lng, res.displayName);
      }, 100);
      showToast('Found: ' + res.displayName.slice(0, 45) + '...', 'success');
    } else if (target === 'found') {
      if (!foundMapPicker) initFoundMap();
      setTimeout(() => {
        if (foundMapPicker) foundMapPicker.setView([res.lat, res.lng], 16, { animate: true });
        setPickerLocation('found', res.lat, res.lng, res.displayName);
      }, 100);
      showToast('Found: ' + res.displayName.slice(0, 45) + '...', 'success');
    } else {
      if (mapViewInstance) {
        mapViewInstance.setView([res.lat, res.lng], 15, { animate: true });
        L.popup()
          .setLatLng([res.lat, res.lng])
          .setContent(`<b>📍 Search Result:</b><br>${esc(res.displayName)}`)
          .openOn(mapViewInstance);
        showToast('Zoomed to: ' + res.displayName.slice(0, 45) + '...', 'success');
      }
    }
  } catch(err) {
    showToast(err.message || 'Location not found', 'error');
  } finally {
    if (btn) { btn.textContent = originalText; btn.disabled = false; }
  }
}

function useCurrentLocation(target) {
  if (!navigator.geolocation) {
    showToast('Geolocation is not supported by your browser.', 'error');
    return;
  }

  let btnId;
  if (target === 'lost') btnId = 'lost-gps-btn';
  else if (target === 'found') btnId = 'found-gps-btn';
  else btnId = 'main-gps-btn';
  const btn = document.getElementById(btnId);
  const originalText = btn ? btn.textContent : '';
  if (btn) { btn.textContent = '⏳ Locating...'; btn.disabled = true; }

  showToast('Acquiring your GPS position...', 'info');

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      if (target === 'lost') {
        if (!lostMapPicker) initLostMap();
        setTimeout(async () => {
          if (lostMapPicker) lostMapPicker.setView([lat, lng], 16, { animate: true });
          const addr = await reverseGeocode(lat, lng);
          setPickerLocation('lost', lat, lng, addr);
        }, 100);
        showToast('GPS Location acquired!', 'success');
      } else if (target === 'found') {
        if (!foundMapPicker) initFoundMap();
        setTimeout(async () => {
          if (foundMapPicker) foundMapPicker.setView([lat, lng], 16, { animate: true });
          const addr = await reverseGeocode(lat, lng);
          setPickerLocation('found', lat, lng, addr);
        }, 100);
        showToast('GPS Location acquired!', 'success');
      } else {
        if (mapViewInstance) {
          mapViewInstance.setView([lat, lng], 15, { animate: true });
          L.circle([lat, lng], { radius: 100, color: '#0284c7', fillOpacity: 0.2 }).addTo(mapViewInstance);
          L.popup()
            .setLatLng([lat, lng])
            .setContent('<b>🎯 Your Current Location</b>')
            .openOn(mapViewInstance);
          showToast('Zoomed to your location!', 'success');
        }
      }
      if (btn) { btn.textContent = originalText; btn.disabled = false; }
    },
    (err) => {
      let msg = 'Could not retrieve your location.';
      if (err.code === 1) msg = 'Location permission denied. Please allow location access in your browser.';
      else if (err.code === 2) msg = 'Location unavailable. Please try place or pincode search.';
      else if (err.code === 3) msg = 'Location request timed out.';
      showToast(msg, 'error');
      if (btn) { btn.textContent = originalText; btn.disabled = false; }
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
  );
}

function initLostMap() {
  if (lostMapInit) { setTimeout(() => { if(lostMapPicker) lostMapPicker.invalidateSize(); }, 200); return; }
  lostMapInit = true;
  setTimeout(() => {
    lostMapPicker = L.map('map-picker-lost').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(lostMapPicker);
    lostMapPicker.on('click', function(e) {
      setPickerLocation('lost', e.latlng.lat, e.latlng.lng);
    });
  }, 200);
}

function initFoundMap() {
  if (foundMapInit) { setTimeout(() => { if(foundMapPicker) foundMapPicker.invalidateSize(); }, 200); return; }
  foundMapInit = true;
  setTimeout(() => {
    foundMapPicker = L.map('map-picker-found').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(foundMapPicker);
    foundMapPicker.on('click', function(e) {
      setPickerLocation('found', e.latlng.lat, e.latlng.lng);
    });
  }, 200);
}

/* MAPS & ITEM DETAILS */
let modalMiniMap = null;
let allMapItems = [];
let currentMapFilter = 'all';
let mapMarkers = [];

function createMarkerIcon(type) {
  const isLost = type === 'lost';
  const color = isLost ? '#ef4444' : '#22c55e';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="42">
    <path fill="${color}" stroke="#ffffff" stroke-width="2" d="M12 0C5.37 0 0 5.37 0 12c0 9 12 24 12 24s12-15 12-24c0-6.63-5.37-12-12-12z"/>
    <circle cx="12" cy="12" r="5" fill="#ffffff"/>
  </svg>`;
  return L.divIcon({
    className: 'custom-map-pin',
    html: svg,
    iconSize: [30, 42],
    iconAnchor: [15, 42],
    popupAnchor: [0, -38]
  });
}

async function initMapView() {
  const container = document.getElementById('map-view-container');
  if (!container) return;

  if (!mapViewInstance) {
    mapViewInstance = L.map('map-view-container').setView([12.9716, 77.5946], 13);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(mapViewInstance);
  } else {
    setTimeout(() => mapViewInstance.invalidateSize(), 200);
  }

  try {
    const data = await apiFetch('/api/items');
    allMapItems = data.filter(i => i.location && i.location.lat && i.location.lng);
    renderMapMarkers();
  } catch(err) {
    console.error('Failed to load map items:', err);
  }
}

function filterMapItems(filter) {
  currentMapFilter = filter;
  ['all', 'lost', 'found'].forEach(f => {
    const btn = document.getElementById('filter-' + f);
    if (btn) btn.classList.toggle('active', f === filter);
  });
  renderMapMarkers();
}

function renderMapMarkers() {
  if (!mapViewInstance) return;

  mapMarkers.forEach(m => mapViewInstance.removeLayer(m));
  mapMarkers = [];

  const filtered = allMapItems.filter(item => {
    if (currentMapFilter === 'all') return true;
    return item.type === currentMapFilter;
  });

  const bounds = [];

  filtered.forEach(item => {
    const latLng = [item.location.lat, item.location.lng];
    bounds.push(latLng);
    const icon = createMarkerIcon(item.type);
    const isLost = item.type === 'lost';

    const popupContent = `
      <div style="font-family:var(--font);min-width:220px;padding:2px">
        ${item.image ? `
          <div style="margin-bottom:10px;border-radius:8px;overflow:hidden;height:130px;background:#090d16;border:1px solid rgba(0,0,0,0.1)">
            <img src="${item.image}" alt="${esc(item.title)}" style="width:100%;height:100%;object-fit:cover;display:block" onerror="this.parentElement.style.display='none'" />
          </div>
        ` : ''}
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px">
          <span class="badge ${isLost ? 'badge-red' : 'badge-green'}">${isLost ? '🔴 Lost' : '🟢 Found'}</span>
          <span style="font-size:0.72rem;color:#64748b">${formatDate(item.date)}</span>
        </div>
        <div style="font-weight:700;font-size:0.98rem;margin-bottom:4px;color:#0f172a">${esc(item.title)}</div>
        <div style="font-size:0.8rem;color:#475569;margin-bottom:6px;line-height:1.4">${esc(item.description.slice(0, 80))}${item.description.length > 80 ? '...' : ''}</div>
        ${item.location.address ? `<div style="font-size:0.75rem;color:#64748b;margin-bottom:10px">📍 ${esc(item.location.address)}</div>` : ''}
        <button class="btn btn-blue" onclick="showItemDetails('${item._id}')" style="width:100%;padding:6px 10px;font-size:0.82rem">🔍 View Full Details</button>
      </div>
    `;

    const marker = L.marker(latLng, { icon })
      .addTo(mapViewInstance)
      .bindPopup(popupContent);
    mapMarkers.push(marker);
  });

  if (bounds.length > 0) {
    mapViewInstance.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
  }

  const listEl = document.getElementById('map-items-list');
  if (listEl) {
    if (!filtered.length) {
      listEl.innerHTML = '<div class="card" style="text-align:center;color:var(--text-muted);padding:24px">No items match the current filter.</div>';
    } else {
      listEl.innerHTML = '<h3 style="font-size:1.1rem;font-weight:700;margin-bottom:12px">Items On Map (' + filtered.length + ')</h3><div class="item-list">' +
        filtered.map(item => `
          <div class="item-card" onclick="panToItem('${item._id}', ${item.location.lat}, ${item.location.lng})">
            <div style="display:flex;gap:14px;align-items:flex-start">
              ${item.image ? `
                <div class="item-card-thumb-wrap">
                  <img src="${item.image}" alt="${esc(item.title)}" class="item-card-thumb" onerror="this.onerror=null;this.parentElement.innerHTML='<div class=\\'item-card-thumb-placeholder\\'><span>${item.type === 'lost' ? '🔍' : '📦'}</span></div>'" />
                </div>
              ` : `
                <div class="item-card-thumb-placeholder">
                  <span>${item.type === 'lost' ? '🔍' : '📦'}</span>
                </div>
              `}
              <div style="flex:1;min-width:0">
                <div class="item-card-title">
                  <span>${esc(item.title)}</span>
                  <span class="badge ${item.type === 'lost' ? 'badge-red' : 'badge-green'}">${item.type === 'lost' ? '🔴 Lost' : '🟢 Found'}</span>
                </div>
                <div class="item-card-desc">${esc(item.description)}</div>
                <div class="item-card-meta">
                  <span>📍 ${esc(item.location.address || 'Selected Location')}</span>
                  <span>📅 ${formatDate(item.date)}</span>
                  <span>👤 ${esc((item.createdBy && item.createdBy.username) || 'User')}</span>
                </div>
                <div style="margin-top:10px;display:flex;gap:10px">
                  <button class="btn btn-blue" style="padding:4px 12px;font-size:0.8rem" onclick="event.stopPropagation();showItemDetails('${item._id}')">🔍 View Details Card</button>
                  <button class="btn btn-ghost" style="padding:4px 12px;font-size:0.8rem;border:1px solid var(--border)" onclick="event.stopPropagation();panToItem('${item._id}', ${item.location.lat}, ${item.location.lng})">📍 Focus on Map</button>
                </div>
              </div>
            </div>
          </div>
        `).join('') + '</div>';
    }
  }
}

function panToItem(id, lat, lng) {
  if (mapViewInstance) {
    mapViewInstance.setView([lat, lng], 16, { animate: true });
    const mapEl = document.getElementById('map-view-container');
    if (mapEl) window.scrollTo({ top: mapEl.offsetTop - 80, behavior: 'smooth' });
    const m = mapMarkers.find(marker => {
      const p = marker.getLatLng();
      return Math.abs(p.lat - lat) < 0.0001 && Math.abs(p.lng - lng) < 0.0001;
    });
    if (m) m.openPopup();
  }
}

async function showItemDetails(itemId) {
  const modal = document.getElementById('item-details-modal');
  const titleEl = document.getElementById('modal-item-title');
  const badgeEl = document.getElementById('modal-item-badge');
  const bodyEl = document.getElementById('modal-item-body');

  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  bodyEl.innerHTML = '<div style="text-align:center;padding:40px"><div class="spinner"></div></div>';

  try {
    const item = await apiFetch('/api/items/' + itemId);
    const isLost = item.type === 'lost';
    badgeEl.className = 'badge ' + (isLost ? 'badge-red' : 'badge-green');
    badgeEl.textContent = isLost ? '🔴 Lost Item' : '🟢 Found Item';
    titleEl.textContent = item.title;

    const canDelete = currentUser && (
      (item.createdBy && ((item.createdBy._id && item.createdBy._id === currentUser.id) || item.createdBy === currentUser.id)) ||
      isAdmin()
    );

    bodyEl.innerHTML = `
      ${item.image ? `
        <div style="margin-bottom:16px;border-radius:12px;overflow:hidden;border:1.5px solid var(--border);background:#090d16;text-align:center;box-shadow:var(--shadow-sm)">
          <img src="${item.image}" alt="${esc(item.title)}" style="max-height:280px;width:100%;object-fit:contain;display:block;margin:0 auto" onerror="this.parentElement.style.display='none'" />
        </div>
      ` : ''}

      <div style="font-size:1rem;color:var(--text);line-height:1.6;margin-bottom:16px">${esc(item.description)}</div>

      <div class="detail-grid">
        <div class="detail-card">
          <div class="detail-label">👤 Reported By</div>
          <div class="detail-val">${esc((item.createdBy && item.createdBy.username) || 'Anonymous')}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">📅 Date Reported</div>
          <div class="detail-val">${formatDate(item.date)}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">📞 Contact Info</div>
          <div class="detail-val">${esc(item.contact || 'No contact specified')}</div>
        </div>
        <div class="detail-card">
          <div class="detail-label">🛡️ Verification Status</div>
          <div class="detail-val">
            ${item.approved ? '<span style="color:#16a34a">✓ Approved</span>' : '<span style="color:#ca8a04">⏳ Pending</span>'}
            ${item.claimed ? ' • <span style="color:#dc2626">Claimed</span>' : ' • <span style="color:#2563eb">Available</span>'}
          </div>
        </div>
      </div>

      ${item.location ? `
        <div style="margin-top:16px">
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px">
            <div style="font-weight:700;font-size:.9rem;color:var(--text)">📍 Location: ${esc(item.location.address || 'Selected Coordinates')}</div>
            <button class="btn btn-blue" style="padding:4px 12px;font-size:.8rem" onclick="window.open('https://www.google.com/maps?q=${item.location.lat},${item.location.lng}','_blank')">🗺️ Open Google Maps</button>
          </div>
          <div id="modal-map-container" class="mini-map-box"></div>
        </div>
      ` : '<div style="color:var(--text-muted);font-style:italic;margin-top:12px">📍 No location coordinates provided for this item.</div>'}

      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:20px;border-top:1px solid var(--border);padding-top:16px;flex-wrap:wrap;gap:10px">
        <div>
          ${canDelete ? `<button class="btn btn-ghost danger" style="border:1px solid #ef4444;color:#ef4444;font-size:.84rem" onclick="deleteItem('${item._id}')">🗑️ Delete Item</button>` : ''}
        </div>
        <div style="display:flex;gap:10px">
          <button class="btn btn-ghost" style="border:1px solid var(--border)" onclick="closeItemModal()">Close</button>
          <button class="btn ${isLost ? 'btn-green' : 'btn-blue'}" onclick="contactReporter('${esc(item.contact || '')}')">✉️ Contact Reporter</button>
        </div>
      </div>
    `;

    if (item.location && item.location.lat && item.location.lng) {
      setTimeout(() => {
        if (modalMiniMap) { modalMiniMap.remove(); modalMiniMap = null; }
        const mapEl = document.getElementById('modal-map-container');
        if (mapEl) {
          modalMiniMap = L.map('modal-map-container').setView([item.location.lat, item.location.lng], 15);
          L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap' }).addTo(modalMiniMap);
          const icon = createMarkerIcon(item.type);
          L.marker([item.location.lat, item.location.lng], { icon }).addTo(modalMiniMap)
            .bindPopup(`<b>${esc(item.title)}</b><br>${esc(item.location.address || '')}`).openPopup();
          modalMiniMap.invalidateSize();
        }
      }, 150);
    }
  } catch(err) {
    bodyEl.innerHTML = '<div class="alert alert-error">' + esc(err.message) + '</div>';
  }
}

async function deleteItem(id) {
  if (!confirm('Are you sure you want to delete this item?')) return;
  try {
    await apiFetch('/api/items/' + id, { method: 'DELETE' });
    showToast('Item deleted successfully.', 'success');
    closeItemModal();
    if (currentPage === 'lost-list') loadLostList();
    else if (currentPage === 'found-list') loadFoundList();
    else if (currentPage === 'location-page') initMapView();
    else if (currentPage === 'history') loadHistory();
    else if (currentPage === 'admin-dashboard') {
      if (currentAdminTab === 'approvals') loadApprovalQueue();
      else if (currentAdminTab === 'overview') loadAdminOverview();
    }
  } catch(err) {
    showToast(err.message || 'Failed to delete item', 'error');
  }
}


function contactReporter(contact) {
  if (!contact) { showToast('No contact information provided.', 'info'); return; }
  if (contact.includes('@')) {
    window.location.href = 'mailto:' + encodeURIComponent(contact) + '?subject=' + encodeURIComponent('Regarding your item on Findora');
  } else {
    navigator.clipboard.writeText(contact).then(() => showToast('Contact copied: ' + contact, 'success')).catch(() => showToast('Contact: ' + contact, 'info'));
  }
}

function closeItemModal() {
  document.getElementById('item-details-modal').classList.add('hidden');
  document.body.style.overflow = '';
  if (modalMiniMap) { modalMiniMap.remove(); modalMiniMap = null; }
}

function handleModalBackdropClick(e) {
  if (e.target && e.target.id === 'item-details-modal') closeItemModal();
}

function openMapLost() { if(lostSelectedLoc) window.open('https://www.google.com/maps/search/?api=1&query='+lostSelectedLoc.lat+','+lostSelectedLoc.lng,'_blank'); }
function openMapFound() { if(foundSelectedLoc) window.open('https://www.google.com/maps/search/?api=1&query='+foundSelectedLoc.lat+','+foundSelectedLoc.lng,'_blank'); }

/* INIT */
function routeFromHash() {
  const hash=window.location.hash.replace('#','')||'home';
  navigate(PAGES.includes(hash)?hash:'not-found', true);
}

window.addEventListener('hashchange', routeFromHash);

document.addEventListener('DOMContentLoaded', function() {
  document.getElementById('footer-year').textContent = new Date().getFullYear();
  initDark();
  loadUserFromStorage();
  updateNav();
  updateSidebar();
  routeFromHash();
});

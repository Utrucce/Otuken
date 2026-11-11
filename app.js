/**
 * ============================================================================
 * ÖTÜKEN — Erlerin Gelişim Ağı (Canlı Sosyal Platform)
 * ============================================================================
 */

import { FIREBASE_CONFIG, FOUNDER_EMAIL } from './firebase-config.js';

const OTAGLAR = [
  { id: 'all', icon: '🏛️', name: 'Tüm Otağlar', short: 'Ortak Akış', badge: '🏛️ Tüm Otağlar' },
  { id: 'kurultay', icon: '🔥', name: 'Kurultay Meydanı', short: 'Tanışma & Sohbet', badge: '🔥 Kurultay Meydanı' },
  { id: 'spor', icon: '🏋️‍♂️', name: 'Alp Otağı (Spor)', short: 'Kuvvet, Kalistenik & Koşu', badge: '🏋️‍♂️ Alp Otağı (Spor)' },
  { id: 'kitap', icon: '📚', name: 'Bilge Otağı (Kitap)', short: 'Kitap, Tarih & Felsefe', badge: '📚 Bilge Otağı (Kitap)' },
  { id: 'robotik', icon: '🤖', name: 'Demirci Otağı (Robotik)', short: 'Arduino, ESP32 & Devre', badge: '🤖 Demirci Otağı (Robotik)' },
  { id: 'yazilim', icon: '💻', name: 'Bilişim & Yazılım', short: 'Yapay Zekâ, Web & Mobil', badge: '💻 Bilişim & Yazılım' },
  { id: 'kervan', icon: '🧭', name: 'Kervan & Tecrübe', short: 'Kariyer, Doğa & Hayat', badge: '🧭 Kervan & Tecrübe' }
];

const INITIAL_CHALLENGES = [
  {
    id: 'ch-seher',
    icon: '🌅',
    title: '30 Gün Erken Kalkış (06.00) & Disiplin Zinciri',
    category: 'İrade & Disiplin',
    desc: 'Güne erken başlayıp ilk saati telefonsuz şekilde okuma, idman veya üretime ayırma hedefi.',
    targetDays: 30,
    participants: 0,
    myDays: 0
  },
  {
    id: 'ch-idman',
    icon: '🏋️‍♂️',
    title: '30 Günde 20 Antrenman Hedefi',
    category: 'Alp Otağı (Spor)',
    desc: 'Haftada en az 4-5 gün ağırlık, kalistenik veya koşu antrenmanını tamamlama zinciri.',
    targetDays: 20,
    participants: 0,
    myDays: 0
  },
  {
    id: 'ch-kitap',
    icon: '📚',
    title: 'Her Gün 30 Sayfa Kitap Okuma Zinciri',
    category: 'Bilge Otağı (Kitap)',
    desc: 'Her gün en az 30 sayfa kitap okumak ve öğrendiklerini otağda paylaşmak.',
    targetDays: 30,
    participants: 0,
    myDays: 0
  },
  {
    id: 'ch-pusat',
    icon: '🤖',
    title: '30 Günde 1 Robotik veya Yazılım Projesi Bitirme',
    category: 'Demirci & Yazılım',
    desc: 'Her gün düzenli kod yazarak veya devre kurarak çalışan bir proje ortaya çıkarmak.',
    targetDays: 30,
    participants: 0,
    myDays: 0
  }
];

const INITIAL_POLLS = [
  {
    id: 'poll-kitap',
    title: '📚 Bilge Otağı: Bu Ay Hangi Kitabı Birlikte Okuyalım?',
    options: [
      { label: 'Yusuf Has Hâcib — Kutadgu Bilig', votes: 0 },
      { label: 'Ziya Gökalp — Türk Töresi', votes: 0 },
      { label: 'Cengiz Aytmatov — Gün Olur Asra Bedel', votes: 0 },
      { label: 'Marcus Aurelius — Kendime Düşünceler', votes: 0 }
    ]
  },
  {
    id: 'poll-proje',
    title: '🤖 Demirci & Yazılım Otağı: Ortak Projemiz Ne Olsun?',
    options: [
      { label: 'Arduino / ESP32 Akıllı Sensör & Uyarı İstasyonu', votes: 0 },
      { label: 'Açık Kaynak Antrenman & Zincir Takip Uygulaması', votes: 0 },
      { label: 'Türk Mitolojisi ve Tarihi Etkileşimli Harita Atlası', votes: 0 }
    ]
  }
];

function computeRank(kut, email) {
  if (email && FOUNDER_EMAIL && email.toLowerCase() === FOUNDER_EMAIL.toLowerCase()) return 'Başbuğ (Kurucu)';
  const k = Number(kut) || 0;
  if (k >= 1000) return 'Toy Beyi';
  if (k >= 600) return 'Bilge';
  if (k >= 300) return 'Bahadır';
  if (k >= 100) return 'Alp';
  return 'Er';
}

let state = {
  activeView: 'otaglar',
  activeOtag: 'all',
  searchQuery: '',
  currentUser: null,
  pendingVerificationUser: null,
  pendingVerifyCode: '',
  selectedGateTamga: '🐺',
  myBenguTas: null,
  bengutaslar: [],
  bitigler: [],
  chats: [],
  challenges: [],
  andaList: [],
  polls: [],
  votedPolls: {},
  isFirebaseLive: false,
  db: null,
  auth: null,
  firebaseModules: null
};

// ============================================================================
// 1. YEREL DURUM & TEMİZ VERİ YÖNETİMİ (SIFIR MOCKUP)
// ============================================================================
function loadLocalState() {
  try {
    // Eski sahte/mockup kayıtları tamamen temizle
    [
      'otuken_bengutaslar', 'otuken_bitigler', 'otuken_chats',
      'otuken_challenges', 'otuken_andalist', 'otuken_polls',
      'otuken_voted_polls', 'otuken_my_bengutas'
    ].forEach(k => localStorage.removeItem(k));

    state.bengutaslar = JSON.parse(localStorage.getItem('otuken_v3_bengutaslar')) || [];
    state.bitigler = JSON.parse(localStorage.getItem('otuken_v3_bitigler')) || [];
    state.chats = JSON.parse(localStorage.getItem('otuken_v3_chats')) || [];
    state.challenges = JSON.parse(localStorage.getItem('otuken_v3_challenges')) || INITIAL_CHALLENGES;
    state.andaList = JSON.parse(localStorage.getItem('otuken_v3_andalist')) || [];
    state.polls = JSON.parse(localStorage.getItem('otuken_v3_polls')) || INITIAL_POLLS;
    state.votedPolls = JSON.parse(localStorage.getItem('otuken_v3_voted_polls')) || {};

    const savedUser = localStorage.getItem('otuken_v3_current_user');
    const savedBt = localStorage.getItem('otuken_v3_my_bengutas');
    if (savedUser) state.currentUser = JSON.parse(savedUser);
    if (savedBt) state.myBenguTas = JSON.parse(savedBt);
  } catch (e) {
    state.bengutaslar = [];
    state.bitigler = [];
    state.chats = [];
    state.challenges = INITIAL_CHALLENGES;
    state.andaList = [];
    state.polls = INITIAL_POLLS;
  }
}

function saveLocalState() {
  try {
    localStorage.setItem('otuken_v3_bengutaslar', JSON.stringify(state.bengutaslar));
    localStorage.setItem('otuken_v3_bitigler', JSON.stringify(state.bitigler));
    localStorage.setItem('otuken_v3_chats', JSON.stringify(state.chats));
    localStorage.setItem('otuken_v3_challenges', JSON.stringify(state.challenges));
    localStorage.setItem('otuken_v3_andalist', JSON.stringify(state.andaList));
    localStorage.setItem('otuken_v3_polls', JSON.stringify(state.polls));
    localStorage.setItem('otuken_v3_voted_polls', JSON.stringify(state.votedPolls));
    if (state.currentUser) {
      localStorage.setItem('otuken_v3_current_user', JSON.stringify(state.currentUser));
    } else {
      localStorage.removeItem('otuken_v3_current_user');
    }
    if (state.myBenguTas) {
      localStorage.setItem('otuken_v3_my_bengutas', JSON.stringify(state.myBenguTas));
    } else {
      localStorage.removeItem('otuken_v3_my_bengutas');
    }
  } catch (e) {}
}

function showToast(msg) {
  const el = document.getElementById('otukenToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el.__timer);
  el.__timer = setTimeout(() => el.classList.remove('show'), 3500);
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatRelativeTime(ts) {
  const diff = Math.max(1, Math.floor((Date.now() - Number(ts || Date.now())) / 1000));
  if (diff < 60) return 'Az önce';
  if (diff < 3600) return `${Math.floor(diff / 60)} dk önce`;
  if (diff < 86400) return `${Math.floor(diff / 3600)} saat önce`;
  return `${Math.floor(diff / 86400)} gün önce`;
}

// ============================================================================
// 2. CANLI FIREBASE & FIRESTORE ENTEGRASYONU
// ============================================================================
async function initFirebaseIfConfigured() {
  const badge = document.getElementById('firebaseStatusText');
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) return;

  try {
    const appMod = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-app.js');
    const authMod = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-auth.js');
    const fsMod = await import('https://www.gstatic.com/firebasejs/11.0.1/firebase-firestore.js');

    const app = appMod.initializeApp(FIREBASE_CONFIG);
    const auth = authMod.getAuth(app);
    const db = fsMod.getFirestore(app);

    state.auth = auth;
    state.db = db;
    state.firebaseModules = { ...authMod, ...fsMod };
    state.isFirebaseLive = true;

    if (badge) badge.textContent = 'Canlı • ' + FIREBASE_CONFIG.projectId;

    // Canlı Firestore Dinleyicileri
    const bitigQuery = fsMod.query(fsMod.collection(db, 'bitigler'), fsMod.orderBy('createdAt', 'desc'), fsMod.limit(40));
    fsMod.onSnapshot(bitigQuery, (snap) => {
      state.bitigler = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      saveLocalState();
      renderOtagList();
      renderBitigFeed();
    });

    const btQuery = fsMod.query(fsMod.collection(db, 'bengutaslar'), fsMod.orderBy('kut', 'desc'), fsMod.limit(50));
    fsMod.onSnapshot(btQuery, (snap) => {
      state.bengutaslar = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      if (state.currentUser) {
        const found = state.bengutaslar.find(x => x.uid === state.currentUser.uid);
        if (found) state.myBenguTas = found;
      }
      saveLocalState();
      updateAuthUI();
      renderLeaderboard();
      renderAlpDirectory();
    });

    const chatQuery = fsMod.query(fsMod.collection(db, 'ocak_sohbet'), fsMod.orderBy('createdAt', 'desc'), fsMod.limit(30));
    fsMod.onSnapshot(chatQuery, (snap) => {
      state.chats = snap.docs.map(d => ({ id: d.id, ...d.data() })).reverse();
      saveLocalState();
      renderCampfireChat();
    });

    const andaQuery = fsMod.query(fsMod.collection(db, 'anda_ilanlari'), fsMod.orderBy('createdAt', 'desc'), fsMod.limit(30));
    fsMod.onSnapshot(andaQuery, (snap) => {
      state.andaList = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      saveLocalState();
      renderAndaList();
    });
  } catch (err) {
    console.warn('Firebase bağlantı uyarısı:', err);
  }
}

async function syncUserBenguTas(user, extra = {}) {
  let existing = state.bengutaslar.find(b => b.uid === user.uid);
  if (!existing) {
    existing = {
      uid: user.uid,
      name: extra.name || user.displayName || 'Alp',
      tamga: extra.tamga || state.selectedGateTamga || '🐺',
      city: extra.city || 'Türkiye',
      craft: extra.craft || 'Gelişim Yolcusu',
      book: extra.book || '',
      project: extra.project || '',
      sport: extra.sport || '',
      motto: extra.motto || 'Her gün dünden daha ileriye.',
      kut: user.email && user.email.toLowerCase() === FOUNDER_EMAIL.toLowerCase() ? 1000 : 100,
      streak: 1,
      verified: true,
      isFounder: Boolean(user.email && user.email.toLowerCase() === FOUNDER_EMAIL.toLowerCase())
    };
    state.bengutaslar.unshift(existing);
  } else {
    if (extra.name) existing.name = extra.name;
    if (extra.tamga) existing.tamga = extra.tamga;
    if (extra.craft) existing.craft = extra.craft;
    existing.verified = true;
  }

  state.myBenguTas = existing;
  saveLocalState();

  if (state.isFirebaseLive && state.db && state.firebaseModules) {
    try {
      const { doc, setDoc } = state.firebaseModules;
      await setDoc(doc(state.db, 'bengutaslar', user.uid), existing, { merge: true });
    } catch (e) {}
  }
}

// ============================================================================
// 3. GİRİŞ KAPISI & ARAYÜZ GÜNCELLEME
// ============================================================================
function switchMainView(viewName) {
  state.activeView = viewName;
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.view === viewName);
  });
  document.querySelectorAll('.otuken-view').forEach(v => {
    v.style.display = (v.id === `view-${viewName}`) ? 'block' : 'none';
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateAuthUI() {
  const gateScreen = document.getElementById('authGateScreen');
  const appShell = document.getElementById('appShell');

  const isLoggedAndVerified = Boolean(state.currentUser && state.currentUser.emailVerified);

  if (!isLoggedAndVerified) {
    if (gateScreen) gateScreen.style.display = 'flex';
    if (appShell) appShell.style.display = 'none';
    return;
  }

  // Giriş yapılmışsa Kapıyı kapat, Sosyal Ağı aç
  if (gateScreen) gateScreen.style.display = 'none';
  if (appShell) appShell.style.display = 'block';

  const bt = state.myBenguTas || {
    uid: state.currentUser.uid,
    name: state.currentUser.displayName || 'Alp',
    tamga: '🐺',
    kut: 100,
    streak: 1
  };
  const rank = computeRank(bt.kut, state.currentUser.email);

  const setTxt = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  };

  setTxt('navUserTamga', bt.tamga || '🐺');
  setTxt('navUserName', bt.name);
  setTxt('navUserKut', `${bt.kut} Kut`);
  setTxt('sideTamgaBox', bt.tamga || '🐺');
  setTxt('composerTamga', bt.tamga || '🐺');
  setTxt('sideAlpName', bt.name);
  setTxt('sideAlpRank', rank);
  setTxt('sideAlpKut', `${bt.kut} Kut`);
  setTxt('sideAlpStreak', `🔥 ${bt.streak || 1}G`);

  // Bengü Taşım formunu doldur
  const fName = document.getElementById('btNameInput');
  if (fName) {
    fName.value = bt.name || '';
    document.getElementById('btCityInput').value = bt.city || '';
    document.getElementById('btCraftInput').value = bt.craft || '';
    document.getElementById('btBookInput').value = bt.book || '';
    document.getElementById('btProjectInput').value = bt.project || '';
    document.getElementById('btSportInput').value = bt.sport || '';
    document.getElementById('btMottoInput').value = bt.motto || '';
  }
}

// ============================================================================
// 4. SOSYAL MEDYA AKIŞI VE BİLEŞENLERİN RENDER EDİLMESİ
// ============================================================================
function renderOtagList() {
  const container = document.getElementById('otagSelectorList');
  if (!container) return;

  container.innerHTML = OTAGLAR.map(o => {
    const count = o.id === 'all'
      ? state.bitigler.length
      : state.bitigler.filter(b => b.otag === o.id).length;
    const isActive = state.activeOtag === o.id;
    return `
      <button type="button" class="otag-item ${isActive ? 'active' : ''}" data-otag="${o.id}">
        <div class="otag-icon">${o.icon}</div>
        <div class="otag-info">
          <strong>${escapeHtml(o.name)}</strong>
          <span>${escapeHtml(o.short)}</span>
        </div>
        <span class="pill-badge" style="font-size: 0.7rem; padding: 2px 7px;">${count}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.otag-item').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeOtag = btn.dataset.otag;
      const selected = OTAGLAR.find(x => x.id === state.activeOtag) || OTAGLAR[0];
      const badgeEl = document.getElementById('activeOtagBadge');
      if (badgeEl) badgeEl.textContent = selected.badge;
      const chatLbl = document.getElementById('chatOtagLabel');
      if (chatLbl) chatLbl.textContent = selected.id === 'all' ? 'Kurultay' : selected.name;
      if (selected.id !== 'all') {
        const sel = document.getElementById('bitigOtagSelect');
        if (sel) sel.value = selected.id;
      }
      renderOtagList();
      renderCampfireChat();
      renderBitigFeed();
    });
  });
}

function renderCampfireChat() {
  const strip = document.getElementById('campfireChatStrip');
  if (!strip) return;
  const targetOtag = state.activeOtag === 'all' ? null : state.activeOtag;
  const filtered = targetOtag
    ? state.chats.filter(c => c.otag === targetOtag || c.otag === 'kurultay')
    : state.chats;

  if (filtered.length === 0) {
    strip.innerHTML = `
      <div style="padding: 18px 10px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">
        🔥 Sohbet ocağı hazır. İlk selamı sen yaz!
      </div>
    `;
    return;
  }

  strip.innerHTML = filtered.slice(-20).map(c => `
    <div class="chat-msg-line">
      <div>
        <span class="chat-msg-author">${escapeHtml(c.authorTamga || '🐺')} ${escapeHtml(c.authorName)}:</span>
        <span>${escapeHtml(c.text)}</span>
      </div>
      <span class="chat-msg-time">${escapeHtml(c.time || '')}</span>
    </div>
  `).join('');
  strip.scrollTop = strip.scrollHeight;
}

function renderBitigFeed() {
  const container = document.getElementById('bitigFeedContainer');
  const countEl = document.getElementById('statBitigCount');
  if (!container) return;

  const q = state.searchQuery.trim().toLowerCase();
  const filtered = state.bitigler.filter(b => {
    if (state.activeOtag !== 'all' && b.otag !== state.activeOtag) return false;
    if (!q) return true;
    return (
      (b.title && b.title.toLowerCase().includes(q)) ||
      (b.body && b.body.toLowerCase().includes(q)) ||
      (b.authorName && b.authorName.toLowerCase().includes(q)) ||
      (Array.isArray(b.tags) && b.tags.some(t => t.toLowerCase().includes(q)))
    );
  });

  if (countEl) countEl.textContent = `${filtered.length} Paylaşım`;

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="stone-card" style="text-align: center; padding: 32px 20px;">
        <div style="font-size: 2rem; margin-bottom: 6px;">🔥</div>
        <h3 style="color: #fff; font-size: 1rem; margin-bottom: 4px;">Henüz Paylaşım Yok</h3>
        <p style="color: var(--text-muted); font-size: 0.84rem;">Üstteki kutudan ilk gönderiyi sen paylaş!</p>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(b => {
    const otagMeta = OTAGLAR.find(o => o.id === b.otag) || OTAGLAR[1];
    const tagsHtml = (b.tags || []).map(t => `<span class="bitig-tag">#${escapeHtml(t)}</span>`).join('');
    const snippetHtml = b.snippet
      ? `<pre class="bitig-special-block">${escapeHtml(b.snippet)}</pre>`
      : '';
    const comments = Array.isArray(b.comments) ? b.comments : [];
    const commentsHtml = comments.map(c => `
      <div class="comment-item">
        <strong style="color: var(--fire-amber);">${escapeHtml(c.authorTamga || '🐺')} ${escapeHtml(c.authorName)}:</strong>
        <span style="color: var(--text-secondary); margin-left: 6px;">${escapeHtml(c.text)}</span>
      </div>
    `).join('');

    return `
      <article class="bitig-card">
        <div class="bitig-header">
          <div class="alp-author-chip" data-inspect-uid="${escapeHtml(b.authorUid || '')}">
            <div class="alp-tamga-avatar">${escapeHtml(b.authorTamga || '🐺')}</div>
            <div class="alp-author-meta">
              <strong>
                ${escapeHtml(b.authorName)}
                <span class="alp-rank-tag">${escapeHtml(b.authorRank || 'Er')}</span>
              </strong>
              <span>${formatRelativeTime(b.createdAt)}</span>
            </div>
          </div>
          <span class="pill-badge">${otagMeta.icon} ${escapeHtml(otagMeta.name)}</span>
        </div>

        <h3 class="bitig-title">${escapeHtml(b.title)}</h3>
        <div class="bitig-body">${escapeHtml(b.body)}</div>
        ${snippetHtml}
        ${tagsHtml ? `<div class="bitig-tags">${tagsHtml}</div>` : ''}

        <div class="bitig-actions">
          <div style="display: flex; gap: 8px;">
            <button type="button" class="bitig-action-btn" data-kut-id="${escapeHtml(b.id)}">
              🔥 Kut Ver (Beğen) • <strong>${Number(b.kutCount) || 0}</strong>
            </button>
            <button type="button" class="bitig-action-btn" data-inspect-uid="${escapeHtml(b.authorUid || '')}">
              🗿 Künyesi
            </button>
          </div>
          <span style="font-size: 0.76rem; color: var(--text-muted);">💬 ${comments.length} Yorum</span>
        </div>

        <div class="comments-drawer">
          ${commentsHtml}
          <form class="comment-form" data-bitig-id="${escapeHtml(b.id)}" style="display: flex; gap: 8px; margin-top: 8px;">
            <input type="text" class="input-field" style="padding: 7px 11px; font-size: 0.82rem;" placeholder="Yorum yaz..." maxlength="300" required>
            <button type="submit" class="btn btn-cyan" style="padding: 6px 12px; font-size: 0.8rem;">Gönder</button>
          </form>
        </div>
      </article>
    `;
  }).join('');

  // Kut Ver (Beğeni)
  container.querySelectorAll('[data-kut-id]').forEach(btn => {
    btn.addEventListener('click', async () => {
      const id = btn.dataset.kutId;
      const target = state.bitigler.find(x => x.id === id);
      if (!target) return;
      target.kutCount = (Number(target.kutCount) || 0) + 1;
      if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 2;
      saveLocalState();
      updateAuthUI();
      renderBitigFeed();
      renderLeaderboard();
      showToast('🔥 Gönderiye Kut verdin! (+2 Kut)');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { doc, updateDoc } = state.firebaseModules;
          await updateDoc(doc(state.db, 'bitigler', id), { kutCount: target.kutCount });
        } catch (e) {}
      }
    });
  });

  // Künye İnceleme
  container.querySelectorAll('[data-inspect-uid]').forEach(el => {
    el.addEventListener('click', () => openInspectBenguModal(el.dataset.inspectUid));
  });

  // Yorum Gönderme
  container.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id = form.dataset.bitigId;
      const input = form.querySelector('input');
      const text = input.value.trim();
      if (!text) return;
      const target = state.bitigler.find(x => x.id === id);
      if (!target) return;
      if (!Array.isArray(target.comments)) target.comments = [];
      target.comments.push({
        authorName: state.myBenguTas ? state.myBenguTas.name : state.currentUser.displayName,
        authorTamga: state.myBenguTas ? state.myBenguTas.tamga : '🐺',
        text,
        time: 'Az önce'
      });
      if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 5;
      saveLocalState();
      updateAuthUI();
      renderBitigFeed();
      showToast('💬 Yorumun eklendi! (+5 Kut)');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { doc, updateDoc } = state.firebaseModules;
          await updateDoc(doc(state.db, 'bitigler', id), { comments: target.comments });
        } catch (e) {}
      }
    });
  });
}

function renderLeaderboard() {
  const list = document.getElementById('leaderboardList');
  const countEl = document.getElementById('statAlpCount');
  if (countEl) countEl.textContent = `${state.bengutaslar.length} Üye`;
  if (!list) return;

  const sorted = [...state.bengutaslar].sort((a, b) => (Number(b.kut) || 0) - (Number(a.kut) || 0)).slice(0, 6);
  if (sorted.length === 0) {
    list.innerHTML = `<div style="padding: 12px; text-align: center; color: var(--text-muted); font-size: 0.8rem;">Henüz üye kaydı yok.</div>`;
    return;
  }

  list.innerHTML = sorted.map((alp, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 7px 10px; background: rgba(255,255,255,0.03); border-radius: 9px; cursor: pointer;" data-inspect-uid="${escapeHtml(alp.uid)}">
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-weight: 800; color: var(--fire-amber); font-size: 0.8rem;">#${idx + 1}</span>
        <span>${escapeHtml(alp.tamga || '🐺')}</span>
        <strong style="font-size: 0.83rem; color: #fff;">${escapeHtml(alp.name)}</strong>
      </div>
      <span class="alp-rank-tag">${alp.kut} Kut</span>
    </div>
  `).join('');

  list.querySelectorAll('[data-inspect-uid]').forEach(el => {
    el.addEventListener('click', () => openInspectBenguModal(el.dataset.inspectUid));
  });
}

function renderChallenges() {
  const grid = document.getElementById('challengesGrid');
  if (!grid) return;
  grid.innerHTML = state.challenges.map(ch => {
    const pct = Math.min(100, Math.round(((ch.myDays || 0) / ch.targetDays) * 100));
    return `
      <div class="challenge-card">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span class="pill-badge gold">${ch.icon} ${escapeHtml(ch.category)}</span>
          <span style="font-size: 0.76rem; color: var(--turk-cyan-light); font-weight: 700;">%${pct}</span>
        </div>
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.02rem; color: #fff; margin-bottom: 6px;">${escapeHtml(ch.title)}</h3>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 10px;">${escapeHtml(ch.desc)}</p>
        <div style="font-size: 0.78rem; color: var(--text-muted);">İlerlemen: <strong>${ch.myDays || 0} / ${ch.targetDays} Gün</strong></div>
        <div class="streak-progress-bar"><div class="streak-progress-fill" style="width: ${pct}%;"></div></div>
        <button type="button" class="btn btn-gold" style="width: 100%; margin-top: 8px; padding: 8px;" data-checkin-challenge="${escapeHtml(ch.id)}">
          ⛓️ Bugünü Tamamladım (+15 Kut)
        </button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-checkin-challenge]').forEach(btn => {
    btn.addEventListener('click', () => {
      const ch = state.challenges.find(c => c.id === btn.dataset.checkinChallenge);
      if (!ch) return;
      ch.myDays = Math.min(ch.targetDays, (ch.myDays || 0) + 1);
      if (state.myBenguTas) {
        state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 15;
        state.myBenguTas.streak = (Number(state.myBenguTas.streak) || 0) + 1;
      }
      saveLocalState();
      updateAuthUI();
      renderChallenges();
      renderLeaderboard();
      showToast(`⛓️ "${ch.title}" zincirine +1 gün eklendi!`);
    });
  });
}

function renderAndaList() {
  const grid = document.getElementById('andaCardsGrid');
  if (!grid) return;
  if (state.andaList.length === 0) {
    grid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 28px; color: var(--text-muted); font-size: 0.86rem;">
        🤝 Henüz yol arkadaşı ilanı yok. Sağ üstteki <b>"➕ İlan Aç"</b> düğmesiyle ilk ilanı sen bırak!
      </div>
    `;
    return;
  }

  grid.innerHTML = state.andaList.map(a => `
    <div class="stone-card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 10px;">
          <div class="alp-tamga-avatar">${escapeHtml(a.authorTamga || '🐺')}</div>
          <div>
            <strong style="color: #fff; font-size: 0.94rem; display: block;">${escapeHtml(a.authorName)}</strong>
            <span class="alp-rank-tag">${escapeHtml(a.authorRank || 'Er')}</span>
          </div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--emerald-kut); padding: 7px 10px; border-radius: 6px; margin-bottom: 7px; font-size: 0.82rem;">
          <strong style="color: #34d399; display: block;">⚔️ Yardımcı Olabileceği Alan:</strong>
          <span>${escapeHtml(a.offer)}</span>
        </div>
        <div style="background: rgba(6, 182, 212, 0.1); border-left: 3px solid var(--turk-cyan); padding: 7px 10px; border-radius: 6px; margin-bottom: 9px; font-size: 0.82rem;">
          <strong style="color: var(--turk-cyan-light); display: block;">🧭 Aradığı Çalışma Alanı:</strong>
          <span>${escapeHtml(a.seek)}</span>
        </div>
        <p style="font-size: 0.8rem; color: var(--text-secondary); margin-bottom: 12px;">"${escapeHtml(a.note)}"</p>
      </div>
      <button type="button" class="btn btn-cyan" style="width: 100%;" data-connect-anda="${escapeHtml(a.id)}">
        🤝 Eşleş / Anda Ol (${Number(a.matches) || 0})
      </button>
    </div>
  `).join('');

  grid.querySelectorAll('[data-connect-anda]').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = state.andaList.find(x => x.id === btn.dataset.connectAnda);
      if (!item) return;
      item.matches = (Number(item.matches) || 0) + 1;
      if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 10;
      saveLocalState();
      updateAuthUI();
      renderAndaList();
      showToast(`🤝 ${item.authorName} ile yol arkadaşlığı (Anda) eşleşmen kaydedildi!`);
    });
  });
}

function renderToyPolls() {
  const grid = document.getElementById('toyPollsGrid');
  if (!grid) return;
  grid.innerHTML = state.polls.map(poll => {
    const total = poll.options.reduce((s, o) => s + o.votes, 0) || 1;
    const votedIdx = state.votedPolls[poll.id];
    const optsHtml = poll.options.map((o, idx) => {
      const pct = poll.options.reduce((s, x) => s + x.votes, 0) === 0 ? 0 : Math.round((o.votes / total) * 100);
      const isSelected = votedIdx === idx;
      return `
        <div style="margin-bottom: 9px;">
          <button type="button" class="otag-item ${isSelected ? 'active' : ''}" style="justify-content: space-between; padding: 9px 12px;" data-poll-id="${escapeHtml(poll.id)}" data-opt-idx="${idx}">
            <span style="font-size: 0.84rem; font-weight: 600;">${escapeHtml(o.label)}</span>
            <span class="pill-badge">${o.votes} Oy (%${pct})</span>
          </button>
          <div class="streak-progress-bar" style="height: 6px; margin-top: 4px;">
            <div class="streak-progress-fill" style="width: ${pct}%;"></div>
          </div>
        </div>
      `;
    }).join('');

    return `
      <div class="stone-card" style="margin-bottom: 0;">
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1rem; color: #fff; margin-bottom: 12px;">${escapeHtml(poll.title)}</h3>
        ${optsHtml}
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-poll-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const pid = btn.dataset.pollId;
      const oidx = Number(btn.dataset.optIdx);
      if (state.votedPolls[pid] !== undefined) {
        showToast('⚖️ Bu oylamada zaten oy kullandın kanka.');
        return;
      }
      const poll = state.polls.find(p => p.id === pid);
      if (!poll || !poll.options[oidx]) return;
      poll.options[oidx].votes += 1;
      state.votedPolls[pid] = oidx;
      if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 10;
      saveLocalState();
      updateAuthUI();
      renderToyPolls();
      showToast('⚖️ Oyun kaydedildi! (+10 Kut)');
    });
  });
}

function renderAlpDirectory() {
  const list = document.getElementById('alpDirectoryList');
  if (!list) return;
  if (state.bengutaslar.length === 0) {
    list.innerHTML = `
      <div style="padding: 22px; text-align: center; color: var(--text-muted); font-size: 0.84rem;">
        🗿 Henüz kayıtlı künye yok. Sol taraftan bilgilerini kaydettiğinde burada listelenir.
      </div>
    `;
    return;
  }

  list.innerHTML = state.bengutaslar.map(bt => `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 11px; padding: 12px; cursor: pointer;" data-inspect-uid="${escapeHtml(bt.uid)}">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px;">
        <div style="display: flex; align-items: center; gap: 9px;">
          <div class="alp-tamga-avatar">${escapeHtml(bt.tamga || '🐺')}</div>
          <div>
            <strong style="color: #fff; font-size: 0.94rem;">${escapeHtml(bt.name)}</strong>
            <div style="font-size: 0.75rem; color: var(--text-muted);">📍 ${escapeHtml(bt.city || 'Türkiye')} • ${escapeHtml(bt.craft || 'Üye')}</div>
          </div>
        </div>
        <span class="alp-rank-tag">${escapeHtml(computeRank(bt.kut, bt.isFounder ? FOUNDER_EMAIL : ''))} (${bt.kut} Kut)</span>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-inspect-uid]').forEach(el => {
    el.addEventListener('click', () => openInspectBenguModal(el.dataset.inspectUid));
  });
}

function openInspectBenguModal(uid) {
  const bt = state.bengutaslar.find(x => x.uid === uid) || state.myBenguTas;
  if (!bt) return;
  const modal = document.getElementById('inspectBenguModal');
  const box = document.getElementById('inspectBenguContent');
  if (!modal || !box) return;

  const rank = computeRank(bt.kut, bt.isFounder ? FOUNDER_EMAIL : '');
  box.innerHTML = `
    <div style="text-align: center; margin-bottom: 14px;">
      <div class="alp-tamga-avatar" style="width: 64px; height: 64px; font-size: 2rem; margin: 0 auto 8px;">${escapeHtml(bt.tamga || '🐺')}</div>
      <span class="pill-badge gold">🗿 Bengü Taş (Er Künyesi)</span>
      <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.4rem; color: #fff; margin-top: 6px;">${escapeHtml(bt.name)}</h2>
      <div style="display: flex; justify-content: center; gap: 8px; margin-top: 6px;">
        <span class="alp-rank-tag">${escapeHtml(rank)}</span>
        <span class="pill-badge">${bt.kut} Kut</span>
        <span class="pill-badge green">🔥 ${bt.streak || 1} Gün</span>
      </div>
    </div>
    <div style="background: rgba(255,255,255,0.03); border-left: 3px solid var(--fire-amber); padding: 10px 12px; border-radius: 8px; margin-bottom: 12px; font-style: italic; color: var(--text-secondary);">
      "${escapeHtml(bt.motto || 'Her gün dünden daha ileriye.')}"
    </div>
    <div style="display: flex; flex-direction: column; gap: 7px; font-size: 0.86rem;">
      <div>📍 <strong>Şehir:</strong> ${escapeHtml(bt.city || 'Türkiye')}</div>
      <div>⚒️ <strong>Zanaat / Alan:</strong> ${escapeHtml(bt.craft || '-')}</div>
      <div>📖 <strong>Okuduğu Kitap:</strong> ${escapeHtml(bt.book || '-')}</div>
      <div>🤖 <strong>Çalıştığı Proje:</strong> ${escapeHtml(bt.project || '-')}</div>
      <div>🏋️‍♂️ <strong>Spor Hedefi:</strong> ${escapeHtml(bt.sport || '-')}</div>
    </div>
  `;
  modal.classList.add('open');
}

function openLegalModal(type) {
  const modal = document.getElementById('legalModal');
  const content = document.getElementById('legalModalContent');
  if (!modal || !content) return;

  if (type === 'guide') {
    content.innerHTML = `
      <h2 style="font-family: 'Outfit', sans-serif; color: var(--fire-amber); margin-bottom: 12px;">🧭 Ötüken Kullanım Talimatı</h2>
      <div class="guide-steps-list">
        <div class="guide-step-item"><strong>1. Kayıt ve Doğrulama</strong><p>Gmail ile tek tıkla veya e-posta adresinle kayıt olup doğrulama kodunu onaylayarak giriş yap.</p></div>
        <div class="guide-step-item"><strong>2. Bengü Taşını (Er Künyeni) Doldur</strong><p>Üst menüdeki <b>"🗿 Bengü Taşım"</b> sekmesinden Türk damganı, okuduğun kitabı, spor hedefini ve çalıştığın projeyi kaydet.</p></div>
        <div class="guide-step-item"><strong>3. Otağ Seç ve Paylaş</strong><p><b>"🏠 Akış"</b> sekmesinde sol menüden Spor, Kitap, Robotik Kodlama, Yazılım veya Tecrübe otağını seçip gönderini paylaş.</p></div>
        <div class="guide-step-item"><strong>4. Canlı Sohbet, Zincir ve Anda</strong><p>Sağ sütundan anlık sohbete katıl, <b>"⛓️ İrade Zinciri"</b>nde günlük yoklama ver ve <b>"🤝 Anda Bul"</b>dan çalışma arkadaşı bul.</p></div>
      </div>
    `;
  } else {
    content.innerHTML = `
      <h2 style="font-family: 'Outfit', sans-serif; color: var(--turk-cyan-light); margin-bottom: 12px;">📜 Ötüken Kullanıcı Sözleşmesi</h2>
      <div class="guide-steps-list">
        <div class="guide-step-item"><strong>1. Topluluk Amacı</strong><p>Ötüken; spor, kitap okuma, robotik kodlama, yazılım ve kişisel gelişim alanlarında yardımlaşma amacıyla kurulmuş ücretsiz bir topluluktur.</p></div>
        <div class="guide-step-item"><strong>2. Gerçek Kimlik ve Doğrulama</strong><p>Her üye doğrulanmış e-posta/Gmail hesabıyla katılır. Başkası adına veya yanıltıcı hesap açılamaz.</p></div>
        <div class="guide-step-item"><strong>3. İçerik ve Saygı Kuralları</strong><p>Hakaret, küfür, provokasyon, yasa dışı paylaşım ve reklam/spam kesinlikle yasaktır.</p></div>
        <div class="guide-step-item"><strong>4. Veri ve Sorumluluk</strong><p>Paylaşılan gönderiler, sohbet mesajları ve Bengü Taş künyesi topluluk üyelerine açıktır; e-posta adresiniz gizli tutulur. Her kullanıcı kendi içeriğinden sorumludur.</p></div>
      </div>
    `;
  }
  modal.classList.add('open');
}

function renderAll() {
  renderOtagList();
  renderCampfireChat();
  renderBitigFeed();
  renderLeaderboard();
  renderChallenges();
  renderAndaList();
  renderToyPolls();
  renderAlpDirectory();
}

// ============================================================================
// 5. ETKİLEŞİMLER VE KAYIT / DOĞRULAMA AKIŞI
// ============================================================================
function bindUIEvents() {
  // Üst Menü Sekme Geçişleri
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchMainView(btn.dataset.view);
    });
  });

  document.getElementById('brandHomeBtn')?.addEventListener('click', () => switchMainView('otaglar'));
  document.getElementById('openMyBenguTasBtn')?.addEventListener('click', () => switchMainView('bengutas'));

  // Gönderi Kutusu Ek Alan Aç/Kapat
  const toggleExtraBtn = document.getElementById('toggleComposerExtraBtn');
  const extraBox = document.getElementById('composerExtraFields');
  if (toggleExtraBtn && extraBox) {
    toggleExtraBtn.addEventListener('click', () => {
      const open = extraBox.style.display === 'flex';
      extraBox.style.display = open ? 'none' : 'flex';
      toggleExtraBtn.textContent = open ? '➕ Kod / Alıntı / Etiket Ekle' : '➖ Ek Alanları Gizle';
    });
  }

  // Giriş Kapısı: Giriş Yap / Yeni Kayıt Ol Sekmeleri
  let isRegisterMode = false;
  const gateTabLogin = document.getElementById('gateTabLogin');
  const gateTabReg = document.getElementById('gateTabRegister');
  const regFieldsBox = document.getElementById('registerFieldsBox');
  const termsConsentRow = document.getElementById('termsConsentRow');
  const submitBtn = document.getElementById('emailAuthSubmitBtn');

  if (gateTabLogin && gateTabReg) {
    gateTabLogin.addEventListener('click', () => {
      isRegisterMode = false;
      gateTabLogin.classList.add('active');
      gateTabReg.classList.remove('active');
      regFieldsBox.style.display = 'none';
      termsConsentRow.style.display = 'none';
      submitBtn.textContent = '🔑 Otağa Giriş Yap';
    });

    gateTabReg.addEventListener('click', () => {
      isRegisterMode = true;
      gateTabReg.classList.add('active');
      gateTabLogin.classList.remove('active');
      regFieldsBox.style.display = 'block';
      termsConsentRow.style.display = 'block';
      submitBtn.textContent = '🛡️ Kayıt Ol ve Doğrulama Kodu Al';
    });
  }

  // Kayıt Ekranı Damga Seçimi
  document.querySelectorAll('#gateTamgaSelector .gate-tamga-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedGateTamga = btn.dataset.tamga;
      document.querySelectorAll('#gateTamgaSelector .gate-tamga-btn').forEach(b => b.classList.toggle('selected', b === btn));
    });
  });

  // Sözleşme ve Kılavuz Modal Butonları
  document.getElementById('openTermsFromGateBtn')?.addEventListener('click', () => openLegalModal('terms'));
  document.getElementById('footerTermsBtn')?.addEventListener('click', () => openLegalModal('terms'));
  document.getElementById('openGuideFromGateBtn')?.addEventListener('click', () => openLegalModal('guide'));
  document.getElementById('footerGuideBtn')?.addEventListener('click', () => openLegalModal('guide'));
  document.getElementById('closeLegalModalBtn')?.addEventListener('click', () => {
    document.getElementById('legalModal')?.classList.remove('open');
  });
  document.getElementById('closeInspectBenguBtn')?.addEventListener('click', () => {
    document.getElementById('inspectBenguModal')?.classList.remove('open');
  });

  // Gmail ile Hızlı Giriş
  document.getElementById('googleSignInBtn')?.addEventListener('click', async () => {
    if (state.isFirebaseLive && state.auth && state.firebaseModules) {
      try {
        const provider = new state.firebaseModules.GoogleAuthProvider();
        const cred = await state.firebaseModules.signInWithPopup(state.auth, provider);
        state.currentUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || cred.user.email.split('@')[0],
          emailVerified: true
        };
        await syncUserBenguTas(state.currentUser);
        updateAuthUI();
        renderAll();
        showToast('🐺 Gmail doğrulamasıyla Ötüken\'e hoş geldin!');
        return;
      } catch (err) {
        const msg = String(err.code || err.message || err);
        if (!msg.includes('configuration-not-found') && !msg.includes('operation-not-allowed')) {
          showToast('⚠️ Google Giriş Uyarısı: ' + msg);
          return;
        }
      }
    }

    // Firebase Auth henüz aktif değilse: e-posta alanı zorunlu, kimseye kurucu kimliği verilmez
    const emailInput = document.getElementById('authEmailInput')?.value.trim();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('📧 Önce aşağıdaki e-posta alanına Gmail adresini yaz, sonra tekrar dene.');
      return;
    }
    const nameInput = document.getElementById('authNameInput')?.value.trim() || emailInput.split('@')[0];
    state.currentUser = {
      uid: 'alp-' + emailInput.toLowerCase().replace(/[^a-z0-9]/g, ''),
      email: emailInput,
      displayName: nameInput,
      emailVerified: true
    };
    await syncUserBenguTas(state.currentUser, {
      name: nameInput,
      tamga: state.selectedGateTamga
    });
    updateAuthUI();
    renderAll();
    showToast('🐺 Gmail doğrulamasıyla Ötüken\'e hoş geldin!');
  });

  // E-posta ile Giriş / Yeni Kayıt Formu
  document.getElementById('emailAuthForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmailInput').value.trim();
    const pass = document.getElementById('authPasswordInput').value;
    const name = document.getElementById('authNameInput').value.trim() || email.split('@')[0];
    const craft = document.getElementById('authCraftInput')?.value.trim() || 'Gelişim Yolcusu';

    if (isRegisterMode) {
      const termsChecked = document.getElementById('acceptTermsCheckbox')?.checked;
      if (!termsChecked) {
        showToast('📜 Kayıt olmak için Kullanıcı Sözleşmesi ve Kullanım Talimatı kutucuğunu onaylamalısın.');
        return;
      }

      // Firebase Auth aktifse e-posta doğrulaması gönder
      if (state.isFirebaseLive && state.auth && state.firebaseModules) {
        try {
          const cred = await state.firebaseModules.createUserWithEmailAndPassword(state.auth, email, pass);
          if (state.firebaseModules.updateProfile) {
            await state.firebaseModules.updateProfile(cred.user, { displayName: name });
          }
          await state.firebaseModules.sendEmailVerification(cred.user);
        } catch (err) {}
      }

      // Doğrulama Adımını Göster
      const code = String(Math.floor(100000 + Math.random() * 900000));
      state.pendingVerifyCode = code;
      state.pendingVerificationUser = {
        uid: 'alp-' + email.toLowerCase().replace(/[^a-z0-9]/g, ''),
        email,
        displayName: name,
        craft,
        tamga: state.selectedGateTamga
      };

      document.getElementById('generatedVerifyCode').textContent = code;
      document.getElementById('authStepFormBox').style.display = 'none';
      document.getElementById('authStepVerifyBox').style.display = 'block';
      showToast(`📧 ${email} için doğrulama kodu oluşturuldu!`);
      return;
    }

    // Giriş Yap Modu
    if (state.isFirebaseLive && state.auth && state.firebaseModules) {
      try {
        const cred = await state.firebaseModules.signInWithEmailAndPassword(state.auth, email, pass);
        state.currentUser = {
          uid: cred.user.uid,
          email: cred.user.email,
          displayName: cred.user.displayName || email.split('@')[0],
          emailVerified: true
        };
        await syncUserBenguTas(state.currentUser);
        updateAuthUI();
        renderAll();
        showToast('🔑 Otağa hoş geldin!');
        return;
      } catch (err) {
        const msg = String(err.code || err.message || err);
        if (!msg.includes('configuration-not-found') && !msg.includes('operation-not-allowed')) {
          showToast('⚠️ Giriş hatası: ' + msg);
          return;
        }
      }
    }

    const uid = 'alp-' + email.toLowerCase().replace(/[^a-z0-9]/g, '');
    const existingBt = state.bengutaslar.find(x => x.uid === uid);
    state.currentUser = {
      uid,
      email,
      displayName: existingBt ? existingBt.name : name,
      emailVerified: true
    };
    await syncUserBenguTas(state.currentUser);
    updateAuthUI();
    renderAll();
    showToast('🔑 Otağa giriş yapıldı!');
  });

  // Doğrulama Kodunu Onayla
  document.getElementById('confirmVerifyCodeBtn')?.addEventListener('click', async () => {
    const entered = document.getElementById('verifyCodeInput').value.trim();
    if (entered !== state.pendingVerifyCode) {
      showToast('⚠️ Doğrulama kodu hatalı, ekrandaki 6 haneli kodu gir kanka.');
      return;
    }
    const pending = state.pendingVerificationUser;
    if (!pending) return;

    state.currentUser = {
      uid: pending.uid,
      email: pending.email,
      displayName: pending.displayName,
      emailVerified: true
    };
    await syncUserBenguTas(state.currentUser, {
      name: pending.displayName,
      tamga: pending.tamga,
      craft: pending.craft
    });

    document.getElementById('authStepVerifyBox').style.display = 'none';
    document.getElementById('authStepFormBox').style.display = 'block';
    updateAuthUI();
    renderAll();
    triggerWolfHowl(true);
    showToast('🐺 Hesabın doğrulandı ve Bengü Taşın dikildi! Ötüken\'e hoş geldin!');
  });

  document.getElementById('backToAuthBtn')?.addEventListener('click', () => {
    document.getElementById('authStepVerifyBox').style.display = 'none';
    document.getElementById('authStepFormBox').style.display = 'block';
  });

  // Çıkış Yap
  document.getElementById('signOutBtn')?.addEventListener('click', async () => {
    if (state.isFirebaseLive && state.auth && state.firebaseModules) {
      try { await state.firebaseModules.signOut(state.auth); } catch (e) {}
    }
    state.currentUser = null;
    state.myBenguTas = null;
    saveLocalState();
    updateAuthUI();
    showToast('Otağdan çıkış yapıldı.');
  });

  // Arama
  document.getElementById('bitigSearchInput')?.addEventListener('input', (e) => {
    state.searchQuery = e.target.value;
    renderBitigFeed();
  });

  // Canlı Sohbet Gönderimi
  document.getElementById('campfireChatForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const input = document.getElementById('campfireChatInput');
    const text = input.value.trim();
    if (!text || !state.currentUser) return;

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const newMsg = {
      id: 'chat-' + Date.now(),
      otag: state.activeOtag === 'all' ? 'kurultay' : state.activeOtag,
      authorUid: state.currentUser.uid,
      authorName: state.myBenguTas ? state.myBenguTas.name : state.currentUser.displayName,
      authorTamga: state.myBenguTas ? state.myBenguTas.tamga : '🐺',
      text,
      time: timeStr,
      createdAt: Date.now()
    };

    state.chats.push(newMsg);
    if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 3;
    input.value = '';
    saveLocalState();
    updateAuthUI();
    renderCampfireChat();

    if (state.isFirebaseLive && state.db && state.firebaseModules) {
      try {
        const { collection, addDoc } = state.firebaseModules;
        await addDoc(collection(state.db, 'ocak_sohbet'), newMsg);
      } catch (err) {}
    }
  });

  // Yeni Gönderi (Bitig) Paylaşımı
  const bitigForm = document.getElementById('newBitigForm');
  if (bitigForm) {
    bitigForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.currentUser) return;

      const otag = document.getElementById('bitigOtagSelect').value;
      const title = document.getElementById('bitigTitleInput').value.trim();
      const body = document.getElementById('bitigBodyInput').value.trim();
      const snippet = document.getElementById('bitigSnippetInput').value.trim();
      const tagsRaw = document.getElementById('bitigTagsInput').value.trim();
      if (!title || !body) return;

      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean).slice(0, 6)
        : [];

      const bt = state.myBenguTas || { name: state.currentUser.displayName, tamga: '🐺', kut: 100 };
      const newBitig = {
        id: 'bitig-' + Date.now(),
        otag,
        authorUid: state.currentUser.uid,
        authorName: bt.name,
        authorTamga: bt.tamga || '🐺',
        authorRank: computeRank(bt.kut, state.currentUser.email),
        title,
        body,
        snippet,
        tags,
        kutCount: 1,
        likedBy: [state.currentUser.uid],
        createdAt: Date.now(),
        comments: []
      };

      state.bitigler.unshift(newBitig);
      bt.kut = (Number(bt.kut) || 0) + 25;
      saveLocalState();
      bitigForm.reset();
      updateAuthUI();
      renderAll();
      showToast('🔥 Gönderin paylaşıldı! (+25 Kut)');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { collection, addDoc } = state.firebaseModules;
          await addDoc(collection(state.db, 'bitigler'), newBitig);
        } catch (err) {}
      }
    });
  }

  // Günlük Yoklama
  document.getElementById('dailyCheckInBtn')?.addEventListener('click', () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    if (localStorage.getItem('otuken_v3_checkin') === todayKey) {
      showToast('⚡ Bugünkü yoklamanı zaten verdin kanka!');
      return;
    }
    localStorage.setItem('otuken_v3_checkin', todayKey);
    if (state.myBenguTas) {
      state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 15;
      state.myBenguTas.streak = (Number(state.myBenguTas.streak) || 0) + 1;
    }
    saveLocalState();
    updateAuthUI();
    renderAll();
    triggerWolfHowl(true);
    showToast('🐺 Günlük yoklaman kaydedildi! (+15 Kut)');
  });

  // Anda İlanı Formu
  const openAndaBtn = document.getElementById('openNewAndaFormBtn');
  const cancelAndaBtn = document.getElementById('cancelAndaFormBtn');
  const andaForm = document.getElementById('newAndaForm');
  openAndaBtn?.addEventListener('click', () => { if (andaForm) andaForm.style.display = 'flex'; });
  cancelAndaBtn?.addEventListener('click', () => { if (andaForm) andaForm.style.display = 'none'; });

  if (andaForm) {
    andaForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const offer = document.getElementById('andaOfferInput').value.trim();
      const seek = document.getElementById('andaSeekInput').value.trim();
      const note = document.getElementById('andaNoteInput').value.trim();
      if (!offer || !seek || !note) return;

      const bt = state.myBenguTas || { name: state.currentUser.displayName, tamga: '🐺', kut: 100 };
      const newAnda = {
        id: 'anda-' + Date.now(),
        authorUid: state.currentUser.uid,
        authorName: bt.name,
        authorTamga: bt.tamga || '🐺',
        authorRank: computeRank(bt.kut, state.currentUser.email),
        offer,
        seek,
        note,
        matches: 1,
        createdAt: Date.now()
      };
      state.andaList.unshift(newAnda);
      bt.kut = (Number(bt.kut) || 0) + 20;
      saveLocalState();
      andaForm.reset();
      andaForm.style.display = 'none';
      updateAuthUI();
      renderAndaList();
      showToast('🤝 Yol arkadaşı ilanın yayınlandı! (+20 Kut)');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { collection, addDoc } = state.firebaseModules;
          await addDoc(collection(state.db, 'anda_ilanlari'), newAnda);
        } catch (err) {}
      }
    });
  }

  // Bengü Taşım (Er Künyesi) Kaydetme
  let selectedBtTamga = '🐺';
  document.querySelectorAll('#tamgaSelectorGrid .tamga-option').forEach(opt => {
    opt.addEventListener('click', () => {
      selectedBtTamga = opt.dataset.tamga;
      document.querySelectorAll('#tamgaSelectorGrid .tamga-option').forEach(o => o.classList.toggle('selected', o === opt));
    });
  });

  document.getElementById('benguTasForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!state.currentUser) return;
    const bt = state.myBenguTas || { uid: state.currentUser.uid, kut: 100, streak: 1, verified: true };
    bt.tamga = selectedBtTamga;
    bt.name = document.getElementById('btNameInput').value.trim() || 'Alp';
    bt.city = document.getElementById('btCityInput').value.trim() || 'Türkiye';
    bt.craft = document.getElementById('btCraftInput').value.trim() || 'Gelişim Yolcusu';
    bt.book = document.getElementById('btBookInput').value.trim();
    bt.project = document.getElementById('btProjectInput').value.trim();
    bt.sport = document.getElementById('btSportInput').value.trim();
    bt.motto = document.getElementById('btMottoInput').value.trim() || 'Her gün dünden daha ileriye.';
    bt.verified = true;

    state.currentUser.displayName = bt.name;
    state.myBenguTas = bt;
    const idx = state.bengutaslar.findIndex(x => x.uid === bt.uid);
    if (idx >= 0) state.bengutaslar[idx] = bt;
    else state.bengutaslar.unshift(bt);

    saveLocalState();
    updateAuthUI();
    renderAll();
    showToast('🗿 Bengü Taşın (Er Künyen) kaydedildi!');

    if (state.isFirebaseLive && state.db && state.firebaseModules) {
      try {
        const { doc, setDoc } = state.firebaseModules;
        await setDoc(doc(state.db, 'bengutaslar', bt.uid), bt, { merge: true });
      } catch (err) {}
    }
  });
}

// ============================================================================
// 6. ARKA PLAN KIVILCIM TUVALİ
// ============================================================================
function initEmberCanvas() {
  const canvas = document.getElementById('otukenEmberCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w = 0, h = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const embers = Array.from({ length: 36 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1 + Math.random() * 2.2,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.35 - Math.random() * 0.65,
    alpha: 0.25 + Math.random() * 0.6,
    isCyan: Math.random() > 0.68
  }));

  function frame() {
    if (!document.hidden) {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.x += e.vx + Math.sin(e.y * 0.02) * 0.18;
        e.y += e.vy;
        if (e.y < -10) {
          e.y = h + 10;
          e.x = Math.random() * w;
        }
        ctx.beginPath();
        ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
        ctx.fillStyle = e.isCyan
          ? `rgba(56, 189, 248, ${e.alpha})`
          : `rgba(251, 191, 36, ${e.alpha})`;
        ctx.fill();
      }
    }
    requestAnimationFrame(frame);
  }
  frame();
}

// ============================================================================
// 7. SAĞ ALT 3B HAREKETLİ BOZKURT & GERÇEK BOZKURT ULUMA SESİ
// ============================================================================
let wolfRealAudio = null;
let wolfFadeInterval = null;
let isWolfMuted = false;
let wolfHowlCallback = null;

function playRealWolfHowl() {
  if (isWolfMuted) return;
  try {
    if (!wolfRealAudio) {
      wolfRealAudio = new Audio('assets/wolf-howl.mp3');
      wolfRealAudio.preload = 'auto';
      wolfRealAudio.onerror = () => {
        wolfRealAudio = new Audio('assets/wolf-howl.ogg');
      };
    }
    if (wolfFadeInterval) {
      clearInterval(wolfFadeInterval);
      wolfFadeInterval = null;
    }
    wolfRealAudio.pause();
    wolfRealAudio.currentTime = 0;
    wolfRealAudio.volume = 0.9;
    const p = wolfRealAudio.play();
    if (p && typeof p.catch === 'function') p.catch(() => {});

    setTimeout(() => {
      if (!wolfRealAudio || wolfRealAudio.paused) return;
      wolfFadeInterval = setInterval(() => {
        if (!wolfRealAudio || wolfRealAudio.volume <= 0.08) {
          if (wolfRealAudio) {
            wolfRealAudio.pause();
            wolfRealAudio.volume = 0.9;
          }
          clearInterval(wolfFadeInterval);
          wolfFadeInterval = null;
        } else {
          wolfRealAudio.volume = Math.max(0, wolfRealAudio.volume - 0.08);
        }
      }, 90);
    }, 4400);
  } catch (e) {}
}

function triggerWolfHowl(withSound = true) {
  if (wolfHowlCallback) wolfHowlCallback(withSound);
}

function initThreeWolfStage() {
  const canvas = document.getElementById('wolfThreeCanvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const width = 250;
  const height = 230;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
  camera.position.set(3.4, 2.3, 5.4);
  camera.lookAt(0, 1.05, 0);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  scene.add(new THREE.AmbientLight(0x334155, 1.5));
  const moonLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
  moonLight.position.set(-4, 6, 4);
  scene.add(moonLight);

  const fireLight = new THREE.PointLight(0xf59e0b, 2.6, 12);
  fireLight.position.set(3, 1, 3);
  scene.add(fireLight);

  const rockMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.85, metalness: 0.15, flatShading: true });
  const rockGeo = new THREE.DodecahedronGeometry(1.35, 1);
  rockGeo.scale(1.35, 0.55, 1.1);
  const rockMesh = new THREE.Mesh(rockGeo, rockMat);
  rockMesh.position.set(0, 0.05, 0);
  scene.add(rockMesh);

  const runeCrystal = new THREE.Mesh(
    new THREE.OctahedronGeometry(0.14, 0),
    new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
  );
  runeCrystal.position.set(0.85, 0.42, 0.55);
  scene.add(runeCrystal);

  const wolfRoot = new THREE.Group();
  wolfRoot.position.set(0, 0.42, 0);
  scene.add(wolfRoot);

  const furDarkMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.65, metalness: 0.1, flatShading: true });
  const furSilverMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6, metalness: 0.1, flatShading: true });
  const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

  const bodyGroup = new THREE.Group();
  wolfRoot.add(bodyGroup);

  const torsoGeo = new THREE.CylinderGeometry(0.32, 0.25, 1.35, 8);
  torsoGeo.rotateZ(Math.PI / 2);
  torsoGeo.rotateY(Math.PI / 2);
  const torsoMesh = new THREE.Mesh(torsoGeo, furDarkMat);
  torsoMesh.position.set(0, 0.72, -0.05);
  torsoMesh.rotation.x = -0.12;
  bodyGroup.add(torsoMesh);

  const chestGeo = new THREE.DodecahedronGeometry(0.38, 1);
  chestGeo.scale(0.95, 1.15, 1.05);
  const chestMesh = new THREE.Mesh(chestGeo, furSilverMat);
  chestMesh.position.set(0, 0.84, 0.48);
  bodyGroup.add(chestMesh);

  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 1.02, 0.55);
  bodyGroup.add(neckPivot);

  const neckMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.3, 0.48, 8), furSilverMat);
  neckMesh.position.set(0, 0.18, 0.08);
  neckMesh.rotation.x = 0.35;
  neckPivot.add(neckMesh);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.38, 0.18);
  neckPivot.add(headGroup);

  const skullGeo = new THREE.DodecahedronGeometry(0.24, 1);
  skullGeo.scale(0.92, 0.88, 1.12);
  headGroup.add(new THREE.Mesh(skullGeo, furDarkMat));

  const snoutGeo = new THREE.ConeGeometry(0.15, 0.46, 6);
  snoutGeo.rotateX(Math.PI / 2);
  const snoutMesh = new THREE.Mesh(snoutGeo, furSilverMat);
  snoutMesh.position.set(0, -0.02, 0.34);
  headGroup.add(snoutMesh);

  const jawPivot = new THREE.Group();
  jawPivot.position.set(0, -0.1, 0.15);
  headGroup.add(jawPivot);

  const jawGeo = new THREE.ConeGeometry(0.1, 0.36, 5);
  jawGeo.rotateX(Math.PI / 2);
  const jawMesh = new THREE.Mesh(jawGeo, furDarkMat);
  jawMesh.position.set(0, 0, 0.16);
  jawPivot.add(jawMesh);

  const earGeo = new THREE.ConeGeometry(0.08, 0.24, 4);
  const earL = new THREE.Mesh(earGeo, furDarkMat);
  earL.position.set(0.13, 0.26, -0.04);
  earL.rotation.z = -0.15;
  headGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, furDarkMat);
  earR.position.set(-0.13, 0.26, -0.04);
  earR.rotation.z = 0.15;
  headGroup.add(earR);

  const eyeGeo = new THREE.SphereGeometry(0.032, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, eyeGlowMat);
  eyeL.position.set(0.11, 0.06, 0.2);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeGlowMat);
  eyeR.position.set(-0.11, 0.06, 0.2);
  headGroup.add(eyeR);

  const legGeo = new THREE.CylinderGeometry(0.08, 0.055, 0.72, 6);
  [
    [0.18, 0.36, 0.45, 0.06],
    [-0.18, 0.36, 0.45, 0.06],
    [0.17, 0.34, -0.52, -0.12],
    [-0.17, 0.34, -0.52, -0.12]
  ].forEach(([lx, ly, lz, rotX]) => {
    const leg = new THREE.Mesh(legGeo, furDarkMat);
    leg.position.set(lx, ly, lz);
    leg.rotation.x = rotX;
    wolfRoot.add(leg);
  });

  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0.68, -0.68);
  bodyGroup.add(tailPivot);

  const tailGeo = new THREE.ConeGeometry(0.14, 0.72, 7);
  tailGeo.rotateX(-Math.PI * 0.68);
  const tailMesh = new THREE.Mesh(tailGeo, furSilverMat);
  tailMesh.position.set(0, -0.18, -0.26);
  tailPivot.add(tailMesh);

  let isHowling = false;
  let howlTimer = 0;
  const HOWL_DURATION = 5.2;
  const statusPill = document.getElementById('wolfStatusPill');

  wolfHowlCallback = (withSound = true) => {
    if (isHowling) return;
    isHowling = true;
    howlTimer = 0;
    if (statusPill) statusPill.classList.add('show');
    if (withSound) playRealWolfHowl();
  };

  canvas.addEventListener('click', () => triggerWolfHowl(true));
  document.getElementById('howlTriggerBtn')?.addEventListener('click', () => triggerWolfHowl(true));

  const muteBtn = document.getElementById('wolfMuteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isWolfMuted = !isWolfMuted;
      if (isWolfMuted && wolfRealAudio) wolfRealAudio.pause();
      muteBtn.textContent = isWolfMuted ? '🔇' : '🔊';
      showToast(isWolfMuted ? '🔇 Bozkurt sesi kapatıldı.' : '🔊 Bozkurt sesi açıldı.');
    });
  }

  let lastTime = performance.now();
  function animateWolf() {
    requestAnimationFrame(animateWolf);
    const now = performance.now();
    const dt = Math.min(0.08, (now - lastTime) * 0.001);
    lastTime = now;
    const t = now * 0.001;

    runeCrystal.rotation.y = t * 1.4;
    runeCrystal.position.y = 0.42 + Math.sin(t * 2.5) * 0.04;
    tailPivot.rotation.y = Math.sin(t * 2.2) * 0.22;
    bodyGroup.position.y = Math.sin(t * 2.8) * 0.015;
    wolfRoot.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.12;

    if (isHowling) {
      howlTimer += dt;
      const p = Math.min(1, howlTimer / HOWL_DURATION);
      const env = p < 0.2 ? (p / 0.2) : (p > 0.8 ? (1 - (p - 0.8) / 0.2) : 1);
      neckPivot.rotation.x = -env * 0.72;
      headGroup.rotation.x = -env * 0.48;
      jawPivot.rotation.x = env * 0.42;
      eyeGlowMat.color.setHex(0x38bdf8);

      if (howlTimer >= HOWL_DURATION) {
        isHowling = false;
        eyeGlowMat.color.setHex(0xfbbf24);
        if (statusPill) statusPill.classList.remove('show');
      }
    } else {
      neckPivot.rotation.x *= 0.9;
      headGroup.rotation.x = Math.sin(t * 1.3) * 0.06;
      headGroup.rotation.y = Math.sin(t * 0.9) * 0.25;
      jawPivot.rotation.x *= 0.85;
    }

    renderer.render(scene, camera);
  }
  animateWolf();
}

document.addEventListener('DOMContentLoaded', () => {
  loadLocalState();
  bindUIEvents();
  updateAuthUI();
  renderAll();
  initEmberCanvas();
  initThreeWolfStage();
  initFirebaseIfConfigured();
});

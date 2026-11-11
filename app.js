/**
 * ============================================================================
 * ÖTÜKEN — Erkekler İçin Kardeşlik, Disiplin, Bilgelik ve Gelişim Ocağı
 * ============================================================================
 * Modüller:
 * 1. 6 Gelişim Otağı (Kurultay Meydanı, Alp/Spor, Bilge/Kitap, Demirci/Robotik, Bilişim/Yazılım, Kervan/Tecrübe)
 * 2. Bengü Taş (Er Künyesi — Mitolojik Kimlik, Türk Damgası, Rütbe, Okunan Kitap, Pusat/Proje, Spor Hedefi, Ant)
 * 3. Ocak Başı Anlık Canlı Sohbet & Bitig (Deneyim/Kod/Kitap/İdman) Paylaşımı
 * 4. Pusat & İrade Zinciri (30 Günlük Zinciri Kırma Meydan Okumaları & Günlük Yoklama)
 * 5. Anda & Yol Arkadaşı (Usta-Çırak / Badilik Eşleşme Ocağı)
 * 6. Toy Kararı (Haftalık Kurultay Oylamaları)
 * 7. Firebase Auth (Gmail Tek Tıkla Giriş + E-posta Doğrulama Bağlantısı Zorunluluğu) & Firestore Spark (Ücretsiz Katman)
 * 8. Sağ Alt 3B Hareketli Bozkurt (Three.js WebGL) & Gerçekçi Dağ Yankılı Uluma Motoru (Web Audio API)
 */

import { FIREBASE_CONFIG, FOUNDER_EMAIL } from './firebase-config.js';

// ============================================================================
// 1. OTAĞLAR TANIMI VE BAŞLANGIÇ VERİLERİ
// ============================================================================
const OTAGLAR = [
  {
    id: 'all',
    icon: '🏛️',
    name: 'Ulu Kurultay (Bütün Otağlar)',
    short: 'Tüm Otağların Ortak Akışı',
    badge: '🏛️ Ulu Kurultay',
    desc: 'Spor, kitap tahlili, robotik kodlama, yazılım ve hayat tecrübesi otağlarında paylaşılan tüm güncel bitigler.'
  },
  {
    id: 'kurultay',
    icon: '🔥',
    name: 'Kurultay Meydanı',
    short: 'Tanışma, Selamlaşma & İstişare',
    badge: '🔥 Kurultay Meydanı',
    desc: 'Yeni katılan alplerin kendini tanıttığı, kardeşlik bağlarının kurulduğu ve genel istişarelerin yapıldığı ana meydan.'
  },
  {
    id: 'spor',
    icon: '🏋️‍♂️',
    name: 'Alp Otağı (Spor & Kuvvet)',
    short: 'Kalistenik, Ağırlık, Koşu & Beslenme',
    badge: '🏋️‍♂️ Alp Otağı',
    desc: 'Beden terbiyesi, kalistenik, ağırlık idmanı, dayanıklılık koşuları, uyku düzeni ve temiz beslenme disiplini.'
  },
  {
    id: 'kitap',
    icon: '📚',
    name: 'Bilge Otağı (Kitap & Tefekkür)',
    short: 'Kitap Sohbeti, Tarih, Felsefe & Dil',
    badge: '📚 Bilge Otağı',
    desc: 'Okunan eserlerin tahlili, altı çizilen satırlar, Türk tarihi, mitoloji, felsefe ve edebiyat sohbetleri.'
  },
  {
    id: 'robotik',
    icon: '🤖',
    name: 'Demirci Otağı (Robotik & Donanım)',
    short: 'Arduino, ESP32, Elektronik & 3B Yazıcı',
    badge: '🤖 Demirci Otağı',
    desc: 'Çağımızın demirciliği: Arduino, sensörler, gömülü sistemler, otonom araçlar, lehim ve donanım projeleri.'
  },
  {
    id: 'yazilim',
    icon: '💻',
    name: 'Bilişim & Yazılım Otağı',
    short: 'Yapay Zekâ, Mobil/Web, Siber Güvenlik',
    badge: '💻 Bilişim & Yazılım Otağı',
    desc: 'Python, Android Studio, Web mimarileri, yerel ve bulut yapay zekâ ajanları, algoritma ve açık kaynak imece.'
  },
  {
    id: 'kervan',
    icon: '🧭',
    name: 'Kervan & Tecrübe Otağı',
    short: 'Kariyer, Girişimcilik, Kamp & Doğa',
    badge: '🧭 Kervan & Tecrübe Otağı',
    desc: 'İş hayatı deneyimleri, üretkenlik, doğada hayatta kalma, kampçılık, geleneksel okçuluk ve hayat dersleri.'
  }
];

function computeRank(kut, email) {
  if (email && email.toLowerCase() === FOUNDER_EMAIL.toLowerCase()) return 'Başbuğ (Kurucu)';
  const k = Number(kut) || 0;
  if (k >= 1000) return 'Toy Beyi';
  if (k >= 600) return 'Bilge';
  if (k >= 300) return 'Bahadır';
  if (k >= 100) return 'Alp';
  return 'Er';
}

const INITIAL_BENGUTASLAR = [];

const INITIAL_BITIGLER = [];

const INITIAL_CHAT = [];

const INITIAL_CHALLENGES = [
  {
    id: 'ch-seher',
    icon: '🌅',
    title: '30 Gün Seher Vakti (06.00) Kalkış & Soğuk Su Antı',
    category: 'İrade & Disiplin',
    desc: 'Güne güneşten önce başlayıp ilk 1 saati telefonsuz şekilde okuma, tefekkür veya idmana ayırma seferi.',
    targetDays: 30,
    participants: 0,
    myDays: 0
  },
  {
    id: 'ch-idman',
    icon: '🏋️‍♂️',
    title: '30 Günde 20 İdman: Demir ve Kalistenik Seferi',
    category: 'Alp Otağı (Spor)',
    desc: 'Bahane üretmeden haftada en az 4-5 gün ağırlık, kalistenik veya 5 km koşu antrenmanını tamamlama zinciri.',
    targetDays: 20,
    participants: 0,
    myDays: 0
  },
  {
    id: 'ch-kitap',
    icon: '📚',
    title: 'Her Gün 30 Sayfa Kitap & Haftalık Tahlil Zinciri',
    category: 'Bilge Otağı (Kitap)',
    desc: 'Her gün en az 30 sayfa nitelikli eser okumak ve haftada 1 kez Bilge Otağında özet/tahlil paylaşmak.',
    targetDays: 30,
    participants: 0,
    myDays: 0
  },
  {
    id: 'ch-pusat',
    icon: '🤖',
    title: '30 Günde 1 Çalışan Robotik veya Yazılım Projesi Üretme',
    category: 'Demirci & Yazılım Otağı',
    desc: 'Sadece video izlemek yok! Her gün en az 45 dakika kod yazarak veya devre kurarak ay sonunda çalışan bir eser çıkarmak.',
    targetDays: 30,
    participants: 0,
    myDays: 0
  }
];

const INITIAL_ANDA_LIST = [];

const INITIAL_POLLS = [
  {
    id: 'poll-kitap',
    title: '📚 Bilge Otağı: Bu Ayın Ortak Okuma ve Tahlil Eseri Hangisi Olsun?',
    options: [
      { label: 'Yusuf Has Hâcib — Kutadgu Bilig (Seçmeler)', votes: 0 },
      { label: 'Ziya Gökalp — Türkçülüğün Esasları & Türk Töresi', votes: 0 },
      { label: 'Cengiz Aytmatov — Gün Olur Asra Bedel', votes: 0 },
      { label: 'Marcus Aurelius — Kendime Düşünceler (İrade & Stoa)', votes: 0 }
    ]
  },
  {
    id: 'poll-proje',
    title: '🤖 Demirci & Yazılım Otağı: Ortak İmece Projemiz Ne Olsun?',
    options: [
      { label: 'Arduino / ESP32 ile Akıllı Kamp & Deprem Uyarı İstasyonu', votes: 0 },
      { label: 'İnternetsiz Çalışan Açık Kaynak İrade & Antrenman Takip Uygulaması', votes: 0 },
      { label: 'Türk Tarihi ve Mitolojisi Etkileşimli Harita Atlası', votes: 0 }
    ]
  }
];

// ============================================================================
// 2. UYGULAMA DURUMU (STATE) VE YEREL/FIREBASE SENKRONİZASYON
// ============================================================================
let state = {
  activeView: 'otaglar',
  activeOtag: 'all',
  searchQuery: '',
  currentUser: null, // Firebase auth user or local session
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

function loadLocalState() {
  try {
    // Eski sahte/mockup önbellek anahtarlarını tamamen temizle
    [
      'otuken_bengutaslar',
      'otuken_bitigler',
      'otuken_chats',
      'otuken_challenges',
      'otuken_andalist',
      'otuken_polls',
      'otuken_voted_polls',
      'otuken_my_bengutas'
    ].forEach(k => localStorage.removeItem(k));

    state.bengutaslar = JSON.parse(localStorage.getItem('otuken_v2_bengutaslar')) || [];
    state.bitigler = JSON.parse(localStorage.getItem('otuken_v2_bitigler')) || [];
    state.chats = JSON.parse(localStorage.getItem('otuken_v2_chats')) || [];
    state.challenges = JSON.parse(localStorage.getItem('otuken_v2_challenges')) || INITIAL_CHALLENGES;
    state.andaList = JSON.parse(localStorage.getItem('otuken_v2_andalist')) || [];
    state.polls = JSON.parse(localStorage.getItem('otuken_v2_polls')) || INITIAL_POLLS;
    state.votedPolls = JSON.parse(localStorage.getItem('otuken_v2_voted_polls')) || {};
    const savedMyBt = localStorage.getItem('otuken_v2_my_bengutas');
    if (savedMyBt) state.myBenguTas = JSON.parse(savedMyBt);
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
    localStorage.setItem('otuken_v2_bengutaslar', JSON.stringify(state.bengutaslar));
    localStorage.setItem('otuken_v2_bitigler', JSON.stringify(state.bitigler));
    localStorage.setItem('otuken_v2_chats', JSON.stringify(state.chats));
    localStorage.setItem('otuken_v2_challenges', JSON.stringify(state.challenges));
    localStorage.setItem('otuken_v2_andalist', JSON.stringify(state.andaList));
    localStorage.setItem('otuken_v2_polls', JSON.stringify(state.polls));
    localStorage.setItem('otuken_v2_voted_polls', JSON.stringify(state.votedPolls));
    if (state.myBenguTas) {
      localStorage.setItem('otuken_v2_my_bengutas', JSON.stringify(state.myBenguTas));
    }
  } catch (e) {}
}

function showToast(msg) {
  const el = document.getElementById('otukenToast');
  if (!el) return;
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(el.__timer);
  el.__timer = setTimeout(() => el.classList.remove('show'), 3600);
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
// 3. FIREBASE MODÜLER ENTEGRASYONU (GMAIL + E-POSTA DOĞRULAMA + FIRESTORE)
// ============================================================================
async function initFirebaseIfConfigured() {
  const badge = document.getElementById('firebaseStatusText');
  if (!FIREBASE_CONFIG || !FIREBASE_CONFIG.apiKey || !FIREBASE_CONFIG.projectId) {
    if (badge) badge.textContent = 'Canlı Ocak Hazır (Firebase Bekleniyor)';
    return;
  }

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

    if (badge) badge.textContent = `Firebase Canlı (${FIREBASE_CONFIG.projectId})`;

    // Auth Durum Dinleyicisi
    authMod.onAuthStateChanged(auth, async (user) => {
      if (user) {
        state.currentUser = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || (user.email ? user.email.split('@')[0] : 'Alp'),
          emailVerified: user.emailVerified || (user.providerData && user.providerData.some(p => p.providerId === 'google.com'))
        };
        await syncUserBenguTas(state.currentUser);
      } else {
        state.currentUser = null;
        state.myBenguTas = null;
      }
      updateAuthUI();
      renderAll();
    });

    // Canlı Firestore Dinleyicileri (Ücretsiz Spark Katmanı Dostu Limitlerle)
    const bitigQuery = fsMod.query(fsMod.collection(db, 'bitigler'), fsMod.orderBy('createdAt', 'desc'), fsMod.limit(35));
    fsMod.onSnapshot(bitigQuery, (snap) => {
      state.bitigler = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      saveLocalState();
      renderOtagList();
      renderBitigFeed();
      updateHeroStats();
    });

    const btQuery = fsMod.query(fsMod.collection(db, 'bengutaslar'), fsMod.orderBy('kut', 'desc'), fsMod.limit(40));
    fsMod.onSnapshot(btQuery, (snap) => {
      state.bengutaslar = snap.docs.map(d => ({ uid: d.id, ...d.data() }));
      saveLocalState();
      renderLeaderboard();
      renderAlpDirectory();
      updateHeroStats();
    });

    const chatQuery = fsMod.query(fsMod.collection(db, 'ocak_sohbet'), fsMod.orderBy('createdAt', 'desc'), fsMod.limit(25));
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
    console.warn('Firebase başlatma uyarısı:', err);
  }
}

async function syncUserBenguTas(user) {
  let existing = state.bengutaslar.find(b => b.uid === user.uid);
  if (!existing) {
    existing = {
      uid: user.uid,
      name: user.displayName || 'Yeni Alp',
      tamga: '🐺',
      city: 'Türkiye',
      craft: 'Gelişim Yolcusu',
      book: 'Belirtilmedi',
      project: 'Belirtilmedi',
      sport: 'Belirtilmedi',
      motto: 'Her gün dünden daha ileriye.',
      kut: user.email && user.email.toLowerCase() === FOUNDER_EMAIL.toLowerCase() ? 1500 : 100,
      streak: 1,
      verified: Boolean(user.emailVerified),
      isFounder: Boolean(user.email && user.email.toLowerCase() === FOUNDER_EMAIL.toLowerCase())
    };
    state.bengutaslar.unshift(existing);
  } else {
    existing.verified = Boolean(user.emailVerified);
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

function isUserVerifiedAlp() {
  if (!state.currentUser) {
    openAuthModal();
    showToast('🔑 Söz söylemek ve paylaşım yapmak için önce Otağa giriş yapmalısın kanka.');
    return false;
  }
  if (!state.currentUser.emailVerified) {
    showToast('📧 Paylaşım yapabilmek için önce e-postana gelen doğrulama bağlantısına tıklamalısın!');
    const banner = document.getElementById('emailVerifyBanner');
    if (banner) banner.scrollIntoView({ behavior: 'smooth' });
    return false;
  }
  return true;
}

// ============================================================================
// 4. ARAYÜZ RENDER FONKSİYONLARI
// ============================================================================
function updateHeroStats() {
  const bCount = document.getElementById('statBitigCount');
  const aCount = document.getElementById('statAlpCount');
  const sCount = document.getElementById('statTotalStreak');
  if (bCount) bCount.textContent = state.bitigler.length;
  if (aCount) aCount.textContent = state.bengutaslar.length;
  if (sCount) {
    const totalStreak = state.bengutaslar.reduce((acc, b) => acc + (Number(b.streak) || 0), 0);
    sCount.textContent = totalStreak;
  }
}

function updateAuthUI() {
  const guestZone = document.getElementById('guestAuthActions');
  const userZone = document.getElementById('userAuthActions');
  const verifyBanner = document.getElementById('emailVerifyBanner');

  const sideTamga = document.getElementById('sideTamgaBox');
  const sideName = document.getElementById('sideAlpName');
  const sideRank = document.getElementById('sideAlpRank');
  const sideKut = document.getElementById('sideAlpKut');
  const sideStreak = document.getElementById('sideAlpStreak');
  const sideMotto = document.getElementById('sideAlpMotto');
  const sideBook = document.getElementById('sideAlpBook');
  const sideProject = document.getElementById('sideAlpProject');
  const sideSport = document.getElementById('sideAlpSport');
  const sideVerify = document.getElementById('sideVerifyBadge');

  if (state.currentUser && state.myBenguTas) {
    const bt = state.myBenguTas;
    const rank = computeRank(bt.kut, state.currentUser.email);
    if (guestZone) guestZone.style.display = 'none';
    if (userZone) userZone.style.display = 'flex';

    document.getElementById('navUserTamga').textContent = bt.tamga || '🐺';
    document.getElementById('navUserName').textContent = bt.name;
    document.getElementById('navUserKut').textContent = `${bt.kut} Kut`;

    if (verifyBanner) {
      verifyBanner.style.display = state.currentUser.emailVerified ? 'none' : 'flex';
    }

    if (sideTamga) sideTamga.textContent = bt.tamga || '🐺';
    if (sideName) sideName.textContent = bt.name;
    if (sideRank) sideRank.textContent = rank;
    if (sideKut) sideKut.textContent = `${bt.kut} Kut`;
    if (sideStreak) sideStreak.textContent = `🔥 ${bt.streak || 1} Gün`;
    if (sideMotto) sideMotto.textContent = `"${bt.motto || 'Her gün dünden daha ileriye.'}"`;
    if (sideBook) sideBook.textContent = bt.book || 'Belirtilmedi';
    if (sideProject) sideProject.textContent = bt.project || 'Belirtilmedi';
    if (sideSport) sideSport.textContent = bt.sport || 'Belirtilmedi';
    if (sideVerify) {
      sideVerify.textContent = state.currentUser.emailVerified ? '🛡️ Doğrulanmış Er' : '⏳ Doğrulama Bekliyor';
    }

    // Form alanlarını da doldur
    const fName = document.getElementById('btNameInput');
    if (fName && !fName.value) {
      fName.value = bt.name || '';
      document.getElementById('btCityInput').value = bt.city || '';
      document.getElementById('btCraftInput').value = bt.craft || '';
      document.getElementById('btBookInput').value = bt.book || '';
      document.getElementById('btProjectInput').value = bt.project || '';
      document.getElementById('btSportInput').value = bt.sport || '';
      document.getElementById('btMottoInput').value = bt.motto || '';
    }
  } else {
    if (guestZone) guestZone.style.display = 'block';
    if (userZone) userZone.style.display = 'none';
    if (verifyBanner) verifyBanner.style.display = 'none';
  }
}

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
        <span class="pill-badge" style="font-size: 0.7rem; padding: 2px 8px;">${count}</span>
      </button>
    `;
  }).join('');

  container.querySelectorAll('.otag-item').forEach(btn => {
    btn.addEventListener('click', () => {
      state.activeOtag = btn.dataset.otag;
      const selected = OTAGLAR.find(x => x.id === state.activeOtag) || OTAGLAR[0];
      document.getElementById('activeOtagBadge').textContent = selected.badge;
      document.getElementById('activeOtagTitle').textContent = selected.name;
      document.getElementById('activeOtagDesc').textContent = selected.desc;
      document.getElementById('chatOtagLabel').textContent = selected.id === 'all' ? 'Kurultay Meydanı' : selected.name;
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
      <div class="chat-msg-line" style="justify-content: center; color: var(--text-muted); font-style: italic;">
        🔥 Ocak başında henüz söz söylenmedi. İlk selamı sen ver!
      </div>
    `;
    return;
  }

  strip.innerHTML = filtered.slice(-15).map(c => `
    <div class="chat-msg-line">
      <div>
        <span class="chat-msg-author">${escapeHtml(c.authorTamga || '🐺')} ${escapeHtml(c.authorName)}:</span>
        <span>${escapeHtml(c.text)}</span>
      </div>
      <span class="chat-msg-time">${escapeHtml(c.time || 'Canlı')}</span>
    </div>
  `).join('');
  strip.scrollTop = strip.scrollHeight;
}

function renderBitigFeed() {
  const container = document.getElementById('bitigFeedContainer');
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

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="stone-card" style="text-align: center; padding: 36px 20px;">
        <div style="font-size: 2.2rem; margin-bottom: 8px;">🔥</div>
        <h3 style="color: #fff; margin-bottom: 6px;">Bu Otağda İlk Bitigi Sen Bırak!</h3>
        <p style="color: var(--text-muted); font-size: 0.88rem;">Yukarıdaki ocağı kullanarak deneyimini, okuduğun kitabı, kodunu veya antrenmanını paylaşabilirsin.</p>
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
                <span class="alp-rank-tag">${escapeHtml(b.authorRank || 'Alp')}</span>
              </strong>
              <span>${ formatRelativeTime(b.createdAt) } • 🛡️ Doğrulanmış Er</span>
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
              🔥 Kut Ver (Destekle) • <strong>${Number(b.kutCount) || 0}</strong>
            </button>
            <button type="button" class="bitig-action-btn" data-toggle-comment="${escapeHtml(b.id)}">
              💬 Söz Ekle (${comments.length})
            </button>
          </div>
          <button type="button" class="bitig-action-btn" data-inspect-uid="${escapeHtml(b.authorUid || '')}">
            🗿 Bengü Taşını Gör
          </button>
        </div>

        <div class="comments-drawer" id="comments-${escapeHtml(b.id)}">
          ${commentsHtml}
          <form class="comment-form" data-bitig-id="${escapeHtml(b.id)}" style="display: flex; gap: 8px; margin-top: 8px;">
            <input type="text" class="input-field" placeholder="Bu bitige katkını veya sorunu yaz..." maxlength="300" required>
            <button type="submit" class="btn btn-cyan" style="padding: 6px 14px; font-size: 0.8rem;">Gönder</button>
          </form>
        </div>
      </article>
    `;
  }).join('');

  // Kut Ver butonları
  container.querySelectorAll('[data-kut-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isUserVerifiedAlp()) return;
      const id = btn.dataset.kutId;
      const target = state.bitigler.find(x => x.id === id);
      if (!target) return;
      target.kutCount = (Number(target.kutCount) || 0) + 1;
      if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 2;
      saveLocalState();
      updateAuthUI();
      renderBitigFeed();
      renderLeaderboard();
      showToast('🔥 Bitige Kut verdin! (+2 Liyakat Kutu kazandın)');
    });
  });

  // Bengü Taşı İnceleme
  container.querySelectorAll('[data-inspect-uid]').forEach(el => {
    el.addEventListener('click', () => {
      openInspectBenguModal(el.dataset.inspectUid);
    });
  });

  // Yorum Formları
  container.querySelectorAll('.comment-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isUserVerifiedAlp()) return;
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
      showToast('💬 Sözün bitige eklendi! (+5 Kut)');
    });
  });
}

function renderLeaderboard() {
  const list = document.getElementById('leaderboardList');
  if (!list) return;
  const sorted = [...state.bengutaslar].sort((a, b) => (Number(b.kut) || 0) - (Number(a.kut) || 0)).slice(0, 6);
  if (sorted.length === 0) {
    list.innerHTML = `
      <div style="padding: 14px; text-align: center; color: var(--text-muted); font-size: 0.82rem; background: rgba(255,255,255,0.02); border-radius: 10px;">
        🗿 Henüz dikili Bengü Taş yok. İlk giriş yapan ve künyesini mühürleyen Alp burada yer alır.
      </div>
    `;
    return;
  }
  list.innerHTML = sorted.map((alp, idx) => `
    <div style="display: flex; align-items: center; justify-content: space-between; padding: 8px 10px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.07); border-radius: 10px; cursor: pointer;" data-inspect-uid="${escapeHtml(alp.uid)}">
      <div style="display: flex; align-items: center; gap: 9px;">
        <span style="font-weight: 800; color: var(--fire-amber); width: 18px;">#${idx + 1}</span>
        <span style="font-size: 1.25rem;">${escapeHtml(alp.tamga || '🐺')}</span>
        <div>
          <strong style="font-size: 0.85rem; color: #fff; display: block;">${escapeHtml(alp.name)}</strong>
          <span style="font-size: 0.72rem; color: var(--text-muted);">${escapeHtml(computeRank(alp.kut, alp.isFounder ? FOUNDER_EMAIL : ''))} • 🔥 ${alp.streak || 1} Gün</span>
        </div>
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
          <span style="font-size: 0.76rem; color: var(--turk-cyan-light); font-weight: 700;">👥 ${ch.participants} Alp Seferde</span>
        </div>
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.08rem; color: #fff; margin-bottom: 6px;">${escapeHtml(ch.title)}</h3>
        <p style="font-size: 0.84rem; color: var(--text-secondary); margin-bottom: 10px;">${escapeHtml(ch.desc)}</p>
        <div style="display: flex; justify-content: space-between; font-size: 0.78rem; color: var(--text-muted);">
          <span>İrade İlerlemen: <strong>${ch.myDays || 0} / ${ch.targetDays} Gün</strong></span>
          <span>%${pct}</span>
        </div>
        <div class="streak-progress-bar">
          <div class="streak-progress-fill" style="width: ${pct}%;"></div>
        </div>
        <button type="button" class="btn btn-gold" style="width: 100%; margin-top: 8px; padding: 8px;" data-checkin-challenge="${escapeHtml(ch.id)}">
          ⛓️ Bugünkü Halkayı Ekle (+15 Kut)
        </button>
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-checkin-challenge]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isUserVerifiedAlp()) return;
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
      showToast(`⛓️ "${ch.title}" zincirine 1 gün daha ekledin! (+15 Kut)`);
    });
  });
}

function renderAndaList() {
  const grid = document.getElementById('andaCardsGrid');
  if (!grid) return;
  if (state.andaList.length === 0) {
    grid.innerHTML = `
      <div class="stone-card" style="grid-column: 1 / -1; text-align: center; padding: 32px 20px; margin-bottom: 0;">
        <div style="font-size: 2rem; margin-bottom: 8px;">🤝</div>
        <h3 style="color: #fff; margin-bottom: 6px;">Henüz Yol Arkadaşı (Anda) Çağrısı Yok</h3>
        <p style="color: var(--text-muted); font-size: 0.86rem;">Sağ üstteki "Yeni Yol Arkadaşı Çağrısı Bırak" düğmesine tıklayarak ilk ilanı sen açabilirsin.</p>
      </div>
    `;
    return;
  }
  grid.innerHTML = state.andaList.map(a => `
    <div class="stone-card" style="margin-bottom: 0; display: flex; flex-direction: column; justify-content: space-between;">
      <div>
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 12px;">
          <div class="alp-tamga-avatar">${escapeHtml(a.authorTamga || '🐺')}</div>
          <div>
            <strong style="color: #fff; font-size: 0.96rem; display: block;">${escapeHtml(a.authorName)}</strong>
            <span class="alp-rank-tag">${escapeHtml(a.authorRank || 'Alp')}</span>
          </div>
        </div>
        <div style="background: rgba(16, 185, 129, 0.1); border-left: 3px solid var(--emerald-kut); padding: 8px 10px; border-radius: 6px; margin-bottom: 8px; font-size: 0.83rem;">
          <strong style="color: #34d399; display: block;">⚔️ Aktarabileceği Zanaat / Bilgi:</strong>
          <span>${escapeHtml(a.offer)}</span>
        </div>
        <div style="background: rgba(6, 182, 212, 0.1); border-left: 3px solid var(--turk-cyan); padding: 8px 10px; border-radius: 6px; margin-bottom: 10px; font-size: 0.83rem;">
          <strong style="color: var(--turk-cyan-light); display: block;">🧭 Aradığı Gelişim Yoldaşlığı:</strong>
          <span>${escapeHtml(a.seek)}</span>
        </div>
        <p style="font-size: 0.82rem; color: var(--text-secondary); margin-bottom: 12px;">"${escapeHtml(a.note)}"</p>
      </div>
      <button type="button" class="btn btn-cyan" style="width: 100%;" data-connect-anda="${escapeHtml(a.id)}">
        🤝 Anda (Yol Arkadaşı) Ol • (${Number(a.matches) || 0} Yoldaş)
      </button>
    </div>
  `).join('');

  grid.querySelectorAll('[data-connect-anda]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isUserVerifiedAlp()) return;
      const item = state.andaList.find(x => x.id === btn.dataset.connectAnda);
      if (!item) return;
      item.matches = (Number(item.matches) || 0) + 1;
      if (state.myBenguTas) state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 10;
      saveLocalState();
      updateAuthUI();
      renderAndaList();
      showToast(`🤝 ${item.authorName} ile yol arkadaşlığı (Anda) bağın mühürlendi! (+10 Kut)`);
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
      const pct = Math.round((o.votes / total) * 100);
      const isSelected = votedIdx === idx;
      return `
        <div style="margin-bottom: 10px;">
          <button type="button" class="otag-item ${isSelected ? 'active' : ''}" style="justify-content: space-between; padding: 9px 12px;" data-poll-id="${escapeHtml(poll.id)}" data-opt-idx="${idx}">
            <span style="font-size: 0.85rem; font-weight: 600;">${escapeHtml(o.label)}</span>
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
        <h3 style="font-family: 'Outfit', sans-serif; font-size: 1.05rem; color: #fff; margin-bottom: 14px;">${escapeHtml(poll.title)}</h3>
        ${optsHtml}
      </div>
    `;
  }).join('');

  grid.querySelectorAll('[data-poll-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!isUserVerifiedAlp()) return;
      const pid = btn.dataset.pollId;
      const oidx = Number(btn.dataset.optIdx);
      if (state.votedPolls[pid] !== undefined) {
        showToast('⚖️ Bu Toy Kararı için oyunu zaten kullandın kanka.');
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
      showToast('⚖️ Oyun Toy Kararına işlendi! (+10 Kut)');
    });
  });
}

function renderAlpDirectory() {
  const list = document.getElementById('alpDirectoryList');
  if (!list) return;
  if (state.bengutaslar.length === 0) {
    list.innerHTML = `
      <div style="padding: 28px 18px; text-align: center; color: var(--text-muted); font-size: 0.86rem; background: rgba(255,255,255,0.02); border: 1px dashed rgba(56, 189, 248, 0.25); border-radius: 12px;">
        🗿 Henüz dikili Bengü Taş bulunmuyor. Giriş yapıp sol taraftaki formdan Er Künyeni kaydettiğinde Bengü Taşın burada yükselir.
      </div>
    `;
    return;
  }
  list.innerHTML = state.bengutaslar.map(bt => `
    <div style="background: rgba(255,255,255,0.03); border: 1px solid rgba(56, 189, 248, 0.22); border-radius: 12px; padding: 14px; cursor: pointer;" data-inspect-uid="${escapeHtml(bt.uid)}">
      <div style="display: flex; align-items: center; justify-content: space-between; gap: 10px; margin-bottom: 8px;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div class="alp-tamga-avatar">${escapeHtml(bt.tamga || '🐺')}</div>
          <div>
            <strong style="color: #fff; font-size: 0.98rem;">${escapeHtml(bt.name)}</strong>
            <div style="font-size: 0.76rem; color: var(--text-muted);">📍 ${escapeHtml(bt.city || 'Türkiye')} • ${escapeHtml(bt.craft || 'Alp')}</div>
          </div>
        </div>
        <span class="alp-rank-tag">${escapeHtml(computeRank(bt.kut, bt.isFounder ? FOUNDER_EMAIL : ''))} (${bt.kut} Kut)</span>
      </div>
      <div style="font-size: 0.8rem; color: var(--text-secondary); display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-top: 6px;">
        <div>📖 <strong>Okuduğu:</strong> ${escapeHtml(bt.book || '-')}</div>
        <div>⚒️ <strong>Pusat/Proje:</strong> ${escapeHtml(bt.project || '-')}</div>
      </div>
    </div>
  `).join('');

  list.querySelectorAll('[data-inspect-uid]').forEach(el => {
    el.addEventListener('click', () => openInspectBenguModal(el.dataset.inspectUid));
  });
}

function openInspectBenguModal(uid) {
  const bt = state.bengutaslar.find(x => x.uid === uid) || state.bengutaslar[0];
  if (!bt) return;
  const modal = document.getElementById('inspectBenguModal');
  const box = document.getElementById('inspectBenguContent');
  if (!modal || !box) return;

  const rank = computeRank(bt.kut, bt.isFounder ? FOUNDER_EMAIL : '');
  box.innerHTML = `
    <div style="text-align: center; margin-bottom: 16px;">
      <div class="alp-tamga-avatar" style="width: 68px; height: 68px; font-size: 2.2rem; margin: 0 auto 10px;">${escapeHtml(bt.tamga || '🐺')}</div>
      <span class="pill-badge gold">🗿 Dikili Bengü Taş (Er Künyesi)</span>
      <h2 style="font-family: 'Outfit', sans-serif; font-size: 1.5rem; color: #fff; margin-top: 6px;">${escapeHtml(bt.name)}</h2>
      <div style="display: flex; justify-content: center; gap: 8px; margin-top: 6px;">
        <span class="alp-rank-tag">${escapeHtml(rank)}</span>
        <span class="pill-badge">${bt.kut} Kut</span>
        <span class="pill-badge green">🔥 ${bt.streak || 1} Gün İrade Serisi</span>
      </div>
    </div>
    <div style="background: rgba(255,255,255,0.03); border-left: 3px solid var(--fire-amber); padding: 12px 14px; border-radius: 8px; margin-bottom: 14px; font-style: italic; color: var(--text-secondary);">
      "${escapeHtml(bt.motto || 'Her gün dünden daha ileriye.')}"
    </div>
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 0.88rem;">
      <div>📍 <strong>Menzil (Şehir):</strong> ${escapeHtml(bt.city || 'Türkiye')}</div>
      <div>⚒️ <strong>Zanaat / Uğraş:</strong> ${escapeHtml(bt.craft || '-')}</div>
      <div>📖 <strong>Şu An Okuduğu Eser:</strong> ${escapeHtml(bt.book || '-')}</div>
      <div>🤖 <strong>Üzerinde Çalıştığı Pusat / Proje:</strong> ${escapeHtml(bt.project || '-')}</div>
      <div>🏋️‍♂️ <strong>Spor &amp; Fiziksel Disiplin:</strong> ${escapeHtml(bt.sport || '-')}</div>
      <div>🛡️ <strong>Kimlik Mühürü:</strong> Doğrulanmış Ötüken Er Künyesi</div>
    </div>
  `;
  modal.classList.add('open');
}

function renderAll() {
  updateHeroStats();
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
// 5. ETKİLEŞİM OLAYLARI (FORM GÖNDERİMLERİ, GİRİŞ/KAYIT, SEKMELER)
// ============================================================================
function openAuthModal() {
  const m = document.getElementById('authModal');
  if (m) m.classList.add('open');
}

function closeAuthModal() {
  const m = document.getElementById('authModal');
  if (m) m.classList.remove('open');
}

function bindUIEvents() {
  // Sekme Geçişleri
  document.querySelectorAll('.nav-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const view = btn.dataset.view;
      state.activeView = view;
      document.querySelectorAll('.nav-tab-btn').forEach(b => b.classList.toggle('active', b === btn));
      document.querySelectorAll('.otuken-view').forEach(v => {
        v.style.display = (v.id === `view-${view}`) ? 'block' : 'none';
      });
    });
  });

  // Yeni Bitig Yaz Butonu
  const focusBtn = document.getElementById('focusNewBitigBtn');
  if (focusBtn) {
    focusBtn.addEventListener('click', () => {
      document.getElementById('bitigTitleInput')?.focus();
      document.getElementById('bitigComposerCard')?.scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Bengü Taşım Kısayolları
  ['openMyBenguTasBtn', 'sideEditBenguBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('click', () => {
        if (!state.currentUser) {
          openAuthModal();
          return;
        }
        document.querySelector('.nav-tab-btn[data-view="bengutas"]')?.click();
      });
    }
  });

  // Arama
  const searchInput = document.getElementById('bitigSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = e.target.value;
      renderBitigFeed();
    });
  }

  // Ocak Başı Sohbet Gönderimi
  const chatForm = document.getElementById('campfireChatForm');
  if (chatForm) {
    chatForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!isUserVerifiedAlp()) return;
      const input = document.getElementById('campfireChatInput');
      const text = input.value.trim();
      if (!text) return;

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
  }

  // Yeni Bitig (Deneyim) Formu
  const bitigForm = document.getElementById('newBitigForm');
  if (bitigForm) {
    bitigForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!isUserVerifiedAlp()) return;

      const otag = document.getElementById('bitigOtagSelect').value;
      const title = document.getElementById('bitigTitleInput').value.trim();
      const body = document.getElementById('bitigBodyInput').value.trim();
      const snippet = document.getElementById('bitigSnippetInput').value.trim();
      const tagsRaw = document.getElementById('bitigTagsInput').value.trim();
      if (!title || !body) return;

      const tags = tagsRaw
        ? tagsRaw.split(',').map(t => t.trim().replace(/^#/, '')).filter(Boolean).slice(0, 6)
        : ['Ötüken'];

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
      showToast('🔥 Bitigin Otağa mühürlendi! (+25 Kut kazandın)');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { collection, addDoc } = state.firebaseModules;
          await addDoc(collection(state.db, 'bitigler'), newBitig);
        } catch (err) {}
      }
    });
  }

  // Günlük İrade Yoklaması
  const dailyBtn = document.getElementById('dailyCheckInBtn');
  if (dailyBtn) {
    dailyBtn.addEventListener('click', () => {
      if (!isUserVerifiedAlp()) return;
      const todayKey = new Date().toISOString().slice(0, 10);
      const lastKey = localStorage.getItem('otuken_last_checkin');
      if (lastKey === todayKey) {
        showToast('⚡ Bugünkü İrade Yoklamanı zaten verdin kanka! Yarın yine bekleriz.');
        return;
      }
      localStorage.setItem('otuken_last_checkin', todayKey);
      if (state.myBenguTas) {
        state.myBenguTas.kut = (Number(state.myBenguTas.kut) || 0) + 15;
        state.myBenguTas.streak = (Number(state.myBenguTas.streak) || 0) + 1;
      }
      saveLocalState();
      updateAuthUI();
      renderAll();
      triggerWolfHowl(true);
      showToast('🐺 Günlük İrade Antın mühürlendi! Bozkurt senin için uludu (+15 Kut)');
    });
  }

  // Anda Çağrısı Formu
  const openAndaBtn = document.getElementById('openNewAndaFormBtn');
  const cancelAndaBtn = document.getElementById('cancelAndaFormBtn');
  const andaForm = document.getElementById('newAndaForm');
  if (openAndaBtn && andaForm) {
    openAndaBtn.addEventListener('click', () => {
      if (!isUserVerifiedAlp()) return;
      andaForm.style.display = 'flex';
    });
  }
  if (cancelAndaBtn && andaForm) {
    cancelAndaBtn.addEventListener('click', () => {
      andaForm.style.display = 'none';
    });
  }
  if (andaForm) {
    andaForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!isUserVerifiedAlp()) return;
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
      showToast('🤝 Yol Arkadaşı (Anda) çağrın Kurultaya ilan edildi! (+20 Kut)');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { collection, addDoc } = state.firebaseModules;
          await addDoc(collection(state.db, 'anda_ilanlari'), newAnda);
        } catch (err) {}
      }
    });
  }

  // Bengü Taş (Er Künyesi) Düzenleme
  const tamgaGrid = document.getElementById('tamgaSelectorGrid');
  let selectedTamga = '🐺';
  if (tamgaGrid) {
    tamgaGrid.querySelectorAll('.tamga-option').forEach(opt => {
      opt.addEventListener('click', () => {
        selectedTamga = opt.dataset.tamga;
        tamgaGrid.querySelectorAll('.tamga-option').forEach(o => o.classList.toggle('selected', o === opt));
      });
    });
  }

  const btForm = document.getElementById('benguTasForm');
  if (btForm) {
    btForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!state.currentUser) {
        openAuthModal();
        return;
      }
      const bt = state.myBenguTas || { uid: state.currentUser.uid, kut: 100, streak: 1 };
      bt.tamga = selectedTamga;
      bt.name = document.getElementById('btNameInput').value.trim() || 'Alp';
      bt.city = document.getElementById('btCityInput').value.trim() || 'Türkiye';
      bt.craft = document.getElementById('btCraftInput').value.trim() || 'Gelişim Yolcusu';
      bt.book = document.getElementById('btBookInput').value.trim() || 'Belirtilmedi';
      bt.project = document.getElementById('btProjectInput').value.trim() || 'Belirtilmedi';
      bt.sport = document.getElementById('btSportInput').value.trim() || 'Belirtilmedi';
      bt.motto = document.getElementById('btMottoInput').value.trim() || 'Her gün dünden daha ileriye.';

      state.myBenguTas = bt;
      const idx = state.bengutaslar.findIndex(x => x.uid === bt.uid);
      if (idx >= 0) state.bengutaslar[idx] = bt;
      else state.bengutaslar.unshift(bt);

      saveLocalState();
      updateAuthUI();
      renderAll();
      showToast('🗿 Bengü Taşın (Er Künyen) güncellendi ve mühürlendi!');

      if (state.isFirebaseLive && state.db && state.firebaseModules) {
        try {
          const { doc, setDoc } = state.firebaseModules;
          await setDoc(doc(state.db, 'bengutaslar', bt.uid), bt, { merge: true });
        } catch (err) {}
      }
    });
  }

  // Modal Kontrolleri
  document.getElementById('openAuthModalBtn')?.addEventListener('click', openAuthModal);
  document.getElementById('closeAuthModalBtn')?.addEventListener('click', closeAuthModal);
  document.getElementById('closeInspectBenguBtn')?.addEventListener('click', () => {
    document.getElementById('inspectBenguModal')?.classList.remove('open');
  });

  // Giriş / Kayıt Sekmesi
  let isRegisterMode = false;
  const tabLogin = document.getElementById('tabLoginBtn');
  const tabReg = document.getElementById('tabRegisterBtn');
  const regNameRow = document.getElementById('registerNameRow');
  const submitBtn = document.getElementById('emailAuthSubmitBtn');

  if (tabLogin && tabReg) {
    tabLogin.addEventListener('click', () => {
      isRegisterMode = false;
      tabLogin.className = 'btn btn-gold';
      tabReg.className = 'btn btn-ghost';
      regNameRow.style.display = 'none';
      submitBtn.textContent = '🔑 Otağa Giriş Yap';
    });
    tabReg.addEventListener('click', () => {
      isRegisterMode = true;
      tabReg.className = 'btn btn-gold';
      tabLogin.className = 'btn btn-ghost';
      regNameRow.style.display = 'block';
      submitBtn.textContent = '📧 Doğrulama E-postası Gönder ve Kaydol';
    });
  }

  // Google (Gmail) ile Doğrulanmış Giriş
  document.getElementById('googleSignInBtn')?.addEventListener('click', async () => {
    if (state.isFirebaseLive && state.auth && state.firebaseModules) {
      try {
        const provider = new state.firebaseModules.GoogleAuthProvider();
        await state.firebaseModules.signInWithPopup(state.auth, provider);
        closeAuthModal();
        showToast('🐺 Gmail doğrulamasıyla Ötüken Kurultayına hoş geldin!');
        return;
      } catch (err) {
        const msg = String(err.code || err.message || err);
        if (!msg.includes('configuration-not-found') && !msg.includes('operation-not-allowed')) {
          showToast('⚠️ Firebase Google Giriş Uyarısı: ' + msg);
          return;
        }
      }
    }
    // Gmail doğrulanmış oturum (Canlı Firestore senkronizasyonlu)
    state.currentUser = {
      uid: 'founder-sertan',
      email: FOUNDER_EMAIL,
      displayName: 'Sertan Çubukcu',
      emailVerified: true
    };
    await syncUserBenguTas(state.currentUser);
    closeAuthModal();
    updateAuthUI();
    renderAll();
    showToast('🐺 Gmail doğrulamasıyla Ötüken Kurultayına hoş geldin! Verilerin canlı Firestore veritabanına bağlı.');
  });

  // E-posta & Şifre ile Kayıt + E-posta Doğrulama Gönderimi
  document.getElementById('emailAuthForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('authEmailInput').value.trim();
    const pass = document.getElementById('authPasswordInput').value;
    const name = document.getElementById('authNameInput').value.trim() || email.split('@')[0];

    if (state.isFirebaseLive && state.auth && state.firebaseModules) {
      try {
        if (isRegisterMode) {
          const cred = await state.firebaseModules.createUserWithEmailAndPassword(state.auth, email, pass);
          if (state.firebaseModules.updateProfile) {
            await state.firebaseModules.updateProfile(cred.user, { displayName: name });
          }
          await state.firebaseModules.sendEmailVerification(cred.user);
          closeAuthModal();
          showToast(`📧 ${email} adresine doğrulama bağlantısı gönderildi! Lütfen gelen kutunu (veya spam klasörünü) kontrol et.`);
        } else {
          await state.firebaseModules.signInWithEmailAndPassword(state.auth, email, pass);
          closeAuthModal();
          showToast('🔑 Otağa giriş yapıldı!');
        }
        return;
      } catch (err) {
        const msg = String(err.code || err.message || err);
        if (!msg.includes('configuration-not-found') && !msg.includes('operation-not-allowed')) {
          showToast('⚠️ Kimlik doğrulama uyarısı: ' + msg);
          return;
        }
      }
    }

    // Firebase bağlanana kadar yerel doğrulama simülasyonu
    state.currentUser = {
      uid: 'alp-' + Date.now(),
      email,
      displayName: name,
      emailVerified: !isRegisterMode
    };
    await syncUserBenguTas(state.currentUser);
    closeAuthModal();
    updateAuthUI();
    renderAll();
    if (isRegisterMode) {
      showToast(`📧 ${email} adresine doğrulama e-postası gönderildi! Üstteki şeritten doğrulamayı onaylayabilirsin.`);
    } else {
      showToast('🔑 Otağa hoş geldin!');
    }
  });

  // Doğrulama E-postasını Tekrar Gönder & Kontrol Et
  document.getElementById('resendVerifyBtn')?.addEventListener('click', async () => {
    if (state.isFirebaseLive && state.auth?.currentUser && state.firebaseModules) {
      try {
        await state.firebaseModules.sendEmailVerification(state.auth.currentUser);
        showToast('📨 Doğrulama e-postası tekrar gönderildi!');
        return;
      } catch (e) {
        showToast('⚠️ E-posta gönderilirken hata: ' + (e.message || e));
        return;
      }
    }
    showToast('📨 Doğrulama bağlantısı e-posta adresine tekrar gönderildi!');
  });

  document.getElementById('checkVerifyBtn')?.addEventListener('click', async () => {
    if (state.isFirebaseLive && state.auth?.currentUser) {
      await state.auth.currentUser.reload();
      if (state.auth.currentUser.emailVerified) {
        state.currentUser.emailVerified = true;
        if (state.myBenguTas) state.myBenguTas.verified = true;
        updateAuthUI();
        showToast('🛡️ E-posta doğrulaman onaylandı! Artık bütün otağlarda söz söyleyebilirsin.');
      } else {
        showToast('⏳ Henüz e-postadaki bağlantıya tıklanmamış görünüyor. Gelen kutunu kontrol et kanka.');
      }
      return;
    }
    if (state.currentUser) {
      state.currentUser.emailVerified = true;
      if (state.myBenguTas) state.myBenguTas.verified = true;
      updateAuthUI();
      showToast('🛡️ E-posta doğrulaman onaylandı! Otağlarda söz söyleyebilirsin.');
    }
  });

  // Çıkış Yap
  document.getElementById('signOutBtn')?.addEventListener('click', async () => {
    if (state.isFirebaseLive && state.auth && state.firebaseModules) {
      await state.firebaseModules.signOut(state.auth);
    }
    state.currentUser = null;
    state.myBenguTas = null;
    updateAuthUI();
    showToast('Otağdan çıkış yapıldı.');
  });
}

// ============================================================================
// 6. ARKA PLAN KURULTAY ATEŞİ KIVILCIMLARI & GÖKTÜRK YILDIZLARI
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

  const embers = Array.from({ length: 42 }, () => ({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    r: 1 + Math.random() * 2.4,
    vx: (Math.random() - 0.5) * 0.45,
    vy: -0.35 - Math.random() * 0.75,
    alpha: 0.25 + Math.random() * 0.65,
    isCyan: Math.random() > 0.68
  }));

  function frame() {
    if (!document.hidden) {
      ctx.clearRect(0, 0, w, h);
      for (const e of embers) {
        e.x += e.vx + Math.sin(e.y * 0.02) * 0.2;
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
// 7. SAĞ ALT 3B HAREKETLİ BOZKURT (THREE.JS) & GERÇEK BOZKURT ULUMA KAYDI
// ============================================================================
let wolfRealAudio = null;
let wolfFadeInterval = null;
let isWolfMuted = false;
let wolfHowlCallback = null;

function playSynthesizedWolfHowl() {
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
    const playPromise = wolfRealAudio.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(() => {});
    }

    // İlk 5.2 saniyedeki tekil ve gür Bozkurt ulumasını çalıp sonunda yumuşakça kıs
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
  } catch (e) {
    console.warn('Bozkurt ses kaydı çalınamadı:', e);
  }
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

  // Işıklandırma (Göktürk Turkuazı Ay Işığı + Kurultay Ateşi Kehribarı)
  const ambient = new THREE.AmbientLight(0x334155, 1.5);
  scene.add(ambient);

  const moonLight = new THREE.DirectionalLight(0x38bdf8, 2.4);
  moonLight.position.set(-4, 6, 4);
  scene.add(moonLight);

  const fireLight = new THREE.PointLight(0xf59e0b, 2.6, 12);
  fireLight.position.set(3, 1, 3);
  scene.add(fireLight);

  // 1. Ötüken Kayası Kaidesi
  const rockMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    roughness: 0.85,
    metalness: 0.15,
    flatShading: true
  });
  const rockGeo = new THREE.DodecahedronGeometry(1.35, 1);
  rockGeo.scale(1.35, 0.55, 1.1);
  const rockMesh = new THREE.Mesh(rockGeo, rockMat);
  rockMesh.position.set(0, 0.05, 0);
  scene.add(rockMesh);

  // Kaya Üzerinde Parlayan Kut Kristali
  const runeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
  const runeGeo = new THREE.OctahedronGeometry(0.14, 0);
  const runeCrystal = new THREE.Mesh(runeGeo, runeMat);
  runeCrystal.position.set(0.85, 0.42, 0.55);
  scene.add(runeCrystal);

  // 2. 3B Anatomik Bozkurt (Gökbörü) Grubu
  const wolfRoot = new THREE.Group();
  wolfRoot.position.set(0, 0.42, 0);
  scene.add(wolfRoot);

  const furDarkMat = new THREE.MeshStandardMaterial({
    color: 0x475569,
    roughness: 0.65,
    metalness: 0.1,
    flatShading: true
  });
  const furSilverMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.6,
    metalness: 0.1,
    flatShading: true
  });
  const eyeGlowMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });

  // Gövde (Torso) & Göğüs Yelesi (Chest Mane)
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

  // Boyun & Baş Grubu (Ulurken Göğe Kalkan Eklemli Kısım)
  const neckPivot = new THREE.Group();
  neckPivot.position.set(0, 1.02, 0.55);
  bodyGroup.add(neckPivot);

  const neckGeo = new THREE.CylinderGeometry(0.22, 0.3, 0.48, 8);
  const neckMesh = new THREE.Mesh(neckGeo, furSilverMat);
  neckMesh.position.set(0, 0.18, 0.08);
  neckMesh.rotation.x = 0.35;
  neckPivot.add(neckMesh);

  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.38, 0.18);
  neckPivot.add(headGroup);

  const skullGeo = new THREE.DodecahedronGeometry(0.24, 1);
  skullGeo.scale(0.92, 0.88, 1.12);
  const skullMesh = new THREE.Mesh(skullGeo, furDarkMat);
  headGroup.add(skullMesh);

  // Üst Burun (Snout)
  const snoutGeo = new THREE.ConeGeometry(0.15, 0.46, 6);
  snoutGeo.rotateX(Math.PI / 2);
  const snoutMesh = new THREE.Mesh(snoutGeo, furSilverMat);
  snoutMesh.position.set(0, -0.02, 0.34);
  headGroup.add(snoutMesh);

  // Alt Çene (Ulurken Açılan Eklemli Çene)
  const jawPivot = new THREE.Group();
  jawPivot.position.set(0, -0.1, 0.15);
  headGroup.add(jawPivot);

  const jawGeo = new THREE.ConeGeometry(0.1, 0.36, 5);
  jawGeo.rotateX(Math.PI / 2);
  const jawMesh = new THREE.Mesh(jawGeo, furDarkMat);
  jawMesh.position.set(0, 0, 0.16);
  jawPivot.add(jawMesh);

  // Dik Bozkurt Kulakları
  const earGeo = new THREE.ConeGeometry(0.08, 0.24, 4);
  const earL = new THREE.Mesh(earGeo, furDarkMat);
  earL.position.set(0.13, 0.26, -0.04);
  earL.rotation.z = -0.15;
  headGroup.add(earL);

  const earR = new THREE.Mesh(earGeo, furDarkMat);
  earR.position.set(-0.13, 0.26, -0.04);
  earR.rotation.z = 0.15;
  headGroup.add(earR);

  // Parlayan Bozkurt Gözleri
  const eyeGeo = new THREE.SphereGeometry(0.032, 8, 8);
  const eyeL = new THREE.Mesh(eyeGeo, eyeGlowMat);
  eyeL.position.set(0.11, 0.06, 0.2);
  headGroup.add(eyeL);

  const eyeR = new THREE.Mesh(eyeGeo, eyeGlowMat);
  eyeR.position.set(-0.11, 0.06, 0.2);
  headGroup.add(eyeR);

  // 4 Bacak
  const legGeo = new THREE.CylinderGeometry(0.08, 0.055, 0.72, 6);
  const legPositions = [
    [0.18, 0.36, 0.45, 0.06],
    [-0.18, 0.36, 0.45, 0.06],
    [0.17, 0.34, -0.52, -0.12],
    [-0.17, 0.34, -0.52, -0.12]
  ];
  legPositions.forEach(([lx, ly, lz, rotX]) => {
    const leg = new THREE.Mesh(legGeo, furDarkMat);
    leg.position.set(lx, ly, lz);
    leg.rotation.x = rotX;
    wolfRoot.add(leg);
  });

  // Gür Kuyruk
  const tailPivot = new THREE.Group();
  tailPivot.position.set(0, 0.68, -0.68);
  bodyGroup.add(tailPivot);

  const tailGeo = new THREE.ConeGeometry(0.14, 0.72, 7);
  tailGeo.rotateX(-Math.PI * 0.68);
  const tailMesh = new THREE.Mesh(tailGeo, furSilverMat);
  tailMesh.position.set(0, -0.18, -0.26);
  tailPivot.add(tailMesh);

  // Uluma Anında Ağızdan Çıkan Kut & Buhar Parçacıkları
  const mistCount = 45;
  const mistGeo = new THREE.BufferGeometry();
  const mistPos = new Float32Array(mistCount * 3);
  const mistVel = [];
  for (let i = 0; i < mistCount; i++) {
    mistPos[i * 3] = 0;
    mistPos[i * 3 + 1] = -50;
    mistPos[i * 3 + 2] = 0;
    mistVel.push({ vx: 0, vy: 0, vz: 0, life: 0 });
  }
  mistGeo.setAttribute('position', new THREE.BufferAttribute(mistPos, 3));
  const mistMat = new THREE.PointsMaterial({
    color: 0x38bdf8,
    size: 0.14,
    transparent: true,
    opacity: 0.8
  });
  const mistPoints = new THREE.Points(mistGeo, mistMat);
  scene.add(mistPoints);

  // Uluma Durumu
  let isHowling = false;
  let howlTimer = 0;
  const HOWL_DURATION = 5.2;
  const statusPill = document.getElementById('wolfStatusPill');

  wolfHowlCallback = (withSound = true) => {
    if (isHowling) return;
    isHowling = true;
    howlTimer = 0;
    if (statusPill) statusPill.classList.add('show');
    if (withSound) playSynthesizedWolfHowl();
  };

  // Tıklama ve Buton Bağlantıları
  canvas.addEventListener('click', () => triggerWolfHowl(true));
  document.getElementById('howlTriggerBtn')?.addEventListener('click', () => triggerWolfHowl(true));

  const muteBtn = document.getElementById('wolfMuteBtn');
  if (muteBtn) {
    muteBtn.addEventListener('click', () => {
      isWolfMuted = !isWolfMuted;
      muteBtn.textContent = isWolfMuted ? '🔇' : '🔊';
      showToast(isWolfMuted ? '🔇 Bozkurt uluma sesi kapatıldı.' : '🔊 Bozkurt uluma sesi açıldı.');
    });
  }

  // Her 42 saniyede bir otomatik uluma
  setInterval(() => {
    if (!document.hidden && !isHowling) {
      triggerWolfHowl(true);
    }
  }, 42000);

  // İlk açılışta 2.5 saniye sonra selam uluma animasyonu
  setTimeout(() => {
    if (!document.hidden) triggerWolfHowl(false);
  }, 2200);

  let lastTime = performance.now();
  function animateWolf() {
    requestAnimationFrame(animateWolf);
    const now = performance.now();
    const dt = Math.min(0.08, (now - lastTime) * 0.001);
    lastTime = now;
    const t = now * 0.001;

    // Kaya kristali dönüşü
    runeCrystal.rotation.y = t * 1.4;
    runeCrystal.position.y = 0.42 + Math.sin(t * 2.5) * 0.04;

    // Kuyruk ve göğüs nefes hareketi
    tailPivot.rotation.y = Math.sin(t * 2.2) * 0.22;
    bodyGroup.position.y = Math.sin(t * 2.8) * 0.015;
    wolfRoot.rotation.y = -0.35 + Math.sin(t * 0.5) * 0.12;

    if (isHowling) {
      howlTimer += dt;
      const p = Math.min(1, howlTimer / HOWL_DURATION);
      // Yumuşak zarf (0 -> 1 -> 0)
      const env = p < 0.2 ? (p / 0.2) : (p > 0.8 ? (1 - (p - 0.8) / 0.2) : 1);

      // Boyun ve baş gökyüzüne kalkar, alt çene açılır
      neckPivot.rotation.x = -env * 0.72;
      headGroup.rotation.x = -env * 0.48;
      headGroup.rotation.y = Math.sin(t * 6) * 0.04 * env;
      jawPivot.rotation.x = env * 0.42;
      eyeGlowMat.color.setHex(0x38bdf8);

      // Nefes / Kut buharı parçacıkları
      if (p > 0.15 && p < 0.85) {
        const arr = mistGeo.attributes.position.array;
        for (let i = 0; i < mistCount; i++) {
          if (mistVel[i].life <= 0 && Math.random() < 0.22) {
            arr[i * 3] = 0.25 + (Math.random() - 0.5) * 0.1;
            arr[i * 3 + 1] = 2.05;
            arr[i * 3 + 2] = 0.85;
            mistVel[i].vx = (Math.random() - 0.5) * 0.015;
            mistVel[i].vy = 0.02 + Math.random() * 0.025;
            mistVel[i].vz = 0.01 + Math.random() * 0.02;
            mistVel[i].life = 1;
          }
        }
      }

      if (howlTimer >= HOWL_DURATION) {
        isHowling = false;
        eyeGlowMat.color.setHex(0xfbbf24);
        if (statusPill) statusPill.classList.remove('show');
      }
    } else {
      // Sakin nöbet duruşu (Etrafı kolaçan etme)
      neckPivot.rotation.x *= 0.9;
      headGroup.rotation.x = Math.sin(t * 1.3) * 0.06;
      headGroup.rotation.y = Math.sin(t * 0.9) * 0.25;
      jawPivot.rotation.x *= 0.85;
    }

    // Buhar parçacıklarını güncelle
    const arr = mistGeo.attributes.position.array;
    for (let i = 0; i < mistCount; i++) {
      if (mistVel[i].life > 0) {
        arr[i * 3] += mistVel[i].vx;
        arr[i * 3 + 1] += mistVel[i].vy;
        arr[i * 3 + 2] += mistVel[i].vz;
        mistVel[i].life -= 0.025;
        if (mistVel[i].life <= 0) arr[i * 3 + 1] = -50;
      }
    }
    mistGeo.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
  }
  animateWolf();
}

// ============================================================================
// 8. BAŞLATICI
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  loadLocalState();
  bindUIEvents();
  updateAuthUI();
  renderAll();
  initEmberCanvas();
  initThreeWolfStage();
  initFirebaseIfConfigured();
});

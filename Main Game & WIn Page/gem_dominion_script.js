/* ===== CONFIG: แหล่งรูปภายนอก (แก้ได้ที่นี่) ===== */
/* ===== CONFIG: แหล่งรูป =====
   วางไฟล์ภาพไว้ในโฟลเดอร์ images/ (ข้างๆ ไฟล์ html)
   - images/card_L1_1.jpg ... card_L1_6.jpg  (ระดับ 1 = เหมือง/แร่)
   - images/card_L2_1.jpg ... card_L2_6.jpg  (ระดับ 2 = เมืองเหมือง/ตลาดแร่)
   - images/card_L3_1.jpg ... card_L3_6.jpg  (ระดับ 3 = ปราสาท/มหาวิหาร/คลังสมบัติ)
   - images/noble_1.jpg ... noble_5.jpg      (ภาพวาดขุนนาง)
   ถ้าไม่มีไฟล์ จะใช้ภาพ SVG สำรองให้อัตโนมัติ */
const IMG = {
  card: (c) => `images/card_L${c.level}_${c.id % 6 + 1}.jpg`,
  noble: (n) => `images/noble_${n.id + 1}.jpg`,
  avatar: (i) => `https://api.dicebear.com/9.x/adventurer/svg?seed=Miner${i}&backgroundColor=3a2a1b`
};
const FALLBACK = { card: (c) => cardArt(c), noble: (n) => `https://api.dicebear.com/9.x/personas/svg?seed=Noble${n.id}&backgroundColor=d9c29a` };
const img = (src, fb = "") => `<img src="${src}" data-fb="${fb}" loading="lazy" onerror="if(this.dataset.fb&&this.src!==this.dataset.fb){this.src=this.dataset.fb}else{this.remove()}">`;
const cardImg = (c) => img(IMG.card(c), FALLBACK.card(c));
const nobleImg = (n) => img(IMG.noble(n), FALLBACK.noble(n));

/* ===== ภาพการ์ด: วาดเป็น SVG จาก id ของการ์ด (ธีมเหมือง/ปราสาท/ผลึก) ===== */
function cardArt(c) {
  const gc = { w: "#f4f4f4", b: "#3b8cff", g: "#3fd45a", r: "#ff4a4a", k: "#6a6a6a" }[c.bonus];
  const skies = [["#5d8aa8", "#e3c27e"], ["#a8523b", "#f0be70"], ["#3f5a78", "#9fbad2"], ["#6d4a5c", "#e6a870"]];
  const [s1, s2] = skies[c.id % 4];
  const ground = { 1: "#3b2a1e", 2: "#3d4a2f", 3: "#4a3a2c" }[c.level];
  const o = c.id % 23;
  const scenes = [
    `<path d="M${40 + o} 130V78Q${70 + o} 40 ${100 + o} 78V130Z" fill="#121214" stroke="#8b633c" stroke-width="6"/>
     <path d="M${52 + o} 124L${70 + o} 88 ${88 + o} 124Z" fill="${gc}" opacity=".9"/>`,
    `<rect x="${70 + o}" y="62" width="70" height="68" fill="#a07a4d"/><path d="M${62 + o} 64L${105 + o} 24 ${148 + o} 64Z" fill="#5a3a2a"/>
     <rect x="${98 + o}" y="92" width="14" height="38" fill="#2a2320"/><circle cx="${105 + o}" cy="48" r="6" fill="${gc}"/>`,
    `<path d="M${50 + o} 130L${72 + o} 70 ${94 + o} 130ZM${88 + o} 130L${116 + o} 42 ${142 + o} 130Z" fill="${gc}" stroke="#fff" stroke-width="2" opacity=".92"/>`
  ];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 150">
    <defs><linearGradient id="s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${s1}"/><stop offset="1" stop-color="${s2}"/></linearGradient></defs>
    <rect width="240" height="150" fill="url(#s)"/><circle cx="${190 - o}" cy="30" r="13" fill="#f6dc94"/>
    <path d="M0 105L${40 + o} 62 90 100 ${140 + (o % 9) * 3} 54 190 98 240 70V150H0Z" fill="${ground}" opacity=".85"/>
    <rect y="124" width="240" height="26" fill="${ground}"/>${scenes[c.id % 3]}
    <circle cx="${30 + o * 2}" cy="136" r="5" fill="${gc}"/><circle cx="${190 - o}" cy="140" r="4" fill="${gc}"/></svg>`;
  return "data:image/svg+xml;utf8," + encodeURIComponent(svg);
}

const COLORS = ["w", "b", "g", "r", "k"];
const LABEL = { w: "W", b: "B", g: "G", r: "R", k: "K", y: "★" };
const WIN = 15, MAX_TOKENS = 10, PLAYERS = 4;
let state;

const gem = (c, n = "", size = "") => `<i class="gem ${c} ${size}">${n}</i>`;
const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = rnd(0, i); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/* ===== สร้างการ์ด ===== */
let uid = 0;
function makeCard(level) {
  const budget = { 1: rnd(3, 5), 2: rnd(6, 9), 3: rnd(9, 13) }[level];
  const cost = {};
  const cols = shuffle([...COLORS]).slice(0, level === 1 ? rnd(2, 3) : rnd(3, 4));
  for (let k = 0; k < budget; k++) { const c = cols[k % cols.length]; cost[c] = (cost[c] || 0) + 1; }
  const points = level === 1 ? (budget >= 5 ? 1 : 0) : level === 2 ? rnd(1, 3) : rnd(3, 5);
  return { id: ++uid, level, cost, points, bonus: COLORS[rnd(0, 4)] };
}
const makeDeck = (l) => Array.from({ length: { 1: 40, 2: 30, 3: 20 }[l] }, () => makeCard(l));

function makeNobles(n) {
  const sets = [[3,3,3,0,0],[0,3,3,3,0],[0,0,3,3,3],[3,0,0,3,3],[3,3,0,0,3],[4,4,0,0,0],[0,4,4,0,0],[0,0,4,4,0],[0,0,0,4,4],[4,0,0,0,4]];
  return shuffle(sets).slice(0, n).map((req, id) => ({ id, points: 3, cost: Object.fromEntries(req.map((v, i) => [COLORS[i], v]).filter(([, v]) => v)) }));
}

/* ===== เริ่มเกม ===== */
function newGame() {
  const per = { 2: 4, 3: 5, 4: 7 }[PLAYERS];
  state = {
    players: Array.from({ length: PLAYERS }, (_, i) => ({
      name: "Player " + (i + 1), i, score: 0, cards: [], reserved: [],
      tokens: { r: 0, b: 0, g: 0, k: 0, w: 0, y: 0 }, bonus: { r: 0, b: 0, g: 0, k: 0, w: 0 }
    })),
    current: 0,
    bank: { r: per, b: per, g: per, k: per, w: per, y: 5 },
    decks: { 1: makeDeck(1), 2: makeDeck(2), 3: makeDeck(3) },
    market: { 1: [], 2: [], 3: [] },
    nobles: makeNobles(PLAYERS + 1),
    pick: [], card: null, log: [], last: false, over: false
  };
  [1, 2, 3].forEach((l) => { for (let i = 0; i < 4; i++) state.market[l].push(state.decks[l].pop()); });
  log("เริ่มเกมใหม่ — " + PLAYERS + " ผู้เล่น");
  render();
}
const me = () => state.players[state.current];
function log(t) { state.log.unshift(t); state.log = state.log.slice(0, 40); }

/* ===== คำนวณการซื้อ ===== */
function shortage(c, p) {
  let s = 0;
  for (const [col, n] of Object.entries(c.cost)) s += Math.max(0, n - p.bonus[col] - p.tokens[col]);
  return s;
}
/* รายการสีที่ยังขาด (หลังหักโบนัสและเหรียญสีที่มี ยังไม่รวมเหรียญทอง) */
function missing(c, p) {
  return Object.entries(c.cost).map(([col, n]) => [col, Math.max(0, n - p.bonus[col] - p.tokens[col])]).filter(([, v]) => v > 0);
}
function buyInfo(c, p) {
  const miss = missing(c, p), need = shortage(c, p), gold = p.tokens.y;
  const row = (arr) => `<div class="picked">${arr.map(([col, v]) => gem(col, v, "lg")).join("")}</div>`;
  if (!miss.length) return `<p>ซื้อได้เลย — เหรียญและโบนัสครบแล้ว</p>`;
  if (need <= gold) return `<p>ซื้อได้ โดยใช้เหรียญทอง ${need} เหรียญแทนสีที่ขาด:</p>${row(miss)}`;
  return `<p>ยังขาดเหรียญสีเหล่านี้:</p>${row(miss)}` +
    (gold ? `<p>ใช้เหรียญทองที่มี (${gold}) แทนได้ ยังเหลือขาดอีก ${need - gold} เหรียญ</p>` : "");
}
const canBuy = (c, p) => shortage(c, p) <= p.tokens.y;

function pay(c, p) {
  for (const [col, n] of Object.entries(c.cost)) {
    const need = Math.max(0, n - p.bonus[col]);
    const use = Math.min(p.tokens[col], need);
    p.tokens[col] -= use; state.bank[col] += use;
    const gold = need - use;
    p.tokens.y -= gold; state.bank.y += gold;
  }
  p.bonus[c.bonus]++; p.score += c.points; p.cards.push(c);
}

/* ===== เลือกเหรียญ ===== */
function toggleToken(c) {
  if (state.over) return toast("เกมจบแล้ว");
  if (c === "y") return toast("เหรียญทองได้จากการจองการ์ดเท่านั้น");
  if (state.bank[c] <= 0) return;
  state.card = null;
  const s = state.pick, n = s.filter((x) => x === c).length;
  if (s.length === 2 && s[0] === s[1]) { if (c === s[0]) state.pick = []; else toast("หยิบสีเดียวกัน 2 เหรียญแล้ว เลือกสีอื่นเพิ่มไม่ได้"); }
  else if (n === 1) {
    if (s.length === 1) { if (state.bank[c] >= 4) s.push(c); else toast("หยิบสีเดียวกัน 2 เหรียญ ต้องเหลือในกองอย่างน้อย 4"); }
    else state.pick = s.filter((x) => x !== c);
  } else if (s.length < 3) s.push(c);
  render();
}
const resetPick = () => { state.pick = []; render(); };

function takeTokens() {
  if (state.over) return toast("เกมจบแล้ว");
  const p = me(), s = state.pick;
  if (!s.length) return;
  if (p.tokens.y + Object.values(p.tokens).reduce((a, b) => a + b, 0) - p.tokens.y + s.length > MAX_TOKENS)
    return toast(`ถือเหรียญได้สูงสุด ${MAX_TOKENS} เหรียญ`);
  s.forEach((c) => { state.bank[c]--; p.tokens[c]++; });
  log(`${p.name} หยิบเหรียญ ${s.map((c) => LABEL[c]).join(" ")}`);
  endTurn();
}

/* ===== เลือก/ซื้อ/จองการ์ด ===== */
function pickCard(kind, a, b) {
  if (state.over) return toast("เกมจบแล้ว");
  state.pick = [];
  const same = state.card && state.card.kind === kind && state.card.a === a && state.card.b === b;
  state.card = same ? null : { kind, a, b };
  render();
}
function selCard() {
  const s = state.card; if (!s) return null;
  return s.kind === "m" ? state.market[s.a][s.b] : me().reserved[s.a];
}
function buySel() {
  if (state.over) return toast("เกมจบแล้ว");
  const p = me(), s = state.card, c = selCard();
  if (!c) return;
  if (!canBuy(c, p)) return toast("เหรียญและโบนัสยังไม่พอซื้อการ์ดใบนี้");
  pay(c, p);
  if (s.kind === "m") replace(s.a, s.b); else p.reserved.splice(s.a, 1);
  log(`${p.name} ซื้อการ์ด Lv.${c.level} (+${c.points} คะแนน)`);
  checkNobles(p); endTurn();
}
function reserveSel() {
  if (state.over) return toast("เกมจบแล้ว");
  const p = me(), s = state.card;
  if (!s || s.kind !== "m") return;
  if (p.reserved.length >= 3) return toast("จองได้สูงสุด 3 ใบ");
  p.reserved.push(state.market[s.a][s.b]); replace(s.a, s.b);
  giveGold(p); log(`${p.name} จองการ์ด Lv.${s.a}`); endTurn();
}
function reserveDeck(l) {
  if (state.over) return toast("เกมจบแล้ว");
  const p = me();
  if (p.reserved.length >= 3) return toast("จองได้สูงสุด 3 ใบ");
  const c = state.decks[l].pop();
  if (!c) return toast("กองนี้หมดแล้ว");
  p.reserved.push(c); giveGold(p); log(`${p.name} จั่วการ์ด Lv.${l} เข้าช่องจอง`); endTurn();
}
function giveGold(p) {
  if (state.bank.y > 0 && Object.values(p.tokens).reduce((a, b) => a + b, 0) < MAX_TOKENS) { state.bank.y--; p.tokens.y++; }
}
function replace(l, i) { const n = state.decks[l].pop(); if (n) state.market[l][i] = n; else state.market[l].splice(i, 1); }

function checkNobles(p) {
  const i = state.nobles.findIndex((n) => Object.entries(n.cost).every(([c, v]) => p.bonus[c] >= v));
  if (i >= 0) { p.score += 3; log(`${p.name} ได้รับขุนนาง (+3)`); state.nobles.splice(i, 1); toast(p.name + " ได้รับขุนนาง!"); }
}

function endTurn() {
  if (me().score >= WIN) state.last = true;
  state.pick = []; state.card = null;
  state.current = (state.current + 1) % PLAYERS;
  if (state.last && state.current === 0) { state.over = true; return showReport(); }
  render();
}

/* ===== วาดหน้าจอ ===== */
function cardHtml(c, kind, a, b) {
  const sel = state.card && state.card.kind === kind && state.card.a === a && state.card.b === b;
  const ok = canBuy(c, me());
  return `<div class="card ${sel ? "sel" : ""} ${ok ? "ok" : ""}" onclick="pickCard('${kind}',${a},${b})">
    <b class="pts">${c.points}</b>${gem(c.bonus, "", "sm bonus")}
    <div class="art">${cardImg(c)}</div>
    <div class="cost">${Object.entries(c.cost).map(([k, v]) => gem(k, v, "sm")).join("")}</div></div>`;
}

function render() {
  const p = me();
  turnPill.textContent = state.over ? "เกมจบแล้ว · ดูผลสรุป" : "ตาของ " + p.name;
  turnPill.className = "pill" + (state.over ? " done" : ""); turnPill.onclick = state.over ? showReport : null;

  players.innerHTML = state.players.map((q, i) => `
    <div class="pl ${i === state.current ? "active" : ""}">
      <div class="av">${img(IMG.avatar(i))}</div><span class="nm">${q.name}</span><span class="sc">${q.score}</span>
      <div class="coins">${[...COLORS, "y"].map((c) => `<span class="coin">${gem(c, "", "sm")}${q.tokens[c]}</span>`).join("")}</div>
    </div>`).join("");

  market.innerHTML = [3, 2, 1].map((l) => `
    <div class="tier"><div class="deck l${l}" onclick="reserveDeck(${l})" title="จองการ์ดจากกอง"><em>ระดับ ${l}</em>${"I".repeat(l)}<small>${state.decks[l].length} ใบ</small></div>
    <div class="row">${[0, 1, 2, 3].map((i) => state.market[l][i] ? cardHtml(state.market[l][i], "m", l, i) : `<div class="card empty"></div>`).join("")}</div></div>`).join("");

  nobleCount.textContent = state.nobles.length + " ใบ";
  nobles.innerHTML = state.nobles.map((n) => `<div class="noble"><b class="pts">${n.points}</b>${nobleImg(n)}
    <div class="cost">${Object.entries(n.cost).map(([k, v]) => gem(k, v, "sm")).join("")}</div></div>`).join("");

  tokens.innerHTML = [...COLORS, "y"].map((c) => `<div class="tk ${c} ${state.pick.includes(c) ? "on" : ""} ${state.bank[c] <= 0 ? "out" : ""}" onclick="toggleToken('${c}')"><b>${state.bank[c]}</b></div>`).join("");

  const thumb = (c, extra = "") => `<div class="th ${extra}">${cardImg(c)}${gem(c.bonus, "", "sm")}</div>`;
  me_.innerHTML = `<div class="me-head">${img(IMG.avatar(state.current))}<b>${p.name}</b><span class="sc">${p.score}</span></div>
    <h3>เหรียญที่ถืออยู่ (${Object.values(p.tokens).reduce((a, b) => a + b, 0)}/${MAX_TOKENS})</h3>
    <div class="gems-row">${["r","b","g","k","w","y"].map((c) => `<div>${gem(c, "", "lg")}${p.tokens[c]}</div>`).join("")}</div>
    <h3>โบนัสการ์ด</h3>
    <div class="gems-row">${["r","b","g","k","w"].map((c) => `<div>${gem(c, "", "lg")}${p.bonus[c]}</div>`).join("")}</div>
    <h3>การ์ดที่จองไว้ (${p.reserved.length}/3)</h3>
    <div class="thumbs">${[0, 1, 2].map((i) => p.reserved[i]
      ? `<div class="th ${state.card && state.card.kind === "r" && state.card.a === i ? "sel" : ""}" onclick="pickCard('r',${i})">${cardImg(p.reserved[i])}${gem(p.reserved[i].bonus, "", "sm")}</div>`
      : `<div class="th slot"></div>`).join("")}</div>
    <h3>การ์ดที่ซื้อแล้ว (${p.cards.length})</h3>
    <div class="thumbs">${p.cards.slice(-8).map((c) => thumb(c)).join("") || '<span style="font-size:12px">ยังไม่มี</span>'}</div>`;

  const c = selCard();
  if (c) {
    const need = shortage(c, p), ok = canBuy(c, p);
    action.innerHTML = `<h3>การ์ด Lv.${c.level} · ${c.points} คะแนน</h3>
      ${buyInfo(c, p)}
      <div class="btns"><button class="btn" onclick="reserveSel()" ${state.card.kind === "r" ? "disabled" : ""}>จอง</button>
      <button class="btn primary" onclick="buySel()" ${ok ? "" : "disabled"}>ซื้อการ์ด</button></div>`;
  } else {
    const s = state.pick, valid = s.length > 0;
    action.innerHTML = `<h3>เลือกเหรียญ (${s.length}/3)</h3><p>เลือก 3 สีต่างกัน หรือสีเดียวกัน 2 เหรียญ</p>
      <div class="picked">${s.map((x) => gem(x, "", "lg")).join("")}</div>
      <div class="btns"><button class="btn" onclick="resetPick()" ${valid ? "" : "disabled"}>↺ รีเซ็ต</button>
      <button class="btn primary" onclick="takeTokens()" ${valid ? "" : "disabled"}>เก็บเหรียญ</button></div>`;
  }
  logEl.innerHTML = state.log.map((x) => `<div>${x}</div>`).join("");
}

/* จบเกม: เก็บผลและสถานะไว้ใน sessionStorage แล้วไปหน้า gem_win.html */
function showReport() {
  const result = state.players.map((q) => ({ name: q.name, i: q.i, score: q.score, cards: q.cards.length }));
  try {
    sessionStorage.setItem("gemResult", JSON.stringify(result));
    sessionStorage.setItem("gemState", JSON.stringify(state));
  } catch (e) {}
  location.href = "gem_win.html";
}

function toast(t) {
  toastEl.textContent = t; toastEl.classList.add("show");
  clearTimeout(window.tt); window.tt = setTimeout(() => toastEl.classList.remove("show"), 2000);
}

/* ตัวแปรอ้างอิง element (id ชน global จึงตั้งชื่อใหม่ให้ชัดเจน) */
const me_ = document.getElementById("me"), logEl = document.getElementById("log"), toastEl = document.getElementById("toast");
/* เริ่มต้น: ถ้ามาจากปุ่ม "รับชมเกมต่อ" (?view=1) ให้กู้กระดานตอนจบมาดู ไม่งั้นเริ่มเกมใหม่ */
(function start() {
  if (new URLSearchParams(location.search).get("view") === "1") {
    try {
      const saved = JSON.parse(sessionStorage.getItem("gemState"));
      if (saved) { state = saved; return render(); }
    } catch (e) {}
  }
  sessionStorage.removeItem("gemState");
  sessionStorage.removeItem("gemResult");
  newGame();
})();

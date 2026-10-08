/* ===== ตั้งค่า ===== */
const LOBBY_URL = "";            // ใส่ลิงก์หน้าล็อบบี้ ถ้าเว้นว่างปุ่มจะกลับไปหน้าเกมแล้วเริ่มเกมใหม่
const GAME_URL = "gem_dominion.html";
const avatar = (i) => `https://api.dicebear.com/9.x/adventurer/svg?seed=Miner${i}&backgroundColor=3a2a1b`;

/* ===== อ่านผลจากหน้าเกม (ถ้าเปิดหน้านี้ตรงๆ จะใช้ข้อมูลตัวอย่าง) ===== */
let result = null;
try { result = JSON.parse(sessionStorage.getItem("gemResult")); } catch (e) {}
const isDemo = !result;
if (isDemo) {
  result = [
    { name: "Player 1", i: 0, score: 13, cards: 6 },
    { name: "Player 2", i: 1, score: 12, cards: 5 },
    { name: "Player 3", i: 2, score: 16, cards: 7 },
    { name: "Player 4", i: 3, score: 5, cards: 3 }
  ];
}

/* ===== จัดอันดับ: คะแนนมากสุดก่อน ถ้าเท่ากันคนที่ใช้การ์ดน้อยกว่าชนะ ===== */
const sorted = [...result].sort((a, b) => b.score - a.score || a.cards - b.cards);
const tied = sorted.filter((p) => p.score === sorted[0].score && p.cards === sorted[0].cards);

document.getElementById("who").textContent =
  tied.length > 1 ? tied.map((p) => p.name).join(" และ ") + " เสมอกัน" : `${sorted[0].name} คือผู้ชนะ`;

document.getElementById("list").innerHTML = sorted.map((p, k) => `
  <li class="row ${tied.includes(p) ? "first" : ""}">
    <span class="av"><img src="${avatar(p.i)}" alt="" onerror="this.remove()"></span>
    <span class="nm">${p.name}</span>
    <span class="pt">${p.score} คะแนน</span>
  </li>`).join("");

/* ===== ปุ่ม ===== */
document.getElementById("lobbyBtn").onclick = () => { location.href = LOBBY_URL || GAME_URL; };
document.getElementById("againBtn").onclick = () => { location.href = GAME_URL; };
document.getElementById("viewBtn").onclick = () => {
  if (isDemo) return alert("นี่คือหน้าตัวอย่าง ยังไม่มีเกมให้กลับไปดู");
  location.href = GAME_URL + "?view=1";
};
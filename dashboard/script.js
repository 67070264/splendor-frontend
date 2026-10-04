document.addEventListener("DOMContentLoaded", function () {

    // =========================
    // ค้นหาห้อง
    // =========================
    const searchRoom = document.getElementById("searchRoom");
    if (searchRoom) {
        searchRoom.addEventListener("input", function () {
            const keyword = searchRoom.value.trim();
            const roomRows = document.querySelectorAll(".room-row");

            roomRows.forEach(function (row) {
                const roomCodeEl = row.querySelector(".room-code");
                if (roomCodeEl) {
                    const roomCode = roomCodeEl.textContent.trim();
                    if (roomCode.includes(keyword)) {
                        row.style.display = "grid";
                    } else {
                        row.style.display = "none";
                    }
                }
            });
        });
    }

    // =========================
    // ปุ่มสร้างห้อง
    // =========================
    const createRoomBtn = document.getElementById("createRoomBtn");
    if (createRoomBtn) {
        createRoomBtn.addEventListener("click", function () {
            window.location.href = "../create_room/index.html";
        });
    }

    // =========================
    // Logout
    // =========================
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            sessionStorage.clear();
            window.location.href = "../login/index.html";
        });
    }

});

// =========================
// ฟังก์ชันสำหรับเรียกใช้เมื่อต่อกับ Supabase / ระบบหลังบ้าน
// =========================
function renderRoomList(rooms) {
    const roomList = document.getElementById("roomList");
    if (!roomList) return;

    roomList.innerHTML = ""; // ล้างข้อมูลเก่า

    if (!rooms || rooms.length === 0) {
        roomList.innerHTML = `<div class="no-rooms">ยังไม่มีห้องที่เปิดอยู่</div>`;
        return;
    }

    rooms.forEach(room => {
        // เช็กว่าผู้เล่นเต็มหรือไม่
        const isFull = room.current_players >= room.max_players;

        const roomRow = document.createElement("div");
        roomRow.className = `room-row ${isFull ? "full" : ""}`;

        roomRow.innerHTML = `
            <div class="room-code">${room.code}</div>
            <div class="room-player">${room.current_players}/${room.max_players}</div>
            <button class="join-btn" data-room="${room.code}" ${isFull ? "disabled" : ""}>
                Join
            </button>
        `;

        roomList.appendChild(roomRow);
    });

    attachJoinEvents();
}

// ผูก Event ให้ปุ่ม Join
function attachJoinEvents() {
    const joinButtons = document.querySelectorAll(".join-btn:not([disabled])");
    joinButtons.forEach(button => {
        button.addEventListener("click", function () {
            const roomCode = this.getAttribute("data-room");
            if (roomCode) {
                alert("กำลังเข้าห้อง " + roomCode);
                // window.location.href = `../game/index.html?room=${roomCode}`;
            }
        });
    });
}
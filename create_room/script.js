document.addEventListener("DOMContentLoaded", function () {
    const playerCards = document.querySelectorAll(".player-card");
    // รองรับทั้ง id="createRoomBtn" หรือ class="start-btn"
    const createRoomBtn = document.getElementById("createRoomBtn") || document.querySelector(".start-btn"); 
    const playerError = document.getElementById("playerError");

    let selectedPlayers = 4; // ค่าเริ่มต้น

    playerCards.forEach(function (card) {
        card.addEventListener("click", function () {
            // 1. ถอดคลาส active และ selected ออกจากทุกการ์ด
            playerCards.forEach(function (item) {
                item.classList.remove("active", "selected");
            });

            // 2. ใส่คลาส active และ selected ให้การ์ดที่ถูกกด (เปลี่ยนพื้นหลังเป็นสีม่วงเข้ม)
            card.classList.add("active", "selected");

            // 3. ดึงค่าจำนวนผู้เล่นจาก data-player (หากไม่มีจะดึงจากตัวเลข .num)
            const playerVal = card.dataset.player || card.querySelector(".num")?.textContent.trim();
            selectedPlayers = Number(playerVal);

            // 4. ล้างข้อความแจ้งเตือน Error (ถ้ามี)
            if (playerError) {
                playerError.textContent = "";
            }
        });
    });

    if (createRoomBtn) {
        createRoomBtn.addEventListener("click", function () {
            // ตรวจสอบจำนวนผู้เล่น
            if (![2, 3, 4].includes(selectedPlayers)) {
                if (playerError) {
                    playerError.textContent = "กรุณาเลือกจำนวนผู้เล่น";
                }
                return;
            }

            // บันทึกจำนวนผู้เล่นลง sessionStorage
            sessionStorage.setItem("selectedPlayers", selectedPlayers);

            // ไปยังหน้า room.html
            window.location.href = "room.html";
        });
    }
});
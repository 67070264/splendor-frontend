# splendor-frontend

# 🔌 คู่มือเชื่อมต่อ Backend สำหรับ Frontend (ทีม 3)

## 🛠 สิ่งที่ต้องทำก่อนเริ่ม
เปิด Terminal ในโฟลเดอร์โปรเจกต์ Frontend แล้วรันคำสั่งนี้เพื่อติดตั้งไลบรารี:
`npm install socket.io-client`

## 🚀 วิธีเอาไปใช้งานในหน้าจอ (ตัวอย่างถ้าใช้ React)

```javascript
import { useEffect, useState } from 'react';
import { gameActions, gameListeners } from './services/socketClient';

function GameBoard() {
    const [gameState, setGameState] = useState(null);
    const myPlayerId = "socket_id_1"; // ดึงจากระบบ Login ของคนที่ 1

    useEffect(() => {
        // 1. เข้ามาปุ๊บ สั่ง Join ห้องเลย
        gameActions.joinRoom("123456");

        // 2. เปิดหูดักรอข้อมูลกระดานจากเซิร์ฟเวอร์
        gameListeners.onBoardUpdate((newData) => {
            console.log("ได้ข้อมูลกระดานใหม่แล้ว!", newData);
            setGameState(newData); // เอาไปอัปเดตหน้าจอ
        });

        // 3. เปิดหูดักรอ Error
        gameListeners.onError((msg) => {
            alert("❌ ผิดกติกา: " + msg); // เปลี่ยนเป็น Popup สวยๆ ของคนที่ 2
        });

        // คลีนอัปเมื่อผู้เล่นออกจากการหน้านี้
        return () => {
            gameListeners.removeListeners();
        };
    }, []);

    // 4. ผูกฟังก์ชันกับปุ่มบนหน้าจอ
    const handleTake3Gems = () => {
        gameActions.takeGems(myPlayerId, ["diamond", "sapphire", "ruby"]);
    };

    return (
        <div>
            <h1>ห้องเกม</h1>
            <button onClick={handleTake3Gems}>หยิบ 3 เหรียญ</button>
        </div>
    );
}

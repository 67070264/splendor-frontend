// ไฟล์: src/services/socketClient.js
import { io } from 'socket.io-client';

// 1. ตั้งค่าการเชื่อมต่อ (ตอนเทสใช้ localhost พอขึ้นคลาวด์ค่อยเปลี่ยนเป็น URL ของ AWS ALB)
const SOCKET_URL = 'http://localhost:3000'; // ถ้าใช้ Vite อาจจะเปลี่ยนเป็น import.meta.env.VITE_API_URL
export const socket = io(SOCKET_URL);

// 2. หมวด: ส่งข้อมูลไปหา Backend (Emit)
export const gameActions = {
    joinRoom: (roomId) => {
        socket.emit('joinRoom', roomId);
    },
    takeGems: (playerId, selectedGems) => {
        // selectedGems ต้องเป็น Array ของชื่อสี เช่น ['diamond', 'sapphire', 'ruby']
        socket.emit('playerTakeGems', { playerId, selectedGems });
    },
    buyCard: (playerId, cardId, tier) => {
        socket.emit('buyCard', { playerId, cardId, tier });
    },
    reserveCard: (playerId, cardId, tier) => {
        socket.emit('reserveCard', { playerId, cardId, tier });
    }
};

// 3. หมวด: ดักฟังข้อมูลจาก Backend (On)
export const gameListeners = {
    // รอรับสถานะกระดานใหม่ (เอาไปใช้อัปเดต UI)
    onBoardUpdate: (callback) => {
        socket.on('updateBoard', callback);
    },
    // รอรับแจ้งเตือนเมื่อทำผิดกฎ (เอาไปทำ Popup แจ้งเตือน)
    onError: (callback) => {
        socket.on('errorMsg', callback);
    },
    // สำคัญ: เอาไว้ล้างการดักฟังเวลากดออกจากห้อง ป้องกันบั๊กข้อมูลเด้งเบิ้ล
    removeListeners: () => {
        socket.off('updateBoard');
        socket.off('errorMsg');
    }
};
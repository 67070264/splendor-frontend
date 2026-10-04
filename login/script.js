document.addEventListener("DOMContentLoaded", function () {
    // 1. ตั้งค่า Supabase (นำ URL และ ANON_KEY ของจริงมาใส่)'
    const SUPABASE_URL = 'https://aatwzzxgsxbyjkmudaua.supabase.co';
    const SUPABASE_ANON_KEY = 'sb_publishable_wEctXOLBK4CScL-GzWRpfg_xa0drqn3';


    const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    const loginForm = document.getElementById("loginForm");
    const usernameInput = document.getElementById("username"); // ช่องกรอกชื่อผู้ใช้/อีเมล
    const passwordInput = document.getElementById("password");
    const usernameError = document.getElementById("usernameError");
    const passwordError = document.getElementById("passwordError");

    if (!loginForm) return;

    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();

        // ล้าง Error เก่า
        if (usernameError) usernameError.textContent = "";
        if (passwordError) passwordError.textContent = "";

        const inputVal = usernameInput.value.trim();
        const passwordVal = passwordInput.value;

        if (inputVal === "" || passwordVal === "") {
            if (usernameError) usernameError.textContent = "กรุณากรอกชื่อผู้ใช้/อีเมล และรหัสผ่าน";
            return;
        }

        let loginEmail = inputVal;

        // --- ถ้าผู้ใช้ไม่ได้พิมพ์เป็นอีเมล (ไม่มี @) ให้ไปค้นหาอีเมลจากชื่อผู้ใช้ก่อน ---
        if (!inputVal.includes("@")) {
            const { data: foundEmail, error: rpcError } = await supabaseClient
                .rpc('get_email_by_username', { username_input: inputVal });

            if (rpcError || !foundEmail) {
                if (usernameError) usernameError.textContent = "ไม่พบชื่อผู้ใช้นี้ในระบบ";
                return;
            }
            loginEmail = foundEmail; // นำอีเมลที่ค้นเจอมาใช้ล็อกอิน
        }

        // --- ส่งข้อมูลเข้าสู่ระบบด้วยอีเมล ---
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email: loginEmail,
            password: passwordVal,
        });

        if (error) {
            if (usernameError) {
                usernameError.textContent = "ชื่อผู้ใช้/อีเมล หรือรหัสผ่านไม่ถูกต้อง";
            }
        } else if (data.user) {
            window.location.href = "../dashboard/index.html"; // ย้ายไปหน้าหลังล็อกอิน
        }
    });
});
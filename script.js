let countdownInterval;
let totalSeconds = 0;
let initialTotalSeconds = 0;
let isRunning = false;
let isTickMuted = false; // Thêm biến kiểm soát tiếng tích tắc

// Các thành phần DOM
const display = document.getElementById('display');
const inputMinutes = document.getElementById('input-minutes');
const inputSeconds = document.getElementById('input-seconds');
const motivationText = document.getElementById('motivation-text');
const timerBox = document.getElementById('timer-box'); 

const btnStart = document.getElementById('btn-start');
const btnPause = document.getElementById('btn-pause');
const btnReset = document.getElementById('btn-reset');
const btnSound = document.getElementById('btn-sound');
const btnToggleTick = document.getElementById('toggle-tick'); // Nút bật/tắt tiếng

// Các file Âm thanh
const alarmSound = document.getElementById('alarm-sound');
const tickSound = document.getElementById('tick-sound');
const hoverSound = document.getElementById('hover-sound');
const clickSound = document.getElementById('click-sound');

// Nhân vật Pixel Art
const pixelChar = document.getElementById('pixel-char');
const imgIdle = "./imgs/cat.gif"; 
const imgRunning = "./imgs/cat.gif"; 

// Cài đặt vòng tròn SVG
const circle = document.getElementById('progress-circle');
const radius = circle.r.baseVal.value;
const circumference = radius * 2 * Math.PI;

circle.style.strokeDasharray = `${circumference} ${circumference}`;
circle.style.strokeDashoffset = 0;

const quotes = [
    "Tâm định khí sinh", "Ý chí bất khuất", "Nhất niệm phá hạn", "Thân cường ý vững",
    "Khí huyết dâng trào", "Chiến ý ngút trời", "Không lùi nửa bước", "Lực tận ý sinh",
    "Thân mỏi tâm bất", "Ý dẫn lực hành", "Cốt vững thân kiên", "Khí tụ lực thành",
    "Đau luyện kim thân", "Khổ sinh cường giả", "Phá hạn đăng phong", "Độc bộ quần hùng",
    "Nhất kích tất sát", "Chiến chí bất diệt", "Thân tàn ý tại", "Bất khuất bất khuynh",
    "Tâm như thiết thạch", "Ý tựa cuồng phong", "Khí hành bách mạch", "Lực phá cửu trùng",
    "Huyết nhiệt bất tắt", "Chiến lộ vô cùng", "Nhất bộ nhất phá", "Vạn niệm quy không",
    "Thân luyện bách kiếp", "Tâm vượt thiên quan", "Ý thành đạo cốt", "Lực hóa kim thân",
    "Sinh tử nhất tuyến", "Cường giả vi tôn", "Khí đoạn ý tại", "Thân bại tâm tồn",
    "Phong vân biến sắc", "Chiến ý xung thiên", "Một niệm bất diệt", "Vạn kiếp bất phiên",
    "Thân phá giới hạn", "Tâm khai huyền môn", "Ý trảm sợ hãi", "Lực định càn khôn",
    "Bách luyện thành cương", "Thiên ma bất xâm", "Ý như trường kiếm", "Phá tận mê lâm"
];

// THÊM MỚI: Hiệu ứng âm thanh khi di chuột và click vào nút
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        hoverSound.currentTime = 0;
        hoverSound.play().catch(e => {}); 
    });
    
    button.addEventListener('click', () => {
        clickSound.currentTime = 0;
        clickSound.play().catch(e => {});
    });
});

// THÊM MỚI: Xử lý bật tắt tiếng Tích Tắc
btnToggleTick.addEventListener('click', () => {
    isTickMuted = !isTickMuted;
    btnToggleTick.classList.toggle('muted');
    btnToggleTick.textContent = isTickMuted ? "🔇" : "🔊";
});

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}

function updateDisplay(secondsLeft) {
    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;
    
    const displayMins = minutes < 10 ? '0' + minutes : minutes;
    const displaySecs = seconds < 10 ? '0' + seconds : seconds;
    
    display.textContent = `${displayMins}:${displaySecs}`;
}

function changeMotivation() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    motivationText.textContent = quotes[randomIndex];
    motivationText.style.color = "#ccff00"; 
}

function startTimer() {
    if (isRunning) return;

    if (totalSeconds === 0 || totalSeconds === initialTotalSeconds) {
        const mins = parseInt(inputMinutes.value) || 0;
        const secs = parseInt(inputSeconds.value) || 0;
        totalSeconds = (mins * 60) + secs;
        initialTotalSeconds = totalSeconds;
        
        alarmSound.pause();
        alarmSound.currentTime = 0;
        display.style.color = "#fff";
        timerBox.classList.remove('shaking'); 
        changeMotivation();
    }

    if (totalSeconds <= 0) return;

    isRunning = true;
    pixelChar.src = imgRunning; 
    
    countdownInterval = setInterval(() => {
        totalSeconds--;
        updateDisplay(totalSeconds);
        
        // THÊM MỚI: Phát tiếng tích tắc mỗi giây nếu chưa bị tắt
        if (!isTickMuted && totalSeconds > 0) {
            tickSound.currentTime = 0;
            tickSound.play().catch(e => {});
        }

        const percentage = (totalSeconds / initialTotalSeconds) * 100;
        setProgress(percentage);

        if (totalSeconds > 0 && totalSeconds % 10 === 0) {
            changeMotivation();
        }

        if (totalSeconds <= 0) {
            clearInterval(countdownInterval);
            isRunning = false;
            display.textContent = "00:00";
            display.style.color = "#0099ff";
            motivationText.textContent = "CẬU CHỦ CHÁY QUÁ";
            setProgress(0);
            
            pixelChar.src = imgIdle; 
            timerBox.classList.add('shaking'); 
            alarmSound.play();
        }
    }, 1000);
}

function pauseTimer() {
    clearInterval(countdownInterval);
    isRunning = false;
    pixelChar.src = imgIdle; 
    motivationText.textContent = "ĐANG TẠM DỪNG...";
}

function resetTimer() {
    clearInterval(countdownInterval);
    isRunning = false;
    
    const mins = parseInt(inputMinutes.value) || 0;
    const secs = parseInt(inputSeconds.value) || 0;
    totalSeconds = (mins * 60) + secs;
    initialTotalSeconds = totalSeconds;
    
    updateDisplay(totalSeconds);
    setProgress(100); 
    
    display.style.color = "#ffffff";
    motivationText.textContent = "SẴN SÀNG CHƯA?";
    
    timerBox.classList.remove('shaking'); 
    pixelChar.src = imgIdle; 
    alarmSound.pause();
    alarmSound.currentTime = 0;
}

// Bắt quả tang chuyển Tab (Kỷ luật thép)
document.addEventListener("visibilitychange", () => {
    if (document.hidden && isRunning) {
        pauseTimer(); 
        motivationText.textContent = "🔥 ĐỊNH TRỐN À? QUAY LẠI NGAY";
        motivationText.style.color = "#ff4500";
        pixelChar.src = imgIdle; 
    }
});

// Gắn sự kiện (Event Listeners)
btnStart.addEventListener('click', startTimer);
btnPause.addEventListener('click', pauseTimer);
btnReset.addEventListener('click', resetTimer);

btnSound.addEventListener('click', () => {
    const youtubeLink = "https://www.youtube.com/results?search_query=phonk+gym+workout+music";
    window.open(youtubeLink, '_blank');
});

inputMinutes.addEventListener('input', resetTimer);
inputSeconds.addEventListener('input', resetTimer);

// Khởi tạo ngay từ đầu
resetTimer();
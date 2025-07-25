const prizes = [
  "王品兌換券",
  "路邊攤滷肉飯一份",
  "50箱無糖可口可樂",
  "50手啤酒",
  "再接再厲",
  "再接再厲",
  "再接再厲",
  "🎉 Galaxy Z Flip7 🎉"
];

// 對應圖片（請把檔案放到 images/ 資料夾）
const imageList = [
  "images/wangpin.png",
  "images/luroufan.png",
  "images/coke.png",
  "images/beer.png",
  "images/fog.png",
  "images/fog.png",
  "images/fog.png",
  "images/flip7.png"
];

const wheel = document.getElementById("wheel");
const ctx = wheel.getContext("2d");
const spinBtn = document.getElementById("spin-btn");
const result = document.getElementById("result");
const prizeImg = document.getElementById("prize-img");

const centerX = wheel.width / 2;
const centerY = wheel.height / 2;
const radius = wheel.width / 2 - 10;
const segmentCount = prizes.length;

let startAngle = 0;
let spinning = false;

function drawWheel() {
  const arc = (2 * Math.PI) / segmentCount;
  ctx.clearRect(0, 0, wheel.width, wheel.height);

  for (let i = 0; i < segmentCount; i++) {
    const angle = startAngle + i * arc;
    // 色彩漸層
    ctx.fillStyle = i % 2 === 0 ? "#ffeaa7" : "#fab1a0";
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.arc(centerX, centerY, radius, angle, angle + arc);
    ctx.closePath();
    ctx.fill();

    // 文字
    ctx.save();
    ctx.fillStyle = "#2d3436";
    ctx.font = "14px Arial";
    ctx.translate(
      centerX + Math.cos(angle + arc / 2) * radius * 0.65,
      centerY + Math.sin(angle + arc / 2) * radius * 0.65
    );
    ctx.rotate(angle + arc / 2 + Math.PI / 2);
    ctx.textAlign = "center";
    ctx.fillText(prizes[i], 0, 0);
    ctx.restore();

    // 圖片
    const img = new Image();
    img.src = imageList[i];
    ((index) => {
      img.onload = () => {
        ctx.save();
        ctx.translate(
          centerX + Math.cos(angle + arc / 2) * radius * 0.4,
          centerY + Math.sin(angle + arc / 2) * radius * 0.4
        );
        ctx.rotate(angle + arc / 2 + Math.PI / 2);
        ctx.drawImage(img, -20, -20, 40, 40);
        ctx.restore();
      };
    })(i);
  }
}

function spin() {
  if (spinning) return;
  spinning = true;

  // 第一次必中 Galaxy Z Flip7
  const prizeIndex = 7;
  const arc = (2 * Math.PI) / segmentCount;
  const stopAngle = 5 * 2 * Math.PI + // 轉 5 圈
    (Math.PI * 2 - (prizeIndex * arc + arc / 2)); // 停在指定格子

  let start = null;
  function animate(timestamp) {
    if (!start) start = timestamp;
    const elapsed = timestamp - start;

    // 4秒緩慢減速旋轉
    const duration = 4000;
    if (elapsed < duration) {
      const easeOut = 1 - Math.pow(1 - elapsed / duration, 3);
      startAngle = easeOut * stopAngle;
      drawWheel();
      requestAnimationFrame(animate);
    } else {
      startAngle = stopAngle;
      drawWheel();
      showResult(prizeIndex);
      spinning = false;
    }
  }
  requestAnimationFrame(animate);
}

function showResult(index) {
  result.innerHTML =
    `🎉 恭喜中獎！<br>${prizes[index]}<br><br>` +
    `爸，其實這不是詐騙網站。<br>這是我和哥哥一起準備的父親節禮物！<br><br>` +
    `你曾經說過小時候差點被詐騙很讓你印象深刻，<br>所以今年，我決定讓你「被詐騙一次」——但這次是真的！<br><br>` +
    `謝謝你這些年來為我們遮風擋雨，<br>換我們送你一點驚喜 ❤️`;
  prizeImg.style.display = "block";
  prizeImg.src = imageList[index];
}

spinBtn.addEventListener("click", spin);

// 初始畫面
drawWheel();

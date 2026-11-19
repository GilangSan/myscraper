/**
 * Reply Comment Generator from lang
 * package: canvas
 * usage at bottom
 */
const { createCanvas, loadImage } = require("canvas");

async function generateCommentBuffer({
    username = "teezytheturtle",
    comment = "Write any comment and see what happens",
    profilePicBuffer = null
}) {
    const scale = 4;
    const maxWidth = 210;
    const lineHeight = 25;
    const fontMain = "bold 18px Arial";
    const fontReply = "14px Arial";

    const tempCanvas = createCanvas(1, 1);
    const tempCtx = tempCanvas.getContext("2d");
    tempCtx.font = fontMain;
    const lines = wrapText(tempCtx, comment, maxWidth);

    const textHeight = lines.length * lineHeight;
    const bubbleHeight = textHeight + 50;
    const bubbleWidth = maxWidth + 50;

    const canvas = createCanvas((bubbleWidth + 40) * scale, (bubbleHeight + 40) * scale);
    const ctx = canvas.getContext("2d");
    ctx.scale(scale, scale);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "white";
    ctx.shadowColor = "rgba(0, 0, 0, 0.15)";
    ctx.shadowBlur = 8;
    roundRect(ctx, 10, 10, bubbleWidth, bubbleHeight, 15);
    ctx.fill();
    ctx.shadowBlur = 0;

    if (profilePicBuffer) {
        try {
            const img = await loadImage(profilePicBuffer);
            ctx.save();
            ctx.beginPath();
            ctx.arc(40, 45, 15, 0, Math.PI * 2);
            ctx.closePath();
            ctx.clip();
            ctx.drawImage(img, 25, 30, 30, 30);
            ctx.restore();
        } catch (err) {
            console.warn("⚠ Gagal load profile picture:", err.message);
        }
    }

    ctx.fillStyle = "black";
    ctx.font = fontMain;
    let y = 45;
    for (let line of lines) {
        ctx.fillText(line, 70, y, bubbleWidth - 80);
        y += 22;
    }

    ctx.fillStyle = "#A1A1A1";
    ctx.font = fontReply;
    ctx.fillText(`Replying to ${username}`, 70, bubbleHeight - 10);

    return canvas.toBuffer("image/png");
}

function wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    let lines = [];
    let line = "";
    for (let word of words) {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line.length > 0) {
            lines.push(line.trim());
            line = word + " ";
        } else {
            line = testLine;
        }
    }
    if (line.length > 0) lines.push(line.trim());
    return lines;
}

function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// usage
(async () => {
    const fs = require("fs");
    const profilePicBuffer = fs.readFileSync("./unnamed.png") // buffer
    const resultBuffer = await generateCommentBuffer({
        username: "Lang",
        comment: "yo wsp my g",
        profilePicBuffer
    });
    fs.writeFileSync("hasil.png", resultBuffer);
})();

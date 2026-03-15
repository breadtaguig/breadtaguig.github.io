let eventsQueue = [];
const eventForm = document.getElementById('eventForm');
const eventList = document.getElementById('eventList');
const eventCount = document.getElementById('eventCount');
const generateBtn = document.getElementById('generateBtn');
const canvasPreviewArea = document.getElementById('canvasPreviewArea');
const canvasesContainer = document.getElementById('canvasesContainer');

// Utility to convert 24h time to 12h AM/PM
function formatAMPM(timeString) {
    if (!timeString) return "";
    const [hour, minute] = timeString.split(':');
    let hours = parseInt(hour);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; 
    return `${hours}:${minute} ${ampm}`;
}

// Get current date for naming convention
function getFormattedDate() {
    return new Date().toISOString().split('T')[0];
}

eventForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('eventPoster');
    const file = fileInput.files[0];

    const processEntry = (imageData = null) => {
        const newEvent = {
            id: Date.now(),
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            time: formatAMPM(document.getElementById('eventTime').value), 
            location: document.getElementById('eventLocation').value,
            organizer: document.getElementById('eventOrganizer').value,
            level: document.getElementById('eventLevel').value,
            imageStr: imageData 
        };
        eventsQueue.push(newEvent);
        updateUI();
        eventForm.reset();
    };

    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => processEntry(event.target.result);
        reader.readAsDataURL(file);
    } else {
        processEntry(); 
    }
});

function removeEvent(id) {
    eventsQueue = eventsQueue.filter(e => e.id !== id);
    updateUI();
}

function updateUI() {
    eventsQueue.sort((a, b) => new Date(a.date) - new Date(b.date));
    eventCount.innerText = eventsQueue.length;
    eventList.innerHTML = '';
    eventsQueue.forEach(ev => {
        const li = document.createElement('li');
        li.className = 'event-item';
        const d = new Date(ev.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        li.innerHTML = `<div class="event-info"><strong>${ev.name} </strong>| ${d} | ${ev.time}</div>
                        <button class="remove-btn" onclick="removeEvent(${ev.id})">Remove</button>`;
        eventList.appendChild(li);
    });
    generateBtn.disabled = eventsQueue.length === 0;
}

generateBtn.addEventListener('click', async () => {
    canvasesContainer.innerHTML = '<h3>Processing Graphics...</h3>';
    canvasPreviewArea.style.display = 'block';
    const chunks = [];
    for (let i = 0; i < eventsQueue.length; i += 4) {
        chunks.push(eventsQueue.slice(i, i + 4));
    }
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
    canvasesContainer.innerHTML = '';
    for (let i = 0; i < chunks.length; i++) {
        await generateCanvasPage(chunks[i], i + 1, chunks.length, today);
    }
});

async function generateCanvasPage(events, pageNum, totalPages, todayStr) {
    const canvas = document.createElement('canvas');
    canvas.width = 2048; 
    canvas.height = 2048; 
    const ctx = canvas.getContext('2d');
    
    const logoPath = '../images/mcgi-youth.png';
    let logo;
    try { logo = await loadImage(logoPath); } catch (e) { console.error("Logo load failed"); }

    // Background
    ctx.fillStyle = "#F2F4F7";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Header
    ctx.fillStyle = "#102A4A"; 
    ctx.fillRect(0, 0, canvas.width, 240); 
    ctx.fillStyle = "#D4AF37"; 
    ctx.fillRect(0, 240, canvas.width, 15);

    // --- Left Side Branding (Vertically Centered to Logo) ---
    let brandingX = 80;
    const logoSize = 130;
    const logoY = 55;
    const logoCenterY = logoY + (logoSize / 2); // 120px

    if (logo) {
        ctx.fillStyle = "#FFFFFF";
        ctx.beginPath();
        ctx.arc(brandingX + 65, logoCenterY, 65, 0, Math.PI * 2);
        ctx.fill();
        ctx.drawImage(logo, brandingX, logoY, logoSize, logoSize);
        brandingX += logoSize + 30; 
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";

    // Row 1: MCGI YOUTH
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 65px Arial";
    ctx.fillText("MCGI", brandingX, logoCenterY - 25);
    const mcgiWidth = ctx.measureText("MCGI").width;
    ctx.fillStyle = "#D4AF37";
    ctx.fillText("YOUTH", brandingX + mcgiWidth + 20, logoCenterY - 25);

    // Row 2: Ministry Subtitle
    ctx.fillStyle = "#A8C2E8";
    ctx.font = "26px Arial";
    ctx.fillText("MEMBERS CHURCH OF GOD INTERNATIONAL • YOUTH MINISTRY", brandingX, logoCenterY + 35);

    // --- Right Side Header (Vertically Centered to Logo) ---
    const rightMargin = 1968;
    ctx.textAlign = "right";
    
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 34px Arial";
    ctx.fillText("UPCOMING EVENTS", rightMargin, logoCenterY - 25);
    
    ctx.fillStyle = "#A8C2E8";
    ctx.font = "italic 22px Arial";
    ctx.fillText(`Generated: ${todayStr}`, rightMargin, logoCenterY + 35);

    // Reset baseline for the rest of the drawing
    ctx.textBaseline = "alphabetic";

    // Footer
    ctx.fillStyle = "#102A4A";
    ctx.fillRect(0, 1968, canvas.width, 80);
    ctx.fillStyle = "#D4AF37";
    ctx.textAlign = "left";
    ctx.font = "bold 24px Arial";
    ctx.fillText("Members Church of God International — Youth Ministry", 80, 2018);
    ctx.textAlign = "right";
    ctx.fillText(`Page ${pageNum} of ${totalPages}`, 1968, 2018);

    // Layout Logic
    const layouts = [
        [],
        [{x: 100, y: 320, w: 1848, h: 750, type: 'wide'}],
        [{x: 100, y: 320, w: 1848, h: 750, type: 'wide'}, {x: 100, y: 1140, w: 1848, h: 750, type: 'wide'}],
        [{x: 80, y: 320, w: 924, h: 780, type: 'tall'}, {x: 1044, y: 320, w: 924, h: 780, type: 'tall'}, {x: 562, y: 1140, w: 924, h: 780, type: 'tall'}],
        [{x: 80, y: 320, w: 924, h: 780, type: 'tall'}, {x: 1044, y: 320, w: 924, h: 780, type: 'tall'}, {x: 80, y: 1140, w: 924, h: 780, type: 'tall'}, {x: 1044, y: 1140, w: 924, h: 780, type: 'tall'}]
    ];

    const currentSet = layouts[events.length];
    for (let i = 0; i < events.length; i++) {
        const ev = events[i];
        const box = currentSet[i];
        
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(box.x, box.y, box.w, box.h);
        ctx.strokeStyle = "#E0E0E0";
        ctx.strokeRect(box.x, box.y, box.w, box.h);

        let tx, ty, imgW, imgH;
        if (box.type === 'wide') {
            imgW = box.w * 0.4; imgH = box.h;
            tx = box.x + imgW + 60; ty = box.y + 100;
        } else {
            imgW = box.w; imgH = box.h * 0.5;
            tx = box.x + 40; ty = box.y + imgH + 60;
        }

        if (ev.imageStr) {
            const img = await loadImage(ev.imageStr);
            drawImageProp(ctx, img, box.x, box.y, imgW, imgH);
        } else {
            const grad = ctx.createLinearGradient(box.x, box.y, box.x + imgW, box.y + imgH);
            grad.addColorStop(0, '#102A4A');
            grad.addColorStop(1, '#1d4a82');
            ctx.fillStyle = grad;
            ctx.fillRect(box.x, box.y, imgW, imgH);
            ctx.textAlign = "center";
            ctx.fillStyle = "rgba(255,255,255,0.2)";
            ctx.font = "bold 120px Arial";
            ctx.fillText("📅", box.x + (imgW/2), box.y + (imgH/2) - 20);
            ctx.fillStyle = "#FFFFFF";
            ctx.font = "bold 32px Arial";
            const wrappedTitle = ev.name.length > 20 ? ev.name.substring(0, 18) + '...' : ev.name;
            ctx.fillText(wrappedTitle.toUpperCase(), box.x + (imgW/2), box.y + (imgH/2) + 60);
        }

        ctx.textAlign = "left";
        ctx.fillStyle = "#F1F5F9";
        roundRect(ctx, tx, ty, 180, 50, 25, true);
        ctx.fillStyle = "#102A4A";
        ctx.font = "bold 22px Arial";
        ctx.textAlign = "center";
        ctx.fillText(ev.level.toUpperCase(), tx + 90, ty + 33);

        ctx.textAlign = "left";
        ctx.fillStyle = "#102A4A";
        ctx.font = "bold 44px Arial";
        ctx.fillText(ev.name.length > 35 ? ev.name.substring(0, 32) + '...' : ev.name, tx, ty + 110);
        ctx.fillStyle = "#4B5563";
        ctx.font = "28px Arial";
        ctx.fillText(`📅 ${ev.date}  |  🕒 ${ev.time}`, tx, ty + 170);
        ctx.fillText(`📍 ${ev.location}`, tx, ty + 220);
        ctx.fillStyle = "#D4AF37";
        ctx.font = "bold 26px Arial";
        ctx.fillText(`👤 ${ev.organizer}`, tx, ty + 275);
    }
    canvas.className = 'generated-canvas';
    canvasesContainer.appendChild(canvas);
}

function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = src;
    });
}

function drawImageProp(ctx, img, x, y, w, h) {
    let iw = img.width, ih = img.height, r = Math.min(w / iw, h / ih), nw = iw * r, nh = ih * r, cx, cy, cw, ch, ar = 1;
    if (nw < w) ar = w / nw;                             
    if (Math.abs(ar - 1) < 1e-14 && nh < h) ar = h / nh; 
    nw *= ar; nh *= ar; cw = iw / (nw / w); ch = ih / (nh / h);
    cx = (iw - cw) * 0.5; cy = (ih - ch) * 0.5;
    ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
}

function roundRect(ctx, x, y, width, height, radius, fill) {
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
    if (fill) ctx.fill();
}

function exportImages() {
    const canvases = document.querySelectorAll('.generated-canvas');
    const date = getFormattedDate();
    canvases.forEach((canvas, index) => {
        const link = document.createElement('a');
        link.download = `MCGI-Youth-Event-Poster-${date}-Page-${index + 1}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    });
}

document.getElementById('downloadHDBtn').addEventListener('click', exportImages);
document.getElementById('downloadStandardBtn').addEventListener('click', exportImages);

document.getElementById('downloadPDFBtn').addEventListener('click', () => {
    const { jsPDF } = window.jspdf;
    const date = getFormattedDate();
    const sizeInPoints = (2048 / 300) * 72;
    const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: [sizeInPoints, sizeInPoints] });
    const canvases = document.querySelectorAll('.generated-canvas');
    canvases.forEach((canvas, index) => {
        const imgData = canvas.toDataURL('image/png');
        if (index > 0) pdf.addPage([sizeInPoints, sizeInPoints], 'portrait');
        pdf.addImage(imgData, 'PNG', 0, 0, sizeInPoints, sizeInPoints);
    });
    pdf.save(`MCGI-Youth-Events-Full-Set-${date}.pdf`);
});
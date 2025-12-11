// ==========================
// Security
// ==========================
// Escape HTML to prevent XSS
function sanitizeInput(input) {
  if (!input) return "";
  return input.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#039;");
}

// Validate URLs
function validateURL(url, inputElement) {
  inputElement.classList.remove("invalid");
  if (!url) return "";
  try {
    const parsed = new URL(url);
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return url;
    }
  } catch {}
  // Invalid URL feedback
  inputElement.classList.add("invalid");
  return "";
}

// ==========================
// Date
// ==========================
// Format date as "December 14, 2025 | Sunday"
function toReadableDate(raw) {
  if (!raw) return "";
  const d = new Date(raw);
  const options = { year: "numeric", month: "long", day: "numeric" };
  const datePart = d.toLocaleDateString("en-US", options);
  const weekday = d.toLocaleDateString("en-US", { weekday: "long" });
  return `${datePart} | ${weekday}`;
}

// Convert normal text to UTF-8 Sans Serif Bold
function toSansBold(text) {
  const normal = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bold =   "𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭" +
                 "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇" +
                 "𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵";
  return text.split("").map(char => {
    const index = normal.indexOf(char);
    return index !== -1 ? bold[index] : char;
  }).join("");
}

// ==========================
// Generate Event Message
// ==========================
function generateMessage() {
  //const group = toSansBold(sanitizeInput(document.getElementById("group").value));
  const group = sanitizeInput(document.getElementById("group").value);
  const title = sanitizeInput(document.getElementById("title").value);
  const date = toReadableDate(document.getElementById("date").value);
  const time = sanitizeInput(document.getElementById("time").value);
  const venue = sanitizeInput(document.getElementById("venue").value);
  const calltime = sanitizeInput(document.getElementById("calltime").value);
  const uniform = sanitizeInput(document.getElementById("uniform").value);
  const who = sanitizeInput(document.getElementById("who").value);
  const notes = sanitizeInput(document.getElementById("notes").value);
  const poster = validateURL(document.getElementById("poster").value, document.getElementById("poster"));
  const gmaps = validateURL(document.getElementById("gmaps").value, document.getElementById("gmaps"));
  const cc = sanitizeInput(document.getElementById("cc").value);

  const msg = `${group || "MCGI Bible Readers"}
📢 𝗘𝘃𝗲𝗻𝘁: ${title || "Event Title"}
📅 𝗗𝗮𝘁𝗲: ${date}
⏰ 𝗧𝗶𝗺𝗲: ${time}
📍 𝗩𝗲𝗻𝘂𝗲: ${venue}
⏱️ 𝗖𝗮𝗹𝗹 𝗧𝗶𝗺𝗲: ${calltime}
👕 𝗨𝗻𝗶𝗳𝗼𝗿𝗺: ${uniform}
👥 𝗪𝗵𝗼: ${who}
📝 𝗡𝗼𝘁𝗲𝘀:
${notes}

${poster ? `🖼️ 𝗣𝗼𝘀𝘁𝗲𝗿: ${poster}` : ""}${gmaps ? `\n🌍 𝗚𝗼𝗼𝗴𝗹𝗲 𝗠𝗮𝗽𝘀: ${gmaps}` : ""}${cc ? `𝗖𝗖 :\n${cc}` : ""}`;

  document.getElementById("output").value = msg;
}

// ==========================
// BS
// ==========================
function generateBSMessage() {
  //const group = toSansBold(sanitizeInput(document.getElementById("group").value));
  const chapdist = sanitizeInput(document.getElementById("chapdist").value);
  const bsdate = toReadableDate(document.getElementById("bsdate").value);
  const timestart = sanitizeInput(document.getElementById("time-start").value);
  const timeend = sanitizeInput(document.getElementById("time-end").value);
  const bsvenue = sanitizeInput(document.getElementById("bsvenue").value);
  const landmark = sanitizeInput(document.getElementById("landmark").value);
  const contactper = sanitizeInput(document.getElementById("contact-per").value);
  const contactnum = sanitizeInput(document.getElementById("contact-num").value);
  const numguest = sanitizeInput(document.getElementById("numguest").value);
  const nummcgi = sanitizeInput(document.getElementById("nummcgi").value);
  const topic = sanitizeInput(document.getElementById("topic").value);
  const spnotes = sanitizeInput(document.getElementById("spnotes").value);

  const msg = `BS Request Format
Chapter/Dist: ${chapdist || "MCGI Bible Readers"}
Date: ${bsdate}
Time Start: ${timestart}
Time End: ${timeend}
Venue: ${bsvenue}
Landmark: ${landmark}
Contact Person: ${contactper}
Contact Number: ${contactnum}
Expected No. of Guest: ${numguest}
Expected No. of MCGI: ${nummcgi}
Requested Topic: ${topic}
Special Notes: ${spnotes}
`;

  document.getElementById("output").value = msg;
}

// ==========================
// Multi Events
// ==========================
function addEvent() {
  const list = document.getElementById("eventList");
  const items = document.querySelectorAll(".eventItem");
  const clone = items[0].cloneNode(true);

  // Clear values on the clone
  clone.querySelectorAll("input, textarea").forEach(el => el.value = "");

  list.appendChild(clone);
}

function generateAll() {
  const eventItems = document.querySelectorAll(".eventItem");
  let finalOutput = "";

  eventItems.forEach((item, index) => {
    const group = sanitizeInput(item.querySelector(".group").value);
    const title = sanitizeInput(item.querySelector(".title").value);
    const date = toReadableDate(item.querySelector(".date").value);
    const time = sanitizeInput(item.querySelector(".time").value);
    const venue = sanitizeInput(item.querySelector(".venue").value);
    const calltime = sanitizeInput(item.querySelector(".calltime").value);
    const uniform = sanitizeInput(item.querySelector(".uniform").value);
    const who = sanitizeInput(item.querySelector(".who").value);
    const notes = sanitizeInput(item.querySelector(".notes").value);
    const cc = sanitizeInput(item.querySelector(".cc").value);

    const poster = validateURL(item.querySelector(".poster").value, item.querySelector(".poster"));
    const gmaps = validateURL(item.querySelector(".gmaps").value, item.querySelector(".gmaps"));

    finalOutput += 
`${group || "MCGI Bible Readers"}
📢 𝗘𝘃𝗲𝗻𝘁: ${title}
📅 𝗗𝗮𝘁𝗲: ${date}
⏰ 𝗧𝗶𝗺𝗲: ${time}
📍 𝗩𝗲𝗻𝘂𝗲: ${venue}
⏱️ 𝗖𝗮𝗹𝗹 𝗧𝗶𝗺𝗲: ${calltime}
👕 𝗨𝗻𝗶𝗳𝗼𝗿𝗺: ${uniform}
👥 𝗪𝗵𝗼: ${who}
📝 𝗡𝗼𝘁𝗲𝘀:
${notes}

${poster ? `🖼️ Poster: ${poster}` : ""}
${gmaps ? `🌍 Google Maps: ${gmaps}` : ""}
${cc ? `𝗖𝗖:\n${cc}` : ""}

----------------------------------------

`;
  });

  document.getElementById("output").value = finalOutput.trim();
}


// ==========================
// Copy to Clipboard
// ==========================
function showCopyAlert() {
  const alertPlaceholder = document.getElementById('alertPlaceholder');
  const alert = document.createElement('div');
  alert.className = 'alert alert-success alert-dismissible fade show';
  alert.role = 'alert';
  alert.innerHTML = `
    Copied to Clipboard
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  `;
  alertPlaceholder.appendChild(alert);

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    const bsAlert = bootstrap.Alert.getOrCreateInstance(alert);
    bsAlert.close();
  }, 3000);
}

function copyMessage() {
  const output = document.getElementById("output");

  // Modern copy method
  navigator.clipboard.writeText(output.value).then(() => {
    showCopyAlert();
  }).catch(err => {
    console.error('Failed to copy: ', err);
  });
}

// ==========================
// Clear Output
// ==========================
function clearOutput() {
  document.getElementById("output").value = "";
}


// ==========================
// Dark Mode Toggle with Persistence and Icon
// ==========================
const toggleButton = document.querySelector('.toggle');

// Toggle dark mode function
function toggleDark() {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('darkMode', 'enabled');
    toggleButton.textContent = '☀️'; // Light icon when dark mode is active
  } else {
    localStorage.setItem('darkMode', 'disabled');
    toggleButton.textContent = '🌙'; // Dark icon when light mode is active
  }
}

// Check localStorage on page load and apply dark mode if enabled
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    toggleButton.textContent = '☀️';
  } else {
    document.body.classList.remove('dark-mode');
    toggleButton.textContent = '🌙';
  }
});


// Apply saved dark mode on page load
document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('darkMode') === 'enabled') {
    document.body.classList.add('dark-mode');
    if (toggleButton) toggleButton.textContent = '☀️';
  } else {
    if (toggleButton) toggleButton.textContent = '🌙';
  }
});

// ==========================
// Export to Text File
// ==========================
function exportText() {
  const title = sanitizeInput(document.getElementById("title").value) || "event";
  const safeTitle = title.replace(/[^a-z0-9\-_ ]/gi, "_");
  const blob = new Blob([document.getElementById("output").value], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = safeTitle + ".txt";
  a.click();
}

// ==========================
// Export to Markdown File
// ==========================
function exportMD() {
  const title = sanitizeInput(document.getElementById("title").value) || "event";
  const safeTitle = title.replace(/[^a-z0-9\-_ ]/gi, "_");
  const blob = new Blob([document.getElementById("output").value], { type: "text/markdown" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = safeTitle + ".md";
  a.click();
}


// ==========================
// Add to Google Calendar
// ==========================
function addToGoogleCalendar() {
  const firstEvent = document.querySelector(".eventItem");

  const title = firstEvent.querySelector(".title").value;
  const date = firstEvent.querySelector(".date").value;
  const time = firstEvent.querySelector(".time").value;
  const venue = firstEvent.querySelector(".venue").value;
  const notes = firstEvent.querySelector(".notes").value;

  if (!title || !date || !time) {
    showAlert("⚠️ Please fill in at least Title, Date, and Time.", "warning");
    return;
  }

  // Build start and end datetime in LOCAL TIME (no Z suffix)
  const start = new Date(`${date}T${time}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const pad = (n) => (n < 10 ? "0" + n : n);

  const formatLocal = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const startStr = formatLocal(start);
  const endStr = formatLocal(end);

  // Build Google Calendar URL
  const url =
    `https://calendar.google.com/calendar/render?action=TEMPLATE` +
    `&text=${encodeURIComponent(title)}` +
    `&dates=${startStr}/${endStr}` +
    `&details=${encodeURIComponent(notes)}` +
    `&location=${encodeURIComponent(venue)}` +
    `&sf=true&output=xml`;

  window.open(url, "_blank");
}

// ==========================
// Add to Calendar (.ics)
// ==========================
function exportICS() {
  const firstEvent = document.querySelector(".eventItem");

  const title = firstEvent.querySelector(".title").value;
  const date = firstEvent.querySelector(".date").value;
  const time = firstEvent.querySelector(".time").value;
  const venue = firstEvent.querySelector(".venue").value;
  const notes = firstEvent.querySelector(".notes").value;

  if (!title || !date || !time) {
    alert("Please fill in Title, Date & Time.");
    return;
  }

  const start = new Date(`${date}T${time}`);
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);

  const pad = (n) => (n < 10 ? "0" + n : n);
  const formatICS = (d) =>
    `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}T${pad(d.getHours())}${pad(d.getMinutes())}00`;

  const startICS = formatICS(start);
  const endICS = formatICS(end);

  const icsContent =
`BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${title}
DTSTART:${startICS}
DTEND:${endICS}
LOCATION:${venue}
DESCRIPTION:${notes}
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = title.replace(/[^a-z0-9\- ]/gi, "_") + ".ics";
  a.click();
}



// ==========================
// Alert
// ==========================
function showAlert(message, type = "danger") {
  const alertPlaceholder = document.getElementById("alertPlaceholder");
  alertPlaceholder.innerHTML = `
    <div class="alert alert-${type} alert-dismissible fade show" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}
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

  const msg = `${group}
📢 𝗘𝘃𝗲𝗻𝘁: ${title || "Event Title"}
📅 𝗗𝗮𝘁𝗲: ${date}
⏰ 𝗧𝗶𝗺𝗲: ${time}
📍 𝗩𝗲𝗻𝘂𝗲: ${venue}
⏱️ 𝗖𝗮𝗹𝗹 𝗧𝗶𝗺𝗲: ${calltime}
👕 𝗨𝗻𝗶𝗳𝗼𝗿𝗺: ${uniform}
👥 𝗪𝗵𝗼: ${who}
📝 𝗡𝗼𝘁𝗲𝘀:
${notes}
${poster ? `🖼️ 𝗣𝗼𝘀𝘁𝗲𝗿: ${poster}` : ""}${gmaps ? `\n🌍 𝗚𝗼𝗼𝗴𝗹𝗲 𝗠𝗮𝗽𝘀: ${gmaps}` : ""}`;

  document.getElementById("output").value = msg;
}

// ==========================
// Copy to Clipboard
// ==========================
function copyMessage() {
  const output = document.getElementById("output");
  output.select();
  document.execCommand("copy");
  alert("Copied to clipboard!");
}

// ==========================
// Dark Mode Toggle with Persistence and Icon
// ==========================
const toggleButton = document.querySelector('.toggle');

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

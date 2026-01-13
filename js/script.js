const chartInstances = {};

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

// ==========================
// Monitoring and Charts
// ==========================
google.charts.load('current', { packages: ['corechart'] });
// google.charts.setOnLoadCallback(loadData);

const SHEET_ID = '1HTAV94PIVyGxPTLe9YFjGxH6EDShsrylqfX3ERJ8YUQ';
const SHEET_NAME = 'Form Responses 1';

const DATA_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?sheet=${encodeURIComponent(SHEET_NAME)}`;


// ==========================
// Filters
// ==========================
const filters = {
  chapter: 'All',
  eventType: 'All',
  week: 'All'
};

// // Populate filter dropdowns dynamically
// function populateFilterDropdowns(data) {
//   const chapterSelect = document.getElementById('filterChapter');
//   const eventSelect = document.getElementById('filterEvent');
//   const weekSelect = document.getElementById('filterWeek');

//   if (!chapterSelect || !eventSelect || !weekSelect) return;

//   // Unique values
//   const chapters = ['All', ...new Set(data.map(r => r[2]).filter(Boolean))];
//   const events = ['All', ...new Set(data.map(r => r[6]).filter(Boolean))];
//   const weeks = ['All', ...new Set(data.map(r => getWeekStart(r[4])).filter(Boolean))];

//   chapters.forEach(val => chapterSelect.appendChild(new Option(val, val)));
//   events.forEach(val => eventSelect.appendChild(new Option(val, val)));
//   weeks.forEach(val => weekSelect.appendChild(new Option(val, val)));

//   // Listen for changes
//   chapterSelect.onchange = () => { filters.chapter = chapterSelect.value; renderDashboard(data); };
//   eventSelect.onchange = () => { filters.eventType = eventSelect.value; renderDashboard(data); };
//   weekSelect.onchange = () => { filters.week = weekSelect.value; renderDashboard(data); };
// }

function populateFilterDropdowns(data) {
  const chapterSelect = document.getElementById('filterChapter');
  const eventSelect = document.getElementById('filterEvent');
  const weekSelect = document.getElementById('filterWeek');

  if (!chapterSelect || !eventSelect || !weekSelect) return;

  // Reset options
  chapterSelect.innerHTML = '<option value="All">All Chapters</option>';
  eventSelect.innerHTML = '<option value="All">All Event Types</option>';
  weekSelect.innerHTML = '<option value="All">All Weeks</option>';

  const chapters = new Set();
  const events = new Set();
  const weeks = new Set();

  data.forEach(row => {
    if (row[2]) chapters.add(row[2]);
    if (row[6]) events.add(row[6]);
    const week = getWeekStart(row[4]);
    if (week) weeks.add(week);
  });

  [...chapters].sort().forEach(v =>
    chapterSelect.appendChild(new Option(v, v))
  );

  [...events].sort().forEach(v =>
    eventSelect.appendChild(new Option(v, v))
  );

  [...weeks].sort().forEach(v =>
    weekSelect.appendChild(new Option(v, v))
  );

  chapterSelect.onchange = () => applyFilters();
  eventSelect.onchange = () => applyFilters();
  weekSelect.onchange = () => applyFilters();
}

function applyFilters() {
  const chapter = document.getElementById('filterChapter').value;
  const eventType = document.getElementById('filterEvent').value;
  const week = document.getElementById('filterWeek').value;

  const filtered = currentData.filter(row => {
    const rowWeek = getWeekStart(row[4]);

    return (chapter === 'All' || row[2] === chapter)
        && (eventType === 'All' || row[6] === eventType)
        && (week === 'All' || rowWeek === week);
  });

  renderDashboard(filtered);
}


// ==========================
// Render Charts with Filters
// ==========================
function renderDashboard(data) {
  // Apply filters
  const filtered = data.filter(row => {
    const week = getWeekStart(row[4]);
    return (filters.chapter === 'All' || row[2] === filters.chapter)
        && (filters.eventType === 'All' || row[6] === filters.eventType)
        && (filters.week === 'All' || week === filters.week);
  });

  // Count data
  const chapter = countByColumn(filtered, 2);
  const membership = countByColumn(filtered, 3);
  const eventType = countByColumn(filtered, 6);
  const venue = countByColumn(filtered, 7);

  renderChart('chapterChart', Object.keys(chapter), Object.values(chapter));
  renderChart('membershipChart', Object.keys(membership), Object.values(membership), 'pie');
  renderChart('eventChart', Object.keys(eventType), Object.values(eventType));
  renderChart('venueChart', Object.keys(venue), Object.values(venue), 'pie');

  // Weekly Summary
  const weekly = countByWeek(filtered, 4);
  const weeks = Object.keys(weekly).sort();
  const totals = weeks.map(w => weekly[w]);

  renderWeeklyChart(weeks, totals);
  renderWeeklyTable(weeks, totals);

  // Weekly by Chapter
  const weeklyChapter = countByWeekAndCategory(filtered, 4, 2);
  renderWeeklyChapterChart(weeklyChapter.weeks, weeklyChapter.categories, weeklyChapter.data);
}

// ==========================
// Load Data
// ==========================
function loadData() {
  fetch(DATA_URL)
    .then(res => res.text())
    .then(text => {
      const data = parseData(text);
      // Populate filters after data is loaded
      populateFilterDropdowns(data);
      renderDashboard(data);
    });
}

function parseData(text) {
  const json = JSON.parse(text.substring(47).slice(0, -2));

  return json.table.rows.map(row =>
    row.c.map(cell => {
      if (!cell) return null;
      if (cell.f) return cell.f;   // formatted date string
      return cell.v;
    })
  );
}


function countByColumn(data, index) {
  const result = {};
  data.forEach(row => {
    const key = row[index];
    if (!key) return;
    result[key] = (result[key] || 0) + 1;
  });
  return result;
}

function renderChart(id, labels, values, type = 'bar') {
  destroyChart(id);

  chartInstances[id] = new Chart(document.getElementById(id), {
    type,
    data: {
      labels,
      datasets: [{
        label: 'Total Attendance',
        data: values
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: type === 'pie' } },
      scales: type === 'bar' ? { y: { beginAtZero: true } } : {}
    }
  });
}


function processData(data) {
  /*
    Column Index Mapping
    0 Timestamp
    1 Full Name
    2 Chapter / Locale
    3 Type of Membership
    4 Attendance Date
    5 Time
    6 Type of Gathering / Event
    7 Venue / Platform
    8 Data Privacy Consent
  */

  const chapter = countByColumn(data, 2);
  const membership = countByColumn(data, 3);
  const eventType = countByColumn(data, 6);
  const venue = countByColumn(data, 7);

  renderChart('chapterChart', Object.keys(chapter), Object.values(chapter));
  renderChart('membershipChart', Object.keys(membership), Object.values(membership), 'pie');
  renderChart('eventChart', Object.keys(eventType), Object.values(eventType));
  renderChart('venueChart', Object.keys(venue), Object.values(venue), 'pie');

  /* WEEKLY SUMMARY */
  const weekly = countByWeek(data, 4);
  const weeks = Object.keys(weekly).sort();
  const totals = weeks.map(w => weekly[w]);

  renderWeeklyChart(weeks, totals);
  renderWeeklyTable(weeks, totals);

  /* WEEKLY PER CHAPTER */
  const weeklyChapter = countByWeekAndCategory(data, 4, 2);

  renderWeeklyChapterChart(
    weeklyChapter.weeks,
    weeklyChapter.categories,
    weeklyChapter.data
  );
}


function getWeekStart(dateValue) {
  let date;

  if (dateValue instanceof Date) {
    date = new Date(dateValue);
  } else {
    // Force ISO-safe parsing
    const parts = dateValue.split('/');
    if (parts.length === 3) {
      // MM/DD/YYYY → YYYY-MM-DD
      date = new Date(`${parts[2]}-${parts[0].padStart(2,'0')}-${parts[1].padStart(2,'0')}`);
    } else {
      date = new Date(dateValue);
    }
  }

  if (isNaN(date)) return null;

  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);

  return date.toISOString().split('T')[0];
}


function countByWeek(data, dateIndex) {
  const weekly = {};

  data.forEach(row => {
    const dateValue = row[dateIndex];
    if (!dateValue) return;

    const week = getWeekStart(dateValue);
    if (!week) return;

    weekly[week] = (weekly[week] || 0) + 1;
  });

  return weekly;
}


function renderWeeklyChart(weeks, values) {
  new Chart(document.getElementById('weeklyChart'), {
    type: 'bar',
    data: {
      labels: weeks,
      datasets: [{
        label: weeks,
        data: values
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

function renderWeeklyTable(weeks, values) {
  const tbody = document.getElementById('weeklyTable');
  tbody.innerHTML = '';

  weeks.forEach((week, i) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${week}</td>
      <td>${values[i]}</td>
    `;
    tbody.appendChild(tr);
  });
}

function countByWeekAndCategory(data, dateIndex, categoryIndex) {
  const result = {};
  const categories = new Set();

  data.forEach(row => {
    const dateValue = row[dateIndex];
    const category = row[categoryIndex];
    if (!dateValue || !category) return;

    const week = getWeekStart(dateValue);
    categories.add(category);

    if (!result[week]) result[week] = {};
    result[week][category] = (result[week][category] || 0) + 1;
  });

  return {
    weeks: Object.keys(result).sort(),
    categories: Array.from(categories),
    data: result
  };
}

function renderWeeklyChapterChart(weeks, categories, data) {
  const datasets = categories.map(category => ({
    label: category,
    data: weeks.map(week => data[week][category] || 0)
  }));

  new Chart(document.getElementById('weeklyChapterChart'), {
    type: 'bar',
    data: {
      labels: weeks,
      datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: { stacked: false },
        y: {
          stacked: false,
          beginAtZero: true
        }
      }
    }
  });
}

// ==========================
// Reset Filters Button
// ==========================
function addResetFiltersButton() {
  const container = document.querySelector('.container');
  if (!container) return;

  const btnDiv = document.createElement('div');
  btnDiv.className = 'text-end mb-3';

  const btn = document.createElement('button');
  btn.className = 'btn btn-secondary btn-sm';
  btn.textContent = 'Reset Filters';
  btn.onclick = () => {
    filters.chapter = 'All';
    filters.eventType = 'All';
    filters.week = 'All';

    document.getElementById('filterChapter').value = 'All';
    document.getElementById('filterEvent').value = 'All';
    document.getElementById('filterWeek').value = 'All';

    renderDashboard(currentData || []);
  };

  btnDiv.appendChild(btn);
  container.insertBefore(btnDiv, container.firstChild);
}

// ==========================
// Current Data Storage
// ==========================
let currentData = [];

function loadDataWithStorage() {
  fetch(DATA_URL)
    .then(res => res.text())
    .then(text => {
      currentData = parseData(text);
      populateFilterDropdowns(currentData);
      renderDashboard(currentData);
    });
}

google.charts.setOnLoadCallback(loadDataWithStorage);


function destroyChart(id) {
  if (chartInstances[id]) {
    chartInstances[id].destroy();
    delete chartInstances[id];
  }
}

destroyChart('weeklyChart');
destroyChart('weeklyChapterChart');


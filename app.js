/**
 * LifeOrbit - Application Logic
 * Goals, Tasks, and Calendar Integration for Game Producers
 * IDs aligned to index.html structure
 */

// ==========================================================================
// STATE MANAGEMENT & INITIAL DATA
// ==========================================================================

const DEFAULT_GOALS = [];
const DEFAULT_TASKS = [];
const DEFAULT_SCHEDULES = [];

let appState = {
  goals: [],
  tasks: [],
  schedules: [],
  currentDate: new Date("2026-07-10T00:00:00"),
  viewDate: new Date("2026-07-10T00:00:00"),
  lastSyncTime: null,
  activeView: "dashboard",
  calendarViewMode: "week",
  reviewMode: "daily"
};

let expandedMilestones = new Set();
let lastTasksState = null;

function undoLastDelete() {
  if (lastTasksState) {
    appState.tasks = JSON.parse(JSON.stringify(lastTasksState));
    lastTasksState = null;
    saveData();
    renderAll();
    alert("直前のタスク削除を取り消しました。(Ctrl+Z)");
  }
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  try {
    loadData();
    setupUI();
    setupEventListeners();
    initFirebase();
    renderAll();
    startClock();
  } catch (err) {
    alert("LifeOrbit 初期化エラー:\n" + err.message + "\n\nStack Trace:\n" + err.stack);
    console.error("Initialization error:", err);
  }
});

// 古いプレフィックス（【Garoon】や【インポート】）を既存の予定名から一括削除する
function cleanOldSchedulePrefixes() {
  let changed = false;
  if (appState.schedules && appState.schedules.length) {
    appState.schedules.forEach(s => {
      if (s.title) {
        const cleaned = s.title.replace(/^【Garoon】/, "").replace(/^【インポート】/, "");
        if (cleaned !== s.title) {
          s.title = cleaned;
          changed = true;
        }
      }
    });
  }
  return changed;
}

function loadData() {
  const raw = localStorage.getItem("lifeorbit_data");
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      // 文字化けデータの自動検出
      const isCorrupted = parsed.tasks && parsed.tasks.some(t => t.title && /縲|繧|縺/.test(t.title));
      if (isCorrupted) {
        console.warn("Corrupted data detected. Resetting to defaults.");
        resetToDefault();
        return;
      }
      appState.goals = parsed.goals && parsed.goals.length ? parsed.goals : JSON.parse(JSON.stringify(DEFAULT_GOALS));
      appState.tasks = parsed.tasks && parsed.tasks.length ? parsed.tasks : JSON.parse(JSON.stringify(DEFAULT_TASKS));
      appState.schedules = parsed.schedules && parsed.schedules.length ? parsed.schedules : JSON.parse(JSON.stringify(DEFAULT_SCHEDULES));
      appState.lastSyncTime = parsed.lastSyncTime || null;
      // shortName が古いデータに無ければマージ
      appState.goals.forEach(g => {
        const def = DEFAULT_GOALS.find(d => d.id === g.id);
        if (def && !g.shortName) g.shortName = def.shortName;
      });
      // 新サンプルデータのマージ
      let updated = false;
      DEFAULT_TASKS.forEach(dt => {
        if (!appState.tasks.some(t => t.id === dt.id)) {
          appState.tasks.push(JSON.parse(JSON.stringify(dt)));
          updated = true;
        }
      });
      
      // 古いタイトルのクリーンアップ
      if (cleanOldSchedulePrefixes()) {
        updated = true;
      }
      
      if (updated) saveData();
    } catch (e) {
      console.error("Parse error:", e);
      resetToDefault();
    }
  } else {
    resetToDefault();
  }
}

function saveData() {
  appState.lastSyncTime = new Date().toISOString();
  localStorage.setItem("lifeorbit_data", JSON.stringify({
    goals: appState.goals,
    tasks: appState.tasks,
    schedules: appState.schedules,
    lastSyncTime: appState.lastSyncTime
  }));
  syncDataToFirebase();
}

function resetToDefault() {
  appState.goals = JSON.parse(JSON.stringify(DEFAULT_GOALS));
  appState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  appState.schedules = JSON.parse(JSON.stringify(DEFAULT_SCHEDULES));
  appState.lastSyncTime = "2026-07-10T09:00:00+09:00";
  saveData();
}

// ==========================================================================
// CLOCK
// ==========================================================================

function startClock() {
  const elTime = document.getElementById("clock-time");
  const elDate = document.getElementById("clock-date");
  if (!elTime || !elDate) return;
  let lastMin = -1;
  function tick() {
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    const s = String(now.getSeconds()).padStart(2, "0");
    elTime.textContent = `${h}:${m}:${s}`;
    const days = ["SUN","MON","TUE","WED","THU","FRI","SAT"];
    const mm = String(now.getMonth()+1).padStart(2,"0");
    const dd = String(now.getDate()).padStart(2,"0");
    elDate.textContent = `${now.getFullYear()}.${mm}.${dd} ${days[now.getDay()]}`;

    const currentMin = now.getMinutes();
    if (currentMin !== lastMin) {
      lastMin = currentMin;
      renderTimeline(); // 分が変わったらタイムライン（NOWの位置）を再描画
    }
  }
  tick();
  setInterval(tick, 1000);
}

// ==========================================================================
// HELPERS
// ==========================================================================

function formatDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

function formatDateDisplay(str) {
  return str ? str.replace(/-/g, ".") : "";
}

function parseLocalDate(str) {
  if (!str) return new Date();
  const parts = str.split("-");
  if (parts.length === 3) {
    return new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  }
  return new Date(str);
}

function parseTime(str) {
  const [h, m] = str.split(":").map(Number);
  return h * 60 + m;
}

// ==========================================================================
// ICS PARSER
// ==========================================================================

function parseICS(text) {
  const lines = text.replace(/\r?\n[ \t]/g, "").split(/\r?\n/);
  const events = [];
  let ev = null;
  for (const line of lines) {
    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const key = line.substring(0, colon).split(";")[0];
    const val = line.substring(colon + 1);
    if (key === "BEGIN" && val === "VEVENT") { ev = {}; }
    else if (key === "END" && val === "VEVENT" && ev) { events.push(ev); ev = null; }
    else if (ev) {
      if (key === "SUMMARY") ev.title = val.replace(/\\,/g, ",");
      else if (key === "DESCRIPTION") ev.desc = val.replace(/\\n/g, "\n").replace(/\\,/g, ",");
      else if (key === "DTSTART") ev.dtstart = val;
      else if (key === "DTEND") ev.dtend = val;
    }
  }
  return events.map(e => {
    const start = parseICSDate(e.dtstart);
    const end = parseICSDate(e.dtend);
    if (!start || !end) return null;
    const allday = (e.dtstart || "").length <= 8;
    return {
      id: "sch-g-" + Math.random().toString(36).substr(2, 9),
      title: e.title || "予定",
      startDate: formatDate(start),
      startTime: allday ? "00:00" : start.toTimeString().substring(0,5),
      endDate: formatDate(end),
      endTime: allday ? "23:59" : end.toTimeString().substring(0,5),
      allday,
      desc: e.desc || "",
      isExternal: true
    };
  }).filter(Boolean);
}

function parseICSDate(val) {
  if (!val) return null;
  if (val.length === 8) return new Date(+val.substring(0,4), +val.substring(4,6)-1, +val.substring(6,8));
  if (val.length >= 15) {
    const y=+val.substring(0,4), mo=+val.substring(4,6)-1, d=+val.substring(6,8);
    const h=+val.substring(9,11), mi=+val.substring(11,13), s=+val.substring(13,15);
    return val.endsWith("Z") ? new Date(Date.UTC(y,mo,d,h,mi,s)) : new Date(y,mo,d,h,mi,s);
  }
  return null;
}

// ==========================================================================
// RENDER ALL
// ==========================================================================

function renderAll() {
  calcGoalProgress();
  renderDashboardGoals();
  renderTodayTasks();
  renderTimeline();
  renderGoalsPage();
  renderKanban();
  renderCalendar();
  renderReviewPage();
  updateGoalDropdowns();
  updateSyncDisplay();
}

function calcGoalProgress() {
  appState.goals.forEach(g => {
    // マイルストーン（isMilestone で、親タスクを持たないもの）のみを対象とする
    const milestones = appState.tasks.filter(t => t.goalId === g.id && t.isMilestone && !t.parentTaskId);
    g.taskCount = milestones.length;
    g.completedCount = milestones.filter(t => t.status === "completed").length;
    g.progress = milestones.length ? Math.round(g.completedCount / milestones.length * 100) : 0;
  });
}

let expandedDashboardGoals = new Set();

// ダッシュボード: 大目標の進捗
function renderDashboardGoals() {
  const el = document.getElementById("dashboard-goals-list");
  if (!el) return;
  el.innerHTML = "";
  appState.goals.forEach(g => {
    const shortName = g.shortName || g.title.replace(/【.*?】/, "").trim();
    const longName = g.title.replace(/【.*?】/, "").trim();
    const isOpen = expandedDashboardGoals.has(g.id);
    const milestones = appState.tasks.filter(t => t.goalId === g.id && t.isMilestone && !t.parentTaskId)
      .sort((a, b) => (a.duedate || "9999") > (b.duedate || "9999") ? 1 : -1);

    const div = document.createElement("div");
    div.className = "goal-progress-item";
    div.style.cssText = "margin-bottom:10px;";

    // ヘッダー行：[▶] [LIFE] タイトル ............. 2/6・33%
    const header = document.createElement("div");
    header.style.cssText = "display:flex;align-items:center;gap:7px;margin-bottom:5px;";
    header.innerHTML = `
      <button onclick="toggleDashboardGoal('${g.id}')"
        style="background:none;border:none;padding:0;cursor:pointer;color:rgba(255,255,255,0.5);flex-shrink:0;display:flex;align-items:center;width:14px;">
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          ${isOpen ? `<polyline points="18 15 12 9 6 15"></polyline>` : `<polyline points="6 9 12 15 18 9"></polyline>`}
        </svg>
      </button>
      <span style="font-size:11px;font-weight:800;letter-spacing:0.06em;padding:2px 8px;border-radius:4px;background:${g.color||"rgba(255,255,255,0.15)"};color:#fff;flex-shrink:0;">${shortName}</span>
      <span style="flex-grow:1;font-size:12px;color:rgba(255,255,255,0.82);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:500;">${longName}</span>
      <span style="font-size:11px;color:rgba(255,255,255,0.45);flex-shrink:0;white-space:nowrap;">${g.completedCount}/${g.taskCount}・${g.progress}%</span>
    `;

    // プログレスバー
    const bar = document.createElement("div");
    bar.style.cssText = "background:rgba(255,255,255,0.08);border-radius:4px;height:4px;overflow:hidden;margin-left:21px;";
    bar.innerHTML = `<div style="height:100%;width:${g.progress}%;background:${g.color||"var(--accent)"};border-radius:4px;transition:width 0.5s;"></div>`;

    div.appendChild(header);
    div.appendChild(bar);

    // 直近の未完了マイルストーンを常時表示
    const nextMilestone = milestones.find(m => m.status !== "completed");
    if (nextMilestone) {
      const nextMsDiv = document.createElement("div");
      nextMsDiv.style.cssText = "font-size:11px;color:rgba(255,255,255,0.4);margin-left:21px;margin-top:5px;display:flex;align-items:center;gap:6px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;";
      nextMsDiv.innerHTML = `
        <span style="color:${g.color || "#818cf8"};font-weight:700;font-family:monospace;flex-shrink:0;">直近MS: ${formatDateDisplay(nextMilestone.duedate)||"未定"}</span>
        <span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:rgba(255,255,255,0.65);">${nextMilestone.title}</span>
      `;
      div.appendChild(nextMsDiv);
    }

    // マイルストーン一覧（プログレスバーの真下・全幅）
    if (isOpen) {
      const msContainer = document.createElement("div");
      msContainer.style.cssText = `margin-top:6px;margin-left:21px;border-left:2px solid ${g.color||"rgba(255,255,255,0.2)"};padding-left:8px;`;

      if (!milestones.length) {
        msContainer.innerHTML = `<div style="font-size:11px;color:rgba(255,255,255,0.3);padding:3px 0;">マイルストーンなし</div>`;
      } else {
        const todayStr = formatDate(new Date());
        milestones.forEach(m => {
          const children = appState.tasks.filter(t => t.parentTaskId === m.id);
          const doneCount = children.filter(t => t.status === "completed").length;
          const isDone = m.status === "completed";

          const msRow = document.createElement("div");
          msRow.style.cssText = "display:flex;align-items:center;gap:7px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.03);";
          msRow.innerHTML = `
            <span style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:3px;font-size:10px;font-family:monospace;padding:1px 5px;color:${isDone?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.7)"};min-width:62px;text-align:center;flex-shrink:0;">${formatDateDisplay(m.duedate)||"未定"}</span>
            <span style="flex-grow:1;font-size:11.5px;color:${isDone?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.82)"};text-decoration:${isDone?"line-through":"none"};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${m.title}</span>
            ${children.length ? `<span style="font-size:10px;color:rgba(255,255,255,0.3);flex-shrink:0;">${doneCount}/${children.length}</span>` : ""}
          `;
          msContainer.appendChild(msRow);

        });
      }
      div.appendChild(msContainer);
    }

    el.appendChild(div);
  });
}

function toggleDashboardGoal(goalId) {
  if (expandedDashboardGoals.has(goalId)) {
    expandedDashboardGoals.delete(goalId);
  } else {
    expandedDashboardGoals.add(goalId);
  }
  renderDashboardGoals();
}


// 目標バッジHTML生成 (goalがない場合はOtherバッジ)
function goalBadgeHTML(goal, shortName, size = "normal") {
  const fontSize = size === "large" ? "11.5px" : size === "small" ? "9px" : "9.5px";
  const padding = size === "large" ? "3px 9px" : size === "small" ? "1px 4px" : "1px 5px";
  const radius = size === "large" ? "4px" : "3px";
  if (goal) {
    return `<span style="font-size:${fontSize};font-weight:800;letter-spacing:0.05em;padding:${padding};border-radius:${radius};background:${goal.color||'rgba(255,255,255,0.15)'};color:#fff;flex-shrink:0;">${shortName}</span>`;
  } else {
    return `<span style="font-size:${fontSize};font-weight:700;letter-spacing:0.03em;padding:${padding};border-radius:${radius};background:rgba(255,255,255,0.1);color:rgba(255,255,255,0.55);flex-shrink:0;border:1px solid rgba(255,255,255,0.12);">Other</span>`;
  }
}

// タスク用クイックアクションボタンHTML生成
function taskQuickBtns(taskId) {
  return `
    <div class="task-quick-btns" style="display:flex;gap:3px;flex-shrink:0;" onclick="event.stopPropagation()">
      <button title="完了" onclick="toggleTaskCompleted('${taskId}')"
        style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);padding:0;transition:all 0.15s;"
        onmouseover="this.style.background='rgba(52,211,153,0.25)';this.style.color='#34d399';" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.5)';">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </button>
      <button title="対応待ちに移動" onclick="changeTaskStatus('${taskId}','waiting',event)"
        style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);padding:0;transition:all 0.15s;"
        onmouseover="this.style.background='rgba(251,191,36,0.25)';this.style.color='#fbbf24';" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.5)';">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
      </button>
      <button title="今週に先送り" onclick="changeTaskStatus('${taskId}','this_week',event)"
        style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);padding:0;transition:all 0.15s;"
        onmouseover="this.style.background='rgba(99,102,241,0.25)';this.style.color='#818cf8';" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.5)';">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>
      </button>
      <button title="削除" onclick="quickDeleteTask('${taskId}')"
        style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);padding:0;transition:all 0.15s;"
        onmouseover="this.style.background='rgba(239,68,68,0.25)';this.style.color='#f87171';" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.5)';">
        <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
      </button>
    </div>
  `;
}

function quickDeleteTask(taskId) {
  lastTasksState = JSON.parse(JSON.stringify(appState.tasks));
  appState.tasks = appState.tasks.filter(t => t.id !== taskId && t.parentTaskId !== taskId);
  saveData();
  renderAll();
}

// ダッシュボード: 今日のタスク
function renderTodayTasks() {
  const el = document.getElementById("dashboard-todo-list");
  if (!el) return;
  el.innerHTML = "";
  // タイムラインに配置済み、またはマイルストーンタスクは除外
  const todayTasks = appState.tasks.filter(t => t.status === "today" && !t.isMilestone && !t.assignedTimeSlot);
  if (todayTasks.length === 0) {
    el.innerHTML = `<div style="color:rgba(255,255,255,0.3);font-size:12px;padding:16px 0;text-align:center;">今日やるタスクはありません</div>`;
    return;
  }
  const todayStr = formatDate(new Date());
  todayTasks.forEach(task => {
    const goal = appState.goals.find(g => g.id === task.goalId);
    const goalShort = goal ? (goal.shortName || "?") : null;
    const isOverdue = task.duedate && task.duedate < todayStr && task.status !== "completed";

    const li = document.createElement("div");
    li.className = "todo-item";
    li.draggable = true;
    li.dataset.taskId = task.id;
    li.style.cssText = "display:flex;align-items:center;gap:7px;padding:5px 4px;border-bottom:1px solid rgba(255,255,255,0.04);cursor:grab;user-select:none;";

    let dateStyle = "background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);";
    if (isOverdue) {
      dateStyle = "background:rgba(239,68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:rgba(248,113,113,0.9);font-weight:700;";
    }

    li.innerHTML = `
      ${goalBadgeHTML(goal, goalShort)}
      <span onclick="openEditTaskModal('${task.id}')" style="flex-grow:1;font-size:12.5px;color:${isOverdue ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.88)"};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;">${task.title}</span>
      ${task.duedate ? `<span style="${dateStyle}font-size:10px;font-family:monospace;padding:1px 5px;border-radius:3px;min-width:62px;text-align:center;flex-shrink:0;margin-right:2px;">${formatDateDisplay(task.duedate)}</span>` : `<span style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.2);font-size:10px;font-family:monospace;padding:1px 5px;border-radius:3px;min-width:62px;text-align:center;flex-shrink:0;margin-right:2px;">-</span>`}
      ${taskQuickBtns(task.id)}
    `;
    li.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.effectAllowed = "move";
      li.style.opacity = "0.4";
    });
    li.addEventListener("dragend", () => { li.style.opacity = ""; });
    el.appendChild(li);
  });
}

// ダッシュボード: タイムライン
function renderTimeline() {
  const el = document.getElementById("timeline-today");
  if (!el) return;
  el.innerHTML = "";
  const todayStr = formatDate(appState.currentDate);
  const scheds = appState.schedules.filter(s => s.startDate === todayStr);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let freeMinutes = 0;

  for (let h = 9; h <= 20; h++) {
    const slot = String(h).padStart(2,"0") + ":00";
    const slotMin = h * 60;
    const isCurrentSlot = nowMin >= slotMin && nowMin < slotMin + 60;
    const isPastSlot = slotMin + 60 <= nowMin;

    const activeSch = scheds.find(s => {
      if (s.allday) return false;
      return slotMin >= parseTime(s.startTime) && slotMin < parseTime(s.endTime);
    });
    const assignedTasks = appState.tasks.filter(t => t.assignedTimeSlot === slot && t.status === "today");
    const hasOverdueTasks = isPastSlot && assignedTasks.length > 0;

    const row = document.createElement("div");
    row.dataset.slot = slot;

    // 行背景・ボーダー
    const rowBg = isCurrentSlot ? "rgba(99,210,255,0.06)" : hasOverdueTasks ? "rgba(239,68,68,0.05)" : "transparent";
    const rowBorderTop = isCurrentSlot ? "border-top:2px solid rgba(99,210,255,0.6);" : "";
    row.style.cssText = `display:flex;gap:0;border-bottom:1px solid rgba(255,255,255,0.04);${rowBorderTop}background:${rowBg};transition:background 0.15s;`;

    // 時刻ラベル
    const timeLabelColor = isCurrentSlot ? "#63d2ff" : isPastSlot ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.35)";
    const nowBadge = isCurrentSlot ? `<div style="font-size:8.5px;color:#63d2ff;font-weight:800;letter-spacing:0.05em;">NOW</div>` : "";
    const timeLabel = document.createElement("div");
    timeLabel.style.cssText = `font-size:11px;color:${timeLabelColor};width:42px;flex-shrink:0;padding:7px 4px 0 8px;text-align:center;line-height:1.3;`;
    timeLabel.innerHTML = slot + (isCurrentSlot ? `<br>${nowBadge}` : "");

    // コンテンツ領域
    const contentDiv = document.createElement("div");
    contentDiv.style.cssText = "flex-grow:1;min-width:0;";

    if (activeSch) {
      const schColor = activeSch.isExternal ? "#a855f7" : "#3b82f6";
      const schBg = activeSch.isExternal ? "rgba(168,85,247,0.08)" : "rgba(59,130,246,0.08)";
      contentDiv.innerHTML = `
        <div onclick="openEditScheduleModal('${activeSch.id}')" style="cursor:pointer;padding:7px 8px;display:flex;align-items:center;gap:8px;background:${schBg};">
          <div style="width:3px;border-radius:2px;align-self:stretch;min-height:20px;background:${schColor};"></div>
          <span style="font-size:12.5px;font-weight:500;opacity:${isPastSlot ? 0.4 : 1};">${activeSch.title}</span>
          <span class="timeline-sch-time" style="font-size:10.5px;color:rgba(255,255,255,0.35);margin-left:auto;">${activeSch.startTime}–${activeSch.endTime}</span>
        </div>`;
    } else {
      freeMinutes += 60;
      if (assignedTasks.length) {
        assignedTasks.forEach(t => {
          const g = appState.goals.find(g => g.id === t.goalId);
          const gs = g ? (g.shortName || "?") : null;
          const taskRow = document.createElement("div");
          taskRow.draggable = true;

          const overdueBorder = hasOverdueTasks ? "border-left:3px solid rgba(239,68,68,0.8);" : "border-left:3px solid transparent;";
          const taskBg = hasOverdueTasks ? "background:rgba(239,68,68,0.1);" : "";
          taskRow.style.cssText = `display:flex;align-items:center;gap:6px;padding:5px 8px;border-bottom:1px solid rgba(255,255,255,0.03);${overdueBorder}${taskBg}`;

          const titleColor = hasOverdueTasks ? "#fca5a5" : "rgba(255,255,255,0.88)";
          const overdueTag = hasOverdueTasks
            ? `<span style="font-size:9px;font-weight:700;color:#ef4444;background:rgba(239,68,68,0.2);padding:1px 5px;border-radius:3px;flex-shrink:0;">遅延</span>`
            : "";

          taskRow.innerHTML = `
            ${overdueTag}
            ${goalBadgeHTML(g, gs, "small")}
            <span onclick="openEditTaskModal('${t.id}')" style="flex-grow:1;font-size:12px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${titleColor};">${t.title}</span>
            ${taskQuickBtns(t.id)}
          `;
          taskRow.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", t.id);
            e.dataTransfer.effectAllowed = "move";
            taskRow.style.opacity = "0.4";
          });
          taskRow.addEventListener("dragend", () => { taskRow.style.opacity = ""; });
          contentDiv.appendChild(taskRow);
        });
      } else {
        // 過去の空スロットはガイドなし、現在・未来のみ表示
        if (!isPastSlot) {
          contentDiv.innerHTML = `<div style="padding:8px;font-size:11px;color:rgba(255,255,255,0.12);font-style:italic;">ここにタスクをドロップ</div>`;
        } else {
          contentDiv.innerHTML = `<div style="padding:8px;min-height:28px;"></div>`;
        }
      }
    }

    // ドロップ対応
    row.addEventListener("dragover", e => {
      e.preventDefault();
      if (activeSch) {
        e.dataTransfer.dropEffect = "none"; // 禁止カーソル
      } else {
        e.dataTransfer.dropEffect = "move";
        row.style.background = "rgba(100,200,255,0.1)";
      }
    });
    row.addEventListener("dragleave", () => { row.style.background = rowBg; });
    row.addEventListener("drop", e => {
      row.style.background = rowBg;
      if (activeSch) return; // スケジュール上はドロップ不可
      dropOnTimeline(e, slot);
    });

    row.appendChild(timeLabel);
    row.appendChild(contentDiv);
    el.appendChild(row);
  }
  const badge = document.getElementById("free-time-badge");
  if (badge) badge.textContent = `空き時間: 約${Math.round(freeMinutes/60)}時間`;
}


function dragStartTask(event, taskId) {
  event.dataTransfer.setData("text/plain", taskId);
  event.dataTransfer.effectAllowed = "move";
}

function dropOnTimeline(event, slot) {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  if (!taskId) return;
  const task = appState.tasks.find(t => t.id === taskId);
  if (task) {
    task.assignedTimeSlot = slot;
    saveData();
    renderTimeline();
    renderTodayTasks();
  }
}


// 目標管理ページ
function renderGoalsPage() {
  const el = document.getElementById("goals-container");
  if (!el) return;
  el.innerHTML = "";
  appState.goals.forEach(goal => {
    const milestones = appState.tasks.filter(t => t.goalId === goal.id && t.isMilestone && !t.parentTaskId);
    milestones.sort((a, b) => (a.duedate || "9999") > (b.duedate || "9999") ? 1 : -1);
    let milestonesHtml = "";
    if (!milestones.length) {
      milestonesHtml = `<div style="font-size:12px;color:rgba(255,255,255,0.3);padding:8px 0;">マイルストーンがありません</div>`;
    } else {
      milestonesHtml = milestones.map(m => {
        const children = appState.tasks.filter(t => t.parentTaskId === m.id);
        const doneCount = children.filter(t => t.status === "completed").length;
        const isOpen = expandedMilestones.has(m.id);
        const mComp = m.status === "completed";
        const mBtnBg = mComp ? "background:#10b981;border:1px solid #10b981;color:#fff;" : "background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);";

        let childHtml = "";
        if (isOpen) {
          const childItems = children.map(c => {
            const isComp = c.status === "completed";
            const btnBg = isComp ? "background:#10b981;border:1px solid #10b981;color:#fff;" : "background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.4);";
            return `
              <div style="display:flex;align-items:center;gap:8px;padding:4px 0;border-bottom:1px solid rgba(255,255,255,0.03);">
                <button onclick="toggleTaskCompleted('${c.id}')" style="${btnBg}width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;padding:0;flex-shrink:0;border:none;" title="完了切り替え">
                  <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </button>
                <span onclick="openEditTaskModal('${c.id}')" style="cursor:pointer;font-size:12.5px;color:${isComp?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.85)"};text-decoration:${isComp?"line-through":"none"};flex-grow:1;">${c.title}</span>
              </div>`;
          }).join("");

          childHtml = `<div style="margin-left:28px;padding:6px 0 4px 12px;border-left:2px solid rgba(255,255,255,0.06);">
            ${childItems}
            <div style="display:flex;gap:6px;margin-top:8px;">
              <input type="text" id="qi-${m.id}" placeholder="子タスクを追加..." style="flex-grow:1;background:rgba(0,0,0,0.2);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:4px 8px;font-size:12px;color:#fff;" onkeydown="if(event.key==='Enter'){addChildTask('${m.id}');event.preventDefault();}">
              <button onclick="addChildTask('${m.id}')" style="background:rgba(255,255,255,0.08);border:none;border-radius:4px;padding:4px 10px;color:#fff;font-size:12px;cursor:pointer;">追加</button>
            </div>
          </div>`;
        }
        return `<div style="margin-bottom:8px;">
          <div style="display:flex;align-items:center;gap:6px;padding:5px 0;border-bottom:1px solid rgba(255,255,255,0.04);">
            <button onclick="toggleMilestoneOpen('${m.id}')" style="background:none;border:none;color:rgba(255,255,255,0.4);font-size:10px;cursor:pointer;width:18px;padding:0;">${isOpen?"▼":"▶"}</button>
            <span style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:3px;font-size:10px;font-family:monospace;padding:1px 5px;color:#fff;min-width:66px;text-align:center;">${formatDateDisplay(m.duedate) || "未定"}</span>
            <span onclick="openEditTaskModal('${m.id}')" style="cursor:pointer;flex-grow:1;font-size:13px;font-weight:500;color:${mComp?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.9)"};">${m.title}</span>
            ${children.length ? `<span style="font-size:10px;color:rgba(255,255,255,0.35);margin-right:4px;">${doneCount}/${children.length}</span>` : ""}
            <button onclick="toggleTaskCompleted('${m.id}')" style="${mBtnBg}width:20px;height:20px;display:flex;align-items:center;justify-content:center;border-radius:4px;cursor:pointer;padding:0;flex-shrink:0;border:none;" title="完了切り替え">
              <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </button>
          </div>
          ${childHtml}
        </div>`;
      }).join("");
    }
    const card = document.createElement("div");
    card.className = `goal-card ${goal.cardClass || ""}`;
    const goalShort = goal.shortName || goal.title.replace(/【.*?】/, "").trim();
    card.innerHTML = `
      <div class="goal-card-header" style="display:flex;align-items:flex-start;gap:9px;margin-bottom:12px;">
        ${goalBadgeHTML(goal, goalShort, "large")}
        <h3 style="font-size:15px;font-weight:700;margin:0;flex-grow:1;color:#fff;line-height:1.4;white-space:normal;word-break:break-all;">${goal.title}</h3>
        <div style="display:flex;align-items:center;flex-shrink:0;">
          <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.7);">${goal.progress}%</span>
          <button onclick="openEditGoalModal('${goal.id}')" style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;padding:2px 8px;color:rgba(255,255,255,0.7);font-size:11px;cursor:pointer;margin-left:8px;flex-shrink:0;">編集</button>
        </div>
      </div>
      <div style="font-size:11px;color:rgba(255,255,255,0.4);margin-bottom:8px;">指標: ${goal.metric}</div>
      <div style="background:rgba(255,255,255,0.08);border-radius:4px;height:5px;margin-bottom:14px;">
        <div style="height:100%;width:${goal.progress}%;background:${goal.color||"var(--accent)"};border-radius:4px;"></div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;font-size:11.5px;color:rgba(255,255,255,0.5);">
        <span>マイルストーン</span>
      </div>
      <div class="milestone-list">${milestonesHtml}</div>
    `;
    el.appendChild(card);
  });
}

function toggleMilestoneOpen(id) {
  if (expandedMilestones.has(id)) expandedMilestones.delete(id);
  else expandedMilestones.add(id);
  renderGoalsPage();
}

function addChildTask(parentId) {
  const input = document.getElementById("qi-" + parentId);
  if (!input) return;
  const title = input.value.trim();
  if (!title) return;
  const parent = appState.tasks.find(t => t.id === parentId);
  if (!parent) return;
  appState.tasks.push({
    id: "task-" + Date.now(),
    title,
    goalId: parent.goalId,
    status: "today",
    priority: "medium",
    duedate: parent.duedate || "",
    desc: "",
    isMilestone: false,
    parentTaskId: parentId,
    completedAt: null
  });
  saveData();
  renderAll();
  setTimeout(() => { const el = document.getElementById("qi-"+parentId); if(el) el.focus(); }, 50);
}

// カンバン
function renderKanban() {
  const colMap = {
    "today": "cards-today",
    "this_week": "cards-this_week",
    "next_week_and_later": "cards-next_week",
    "waiting": "cards-waiting",
    "completed": "cards-completed"
  };
  Object.values(colMap).forEach(id => { const el = document.getElementById(id); if(el) el.innerHTML = ""; });
  const todayStr = formatDate(appState.currentDate);
  appState.tasks.forEach(task => {
    // マイルストーンはカンバンに表示しない（目標ページで管理）
    if (task.isMilestone) return;

    // 目標フィルター
    if (appState.kanbanFilterGoal !== "all") {
      if (appState.kanbanFilterGoal === "none") {
        if (task.goalId && task.goalId !== "none") return;
      } else {
        if (task.goalId !== appState.kanbanFilterGoal) return;
      }
    }

    // 優先度フィルター
    if (appState.kanbanFilterPriority !== "all") {
      if (task.priority !== appState.kanbanFilterPriority) return;
    }

    const colId = colMap[task.status];
    if (!colId) return;
    if (task.status === "completed") {
      if (!task.completedAt) return;
      if (formatDate(new Date(task.completedAt)) !== todayStr) return;
    }
    const col = document.getElementById(colId);
    if (!col) return;
    const goal = appState.goals.find(g => g.id === task.goalId);
    const goalShort = goal ? (goal.shortName || goal.title.replace(/【.*?】/, "").trim().substring(0, 8)) : null;

    // 期限切れ・警告のハイライト判定
    const isOverdue = task.duedate && task.duedate < todayStr && task.status !== "completed";
    const isWaitingOverdue = task.duedate && task.duedate < todayStr && task.status === "waiting";
    const titleColor = isWaitingOverdue ? "rgba(251,191,36,0.9)" : (isOverdue ? "rgba(248,113,113,0.95)" : "");
    const dueBadgeStyle = isOverdue
      ? `font-size:10px;color:rgba(248,113,113,0.9);font-weight:700;`
      : (isWaitingOverdue ? `font-size:10px;color:rgba(251,191,36,0.85);font-weight:600;` : `font-size:10px;color:rgba(255,255,255,0.4);`);
    const overdueBadge = isOverdue ? `<span style="font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;background:rgba(239,68,68,0.2);color:rgba(248,113,113,1);border:1px solid rgba(239,68,68,0.35);">期限超</span>` : "";
    const waitingBadge = task.status === "waiting" ? `<span style="font-size:9px;font-weight:700;padding:1px 4px;border-radius:3px;background:rgba(245,158,11,0.15);color:rgba(251,191,36,0.9);border:1px solid rgba(245,158,11,0.3);">対応待</span>` : "";

    const card = document.createElement("div");
    card.className = "kanban-card";
    card.draggable = true;
    card.dataset.taskId = task.id;
    card.addEventListener("dragstart", e => { e.dataTransfer.setData("text/plain", task.id); });
    card.addEventListener("click", () => openEditTaskModal(task.id));
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div style="font-size:13px;font-weight:500;margin-bottom:6px;${titleColor ? `color:${titleColor};` : ""}">${task.title}</div>
        <button title="削除" onclick="event.stopPropagation(); quickDeleteTask('${task.id}')"
          style="background:transparent;border:none;color:rgba(255,255,255,0.2);cursor:pointer;padding:2px;display:inline-flex;align-items:center;justify-content:center;transition:color 0.15s;margin-top:-2px;margin-right:-4px;flex-shrink:0;"
          onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='rgba(255,255,255,0.2)'">
          <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
        </button>
      </div>
      <div style="display:flex;gap:5px;flex-wrap:wrap;align-items:center;">
        ${goalBadgeHTML(goal, goalShort)}
        ${overdueBadge}${waitingBadge}
        ${task.parentTaskId ? (() => { const ms = appState.tasks.find(t => t.id === task.parentTaskId); return ms ? `<span style="font-size:10px;padding:1px 5px;border-radius:3px;background:rgba(168,85,247,0.08);color:rgba(168,85,247,0.7);border:1px solid rgba(168,85,247,0.2);">◆${ms.title.length > 10 ? ms.title.substring(0, 10) + '…' : ms.title}</span>` : ''; })() : ''}
        ${task.duedate ? `<span style="${dueBadgeStyle}">〆${formatDateDisplay(task.duedate)}</span>` : ""}
      </div>
    `;
    col.appendChild(card);
  });
  // ドロップ
  Object.entries(colMap).forEach(([status, colId]) => {
    const colEl = document.getElementById(colId);
    if (!colEl) return;
    colEl.addEventListener("dragover", e => e.preventDefault());
    colEl.addEventListener("drop", e => {
      e.preventDefault();
      const taskId = e.dataTransfer.getData("text/plain");
      if (taskId) updateTaskStatus(taskId, status);
    });
  });
  // カウント更新
  Object.entries(colMap).forEach(([status, colId]) => {
    const countEl = document.getElementById("count-" + (status === "next_week_and_later" ? "next_week" : status));
    const col = document.getElementById(colId);
    if (countEl && col) countEl.textContent = col.children.length;
  });
}

// カレンダー
// カレンダー
function renderCalendar() {
  const isWeekMode = appState.calendarViewMode === "week";
  
  // UIボタンのアクティブクラス切り替えとコンテナ表示制御
  const btnMonth = document.getElementById("btn-view-month");
  const btnWeek = document.getElementById("btn-view-week");
  const monthCon = document.getElementById("calendar-month-container");
  const weekCon = document.getElementById("calendar-week-container");
  
  if (isWeekMode) {
    if (btnMonth) btnMonth.classList.remove("active");
    if (btnWeek) btnWeek.classList.add("active");
    if (monthCon) monthCon.style.display = "none";
    if (weekCon) weekCon.style.display = "block";
    renderWeekView();
    return;
  } else {
    if (btnMonth) btnMonth.classList.add("active");
    if (btnWeek) btnWeek.classList.remove("active");
    if (monthCon) monthCon.style.display = "";
    if (weekCon) weekCon.style.display = "none";
  }

  const grid = document.getElementById("calendar-month-grid");
  const title = document.getElementById("calendar-title");
  if (!grid) return;
  grid.innerHTML = "";
  const y = appState.viewDate.getFullYear();
  const mo = appState.viewDate.getMonth();
  if (title) title.textContent = `${y}年 ${mo+1}月`;
  
  // 月曜開始のための調整（月=0 ... 日=6）
  let firstDay = new Date(y, mo, 1).getDay();
  firstDay = firstDay === 0 ? 6 : firstDay - 1;

  const daysInMonth = new Date(y, mo+1, 0).getDate();
  const daysInPrev = new Date(y, mo, 0).getDate();
  const todayStr = formatDate(appState.currentDate);
  let dayNum = 1, nextDay = 1;
  for (let week = 0; week < 6; week++) {
    for (let d = 0; d < 7; d++) {
      const idx = week*7+d;
      const cell = document.createElement("div");
      cell.style.cssText = "border:1px solid rgba(255,255,255,0.05);padding:4px;min-height:80px;vertical-align:top;";
      let dateStr = "", isOther = false, displayDay = 0;
      if (idx < firstDay) {
        displayDay = daysInPrev - firstDay + idx + 1;
        const pm = mo === 0 ? 11 : mo-1;
        const py = mo === 0 ? y-1 : y;
        dateStr = `${py}-${String(pm+1).padStart(2,"0")}-${String(displayDay).padStart(2,"0")}`;
        isOther = true;
      } else if (dayNum > daysInMonth) {
        displayDay = nextDay++;
        const nm = mo === 11 ? 0 : mo+1;
        const ny = mo === 11 ? y+1 : y;
        dateStr = `${ny}-${String(nm+1).padStart(2,"0")}-${String(displayDay).padStart(2,"0")}`;
        isOther = true;
      } else {
        displayDay = dayNum++;
        dateStr = `${y}-${String(mo+1).padStart(2,"0")}-${String(displayDay).padStart(2,"0")}`;
      }
      cell.style.opacity = isOther ? "0.4" : "1";
      if (dateStr === todayStr) cell.style.background = "rgba(100,200,255,0.06)";
      const hdr = document.createElement("div");
      hdr.style.cssText = "font-size:12px;font-weight:500;margin-bottom:3px;color:" + (dateStr===todayStr?"var(--accent)":"rgba(255,255,255,0.7)") + ";";
      hdr.textContent = displayDay;
      cell.appendChild(hdr);
      const schsToday = appState.schedules.filter(s => s.startDate === dateStr);
      schsToday.forEach(s => {
        const el = document.createElement("div");
        el.style.cssText = `font-size:10px;padding:1px 4px;border-radius:2px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;background:${s.isExternal?"rgba(168,85,247,0.3)":"rgba(59,130,246,0.3)"};color:#fff;`;
        el.textContent = s.title;
        el.onclick = () => openEditScheduleModal(s.id);
        cell.appendChild(el);
      });
      const tasksToday = appState.tasks.filter(t => t.duedate === dateStr && t.status !== "completed");
      tasksToday.forEach(t => {
        const el = document.createElement("div");
        el.style.cssText = "font-size:10px;padding:1px 4px;border-radius:2px;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;cursor:pointer;background:rgba(239,68,68,0.2);color:rgba(255,200,200,0.9);";
        el.textContent = "〆" + t.title;
        el.onclick = () => openEditTaskModal(t.id);
        cell.appendChild(el);
      });
      grid.appendChild(cell);
    }
    if (dayNum > daysInMonth && nextDay > 1) break;
  }
}

// 週間バーチカルカレンダーの描画
function renderWeekView() {
  const header = document.getElementById("week-grid-header");
  const timeAxis = document.querySelector(".week-time-axis");
  const gridBody = document.getElementById("calendar-week-grid");
  const title = document.getElementById("calendar-title");

  if (!header || !timeAxis || !gridBody) return;

  header.innerHTML = "";
  timeAxis.innerHTML = "";
  gridBody.innerHTML = "";

  // 1. 表示週の月曜日を算出する (月曜開始の週)
  const current = new Date(appState.viewDate);
  const day = current.getDay();
  const diff = current.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(current.setDate(diff));

  // カレンダーの月・週タイトル表示の決定 (週の開始日と終了日をまたぐ場合に配慮)
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  if (title) {
    const startStr = `${monday.getFullYear()}.${monday.getMonth()+1}.${monday.getDate()}`;
    const endStr = monday.getMonth() === sunday.getMonth() 
      ? `${sunday.getDate()}` 
      : `${sunday.getMonth()+1}.${sunday.getDate()}`;
    title.textContent = `${startStr} – ${endStr}`;
  }

  // 2. 週間ヘッダーの描画 (80pxの時間軸調整セル + 7曜日)
  const emptyCell = document.createElement("div");
  emptyCell.style.width = "80px";
  header.appendChild(emptyCell);

  const dayNames = ["月", "火", "水", "木", "金", "土", "日"];
  const todayStr = formatDate(appState.currentDate);
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const curDate = new Date(monday);
    curDate.setDate(monday.getDate() + i);
    const dateStr = formatDate(curDate);
    weekDays.push(dateStr);

    const isToday = dateStr === todayStr;
    const dayCell = document.createElement("div");
    dayCell.className = "week-header-day" + (isToday ? " today" : "");
    dayCell.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:4px;gap:2px;flex-grow:1;min-width:0;";
    dayCell.innerHTML = `
      <span style="font-size:10px;color:rgba(255,255,255,0.4);">${dayNames[i]}</span>
      <span style="font-size:14px;font-weight:700;color:${isToday?"var(--accent)":"rgba(255,255,255,0.85)"};">${curDate.getDate()}</span>
    `;
    header.appendChild(dayCell);
  }

  // 3. 24時間の時間軸ラベルの描画
  for (let h = 0; h < 24; h++) {
    const timeLabel = document.createElement("div");
    timeLabel.className = "time-axis-hour";
    timeLabel.style.cssText = `
      height: 60px;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding-right: 12px;
      padding-bottom: 0;
      box-sizing: border-box;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.45);
      transform: translateY(5px);
      flex-shrink: 0;
    `;
    if (h === 0) {
      timeLabel.style.visibility = "hidden"; // 00:00 は非表示
    }
    timeLabel.textContent = `${String(h).padStart(2, "0")}:00`;
    timeAxis.appendChild(timeLabel);
  }

  // 4. 7カラムの描画 & 予定の挿入
  for (let i = 0; i < 7; i++) {
    const dateStr = weekDays[i];
    const col = document.createElement("div");
    col.className = "week-column";
    col.style.cssText = "border-right:1px solid rgba(255,255,255,0.03);height:1440px;position:relative;flex-grow:1;min-width:0;box-sizing:border-box;";

    // Googleカレンダー風の等幅グリッド背景線を引くため、24個の時間スロット枠を配置
    for (let h = 0; h < 24; h++) {
      const slotBg = document.createElement("div");
      slotBg.style.cssText = "height:60px;border-bottom:1px solid rgba(255,255,255,0.04);box-sizing:border-box;";
      col.appendChild(slotBg);
    }

    // その日のスケジュール
    const dayScheds = appState.schedules.filter(s => s.startDate === dateStr);
    dayScheds.forEach(s => {
      if (s.allday) return; 
      
      const startMin = parseTime(s.startTime);
      const endMin = parseTime(s.endTime);
      const duration = endMin - startMin;

      const topPx = (startMin / 60) * 60; 
      const heightPx = (duration / 60) * 60;

      const eventEl = document.createElement("div");
      const bg = s.isExternal ? "rgba(168,85,247,0.22)" : "rgba(59,130,246,0.22)";
      const border = s.isExternal ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(59,130,246,0.5)";
      const indicator = s.isExternal ? "#a855f7" : "#3b82f6";
      
      eventEl.style.cssText = `
        position:absolute;
        top:${topPx}px;
        left:2px;
        right:2px;
        height:${Math.max(20, heightPx - 2)}px;
        background:${bg};
        border:${border};
        border-radius:4px;
        padding:2px 4px;
        font-size:10px;
        color:#fff;
        overflow:hidden;
        text-overflow:ellipsis;
        cursor:pointer;
        display:flex;
        flex-direction:column;
        line-height:1.2;
        z-index:2;
      `;
      eventEl.onclick = () => openEditScheduleModal(s.id);
      eventEl.innerHTML = `
        <div style="font-weight:700;display:flex;align-items:center;gap:3px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">
          <span style="width:4px;height:4px;border-radius:50%;background:${indicator};flex-shrink:0;"></span>
          ${s.title}
        </div>
        <div style="color:rgba(255,255,255,0.4);font-size:8.5px;">${s.startTime}-${s.endTime}</div>
      `;
      col.appendChild(eventEl);
    });

    gridBody.appendChild(col);
  }

  // デフォルト位置を 9:00 (540px) にスクロール
  const container = document.querySelector(".week-grid-body-container");
  if (container) {
    setTimeout(() => {
      container.scrollTop = 540;
    }, 15);
  }
}

function prevMonth() {
  if (appState.calendarViewMode === "week") {
    appState.viewDate.setDate(appState.viewDate.getDate() - 7);
  } else {
    appState.viewDate.setMonth(appState.viewDate.getMonth() - 1);
  }
  renderCalendar();
}

function nextMonth() {
  if (appState.calendarViewMode === "week") {
    appState.viewDate.setDate(appState.viewDate.getDate() + 7);
  } else {
    appState.viewDate.setMonth(appState.viewDate.getMonth() + 1);
  }
  renderCalendar();
}

// ==========================================================================
// TASK STATUS OPS
// ==========================================================================

function updateTaskStatus(taskId, newStatus) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;
  const old = task.status;
  task.status = newStatus;
  if (newStatus === "completed" && old !== "completed") task.completedAt = new Date().toISOString();
  else if (newStatus !== "completed") task.completedAt = null;
  if (newStatus !== "today") task.assignedTimeSlot = null;
  saveData();
  renderAll();
}

function toggleTaskCompleted(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;
  if (task.status === "completed") {
    task.status = "today";
    task.completedAt = null;
  } else {
    task.status = "completed";
    task.completedAt = new Date().toISOString();
    task.assignedTimeSlot = null;
  }
  saveData();
  renderAll();
}

function changeTaskStatus(taskId, newStatus, event) {
  if (event) event.stopPropagation();
  updateTaskStatus(taskId, newStatus);
}

// ==========================================================================
// MODAL HELPERS
// ==========================================================================

function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "flex";
  if (window.lucide) lucide.createIcons();
}

function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay").forEach(m => m.style.display = "none");
}

// ==========================================================================
// TASK MODAL
// ==========================================================================

function updateGoalDropdowns() {
  const selects = document.querySelectorAll("#task-goal, #filter-goal");
  selects.forEach(sel => {
    const existing = sel.querySelectorAll("option[data-dynamic]");
    existing.forEach(o => o.remove());
    appState.goals.forEach(g => {
      const opt = document.createElement("option");
      opt.value = g.id;
      opt.textContent = g.title.replace(/【.*?】/, "").trim();
      opt.dataset.dynamic = "1";
      sel.appendChild(opt);
    });
  });

  // 目標バッジセレクターの動的生成
  const selector = document.getElementById("task-goal-badge-selector");
  if (selector) {
    selector.innerHTML = "";
    
    // 「なし」バッジ
    const noneBtn = document.createElement("button");
    noneBtn.type = "button";
    noneBtn.dataset.goalId = "none";
    noneBtn.style.cssText = "border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.03);color:rgba(255,255,255,0.7);font-size:11px;padding:4px 8px;border-radius:4px;cursor:pointer;transition:all 0.15s;font-weight:600;";
    noneBtn.textContent = "なし";
    selector.appendChild(noneBtn);

    appState.goals.forEach(g => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.goalId = g.id;
      btn.style.cssText = `border:1px solid rgba(255,255,255,0.05);background:${g.color}15;color:${g.color};font-size:11px;padding:4px 8px;border-radius:4px;cursor:pointer;transition:all 0.15s;font-weight:700;font-family:'Outfit';`;
      btn.textContent = g.shortName;
      selector.appendChild(btn);
    });

    // 各ボタンのクリックイベント
    const btns = selector.querySelectorAll("button");
    btns.forEach(btn => {
      btn.addEventListener("click", () => {
        const goalId = btn.dataset.goalId;
        const select = document.getElementById("task-goal");
        if (select) {
          select.value = goalId;
          const event = new Event("change", { bubbles: true });
          select.dispatchEvent(event);
          updateActiveGoalBadge(goalId);
        }
      });
    });
  }
}

// 選択中の目標バッジのアクティブ表示管理
function updateActiveGoalBadge(goalId) {
  const selector = document.getElementById("task-goal-badge-selector");
  if (!selector) return;
  const btns = selector.querySelectorAll("button");
  btns.forEach(btn => {
    const gid = btn.dataset.goalId;
    if (gid === goalId) {
      if (gid === "none") {
        btn.style.background = "rgba(255,255,255,0.15)";
        btn.style.borderColor = "rgba(255,255,255,0.3)";
        btn.style.color = "#fff";
      } else {
        const goal = appState.goals.find(g => g.id === gid);
        if (goal) {
          btn.style.background = goal.color;
          btn.style.color = "#fff";
          btn.style.boxShadow = `0 0 10px ${goal.color}60`;
          btn.style.borderColor = goal.color;
        }
      }
    } else {
      if (gid === "none") {
        btn.style.background = "rgba(255,255,255,0.03)";
        btn.style.borderColor = "rgba(255,255,255,0.12)";
        btn.style.color = "rgba(255,255,255,0.7)";
        btn.style.boxShadow = "none";
      } else {
        const goal = appState.goals.find(g => g.id === gid);
        if (goal) {
          btn.style.background = `${goal.color}15`;
          btn.style.color = goal.color;
          btn.style.borderColor = "rgba(255,255,255,0.05)";
          btn.style.boxShadow = "none";
        }
      }
    }
  });
}

function updateParentDropdown(goalId, selectedParentId, taskId) {
  const group = document.getElementById("task-parent-group");
  const sel = document.getElementById("task-parent");
  if (!group || !sel) return;

  // 常に表示状態を維持
  group.style.display = "flex";

  if (!goalId || goalId === "none") {
    sel.innerHTML = `<option value="none">紐づけなし</option>`;
    sel.value = "none";
    return;
  }

  const milestones = appState.tasks.filter(t => t.goalId === goalId && t.isMilestone && !t.parentTaskId && t.id !== taskId);
  sel.innerHTML = `<option value="none">紐づけなし</option>` + milestones.map(m => `<option value="${m.id}">${m.title}</option>`).join("");
  sel.value = selectedParentId || "none";
}

function openAddTaskModal(goalId) {
  populateTaskModal(null, goalId || "none");
}

function openEditTaskModal(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;
  populateTaskModal(task, null);
}

function populateTaskModal(task, defaultGoalId) {
  const isEdit = !!task;
  document.getElementById("task-modal-title").textContent = isEdit ? "タスク詳細・編集" : "新規タスク追加";
  document.getElementById("task-id").value = isEdit ? task.id : "";
  document.getElementById("task-title").value = isEdit ? task.title : "";
  const goalSel = document.getElementById("task-goal");
  goalSel.value = isEdit ? task.goalId : (defaultGoalId || "none");
  updateActiveGoalBadge(goalSel.value);
  document.getElementById("task-status").value = isEdit ? task.status : "today";
  document.getElementById("task-priority").value = isEdit ? task.priority : "medium";
  document.getElementById("task-duedate").value = isEdit ? (task.duedate || "") : "";
  document.getElementById("task-desc").value = isEdit ? (task.desc || "") : "";
  // 親タスク
  updateParentDropdown(goalSel.value, isEdit ? (task.parentTaskId || "none") : "none", isEdit ? task.id : null);
  // 子タスクセクション (マイルストーンの場合のみ表示)
  const subSection = document.getElementById("subtasks-section");
  if (subSection) {
    if (isEdit && task.isMilestone) {
      subSection.style.display = "block";
      renderModalSubtasks(task.id);
    } else {
      subSection.style.display = "none";
    }
  }
  openModal("modal-task-form");
}

function renderModalSubtasks(parentId) {
  const list = document.getElementById("modal-subtask-list");
  const count = document.getElementById("subtasks-count");
  if (!list) return;
  const children = appState.tasks.filter(t => t.parentTaskId === parentId);
  if (count) count.textContent = children.length + "件";
  list.innerHTML = "";
  children.forEach(c => {
    const div = document.createElement("div");
    div.style.cssText = "display:flex;align-items:center;gap:8px;padding:5px 8px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);border-radius:4px;";
    div.innerHTML = `
      <input type="checkbox" ${c.status==="completed"?"checked":""} onchange="toggleSubtaskInModal('${parentId}','${c.id}')">
      <span style="flex-grow:1;font-size:12.5px;color:${c.status==="completed"?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.85)"};text-decoration:${c.status==="completed"?"line-through":"none"};">${c.title}</span>
      <button onclick="deleteChildTask('${parentId}','${c.id}')" style="background:none;border:none;color:rgba(255,80,80,0.7);cursor:pointer;font-size:11px;">削除</button>
    `;
    list.appendChild(div);
  });
}

function toggleSubtaskInModal(parentId, subId) {
  toggleTaskCompleted(subId);
  renderModalSubtasks(parentId);
}

function deleteChildTask(parentId, subId) {
  if (!confirm("この子タスクを削除しますか？")) return;
  appState.tasks = appState.tasks.filter(t => t.id !== subId);
  saveData();
  renderAll();
  renderModalSubtasks(parentId);
}

function handleAddSubtaskInModal() {
  const parentId = document.getElementById("task-id").value;
  const input = document.getElementById("new-subtask-title");
  if (!parentId || !input) return;
  const title = input.value.trim();
  if (!title) return;
  const parent = appState.tasks.find(t => t.id === parentId);
  if (!parent) return;
  appState.tasks.push({
    id: "task-" + Date.now(),
    title,
    goalId: parent.goalId,
    status: "today",
    priority: "medium",
    duedate: parent.duedate || "",
    desc: "",
    isMilestone: false,
    parentTaskId: parentId,
    completedAt: null
  });
  saveData();
  renderAll();
  renderModalSubtasks(parentId);
  input.value = "";
}

function handleTaskFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("task-id").value;
  const title = document.getElementById("task-title").value.trim();
  if (!title) return;
  const goalId = document.getElementById("task-goal").value;
  const status = document.getElementById("task-status").value;
  const priority = document.getElementById("task-priority").value;
  const duedate = document.getElementById("task-duedate").value;
  const desc = document.getElementById("task-desc").value;
  const parentSel = document.getElementById("task-parent");
  const parentTaskId = (parentSel && parentSel.value !== "none") ? parentSel.value : null;
  if (id) {
    const task = appState.tasks.find(t => t.id === id);
    if (task) {
      const old = task.status;
      task.title = title; task.goalId = goalId; task.status = status;
      task.priority = priority; task.duedate = duedate; task.desc = desc;
      task.parentTaskId = parentTaskId;
      if (status === "completed" && old !== "completed") task.completedAt = new Date().toISOString();
      else if (status !== "completed") task.completedAt = null;
      if (status !== "today") task.assignedTimeSlot = null;
    }
  } else {
    appState.tasks.push({
      id: "task-" + Date.now(),
      title, goalId, status, priority, duedate, desc,
      isMilestone: false,
      parentTaskId,
      completedAt: status === "completed" ? new Date().toISOString() : null
    });
  }
  saveData();
  closeModal("modal-task-form");
  renderAll();
}

function deleteTask() {
  const id = document.getElementById("task-id").value;
  if (!id || !confirm("このタスクを削除しますか？")) return;
  appState.tasks = appState.tasks.filter(t => t.id !== id && t.parentTaskId !== id);
  saveData();
  closeModal("modal-task-form");
  renderAll();
}

// ==========================================================================
// SCHEDULE MODAL
// ==========================================================================

function openAddScheduleModal(dateStr) {
  document.getElementById("schedule-modal-title").textContent = "新規スケジュール追加";
  document.getElementById("schedule-id").value = "";
  document.getElementById("schedule-title").value = "";
  document.getElementById("schedule-start-date").value = dateStr || formatDate(appState.currentDate);
  document.getElementById("schedule-start-time").value = "10:00";
  document.getElementById("schedule-end-date").value = dateStr || formatDate(appState.currentDate);
  document.getElementById("schedule-end-time").value = "11:00";
  document.getElementById("schedule-allday").checked = false;
  document.getElementById("schedule-desc").value = "";
  openModal("modal-schedule-form");
}

function openEditScheduleModal(schId) {
  const s = appState.schedules.find(s => s.id === schId);
  if (!s) return;
  document.getElementById("schedule-modal-title").textContent = "予定詳細・編集";
  document.getElementById("schedule-id").value = s.id;
  document.getElementById("schedule-title").value = s.title;
  document.getElementById("schedule-start-date").value = s.startDate;
  document.getElementById("schedule-start-time").value = s.startTime;
  document.getElementById("schedule-end-date").value = s.endDate;
  document.getElementById("schedule-end-time").value = s.endTime;
  document.getElementById("schedule-allday").checked = s.allday;
  document.getElementById("schedule-desc").value = s.desc || "";
  openModal("modal-schedule-form");
}

function handleScheduleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("schedule-id").value;
  const title = document.getElementById("schedule-title").value.trim();
  if (!title) return;
  const startDate = document.getElementById("schedule-start-date").value;
  const startTime = document.getElementById("schedule-start-time").value;
  const endDate = document.getElementById("schedule-end-date").value;
  const endTime = document.getElementById("schedule-end-time").value;
  const allday = document.getElementById("schedule-allday").checked;
  const desc = document.getElementById("schedule-desc").value;
  if (id) {
    const s = appState.schedules.find(s => s.id === id);
    if (s) { s.title=title; s.startDate=startDate; s.startTime=startTime; s.endDate=endDate; s.endTime=endTime; s.allday=allday; s.desc=desc; }
  } else {
    appState.schedules.push({ id:"sch-"+Date.now(), title, startDate, startTime, endDate, endTime, allday, desc, isExternal:false });
  }
  saveData();
  closeModal("modal-schedule-form");
  renderAll();
}

function deleteSchedule() {
  const id = document.getElementById("schedule-id").value;
  if (!id || !confirm("この予定を削除しますか？")) return;
  appState.schedules = appState.schedules.filter(s => s.id !== id);
  saveData();
  closeModal("modal-schedule-form");
  renderAll();
}

// ICS Import
function handleICSImport(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    const newSchs = parseICS(e.target.result);
    if (newSchs.length) {
      appState.schedules = appState.schedules.filter(s => !s.isExternal);
      appState.schedules.push(...newSchs);
      appState.lastSyncTime = new Date().toISOString();
      saveData();
      renderAll();
      alert(`${newSchs.length}件の予定をインポートしました。`);
    } else {
      alert("有効な予定が見つかりませんでした。");
    }
  };
  reader.readAsText(file);
}

// データエクスポート
function exportData() {
  const json = JSON.stringify({ goals: appState.goals, tasks: appState.tasks, schedules: appState.schedules }, null, 2);
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([json], { type: "application/json" }));
  a.download = `lifeorbit-backup-${formatDate(new Date())}.json`;
  a.click();
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (data.goals) appState.goals = data.goals;
      if (data.tasks) appState.tasks = data.tasks;
      if (data.schedules) appState.schedules = data.schedules;
      saveData();
      renderAll();
      alert("データをインポートしました。");
    } catch(err) {
      alert("インポートに失敗しました。JSONファイルを確認してください。");
    }
  };
  reader.readAsText(file);
}

function updateSyncDisplay() {
  const el = document.getElementById("sync-time-text");
  if (!el) return;
  if (appState.lastSyncTime) {
    const d = new Date(appState.lastSyncTime);
    el.textContent = `最終同期: ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
    const ind = document.getElementById("sync-indicator");
    if (ind) { ind.classList.remove("offline"); ind.classList.add("online"); }
  } else {
    el.textContent = "未同期 (iCSをドロップ)";
  }
}

// ==========================================================================
// VIEW SWITCHING
// ==========================================================================

function switchView(viewName) {
  appState.activeView = viewName;

  // tasksビューがアクティブな場合はサブタイトルを非表示にする
  const subEl = document.getElementById("view-subtitle");
  if (subEl) {
    if (viewName === "tasks") {
      subEl.style.display = "none";
    } else {
      subEl.style.display = "block";
    }
  }

  if (viewName === "goals") {
    renderGoalsPage();
  } else if (viewName === "tasks") {
    renderKanban();
  }

  // nav-item の active 切り替え
  document.querySelectorAll(".nav-item").forEach(btn => {
    if (btn.dataset.view === viewName) btn.classList.add("active");
    else btn.classList.remove("active");
  });
  // view-section の表示切り替え
  document.querySelectorAll(".view-section").forEach(sec => {
    if (sec.id === "view-" + viewName) sec.classList.add("active");
    else sec.classList.remove("active");
  });
  // ヘッダータイトル更新
  const titles = { dashboard: "ダッシュボード", goals: "目標 (Goals)", tasks: "タスク (Tasks)", calendar: "カレンダー", review: "レビュー", settings: "設定・バックアップ" };
  const subs = { dashboard: "今日の軌道と目標の進捗状況", goals: "大目標とマイルストーンの管理", tasks: "タスクのカンバン管理", calendar: "スケジュールとカレンダー連携", review: "活動実績の振り返りと未完了タスクの棚卸し", settings: "データの管理とバックアップ" };
  const titleEl = document.getElementById("view-title");
  if (titleEl) titleEl.textContent = titles[viewName] || viewName;
  if (subEl) subEl.textContent = subs[viewName] || "";

  if (viewName === "calendar" && appState.calendarViewMode === "week") {
    setTimeout(() => {
      const container = document.querySelector(".week-grid-body-container");
      if (container) {
        container.scrollTop = 540;
      }
    }, 20);
  } else if (viewName === "review") {
    renderReviewPage();
  }
}

// ==========================================================================
// SETUP
// ==========================================================================

function setupUI() {
  switchView(appState.activeView);
}

function setupEventListeners() {
  // ハンバーガーメニュー
  const btnHamburger = document.getElementById("btn-hamburger");
  const sidebar = document.querySelector(".sidebar");
  if (btnHamburger && sidebar) {
    btnHamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      sidebar.classList.toggle("active");
    });

    document.addEventListener("click", (e) => {
      if (sidebar.classList.contains("active") && !sidebar.contains(e.target) && !btnHamburger.contains(e.target)) {
        sidebar.classList.remove("active");
      }
    });
  }

  // ナビゲーション
  document.querySelectorAll(".nav-item[data-view]").forEach(btn => {
    btn.addEventListener("click", () => {
      switchView(btn.dataset.view);
      if (sidebar) sidebar.classList.remove("active");
    });
  });



  // 今日やるタスク追加ボタン
  const btnAddTodo = document.getElementById("btn-add-quick-todo");
  if (btnAddTodo) btnAddTodo.addEventListener("click", () => openAddTaskModal("none"));

  // タスクボードの新規タスク
  const btnAddTaskBoard = document.getElementById("btn-add-task-board");
  if (btnAddTaskBoard) {
    btnAddTaskBoard.addEventListener("click", () => {
      const currentGoal = (appState.kanbanFilterGoal !== "all" && appState.kanbanFilterGoal !== "none") 
        ? appState.kanbanFilterGoal 
        : "none";
      openAddTaskModal(currentGoal);
    });
  }

  // 今日の予定に配置したタスクをドラッグしてタスクの箱に戻す
  const todoListEl = document.getElementById("dashboard-todo-list");
  if (todoListEl) {
    todoListEl.addEventListener("dragover", e => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      todoListEl.style.background = "rgba(255,255,255,0.03)";
    });
    todoListEl.addEventListener("dragleave", () => {
      todoListEl.style.background = "";
    });
    todoListEl.addEventListener("drop", e => {
      e.preventDefault();
      todoListEl.style.background = "";
      const taskId = e.dataTransfer.getData("text/plain");
      if (!taskId) return;
      const task = appState.tasks.find(t => t.id === taskId);
      if (task) {
        task.assignedTimeSlot = null;
        saveData();
        renderAll();
      }
    });
  }

  // Ctrl + Z のキーボードイベントバインド
  document.addEventListener("keydown", e => {
    if ((e.ctrlKey || e.metaKey) && e.key === "z") {
      const active = document.activeElement;
      if (active && (active.tagName === "INPUT" || active.tagName === "TEXTAREA")) {
        return;
      }
      e.preventDefault();
      undoLastDelete();
    }
  });

  // タスクフォーム
  const taskForm = document.getElementById("task-form");
  if (taskForm) taskForm.addEventListener("submit", handleTaskFormSubmit);

  // 目標ドロップダウン変更
  const taskGoalSel = document.getElementById("task-goal");
  if (taskGoalSel) taskGoalSel.addEventListener("change", e => {
    updateParentDropdown(e.target.value, "none", document.getElementById("task-id").value);
  });

  // サブタスク追加
  const btnAddSubtask = document.getElementById("btn-add-subtask");
  if (btnAddSubtask) btnAddSubtask.addEventListener("click", handleAddSubtaskInModal);
  const inputSubtask = document.getElementById("new-subtask-title");
  if (inputSubtask) inputSubtask.addEventListener("keydown", e => { if(e.key==="Enter"){e.preventDefault();handleAddSubtaskInModal();} });

  // スケジュールフォーム
  const schForm = document.getElementById("schedule-form");
  if (schForm) schForm.addEventListener("submit", handleScheduleFormSubmit);

  // 予定追加
  const btnAddSch = document.getElementById("btn-add-schedule");
  if (btnAddSch) btnAddSch.addEventListener("click", () => openAddScheduleModal(""));

  // カレンダーナビ
  const btnPrev = document.getElementById("btn-cal-prev");
  if (btnPrev) btnPrev.addEventListener("click", prevMonth);
  const btnNext = document.getElementById("btn-cal-next");
  if (btnNext) btnNext.addEventListener("click", nextMonth);
  const btnToday = document.getElementById("btn-cal-today");
  if (btnToday) btnToday.addEventListener("click", () => { appState.viewDate = new Date(appState.currentDate); renderCalendar(); });

  // 月間/週間切り替え (UI同期)
  const btnMonth = document.getElementById("btn-view-month");
  const btnWeek = document.getElementById("btn-view-week");
  if (btnMonth) btnMonth.addEventListener("click", () => {
    appState.calendarViewMode = "month";
    renderCalendar();
  });
  if (btnWeek) btnWeek.addEventListener("click", () => {
    appState.calendarViewMode = "week";
    renderCalendar();
  });

  // ICS ドラッグ&ドロップ
  const dropZone = document.getElementById("ics-drop-zone");
  if (dropZone) {
    dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.style.borderColor="var(--accent)"; });
    dropZone.addEventListener("dragleave", () => { dropZone.style.borderColor=""; });
    dropZone.addEventListener("drop", e => {
      e.preventDefault(); dropZone.style.borderColor="";
      const file = e.dataTransfer.files[0];
      if (file) handleICSImport(file);
    });
  }
  const icsInput = document.getElementById("ics-file-input");
  const browseLink = document.getElementById("browse-ics-link");
  if (browseLink && icsInput) browseLink.addEventListener("click", () => icsInput.click());
  if (icsInput) icsInput.addEventListener("change", e => { if(e.target.files[0]) handleICSImport(e.target.files[0]); });

  // 目標フォーム
  const goalForm = document.getElementById("goal-form");
  if (goalForm) goalForm.addEventListener("submit", handleGoalFormSubmit);
  const btnDeleteGoal = document.getElementById("btn-delete-goal");
  if (btnDeleteGoal) btnDeleteGoal.addEventListener("click", deleteGoal);
  const btnModalAddMilestone = document.getElementById("btn-modal-add-milestone");
  if (btnModalAddMilestone) btnModalAddMilestone.addEventListener("click", handleAddMilestoneInModal);

  // 設定ページ
  const btnExport = document.getElementById("btn-export-data");
  if (btnExport) btnExport.addEventListener("click", exportData);
  const btnImportTrigger = document.getElementById("btn-import-trigger");
  const importInput = document.getElementById("import-file-input");
  if (btnImportTrigger && importInput) btnImportTrigger.addEventListener("click", () => importInput.click());
  if (importInput) importInput.addEventListener("change", e => { if(e.target.files[0]) importData(e.target.files[0]); });
  const btnReset = document.getElementById("btn-reset-app");
  if (btnReset) btnReset.addEventListener("click", () => {
    if (confirm("すべてのデータをサンプルデータでリセットします。よろしいですか？")) { resetToDefault(); renderAll(); }
  });


  // モーダルの閉じるボタン (btn-close-modal クラスを共通使用)
  document.addEventListener("click", e => {
    if (e.target.closest(".btn-close-modal")) closeAllModals();
    if (e.target.classList.contains("modal-overlay")) closeAllModals();
  });
}

// ==========================================================================
// GLOBAL BINDINGS
// ==========================================================================
// ==========================================================================
// GOAL EDIT / ADD MODAL
// ==========================================================================
let editingMilestones = [];
const REPRESENTATIVE_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#84cc16", "#10b981", "#14b8a6",
  "#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#d946ef", "#ec4899"
];

function selectGoalColor(color) {
  document.getElementById("goal-color").value = color;
  renderGoalColorPalette(color);
}

function renderGoalColorPalette(selectedColor) {
  const palette = document.getElementById("goal-color-palette");
  if (!palette) return;
  palette.innerHTML = "";
  REPRESENTATIVE_COLORS.forEach(c => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.onclick = () => selectGoalColor(c);
    const isSelected = c.toLowerCase() === selectedColor.toLowerCase();
    btn.style.cssText = `
      background:${c};
      border: ${isSelected ? "2px solid #fff" : "1px solid rgba(255,255,255,0.15)"};
      box-shadow: ${isSelected ? "0 0 6px " + c : "none"};
      border-radius: 6px;
      height: 28px;
      cursor: pointer;
      transition: all 0.12s;
    `;
    palette.appendChild(btn);
  });
}

function openAddGoalModal() {
  document.getElementById("goal-modal-title").textContent = "目標の追加";
  document.getElementById("goal-id").value = "";
  document.getElementById("goal-title").value = "";
  document.getElementById("goal-shortname").value = "";
  document.getElementById("goal-color").value = "#3b82f6";
  document.getElementById("goal-metric").value = "";
  document.getElementById("btn-delete-goal").style.display = "none";
  
  editingMilestones = [];
  renderGoalColorPalette("#3b82f6");
  renderModalMilestonesList();
  openModal("modal-goal-form");
}

function openEditGoalModal(goalId) {
  const goal = appState.goals.find(g => g.id === goalId);
  if (!goal) return;
  
  document.getElementById("goal-modal-title").textContent = "目標の編集";
  document.getElementById("goal-id").value = goal.id;
  document.getElementById("goal-title").value = goal.title;
  document.getElementById("goal-shortname").value = goal.shortName || "";
  document.getElementById("goal-color").value = goal.color || "#3b82f6";
  document.getElementById("goal-metric").value = goal.metric || "";
  document.getElementById("btn-delete-goal").style.display = "block";

  // その目標に紐づくマイルストーンを抽出
  editingMilestones = appState.tasks
    .filter(t => t.goalId === goalId && t.isMilestone && !t.parentTaskId)
    .map(t => ({
      id: t.id,
      title: t.title,
      duedate: t.duedate || "",
      isNew: false,
      isDeleted: false
    }));

  renderGoalColorPalette(goal.color || "#3b82f6");
  renderModalMilestonesList();
  openModal("modal-goal-form");
}

function renderModalMilestonesList() {
  const list = document.getElementById("modal-milestones-list");
  if (!list) return;
  list.innerHTML = "";

  const visibleMilestones = editingMilestones.filter(m => !m.isDeleted);
  if (visibleMilestones.length === 0) {
    list.innerHTML = `<div style="font-size:12px;color:rgba(255,255,255,0.3);text-align:center;padding:10px 0;">マイルストーンが登録されていません。</div>`;
    return;
  }

  // 自動的に日付順にソート（日付未定のものは後ろに回す）
  visibleMilestones.sort((a, b) => {
    const da = a.duedate || "9999-12-31";
    const db = b.duedate || "9999-12-31";
    return da.localeCompare(db);
  });

  visibleMilestones.forEach(m => {
    const row = document.createElement("div");
    row.style.cssText = "display:flex;align-items:center;gap:8px;";
    row.innerHTML = `
      <input type="text" value="${m.title}" placeholder="マイルストーンタイトル..." class="input-text" style="flex-grow:2;font-size:12px;height:30px;padding:4px 8px;" oninput="updateModalMilestoneTitle('${m.id}', this.value)">
      <input type="date" value="${m.duedate}" class="input-text" style="flex-grow:1;font-size:11px;height:30px;padding:4px 8px;max-width:125px;" onchange="updateModalMilestoneDate('${m.id}', this.value)">
      <button type="button" onclick="deleteModalMilestone('${m.id}')" style="background:none;border:none;color:rgba(255,80,80,0.8);cursor:pointer;font-size:11px;padding:4px 8px;flex-shrink:0;">削除</button>
    `;
    list.appendChild(row);
  });
}

function updateModalMilestoneTitle(id, val) {
  const m = editingMilestones.find(item => item.id === id);
  if (m) m.title = val.trim();
}

function updateModalMilestoneDate(id, val) {
  const m = editingMilestones.find(item => item.id === id);
  if (m) {
    m.duedate = val;
    // 日付が変更されたときは、自動的にソートし直してリストを再描画
    renderModalMilestonesList();
  }
}

function deleteModalMilestone(id) {
  const m = editingMilestones.find(item => item.id === id);
  if (m) {
    if (m.isNew) {
      editingMilestones = editingMilestones.filter(item => item.id !== id);
    } else {
      m.isDeleted = true;
    }
  }
  renderModalMilestonesList();
}

function handleAddMilestoneInModal() {
  editingMilestones.push({
    id: "temp-" + Date.now() + Math.random().toString(36).substr(2, 4),
    title: "",
    duedate: "",
    isNew: true,
    isDeleted: false
  });
  renderModalMilestonesList();
}

function handleGoalFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById("goal-id").value;
  const title = document.getElementById("goal-title").value.trim();
  const shortName = document.getElementById("goal-shortname").value.trim();
  const color = document.getElementById("goal-color").value;
  const metric = document.getElementById("goal-metric").value.trim();
  
  if (!title || !shortName) return;

  let goalId = id;
  if (id) {
    // 既存目標の更新
    const goal = appState.goals.find(g => g.id === id);
    if (goal) {
      goal.title = title;
      goal.shortName = shortName;
      goal.color = color;
      goal.metric = metric;
    }
  } else {
    // 新規目標の追加
    goalId = "goal-" + Date.now();
    appState.goals.push({
      id: goalId,
      title,
      shortName,
      color,
      metric,
      taskCount: 0,
      completedCount: 0,
      progress: 0
    });
  }

  // マイルストーン変更の適用
  editingMilestones.forEach(m => {
    if (m.isDeleted) {
      // 削除
      appState.tasks = appState.tasks.filter(t => t.id !== m.id && t.parentTaskId !== m.id);
    } else if (m.isNew) {
      // 新規作成
      if (m.title) {
        appState.tasks.push({
          id: "task-" + Date.now() + Math.random().toString(36).substr(2, 4),
          title: m.title,
          goalId: goalId,
          status: "today",
          priority: "medium",
          duedate: m.duedate,
          desc: "",
          isMilestone: true,
          parentTaskId: null
        });
      }
    } else {
      // 既存の更新
      const task = appState.tasks.find(t => t.id === m.id);
      if (task) {
        task.title = m.title;
        task.duedate = m.duedate;
      }
    }
  });

  saveData();
  closeModal("modal-goal-form");
  renderAll();
}

function deleteGoal() {
  const id = document.getElementById("goal-id").value;
  if (!id || !confirm("この目標を削除しますか？紐づくすべてのタスクやマイルストーンも削除されます。")) return;

  appState.goals = appState.goals.filter(g => g.id !== id);
  // 目標に属するタスク・マイルストーンも削除
  appState.tasks = appState.tasks.filter(t => t.goalId !== id);

  saveData();
  closeModal("modal-goal-form");
  renderAll();
}

// ==========================================================================
// REVIEW PAGE LOGIC
// ==========================================================================
function renderReviewPage() {
  const isDaily = appState.reviewMode === "daily";

  // UI切り替え
  const btnDaily = document.getElementById("btn-review-daily");
  const btnWeekly = document.getElementById("btn-review-weekly");
  if (btnDaily) btnDaily.className = "btn-toggle" + (isDaily ? " active" : "");
  if (btnWeekly) btnWeekly.className = "btn-toggle" + (!isDaily ? " active" : "");

  // 1. 期間範囲の特定
  const cur = new Date(appState.currentDate);
  let startStr, endStr, rangeText;
  if (isDaily) {
    startStr = formatDate(cur);
    endStr = startStr;
    rangeText = `${startStr.replace(/-/g, ".")} (今日) の振り返り`;
  } else {
    // 月曜開始の週の月〜日
    const day = cur.getDay();
    const diff = cur.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(cur.setDate(diff));
    const sunday = new Date(monday);
    sunday.setDate(monday.getDate() + 6);
    startStr = formatDate(monday);
    endStr = formatDate(sunday);
    rangeText = `${startStr.replace(/-/g, ".")} – ${endStr.replace(/-/g, ".")} (今週) の振り返り`;
  }

  const periodTitle = document.getElementById("review-period-title");
  if (periodTitle) periodTitle.textContent = rangeText;

  // 2. 目標サマリーの表示 (コンパクト版)
  const goalsContainer = document.getElementById("review-goals-list");
  if (goalsContainer) {
    goalsContainer.innerHTML = "";
    if (appState.goals.length === 0) {
      goalsContainer.innerHTML = `<div style="font-size:12px;color:rgba(255,255,255,0.3);text-align:center;padding:12px;">登録された目標はありません</div>`;
    } else {
      appState.goals.forEach(g => {
        const msList = appState.tasks.filter(t => t.goalId === g.id && t.isMilestone && !t.parentTaskId);
        msList.sort((a,b) => (a.duedate || "").localeCompare(b.duedate || ""));
        const completedCount = msList.filter(t => t.status === "completed").length;
        const totalCount = msList.length;
        const nextMs = msList.find(t => t.status !== "completed");
        const progress = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

        const el = document.createElement("div");
        el.style.cssText = "background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);border-radius:6px;padding:10px;display:flex;flex-direction:column;gap:8px;";
        el.innerHTML = `
          <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;">
            <div style="display:flex;align-items:center;gap:6px;min-width:0;">
              <span class="badge" style="background:${g.color || "#3b82f6"};color:#fff;font-family:'Outfit';font-weight:700;font-size:10px;padding:2px 6px;">${g.shortName || "GOAL"}</span>
              <span style="font-size:12px;font-weight:700;color:rgba(255,255,255,0.9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${g.title}</span>
            </div>
            <span style="font-family:'Outfit';font-size:11px;font-weight:600;color:var(--accent);">${progress}%</span>
          </div>
          <div style="width:100%;height:3px;background:rgba(255,255,255,0.05);border-radius:2px;overflow:hidden;">
            <div style="width:${progress}%;height:100%;background:linear-gradient(90deg, var(--accent) 0%, #00d2ff 100%);"></div>
          </div>
          <div style="font-size:11px;color:rgba(255,255,255,0.5);display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <span>マイルストーン: ${completedCount}/${totalCount} 完了</span>
            <span style="color:${nextMs ? "rgba(255,255,255,0.7)":"var(--color-life)"};font-weight:500;">
              ${nextMs ? `次: ${nextMs.title} [${nextMs.duedate.replace(/-/g, ".")}]` : "すべてのマイルストーン完了！"}
            </span>
          </div>
        `;
        goalsContainer.appendChild(el);
      });
    }
  }

  // 期間内に完了したタスク（共通定義）
  const filteredComps = appState.tasks.filter(t => {
    if (t.status !== "completed" || !t.completedAt) return false;
    const compDateStr = t.completedAt.split("T")[0];
    return compDateStr >= startStr && compDateStr <= endStr;
  });

  // 達成感の大きな統計パネルの描画
  const statsSummary = document.getElementById("review-stats-summary");
  if (statsSummary) {
    const totalComps = filteredComps.length;
    const goalCounts = {};
    filteredComps.forEach(t => {
      const goal = appState.goals.find(g => g.id === t.goalId);
      const name = goal ? goal.shortName : "その他";
      const color = goal ? goal.color : "rgba(255,255,255,0.15)";
      if (!goalCounts[name]) {
        goalCounts[name] = { count: 0, color };
      }
      goalCounts[name].count++;
    });

    let statsHTML = `
      <div class="card glass" style="display:flex;align-items:center;justify-content:flex-start;padding:14px 22px;background:rgba(16,185,129,0.06);border:1px dashed rgba(16,185,129,0.25);border-radius:6px;gap:28px;flex-wrap:wrap;flex-direction:row;">
        <div style="display:flex;align-items:center;gap:16px;">
          <span style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.7);">この期間の完了実績:</span>
          <span style="font-size:30px;font-weight:800;color:#10b981;font-family:'Outfit';line-height:1;">${totalComps} <span style="font-size:14px;font-weight:600;color:rgba(255,255,255,0.55);">件完了！</span></span>
        </div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
    `;
    Object.keys(goalCounts).forEach(gName => {
      const item = goalCounts[gName];
      statsHTML += `<span class="badge" style="background:${item.color};color:#fff;font-size:11px;padding:4px 10px;border-radius:5px;font-weight:700;font-family:'Outfit';">${gName}: ${item.count}</span>`;
    });
    if (totalComps === 0) {
      statsHTML += `<span style="font-size:12px;color:rgba(255,255,255,0.35);">完了したタスクはありません</span>`;
    }
    statsHTML += `</div></div>`;
    statsSummary.innerHTML = statsHTML;
  }

  // 4. 完了したタスクの表示
  const completedContainer = document.getElementById("review-completed-list");
  const compCountBadge = document.getElementById("review-completed-count");
  if (completedContainer) {
    completedContainer.innerHTML = "";

    if (compCountBadge) compCountBadge.textContent = `${filteredComps.length}件完了`;

    if (filteredComps.length === 0) {
      completedContainer.innerHTML = `<div style="font-size:11px;color:rgba(255,255,255,0.3);text-align:center;padding:12px;">期間内に完了したタスクはありません</div>`;
    } else {
      filteredComps.forEach(t => {
        const goal = appState.goals.find(g => g.id === t.goalId);
        const goalBadge = goal ? `<span class="badge" style="background:${goal.color};color:#fff;font-family:'Outfit';font-weight:700;font-size:9px;padding:1px 4px;border-radius:3px;flex-shrink:0;">${goal.shortName}</span>` : "";

        const el = document.createElement("div");
        el.style.cssText = "display:flex;align-items:center;gap:8px;padding:5px 6px;background:rgba(16,185,129,0.03);border:1px solid rgba(16,185,129,0.1);border-radius:4px;font-size:11px;";
        el.innerHTML = `
          <i data-lucide="check" style="width:11px;height:11px;color:#10b981;flex-shrink:0;"></i>
          ${goalBadge}
          <span style="color:rgba(255,255,255,0.85);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;flex-grow:1;">${t.title}</span>
        `;
        completedContainer.appendChild(el);
      });
      if (window.lucide) window.lucide.createIcons();
    }
  }

  // 5. 未完了残タスクの抽出と棚卸しリスト
  const pendingContainer = document.getElementById("review-pending-list");
  if (pendingContainer) {
    pendingContainer.innerHTML = "";
    // 期間内が期限、または期限超過している未完了タスク（マイルストーンは棚卸し対象から除外）
    const filteredPendings = appState.tasks.filter(t => {
      if (t.status === "completed" || t.isMilestone) return false;
      if (!t.duedate) return true; // 期限なしは常に残タスク対象
      return t.duedate <= endStr;
    });

    if (filteredPendings.length === 0) {
      pendingContainer.innerHTML = `
        <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;height:120px;gap:6px;margin-top:10px;">
          <i data-lucide="sparkles" style="width:32px;height:32px;color:#a5b4fc;opacity:0.8;"></i>
          <span style="font-size:12.5px;color:rgba(255,255,255,0.65);font-weight:600;">この期間の未完了タスクはありません！</span>
          <span style="font-size:11px;color:rgba(255,255,255,0.35);">素晴らしい！すべてのタスクが完了しています。</span>
        </div>
      `;
      if (window.lucide) window.lucide.createIcons();
    } else {
      filteredPendings.forEach(t => {
        const goal = appState.goals.find(g => g.id === t.goalId);
        const goalBadge = goal ? `<span class="badge" style="background:${goal.color};color:#fff;font-family:'Outfit';font-weight:700;font-size:9px;padding:1px 4px;border-radius:3px;flex-shrink:0;">${goal.shortName}</span>` : "";

        const el = document.createElement("div");
        el.style.cssText = "display:flex;align-items:center;justify-content:space-between;padding:8px 12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.06);border-radius:6px;gap:12px;";
        
        let dateBadge = "";
        if (t.duedate) {
          const isOverdue = t.duedate < formatDate(appState.currentDate);
          dateBadge = `<span class="badge" style="font-family:monospace;background:${isOverdue ? "rgba(239,68,68,0.2)":"rgba(255,255,255,0.05)"};color:${isOverdue ? "#f87171":"rgba(255,255,255,0.5)"};font-size:9.5px;padding:2px 5px;border-radius:3px;">${t.duedate.replace(/-/g, ".")}</span>`;
        }

        el.innerHTML = `
          <div style="display:flex;flex-direction:column;gap:4px;min-width:0;flex-grow:1;">
            <div style="display:flex;align-items:center;gap:6px;">
              ${goalBadge}
              <span style="font-size:12px;font-weight:600;color:rgba(255,255,255,0.9);text-overflow:ellipsis;overflow:hidden;white-space:nowrap;">${t.title}</span>
              ${dateBadge}
            </div>
            ${t.desc ? `<span style="font-size:10px;color:rgba(255,255,255,0.4);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${t.desc}</span>` : ""}
          </div>
          <div style="display:flex;gap:4px;flex-shrink:0;">
            <button title="先送り" onclick="postponeReviewTask('${t.id}')"
              style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);padding:0;transition:all 0.15s;font-size:10px;font-weight:bold;"
              onmouseover="this.style.background='rgba(99,102,241,0.25)';this.style.color='#818cf8';" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.5)';">
              ▶
            </button>
            <button title="削除" onclick="deleteReviewTask('${t.id}')"
              style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);border-radius:4px;width:26px;height:26px;display:flex;align-items:center;justify-content:center;cursor:pointer;color:rgba(255,255,255,0.5);padding:0;transition:all 0.15s;"
              onmouseover="this.style.background='rgba(239,68,68,0.25)';this.style.color='#f87171';" onmouseout="this.style.background='rgba(255,255,255,0.06)';this.style.color='rgba(255,255,255,0.5)';">
              <svg viewBox="0 0 24 24" width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6l-1 14H6L5 6"></path><path d="M10 11v6"></path><path d="M14 11v6"></path><path d="M9 6V4h6v2"></path></svg>
            </button>
          </div>
        `;
        pendingContainer.appendChild(el);
      });
      if (window.lucide) window.lucide.createIcons();
    }
  }
}

// レビューモード切り替え
function changeReviewMode(mode) {
  appState.reviewMode = mode;
  renderReviewPage();
}

// 個別先送り (デイリーは翌日、ウィークリーは翌週月曜日にし、ステータスもそれに合わせて変更)
function postponeReviewTask(taskId) {
  const task = appState.tasks.find(t => t.id === taskId);
  if (!task) return;

  const cur = parseLocalDate(appState.currentDate);
  if (appState.reviewMode === "daily") {
    const tomorrow = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    task.duedate = formatDate(tomorrow);
    task.status = "this_week";
  } else {
    const day = cur.getDay(); // 0:日, 1:月, ...
    const diffToMonday = cur.getDate() - day + (day === 0 ? -6 : 1); // 今週月曜日
    const nextMonday = new Date(cur.getFullYear(), cur.getMonth(), diffToMonday + 7);
    task.duedate = formatDate(nextMonday);
    task.status = "next_week_and_later";
  }
  
  saveData();
  renderAll();
}

// 個別削除 (confirm無し・Ctrl+Z退避)
function deleteReviewTask(taskId) {
  lastTasksState = JSON.parse(JSON.stringify(appState.tasks));
  appState.tasks = appState.tasks.filter(t => t.id !== taskId);
  saveData();
  renderAll();
}

// 一括先送り
function bulkMoveReviewTasks() {
  const endStr = appState.reviewMode === "daily" 
    ? formatDate(appState.currentDate) 
    : (() => {
        const cur = parseLocalDate(appState.currentDate);
        const day = cur.getDay();
        const diff = cur.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(cur.getFullYear(), cur.getMonth(), diff);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return formatDate(sunday);
      })();

  const targetTasks = appState.tasks.filter(t => {
    if (t.status === "completed" || t.isMilestone) return false;
    if (!t.duedate) return true;
    return t.duedate <= endStr;
  });

  if (targetTasks.length === 0) return;

  const cur = parseLocalDate(appState.currentDate);
  let newDuedateStr = "";
  let newStatus = "";
  let confirmMsg = "";

  if (appState.reviewMode === "daily") {
    const tomorrow = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    newDuedateStr = formatDate(tomorrow);
    newStatus = "this_week";
    confirmMsg = `${targetTasks.length}件のタスクをすべて翌日に先送りしますか？`;
  } else {
    const day = cur.getDay();
    const diffToMonday = cur.getDate() - day + (day === 0 ? -6 : 1);
    const nextMonday = new Date(cur.getFullYear(), cur.getMonth(), diffToMonday + 7);
    newDuedateStr = formatDate(nextMonday);
    newStatus = "next_week_and_later";
    confirmMsg = `${targetTasks.length}件のタスクをすべて翌週月曜日に先送りしますか？`;
  }

  if (!confirm(confirmMsg)) return;

  targetTasks.forEach(t => {
    t.status = newStatus;
    t.duedate = newDuedateStr;
  });

  saveData();
  renderAll();
}

// 一括削除 (confirm無し・Ctrl+Z退避)
function bulkDeleteReviewTasks() {
  const endStr = appState.reviewMode === "daily" 
    ? formatDate(appState.currentDate) 
    : (() => {
        const cur = parseLocalDate(appState.currentDate);
        const day = cur.getDay();
        const diff = cur.getDate() - day + (day === 0 ? -6 : 1);
        const monday = new Date(cur.getFullYear(), cur.getMonth(), diff);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        return formatDate(sunday);
      })();

  const targetTasks = appState.tasks.filter(t => {
    if (t.status === "completed" || t.isMilestone) return false;
    if (!t.duedate) return true;
    return t.duedate <= endStr;
  });

  if (targetTasks.length === 0) return;

  lastTasksState = JSON.parse(JSON.stringify(appState.tasks));
  const targetIds = new Set(targetTasks.map(t => t.id));
  appState.tasks = appState.tasks.filter(t => !targetIds.has(t.id));

  saveData();
  renderAll();
}


window.switchView = switchView;
window.openAddTaskModal = openAddTaskModal;
window.openEditTaskModal = openEditTaskModal;
window.openAddScheduleModal = openAddScheduleModal;
window.openEditScheduleModal = openEditScheduleModal;
window.toggleTaskCompleted = toggleTaskCompleted;
window.changeTaskStatus = changeTaskStatus;
window.deleteTask = deleteTask;
// ==========================================================================
// FIREBASE SYNC & AUTH LOGIC
// ==========================================================================
let isFirebaseInitialized = false;

// 標準のFirebase接続設定（ユーザーに提供いただいたFirebaseプロジェクト）
const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyD-zwYo7cw7nQwdPT7PgJp_X7jietPGZyA",
  authDomain: "task-manager-d5d8f.firebaseapp.com",
  projectId: "task-manager-d5d8f",
  storageBucket: "task-manager-d5d8f.firebasestorage.app",
  messagingSenderId: "771494713965",
  appId: "1:771494713965:web:b46729abeeabf669983d64",
  measurementId: "G-P3YH24ZZ7Y"
};

// ランダムな合言葉（同期キー）の自動生成
function generateRandomSyncKey() {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  let part1 = "";
  let part2 = "";
  for (let i = 0; i < 4; i++) {
    part1 += chars.charAt(Math.floor(Math.random() * chars.length));
    part2 += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `orbit-${part1}-${part2}`;
}

function initFirebase() {
  // 同期キー（合言葉）がなければ自動生成
  let syncKey = localStorage.getItem("firebase_sync_key");
  if (!syncKey) {
    syncKey = generateRandomSyncKey();
    localStorage.setItem("firebase_sync_key", syncKey);
  }

  // Configはカスタム（詳細設定の手動入力）があればそれを使用、なければデフォルトを使用
  const configRaw = localStorage.getItem("firebase_config");
  let config;
  if (configRaw) {
    try {
      config = JSON.parse(configRaw);
    } catch (e) {
      console.error("Custom Config parse error, fallback to default:", e);
      config = DEFAULT_FIREBASE_CONFIG;
    }
  } else {
    config = DEFAULT_FIREBASE_CONFIG;
  }

  // 設定画面の表示反映
  const mySyncCodeInput = document.getElementById("my-sync-code");
  if (mySyncCodeInput) {
    mySyncCodeInput.value = syncKey;
  }
  const configTextarea = document.getElementById("fb-config-json");
  if (configTextarea && configRaw) {
    configTextarea.value = configRaw;
  }

  try {
    if (!isFirebaseInitialized) {
      firebase.initializeApp(config);
      isFirebaseInitialized = true;
    }
    updateHeaderSyncStatus(true);
    loadFirebaseData(syncKey);
  } catch (e) {
    console.error("Firebase Initialization Error:", e);
    updateHeaderSyncStatus(false);
  }
}

// 設定画面の同期状態表示の更新
function updateHeaderSyncStatus(isCloud) {
  const statusText = document.getElementById("sync-status-text");
  const mySyncCodeInput = document.getElementById("my-sync-code");

  if (isCloud) {
    if (statusText) {
      const currentKey = localStorage.getItem("firebase_sync_key") || "";
      statusText.innerHTML = `<span style="color:#10b981;font-weight:700;">● クラウド同期中</span> (合言葉: <span style="font-family:monospace;background:rgba(255,255,255,0.08);padding:2px 6px;border-radius:4px;">${currentKey}</span>)`;
    }
  } else {
    if (statusText) {
      statusText.innerHTML = `<span style="color:#f59e0b;font-weight:700;">● 未同期 (ローカル保存モード)</span>`;
    }
    if (mySyncCodeInput) {
      mySyncCodeInput.value = "同期が解除されています";
    }
  }
  if (window.lucide) window.lucide.createIcons();
}

// 同期コードをクリップボードにコピー
function copySyncKey() {
  const syncKey = localStorage.getItem("firebase_sync_key");
  if (!syncKey) {
    alert("同期コードがありません。");
    return;
  }
  navigator.clipboard.writeText(syncKey)
    .then(() => {
      alert("同期コードをクリップボードにコピーしました！スマホなどの他端末に貼り付けてご使用ください。");
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
      const input = document.getElementById("my-sync-code");
      if (input) {
        input.select();
        document.execCommand("copy");
        alert("同期コードを選択しました。コピー（Ctrl+C）してください。");
      }
    });
}

// 別の端末から同期を引き継ぐ
function importSyncData() {
  const inputEl = document.getElementById("import-sync-code-input");
  if (!inputEl) return;
  const newSyncKey = inputEl.value.trim();

  if (!newSyncKey) {
    alert("同期を引き継ぐための「合言葉（同期コード）」を入力してください。");
    return;
  }

  if (!newSyncKey.startsWith("orbit-")) {
    if (!confirm("入力されたコードは標準の形式（orbit-xxxx-xxxx）と異なりますが、このまま引き継ぎを行いますか？")) {
      return;
    }
  }

  if (confirm("本当にこの端末のデータを上書きして、指定したコードのデータを引き継ぎますか？\n※現在のローカルデータは消去され、入力したコードのデータと同期が開始されます。")) {
    localStorage.setItem("firebase_sync_key", newSyncKey);
    localStorage.removeItem("lifeorbit_data");
    alert("同期コードを更新しました。データをロードします。");
    window.location.reload();
  }
}

// 同期解除
function disconnectSync() {
  if (confirm("クラウド同期を解除しますか？\n※手元のデータは消えませんが、クラウドとの連携は停止し、次回から別の新しい自動生成キーで同期されます。")) {
    localStorage.removeItem("firebase_sync_key");
    localStorage.removeItem("firebase_config");
    window.location.reload();
  }
}

// 詳細設定：カスタムFirebase Configの保存
function saveCustomConfig() {
  const configTextarea = document.getElementById("fb-config-json");
  if (!configTextarea) return;
  const json = configTextarea.value.trim();

  if (!json) {
    localStorage.removeItem("firebase_config");
    alert("カスタムFirebase Configを削除し、標準データベースに戻しました。ページを再起動します。");
    window.location.reload();
    return;
  }

  try {
    JSON.parse(json);
    localStorage.setItem("firebase_config", json);
    alert("カスタムFirebase Configを保存しました。ページを再起動します。");
    window.location.reload();
  } catch (e) {
    alert("無効なJSON形式です。FirebaseコンソールからコピーしたConfigオブジェクトを正しく貼り付けてください。");
  }
}

// グローバルスコープに関数を公開
window.copySyncKey = copySyncKey;
window.importSyncData = importSyncData;
window.disconnectSync = disconnectSync;
window.saveCustomConfig = saveCustomConfig;

let firestoreUnsubscribe = null;

// Firestoreから合言葉ドキュメントをリアルタイムに購読
function loadFirebaseData(syncKey) {
  if (firestoreUnsubscribe) {
    firestoreUnsubscribe();
  }

  firestoreUnsubscribe = firebase.firestore().collection("orbits").doc(syncKey).onSnapshot((doc) => {
    if (doc.exists) {
      const data = doc.data();
      const localRaw = localStorage.getItem("lifeorbit_data");
      let shouldUpdate = true;
      if (localRaw) {
        try {
          const localParsed = JSON.parse(localRaw);
          if (localParsed.lastSyncTime === data.lastSyncTime) {
            shouldUpdate = false;
          }
        } catch (e) {}
      }

      if (shouldUpdate && (data.goals || data.tasks || data.schedules)) {
        appState.goals = data.goals || [];
        appState.tasks = data.tasks || [];
        appState.schedules = data.schedules || [];
        appState.lastSyncTime = data.lastSyncTime || null;
        
        // 既存データのプレフィックスクリーンアップ
        const didClean = cleanOldSchedulePrefixes();
        
        localStorage.setItem("lifeorbit_data", JSON.stringify({
          goals: appState.goals,
          tasks: appState.tasks,
          schedules: appState.schedules,
          lastSyncTime: appState.lastSyncTime
        }));
        
        renderAll();
        console.log("Firestore data synchronized in real-time.");
        
        if (didClean) {
          syncDataToFirebase();
        }
      }
    } else {
      console.log("Firestoreにデータがありません。現在のローカルデータを同期先にアップロードします。");
      syncDataToFirebase();
    }
  }, (error) => {
    console.error("Firestore Load/Snapshot Error:", error);
  });
}

// データをFirestoreに同期（プッシュ）
function syncDataToFirebase() {
  if (!isFirebaseInitialized) return;
  const syncKey = localStorage.getItem("firebase_sync_key");
  if (!syncKey) return;

  firebase.firestore().collection("orbits").doc(syncKey).set({
    goals: appState.goals,
    tasks: appState.tasks,
    schedules: appState.schedules,
    lastSyncTime: appState.lastSyncTime
  })
  .then(() => {
    console.log("Firestore data updated.");
  })
  .catch((e) => {
    console.error("Firestore Sync Error:", e);
  });
}

// 現在のローカルデータを、合言葉の同期ドキュメントへ上書きデプロイ(アップロード)する
function deployDataToFirebase() {
  if (!isFirebaseInitialized) {
    alert("Firebaseが有効になっていません。Configを入力して同期を開始してください。");
    return;
  }
  const syncKey = localStorage.getItem("firebase_sync_key");
  if (!syncKey) {
    alert("同期用の合言葉が設定されていません。");
    return;
  }

  if (confirm("【警告】現在画面上に表示されているローカルのデータ（目標・タスク・スケジュール）で、この合言葉のオンラインデータベースを完全に上書きデプロイします。よろしいですか？")) {
    appState.lastSyncTime = new Date().toISOString();
    
    localStorage.setItem("lifeorbit_data", JSON.stringify({
      goals: appState.goals,
      tasks: appState.tasks,
      schedules: appState.schedules,
      lastSyncTime: appState.lastSyncTime
    }));

    firebase.firestore().collection("orbits").doc(syncKey).set({
      goals: appState.goals,
      tasks: appState.tasks,
      schedules: appState.schedules,
      lastSyncTime: appState.lastSyncTime
    })
    .then(() => {
      alert("オンラインデータベースへのデプロイ（上書きアップロード）が成功しました！");
    })
    .catch((e) => {
      console.error("Deploy Error:", e);
      alert("デプロイに失敗しました: " + e.message);
    });
  }
}

// データの個別リセット・一括クリア機能
function resetDataCategory(category) {
  const confirmMsg = {
    tasks: "【警告】すべてのタスク（マイルストーン、子タスク含む）を完全に削除します。この操作は元に戻せません。よろしいですか？",
    schedules: "【警告】すべてのスケジュール（外部からインポートした予定含む）を完全に削除します。この操作は元に戻せません。よろしいですか？",
    goals: "【警告】すべての目標を完全に削除します。※紐づいていたタスクの関連目標は自動的に「なし」にクリアされます。よろしいですか？",
    all: "【超重大警告】タスク、スケジュール、目標を含む「すべてのデータ」を完全に削除し、アプリを空にします。この操作は元に戻せません。本当によろしいですか？"
  };

  if (!confirm(confirmMsg[category])) return;

  if (category === "tasks" || category === "all") {
    appState.tasks = [];
  }
  if (category === "schedules" || category === "all") {
    appState.schedules = [];
  }
  if (category === "goals" || category === "all") {
    appState.goals = [];
    // 漏れ対策：既存タスクのgoalIdを「なし」に安全にクリア
    appState.tasks.forEach(t => {
      t.goalId = "none";
      t.parentTaskId = "none"; // マイルストーン自体が消えるため親子もリセット
    });
  }

  // 同期用タイムスタンプの更新とローカル＆クラウド同期
  appState.lastSyncTime = new Date().toISOString();
  saveData();
  renderAll();
  alert("データを削除しました。");
}

window.switchView = switchView;
window.openAddTaskModal = openAddTaskModal;
window.openEditTaskModal = openEditTaskModal;
window.openAddScheduleModal = openAddScheduleModal;
window.openEditScheduleModal = openEditScheduleModal;
window.toggleTaskCompleted = toggleTaskCompleted;
window.changeTaskStatus = changeTaskStatus;
window.deleteTask = deleteTask;
window.deleteSchedule = deleteSchedule;
window.prevMonth = prevMonth;
window.nextMonth = nextMonth;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.toggleMilestoneOpen = toggleMilestoneOpen;
window.addChildTask = addChildTask;
window.toggleSubtaskInModal = toggleSubtaskInModal;
window.deleteChildTask = deleteChildTask;
window.resetToDefault = resetToDefault;
window.dragStartTask = dragStartTask;
window.quickDeleteTask = quickDeleteTask;
window.undoLastDelete = undoLastDelete;
window.toggleDashboardGoal = toggleDashboardGoal;
window.openAddGoalModal = openAddGoalModal;
window.openEditGoalModal = openEditGoalModal;
window.selectGoalColor = selectGoalColor;
window.updateModalMilestoneTitle = updateModalMilestoneTitle;
window.updateModalMilestoneDate = updateModalMilestoneDate;
window.deleteModalMilestone = deleteModalMilestone;
window.deleteGoal = deleteGoal;
window.renderReviewPage = renderReviewPage;
window.changeReviewMode = changeReviewMode;
window.postponeReviewTask = postponeReviewTask;
window.deleteReviewTask = deleteReviewTask;
window.bulkMoveReviewTasks = bulkMoveReviewTasks;
window.bulkDeleteReviewTasks = bulkDeleteReviewTasks;
window.initFirebase = initFirebase;
window.syncDataToFirebase = syncDataToFirebase;
window.resetDataCategory = resetDataCategory;
window.updateHeaderSyncStatus = updateHeaderSyncStatus;
window.deployDataToFirebase = deployDataToFirebase;


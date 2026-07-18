/**
 * LifeOrbit - Application Logic
 * Goals, Tasks, and Calendar Integration for Game Producers
 * IDs aligned to index.html structure
 */

// ==========================================================================
// STATE MANAGEMENT & INITIAL DATA
// ==========================================================================

const DEFAULT_GOALS = [
  {
    "id": "goal-life",
    "title": "Project Cosmicの開発・ローンチ",
    "shortName": "Cosmic",
    "metric": "Steam評価75%以上、年度内販売30万本達成",
    "tag": "life",
    "color": "#3b82f6",
    "tagClass": "goal-tag-life",
    "cardClass": "goal-life",
    "taskCount": 9,
    "completedCount": 0,
    "progress": 0
  },
  {
    "id": "goal-ninpri",
    "title": "StarQuest開発・ローンチ",
    "shortName": "StarQuest",
    "metric": "指標: Steam評価80%以上、年度内販売40万本達成",
    "tag": "ninpri",
    "color": "#f59e0b",
    "tagClass": "goal-tag-ninpri",
    "cardClass": "goal-ninpri",
    "taskCount": 7,
    "completedCount": 0,
    "progress": 0
  },
  {
    "id": "goal-indie",
    "title": "【インディー支援】支援インディーゲーム3タイトルのパブリッシング",
    "shortName": "Indies",
    "metric": "Astro/Nebula/Cometの年内発売、または発売日確定",
    "tag": "indie",
    "color": "var(--color-indie)",
    "tagClass": "goal-tag-indie",
    "cardClass": "goal-indie",
    "taskCount": 1,
    "completedCount": 0,
    "progress": 0
  },
  {
    "id": "goal-new",
    "title": "【新規立ち上げ】外部有名クリエイター協業タイトルの企画フィジビリティ",
    "shortName": "NEW",
    "metric": "新規タイトルの本制作移行に向けたプロトタイプおよび企画の最終承認",
    "tag": "new",
    "color": "var(--color-new)",
    "tagClass": "goal-tag-new",
    "cardClass": "goal-new",
    "taskCount": 1,
    "completedCount": 0,
    "progress": 0
  }
];

const DEFAULT_TASKS = [
  {
    "id": "task-2",
    "title": "アルファ版ビルドの社内プレイテストフィードバック集計",
    "goalId": "goal-life",
    "priority": "high",
    "status": "completed",
    "completedAt": "2026-07-08T18:00:00+09:00",
    "duedate": "2026-07-08",
    "desc": "開発チームから上がったバグと改善要望をスプレッドシートにまとめ、優先度を設定する。",
    "isMilestone": false
  },
  {
    "id": "task-4",
    "title": "ローカライズ会社との見積もり・スケジュール調整",
    "goalId": "goal-life",
    "priority": "low",
    "status": "waiting",
    "completedAt": null,
    "duedate": "2026-07-31",
    "desc": "英語、簡体字、繁体字、韓国語の翻訳手配。",
    "isMilestone": false
  },
  {
    "id": "task-5",
    "title": "外部開発会社との定例進捗会議アジェンダ作成",
    "goalId": "goal-ninpri",
    "priority": "medium",
    "status": "completed",
    "completedAt": "2026-07-09T18:00:00+09:00",
    "duedate": "2026-07-09",
    "desc": "マスターアップに向けた残課題（特にQA状況）について議論する。",
    "isMilestone": false
  },
  {
    "id": "task-7",
    "title": "プロモーション用プレスリリースの監修",
    "goalId": "goal-ninpri",
    "priority": "low",
    "status": "waiting",
    "completedAt": null,
    "duedate": "2026-07-25",
    "desc": "パブリッシャーから届いたリリース初稿のファクトチェック。",
    "isMilestone": false
  },
  {
    "id": "task-8",
    "title": "インディータイトル『Astro』のパブリッシング契約書捺印手続き",
    "goalId": "goal-indie",
    "priority": "high",
    "status": "completed",
    "completedAt": "2026-07-05T18:00:00+09:00",
    "duedate": "2026-07-05",
    "desc": "法務チェック完了、捺印に回す。",
    "isMilestone": false
  },
  {
    "id": "task-9",
    "title": "『Nebula』開発マイルストーンチェック（β版確認）",
    "goalId": "goal-indie",
    "priority": "medium",
    "status": "this_week",
    "completedAt": null,
    "duedate": "2026-07-22",
    "desc": "インディー開発者から届いた最新ビルドを実機でプレイし、フィードバックシートを送付。",
    "isMilestone": true
  },
  {
    "id": "task-10",
    "title": "『Comet』の発売日決定に向けたプラットフォーム調整",
    "goalId": "goal-indie",
    "priority": "high",
    "status": "next_week_and_later",
    "completedAt": null,
    "duedate": "2026-07-28",
    "desc": "Nintendo Switch/Steamで同日リリースするための調整。",
    "isMilestone": false
  },
  {
    "id": "task-11",
    "title": "外部有名クリエイターとの初期コンセプト会議",
    "goalId": "goal-new",
    "priority": "high",
    "status": "completed",
    "completedAt": "2026-07-07T18:00:00+09:00",
    "duedate": "2026-07-07",
    "desc": "世界観、メインターゲット、大枠のゲームジャンルについての合意形成。",
    "isMilestone": false
  },
  {
    "id": "task-12",
    "title": "新規タイトル本制作移行への投資委員会プレゼン承認",
    "goalId": "goal-new",
    "priority": "high",
    "status": "this_week",
    "completedAt": null,
    "duedate": "2026-07-25",
    "desc": "投資委員会での承認を得て本制作フェーズに移行するための準備。",
    "isMilestone": true
  },
  {
    "id": "subtask-s1",
    "title": "PL表作成と予算シミュレーション",
    "goalId": "goal-new",
    "priority": "medium",
    "status": "today",
    "completedAt": null,
    "duedate": "2026-07-25",
    "desc": "",
    "isMilestone": false,
    "parentTaskId": "task-12"
  },
  {
    "id": "subtask-s2",
    "title": "事業部長の事前承認を得る",
    "goalId": "goal-new",
    "priority": "medium",
    "status": "completed",
    "completedAt": "2026-07-09T12:00:00+09:00",
    "duedate": "2026-07-25",
    "desc": "",
    "isMilestone": false,
    "parentTaskId": "task-12"
  },
  {
    "id": "subtask-s3",
    "title": "委員会説明用のプレゼン映像完成",
    "goalId": "goal-new",
    "priority": "medium",
    "status": "today",
    "completedAt": null,
    "duedate": "2026-07-25",
    "desc": "",
    "isMilestone": false,
    "parentTaskId": "task-12"
  },
  {
    "id": "task-13",
    "title": "今週のチームメンバー工数表の承認",
    "goalId": "none",
    "priority": "medium",
    "status": "today",
    "completedAt": null,
    "duedate": "2026-07-10",
    "desc": "金曜日締め切りの工数承認フロー。",
    "isMilestone": false
  },
  {
    "id": "task-14",
    "title": "経費精算書の処理",
    "goalId": "none",
    "priority": "low",
    "status": "completed",
    "completedAt": "2026-07-05T18:00:00+09:00",
    "duedate": "2026-07-05",
    "desc": "6月分の出張費精算。",
    "isMilestone": false
  },
  {
    "id": "task-15",
    "title": "海外パブリッシャーからのメール返信",
    "goalId": "none",
    "priority": "high",
    "status": "today",
    "completedAt": null,
    "duedate": "2026-07-10",
    "desc": "ライセンス条件に関する問い合わせへの返答。",
    "isMilestone": false
  },
  {
    "id": "task-1783685132387gwya",
    "title": "予算増に関する投資委員会承認",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-07-21",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685132387d39g",
    "title": "ロットチェック合格",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-11-06",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685132387zmxt",
    "title": "タイトル発表",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-09-03",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685132387ugwx",
    "title": "レーティング取得",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-09-30",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685132387gqgm",
    "title": "体験版配信",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2027-02-18",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-17836851323879bqj",
    "title": "発売",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2027-03-04",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-178368513238734tk",
    "title": "マスター提出",
    "goalId": "goal-life",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-10-01",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-17836853049903nug",
    "title": "ベータビルド完成",
    "goalId": "goal-ninpri",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-06-30",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685304990j9xh",
    "title": "マスター提出",
    "goalId": "goal-ninpri",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-10-01",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685304990cnyb",
    "title": "マスター承認",
    "goalId": "goal-ninpri",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-10-30",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685304990aire",
    "title": "体験版配信",
    "goalId": "goal-ninpri",
    "status": "today",
    "priority": "medium",
    "duedate": "2027-01-08",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-17836853049907k8q",
    "title": "発売",
    "goalId": "goal-ninpri",
    "status": "today",
    "priority": "medium",
    "duedate": "2027-01-28",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1783685304990bak2",
    "title": "TGS出展",
    "goalId": "goal-ninpri",
    "status": "today",
    "priority": "medium",
    "duedate": "2026-09-17",
    "desc": "",
    "isMilestone": true,
    "parentTaskId": null
  },
  {
    "id": "task-1",
    "title": "Steamストアページ向けモックアップ作成と確認",
    "goalId": "goal-life",
    "priority": "high",
    "status": "this_week",
    "completedAt": null,
    "duedate": "2026-07-15",
    "desc": "プロモーション用に早期にSteamストアを構築する。キーアートの選定と紹介テキスト案作成。",
    "isMilestone": true
  },
  {
    "id": "task-3",
    "title": "Cosmic PVファーストカットのディレクターズチェック",
    "goalId": "goal-life",
    "priority": "medium",
    "status": "next_week_and_later",
    "completedAt": null,
    "duedate": "2026-07-20",
    "desc": "マーケチームが作成したPVの構成案を確認し、ゲームプレイの魅力が伝わっているかチェック。",
    "isMilestone": true
  },
  {
    "id": "subtask-s4",
    "title": "キーアートの選定",
    "goalId": "goal-life",
    "priority": "medium",
    "status": "completed",
    "completedAt": "2026-07-09T14:00:00+09:00",
    "duedate": "2026-07-15",
    "desc": "",
    "isMilestone": false,
    "parentTaskId": "task-1"
  },
  {
    "id": "subtask-s5",
    "title": "紹介テキスト案作成",
    "goalId": "goal-life",
    "priority": "medium",
    "status": "today",
    "completedAt": null,
    "duedate": "2026-07-15",
    "desc": "",
    "isMilestone": false,
    "parentTaskId": "task-1"
  },
  {
    "id": "task-6",
    "title": "Steam評価80%達成のためのQA重点項目選定",
    "goalId": "goal-ninpri",
    "priority": "high",
    "status": "this_week",
    "completedAt": null,
    "duedate": "2026-07-18",
    "desc": "過去作のユーザーレビューを分析し、クラッシュ率の低減と操作性フィードバックの反映を指示。",
    "isMilestone": true
  }
];

const DEFAULT_SCHEDULES = [
  {
    "id": "sch-1",
    "title": "プロジェクト『Cosmic』定例進捗会議",
    "startDate": "2026-07-10",
    "startTime": "10:00",
    "endDate": "2026-07-10",
    "endTime": "11:00",
    "allday": false,
    "desc": "社内メイン会議室。進捗確認と課題整理。",
    "isGaroon": false
  },
  {
    "id": "sch-2",
    "title": "海外パブリッシャー合同オンライン会議",
    "startDate": "2026-07-10",
    "startTime": "15:00",
    "endDate": "2026-07-10",
    "endTime": "16:00",
    "allday": false,
    "desc": "Teams会議。プロモーションプランについて。",
    "isGaroon": false
  },
  {
    "id": "sch-g1",
    "title": "【外部同期】Cosmic進捗報告",
    "startDate": "2026-07-10",
    "startTime": "13:00",
    "endDate": "2026-07-10",
    "endTime": "14:00",
    "allday": false,
    "desc": "役員会議室A。P&Lおよびマイルストーン報告。",
    "isGaroon": true
  },
  {
    "id": "sch-g2",
    "title": "【外部同期】StarQuest 外部開発週次進捗報告",
    "startDate": "2026-07-10",
    "startTime": "16:30",
    "endDate": "2026-07-10",
    "endTime": "17:30",
    "allday": false,
    "desc": "会議室Cにて開発パートナー会社と接続。",
    "isGaroon": true
  },
  {
    "id": "sch-3",
    "title": "ローカライズ会社A社キックオフ",
    "startDate": "2026-07-13",
    "startTime": "11:00",
    "endDate": "2026-07-13",
    "endTime": "12:00",
    "allday": false,
    "desc": "Teamsオンライン会議。Cosmicの多言語翻訳について。",
    "isGaroon": false
  },
  {
    "id": "sch-4",
    "title": "投資委員会提出プレゼンプレビュー",
    "startDate": "2026-07-13",
    "startTime": "14:00",
    "endDate": "2026-07-13",
    "endTime": "15:30",
    "allday": false,
    "desc": "A会議室。プロトタイプのクオリティ確認とPL説明リハーサル。",
    "isGaroon": false
  },
  {
    "id": "sch-5",
    "title": "Cosmic 開発週次定例",
    "startDate": "2026-07-14",
    "startTime": "10:00",
    "endDate": "2026-07-14",
    "endTime": "11:00",
    "allday": false,
    "desc": "会議室A。今週のスプリント課題確認。",
    "isGaroon": false
  },
  {
    "id": "sch-6",
    "title": "【外部同期】定例進捗報告",
    "startDate": "2026-07-14",
    "startTime": "11:00",
    "endDate": "2026-07-14",
    "endTime": "11:30",
    "allday": false,
    "desc": "進捗の確認とトリアージ。",
    "isGaroon": true
  },
  {
    "id": "sch-7",
    "title": "打合せ:支援部定例",
    "startDate": "2026-07-14",
    "startTime": "11:30",
    "endDate": "2026-07-14",
    "endTime": "12:00",
    "allday": false,
    "desc": "インディーゲームパブリッシング支援についての調整。",
    "isGaroon": false
  },
  {
    "id": "sch-8",
    "title": "外出:デンツウゲームセンター（12:06品川シーサイド発）",
    "startDate": "2026-07-14",
    "startTime": "12:00",
    "endDate": "2026-07-14",
    "endTime": "18:00",
    "allday": false,
    "desc": "テストプレイセンターへ実機動作確認のため出張。",
    "isGaroon": false
  },
  {
    "id": "sch-9",
    "title": "社内会議:開発計数会議",
    "startDate": "2026-07-14",
    "startTime": "14:00",
    "endDate": "2026-07-14",
    "endTime": "15:00",
    "allday": false,
    "desc": "下半期の予算シミュレーションについて。",
    "isGaroon": false
  },
  {
    "id": "sch-10",
    "title": "社内会議:【Cosmic】社内定例",
    "startDate": "2026-07-14",
    "startTime": "16:00",
    "endDate": "2026-07-14",
    "endTime": "17:00",
    "allday": false,
    "desc": "進捗状況の共有とタスクの棚卸し。",
    "isGaroon": false
  },
  {
    "id": "sch-11",
    "title": "【イベント】BitSummit 2026 出張",
    "startDate": "2026-07-15",
    "startTime": "00:00",
    "endDate": "2026-07-17",
    "endTime": "23:59",
    "allday": true,
    "desc": "京都出張。インディーゲーム開発者の発掘と面談。",
    "isGaroon": false
  },
  {
    "id": "sch-12",
    "title": "プラットフォーマーA社 個別面談",
    "startDate": "2026-07-15",
    "startTime": "10:00",
    "endDate": "2026-07-15",
    "endTime": "12:00",
    "allday": false,
    "desc": "BitSummit会場内のブースにて。インディー支援タイトルのフィーチャー交渉。",
    "isGaroon": false
  },
  {
    "id": "sch-13",
    "title": "外部有名クリエイター協業プロトタイプ評価",
    "startDate": "2026-07-15",
    "startTime": "16:00",
    "endDate": "2026-07-15",
    "endTime": "17:00",
    "allday": false,
    "desc": "プロトタイプ第1弾のプレイフィードバック会。",
    "isGaroon": false
  },
  {
    "id": "sch-14",
    "title": "【外部同期】経営役員会向けCosmic進捗報告",
    "startDate": "2026-07-16",
    "startTime": "13:00",
    "endDate": "2026-07-16",
    "endTime": "14:00",
    "allday": false,
    "desc": "役員会議室A。進捗マイルストーンおよび予算報告。",
    "isGaroon": true
  },
  {
    "id": "sch-15",
    "title": "1on1 (メンバーA)",
    "startDate": "2026-07-16",
    "startTime": "15:00",
    "endDate": "2026-07-16",
    "endTime": "15:30",
    "allday": false,
    "desc": "週次の進捗面談とキャリア面談。",
    "isGaroon": false
  },
  {
    "id": "sch-16",
    "title": "【外部同期】StarQuest 外部開発週次進捗報告",
    "startDate": "2026-07-17",
    "startTime": "16:30",
    "endDate": "2026-07-17",
    "endTime": "17:30",
    "allday": false,
    "desc": "オンライン接続。マスター承認前のQAバグ修正状況確認。",
    "isGaroon": true
  }
];

let appState = {
  goals: [],
  tasks: [],
  schedules: [],
  notes: [],
  currentDate: new Date(),
  viewDate: new Date(),
  lastSyncTime: null,
  activeView: "dashboard",
  calendarViewMode: "week",
  reviewMode: "daily",
  kanbanFilterGoal: "all",
  kanbanFilterPriority: "all"
};

let activeNoteId = null;
let expandedMilestones = new Set();
let lastTasksState = null;

let undoStack = [];
const MAX_UNDO_LIMIT = 50;

function saveToUndoStack() {
  if (undoStack.length >= MAX_UNDO_LIMIT) {
    undoStack.shift();
  }
  undoStack.push(JSON.parse(JSON.stringify(appState)));
}

function performUndo() {
  if (undoStack.length === 0) return;
  const prevState = undoStack.pop();
  appState = prevState;
  
  // Dateオブジェクトの再構成
  if (appState.currentDate) appState.currentDate = new Date(appState.currentDate);
  if (appState.viewDate) appState.viewDate = new Date(appState.viewDate);
  
  saveData();
  renderAll();
}

// ==========================================================================
// INITIALIZATION
// ==========================================================================

document.addEventListener("DOMContentLoaded", () => {
  try {
    loadData();
    setupUI();
    setupEventListeners();
    initNotesView();
    initFirebase();
    renderAll();
    startClock();
  } catch (err) {
    alert("LifeOrbit 初期化エラー:\n" + err.message + "\n\nStack Trace:\n" + err.stack);
    console.error("Initialization error:", err);
  }
});

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
      appState.notes = parsed.notes || [];
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
    notes: appState.notes,
    lastSyncTime: appState.lastSyncTime
  }));
  syncDataToFirebase();
}

function resetToDefault() {
  appState.goals = JSON.parse(JSON.stringify(DEFAULT_GOALS));
  appState.tasks = JSON.parse(JSON.stringify(DEFAULT_TASKS));
  appState.schedules = JSON.parse(JSON.stringify(DEFAULT_SCHEDULES));
  appState.notes = [];
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
  if (str instanceof Date) {
    str = formatDate(str);
  }
  return str ? String(str).replace(/-/g, ".") : "";
}

function parseLocalDate(str) {
  if (!str) return new Date();
  if (str instanceof Date) return str;
  if (typeof str !== "string") return new Date(str);
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

// タスクソート：重要度(優先度)順 (高➔中➔低) ➔ 期限日順 (昇順、未設定は後)
function sortTasks(tasks) {
  const priorityWeight = { "high": 3, "medium": 2, "low": 1 };
  return [...tasks].sort((a, b) => {
    const pA = priorityWeight[a.priority] || 2;
    const pB = priorityWeight[b.priority] || 2;
    if (pA !== pB) {
      return pB - pA;
    }
    const dA = a.duedate || "9999-99-99";
    const dB = b.duedate || "9999-99-99";
    if (dA !== dB) {
      return dA.localeCompare(dB);
    }
    return (a.title || "").localeCompare(b.title || "");
  });
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
      else if (key === "RRULE") ev.rrule = val;
      else if (key === "UID") ev.uid = val;
      else if (key.startsWith("EXDATE")) {
        if (!ev.exdates) ev.exdates = [];
        val.split(",").forEach(v => {
          const d = parseICSDate(v);
          if (d) ev.exdates.push(formatDate(d));
        });
      }
    }
  }

  const result = [];
  const overrideMap = new Map();

  // 1. まずRRULE（繰り返しルール）のない個別予定（変更分や単発の予定）を処理
  const singles = events.filter(e => !e.rrule);
  const masters = events.filter(e => e.rrule);

  singles.forEach(e => {
    const start = parseICSDate(e.dtstart);
    const end = parseICSDate(e.dtend);
    if (!start || !end) return;

    const allday = (e.dtstart || "").length <= 8;
    const eventObj = createEventObject(e.title, start, end, allday, e.desc);
    result.push(eventObj);

    // UIDがある場合、その予定日（startDate）を上書きマップに登録
    if (e.uid) {
      overrideMap.set(`${e.uid}_${eventObj.startDate}`, true);
    }
  });

  // 2. 次に繰り返しマスタ予定を展開（個別予定がある日やEXDATE指定日はスキップ）
  masters.forEach(e => {
    const start = parseICSDate(e.dtstart);
    const end = parseICSDate(e.dtend);
    if (!start || !end) return;

    const allday = (e.dtstart || "").length <= 8;
    const durationMs = end.getTime() - start.getTime();

    // RRULEをパース
    const rruleObj = {};
    e.rrule.split(";").forEach(part => {
      const [k, v] = part.split("=");
      if (k && v) rruleObj[k] = v;
    });

    const freq = rruleObj.FREQ;
    const interval = parseInt(rruleObj.INTERVAL || "1", 10);
    
    let untilDate = null;
    if (rruleObj.UNTIL) {
      untilDate = parseICSDate(rruleObj.UNTIL);
    }
    
    // 最大90日間展開
    const maxDate = new Date(start.getTime());
    maxDate.setDate(maxDate.getDate() + 90);
    const limitDate = untilDate && untilDate < maxDate ? untilDate : maxDate;

    let currentStart = new Date(start.getTime());
    let count = 0;
    const maxCount = parseInt(rruleObj.COUNT || "100", 10);

    // マスタに紐づくEXDATE（除外日）のセット
    const exdateSet = new Set(e.exdates || []);

    while (currentStart <= limitDate && count < maxCount) {
      let shouldAdd = true;
      if (freq === "WEEKLY" && rruleObj.BYDAY) {
        const dayMap = { "SU": 0, "MO": 1, "TU": 2, "WE": 3, "TH": 4, "FR": 5, "SA": 6 };
        const currentDay = currentStart.getDay();
        const allowedDays = rruleObj.BYDAY.split(",").map(d => dayMap[d.trim()]);
        if (!allowedDays.includes(currentDay)) {
          shouldAdd = false;
        }
      }

      if (shouldAdd) {
        const currentDateStr = formatDate(currentStart);
        const isExcluded = exdateSet.has(currentDateStr);
        const isOverridden = e.uid && overrideMap.has(`${e.uid}_${currentDateStr}`);

        // 除外日（EXDATE）でも個別上書き（overrideMap）でもない場合のみ追加
        if (!isExcluded && !isOverridden) {
          const currentEnd = new Date(currentStart.getTime() + durationMs);
          result.push(createEventObject(e.title, currentStart, currentEnd, allday, e.desc));
        }
        count++;
      }

      if (freq === "DAILY") {
        currentStart.setDate(currentStart.getDate() + interval);
      } else if (freq === "WEEKLY") {
        if (rruleObj.BYDAY) {
          currentStart.setDate(currentStart.getDate() + 1);
        } else {
          currentStart.setDate(currentStart.getDate() + (7 * interval));
        }
      } else if (freq === "MONTHLY") {
        currentStart.setMonth(currentStart.getMonth() + interval);
      } else {
        break;
      }
    }
  });

  return result;
}

function createEventObject(title, start, end, allday, desc) {
  return {
    id: "sch-g-" + Math.random().toString(36).substr(2, 9),
    title: title || "予定",
    startDate: formatDate(start),
    startTime: allday ? "00:00" : start.toTimeString().substring(0, 5),
    endDate: formatDate(end),
    endTime: allday ? "23:59" : end.toTimeString().substring(0, 5),
    allday,
    desc: desc || "",
    isExternal: true
  };
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
  renderNotes();
  renderReviewPage();
  initDashboardNote();
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
    div.style.cssText = "margin-bottom:0;";

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
        <span style="color:${g.color || "#818cf8"};font-weight:700;font-family:monospace;flex-shrink:0;">Next: ${formatDateDisplay(nextMilestone.duedate)||"未定"}</span>
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
  saveToUndoStack();
  appState.tasks = appState.tasks.filter(t => t.id !== taskId && t.parentTaskId !== taskId);
  saveData();
  renderAll();
}

// ダッシュボード: 今日のタスク
function renderTodayTasks() {
  const el = document.getElementById("dashboard-todo-list");
  if (!el) return;
  el.innerHTML = "";
  // タイムラインに配置済み、またはマイルストーンタスクは除外、さらに重要度＋日付ソート
  const todayTasks = sortTasks(appState.tasks.filter(t => t.status === "today" && !t.isMilestone && !t.assignedTimeSlot));
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

    // ダッシュボードでも重要度(優先度)に応じた不透明度・枠線・背景調整を反映
    let opacityVal = 1.0;
    let bgStyle = "";
    let borderStyle = "border-bottom:1px solid rgba(255,255,255,0.04);";
    if (!isOverdue) {
      if (task.priority === "high") {
        opacityVal = 1.0;
        bgStyle = "background: rgba(255, 255, 255, 0.04);";
        borderStyle = "border-bottom:1px solid rgba(255,255,255,0.12);";
      } else if (task.priority === "low") {
        opacityVal = 0.6;
        bgStyle = "background: rgba(255, 255, 255, 0.01);";
      } else {
        opacityVal = 0.82;
        bgStyle = "background: rgba(255, 255, 255, 0.02);";
      }
    } else {
      bgStyle = "background: rgba(239, 68, 68, 0.04);"; // 期限切れ時はうっすら赤背景で警告
    }

    li.style.cssText = `display:flex;align-items:center;gap:7px;padding:3px 4px;${borderStyle}cursor:grab;user-select:none;opacity:${opacityVal};${bgStyle}`;

    let dateStyle = "background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);color:rgba(255,255,255,0.7);";
    if (isOverdue) {
      dateStyle = "background:rgba(239, 68,68,0.15);border:1px solid rgba(239,68,68,0.4);color:rgba(248,113,113,0.9);font-weight:700;";
    }

    const taskNotes = appState.notes.filter(n => n.taskIds && n.taskIds.includes(task.id));
    let noteIconHTML = "";
    if (taskNotes.length > 0) {
      const targetNoteId = taskNotes[0].id;
      noteIconHTML = `<span class="note-link-icon" style="cursor:pointer; color:var(--accent); font-size:12px; margin-left:4px; padding:2px; display:inline-flex; align-items:center; pointer-events:auto;" title="関連メモを開く" onclick="event.stopPropagation(); event.preventDefault(); viewLinkedNote('${targetNoteId}')">📝</span>`;
    }

    li.innerHTML = `
      ${goalBadgeHTML(goal, goalShort)}
      <span onclick="openEditTaskModal('${task.id}')" style="flex-grow:1;font-size:12.5px;color:${isOverdue ? "rgba(248,113,113,0.9)" : "rgba(255,255,255,0.88)"};overflow:hidden;text-overflow:ellipsis;white-space:nowrap;cursor:pointer;">${task.title}</span>
      ${noteIconHTML}
      ${task.duedate ? `<span style="${dateStyle}font-size:10px;font-family:monospace;padding:1px 5px;border-radius:3px;min-width:62px;text-align:center;flex-shrink:0;margin-right:2px;">${formatDateDisplay(task.duedate)}</span>` : `<span style="background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.05);color:rgba(255,255,255,0.2);font-size:10px;font-family:monospace;padding:1px 5px;border-radius:3px;min-width:62px;text-align:center;flex-shrink:0;margin-right:2px;">-</span>`}
      ${taskQuickBtns(task.id)}
    `;
    li.addEventListener("dragstart", e => {
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.setData("application/x-lifeorbit-task", task.id);
      e.dataTransfer.effectAllowed = "move";
      li.style.opacity = "0.4";
    });
    li.addEventListener("dragend", () => { li.style.opacity = ""; });

    // ドラッグ＆ドロップによるメモ紐付け
    li.addEventListener("dragover", e => {
      if (e.dataTransfer.types.includes("application/x-lifeorbit-note")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "link";
        li.classList.add("drag-over-note");
      }
    });
    li.addEventListener("dragleave", () => {
      li.classList.remove("drag-over-note");
    });
    li.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      li.classList.remove("drag-over-note");
      const dragData = e.dataTransfer.getData("text/plain");
      if (dragData.startsWith("note-id:")) {
        const noteId = dragData.replace("note-id:", "");
        linkNoteToItem(noteId, "task", task.id);
      }
    });

    el.appendChild(li);
  });
}

// ダッシュボード: タイムライン
function renderTimeline() {
  const el = document.getElementById("timeline-today");
  if (!el) return;
  el.innerHTML = "";

  const dateDisplay = document.getElementById("dashboard-date-display");
  const datePicker = document.getElementById("dashboard-date-picker");
  if (dateDisplay) {
    dateDisplay.textContent = formatDateDisplay(appState.currentDate);
  }
  if (datePicker) {
    datePicker.value = formatDate(appState.currentDate);
  }
  
  const todayStr = formatDate(appState.currentDate);
  const scheds = appState.schedules.filter(s => s.startDate === todayStr);
  const now = new Date();
  const nowMin = now.getHours() * 60 + now.getMinutes();
  let freeMinutes = 0;

  // 1. スロット行の描画 (9:00 から 20:30 までの30分刻み、計24スロット)
  const slotHeight = 34; // 各スロットの高さ (px) - 約70%に縮小 (48 * 0.7 = 33.6 -> 34px)
  const minRatio = slotHeight / 30; // 1分あたりの高さ比率
  
  // スクリューバグ対策・絶対配置の親とするためのインナーコンテナを作成
  const inner = document.createElement("div");
  inner.id = "timeline-scroll-inner";
  inner.style.cssText = "position:relative;width:100%;box-sizing:border-box;";
  el.appendChild(inner);
  
  // スロット定義
  const slots = [];
  for (let h = 9; h <= 20; h++) {
    slots.push({ h, m: 0 });
    slots.push({ h, m: 30 });
  }

  // ドロップ対応用のスロット行を作成して配置
  slots.forEach((sObj, idx) => {
    const slot = `${String(sObj.h).padStart(2, "0")}:${String(sObj.m).padStart(2, "0")}`;
    const slotMin = sObj.h * 60 + sObj.m;
    const slotEndMin = slotMin + 30;
    const isCurrentSlot = nowMin >= slotMin && nowMin < slotEndMin;
    const isPastSlot = slotEndMin <= nowMin;

    // このスロットと交差するスケジュールがあるか判定
    const slotScheds = scheds.filter(s => {
      if (s.allday) return false;
      const start = parseTime(s.startTime);
      const end = parseTime(s.endTime);
      return slotMin < end && slotEndMin > start;
    });
    const hasSchedule = slotScheds.length > 0;

    const assignedTasks = appState.tasks.filter(t => t.assignedTimeSlot === slot && t.status === "today");
    const hasOverdueTasks = isPastSlot && assignedTasks.length > 0;

    const row = document.createElement("div");
    row.dataset.slot = slot;

    // 行背景・ボーダー (正時と30分でボーダーの強弱をつける)
    const rowBg = isCurrentSlot ? "rgba(99,210,255,0.06)" : hasOverdueTasks ? "rgba(239,68,68,0.05)" : "transparent";
    const rowBorderTop = isCurrentSlot ? "border-top:2px solid rgba(99,210,255,0.6);" : "";
    const isHourBoundary = sObj.m === 30; // この行の下は次の正時
    const rowBorderBottom = isHourBoundary 
      ? "border-bottom: 1px solid rgba(255,255,255,0.08);" 
      : "border-bottom: 1px dashed rgba(255,255,255,0.03);";

    row.style.cssText = `
      display:flex;
      gap:0;
      min-height:${slotHeight}px;
      box-sizing:border-box;
      ${rowBorderBottom}
      ${rowBorderTop}
      background:${rowBg};
      transition:background 0.15s;
      position:relative;
    `;

    // 時刻ラベルの強弱 (正時は大きく太く、30分は小さく薄く)
    let timeLabelColor, timeLabelSize, timeLabelWeight;
    if (sObj.m === 0) {
      // 正時
      timeLabelColor = isCurrentSlot ? "#63d2ff" : isPastSlot ? "rgba(255,255,255,0.22)" : "rgba(255,255,255,0.55)";
      timeLabelSize = "11px";
      timeLabelWeight = "600";
    } else {
      // 30分
      timeLabelColor = isCurrentSlot ? "#63d2ff" : isPastSlot ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.25)";
      timeLabelSize = "9px";
      timeLabelWeight = "400";
    }

    const nowBadge = isCurrentSlot ? `<div style="font-size:7px;color:#63d2ff;font-weight:800;letter-spacing:0.05em;margin-top:-2px;line-height:1;">NOW</div>` : "";
    const timeLabel = document.createElement("div");
    timeLabel.style.cssText = `
      font-size:${timeLabelSize};
      font-weight:${timeLabelWeight};
      color:${timeLabelColor};
      width:42px;
      flex-shrink:0;
      padding:4px 4px 0 4px;
      text-align:center;
      line-height:1.1;
      box-sizing:border-box;
      border-right:1px solid rgba(255,255,255,0.03);
      display:flex;
      flex-direction:column;
      justify-content:center;
      align-items:center;
    `;
    timeLabel.innerHTML = `<div>${slot}</div>${nowBadge}`;

    // コンテンツ領域
    const contentDiv = document.createElement("div");
    const paddingStyle = assignedTasks.length > 1 ? "padding: 4px 0;" : "padding: 0;";
    contentDiv.style.cssText = `flex-grow:1;min-width:0;display:flex;flex-direction:column;justify-content:center;gap:3px;${paddingStyle}box-sizing:border-box;position:relative;z-index:2;`;

    if (hasSchedule) {
      // スケジュール被り
    } else {
      freeMinutes += 30;
      if (assignedTasks.length) {
        assignedTasks.forEach(t => {
          const g = appState.goals.find(g => g.id === t.goalId);
          const gs = g ? (g.shortName || "?") : null;
          const taskRow = document.createElement("div");
          taskRow.draggable = true;

          const overdueBorder = hasOverdueTasks ? "border-left:3px solid rgba(239,68,68,0.8);" : "border-left:3px solid transparent;";
          const taskBg = hasOverdueTasks ? "background:rgba(239,68,68,0.1);" : "";
          taskRow.style.cssText = `
            display:flex;
            align-items:center;
            gap:6px;
            padding:2px 8px;
            height:20px;
            box-sizing:border-box;
            ${overdueBorder}
            ${taskBg}
          `;

          const titleColor = hasOverdueTasks ? "#fca5a5" : "rgba(255,255,255,0.88)";
          const overdueTag = hasOverdueTasks
            ? `<span style="font-size:8px;font-weight:700;color:#ef4444;background:rgba(239,68,68,0.2);padding:0px 3px;border-radius:2px;flex-shrink:0;">遅延</span>`
            : "";

          const taskNotes = appState.notes.filter(n => n.taskIds && n.taskIds.includes(t.id));
          let noteIconHTML = "";
          if (taskNotes.length > 0) {
            const targetNoteId = taskNotes[0].id;
            noteIconHTML = `<span class="note-link-icon" style="cursor:pointer; color:var(--accent); font-size:10px; margin-left:4px; padding:2px; display:inline-flex; align-items:center; pointer-events:auto;" title="関連メモを開く" onclick="event.stopPropagation(); event.preventDefault(); viewLinkedNote('${targetNoteId}')">📝</span>`;
          }

          taskRow.innerHTML = `
            ${overdueTag}
            ${goalBadgeHTML(g, gs, "small")}
            <span onclick="openEditTaskModal('${t.id}')" style="flex-grow:1;font-size:11px;cursor:pointer;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:${titleColor};">${t.title}</span>
            ${noteIconHTML}
            ${taskQuickBtns(t.id)}
          `;
          taskRow.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text/plain", t.id);
            e.dataTransfer.setData("application/x-lifeorbit-task", t.id);
            e.dataTransfer.effectAllowed = "move";
            taskRow.style.opacity = "0.4";
          });
          taskRow.addEventListener("dragend", () => { taskRow.style.opacity = ""; });

          // ドラッグ＆ドロップによるメモ紐付けおよびタスクのセル間移動のバブリング処理
          taskRow.addEventListener("dragover", e => {
            if (e.dataTransfer.types.includes("application/x-lifeorbit-note")) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "link";
              taskRow.classList.add("drag-over-note");
            } else if (e.dataTransfer.types.includes("application/x-lifeorbit-task")) {
              e.preventDefault();
              e.dataTransfer.dropEffect = "move";
            }
          });
          taskRow.addEventListener("dragleave", () => {
            taskRow.classList.remove("drag-over-note");
          });
          taskRow.addEventListener("drop", e => {
            e.preventDefault();
            e.stopPropagation();
            taskRow.classList.remove("drag-over-note");
            const dragData = e.dataTransfer.getData("text/plain");
            if (dragData.startsWith("note-id:")) {
              const noteId = dragData.replace("note-id:", "");
              linkNoteToItem(noteId, "task", t.id);
            } else if (dragData && !dragData.startsWith("note-id:") && dragData !== "note-today") {
              dropOnTimeline(e, slot);
            }
          });

          contentDiv.appendChild(taskRow);
        });
      } else {
        if (!isPastSlot) {
          contentDiv.innerHTML = `<div style="padding:2px 8px;font-size:9.5px;color:rgba(255,255,255,0.12);font-style:italic;user-select:none;">ここにタスクをドロップ</div>`;
        }
      }
    }

    // ドラッグ＆ドロップイベント設定
    row.addEventListener("dragover", e => {
      if (e.dataTransfer.types.includes("application/x-lifeorbit-task")) {
        e.preventDefault();
        if (hasSchedule) {
          e.dataTransfer.dropEffect = "none";
        } else {
          e.dataTransfer.dropEffect = "move";
          row.style.background = "rgba(100,200,255,0.1)";
        }
      }
    });
    row.addEventListener("dragleave", () => { row.style.background = rowBg; });
    row.addEventListener("drop", e => {
      row.style.background = rowBg;
      if (hasSchedule) return;
      const dragData = e.dataTransfer.getData("text/plain");
      if (!dragData || dragData.startsWith("note-id:") || dragData === "note-today") return;
      dropOnTimeline(e, slot);
    });

    row.appendChild(timeLabel);
    row.appendChild(contentDiv);
    inner.appendChild(row);
  });

  // 2. スケジュールを絶対配置で重ねる (破壊的変更を防ぐためシャローコピーしてローカルプロパティを付与)
  const dayScheds = scheds.filter(s => {
    if (s.allday) return false;
    const start = parseTime(s.startTime);
    const end = parseTime(s.endTime);
    // 9:00 (540分) 〜 21:00 (1260分) の間に重なるスケジュール
    return start < 1260 && end > 540;
  }).map(s => {
    const rawStart = parseTime(s.startTime);
    const rawEnd = parseTime(s.endTime);
    return {
      ...s,
      _startMin: Math.max(540, rawStart),
      _endMin: Math.min(1260, rawEnd)
    };
  });

  dayScheds.sort((a, b) => a._startMin - b._startMin);

  const groups = [];
  dayScheds.forEach(s => {
    let placed = false;
    for (const group of groups) {
      const overlaps = group.some(other => s._startMin < other._endMin && s._endMin > other._startMin);
      if (overlaps) {
        group.push(s);
        placed = true;
        break;
      }
    }
    if (!placed) {
      groups.push([s]);
    }
  });

  groups.forEach(group => {
    const columns = [];
    group.forEach(s => {
      let colIndex = 0;
      while (true) {
        if (!columns[colIndex]) {
          columns[colIndex] = [];
        }
        const hasOverlap = columns[colIndex].some(other => s._startMin < other._endMin && s._endMin > other._startMin);
        if (!hasOverlap) {
          columns[colIndex].push(s);
          s._colIndex = colIndex;
          break;
        }
        colIndex++;
      }
    });
    const totalCols = columns.length;
    group.forEach(s => {
      s._totalCols = totalCols;
    });
  });

  // 累積高さを元に、分座標から正確なY座標を取得するヘルパー関数
  function getTimelineY(min) {
    if (min < 540) return 0;
    if (min > 1260) {
      const lastRow = inner.querySelector('[data-slot="20:30"]');
      return lastRow ? lastRow.offsetTop + lastRow.offsetHeight : 0;
    }
    const slotH = Math.floor(min / 60);
    const slotM = min % 60 >= 30 ? 30 : 0;
    const slotStr = `${String(slotH).padStart(2, "0")}:${String(slotM).padStart(2, "0")}`;
    const row = inner.querySelector(`[data-slot="${slotStr}"]`);
    if (!row) return 0;

    const offsetMin = min - (slotH * 60 + slotM);
    const ratio = offsetMin / 30;
    return row.offsetTop + (row.offsetHeight * ratio);
  }

  // 各予定要素を個別にインナーコンテナに配置（透明な全体overlayを排除することで空き時間のマウスイベントを邪魔しない）
  dayScheds.forEach(s => {
    const topPx = getTimelineY(s._startMin);
    const endPx = getTimelineY(s._endMin);
    const heightPx = endPx - topPx;

    const colWidthPercent = 100 / s._totalCols;
    const leftPercent = s._colIndex * colWidthPercent;

    const eventEl = document.createElement("div");
    const bg = s.isExternal ? "rgba(168,85,247,0.75)" : "rgba(59,130,246,0.75)";
    const border = s.isExternal ? "1px solid rgba(168,85,247,0.9)" : "1px solid rgba(59,130,246,0.9)";

    // leftとwidthの計算式に左側時刻ラベルの幅(42px)のオフセットを正確に組み込む
    eventEl.style.cssText = `
      position:absolute;
      top:${topPx}px;
      left:calc(42px + (100% - 42px) * ${leftPercent / 100} + 2px);
      width:calc((100% - 42px) * ${colWidthPercent / 100} - 4px);
      height:${Math.max(18, heightPx - 2)}px;
      background:${bg};
      border:${border};
      border-radius:4px;
      padding:2px 6px;
      font-size:11px;
      color:#fff;
      overflow:hidden;
      text-overflow:ellipsis;
      cursor:pointer;
      display:flex;
      flex-direction:column;
      line-height:1.2;
      box-sizing:border-box;
      pointer-events:auto;
      z-index:10;
    `;
    
    eventEl.onclick = (e) => {
      e.stopPropagation();
      openEditScheduleModal(s.id);
    };

    const schedNotes = appState.notes.filter(n => n.scheduleIds && n.scheduleIds.includes(s.id));
    let noteIconHTML = "";
    if (schedNotes.length > 0) {
      const targetNoteId = schedNotes[0].id;
      noteIconHTML = `<span class="note-link-icon" style="cursor:pointer; color:var(--accent); font-size:11px; position:absolute; right:6px; top:4px; z-index:15; display:inline-flex; align-items:center; padding:2px; pointer-events:auto;" title="関連メモを開く" onclick="event.stopPropagation(); event.preventDefault(); viewLinkedNote('${targetNoteId}')">📝</span>`;
    }

    eventEl.innerHTML = `
      ${noteIconHTML}
      <div style="font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:16px;">${s.title}</div>
      <div style="font-size:9.5px;color:rgba(255,255,255,0.75);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding-right:16px;">${s.startTime}–${s.endTime}</div>
    `;

    // ドラッグ＆ドロップによるメモ紐付け
    eventEl.addEventListener("dragover", e => {
      if (e.dataTransfer.types.includes("application/x-lifeorbit-note")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "link";
        eventEl.classList.add("drag-over-note");
      }
    });
    eventEl.addEventListener("dragleave", () => {
      eventEl.classList.remove("drag-over-note");
    });
    eventEl.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      eventEl.classList.remove("drag-over-note");
      const dragData = e.dataTransfer.getData("text/plain");
      if (dragData.startsWith("note-id:")) {
        const noteId = dragData.replace("note-id:", "");
        linkNoteToItem(noteId, "schedule", s.id);
      }
    });

    inner.appendChild(eventEl);
  });

  const badge = document.getElementById("free-time-badge");
  if (badge) badge.textContent = `空き時間: 約${Math.round(freeMinutes/60)}時間`;
}


function dragStartTask(event, taskId) {
  event.dataTransfer.setData("text/plain", taskId);
  event.dataTransfer.setData("application/x-lifeorbit-task", taskId);
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
  // 今日の日付表示の更新
  const todayDateEl = document.getElementById("tasks-today-date");
  if (todayDateEl) {
    const today = new Date(parseLocalDate(appState.currentDate).getTime());
    const weekDays = ["日", "月", "火", "水", "木", "金", "土"];
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const dayName = weekDays[today.getDay()];
    todayDateEl.textContent = `${yyyy}/${mm}/${dd} (${dayName})`;
  }

  // 今週の期間表示の更新 (月曜〜日曜)
  const weekRangeEl = document.getElementById("tasks-week-range");
  if (weekRangeEl) {
    const current = new Date(parseLocalDate(appState.currentDate).getTime());
    const day = current.getDay();
    const diff = current.getDate() - day + (day === 0 ? -6 : 1);
    const monday = new Date(current.getTime());
    monday.setDate(diff);
    const sunday = new Date(monday.getTime());
    sunday.setDate(monday.getDate() + 6);

    const formatRangeDate = (d) => {
      return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}`;
    };
    weekRangeEl.textContent = `${formatRangeDate(monday)} 〜 ${formatRangeDate(sunday)}`;
  }

  const colMap = {
    "today": "cards-today",
    "this_week": "cards-this_week",
    "next_week_and_later": "cards-next_week",
    "waiting": "cards-waiting",
    "completed": "cards-completed"
  };
  Object.values(colMap).forEach(id => { const el = document.getElementById(id); if(el) el.innerHTML = ""; });
  const todayStr = formatDate(appState.currentDate);
  // 重要度順 (高➔中➔低) ➔ 期限日順でソートして描画
  sortTasks(appState.tasks).forEach(task => {
    // マイルストーンはカンバンに表示しない（目標ページで管理）
    if (task.isMilestone) return;

    // 目標フィルター
    const filterGoal = appState.kanbanFilterGoal || "all";
    if (filterGoal !== "all") {
      if (filterGoal === "none") {
        if (task.goalId && task.goalId !== "none") return;
      } else {
        if (task.goalId !== filterGoal) return;
      }
    }

    // 優先度フィルター
    const filterPriority = appState.kanbanFilterPriority || "all";
    if (filterPriority !== "all") {
      if (task.priority !== filterPriority) return;
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
    
    // 優先度(重要度)に応じた色の薄さ（不透明度）および枠線のスタイリング
    let opacityVal = 1.0;
    let borderStyle = "";
    let bgStyle = "";
    if (!isOverdue && !isWaitingOverdue) {
      if (task.priority === "high") {
        opacityVal = 1.0;
        borderStyle = "border: 1px solid rgba(255, 255, 255, 0.16);";
        bgStyle = "background: rgba(255, 255, 255, 0.05);";
      } else if (task.priority === "low") {
        opacityVal = 0.6;
        borderStyle = "border: 1px solid rgba(255, 255, 255, 0.03);";
        bgStyle = "background: rgba(255, 255, 255, 0.012);";
      } else {
        opacityVal = 0.82;
        borderStyle = "border: 1px solid rgba(255, 255, 255, 0.08);";
        bgStyle = "background: rgba(255, 255, 255, 0.03);";
      }
    }
    card.style.cssText = `opacity: ${opacityVal}; ${borderStyle} ${bgStyle}`;

    card.draggable = true;
    card.dataset.taskId = task.id;
    card.addEventListener("dragstart", e => {
      card.classList.add("dragging");
      e.dataTransfer.setData("text/plain", task.id);
      e.dataTransfer.setData("application/x-lifeorbit-task", task.id);
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
    });

    // ドラッグ＆ドロップによるメモ紐付け
    card.addEventListener("dragover", e => {
      if (e.dataTransfer.types.includes("application/x-lifeorbit-note")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "link";
        card.classList.add("drag-over-note");
      }
    });
    card.addEventListener("dragleave", () => {
      card.classList.remove("drag-over-note");
    });
    card.addEventListener("drop", e => {
      e.preventDefault();
      e.stopPropagation();
      card.classList.remove("drag-over-note");
      const dragData = e.dataTransfer.getData("text/plain");
      if (dragData.startsWith("note-id:")) {
        const noteId = dragData.replace("note-id:", "");
        linkNoteToItem(noteId, "task", task.id);
      }
    });

    const taskNotes = appState.notes.filter(n => n.taskIds && n.taskIds.includes(task.id));
    let noteIconHTML = "";
    if (taskNotes.length > 0) {
      const targetNoteId = taskNotes[0].id;
      noteIconHTML = `<span class="note-link-icon" style="cursor:pointer; color:var(--accent); font-size:11px; display:inline-flex; align-items:center; padding:2px; pointer-events:auto;" title="関連メモを開く" onclick="event.stopPropagation(); viewLinkedNote('${targetNoteId}')">📝</span>`;
    }

    card.addEventListener("click", () => openEditTaskModal(task.id));
    card.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
        <div style="font-size:13px;font-weight:500;margin-bottom:6px;${titleColor ? `color:${titleColor};` : ""}">${task.title} ${noteIconHTML}</div>
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
  // ドロップイベントは setupEventListeners() に移動したためここでは登録しない
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
      cell.style.cssText = "border:1px solid rgba(255,255,255,0.05);padding:4px;min-height:80px;vertical-align:top;position:relative;";
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
      addNoteIndicatorToCalendarCell(dateStr, cell);
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
    dayCell.style.cssText = "display:flex;flex-direction:column;align-items:center;padding:4px;gap:2px;flex-grow:1;min-width:0;position:relative;";
    dayCell.innerHTML = `
      <span style="font-size:10px;color:rgba(255,255,255,0.4);">${dayNames[i]}</span>
      <span style="font-size:14px;font-weight:700;color:${isToday?"var(--accent)":"rgba(255,255,255,0.85)"};">${curDate.getDate()}</span>
    `;
    addNoteIndicatorToCalendarCell(dateStr, dayCell);
    header.appendChild(dayCell);
  }

  // 3. 24時間の時間軸ラベルの描画 (グリッド線と一致させるため、各マスの「上端」を基準に配置)
  for (let h = 0; h < 24; h++) {
    const timeLabel = document.createElement("div");
    timeLabel.className = "time-axis-hour";
    timeLabel.style.cssText = `
      height: 60px;
      display: flex;
      align-items: flex-start;
      justify-content: flex-end;
      padding-right: 12px;
      padding-top: 0;
      box-sizing: border-box;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.45);
      transform: translateY(-7px);
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

    // その日のスケジュール（非終日）
    const dayScheds = appState.schedules.filter(s => s.startDate === dateStr && !s.allday);
    
    // 1. 開始時刻と終了時刻をあらかじめ数値(分単位)にパースしてソート
    dayScheds.forEach(s => {
      s._startMin = parseTime(s.startTime);
      s._endMin = parseTime(s.endTime);
    });
    dayScheds.sort((a, b) => a._startMin - b._startMin);

    // 2. 重複（衝突）する予定をグループ化
    const groups = [];
    dayScheds.forEach(s => {
      let placed = false;
      for (const group of groups) {
        const overlaps = group.some(other => s._startMin < other._endMin && s._endMin > other._startMin);
        if (overlaps) {
          group.push(s);
          placed = true;
          break;
        }
      }
      if (!placed) {
        groups.push([s]);
      }
    });

    // 3. 各グループ内でカラム（列）を順番に割り当てる (Googleカレンダー風配置)
    groups.forEach(group => {
      const columns = [];
      group.forEach(s => {
        let colIndex = 0;
        while (true) {
          if (!columns[colIndex]) {
            columns[colIndex] = [];
          }
          const hasOverlap = columns[colIndex].some(other => s._startMin < other._endMin && s._endMin > other._startMin);
          if (!hasOverlap) {
            columns[colIndex].push(s);
            s._colIndex = colIndex;
            break;
          }
          colIndex++;
        }
      });
      const totalCols = columns.length;
      group.forEach(s => {
        s._totalCols = totalCols;
      });
    });

    // 4. 重複幅を考慮してHTML要素を配置
    dayScheds.forEach(s => {
      const duration = s._endMin - s._startMin;
      const topPx = (s._startMin / 60) * 60; 
      const heightPx = (duration / 60) * 60;

      const colWidthPercent = 100 / s._totalCols;
      const leftPercent = s._colIndex * colWidthPercent;

      const eventEl = document.createElement("div");
      const bg = s.isExternal ? "rgba(168,85,247,0.22)" : "rgba(59,130,246,0.22)";
      const border = s.isExternal ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(59,130,246,0.5)";
      const indicator = s.isExternal ? "#a855f7" : "#3b82f6";
      
      eventEl.style.cssText = `
        position:absolute;
        top:${topPx}px;
        left:calc(${leftPercent}% + 1px);
        width:calc(${colWidthPercent}% - 2px);
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
  
  // renderAllの代わりに、カンバンの更新に必要な最小限の描画を実行して劇的に軽量化
  calcGoalProgress();
  renderDashboardGoals();
  renderTodayTasks();
  renderTimeline();
  renderKanban();
  updateGoalDropdowns();
  updateSyncDisplay();
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
  document.getElementById("task-duedate").value = isEdit ? (task.duedate || "") : formatDate(appState.currentDate);
  // 関連メモ (Notes) の表示
  const relatedNotesSection = document.getElementById("task-related-notes-section");
  const relatedNotesList = document.getElementById("task-related-notes-list");
  const quickNoteInput = document.getElementById("task-quick-note-input");
  const addQuickNoteBtn = document.getElementById("btn-task-add-quick-note");
  
  if (quickNoteInput) quickNoteInput.value = "";
  
  function renderTaskNotes() {
    if (!relatedNotesList) return;
    const relatedNotes = appState.notes.filter(n => n.taskIds && n.taskIds.includes(task.id));
    relatedNotesList.innerHTML = "";
    if (relatedNotes.length === 0) {
      relatedNotesList.innerHTML = `<span style="color:rgba(255,255,255,0.22); font-style:italic;">紐づくメモはありません</span>`;
    } else {
      relatedNotes.forEach(note => {
        const item = document.createElement("div");
        item.style.cssText = "padding:6px 8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:4px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;";
        const firstLine = note.content.trim().split("\n")[0] || "無題のメモ";
        item.innerHTML = `
          <span style="font-weight:600; flex-grow:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-right:8px;">📝 [${formatDateDisplay(note.date)}] ${firstLine}</span>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            <span class="btn-view" style="color:var(--accent); font-size:10px; font-weight:600; cursor:pointer;">表示</span>
            <span class="btn-unlink" style="color:rgba(255,255,255,0.3); font-size:12px; font-weight:700; padding:0 4px; cursor:pointer;" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='rgba(255,255,255,0.3)'" title="紐づけ解除">×</span>
          </div>
        `;
        item.querySelector(".btn-view").addEventListener("click", e => {
          e.stopPropagation();
          closeAllModals();
          switchView("notes");
          selectNote(note.id);
        });
        item.querySelector(".btn-unlink").addEventListener("click", e => {
          e.stopPropagation();
          removeNoteRelation(note.id, "task", task.id);
          renderTaskNotes();
        });
        item.addEventListener("click", () => {
          closeAllModals();
          switchView("notes");
          selectNote(note.id);
        });
        relatedNotesList.appendChild(item);
      });
    }
  }

  if (relatedNotesSection) {
    if (isEdit) {
      relatedNotesSection.style.display = "block";
      renderTaskNotes();
      
      if (addQuickNoteBtn) {
        // Remove previous event listener to avoid duplicates
        const newAddBtn = addQuickNoteBtn.cloneNode(true);
        addQuickNoteBtn.parentNode.replaceChild(newAddBtn, addQuickNoteBtn);
        newAddBtn.addEventListener("click", () => {
          const content = quickNoteInput.value.trim();
          if (!content) return;
          const tStr = formatDate(appState.currentDate);
          const newNote = {
            id: "note-" + Math.random().toString(36).substr(2, 9),
            date: tStr,
            content,
            taskIds: [task.id],
            scheduleIds: [],
            dashboardArchived: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          appState.notes.push(newNote);
          quickNoteInput.value = "";
          saveData();
          renderTaskNotes();
          renderDashboardStickyNotes();
          renderCalendar();
        });
      }
    } else {
      relatedNotesSection.style.display = "none";
    }
  }

  openModal("modal-task-form");
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

  saveToUndoStack();

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
  if (!id) return;
  saveToUndoStack();
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

  const relatedNotesSection = document.getElementById("schedule-related-notes-section");
  if (relatedNotesSection) relatedNotesSection.style.display = "none";

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

  const relatedNotesSection = document.getElementById("schedule-related-notes-section");
  const relatedNotesList = document.getElementById("schedule-related-notes-list");
  const quickNoteInput = document.getElementById("schedule-quick-note-input");
  const addQuickNoteBtn = document.getElementById("btn-schedule-add-quick-note");
  
  if (quickNoteInput) quickNoteInput.value = "";

  function renderScheduleNotes() {
    if (!relatedNotesList) return;
    const relatedNotes = appState.notes.filter(n => n.scheduleIds && n.scheduleIds.includes(s.id));
    relatedNotesList.innerHTML = "";
    if (relatedNotes.length === 0) {
      relatedNotesList.innerHTML = `<span style="color:rgba(255,255,255,0.22); font-style:italic;">紐づくメモはありません</span>`;
    } else {
      relatedNotes.forEach(note => {
        const item = document.createElement("div");
        item.style.cssText = "padding:6px 8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.05); border-radius:4px; display:flex; justify-content:space-between; align-items:center; cursor:pointer;";
        const firstLine = note.content.trim().split("\n")[0] || "無題のメモ";
        item.innerHTML = `
          <span style="font-weight:600; flex-grow:1; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; padding-right:8px;">📝 [${formatDateDisplay(note.date)}] ${firstLine}</span>
          <div style="display:flex; align-items:center; gap:8px; flex-shrink:0;">
            <span class="btn-view" style="color:var(--accent); font-size:10px; font-weight:600; cursor:pointer;">表示</span>
            <span class="btn-unlink" style="color:rgba(255,255,255,0.3); font-size:12px; font-weight:700; padding:0 4px; cursor:pointer;" onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='rgba(255,255,255,0.3)'" title="紐づけ解除">×</span>
          </div>
        `;
        item.querySelector(".btn-view").addEventListener("click", e => {
          e.stopPropagation();
          closeAllModals();
          switchView("notes");
          selectNote(note.id);
        });
        item.querySelector(".btn-unlink").addEventListener("click", e => {
          e.stopPropagation();
          removeNoteRelation(note.id, "schedule", s.id);
          renderScheduleNotes();
        });
        item.addEventListener("click", () => {
          closeAllModals();
          switchView("notes");
          selectNote(note.id);
        });
        relatedNotesList.appendChild(item);
      });
    }
  }

  if (relatedNotesSection) {
    relatedNotesSection.style.display = "block";
    renderScheduleNotes();
    
    if (addQuickNoteBtn) {
      const newAddBtn = addQuickNoteBtn.cloneNode(true);
      addQuickNoteBtn.parentNode.replaceChild(newAddBtn, addQuickNoteBtn);
      newAddBtn.addEventListener("click", () => {
        const content = quickNoteInput.value.trim();
        if (!content) return;
        const tStr = formatDate(appState.currentDate);
        const newNote = {
          id: "note-" + Math.random().toString(36).substr(2, 9),
          date: tStr,
          content,
          taskIds: [],
          scheduleIds: [s.id],
          dashboardArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        appState.notes.push(newNote);
        quickNoteInput.value = "";
        saveData();
        renderScheduleNotes();
        renderDashboardStickyNotes();
        renderCalendar();
      });
    }
  }

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

  saveToUndoStack();

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
  if (!id) return;
  saveToUndoStack();
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
  const json = JSON.stringify({
    goals: appState.goals,
    tasks: appState.tasks,
    schedules: appState.schedules,
    notes: appState.notes
  }, null, 2);
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
      appState.notes = data.notes || [];
      saveData();
      renderAll();
      alert("データをインポートしました。");
    } catch(err) {
      alert("インポートに失敗しました。JSONファイルを確認してください。");
    }
  };
  reader.readAsText(file);
}

function importDataFromText() {
  const text = prompt("コピーしたJSONテキストをここに貼り付けてください（Ctrl+V または長押しでペースト）:");
  if (text === null) return;
  const trimmed = text.trim();
  if (!trimmed) {
    alert("テキストが入力されていません。");
    return;
  }
  try {
    const data = JSON.parse(trimmed);
    if (data.goals) appState.goals = data.goals;
    if (data.tasks) appState.tasks = data.tasks;
    if (data.schedules) appState.schedules = data.schedules;
    appState.notes = data.notes || [];
    saveData();
    renderAll();
    alert("データをインポートしました。");
  } catch(err) {
    alert("インポートに失敗しました。JSONテキストが正しい形式か確認してください。");
  }
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
  } else if (viewName === "notes") {
    renderNotes();
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
  const titles = { dashboard: "ダッシュボード", goals: "目標 (Goals)", tasks: "タスク (Tasks)", calendar: "カレンダー", review: "レビュー", notes: "メモ (Notes)", settings: "設定・バックアップ" };
  const subs = { dashboard: "今日の軌道と目標の進捗状況", goals: "大目標とマイルストーンの管理", tasks: "タスクのカンバン管理", calendar: "スケジュールとカレンダー連携", review: "活動実績の振り返りと未完了タスクの棚卸し", notes: "日々のログや気づきの書き散らしと管理", settings: "データの管理とバックアップ" };
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
  // ダッシュボード日付切り替え
  const prevBtn = document.getElementById("btn-dashboard-prev-day");
  const nextBtn = document.getElementById("btn-dashboard-next-day");
  const todayBtn = document.getElementById("btn-dashboard-today");
  const datePicker = document.getElementById("dashboard-date-picker");

  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      const cur = new Date(appState.currentDate);
      cur.setDate(cur.getDate() - 1);
      appState.currentDate = cur;
      saveData();
      renderAll();
    });
  }
  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      const cur = new Date(appState.currentDate);
      cur.setDate(cur.getDate() + 1);
      appState.currentDate = cur;
      saveData();
      renderAll();
    });
  }
  if (todayBtn) {
    todayBtn.addEventListener("click", () => {
      appState.currentDate = new Date();
      saveData();
      renderAll();
    });
  }
  if (datePicker) {
    datePicker.addEventListener("change", (e) => {
      if (e.target.value) {
        appState.currentDate = new Date(e.target.value);
        saveData();
        renderAll();
      }
    });
  }

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
      if (e.dataTransfer.types.includes("application/x-lifeorbit-task")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        todoListEl.style.background = "rgba(255,255,255,0.03)";
      }
    });
    todoListEl.addEventListener("dragleave", () => {
      todoListEl.style.background = "";
    });
    todoListEl.addEventListener("drop", e => {
      e.preventDefault();
      todoListEl.style.background = "";
      const dragData = e.dataTransfer.getData("text/plain");
      if (!dragData || dragData.startsWith("note-id:") || dragData === "note-today") return;
      const task = appState.tasks.find(t => t.id === dragData);
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
      performUndo();
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

  // カンバンのドラッグ&ドロップイベント登録（重複登録防止のため初期化時に1回のみ実行）
  const kanbanColMap = {
    "today": "cards-today",
    "this_week": "cards-this_week",
    "next_week_and_later": "cards-next_week",
    "waiting": "cards-waiting",
    "completed": "cards-completed"
  };
  Object.entries(kanbanColMap).forEach(([status, colId]) => {
    const colEl = document.getElementById(colId);
    if (!colEl) return;
    colEl.addEventListener("dragover", e => {
      if (e.dataTransfer.types.includes("application/x-lifeorbit-task")) {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
      }
    });
    colEl.addEventListener("dragenter", e => {
      if (e.dataTransfer.types.includes("application/x-lifeorbit-task")) {
        colEl.classList.add("drag-over");
      }
    });
    colEl.addEventListener("dragleave", () => {
      colEl.classList.remove("drag-over");
    });
    colEl.addEventListener("drop", e => {
      e.preventDefault();
      colEl.classList.remove("drag-over");
      const dragData = e.dataTransfer.getData("text/plain");
      if (!dragData || dragData.startsWith("note-id:") || dragData === "note-today") return;
      updateTaskStatus(dragData, status);
    });
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
  const btnImportText = document.getElementById("btn-import-text-trigger");
  if (btnImportText) btnImportText.addEventListener("click", importDataFromText);
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

  saveToUndoStack();

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
  if (!id) return;

  saveToUndoStack();

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

  // 期間中に残したメモを一覧描画
  renderWeeklyNotesForReview(startStr, endStr);
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

  saveToUndoStack();

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
  saveToUndoStack();
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

  if (appState.reviewMode === "daily") {
    const tomorrow = new Date(cur.getFullYear(), cur.getMonth(), cur.getDate() + 1);
    newDuedateStr = formatDate(tomorrow);
    newStatus = "this_week";
  } else {
    const day = cur.getDay();
    const diffToMonday = cur.getDate() - day + (day === 0 ? -6 : 1);
    const nextMonday = new Date(cur.getFullYear(), cur.getMonth(), diffToMonday + 7);
    newDuedateStr = formatDate(nextMonday);
    newStatus = "next_week_and_later";
  }

  saveToUndoStack();

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

  saveToUndoStack();
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

      if (shouldUpdate && (data.goals || data.tasks || data.schedules || data.notes)) {
        appState.goals = data.goals || [];
        appState.tasks = data.tasks || [];
        appState.schedules = data.schedules || [];
        appState.notes = data.notes || [];
        appState.lastSyncTime = data.lastSyncTime || null;
        
        localStorage.setItem("lifeorbit_data", JSON.stringify(data));
        renderAll();
        console.log("Firestore data synchronized in real-time.");
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
    notes: appState.notes,
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

  if (confirm("【警告】現在画面上に表示されているローカルのデータ（目標・タスク・スケジュール・メモ）で、この合言葉のオンラインデータベースを完全に上書きデプロイします。よろしいですか？")) {
    appState.lastSyncTime = new Date().toISOString();
    
    localStorage.setItem("lifeorbit_data", JSON.stringify({
      goals: appState.goals,
      tasks: appState.tasks,
      schedules: appState.schedules,
      notes: appState.notes,
      lastSyncTime: appState.lastSyncTime
    }));

    firebase.firestore().collection("orbits").doc(syncKey).set({
      goals: appState.goals,
      tasks: appState.tasks,
      schedules: appState.schedules,
      notes: appState.notes,
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
window.resetToDefault = resetToDefault;
window.dragStartTask = dragStartTask;
window.quickDeleteTask = quickDeleteTask;
window.performUndo = performUndo;
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

// ==========================================================================
// NOTES CORE LOGIC
// ==========================================================================

let currentRelationType = null; // 'task' or 'schedule'
let pendingRelations = { taskIds: [], scheduleIds: [] };

function initNotesView() {
  const searchInput = document.getElementById("notes-search-input");
  if (searchInput) {
    searchInput.addEventListener("input", renderNotes);
  }

  const btnNewNote = document.getElementById("btn-new-note");
  if (btnNewNote) {
    btnNewNote.addEventListener("click", createNewNote);
  }

  const btnSaveNote = document.getElementById("btn-save-note");
  if (btnSaveNote) {
    btnSaveNote.addEventListener("click", saveActiveNote);
  }

  const btnDeleteNote = document.getElementById("btn-delete-note");
  if (btnDeleteNote) {
    btnDeleteNote.addEventListener("click", deleteActiveNote);
  }

  const btnRelateTask = document.getElementById("btn-relate-task");
  if (btnRelateTask) {
    btnRelateTask.addEventListener("click", () => openRelationModal("task"));
  }

  const btnRelateSchedule = document.getElementById("btn-relate-schedule");
  if (btnRelateSchedule) {
    btnRelateSchedule.addEventListener("click", () => openRelationModal("schedule"));
  }

  const btnCloseRelation = document.getElementById("btn-close-relation");
  if (btnCloseRelation) {
    btnCloseRelation.addEventListener("click", closeRelationModal);
  }
  const btnCancelRelation = document.getElementById("btn-cancel-relation");
  if (btnCancelRelation) {
    btnCancelRelation.addEventListener("click", closeRelationModal);
  }

  const btnConfirmRelation = document.getElementById("btn-confirm-relation");
  if (btnConfirmRelation) {
    btnConfirmRelation.addEventListener("click", confirmRelationSelection);
  }

  // 初期状態で今日の日付をセット
  const dateInput = document.getElementById("note-date");
  if (dateInput && !dateInput.value) {
    dateInput.value = formatDate(appState.currentDate);
  }
}

function renderNotes() {
  const container = document.getElementById("notes-list-container");
  if (!container) return;
  container.innerHTML = "";

  const query = (document.getElementById("notes-search-input")?.value || "").toLowerCase().trim();

  // 検索クエリで絞り込み
  const filteredNotes = appState.notes.filter(note => {
    if (!query) return true;
    
    // 日付・本文検索
    if (note.date.includes(query) || note.content.toLowerCase().includes(query)) return true;

    // 関連タスクのタイトルで検索
    const matchTask = note.taskIds?.some(tid => {
      const t = appState.tasks.find(tk => tk.id === tid);
      return t && t.title.toLowerCase().includes(query);
    });
    if (matchTask) return true;

    // 関連予定のタイトルで検索
    const matchSch = note.scheduleIds?.some(sid => {
      const s = appState.schedules.find(sc => sc.id === sid);
      return s && s.title.toLowerCase().includes(query);
    });
    if (matchSch) return true;

    return false;
  });

  // 日付の降順でソート
  filteredNotes.sort((a, b) => b.date.localeCompare(a.date));

  if (filteredNotes.length === 0) {
    container.innerHTML = `<div style="padding:16px;text-align:center;font-size:11.5px;color:rgba(255,255,255,0.25);font-style:italic;">メモが見つかりません</div>`;
    return;
  }

  filteredNotes.forEach(note => {
    const lines = note.content.trim().split("\n");
    const title = lines[0] || "無題のメモ";
    const preview = lines.slice(1).join(" ") || "本文なし";
    
    const item = document.createElement("div");
    item.className = `note-item ${activeNoteId === note.id ? "active" : ""}`;
    item.addEventListener("click", () => selectNote(note.id));

    const totalRelations = (note.taskIds?.length || 0) + (note.scheduleIds?.length || 0);
    const badgeHTML = totalRelations > 0 ? `<div class="note-item-badges"><i data-lucide="link-2" style="width:11px;height:11px;"></i> <span style="font-size:9.5px;font-weight:600;">${totalRelations}</span></div>` : "";

    item.innerHTML = `
      <div class="note-item-header">
        <span class="note-item-date">${formatDateDisplay(note.date)}</span>
        ${badgeHTML}
      </div>
      <div class="note-item-title">${title}</div>
      <div class="note-item-preview">${preview}</div>
    `;
    container.appendChild(item);
  });

  // Lucideアイコンの再描画
  if (window.lucide) lucide.createIcons();
}

function selectNote(noteId) {
  activeNoteId = noteId;
  const note = appState.notes.find(n => n.id === noteId);
  if (!note) return;

  const dateInput = document.getElementById("note-date");
  const textarea = document.getElementById("note-textarea");
  const hiddenId = document.getElementById("note-id");

  if (dateInput) dateInput.value = note.date;
  if (textarea) textarea.value = note.content;
  if (hiddenId) hiddenId.value = note.id;

  pendingRelations.taskIds = [...(note.taskIds || [])];
  pendingRelations.scheduleIds = [...(note.scheduleIds || [])];

  renderRelations();
  renderNotes(); // リスト側のアクティブ状態表示の更新
}

function createNewNote() {
  activeNoteId = "new-" + Math.random().toString(36).substr(2, 9);
  
  const dateInput = document.getElementById("note-date");
  const textarea = document.getElementById("note-textarea");
  const hiddenId = document.getElementById("note-id");

  if (dateInput) dateInput.value = formatDate(appState.currentDate);
  if (textarea) {
    textarea.value = "";
    textarea.focus();
  }
  if (hiddenId) hiddenId.value = activeNoteId;

  pendingRelations.taskIds = [];
  pendingRelations.scheduleIds = [];

  renderRelations();
  renderNotes();
}

function saveActiveNote() {
  const dateInput = document.getElementById("note-date");
  const textarea = document.getElementById("note-textarea");
  const hiddenId = document.getElementById("note-id");

  if (!textarea || !textarea.value.trim()) {
    alert("メモ本文を入力してください。");
    return;
  }
  if (!dateInput || !dateInput.value) {
    alert("日付を入力してください。");
    return;
  }

  const id = hiddenId?.value || activeNoteId || ("note-" + Math.random().toString(36).substr(2, 9));
  const date = dateInput.value;
  const content = textarea.value;

  saveToUndoStack();

  let note = appState.notes.find(n => n.id === id);
  if (note) {
    note.date = date;
    note.content = content;
    note.taskIds = [...pendingRelations.taskIds];
    note.scheduleIds = [...pendingRelations.scheduleIds];
    note.updatedAt = new Date().toISOString();
    if (note.dashboardArchived === undefined) note.dashboardArchived = false;
  } else {
    note = {
      id: id.startsWith("new-") ? "note-" + id.substring(4) : id,
      date,
      content,
      taskIds: [...pendingRelations.taskIds],
      scheduleIds: [...pendingRelations.scheduleIds],
      dashboardArchived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    appState.notes.push(note);
    activeNoteId = note.id;
    if (hiddenId) hiddenId.value = note.id;
  }

  saveData();
  renderNotes();

  renderCalendar();
  renderReviewPage();
  if (typeof renderDashboardStickyNotes === "function") renderDashboardStickyNotes();
}

function deleteActiveNote() {
  const id = document.getElementById("note-id")?.value || activeNoteId;
  if (!id || id.startsWith("new-")) {
    createNewNote();
    return;
  }

  saveToUndoStack();

  appState.notes = appState.notes.filter(n => n.id !== id);
  saveData();
  
  activeNoteId = null;
  createNewNote();
  
  renderCalendar();
  renderReviewPage();
}

function renderRelations() {
  const container = document.getElementById("note-relations-list");
  if (!container) return;
  container.innerHTML = "";

  // 関連タスクの描画
  pendingRelations.taskIds.forEach(tid => {
    const task = appState.tasks.find(t => t.id === tid);
    if (!task) return;

    const badge = document.createElement("div");
    badge.className = "relation-badge task";
    badge.innerHTML = `
      <span onclick="openEditTaskModal('${task.id}')">📋 ${task.title}</span>
      <button class="remove-btn" onclick="removeRelation('task', '${task.id}')">&times;</button>
    `;
    container.appendChild(badge);
  });

  // 関連スケジュールの描画
  pendingRelations.scheduleIds.forEach(sid => {
    const sch = appState.schedules.find(s => s.id === sid);
    if (!sch) return;

    const badge = document.createElement("div");
    badge.className = "relation-badge schedule";
    badge.innerHTML = `
      <span onclick="openEditScheduleModal('${sch.id}')">📅 [${sch.startTime}] ${sch.title}</span>
      <button class="remove-btn" onclick="removeRelation('schedule', '${sch.id}')">&times;</button>
    `;
    container.appendChild(badge);
  });

  if (pendingRelations.taskIds.length === 0 && pendingRelations.scheduleIds.length === 0) {
    container.innerHTML = `<span style="font-size:11px;color:rgba(255,255,255,0.22);font-style:italic;">紐づく項目はありません</span>`;
  }
}

function removeRelation(type, id) {
  if (type === "task") {
    pendingRelations.taskIds = pendingRelations.taskIds.filter(tid => tid !== id);
  } else {
    pendingRelations.scheduleIds = pendingRelations.scheduleIds.filter(sid => sid !== id);
  }
  renderRelations();
}

function openRelationModal(type) {
  currentRelationType = type;
  const overlay = document.getElementById("modal-note-relation");
  const title = document.getElementById("relation-modal-title");
  const listContainer = document.getElementById("relation-items-list");

  if (!overlay || !listContainer) return;

  listContainer.innerHTML = "";
  overlay.style.display = "flex";

  if (type === "task") {
    if (title) title.textContent = "紐づけるタスクの選択";
    
    // カンバンに表示されているタスクを表示
    const activeTasks = appState.tasks.filter(t => !t.isMilestone);
    
    if (activeTasks.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center;font-size:12px;color:rgba(255,255,255,0.3);padding:10px;">選択可能なタスクがありません</div>`;
      return;
    }

    activeTasks.forEach(task => {
      const isChecked = pendingRelations.taskIds.includes(task.id) ? "checked" : "";
      const item = document.createElement("label");
      item.className = "relation-select-item";
      item.innerHTML = `
        <input type="checkbox" name="relation-task-chk" value="${task.id}" ${isChecked}>
        <span class="relation-select-item-text">[${task.status === 'completed' ? '完了' : '未完了'}] ${task.title}</span>
      `;
      listContainer.appendChild(item);
    });
  } else {
    if (title) title.textContent = "紐づける予定（スケジュール）の選択";
    
    // スケジュール一覧をソートして表示
    const sortedSchs = [...appState.schedules].sort((a, b) => b.startDate.localeCompare(a.startDate) || a.startTime.localeCompare(b.startTime));
    
    if (sortedSchs.length === 0) {
      listContainer.innerHTML = `<div style="text-align:center;font-size:12px;color:rgba(255,255,255,0.3);padding:10px;">選択可能な予定がありません</div>`;
      return;
    }

    sortedSchs.forEach(sch => {
      const isChecked = pendingRelations.scheduleIds.includes(sch.id) ? "checked" : "";
      const item = document.createElement("label");
      item.className = "relation-select-item";
      item.innerHTML = `
        <input type="checkbox" name="relation-sch-chk" value="${sch.id}" ${isChecked}>
        <span class="relation-select-item-text">${formatDateDisplay(sch.startDate)} [${sch.startTime}] ${sch.title}</span>
      `;
      listContainer.appendChild(item);
    });
  }
  
  if (window.lucide) lucide.createIcons();
}

function closeRelationModal() {
  const overlay = document.getElementById("modal-note-relation");
  if (overlay) overlay.style.display = "none";
}

function confirmRelationSelection() {
  if (currentRelationType === "task") {
    const chks = document.querySelectorAll('input[name="relation-task-chk"]:checked');
    pendingRelations.taskIds = Array.from(chks).map(el => el.value);
  } else {
    const chks = document.querySelectorAll('input[name="relation-sch-chk"]:checked');
    pendingRelations.scheduleIds = Array.from(chks).map(el => el.value);
  }

  renderRelations();
  closeRelationModal();
}

// カレンダーの特定日付セルにメモアイコンを追加するヘルパー
function addNoteIndicatorToCalendarCell(dayStr, cellEl) {
  const hasNote = appState.notes.some(n => n.date === dayStr && n.content.trim());
  if (!hasNote) return;

  const indicator = document.createElement("div");
  indicator.className = "calendar-note-indicator";
  indicator.innerHTML = `
    <svg viewBox="0 0 24 24" width="11" height="11" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M12 20h9"></path>
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"></path>
    </svg>
  `;
  
  const note = appState.notes.find(n => n.date === dayStr);
  const firstLine = note.content.trim().split("\n")[0] || "メモあり";
  
  const tooltip = document.createElement("div");
  tooltip.className = "note-tooltip";
  tooltip.innerHTML = `
    <div class="note-tooltip-date">${formatDateDisplay(dayStr)}</div>
    <div class="note-tooltip-body">${firstLine}</div>
  `;

  indicator.addEventListener("click", (e) => {
    e.stopPropagation();
    switchView("notes");
    selectNote(note.id);
  });

  cellEl.appendChild(indicator);
  cellEl.appendChild(tooltip);
}

// レビュー画面用の週次メモ描画処理
function renderWeeklyNotesForReview(startDateStr, endDateStr) {
  const container = document.getElementById("review-weekly-notes-container");
  if (!container) return;
  container.innerHTML = "";

  const weeklyNotes = appState.notes.filter(n => n.date >= startDateStr && n.date <= endDateStr && n.content.trim());
  weeklyNotes.sort((a, b) => a.date.localeCompare(b.date));

  if (weeklyNotes.length === 0) {
    container.innerHTML = `<div style="text-align:center;font-size:12px;color:rgba(255,255,255,0.22);font-style:italic;padding:24px 0;">この期間中に書かれたメモはありません</div>`;
    return;
  }

  const list = document.createElement("div");
  list.className = "review-notes-list";

  weeklyNotes.forEach(note => {
    const lines = note.content.trim().split("\n");
    const title = lines[0] || "無題のメモ";
    const preview = lines.slice(1).join(" ") || "本文なし";

    const card = document.createElement("div");
    card.className = "review-note-card";
    card.style.cursor = "pointer";
    card.addEventListener("click", () => {
      switchView("notes");
      selectNote(note.id);
    });

    card.innerHTML = `
      <div class="review-note-header">${formatDateDisplay(note.date)}</div>
      <div class="review-note-title">${title}</div>
      <div class="review-note-preview">${preview}</div>
    `;
    list.appendChild(card);
  });

  container.appendChild(list);
}

window.selectNote = selectNote;
window.createNewNote = createNewNote;
window.saveActiveNote = saveActiveNote;
window.deleteActiveNote = deleteActiveNote;
window.removeRelation = removeRelation;
window.openRelationModal = openRelationModal;
window.closeRelationModal = closeRelationModal;
window.confirmRelationSelection = confirmRelationSelection;
window.addNoteIndicatorToCalendarCell = addNoteIndicatorToCalendarCell;
window.renderWeeklyNotesForReview = renderWeeklyNotesForReview;

function renderDashboardStickyNotes() {
  const container = document.getElementById("dashboard-notes-list");
  if (!container) return;

  const todayStr = formatDate(appState.currentDate);
  const todayNotes = appState.notes
    .filter(n => n.date === todayStr && !n.dashboardArchived)
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));

  container.innerHTML = "";

  if (todayNotes.length === 0) {
    container.innerHTML = `<div style="text-align:center; color:rgba(255,255,255,0.2); font-size:12px; font-style:italic; padding:24px 0;">メモはまだありません</div>`;
    return;
  }

  todayNotes.forEach(note => {
    const card = document.createElement("div");
    card.className = "dashboard-sticky-note";
    card.draggable = true;
    card.dataset.noteId = note.id;

    const firstLine = note.content.trim().split("\n")[0] || "";
    const rest = note.content.trim().split("\n").slice(1).join("\n");
    const timeStr = note.createdAt ? new Date(note.createdAt).toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" }) : "";

    const linkedTasks = (note.taskIds || [])
      .map(id => appState.tasks.find(t => t.id === id))
      .filter(Boolean);
    const linkedSchedules = (note.scheduleIds || [])
      .map(id => appState.schedules.find(s => s.id === id))
      .filter(Boolean);

    let linkBadge = "";
    if (linkedTasks.length > 0 || linkedSchedules.length > 0) {
      linkBadge = `<div class="sticky-note-links" style="display:flex; flex-direction:column; gap:3.5px; margin:6px 0 8px 0; border-top:1px solid rgba(251,191,36,0.15); padding-top:6px; font-size:10px; color:rgba(168,85,247,0.95); max-width:100%; overflow:hidden;">`;
      linkedTasks.forEach(t => {
        linkBadge += `<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; justify-content:space-between; gap:4px; max-width:100%;" title="タスク: ${t.title}">` +
                       `<div style="display:flex; align-items:center; gap:4px; overflow:hidden; text-overflow:ellipsis; flex-grow:1;">` +
                         `<span style="flex-shrink:0;">🔗</span>` +
                         `<span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500;">${t.title}</span>` +
                       `</div>` +
                       `<span style="cursor:pointer; color:rgba(255,255,255,0.22); font-size:10px; font-weight:700; padding:0 3px; flex-shrink:0; pointer-events:auto;" ` +
                             `onclick="event.stopPropagation(); removeNoteRelation('${note.id}', 'task', '${t.id}')" ` +
                             `onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='rgba(255,255,255,0.22)'" title="紐づけ解除">×</span>` +
                     `</div>`;
      });
      linkedSchedules.forEach(s => {
        linkBadge += `<div style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; display:flex; align-items:center; justify-content:space-between; gap:4px; max-width:100%;" title="予定: ${s.title}">` +
                       `<div style="display:flex; align-items:center; gap:4px; overflow:hidden; text-overflow:ellipsis; flex-grow:1;">` +
                         `<span style="flex-shrink:0;">📅</span>` +
                         `<span style="white-space:nowrap; overflow:hidden; text-overflow:ellipsis; font-weight:500;">${s.title}</span>` +
                       `</div>` +
                       `<span style="cursor:pointer; color:rgba(255,255,255,0.22); font-size:10px; font-weight:700; padding:0 3px; flex-shrink:0; pointer-events:auto;" ` +
                             `onclick="event.stopPropagation(); removeNoteRelation('${note.id}', 'schedule', '${s.id}')" ` +
                             `onmouseover="this.style.color='#f87171'" onmouseout="this.style.color='rgba(255,255,255,0.22)'" title="紐づけ解除">×</span>` +
                     `</div>`;
      });
      linkBadge += `</div>`;
    }

    // ---- 表示モードのHTMLを生成する関数 ----
    function renderViewMode() {
      card.draggable = true;
      const contentHtml = [
        firstLine ? `<div style="font-weight:600;white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word;${rest ? "margin-bottom:3px;" : ""}">${firstLine}</div>` : "",
        rest      ? `<div style="color:rgba(255,255,255,0.65);font-size:11.5px;white-space:pre-wrap;word-break:break-word;overflow-wrap:break-word;">${rest}</div>` : ""
      ].join("");

      card.innerHTML =
        `<div class="sticky-note-content" style="pointer-events:none;">${contentHtml}</div>` +
        linkBadge +
        `<div class="sticky-note-meta">` +
          `<span style="display:flex;align-items:center;gap:6px;">` +
            `<span>${timeStr}</span>` +
          `</span>` +
          `<div class="sticky-note-actions">` +
            `<button class="sticky-note-btn archive" data-id="${note.id}" title="ダッシュボードから非表示">` +
              `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 8v13H3V8"/><rect x="1" y="3" width="22" height="5" rx="1"/><line x1="10" y1="12" x2="14" y2="12"/></svg>` +
              `アーカイブ` +
            `</button>` +
            `<button class="sticky-note-btn delete" data-id="${note.id}" title="削除">` +
              `<svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>` +
              `削除` +
            `</button>` +
          `</div>` +
        `</div>`;

      // アーカイブボタン
      card.querySelector(".archive").addEventListener("click", e => {
        e.stopPropagation();
        saveToUndoStack();
        const n = appState.notes.find(x => x.id === note.id);
        if (n) { n.dashboardArchived = true; saveData(); renderDashboardStickyNotes(); }
      });

      // 削除ボタン
      card.querySelector(".delete").addEventListener("click", e => {
        e.stopPropagation();
        saveToUndoStack();
        appState.notes = appState.notes.filter(x => x.id !== note.id);
        saveData(); renderDashboardStickyNotes(); renderCalendar();
      });
    }

    // ---- 編集モードのHTMLを生成する関数 ----
    function renderEditMode() {
      card.draggable = false; // 編集中はドラッグ無効
      const currentContent = appState.notes.find(x => x.id === note.id)?.content || note.content;
      card.innerHTML = `
        <textarea class="sticky-edit-textarea" style="
          width: 100%; box-sizing: border-box;
          min-height: 72px; height: auto;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(251,191,36,0.5);
          border-radius: 5px;
          color: #fff; font-size: 12px; font-family: inherit;
          line-height: 1.6; resize: vertical;
          padding: 7px 9px; outline: none;
          margin-bottom: 6px;
        ">${currentContent}</textarea>
        <div style="display:flex; gap:6px; justify-content:flex-end;">
          <button class="sticky-note-btn cancel-edit" style="font-size:11px; padding:3px 9px;">キャンセル</button>
          <button class="sticky-note-btn save-edit" style="
            font-size:11px; padding:3px 10px;
            background:rgba(251,191,36,0.2);
            border-color:rgba(251,191,36,0.45);
            color:rgba(255,220,80,0.95); font-weight:600;
          ">保存</button>
        </div>
      `;

      const ta = card.querySelector(".sticky-edit-textarea");
      // テキストエリアの高さをコンテンツに合わせて自動調整
      ta.style.height = "auto";
      ta.style.height = ta.scrollHeight + "px";
      ta.addEventListener("input", () => {
        ta.style.height = "auto";
        ta.style.height = ta.scrollHeight + "px";
      });
      ta.focus();
      ta.setSelectionRange(ta.value.length, ta.value.length);

      // Escape でキャンセル
      ta.addEventListener("keydown", e => {
        if (e.key === "Escape") { renderViewMode(); }
        // Ctrl+Enter で保存
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          card.querySelector(".save-edit").click();
        }
      });

      card.querySelector(".cancel-edit").addEventListener("click", e => {
        e.stopPropagation();
        renderViewMode();
      });

      card.querySelector(".save-edit").addEventListener("click", e => {
        e.stopPropagation();
        const newContent = ta.value.trim();
        if (!newContent) return;
        saveToUndoStack();
        const n = appState.notes.find(x => x.id === note.id);
        if (n) {
          n.content = newContent;
          n.updatedAt = new Date().toISOString();
          // firstLine / rest を更新して再描画
          const lines = newContent.split("\n");
          Object.assign(note, { content: newContent });
          // ローカル変数も更新してview modeを正しく表示
          const newFirst = lines[0] || "";
          const newRest = lines.slice(1).join("\n");
          // renderDashboardStickyNotes で全体再描画
          saveData();
          renderDashboardStickyNotes();
        }
      });
    }

    // 初期表示は表示モード
    renderViewMode();

    // カードクリック → 編集モードへ（ボタン以外）
    card.addEventListener("click", e => {
      if (e.target.closest(".sticky-note-btn") || e.target.closest("button")) return;
      if (card.querySelector(".sticky-edit-textarea")) return; // 既に編集中
      renderEditMode();
    });

    // ドラッグ
    card.addEventListener("dragstart", e => {
      if (card.querySelector(".sticky-edit-textarea")) { e.preventDefault(); return; }
      e.dataTransfer.setData("text/plain", "note-id:" + note.id);
      e.dataTransfer.setData("application/x-lifeorbit-note", note.id);
      e.dataTransfer.effectAllowed = "link";
      card.style.opacity = "0.5";
      document.body.classList.add("dragging-note");
    });
    card.addEventListener("dragend", () => {
      card.style.opacity = "";
      document.body.classList.remove("dragging-note");
    });

    container.appendChild(card);
  });

  if (window.lucide) lucide.createIcons();
}

function initDashboardNote() {
  const textarea = document.getElementById("dashboard-note-textarea");
  const saveBtn  = document.getElementById("btn-save-dashboard-note");
  if (!textarea) return;

  // イベントリスナーは一度だけバインド
  if (!textarea.dataset.listenerInitialized) {
    if (saveBtn) {
      saveBtn.addEventListener("click", () => {
        const content = textarea.value.trim();
        if (!content) return;

        saveToUndoStack();

        const tStr = formatDate(appState.currentDate);
        const newNote = {
          id: "note-" + Math.random().toString(36).substr(2, 9),
          date: tStr,
          content,
          taskIds: [],
          scheduleIds: [],
          dashboardArchived: false,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        appState.notes.push(newNote);
        textarea.value = "";
        saveData();
        renderDashboardStickyNotes();
        renderCalendar();
      });

      // Ctrl+Enter でも保存
      textarea.addEventListener("keydown", e => {
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          saveBtn.click();
        }
      });
    }

    const archiveAllBtn = document.getElementById("btn-archive-all-notes");
    if (archiveAllBtn) {
      archiveAllBtn.addEventListener("click", () => {
        const todayStr = formatDate(appState.currentDate);
        const todayNotes = appState.notes.filter(n => n.date === todayStr && !n.dashboardArchived);
        if (todayNotes.length === 0) return;
        
        saveToUndoStack();
        todayNotes.forEach(n => {
          n.dashboardArchived = true;
        });
        saveData();
        renderDashboardStickyNotes();
      });
    }

    textarea.dataset.listenerInitialized = "true";
  }

  // 付箋カードを描画
  renderDashboardStickyNotes();
}

function linkNoteToItem(noteId, type, itemId) {
  const note = appState.notes.find(n => n.id === noteId);
  if (!note) return;

  let updated = false;
  if (type === "task") {
    if (!note.taskIds) note.taskIds = [];
    if (!note.taskIds.includes(itemId)) {
      note.taskIds.push(itemId);
      updated = true;
    }
  } else if (type === "schedule") {
    if (!note.scheduleIds) note.scheduleIds = [];
    if (!note.scheduleIds.includes(itemId)) {
      note.scheduleIds.push(itemId);
      updated = true;
    }
  }

  if (updated) {
    saveToUndoStack();
    saveData();
    renderAll();
  }
}

function viewLinkedNote(noteId) {
  closeAllModals();
  switchView("notes");
  selectNote(noteId);
}

function removeNoteRelation(noteId, type, itemId) {
  const note = appState.notes.find(n => n.id === noteId);
  if (!note) return;

  let updated = false;
  if (type === "task") {
    if (note.taskIds) {
      const prevLen = note.taskIds.length;
      note.taskIds = note.taskIds.filter(id => id !== itemId);
      if (note.taskIds.length !== prevLen) updated = true;
    }
  } else if (type === "schedule") {
    if (note.scheduleIds) {
      const prevLen = note.scheduleIds.length;
      note.scheduleIds = note.scheduleIds.filter(id => id !== itemId);
      if (note.scheduleIds.length !== prevLen) updated = true;
    }
  }

  if (updated) {
    saveToUndoStack();
    saveData();
    renderAll();
  }
}

window.initDashboardNote = initDashboardNote;
window.linkNoteToItem = linkNoteToItem;
window.renderDashboardStickyNotes = renderDashboardStickyNotes;
window.viewLinkedNote = viewLinkedNote;
window.removeNoteRelation = removeNoteRelation;

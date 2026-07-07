/* ============================================================
   ĐIỂM NHẬU 39 — DEMO WEB CHATBOT
   ------------------------------------------------------------
   File này chạy cho index.html để test chatbot trước khi đưa lên Messenger.
   Không gọi API thật. Không cần server. Chỉ chạy trên trình duyệt.
   ============================================================ */


/* ------------------------------------------------------------
   1. THÔNG TIN QUÁN
   ------------------------------------------------------------ */
const restaurantInfo = {
  name: "Điểm Nhậu 39",
  address: "39 Lê Quang Đạo - Gia Viên - HP",
  hotline: "0932.045.067",
  openTime: "17:00",
  closeTime: "00:00"
};


/* ------------------------------------------------------------
   2. ẢNH MENU
   ------------------------------------------------------------
   Đặt đúng 2 ảnh tại:
   public/images/menu-page-1.jpg
   public/images/menu-page-2.jpg
   ------------------------------------------------------------ */
const menuImages = [
  "public/images/menu-page-1.jpg",
  "public/images/menu-page-2.jpg"
];


/* ------------------------------------------------------------
   3. MENU CHỮ — 8 nhóm
   ------------------------------------------------------------ */
const menuGroups = [
  {
    headerKey: "khaiVi",
    items: [
      "Nem chua: 60k / chục",
      "Nem ngựa: 140k",
      "Giò bò: 12k / cái",
      "Phồng tôm: 20k",
      "Lạc rang: 10k",
      "Ngô chiên: 50k",
      "Khoai tây chiên: 50k",
      "Mẹt cá khô: 150k",
      "  + Cá chỉ vàng",
      "  + Cá trai",
      "  + Cá bò nướng",
      "Chim câu băm xúc phồng tôm: 150k"
    ]
  },
  {
    headerKey: "dauPhu",
    items: [
      "Đậu chiên giòn: 40k",
      "Đậu tẩm hành: 50k",
      "Đậu tẩm hành tóp mỡ: 80k",
      "Củ quả luộc chấm kho quẹt: 90k",
      "Rau xào theo mùa: 50k",
      "Nấm tươi xào Oyster: 70k",
      "Mướp đắng xào trứng: 80k",
      "Tóp mỡ Triều Khúc ăn kèm dưa chua: 150k",
      "Tóp mỡ xào dưa chua: 140k"
    ]
  },
  {
    headerKey: "nomGoi",
    items: [
      "Nộm hoa chuối tép: 120k",
      "Nộm tai heo cà pháo: 140k",
      "Gỏi bò kéo pháo: 150k",
      "Gỏi Tôm Thái: 160k"
    ]
  },
  {
    headerKey: "boLon",
    items: [
      "Má đào nướng: 140k",
      "Đuôi lợn hấp gừng hành: 130k",
      "Đuôi lợn chiên mắm: 130k",
      "Bò xào măng Trúc: 180k",
      "Bò xào nấm tươi: 180k",
      "Bò cuốn lá cải: 180k",
      "Bò nhúng mẻ: 200k"
    ]
  },
  {
    headerKey: "daDayLong",
    items: [
      "Cật cháy tỏi: 120k",
      "Khấu đuôi nướng sa tế: 130k",
      "Lòng già xào dưa: 130k",
      "Lòng non xào dưa: 140k",
      "Vách lợn xào dưa: 140k",
      "Vách trần giá: 140k",
      "Bẹ cháy tỏi: 140k",
      "Bẹ chao đậu bắp: 140k",
      "Vách, lòng trần tổng hợp: 160k",
      "Dạ dày xào sả ớt: 170k",
      "Dạ dày chiên ngũ vị: 200k",
      "Dạ dày hầm tiêu: 200k"
    ]
  },
  {
    headerKey: "mucGaEch",
    items: [
      "Chân gà chiên mắm: 120k",
      "Cánh gà chiên mắm: 120k",
      "Sụn gà chiên mắm: 120k",
      "Ếch xào sả ớt: 160k",
      "Ếch chiên mắm: 160k",
      "Ếch rang muối: 160k",
      "Ếch chiên bơ: 160k",
      "Sườn chiên ngũ vị: 180k",
      "Mực hấp: 200k",
      "Mực xào tiêu xanh: 200k",
      "Mực xào dưa: 200k",
      "Mực nướng: 200k - 250k / con",
      "Mực chiên mọi / bơ: 250k",
      "Mực nướng sa tế: 250k"
    ]
  },
  {
    headerKey: "caLauMiCom",
    items: [
      "Chả cá thác lác chiên: 170k",
      "Lẩu Thái: 400k",
      "Lẩu cua đồng: 450k",
      "Cá quả om dưa",
      "Cá quả nướng muối ớt",
      "Cá chép om dưa: đặt trước",
      "Cá song - cá trình - cá tầm",
      "Nướng - Lẩu - Gỏi: đặt trước",
      "— Mì & cơm ăn kèm —",
      "Mì xào rau: 60k",
      "Mì xào trứng: 70k",
      "Cơm rang nhà quê: 80k",
      "Mì xào bò: 110k",
      "Cơm rang dưa bò: 110k",
      "Cơm rang hải sản: 150k",
      "Mì xào hải sản: 150k",
      "— Món nhúng lẩu - món gọi thêm —",
      "Mỳ: 6k",
      "Bánh đa: 10k",
      "Nấm kim châm: 15k",
      "Rau: 20k",
      "Ruốc thêm: 50k",
      "Tóp mỡ thêm: 40k",
      "Vách nhúng: 100k",
      "Lòng non nhúng: 110k",
      "Tôm nhúng: 120k",
      "Mực nhúng: 130k",
      "Bò nhúng: 130k",
      "Dạ dày nhúng: 170k",
      "Chả cá thác lác: 170k"
    ]
  },
  {
    headerKey: "doUong",
    items: [
      "— Nước ngọt & nước khoáng —",
      "Nước suối: 10k",
      "Sprite / Fanta: 15k",
      "Nước cam / Coca: 15k",
      "Trà hoa quả: 15k",
      "Sâm dứa: 20k",
      "— Bia & rượu —",
      "Rượu men lá: 50k",
      "Bia hơi HN: 12k / cốc",
      "Bia chai HP: 15k / chai",
      "Keng HN 1 lít: 60k",
      "Keng HN 2 lít: 80k"
    ]
  }
];


/* ------------------------------------------------------------
   4. NGÔN NGỮ / DỊCH THUẬT
   ------------------------------------------------------------ */
const translations = {
  vi: {
    greeting: "Xin chào! Chào mừng bạn đến với Điểm Nhậu 39 🍻\nVui lòng chọn ngôn ngữ:",
    langConfirm: "Đã chuyển sang Tiếng Việt ✅",
    askMore: "Bạn cần hỗ trợ gì thêm?",
    changeLangPrompt: "Bạn muốn đổi sang ngôn ngữ nào?",
    menuIntro: "Đây là menu của Điểm Nhậu 39. Mình gửi ảnh menu trước nhé:",
    menuImageNote: "Bạn có thể bấm vào ảnh để xem menu lớn hơn.",
    menuTextIntro: "Dưới đây là menu dạng chữ để bạn dễ tìm món:",
    menuHeaders: {
      khaiVi: "🍢 KHAI VỊ & ĂN CHƠI LAI RAI",
      dauPhu: "🥬 ĐẬU PHỤ & RAU XÀO",
      nomGoi: "🥗 NỘM & GỎI",
      boLon: "🥩 BÒ & LỢN",
      daDayLong: "🍖 DẠ DÀY & LÒNG",
      mucGaEch: "🍗 MỰC, GÀ, ẾCH, SƯỜN",
      caLauMiCom: "🍲 CÁ, LẨU, MÌ, CƠM",
      doUong: "🍺 ĐỒ UỐNG"
    },
    openHours: `Quán mở cửa lúc ${restaurantInfo.openTime}.`,
    closeHours: `Quán đóng cửa lúc ${restaurantInfo.closeTime}.`,
    location: `${restaurantInfo.name}\nĐịa chỉ: ${restaurantInfo.address}\nHotline: ${restaurantInfo.hotline}`,
    bookingIntro: "Tuyệt vời, mình xin thông tin đặt bàn nhé!",
    bookingSteps: [
      "Anh/chị muốn đặt bàn cho mấy người?",
      "Anh/chị muốn đặt ngày nào?",
      "Anh/chị muốn đặt lúc mấy giờ?",
      "Cho quán xin tên của anh/chị.",
      "Cho quán xin số điện thoại.",
      "Anh/chị có yêu cầu gì thêm không?"
    ],
    bookingSummaryTitle: "Yêu cầu đặt bàn đã được ghi nhận:",
    bookingLabels: {
      name: "Tên",
      phone: "Số điện thoại",
      people: "Số người",
      date: "Ngày",
      time: "Giờ",
      request: "Yêu cầu thêm"
    },
    bookingFollowUp: "Nhân viên quán sẽ kiểm tra và phản hồi lại sớm.",
    staffMessage: "Quán đã nhận được yêu cầu gọi nhân viên. Nhân viên sẽ phản hồi bạn sớm nhất có thể.",
    fallback: "Xin lỗi, mình chưa hiểu rõ. Bạn có thể bấm một trong các nút bên dưới nhé.",
    typing: "Điểm Nhậu 39 đang trả lời...",
    quickReplies: {
      menu: "Xem menu",
      hours: "Giờ mở cửa",
      close: "Giờ đóng cửa",
      book: "Đặt bàn",
      location: "Địa chỉ",
      staff: "Gọi nhân viên",
      lang: "Đổi ngôn ngữ"
    }
  },

  en: {
    greeting: "Hello! Welcome to Điểm Nhậu 39 🍻\nPlease choose your language:",
    langConfirm: "Language set to English ✅",
    askMore: "What else can I help you with?",
    changeLangPrompt: "Which language would you like?",
    menuIntro: "Here is the menu of Điểm Nhậu 39. I will send the menu images first:",
    menuImageNote: "You can click the images to view them larger.",
    menuTextIntro: "Here is the text version of the menu for easier searching:",
    menuHeaders: {
      khaiVi: "🍢 STARTERS & SNACKS",
      dauPhu: "🥬 TOFU & STIR-FRIED VEGETABLES",
      nomGoi: "🥗 SALADS",
      boLon: "🥩 BEEF & PORK",
      daDayLong: "🍖 STOMACH & OFFAL",
      mucGaEch: "🍗 SQUID, CHICKEN, FROG, RIBS",
      caLauMiCom: "🍲 FISH, HOT POT, NOODLES, RICE",
      doUong: "🍺 DRINKS"
    },
    openHours: `We open at ${restaurantInfo.openTime}.`,
    closeHours: `We close at ${restaurantInfo.closeTime}.`,
    location: `${restaurantInfo.name}\nAddress: ${restaurantInfo.address}\nHotline: ${restaurantInfo.hotline}`,
    bookingIntro: "Great, let's get your table booked!",
    bookingSteps: [
      "How many people will be joining?",
      "What date would you like to book?",
      "What time would you like?",
      "Can I get your name?",
      "What's your phone number?",
      "Any other special requests?"
    ],
    bookingSummaryTitle: "Your reservation request has been received:",
    bookingLabels: {
      name: "Name",
      phone: "Phone",
      people: "People",
      date: "Date",
      time: "Time",
      request: "Special request"
    },
    bookingFollowUp: "Our staff will check and get back to you soon.",
    staffMessage: "Your request has been sent to the staff. A staff member will reply as soon as possible.",
    fallback: "Sorry, I didn't quite understand that. You can tap one of the buttons below.",
    typing: "Điểm Nhậu 39 is typing...",
    quickReplies: {
      menu: "View menu",
      hours: "Opening hours",
      close: "Closing time",
      book: "Book a table",
      location: "Location",
      staff: "Call staff",
      lang: "Change language"
    }
  },

  ja: {
    greeting: "こんにちは！Điểm Nhậu 39へようこそ 🍻\n言語を選択してください：",
    langConfirm: "日本語に設定しました ✅",
    askMore: "他に何かお手伝いできますか？",
    changeLangPrompt: "どの言語にしますか？",
    menuIntro: "Điểm Nhậu 39のメニューです。先にメニュー画像をお送りします：",
    menuImageNote: "画像をクリックすると大きく表示できます。",
    menuTextIntro: "探しやすいように、文字版メニューもお送りします：",
    menuHeaders: {
      khaiVi: "🍢 前菜・おつまみ",
      dauPhu: "🥬 豆腐・野菜炒め",
      nomGoi: "🥗 サラダ・和え物",
      boLon: "🥩 牛肉・豚肉",
      daDayLong: "🍖 モツ・内臓料理",
      mucGaEch: "🍗 イカ・鶏肉・カエル・スペアリブ",
      caLauMiCom: "🍲 魚・鍋・麺・ご飯",
      doUong: "🍺 ドリンク"
    },
    openHours: `開店時間は${restaurantInfo.openTime}です。`,
    closeHours: `閉店時間は${restaurantInfo.closeTime}です。`,
    location: `${restaurantInfo.name}\n住所：${restaurantInfo.address}\n電話番号：${restaurantInfo.hotline}`,
    bookingIntro: "かしこまりました！ご予約の内容をお伺いします。",
    bookingSteps: [
      "ご人数を教えてください。",
      "ご希望の日付はいつですか？",
      "ご希望のお時間は？",
      "お名前を教えてください。",
      "電話番号を教えてください。",
      "他にご要望はありますか？"
    ],
    bookingSummaryTitle: "ご予約リクエストを受け付けました：",
    bookingLabels: {
      name: "お名前",
      phone: "電話番号",
      people: "人数",
      date: "日付",
      time: "時間",
      request: "ご要望"
    },
    bookingFollowUp: "スタッフが確認して、追ってご連絡いたします。",
    staffMessage: "スタッフ呼び出しを受け付けました。スタッフができるだけ早く返信いたします。",
    fallback: "申し訳ありません、うまく理解できませんでした。下のボタンからお選びください。",
    typing: "Điểm Nhậu 39が入力中...",
    quickReplies: {
      menu: "メニュー",
      hours: "営業時間",
      close: "閉店時間",
      book: "予約",
      location: "アクセス",
      staff: "スタッフを呼ぶ",
      lang: "言語変更"
    }
  }
};


/* ------------------------------------------------------------
   5. TỪ KHÓA GÕ TAY
   ------------------------------------------------------------ */
const keywordActionMap = {
  greeting: ["hello", "hi", "xin chao", "chao", "こんにちは"],
  menu: ["menu", "thuc don", "xem menu", "food", "メニュー"],
  hours: ["gio mo cua", "may gio mo cua", "opening hours", "open", "営業時間", "開店"],
  close: ["gio dong cua", "may gio dong cua", "closing time", "close", "閉店"],
  location: ["dia chi", "o dau", "location", "address", "アクセス", "住所"],
  book: ["dat ban", "hen lich", "book", "reservation", "予約"],
  staff: ["goi nhan vien", "gap nhan vien", "staff", "human", "スタッフ"],
  lang: ["doi ngon ngu", "change language", "言語変更"]
};


/* ------------------------------------------------------------
   6. TRẠNG THÁI CHAT
   ------------------------------------------------------------ */
let currentLang = null;
let bookingStep = null;
let bookingData = {};
let chatInitialized = false;
let isTyping = false;

const BOOKING_FIELDS = ["people", "date", "time", "name", "phone", "request"];

function t() {
  return translations[currentLang];
}


/* ------------------------------------------------------------
   7. HÀM XỬ LÝ CHỮ
   ------------------------------------------------------------ */
function normalize(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .trim();
}

function detectAction(text) {
  const q = normalize(text);
  for (const action in keywordActionMap) {
    for (const keyword of keywordActionMap[action]) {
      if (q.includes(normalize(keyword))) return action;
    }
  }
  return null;
}


/* ------------------------------------------------------------
   8. GIAO DIỆN CHAT
   ------------------------------------------------------------ */
function getMessagesBox() {
  return document.getElementById("chatMessages");
}

function scrollToBottom() {
  const messages = getMessagesBox();
  if (messages) {
    messages.scrollTop = messages.scrollHeight;
  }
}

function addBotMessage(text) {
  const messages = getMessagesBox();
  if (!messages) return;

  const row = document.createElement("div");
  row.className = "msg-row bot-row";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "🍻";

  const bubble = document.createElement("div");
  bubble.className = "message bot";
  bubble.textContent = text;

  row.appendChild(avatar);
  row.appendChild(bubble);
  messages.appendChild(row);

  scrollToBottom();
}

function addBotImage(imagePath) {
  const messages = getMessagesBox();
  if (!messages) return;

  const row = document.createElement("div");
  row.className = "msg-row bot-row";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "🍻";

  const bubble = document.createElement("div");
  bubble.className = "message bot image-message";

  const img = document.createElement("img");
  img.src = imagePath;
  img.alt = "Menu Điểm Nhậu 39";
  img.className = "chat-menu-image";

  img.style.width = "100%";
  img.style.maxWidth = "260px";
  img.style.borderRadius = "14px";
  img.style.display = "block";
  img.style.cursor = "pointer";

  img.addEventListener("click", () => {
    window.open(imagePath, "_blank");
  });

  bubble.appendChild(img);
  row.appendChild(avatar);
  row.appendChild(bubble);
  messages.appendChild(row);

  scrollToBottom();
}

function addUserMessage(text) {
  const messages = getMessagesBox();
  if (!messages) return;

  const row = document.createElement("div");
  row.className = "msg-row user-row";

  const bubble = document.createElement("div");
  bubble.className = "message user";
  bubble.textContent = text;

  row.appendChild(bubble);
  messages.appendChild(row);

  scrollToBottom();
}

function showTyping() {
  if (isTyping) return;

  isTyping = true;

  const messages = getMessagesBox();
  if (!messages) return;

  const row = document.createElement("div");
  row.className = "msg-row bot-row";
  row.id = "typingIndicator";

  const avatar = document.createElement("div");
  avatar.className = "msg-avatar";
  avatar.textContent = "🍻";

  const typing = document.createElement("div");
  typing.className = "typing";
  typing.innerHTML = "<span></span><span></span><span></span>";

  row.appendChild(avatar);
  row.appendChild(typing);
  messages.appendChild(row);

  scrollToBottom();

  const label = document.getElementById("typingLabel");
  if (label) {
    label.textContent = currentLang ? t().typing : "";
    label.classList.remove("hidden");
  }
}

function hideTyping() {
  isTyping = false;

  const typing = document.getElementById("typingIndicator");
  if (typing) typing.remove();

  const label = document.getElementById("typingLabel");
  if (label) {
    label.classList.add("hidden");
  }
}

function runWithTypingDelay(callback) {
  showTyping();

  const delay = 400 + Math.random() * 400;

  setTimeout(() => {
    hideTyping();
    callback();
  }, delay);
}

function sleepThen(ms, callback) {
  setTimeout(callback, ms);
}


/* ------------------------------------------------------------
   9. QUICK REPLIES
   ------------------------------------------------------------ */
function languageQuickReplies() {
  return [
    { label: "Tiếng Việt", action: "lang_vi" },
    { label: "English", action: "lang_en" },
    { label: "日本語", action: "lang_ja" }
  ];
}

function mainOptionQuickReplies(lang) {
  const qr = translations[lang].quickReplies;

  return [
    { label: qr.menu, action: "menu" },
    { label: qr.hours, action: "hours" },
    { label: qr.close, action: "close" },
    { label: qr.book, action: "book" },
    { label: qr.location, action: "location" },
    { label: qr.staff, action: "staff" },
    { label: qr.lang, action: "changelang" }
  ];
}

function buildQuickReplies(lang) {
  if (!lang) return languageQuickReplies();
  return [...languageQuickReplies(), ...mainOptionQuickReplies(lang)];
}

function showQuickReplies(items) {
  const container = document.getElementById("quickReplies");
  if (!container) return;

  container.innerHTML = "";

  items.forEach(item => {
    const btn = document.createElement("button");
    btn.textContent = item.label;

    btn.addEventListener("click", () => {
      if (isTyping) return;

      addUserMessage(item.label);
      container.innerHTML = "";

      runWithTypingDelay(() => {
        routeAction(item.action);
      });
    });

    container.appendChild(btn);
  });
}

function clearQuickReplies() {
  const container = document.getElementById("quickReplies");
  if (container) {
    container.innerHTML = "";
  }
}

function sendMainOptions() {
  const prompt = currentLang ? t().askMore : translations.vi.changeLangPrompt;

  addBotMessage(prompt);
  showQuickReplies(buildQuickReplies(currentLang));
}


/* ------------------------------------------------------------
   10. MỞ / ĐÓNG CHAT
   ------------------------------------------------------------ */
function openChat() {
  const chatWindow = document.getElementById("chatWindow");
  const launcherBadge = document.getElementById("launcherBadge");
  const input = document.getElementById("chatInput");

  if (chatWindow) chatWindow.classList.add("open");
  if (launcherBadge) launcherBadge.classList.add("hidden");
  if (input) input.focus();

  if (!chatInitialized) {
    chatInitialized = true;
    sendGreeting();
  }
}

function closeChat() {
  const chatWindow = document.getElementById("chatWindow");
  if (chatWindow) {
    chatWindow.classList.remove("open");
  }
}


/* ------------------------------------------------------------
   11. NGÔN NGỮ
   ------------------------------------------------------------ */
function sendGreeting() {
  const greetingMulti =
    translations.vi.greeting +
    "\n\n" +
    translations.en.greeting +
    "\n\n" +
    translations.ja.greeting;

  addBotMessage(greetingMulti);
  showQuickReplies(languageQuickReplies());
}

function setLanguage(lang) {
  currentLang = lang;
  addBotMessage(t().langConfirm);
  sendMainOptions();
}

function promptChangeLanguage() {
  const lang = currentLang || "vi";

  addBotMessage(translations[lang].changeLangPrompt);
  showQuickReplies(languageQuickReplies());
}


/* ------------------------------------------------------------
   12. ĐIỀU HƯỚNG
   ------------------------------------------------------------ */
function routeAction(action) {
  switch (action) {
    case "lang_vi":
      setLanguage("vi");
      break;

    case "lang_en":
      setLanguage("en");
      break;

    case "lang_ja":
      setLanguage("ja");
      break;

    case "menu":
      showMenu();
      break;

    case "hours":
      showOpeningHours();
      break;

    case "close":
      showClosingTime();
      break;

    case "book":
      startBooking();
      break;

    case "location":
      showLocation();
      break;

    case "staff":
      callStaff();
      break;

    case "changelang":
      promptChangeLanguage();
      break;

    default:
      sendGreeting();
  }
}


/* ------------------------------------------------------------
   13. NỘI DUNG TRẢ LỜI
   ------------------------------------------------------------ */
function showMenu() {
  if (!currentLang) {
    sendGreeting();
    return;
  }

  addBotMessage(t().menuIntro);

  sleepThen(150, () => {
    addBotImage(menuImages[0]);
  });

  sleepThen(350, () => {
    addBotImage(menuImages[1]);
  });

  sleepThen(600, () => {
    addBotMessage(t().menuImageNote);
  });

  sleepThen(850, () => {
    addBotMessage(t().menuTextIntro);

    let i = 0;

    function sendNextGroup() {
      if (i >= menuGroups.length) {
        sendMainOptions();
        return;
      }

      const group = menuGroups[i];
      const header = t().menuHeaders[group.headerKey];

      const lines = group.items.map(item => {
        const isDivider = item.startsWith("—");
        const isSubBullet = item.startsWith("  +");
        return isDivider || isSubBullet ? item : `- ${item}`;
      });

      addBotMessage(header + "\n" + lines.join("\n"));

      i++;
      sleepThen(220, sendNextGroup);
    }

    sendNextGroup();
  });
}

function showOpeningHours() {
  if (!currentLang) {
    sendGreeting();
    return;
  }

  addBotMessage(t().openHours);
  sendMainOptions();
}

function showClosingTime() {
  if (!currentLang) {
    sendGreeting();
    return;
  }

  addBotMessage(t().closeHours);
  sendMainOptions();
}

function showLocation() {
  if (!currentLang) {
    sendGreeting();
    return;
  }

  addBotMessage(t().location);
  sendMainOptions();
}


/* ------------------------------------------------------------
   14. ĐẶT BÀN
   ------------------------------------------------------------ */
function startBooking() {
  if (!currentLang) {
    sendGreeting();
    return;
  }

  bookingStep = 0;
  bookingData = {};

  clearQuickReplies();

  addBotMessage(t().bookingIntro);

  runWithTypingDelay(() => {
    addBotMessage(t().bookingSteps[0]);
  });
}

function handleBookingStep(text) {
  const field = BOOKING_FIELDS[bookingStep];
  bookingData[field] = text;
  bookingStep++;

  if (bookingStep < t().bookingSteps.length) {
    addBotMessage(t().bookingSteps[bookingStep]);
    return;
  }

  const L = t().bookingLabels;
  const d = bookingData;

  const summary =
    `${t().bookingSummaryTitle}\n` +
    `- ${L.name}: ${d.name}\n` +
    `- ${L.phone}: ${d.phone}\n` +
    `- ${L.people}: ${d.people}\n` +
    `- ${L.date}: ${d.date}\n` +
    `- ${L.time}: ${d.time}\n` +
    `- ${L.request}: ${d.request}`;

  addBotMessage(summary);
  addBotMessage(t().bookingFollowUp);

  bookingStep = null;
  bookingData = {};

  runWithTypingDelay(sendMainOptions);
}


/* ------------------------------------------------------------
   15. GỌI NHÂN VIÊN
   ------------------------------------------------------------ */
function callStaff() {
  if (!currentLang) {
    sendGreeting();
    return;
  }

  console.log("🚨 STAFF NEEDED (demo web)");
  console.log("Language:", currentLang);
  console.log("Time:", new Date().toLocaleString("vi-VN"));

  addBotMessage(t().staffMessage);
  sendMainOptions();
}


/* ------------------------------------------------------------
   16. GÕ TAY
   ------------------------------------------------------------ */
function handleUserInput(text) {
  const action = detectAction(text);

  if (!currentLang || action === "greeting") {
    sendGreeting();
    return;
  }

  if (bookingStep !== null) {
    handleBookingStep(text);
    return;
  }

  const actionMap = {
    menu: "menu",
    hours: "hours",
    close: "close",
    location: "location",
    book: "book",
    staff: "staff",
    lang: "changelang"
  };

  if (action && actionMap[action]) {
    routeAction(actionMap[action]);
    return;
  }

  addBotMessage(t().fallback);
  sendMainOptions();
}


/* ------------------------------------------------------------
   17. GỬI TIN NHẮN TỪ Ô INPUT
   ------------------------------------------------------------ */
function sendMessage() {
  if (isTyping) return;

  const input = document.getElementById("chatInput");
  if (!input) return;

  const text = input.value.trim();
  if (text === "") return;

  addUserMessage(text);

  input.value = "";
  clearQuickReplies();

  runWithTypingDelay(() => {
    handleUserInput(text);
  });
}


/* ------------------------------------------------------------
   18. HIỂN THỊ THÔNG TIN QUÁN TRÊN TRANG
   ------------------------------------------------------------ */
function renderBusinessInfo() {
  const addressEl = document.getElementById("infoAddress");
  const hotlineEl = document.getElementById("infoHotline");
  const hoursEl = document.getElementById("infoHours");

  if (addressEl) addressEl.textContent = restaurantInfo.address;
  if (hotlineEl) hotlineEl.textContent = restaurantInfo.hotline;
  if (hoursEl) hoursEl.textContent = `${restaurantInfo.openTime} - ${restaurantInfo.closeTime}`;
}


/* ------------------------------------------------------------
   19. KHỞI ĐỘNG
   ------------------------------------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  const launcher = document.getElementById("launcher");
  const closeChatBtn = document.getElementById("closeChatBtn");
  const sendBtn = document.getElementById("sendBtn");
  const chatInput = document.getElementById("chatInput");
  const messageBtn = document.getElementById("messageBtn");
  const openChatBtn2 = document.getElementById("openChatBtn2");

  if (launcher) {
    launcher.addEventListener("click", openChat);
  }

  if (closeChatBtn) {
    closeChatBtn.addEventListener("click", closeChat);
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", sendMessage);
  }

  if (chatInput) {
    chatInput.addEventListener("keydown", e => {
      if (e.key === "Enter") {
        sendMessage();
      }
    });
  }

  if (messageBtn) {
    messageBtn.addEventListener("click", openChat);
  }

  if (openChatBtn2) {
    openChatBtn2.addEventListener("click", openChat);
  }

  document.querySelectorAll("[data-open-chat]").forEach(btn => {
    btn.addEventListener("click", openChat);
  });

  renderBusinessInfo();
});
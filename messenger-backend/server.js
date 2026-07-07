/* ============================================================
   ĐIỂM NHẬU 39 — MESSENGER CHATBOT SERVER
   ------------------------------------------------------------
   Node.js + Express, không dùng OpenAI API, không dùng database.
   Trạng thái từng khách được lưu tạm trong RAM (object userStates),
   sẽ mất khi restart server — hoàn toàn theo đúng yêu cầu.

   Ghi chú cho người mới:
   - "Quick reply" là các nút bấm tròn hiện ngay trên ô nhập tin
     nhắn của Messenger, biến mất sau khi khách bấm 1 nút.
     Vì vậy sau MỖI câu trả lời, mình phải gửi lại quick replies
     mới để khách luôn có nút để bấm tiếp.
   - "Postback payload" là chuỗi cố định gắn theo mỗi nút, ví dụ
     "SHOW_MENU" — Facebook gửi đúng chuỗi này về webhook khi
     khách bấm nút đó, mình dựa vào đó để biết khách muốn gì.
   ============================================================ */

require("dotenv").config();
const express = require("express");

const app = express();
app.use(express.json());
app.use("/images", express.static("public/images"));

// Giữ nguyên đúng 3 biến môi trường như yêu cầu — không đổi tên.
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN;
const PORT = process.env.PORT || 3000;
const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL;

const FACEBOOK_SEND_API_URL = "https://graph.facebook.com/v19.0/me/messages";

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
   2. MENU — chia theo đúng 8 nhóm để gửi thành nhiều tin nhắn
   ------------------------------------------------------------
   Ghi chú: tên món giữ nguyên tiếng Việt cho cả 3 ngôn ngữ vì đây
   là tên món ăn Việt cụ thể (giống cách nhiều nhà hàng quốc tế vẫn
   giữ tên gốc món ăn trên menu). Chỉ tiêu đề nhóm và các câu dẫn
   là được dịch theo ngôn ngữ khách chọn.
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
      "Mẹt cá khô: 150k (cá chỉ vàng, cá trai, cá bò nướng)",
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
      "Cá song - cá trình - cá tầm (Nướng - Lẩu - Gỏi): đặt trước",
      "— Mì & cơm ăn kèm —",
      "Mì xào rau: 60k",
      "Mì xào trứng: 70k",
      "Cơm rang nhà quê: 80k",
      "Mì xào bò: 110k",
      "Cơm rang dưa bò: 110k",
      "Cơm rang hải sản: 150k",
      "Mì xào hải sản: 150k",
      "— Đồ nhúng lẩu / gọi thêm —",
      "Mỳ: 6k · Bánh đa: 10k · Nấm kim châm: 15k · Rau: 20k",
      "Ruốc thêm: 50k · Tóp mỡ thêm: 40k",
      "Vách nhúng: 100k · Lòng non nhúng: 110k",
      "Tôm nhúng: 120k · Mực nhúng: 130k · Bò nhúng: 130k",
      "Dạ dày nhúng: 170k · Chả cá thác lác: 170k"
    ]
  },
  {
    headerKey: "doUong",
    items: [
      "Nước suối: 10k",
      "Sprite / Fanta: 15k",
      "Nước cam / Coca: 15k",
      "Trà hoa quả: 15k",
      "Sâm dứa: 20k",
      "Rượu men lá: 50k",
      "Bia hơi HN: 12k / cốc",
      "Bia chai HP: 15k / chai",
      "Keng HN 1 lít: 60k",
      "Keng HN 2 lít: 80k"
    ]
  }
];

/* ------------------------------------------------------------
   3. NGÔN NGỮ / DỊCH THUẬT
   ------------------------------------------------------------ */
const translations = {
  vi: {
    greeting: "Xin chào! Chào mừng bạn đến với Điểm Nhậu 39 🍻\nVui lòng chọn ngôn ngữ:",
    langConfirm: "Đã chuyển sang Tiếng Việt ✅",
    askMore: "Bạn cần hỗ trợ gì thêm?",
    changeLangPrompt: "Bạn muốn đổi sang ngôn ngữ nào?",
    menuIntro: "Đây là menu của Điểm Nhậu 39, mình gửi theo từng nhóm nhé:",
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
    bookingLabels: { name: "Tên", phone: "Số điện thoại", people: "Số người", date: "Ngày", time: "Giờ", request: "Yêu cầu thêm" },
    bookingFollowUp: "Nhân viên quán sẽ kiểm tra và phản hồi lại sớm.",
    staffMessage: "Quán đã nhận được yêu cầu gọi nhân viên. Nhân viên sẽ phản hồi bạn sớm nhất có thể.",
    fallback: "Xin lỗi, mình chưa hiểu rõ. Bạn có thể bấm một trong các nút bên dưới nhé.",
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
    menuIntro: "Here's our menu at Điểm Nhậu 39, sent group by group:",
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
    bookingLabels: { name: "Name", phone: "Phone", people: "People", date: "Date", time: "Time", request: "Special request" },
    bookingFollowUp: "Our staff will check and get back to you soon.",
    staffMessage: "Your request has been sent to the staff. A staff member will reply as soon as possible.",
    fallback: "Sorry, I didn't quite understand that. You can tap one of the buttons below.",
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
    menuIntro: "Điểm Nhậu 39のメニューです。グループごとにお送りします：",
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
    bookingLabels: { name: "お名前", phone: "電話番号", people: "人数", date: "日付", time: "時間", request: "ご要望" },
    bookingFollowUp: "スタッフが確認して、追ってご連絡いたします。",
    staffMessage: "スタッフ呼び出しを受け付けました。スタッフができるだけ早く返信いたします。",
    fallback: "申し訳ありません、うまく理解できませんでした。下のボタンからお選びください。",
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
   4. TỪ KHÓA GÕ TAY (đa ngôn ngữ) → map ra action
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
   5. TRẠNG THÁI KHÁCH (RAM, mất khi restart — đúng yêu cầu)
   ------------------------------------------------------------ */
const userStates = {};

function getState(senderId) {
  if (!userStates[senderId]) {
    userStates[senderId] = {
      lang: null,          // 'vi' | 'en' | 'ja' | null (chưa chọn)
      bookingStep: null,   // số bước hiện tại trong luồng đặt bàn, null = không đặt bàn
      bookingData: {},
      lastMessage: ""
    };
  }
  return userStates[senderId];
}

const BOOKING_FIELDS = ["people", "date", "time", "name", "phone", "request"];

/* ------------------------------------------------------------
   6. TIỆN ÍCH: chuẩn hoá chữ để so khớp từ khóa tiếng Việt không dấu
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

/* ============================================================
   7. GỬI TIN NHẮN (Facebook Send API)
   ============================================================ */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function callSendAPI(payload) {
  if (!PAGE_ACCESS_TOKEN) {
    console.log("⚠️  Thiếu PAGE_ACCESS_TOKEN trong .env — chỉ log ra console, không gửi thật.");
    console.log("   Payload định gửi:", JSON.stringify(payload));
    return;
  }

  try {
    const response = await fetch(`${FACEBOOK_SEND_API_URL}?access_token=${PAGE_ACCESS_TOKEN}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const result = await response.json();
    if (!response.ok) {
      console.error("❌ Lỗi khi gọi Facebook Send API:", result);
    }
  } catch (error) {
    console.error("❌ Gọi Send API thất bại:", error.message);
  }
}

/* Gửi 1 tin nhắn văn bản, có thể kèm quick_replies (mảng do buildQuickReplies tạo) */
async function sendMessage(senderId, text, quickReplies) {
  const message = { text };
  if (quickReplies && quickReplies.length > 0) {
    message.quick_replies = quickReplies;
  }
  await callSendAPI({ recipient: { id: senderId }, message });
}
async function sendImage(senderId, imageUrl) {
  const payload = {
    recipient: { id: senderId },
    message: {
      attachment: {
        type: "image",
        payload: {
          url: imageUrl,
          is_reusable: true
        }
      }
    }
  };

  await callSendAPI(payload);
}
/* ============================================================
   8. QUICK REPLIES
   ------------------------------------------------------------
   Luôn hiện 3 nút chọn ngôn ngữ (để khách đổi bất cứ lúc nào).
   Nếu khách đã chọn ngôn ngữ, hiện thêm 7 nút chức năng theo
   đúng ngôn ngữ đó. Tổng tối đa 10 nút — trong giới hạn của
   Messenger quick replies (tối đa 13 nút / tin nhắn).
   ============================================================ */
function languageQuickReplies() {
  return [
    { content_type: "text", title: "Tiếng Việt", payload: "LANG_VI" },
    { content_type: "text", title: "English", payload: "LANG_EN" },
    { content_type: "text", title: "日本語", payload: "LANG_JA" }
  ];
}

function mainOptionQuickReplies(lang) {
  const qr = translations[lang].quickReplies;
  return [
    { content_type: "text", title: qr.menu, payload: "SHOW_MENU" },
    { content_type: "text", title: qr.hours, payload: "SHOW_OPEN_HOURS" },
    { content_type: "text", title: qr.close, payload: "SHOW_CLOSE_TIME" },
    { content_type: "text", title: qr.book, payload: "BOOK_TABLE" },
    { content_type: "text", title: qr.location, payload: "SHOW_LOCATION" },
    { content_type: "text", title: qr.staff, payload: "CALL_STAFF" },
    { content_type: "text", title: qr.lang, payload: "CHANGE_LANGUAGE" }
  ];
}

function buildQuickReplies(lang) {
  if (!lang) return languageQuickReplies();
  return [...languageQuickReplies(), ...mainOptionQuickReplies(lang)];
}

/* Gửi lại menu nút bấm — gọi hàm này ở CUỐI mọi phản hồi */
async function sendMainOptions(senderId) {
  const state = getState(senderId);
  const lang = state.lang;
  const prompt = lang ? translations[lang].askMore : translations.vi.changeLangPrompt;
  await sendMessage(senderId, prompt, buildQuickReplies(lang));
}

/* ============================================================
   9. CÁC HÀM XỬ LÝ TỪNG CHỨC NĂNG
   ============================================================ */
async function sendGreeting(senderId) {
  // Chào bằng cả 3 thứ tiếng vì lúc này chưa biết khách dùng ngôn ngữ nào
  const greetingMulti =
    translations.vi.greeting + "\n\n" + translations.en.greeting + "\n\n" + translations.ja.greeting;
  await sendMessage(senderId, greetingMulti, languageQuickReplies());
}

async function setLanguage(senderId, lang) {
  const state = getState(senderId);
  state.lang = lang;
  await sendMessage(senderId, translations[lang].langConfirm);
  await sendMainOptions(senderId);
}

async function showMenu(senderId) {
  const state = getState(senderId);
  const lang = state.lang;
  const t = translations[lang];

  await sendMessage(senderId, t.menuIntro);

  // Gửi ảnh menu trang 1 và trang 2
  if (PUBLIC_BASE_URL) {
    await sendImage(senderId, `${PUBLIC_BASE_URL}/images/menu-page-1.jpg`);
    await sleep(300);

    await sendImage(senderId, `${PUBLIC_BASE_URL}/images/menu-page-2.jpg`);
    await sleep(300);
  } else {
    console.log("⚠️ Thiếu PUBLIC_BASE_URL trong .env nên chưa gửi được ảnh menu.");
  }

  // Sau khi gửi ảnh, vẫn gửi thêm menu chữ để khách dễ tìm món
  for (const group of menuGroups) {
    const header = t.menuHeaders[group.headerKey];
    const body = header + "\n" + group.items.map(i => `- ${i}`).join("\n");
    await sendMessage(senderId, body);
    await sleep(250);
  }

  await sendMainOptions(senderId);
}

async function showOpeningHours(senderId) {
  const state = getState(senderId);
  await sendMessage(senderId, translations[state.lang].openHours);
  await sendMainOptions(senderId);
}

async function showClosingTime(senderId) {
  const state = getState(senderId);
  await sendMessage(senderId, translations[state.lang].closeHours);
  await sendMainOptions(senderId);
}

async function showLocation(senderId) {
  const state = getState(senderId);
  await sendMessage(senderId, translations[state.lang].location);
  await sendMainOptions(senderId);
}

/* -------- Đặt bàn -------- */
async function startBooking(senderId) {
  const state = getState(senderId);
  const t = translations[state.lang];

  state.bookingStep = 0;
  state.bookingData = {};

  await sendMessage(senderId, t.bookingIntro);
  await sendMessage(senderId, t.bookingSteps[0]);
}

async function handleBookingStep(senderId, text) {
  const state = getState(senderId);
  const t = translations[state.lang];

  const field = BOOKING_FIELDS[state.bookingStep];
  state.bookingData[field] = text;
  state.bookingStep++;

  if (state.bookingStep < t.bookingSteps.length) {
    await sendMessage(senderId, t.bookingSteps[state.bookingStep]);
    return;
  }

  // Đã trả lời đủ 6 câu — tổng kết
  const L = t.bookingLabels;
  const d = state.bookingData;
  const summary =
    `${t.bookingSummaryTitle}\n` +
    `- ${L.name}: ${d.name}\n` +
    `- ${L.phone}: ${d.phone}\n` +
    `- ${L.people}: ${d.people}\n` +
    `- ${L.date}: ${d.date}\n` +
    `- ${L.time}: ${d.time}\n` +
    `- ${L.request}: ${d.request}`;

  await sendMessage(senderId, summary);
  await sendMessage(senderId, t.bookingFollowUp);

  state.bookingStep = null;
  state.bookingData = {};

  await sendMainOptions(senderId);
}

/* -------- Gọi nhân viên -------- */
// TODO (nâng cấp sau): thay console.log bằng gửi email / LINE Notify /
// Telegram bot / lưu vào dashboard quản lý. Giữ nguyên chữ ký hàm này
// (senderId, lang, lastMessage) để dễ cắm thêm code gửi thông báo thật
// mà không phải sửa chỗ khác.
function notifyStaff(senderId, lang, lastMessage) {
  console.log("🚨 STAFF NEEDED");
  console.log("Customer ID:", senderId);
  console.log("Language:", lang);
  console.log("Time:", new Date().toLocaleString("vi-VN"));
  console.log("Last message:", lastMessage);
}

async function callStaff(senderId) {
  const state = getState(senderId);
  const lang = state.lang || "vi";

  notifyStaff(senderId, lang, state.lastMessage);

  await sendMessage(senderId, translations[lang].staffMessage);
  await sendMainOptions(senderId);
}

/* ============================================================
   10. ĐIỀU HƯỚNG THEO PAYLOAD (nút bấm / quick reply)
   ============================================================ */
async function handlePayload(senderId, payload) {
  switch (payload) {
    case "LANG_VI":
      await setLanguage(senderId, "vi");
      break;
    case "LANG_EN":
      await setLanguage(senderId, "en");
      break;
    case "LANG_JA":
      await setLanguage(senderId, "ja");
      break;
    case "SHOW_MENU":
      await showMenu(senderId);
      break;
    case "SHOW_OPEN_HOURS":
      await showOpeningHours(senderId);
      break;
    case "SHOW_CLOSE_TIME":
      await showClosingTime(senderId);
      break;
    case "BOOK_TABLE":
      await startBooking(senderId);
      break;
    case "SHOW_LOCATION":
      await showLocation(senderId);
      break;
    case "CALL_STAFF":
      await callStaff(senderId);
      break;
    case "CHANGE_LANGUAGE":
      await promptChangeLanguage(senderId);
      break;
    default:
      await sendGreeting(senderId);
  }
}

/* ============================================================
   11. XỬ LÝ TIN NHẮN GÕ TAY (free text)
   ============================================================ */
async function handleFreeText(senderId, text) {
  const state = getState(senderId);
  state.lastMessage = text;

  const action = detectAction(text);

  // Chưa chọn ngôn ngữ hoặc khách chào -> luôn hiện lại màn chọn ngôn ngữ
  if (!state.lang || action === "greeting") {
    await sendGreeting(senderId);
    return;
  }

  // Đang trong luồng đặt bàn -> mọi tin nhắn tiếp theo đều là câu trả lời cho bước hiện tại
  if (state.bookingStep !== null) {
    await handleBookingStep(senderId, text);
    return;
  }

  const actionToPayload = {
    menu: "SHOW_MENU",
    hours: "SHOW_OPEN_HOURS",
    close: "SHOW_CLOSE_TIME",
    location: "SHOW_LOCATION",
    book: "BOOK_TABLE",
    staff: "CALL_STAFF",
    lang: "CHANGE_LANGUAGE"
  };

  if (action && actionToPayload[action]) {
    await handlePayload(senderId, actionToPayload[action]);
    return;
  }

  // Không hiểu -> fallback + gửi lại quick replies
  await sendMessage(senderId, translations[state.lang].fallback);
  await sendMainOptions(senderId);
}

/* ============================================================
   12. ĐẦU MỐI XỬ LÝ 1 SỰ KIỆN MESSENGER
   ============================================================ */
async function handleMessagingEvent(event) {
  const senderId = event.sender.id;

  // Trường hợp 1: khách bấm quick reply (message.quick_reply.payload)
  if (event.message && event.message.quick_reply) {
    await handlePayload(senderId, event.message.quick_reply.payload);
    return;
  }

  // Trường hợp 2: khách gõ tin nhắn văn bản thường
  if (event.message && event.message.text) {
    await handleFreeText(senderId, event.message.text);
    return;
  }

  // Trường hợp 3: khách bấm nút postback (ví dụ nút "Get Started")
  if (event.postback && event.postback.payload) {
    await handlePayload(senderId, event.postback.payload);
    return;
  }
}

/* ============================================================
   13. ROUTES
   ============================================================ */

// GET /webhook — xác minh webhook với Facebook (chỉ chạy 1 lần khi setup)
app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    console.log("✅ Webhook đã được Facebook xác minh.");
    res.status(200).send(challenge);
  } else {
    console.log("❌ Xác minh webhook thất bại — kiểm tra lại VERIFY_TOKEN.");
    res.sendStatus(403);
  }
});

// POST /webhook — nhận tin nhắn thật từ Messenger
app.post("/webhook", (req, res) => {
  const body = req.body;

  if (body.object !== "page") {
    return res.sendStatus(404);
  }

  body.entry.forEach(entry => {
    const event = entry.messaging && entry.messaging[0];
    if (event) {
      // Không await ở đây để trả 200 cho Facebook thật nhanh;
      // xử lý và gửi trả lời chạy ngầm phía sau.
      handleMessagingEvent(event).catch(err => console.error("Lỗi xử lý tin nhắn:", err));
    }
  });

  res.status(200).send("EVENT_RECEIVED");
});

app.get("/", (req, res) => {
  res.send(`${restaurantInfo.name} Messenger backend đang chạy ✅`);
});

/* ============================================================
   14. KHỞI ĐỘNG SERVER
   ============================================================ */
const server = app.listen(PORT, () => {
  console.log(`🍻 ${restaurantInfo.name} backend đang chạy ở http://localhost:${PORT}`);
  console.log("   GET  /webhook  -> xác minh Facebook");
  console.log("   POST /webhook  -> nhận tin nhắn Messenger");
});

server.on("error", err => {
  if (err.code === "EADDRINUSE") {
    console.error(`\n❌ Cổng ${PORT} đang bị chiếm bởi tiến trình khác.`);
    console.error("   Đóng terminal đang chạy server cũ (Ctrl+C), hoặc:");
    console.error(`   netstat -ano | findstr :${PORT}   rồi   taskkill /PID <pid> /F`);
    process.exit(1);
  } else {
    throw err;
  }
});
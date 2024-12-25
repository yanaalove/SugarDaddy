// global.d.ts
interface TelegramWebApp {
  initDataUnsafe?: {
    user?: {
      id: number;
      username: string;
      // يمكنك إضافة المزيد من الخصائص حسب الحاجة
    };
  };
}

interface Window {
  Telegram: {
    WebApp: TelegramWebApp;
  };
}

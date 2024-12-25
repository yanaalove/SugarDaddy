import { Telegraf, Markup } from 'telegraf';

// تعريف أنواع البيانات المطلوبة
interface PostRequestBody {
  userId: string;
}

export async function POST(req: Request): Promise<Response> {
  try {
    const { userId }: PostRequestBody = await req.json(); // قراءة البيانات المرسلة

    if (!userId) {
      return new Response('Missing userId', { status: 400 });
    }

    const bot = new Telegraf(process.env.BOT_TOKEN || '');

    // إنشاء لوحة المفاتيح مع زر يحتوي على رابط الموقع
    const keyboard = Markup.inlineKeyboard([
      Markup.button.url('Open the App', process.env.APP_URL || ''),
    ]);

    // إرسال الرسالة للمستخدم مع الزر
    await bot.telegram.sendMessage(
      userId,
      "Mining session completed! Don't forget to collect your points.",
      {
        reply_markup: keyboard.reply_markup,
      }
    );

    return new Response('Notification sent successfully.', { status: 200 });
  } catch (error) {
    console.error('Failed to send notification:', error);
    return new Response('Failed to send notification.', { status: 500 });
  }
}


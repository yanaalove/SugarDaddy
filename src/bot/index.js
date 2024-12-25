import { Telegraf, Markup } from "telegraf"; 
import dotenv from "dotenv"; 
import express from "express"; 
import cors from "cors"; // استيراد مكتبة cors
import { URL } from "url"; 

dotenv.config(); 

const app = express(); // إنشاء تطبيق Express

// إعداد CORS للسماح بالطلبات من مصدر الواجهة
app.use(
  cors({
    origin: process.env.APP_URL, // السماح بالطلبات من URL الخاص بالواجهة
  })
);

function launchBot() {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  listenToCommands(bot);
  bot.launch().then(() => console.log("Bot launched"));
  enableGracefulStop(bot);
  return bot;
}

function listenToCommands(bot) {
  bot.use((ctx, next) => {
    if (ctx.chat?.type !== "private") {
      return ctx.reply("This bot only works in private chats.");
    }
    return next();
  });

  bot.start(async (ctx) => {
    try {
      const appUrl = new URL(process.env.APP_URL);
      const keyboard = Markup.inlineKeyboard([
        Markup.button.webApp("Collect Riches", appUrl.href),
      ]);

      await ctx.reply("Click the button below to open the app.", {
        reply_markup: keyboard.reply_markup,
      });
    } catch (error) {
      console.error("Error in /start command:", error);
    }
  });

  bot.help(async (ctx) => {
    try {
      await ctx.reply("Run the /start command to use the mini app.");
    } catch (error) {
      console.error("Error in /help command:", error);
    }
  });

  // إضافة دالة لإرسال إشعار عند انتهاء الجلسة
  bot.on('miningSessionComplete', async (ctx) => {
    try {
      const keyboard = Markup.inlineKeyboard([
        Markup.button.webApp('Collect Points', process.env.APP_URL),
      ]);
      await ctx.reply('Mining session completed! Click below to collect your points.', {
        reply_markup: keyboard.reply_markup,
      });
    } catch (error) {
      console.error('Error sending mining session complete message:', error);
    }
  });
  
}

function enableGracefulStop(bot) {
  process.once("SIGINT", () => bot.stop("SIGINT"));
  process.once("SIGTERM", () => bot.stop("SIGTERM"));
}

launchBot();

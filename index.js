const google_bard_api = require('bard-ai-google')
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
require('dotenv').config();

const bard_cookie = process.env.BARD_COOKIE;
const bot_token = process.env.BOT_TOKEN;
const bot = new Telegraf(bot_token);


function convertToPlainText(formattedText) {
  // Replace asterisks with bullet points
  const bulletedText = formattedText.replace(/\*\s/g, '- ');

  // Replace double backslashes with a single space
  const singleSpaceText = bulletedText.replace(/\ \ \\ /g, ' ');

  // Remove double backslashes
  const plainText = singleSpaceText.replace(/\ \\ /g, '');

  return plainText.trim();
}


bot.start((ctx) => ctx.reply(`Welcome ${ctx.chat.first_name} ask me anything`));
bot.help((ctx) => ctx.reply('Send me a sticker'));
bot.on(message('sticker'), (ctx) => ctx.reply('Do not send sticker or media 👍'));
bot.on(message('audio'), (ctx) => ctx.reply('Do not send sticker or media 👍'));
bot.on(message('animation'), (ctx) => ctx.reply('Do not send sticker or media 👍'));


bot.on('text', async (ctx) => {
  const messageText = ctx.message.text; // Get the user's message
  
  try {
    // Set typing status before fetching data
    await ctx.replyWithChatAction('typing');
    
    // Fetch data using the google_bard_api function
    const data = await google_bard_api(messageText, bard_cookie);
  
    // Send the fetched data as a message
    await ctx.telegram.sendMessage(ctx.message.chat.id, convertToPlainText(data));
  } catch (error) {
    // Send the error message to the user
    await ctx.telegram.sendMessage(ctx.message.chat.id, `An error occurred while fetching data. ${error}`);
  }
});

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

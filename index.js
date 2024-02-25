const TelegramBot = require("node-telegram-bot-api");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const token = "7011738092:AAGxceHmxCaP17vkWt3J2ijsVM55l1gHou4";

//bot using 'polling' to get new updates
const bot = new TelegramBot(token, { polling: true });

//setup the model for gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_TOKEN);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

//the start command, matches /start
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Hello " +
      msg.from.first_name +
      ". I am the telegram bot that uses Gemini to reply to your queries. Please write your query in the message box."
  );
});

//for all messages
bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  if (msg.text !== "") {
    const query = msg.text;

    // send the query to the model
    const result = await model.generateContent(query);
    const response = await result.response;
    const text = response.text();
    await bot.sendMessage(chatId, text);
  }
});

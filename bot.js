require("dotenv").config();
const { Bot } = require("grammy");

const bot = new Bot(process.env.TELEGRAM_BOT_TOKEN);

//bot is going to be in the group chat with udume,
//when it recieves a message for udume,
//it will intercept the message from udu,
//parse the message for px1 and tx1 on sol
// send a new message format to me
// then i can decide if i want to buy the token orr not

function containsSolanaTokenAddress(message) {
  const solanaAddressPattern = /[1-9A-HJ-NP-Za-km-z]{32,44}/g;
  const matches = message.match(solanaAddressPattern);
  return matches ? matches : [];
}

function parseMessage(message) {
  const tokenPattern = /🏦 Token: ([a-zA-Z0-9]+)/;
  const modelPattern = /🧠 Model: ([\w\s]+)/;
  const namePattern = /📈 (.+?) \| Analysis/;

  const tokenMatch = message.match(tokenPattern);
  const modelMatch = message.match(modelPattern);
  const nameMatch = message.match(namePattern);

  const token = tokenMatch ? tokenMatch[1] : null;
  const model = modelMatch ? modelMatch[1].trim() : null;
  const name = nameMatch ? nameMatch[1].trim() : null;

  return { token, model, name };
}

bot.on("message", async (ctx) => {
  //get message
  const message = ctx.message.text;

  // check for solana token parttern
  const tokens = containsSolanaTokenAddress(message);
  // parse out name, model, and token name
  if (tokens.length > 0) {
    const parsedMessage = parseMessage(message);
    const { token, model, name } = parsedMessage;

    if (token) {
      await bot.api.sendMessage(
        process.env.DESTINATION_CHAT_ID,
        `🆘 New Solana Call! ${name} ${model} ⬇️`
      );
      await bot.api.sendMessage(process.env.DESTINATION_CHAT_ID, token);
    }
  }
});

bot.start();

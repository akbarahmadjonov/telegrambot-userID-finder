require("dotenv/config");
const { Bot, InlineKeyboard, Keyboard } = require("grammy");
const Io = require("./utils/Io");
const Users = new Io("./db/users.json");

const bot = new Bot(process.env.TOKEN);

//* Shows developers
bot.command("behindscene", async (ctx) => {
  await ctx.reply("Developed by @akbarahmadjonov, feel free to contact.");
});

//* Bugs are accepted list
bot.command("forbugs", async (ctx) => {
  await ctx.reply(
    "Bugs are openly accepted, usually responds within an hour: @akbarahmadjonov"
  );
});

//* SENDING ID
bot.command("start", async (ctx) => {
  // Accepts ID from user
  const userId = ctx.from.id;

  // Accepts ID and username from request body
  const { id, username } = ctx.from;

  // Checks if there is text in request body
  const message = ctx.from.message?.text;

  // Check if there is user already in database if not creates
  const userData = await Users.read();
  const user = Array.isArray(userData) ? userData : [];

  // Stores user data and pushes to database
  const newUser = {
    id: id,
    username: username,
    message: message,
  };

  // Filter out existing users
  const filteredUser = user.find((user) => user.id === id);

  // If user not exists, pushes data and create
  if (!filteredUser) {
    user.push(newUser);
    await Users.write(user);
  }

  // Sends message to the user
  const replyMessage = `Welcome back again! Your ID is <b>${userId}</b>`;
  const replyMessageForwarded = `Hi! My ID is ${userId}`;

  // Show forward message to user
  const inlineKeyboard = new InlineKeyboard().url(
    "Share your ID with your network",
    `https://t.me/share/url?url=${encodeURIComponent(replyMessageForwarded)}`
  );

  await ctx.reply(replyMessage, {
    reply_markup: inlineKeyboard,
    parse_mode: "HTML",
  });

  await ctx.reply(
    "How would you rate our service, please rate between 0 and 5"
  );

  console.log(ctx.message);

  if (ctx.message.text == "0") {
    console.log(ctx);
    await ctx.reply("What would you want us to improve? or what was wrong?");
  } else if (ctx.message.text >= "5") {
    await ctx.reply(
      "Thanks for replying, please share our service with your friends"
    );
  } else {
    console.log(ctx.message.text);
  }
});

bot.catch((error) => console.log(error));
bot.start();

const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");
const fs = require("fs");

client.on("ready", () => {
  console.log("bleep bloop! It's showtime.");
});

const prefix = config.prefix;

client.on("message", (message) => {

  if (!message.content.startsWith("/r/" || "r/") || message.author.bot) return;

  if(message.content.startsWith("/r/")) {
    message.channel.send({embed: {
      color: 53380,
      description: `[**${message.content}**](http://www.reddit.com/${message.content})`
    }});
  } else

  if(message.content.startsWith("r/")) {
    message.channel.send({embed: {
      color: 53380,
      description: `[**${message.content}**](http://www.reddit.com/${message.content})`
    }});
  }
  
});

client.on("message", (message) => {

  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "asl") {
    let [age,sex,location] = args;
    message.channel.send(`Hello **${message.author.username}**, I see you're a **${age}** year old **${sex}** from **${location}**.`);
  } else

  if (command === "prefix") {

    if(message.author.id !== config.ownerID) return;

    let [newPrefix] = args;  
    config.prefix = newPrefix
    fs.writeFile("./config.json", JSON.stringify(config), (err) => console.error);

    message.channel.send(`Prefix has been updated to **${newPrefix}** !`);
    console.log(`${message.author.username} [${message.author.id}] has updated the prefix to ${newPrefix}`);
  } else

  if(command === "blah") {
    message.channel.send("Meh.");
  } else

  if(command === "ping") {
    message.channel.send("pong!");
  } else

  if(command === "marco") {
    message.channel.send("polo!");
  } else

  if(command === "ready") {
    message.channel.send("I am ready!");
  } else

  if(command === "owner") {
    message.channel.send("theLAZYmd#2353");
  } else

  if(command === "help") {
    message.channel.send("This is a pretty basic bot, there isn't much it can help you with.");
  } else

  if(command === "who") {
    message.channel.send("I am LAZYbot#2309");
  }

});

client.login(config.token);


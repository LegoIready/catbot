const http = require("http");
const app = require("express")();
const Discord = require("discord.js");
const db = require("quick.db");
const client = new Discord.Client();
client.on("ready", () => {
  client.user.setActivity("%help", { type: "PLAYING" });
})
client.on("message", message => {
  if (db.has(`${message.guild.id}.prefix`)) {
    var bar0 = db.get(`${message.guild.id}.prefix`);
  } else {
    var bar0 = "%";
  }
  if (db.has(`${message.guild.id}.name`)) {
    var bar1 = db.get(`${message.guild.id}.name`);
  } else {
    var bar1 = "CatBot";
  }
  if (message.content.indexOf(bar0) === 0) {
    let args = message.content.split(" ");
    let command = args
      .splice(0, 1)
      .toString()
      .slice(bar0.length).toLowerCase();
    switch (command) {
      case "help":
        message.channel
          .send(`Welcome to CatBot by Rose! This bot is your server's virtual pet cat.

*Example: ${bar0}command <option1|option2> <required> [optional]*

\`${bar0}help\`
Displays this help page.

\`${bar0}prefix <prefix>\`
Set a custom prefix for your server's CatBot.

\`${bar0}name <name>\`
Sets the name of your server's CatBot.

\`${bar0}pet\`
Pet your server's CatBot. CatBot likes pets often, but not *too* often. Try to pace yourself! Petting makes CatBot more likely to come up to you randomly or engage in other activities with you.

\`${bar0}wipe <server|account>\`
Wipe all CatBot data for this server or for your account on this server.

Join the CatBot support server!
https://discord.gg/gV2MFGJ

*By using this bot you agree to have your server ID and account ID saved. If you do not agree to this, do not use this bot. Server IDs are saved when CatBot's settings for this server are changed. Account IDs are ONLY saved for people who use CatBot's commands. No data is saved for ${bar0}help.*`);
        break;
      case "prefix":
        if (args[0]) {
          db.set(`${message.guild.id}.prefix`, args[0]);
          message.channel.send(
            `Success! Your server's prefix is now \`${args[0]}\``
          );
        }
        break;
      case "name":
        if (args[0]) {
          db.set(`${message.guild.id}.name`, args[0]);
          message.guild.me.setNickname(args[0]);
          message.channel.send(
            `Success! Your server's CatBot is now named ${args[0]}.`
          );
        }
        break;
      case "pet":
        if (db.has(`${message.guild.id}.${message.author.id}.cool`)) {
          if (Date.now() - db.get(`${message.guild.id}.${message.author.id}.cool`) <= 60000) {
            db.subtract(`${message.guild.id}.${message.author.id}
            .like`, 1);
            db.set(`${message.guild.id}.${message.author.id}.cool`, Date.now());
            message.channel.send(`*scratch!*
Give ${bar1} some personal space! Try petting again later.`);
          } else {
            db.add(`${message.guild.id}.${message.author.id}.pets`, 1);
            db.add(`${message.guild.id}.${message.author.id}.like`, 1);
            db.set(`${message.guild.id}.${message.author.id}.cool`, Date.now());
            message.channel.send(
              `*purrrrrrr*

You have petted ${bar1} ${db.get(
                `${message.guild.id}.${message.author.id}.pets`
              )} times.`
            );
          }
        }
        break;
      case "wipe":
        if (typeof args[0] === "undefined") {
          message.channel.send(`Incorrect usage.
\`${bar0}wipe <server|account>\``);
        } else {
          if (args[0].toLowerCase() === "server") {
            if (typeof args[1] === "undefined") {
              message.channel.send(`Are you sure? All information about your server and all CatBot settings will be lost.
\`${bar0}wipe server confirm\``);
            } else {
              if (args[1].toLowerCase() === "confirm") {
                if (db.has(message.guild.id)) {
                  db.delete(message.guild.id);
                }
                message.channel.send("Success! All server data deleted.");
                message.guild.me.setNickname("");
              } else {
                message.channel.send(`Incorrect usage.
\`${bar0}wipe server confirm\``);
              }
            }
          }
          else if (args[0].toLowerCase() === "account") {
            if (typeof args[1] === "undefined") {
              message.channel.send(`Are you sure? All information about your CatBot activity on this server will be deleted.
\`${bar0}wipe account confirm\``);
            } else {
              if (args[1].toLowerCase() === "confirm") {
                if (db.has(`${message.guild.id}.${message.author.id}`)) {
                  db.delete(`${message.guild.id}.${message.author.id}`);
                }
                message.channel.send("Success! All account data for this server deleted.");
              } else {
                message.channel.send(`Incorrect usage.
\`${bar0}wipe account confirm\``);
              }
            }
          }
        }
    }
  }
});

client.login(process.env.TOKEN);
app.get("/", (req, res) => {
  res.statusCode = 200;
  console.log(new Date().toString());
  res.send("Pong");
});
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
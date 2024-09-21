const dotenv = require("dotenv");
dotenv.config();
const { Client, GatewayIntentBits } = require("discord.js");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits,
  ],
});

// when the bot is ready
client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// kick user
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!kick")) {
    if (!message.member.permissions.has("KICK_MEMBERS")) {
      return message.reply("You do not have permission to kick members.");
    }

    const member = message.mentions.members.first();
    if (!member) {
      return message.reply("Please mention a valid member.");
    }

    try {
      await member.kick();
      message.channel.send(`${member.user.tag} has been kicked.`);
    } catch (error) {
      message.channel.send("I was unable to kick a member.");
      console.error(error);
    }
  }
});

// ban specific member

client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!ban")) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have any permission to ban members.");
    }
  }

  const member = message.mentions.members.first();
  if (!member) {
    return message.reply("Member doesn't exist.");
  }

  try {
    await member.ban();
    message.channel(`${member.user.tag} has been banned.`);
  } catch (error) {
    message.channel.send("Please mention a valid member.");
    console.error(error);
  }
});

// unban specific member
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!unban")) {
    if (!message.member.permissions.has("BAN_MEMBERS")) {
      return message.reply("You don't have any permission to unban members.");
    }
  }
});

// assign a role to a member
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!role")) {
    if (!message.member.permissions.has("MANAGE_ROLES")) {
      return message.reply("You don't have any permission to assign roles.");
    }

    const member = message.mentions.members.first(); //find the person first that is mentioned
    const roleName = message.content.split(" ").slice(2).join(" ");
    const role = message.guild.roles.cache.find(
      (role) => role.name === roleName,
    );

    if (!member || !role) {
      return message.reply("Please mention a valid member and a valid role.");
    }

    await member.roles.add(role);
    message.channel.role(`Assigned role: ${roleName}, to ${member.user.tag}.`);
  }
});

// admin create channel
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!create-channel")) {
    if (!message.member.permissions.has("MANAGE_CHANNELS")) {
      return message.reply(
        "You don't have the permission to create a channel.",
      );
    }
  }
});

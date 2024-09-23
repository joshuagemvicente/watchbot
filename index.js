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
    if (!message.member.permissions.has("KickMembers")) {
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
    if (!message.member.permissions.has("BanMembers")) {
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
    if (!message.member.permissions.has("BanMembers")) {
      return message.reply("You don't have any permission to unban members.");
    }
  }
});

// assign a role to a member
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!role")) {
    if (!message.member.permissions.has("ManageRoles")) {
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
    if (!message.member.permissions.has("ManageChannels")) {
      return message.reply(
        "You don't have the permission to create a channel.",
      );
    }
    const channelName = message.content.split(" ");
    if (!channelName) {
      return message.reply("Please provide a channel name.");
    } else if (channelName) {
      return message.reply("Channel already exists.");
    }

    await message.guild.channels.create(channelName, { type: "GUILD_TEXT" });
    message.channel.send(`Channel ${channelName} has been created.`);
  }
});

// lock channel
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!lock")) {
    if (!message.member.permissions.has("ManageChannels")) {
      return message.reply("You don't have any permissions to lock channels.");
    }

    await message.channel.permissionOverwrites.edit(
      message.guild.roles.everyone,
      { SEND_MESSAGES: false },
    );
    message.channel.send("Channel has been locked.");
  }
});

// unlock channel
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!unlock")) {
    if (!message.member.permissions.has("ManageChannels")) {
      return message.reply("You don't any permissions to unlock channels.");
    }

    try {
      await message.channel.permissionOverwrites.edit(
        message.guild.roles.everyone,
        { SEND_MESSAGES: true },
      );
      message.channel.send("Channel has been unlocked.");
    } catch (error) {
      console.error(error);
      return message.reply("Unable to unlock a channel.");
    }
  }
});

// set nickname
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!setnick")) {
    if (!message.member.permissions.has("ManageNicknames")) {
      return message.reply("You don't have any permissions to set nicknames.");
    }
  }

  const member = message.mentions.members.first();
  const newNickname = message.content.split(" ").slice(2).join(" ");

  if (!member || !newNickname) {
    return message.reply(
      "Please mention a valid name and provide a new nickname.",
    );
  }
  try {
    await member.setNickname(newNickname);
    message.channel.send(
      `Nickname for ${member.user.tag} has been changed to ${newNickname}`,
    );
  } catch (error) {
    message.reply(
      "I was unable to set the nickname. Maybe the user has a higher role.",
    );
    console.log(error);
  }
});

// remove nickname
client.on("messageCreate", async (message) => {
  if (message.content.startsWith("!rmnick")) {
    if (!message.member.permissions.has("ManageNicknames")) {
      return message.reply(
        "You don't have any permissions to remove nicknames.",
      );
    }

    const member = message.mentions.members.first();

    if (!member) {
      return message.reply(
        "Please enter a valid member to remove their nickname.",
      );
    }

    try {
      await member.setNickname("");
      message.channel.send(`Nickname for ${member.user.tag} has been removed.`);
    } catch (error) {
      message.reply(
        "I was unable to remove the nickname. Maybe the user has a higher role?",
      );
      console.error(error);
    }
  }
});

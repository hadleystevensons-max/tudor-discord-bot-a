// index.js
const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require('discord.js');

// ----------------------
// CONFIG
// ----------------------
const token = 'MTQ4NzQ1MTc1NTgxNzA3NDc0OQ.Ga6ukI.LOuCpN9MGnkA4dzv5QZoUCG7erS6dKeUSd20vw';
const clientId = '1487451755817074749';
const guildId = '1474559251149226177';

// ----------------------
// DEFINE COMMANDS
// ----------------------
const commands = [
  new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Replies with Pong!'),

  new SlashCommandBuilder()
    .setName('hello')
    .setDescription('Greets the user'),

  new SlashCommandBuilder()
    .setName('add')
    .setDescription('Adds two numbers')
    .addNumberOption(option =>
      option.setName('num1')
            .setDescription('First number')
            .setRequired(true))
    .addNumberOption(option =>
      option.setName('num2')
            .setDescription('Second number')
            .setRequired(true)),

  new SlashCommandBuilder()
    .setName('say')
    .setDescription('Repeats your message')
    .addStringOption(option =>
      option.setName('message')
            .setDescription('The message to repeat')
            .setRequired(true)),
    
  new SlashCommandBuilder()
    .setName('dm')
    .setDescription('Sends a private message to a user')
    .addUserOption(option =>
        option.setName('target')
        .setDescription('The user to DM')
        .setRequired(true))
    .addStringOption(option =>
        option.setName('message')
            .setDescription('The user to DM')
            .setRequired(true))
    
].map(cmd => cmd.toJSON()); // <-- convert to JSON for Discord API

// ----------------------
// REGISTER COMMANDS
// ----------------------
const rest = new REST({ version: '10' }).setToken(token);

(async () => {
  try {
    console.log('Refreshing slash commands...');
    await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      { body: commands }
    );
    console.log('Slash commands registered successfully!');
  } catch (error) {
    console.error(error);
  }
})();

// ----------------------
// CREATE CLIENT
// ----------------------
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

// ----------------------
// HANDLE INTERACTIONS
// ----------------------
client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  const { commandName, options } = interaction;

  if (commandName === 'ping') {
    await interaction.reply('Pong!');
  } else if (commandName === 'hello') {
    await interaction.reply(`Hello, ${interaction.user.username}!`);
  } else if (commandName === 'add') {
    const num1 = options.getNumber('num1');
    const num2 = options.getNumber('num2');
    await interaction.reply(`The sum is ${num1 + num2}`);
  } else if (commandName === 'say') {
    const message = options.getString('message');
    await interaction.reply(message);
  } else if (commandName === 'dm'){
    const target = options.getUser('target');
    const dmMessage = options.getString('message');

    try{
        await target.send(dmMessage);
        await interaction.reply({ content: `Message sent to ${target.username}!`, ephemeral: true });
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: `Could not DM ${target.username}.`, ephemeral: true });

    }
  }
});

// ----------------------
// LOGIN
// ----------------------
client.login(token);

//require the module of the richpresence
var RPC = require("discord-rpc");
var rpc = new RPC.Client({
  transport: "ipc"
});

//thats just decoration
require("colors");

//require the config file for all of the settings
var config = require("../config.json")

//A Map for us | for the cooldowns ;)
let map = new Map();

//Check the config.json file
if (config.CLIENT_ID.length != 18) throw new SyntaxError("ERROR! PLEASE ENTER A VALID CLIENT_ID")
if (config.rpc_activity.buttons.length > 2) throw new SyntaxError("THE MAXIMUM AMOUNT OF BUTTONS IS 2")

if(config.rpc_activity.buttons.length == 2) {
	try {
	  const stringlength = 100;
	  console.log("\n")
	  console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
	  console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
	  console.log(`     ┃ `.bold.brightGreen + `Noticed that you have 2 Buttons, don't freak out when you click on them that nothing happens!`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Noticed that you have 2 Buttons, don't freak out when you click on them that nothing happens!`.length) + "┃".bold.brightGreen)
	  console.log(`     ┃ `.bold.brightGreen + `It'll work if someone else clicks on them. (Maybe it'll be fixxed soon)!`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `It'll work if someone else clicks on them. (Maybe it'll be fixxed soon)!`.length) + "┃".bold.brightGreen)
	  console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
	  console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
	} catch {
	  /* */ }	
}

//function for looping through the config.json and checking if there is any change if so then re apply the rpc
const fs = require('fs');
const configfilepath = './config.json';

//Log information
try {
  const stringlength = 69;
  console.log("\n")
  console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
  console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
  console.log(`     ┃ `.bold.brightGreen + `Watching for file changes on ${configfilepath}`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `Watching for file changes on ${configfilepath}`.length) + "┃".bold.brightGreen)
  console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
  console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
} catch {
  /* */ }

//watch the config file for changes
fs.watch(configfilepath, (event, filename) => {
  if (filename) {
    //if no cooldown set one
    if (!map.has("cooldown")) {
      //set a cooldown
      map.set("cooldown")
      //reapply the config cariable with the new file
      config = require("../config.json");
      //set the new rpc 
      set_rpc("re")
      //delete the cooldown after 200ms
      setTimeout(() => {
        map.delete("cooldown")
      }, 200)
    }
  }
});

//once the rich presence got ready, set it
rpc.on("ready", () => {
  //set the rich presence
  set_rpc() 
  //LOOP FOR FOR each 60 seconds
  setTimeout( () => {
    set_rpc();
  }, 60e3)

  //log that it's ready
  try {
    const stringlength = 69;
    console.log("\n")
    console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + `  Discord Rich Presence Ready | made by milrato.eu`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `  Discord Rich Presence Ready | made by milrato.eu`.length) + "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + `  |-> ${`Displaying for: `.magenta}${rpc.user.username}#${rpc.user.discriminator}`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `  |-> Displaying for: ${rpc.user.username}#${rpc.user.discriminator}`.length) + "┃".bold.brightGreen)
    console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
    console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
  } catch {
    /* */ }
});


//login to the rich presence tool
rpc.login({
  clientId: config.CLIENT_ID,
})


//function for calling the rich presence
async function set_rpc(option) {
  //if not on cooldown
  if (!map.has("rpccooldown")) {
    //set the cooldown
    map.set("rpccooldown")
    //if its a reapply from the config.json file change
    if (option == "re") {
      //log it in the console
      try {
        const stringlength = 69;
        console.log("\n")
        console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + `  Discord Rich Presence Changed - Reapplied | made by milrato.eu`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `  Discord Rich Presence Changed - Reapplied | made by milrato.eu`.length) + "┃".bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + `  |-> ${`Displaying for: `.magenta}${rpc.user.username}#${rpc.user.discriminator}`.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length - `  |-> Displaying for: ${rpc.user.username}#${rpc.user.discriminator}`.length) + "┃".bold.brightGreen)
        console.log(`     ┃ `.bold.brightGreen + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightGreen)
        console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightGreen)
      } catch {
        /* */ }
    }
    //set the activity
    await rpc.setActivity(config.rpc_activity)
    //delete the cooldown after some 15000ms (15 seconds)
    setTimeout(() => {
      map.delete("rpccooldown");
    }, 15000)
  }
  //if on cooldown
  else {
    //log information
    try {
      const stringlength = 69;
      console.log("\n")
      console.log(`     ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓`.bold.brightRed)
      console.log(`     ┃ `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightRed)
      console.log(`     ┃ `.bold.brightRed + `  COULD NOT CHANGE THE RPC, cause YOU ARE ON COOLDOWN`.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length - `  COULD NOT CHANGE THE RPC, cause YOU ARE ON COOLDOWN`.length) + "┃".bold.brightRed)
      console.log(`     ┃ `.bold.brightRed + " ".repeat(-1 + stringlength - ` ┃ `.length) + "┃".bold.brightRed)
      console.log(`     ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛`.bold.brightRed)
    } catch {
      /* */ }
  }
}

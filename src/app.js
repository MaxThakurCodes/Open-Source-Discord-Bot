const dialogflow = require("@google-cloud/dialogflow");
const uuid = require("uuid");
require("dotenv").config();
const Discord = require("discord.js"),
  client = new Discord.Client();

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}`);
  console.log(`Ready!`);
  client.user.setActivity("Max code", { type: "WATCHING" });
});

/**
 * Send a query to the dialogflow agent, and return the query result.
 * @param {string} projectId The project to be used @param {string} msg
 */
async function runSample(projectId, msg) {
  // A unique identifier for the given session
  const sessionId = uuid.v4();
  // Create a new session
  const sessionClient = new dialogflow.SessionsClient();
  const sessionPath = sessionClient.projectAgentSessionPath(
    projectId,
    sessionId
  );

  // The text query request.
  const request = {
    session: sessionPath,
    queryInput: {
      text: {
        text: msg,
        languageCode: "en",
      },
    },
  };

  // Send request and log result
  const responses = await sessionClient.detectIntent(request);
  const result = responses[0].queryResult;
  console.log(responses[0].queryResult.fulfillmentMessages[0]);
  return result;
}

client.on("message", async (message) => {
  if (message.author.bot) return;
  let res = await runSample("newagent-oela", message.content);
  console.log(res.fulfillmentText.toString());
  message.reply(res.fulfillmentText);
});

client.login(process.env.TOKEN);

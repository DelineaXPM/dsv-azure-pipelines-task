import ma = require('azure-pipelines-task-lib/mock-answer');
import tmrm = require('azure-pipelines-task-lib/mock-run');
import path = require('path');

/**
 * Create the following configuration with valid client id, secret
 * id, tenant and secret path.
 */
const config = require("./success_config.json");

let taskPath = path.join(__dirname, '..', 'index.js');
let tmr: tmrm.TaskMockRunner = new tmrm.TaskMockRunner(taskPath);

tmr.setInput('ClientId', config.credentials.clientId);
tmr.setInput('ClientSecret', config.credentials.clientSecret);
tmr.setInput('ServerUrl', config.serverUrl);
tmr.setInput('SecretPath', config.secretPath);
tmr.setInput('VariablePrefix', config.variablePrefix);

tmr.run();

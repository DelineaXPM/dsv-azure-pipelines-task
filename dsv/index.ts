import tl = require('azure-pipelines-task-lib/task');
import path = require("path");

import { VaultTaskParameters } from './models/VaultTaskParameters';
import { Vault } from './operations/Vault';
import { Secret } from './models/Secret';

async function run() {
    try {

        /**
         * Initialization.
         */
        const taskManifestPath = path.join(__dirname, "task.json");
        tl.debug("Setting resource path to " + taskManifestPath);
        tl.setResourcePath(taskManifestPath);

        /**
         * Get task parameters and create our vault from
         * the resulting configuration. 
         */
        const vaultParameters = new VaultTaskParameters();
        const taskParameters = vaultParameters.getTaskParameters();
        const vault = new Vault(taskParameters.config!);

        /**
         * Make sure the secret path has been specified.
         */
        if (!taskParameters.secretPath) {
            tl.setResult(tl.TaskResult.Failed, "Secret path not specified");
            return;
        }

        /**
         * Get the secret from the vault.
         */
        let secret: Secret = await vault.getSecret(taskParameters.secretPath);
        if (!secret) {
            tl.setResult(tl.TaskResult.Failed, "Secret not found");
            return;
        }

        tl.debug("Got secret with path " + taskParameters.secretPath);

        /**
         * Get the list of data keys requested and iterate over
         * them setting a variable in the environment for each with the
         * specified variable prefix (Default: "DSV_") on each key.
         */
        let dataKeys: string[] = taskParameters.getDataKeys(secret);

        dataKeys.forEach(dataKey => {

            if (!secret.data) {
                tl.setResult(tl.TaskResult.Failed, "Secret data not found");
                return;
            }

            if (!(dataKey in secret.data)) {
                console.log(`Key '${dataKey}' not found in '${taskParameters.secretPath}'`);
            } else {
                let dataValue: any = secret.data[dataKey];
                if (!dataValue) {
                    console.log(`Value for data '${dataKey}' is undefined'`);
                } else {
                    let name: string = taskParameters.getVariableName(dataKey);
                    let type: string = typeof dataValue;
                    let value: string = (type === "object") ? JSON.stringify(dataValue) : dataValue;
                    tl.setVariable(name, value, false);
                    console.log(`Stored value of type '${type}' for key '${dataKey}' in the variable '${name}'`);
                }
            }
        });

        tl.setResult(tl.TaskResult.Succeeded, "");
    }
    catch (err) {
        console.log(err.message);
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();
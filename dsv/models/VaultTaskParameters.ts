import tl = require("azure-pipelines-task-lib/task");

import { Configuration } from "./Configuration";
import { ClientCredential } from "./ClientCredential";
import { Secret } from "./Secret";

/**
 * Represents the parameters used to create a
 * vault configuration and to specify the secret
 * and key/values to read from it.
 */
export class VaultTaskParameters {

    public config: Configuration | undefined;
    public secretPath: string | undefined;
    public dataFilter: string[] | undefined;
    public variablePrefix: string | undefined;

    /**
     * Builds the vault configuration and assigns other
     * task variables from the pipeline parameters.
     */
    public getTaskParameters(): VaultTaskParameters {
        this.config = new Configuration();
        this.config.credentials = new ClientCredential();
        this.config.serverUrl = tl.getInput("ServerUrl", false);
        this.config.credentials.clientID = tl.getInput("ClientId", true);
        this.config.credentials.clientSecret = tl.getInput("ClientSecret", true);
        this.secretPath = tl.getInput("SecretPath", true);
        this.dataFilter = tl.getDelimitedInput("DataFilter", ",", false);
        this.variablePrefix = tl.getInput("VariablePrefix", false);
        return this;
    }

    /**
     * Gets the list of data keys the task has requested.
     * @param secret used to get the list of all keys if the data filter dictates
     * @returns array of data keys to read from the secret
     */
    public getDataKeys(secret: Secret): string[] {
        if (!secret) {
            return [] as string[];
        }

        if (!secret.data) {
            return [] as string[];
        }

        if (this.getAllData()) {
            return Object.keys(secret.data);
        }

        if (!this.dataFilter) {
            return [] as string[];
        }

        return this.dataFilter;
    }

    /**
     * Gets the name to use for the variable to store the data value
     * @param dataKey is the key in the secret data
     */
    public getVariableName(dataKey: string): string {
        return this.variablePrefix ? this.variablePrefix + dataKey : dataKey;
    }

    /**
     * Determines if all the data should be read from the vault.
     * @returns true if the filter is "*" or undefined/empty, false otherwise.
     */
    private getAllData(): boolean {
        var getAllData = false;
        if (this.dataFilter && this.dataFilter.length > 0) {
            if (this.dataFilter.length === 1 && this.dataFilter[0] === "*") {
                return true;
            }
            else {
                return false;
            }
        } else {
            return true;
        }
    }
}
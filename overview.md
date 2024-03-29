# Delinea DSV Task for Azure DevOps

The task in this extension allows the retrieval of secrets for use in both Build and Release pipelines in Azure DevOps.
The task sets environment variables for the requested data keys with variable names based on the key names with an optional configured prefix.
For data values that are objects, their value will be serialized in JSON format.

## Configuration

To retrieve secrets, the task requires:

- Url for the source DevOps Secrets Vault
- Client Id
- Client Secret
- Path to the secret in the vault

It is recomended that the client secret be stored in Azure Key Vault.
Using this approach requires an additional task in the pipeline to retrieve that value first which can then be referenced as an environment variable in the DSV task configuration.

### Data Filter

Using `*` for the data filter will retrieve all data values in the secret.
A specific value (or multiple values separated by commas) can also be configured.

### Variable Prefix

Environment variable names are constructed using the configured variable prefix and the data key.
For example, with a variable prefix of `DSV_`, the secret data with key `xyz` will result in an environment variable with name `DSV_xyz`.

### YAML-based pipeline

```yaml
- task: DelineaDSV@0
  displayName: "Read the 'ado-task:pr-validation' secret from DSV"
  inputs:
    ServerUrl: 'https://example.secretsvaultcloud.com/v1/'
    ClientId: $(dsv-client-id)
    ClientSecret: $(dsv-client-secret)
    SecretPath: 'ado-task:pr-validation'
    DataFilter: '*'
    VariablePrefix: 'DSV_'
```

### Classic pipeline example

![DSV task сonfiguration](images/task-config.png)

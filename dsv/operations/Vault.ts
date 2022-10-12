import httpClient = require('typed-rest-client/HttpClient');
import ifm = require('typed-rest-client/Interfaces');

import { AccessGrant } from '../models/AccessGrant';
import { Configuration } from '../models/Configuration';
import { GrantRequest } from '../models/GrantRequest';
import { Secret } from '../models/Secret';

var _httpClient = new httpClient.HttpClient('vault-client');

/**
 * Represents a Delinea DevOps Secrets Vault.
 */
export class Vault {
  private config: Configuration;

  /**
   * @param config Configuration for the vault
   * @constructor
   */
  constructor(config: Configuration) {
    this.config = config;
  }

  /**
   * Reads a secret with the given path from the vault.
   * @param path specifies the path to the secret
   * @returns the secret as a JSON string
   */
  public async getSecret(path: string): Promise<Secret> {
    console.log(`vault.getSecret: ${path}`);
    let response: string = await this.accessResource(
      'GET',
      'secrets',
      path,
      null
    );
    let secret: Secret = JSON.parse(response);
    return secret;
  }

  /**
   * Accesses resources within the vault. Most other functionality
   * uses this method internally (e.g. see 'getSecret').
   * @param method the http method to be used (e.g. 'GET', 'POST', etc.)
   * @param resource the resource type being accessed (e.g. 'secrets', 'clients', 'roles', etc.)
   * @param path the path to the resource
   * @param input object most typically be used for 'POST' methods, null otherwise
   * @returns the resource as a JSON string
   */
  public async accessResource(
    method: string,
    resource: string,
    path: string,
    input: object | null
  ): Promise<string> {
    let url: string = this.config.formatUrl(resource, path);
    let token: string = await this.getAccessToken();
    let result: string = await this.sendRequest(method, url, input, token);
    return result;
  }

  /**
   * Sends http requests to the vault.
   * @param method the http method to be used (e.g. 'GET', 'POST', etc.)
   * @param url the request url
   * @param input object most typically be used for 'POST' methods, null otherwise
   * @param token the access token if required, empty otherwise
   * @returns the result of the request as a string
   */
  private async sendRequest(
    method: string,
    url: string,
    input: object | null,
    token: string
  ): Promise<string> {
    console.log(`vault.sendRequest: ${method} ${url}`);
    let body: string = this.getRequestContent(input);
    let headers: ifm.IHeaders = this.getRequestHeaders(token);
    let response: httpClient.HttpClientResponse = await _httpClient.request(
      method,
      url,
      body,
      headers
    );
    let result: string = await this.getResponseContent(response);
    return result;
  }

  /**
   * Serializes the given object for an http request body
   * @param input the object to be serialized, null otherwise
   * @returns the object represented as a JSON string, empty string if null
   */
  private getRequestContent(input: object | null): string {
    return input ? JSON.stringify(input) : '';
  }

  /**
   * Creates the http request headers
   * @param accessToken the access token to be used in the request or empty string
   * @returns the headers in IHeaders format for use by the client request
   */
  private getRequestHeaders(accessToken: string): ifm.IHeaders {
    let headers: ifm.IHeaders;

    if (accessToken) headers = { Authorization: 'Bearer ' + accessToken };
    else headers = {};

    return headers;
  }

  /**
   * Gets the http response body.
   * @param response the http response
   * @returns the reponse body as a string if the status code indicates success, empty string otherwise
   */
  private async getResponseContent(
    response: httpClient.HttpClientResponse
  ): Promise<string> {
    if (!this.isSuccessStatusCode(response.message.statusCode)) {
      console.log(
        `vault.getResponseContent: failed code ${response.message.statusCode}`
      );
      return '';
    }

    let body: string = await response.readBody();
    return body;
  }

  /**
   * Determines if the status code indicates success.
   * @param statusCode the status code returned by an http response
   * @returns true if the response is 200-299, false otherwise
   */
  private isSuccessStatusCode(statusCode: number | undefined): boolean {
    if (!statusCode) return false;

    if (statusCode < 200) return false;

    if (statusCode > 299) return false;

    return true;
  }

  /**
   * Gets an access token based on the vault's configured client credentials
   * @returns an access token if successful, empty string otherwise
   */
  private async getAccessToken(): Promise<string> {
    if (this.config.accessToken) {
      return this.config.accessToken;
    }

    let request: GrantRequest = {
      grant_type: 'client_credentials',
      client_id: this.config.credentials!.clientID,
      client_secret: this.config.credentials!.clientSecret,
    };

    let url: string = this.config.formatUrl('token', '');
    let response: string = await this.sendRequest('POST', url, request, '');
    let result: AccessGrant = JSON.parse(response);

    if (!result.accessToken) {
      return '';
    }

    return result.accessToken;
  }
}

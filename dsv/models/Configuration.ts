import { ClientCredential } from './ClientCredential';

/**
 * Model which defines vault configuration parameters.
 */
export class Configuration {
  credentials: ClientCredential | undefined;
  accessToken: string | undefined;
  serverUrl: string | undefined;

  /**
   * Formats the resource url.
   * @param resource the resource type
   * @param path the path to the resource
   * @returns the url to the resource
   */
  public formatUrl(resource: string, path: string): string {
    if (path) {
      path = '/' + path.replace(/^\//, '');
    }

    if (!this.serverUrl) {
      return '';
    }

    return `${this.serverUrl}${resource}${path}`;
  }
}

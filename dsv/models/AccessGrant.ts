/**
 * Model returned for grant requests.
 */
export class AccessGrant {
    accessToken: string | undefined;
    tokenType: string | undefined;
    expiresIn: number | undefined;
}
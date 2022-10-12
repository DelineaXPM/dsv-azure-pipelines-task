/**
 * Model used for token requests.
 */
export class GrantRequest {
    grant_type: string | undefined;
    client_id: string | undefined;
    client_secret: string | undefined;
}
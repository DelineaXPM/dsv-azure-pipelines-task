import { ResourceMetadata } from "./ResourceMetadata";

/**
 * Model class for DSV secret.
 */
export class Secret extends ResourceMetadata {
    attributes: any | undefined;
    data: any | undefined;
    path: string | undefined;
}
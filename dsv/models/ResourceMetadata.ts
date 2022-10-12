import { SimpleResourceMetadata } from "./SimpleResourceMetadata";

/**
 * Base class for models which have full resource metadata.
 */
export class ResourceMetadata extends SimpleResourceMetadata {
    description: string | undefined;
    lastModified: Date | undefined;
    lastModifiedBy: string | undefined;
    version: string | undefined;
}
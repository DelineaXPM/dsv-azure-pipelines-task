/**
 * Base class for models which have simple metadata properties.
 */
export class SimpleResourceMetadata {
    id: string | undefined;
    created: Date | undefined;
    createdBy: string | undefined;
}
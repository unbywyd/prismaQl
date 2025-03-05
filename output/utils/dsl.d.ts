/**
 * Interface representing a model field.
 */
export interface FieldDefinition {
    /** Field name */
    name: string;
    /** Field type (e.g., "Int", "String", "Int?", etc.) */
    type: string;
    /** Optional array of attributes (e.g., ["@id", "@unique"]) */
    attributes?: string[];
}
/**
 * Interface representing a relation.
 */
export interface RelationDefinition {
    /** Relation name */
    name: string;
    /** Relation definition as a string (e.g., "Post(id)") */
    definition: string;
}
/**
 * Query command types for retrieving information from the Prisma schema.
 * Now GET_FIELDS supports an optional list of fields to filter by.
 */
export type QueryCommand = {
    type: "GET_MODELS";
} | {
    type: "GET_MODEL";
    model: string;
} | {
    type: "GET_FIELD";
    model: string;
    field: string;
    attribute?: string;
} | {
    type: "GET_RELATIONS";
    model: string;
} | {
    type: "GET_ENUMS";
} | {
    type: "GET_ENUM";
    enum: string;
} | {
    type: "VALIDATE_SCHEMA";
} | {
    type: "PRINT";
} | {
    type: "GET_MODEL_NAMES";
} | {
    type: "GET_ENUM_NAMES";
} | {
    type: "GET_RELATION_LIST";
    model: string;
    depth?: number;
};
export type QueryCommandType = QueryCommand["type"];
export declare const QueryCommandTypes: QueryCommand["type"][];
/**
 * Mutation command types for modifying the Prisma schema.
 */
export type MutationCommand = {
    type: "ADD_MODEL";
    model: string;
    fields: FieldDefinition[];
} | {
    type: "REMOVE_MODEL";
    model: string;
} | {
    type: "ADD_FIELD";
    model: string;
    field: FieldDefinition;
} | {
    type: "REMOVE_FIELD";
    model: string;
    field: string;
} | {
    type: "UPDATE_FIELD";
    model: string;
    field: string;
    definition: string;
} | {
    type: "ADD_RELATION";
    model: string;
    relation: RelationDefinition;
} | {
    type: "REMOVE_RELATION";
    model: string;
    relation: string;
} | {
    type: "ADD_ENUM";
    enum: string;
    values: string[];
} | {
    type: "REMOVE_ENUM";
    enum: string;
};
export type MutationCommandType = MutationCommand["type"];
export declare const MutationCommandTypes: MutationCommand["type"][];
/**
 * Unified command type that includes both query and mutation commands.
 */
export type Command = QueryCommand | MutationCommand;
/**
 * Parses a DSL command string and returns a Command object.
 * Throws an error if the command does not conform to the expected syntax.
 *
 * Supported DSL syntax:
 *
 * === Queries ===
 * GET MODELS;
 * GET MODEL <modelName>;
 * GET FIELDS <modelName>;                   // returns all fields
 * GET FIELDS <modelName> (<field1>, ...);     // returns only specified fields
 * GET RELATIONS <modelName>;
 * GET ENUMS;
 * GET ENUM <enumName>;
 * VALIDATE SCHEMA;
 * FORMAT SCHEMA;
 *
 * === Mutations ===
 * ADD MODEL <modelName> (<fields>);
 *   Example: ADD MODEL User (id Int @id, name String);
 *
 * REMOVE MODEL <modelName>;
 *
 * ADD FIELD <fieldName> TO <modelName> (<definition>);
 *   Example: ADD FIELD age TO User (Int?);
 *
 * REMOVE FIELD <fieldName> FROM <modelName>;
 *
 * UPDATE FIELD <fieldName> IN <modelName> (<definition>);
 *   Example: UPDATE FIELD name IN User (String @unique);
 *
 * ADD RELATION <relationName> TO <modelName> (<definition>);
 *   Example: ADD RELATION posts TO User (Post(id));
 *
 * REMOVE RELATION <relationName> FROM <modelName>;
 *
 * ADD ENUM <enumName> (<values>);
 *   Example: ADD ENUM Role (USER, ADMIN);
 *
 * REMOVE ENUM <enumName>;
 *
 * @param commandStr The DSL command string.
 * @returns A Command object representing the parsed command.
 * @throws Error if the command does not match any supported syntax.
 */
export declare function parseCommand(commandStr: string): Command;
//# sourceMappingURL=dsl.d.ts.map
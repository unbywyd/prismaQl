import { validateFieldDefinition } from "./dsl-validations.js";
export const QueryCommandTypes = [
    "GET_MODELS",
    "GET_MODEL",
    "GET_FIELD",
    "GET_RELATIONS",
    "GET_ENUMS",
    "GET_ENUM",
    "VALIDATE_SCHEMA",
    "PRINT",
    "GET_MODEL_NAMES",
    "GET_ENUM_NAMES",
    "GET_RELATION_TREE",
];
export const MutationCommandTypes = [
    "ADD_MODEL",
    "REMOVE_MODEL",
    "ADD_FIELD",
    "REMOVE_FIELD",
    "UPDATE_FIELD",
    "ADD_RELATION",
    "REMOVE_RELATION",
    "ADD_ENUM",
    "REMOVE_ENUM",
];
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
export function parseCommand(commandStr) {
    // Trim the command and ensure it ends with a semicolon.
    const trimmedCmd = commandStr.trim();
    if (!trimmedCmd.endsWith(";")) {
        throw new Error("Command must end with a semicolon.");
    }
    // Remove the ending semicolon to simplify parsing.
    const command = trimmedCmd.slice(0, -1).trim();
    // === Query Commands ===
    // Modified GET FIELDS pattern: allow an optional field list enclosed in parentheses.
    const getModelsPattern = /^GET\s+MODELS$/i;
    const getModelPattern = /^GET\s+MODEL\s+(\w+)$/i;
    const getFieldPattern = /^GET\s+FIELD\s+(\w+)\s+IN\s+(\w+)(?:\s+ATTRIBUTE\s+(\w+))?$/i;
    const getRelationsPattern = /^GET\s+RELATIONS\s+(\w+)$/i;
    const getEnumsPattern = /^GET\s+ENUMS$/i;
    const getEnumPattern = /^GET\s+ENUM\s+(\w+)$/i;
    const validateSchemaPattern = /^VALIDATE\s+SCHEMA$/i;
    const printSchemaPattern = /^PRINT$/i;
    const getModelNamesPattern = /^GET\s+MODEL_NAMES$/i;
    const getModelEnumsPattern = /^GET\s+ENUM_NAMES$/i;
    const getRelationTreePattern = /^GET\s+RELATION_TREE\s+(\w+)(?:\s+DEPTH\s+(\d+))?$/i;
    if (getModelNamesPattern.test(command)) {
        return { type: "GET_MODEL_NAMES" };
    }
    let match = command.match(getModelPattern);
    if (match) {
        return { type: "GET_MODEL", model: match[1] };
    }
    match = command.match(getRelationTreePattern);
    if (match) {
        return {
            type: "GET_RELATION_TREE",
            model: match[1],
            depth: match[2] ? parseInt(match[2], 10) : undefined
        };
    }
    if (getModelEnumsPattern.test(command)) {
        return { type: "GET_ENUM_NAMES" };
    }
    if (getModelsPattern.test(command)) {
        return { type: "GET_MODELS" };
    }
    match = command.match(getFieldPattern);
    if (match) {
        const field = match[1];
        const model = match[2];
        const attribute = match[3];
        return { type: "GET_FIELD", model, field, attribute };
    }
    match = command.match(getRelationsPattern);
    if (match) {
        return { type: "GET_RELATIONS", model: match[1] };
    }
    if (getEnumsPattern.test(command)) {
        return { type: "GET_ENUMS" };
    }
    match = command.match(getEnumPattern);
    if (match) {
        return { type: "GET_ENUM", enum: match[1] };
    }
    if (validateSchemaPattern.test(command)) {
        return { type: "VALIDATE_SCHEMA" };
    }
    if (printSchemaPattern.test(command)) {
        return { type: "PRINT" };
    }
    // === Mutation Commands ===
    const mutationPatterns = {
        addModel: /^ADD\s+MODEL\s+(\w+)\s*\((.+)\)$/i,
        removeModel: /^REMOVE\s+MODEL\s+(\w+)$/i,
        addField: /^ADD\s+FIELD\s+(\w+)\s+TO\s+(\w+)\s*\((.+)\)$/i,
        removeField: /^REMOVE\s+FIELD\s+(\w+)\s+FROM\s+(\w+)$/i,
        updateField: /^UPDATE\s+FIELD\s+(\w+)\s+IN\s+(\w+)\s*\((.+)\)$/i,
        addRelation: /^ADD\s+RELATION\s+(\w+)\s+TO\s+(\w+)\s*\((.+)\)$/i,
        removeRelation: /^REMOVE\s+RELATION\s+(\w+)\s+FROM\s+(\w+)$/i,
        addEnum: /^ADD\s+ENUM\s+(\w+)\s*\((.+)\)$/i,
        removeEnum: /^REMOVE\s+ENUM\s+(\w+)$/i,
    };
    match = command.match(mutationPatterns.addModel);
    if (match) {
        const modelName = match[1];
        const fieldsStr = match[2].trim();
        // Split fields by comma; assume that no commas exist within field definitions.
        const fieldParts = fieldsStr.split(/\s*,\s*/);
        const fields = fieldParts.map((fp) => {
            // Expected field format: "fieldName Type [attributes]"
            const parts = fp.trim().split(/\s+/);
            if (parts.length < 2) {
                throw new Error(`Invalid field definition: "${fp}"`);
            }
            const fieldName = parts[0];
            const fieldType = parts[1];
            const attributes = parts.slice(2);
            const field = { name: fieldName, type: fieldType, attributes: attributes.length ? attributes : undefined };
            // ✅ Validate field and attributes
            validateFieldDefinition(field);
            return field;
        });
        return { type: "ADD_MODEL", model: modelName, fields };
    }
    match = command.match(mutationPatterns.removeModel);
    if (match) {
        return { type: "REMOVE_MODEL", model: match[1] };
    }
    match = command.match(mutationPatterns.addField);
    if (match) {
        const fieldName = match[1];
        const model = match[2];
        const definition = match[3].trim();
        const parts = definition.split(/\s+/);
        if (parts.length < 1) {
            throw new Error(`Invalid field definition: "${definition}"`);
        }
        const fieldType = parts[0];
        const attributes = parts.slice(1);
        const field = { name: fieldName, type: fieldType, attributes: attributes.length ? attributes : undefined };
        validateFieldDefinition(field);
        return { type: "ADD_FIELD", model, field };
    }
    match = command.match(mutationPatterns.removeField);
    if (match) {
        return { type: "REMOVE_FIELD", field: match[1], model: match[2] };
    }
    match = command.match(mutationPatterns.updateField);
    if (match) {
        const fieldName = match[1];
        const model = match[2];
        const definition = match[3].trim();
        return { type: "UPDATE_FIELD", field: fieldName, model, definition };
    }
    match = command.match(mutationPatterns.addRelation);
    if (match) {
        const relationName = match[1];
        const model = match[2];
        const relationDefinition = match[3].trim();
        const relation = { name: relationName, definition: relationDefinition };
        return { type: "ADD_RELATION", model, relation };
    }
    match = command.match(mutationPatterns.removeRelation);
    if (match) {
        return { type: "REMOVE_RELATION", relation: match[1], model: match[2] };
    }
    match = command.match(mutationPatterns.addEnum);
    if (match) {
        const enumName = match[1];
        const valuesStr = match[2].trim();
        // Split enum values by comma.
        const values = valuesStr.split(/\s*,\s*/);
        return { type: "ADD_ENUM", enum: enumName, values };
    }
    match = command.match(mutationPatterns.removeEnum);
    if (match) {
        return { type: "REMOVE_ENUM", enum: match[1] };
    }
    throw new Error(`Unrecognized command: "${commandStr}"`);
}
//# sourceMappingURL=dsl.js.map
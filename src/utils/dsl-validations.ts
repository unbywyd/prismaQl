import { JSONSchemaType, Ajv } from "ajv";
import { FieldDefinition } from "./dsl.js";
const ajv = new Ajv({ allErrors: true, strict: false });


/**
 * List of valid Prisma field attributes.
 */
const allowedAttributes = [
    "@id",
    "@unique",
    "@default",
    "@relation",
    "@updatedAt",
    "@map",
    "@ignore",
];

/**
 * JSON Schema for validating FieldDefinition.
 */
const fieldDefinitionSchema: JSONSchemaType<FieldDefinition> = {
    type: "object",
    properties: {
        name: { type: "string" },
        type: { type: "string" },
        attributes: {
            type: "array",
            items: { type: "string" },
            nullable: true,
        },
    },
    required: ["name", "type"],
    additionalProperties: false,
};

/**
 * Validates a field definition using AJV and custom logic.
 */
export function validateFieldDefinition(field: FieldDefinition): void {
    const validate = ajv.compile(fieldDefinitionSchema);
    if (!validate(field)) {
        throw new Error(`Invalid field definition: ${JSON.stringify(validate.errors)}`);
    }

    // ✅ Validate attributes manually (AJV can't do this dynamically)
    if (field.attributes) {
        field.attributes.forEach(attr => {
            // Extract attribute name (e.g., "@default(18)" → "@default")
            const attrName = attr.includes("(") ? attr.split("(")[0] : attr;

            if (!allowedAttributes.includes(attrName) && !attr.startsWith("@db.")) {
                throw new Error(`Invalid attribute "${attr}" for field "${field.name}". Allowed: ${allowedAttributes.join(", ")} or @db.*`);
            }
        });
    }

}
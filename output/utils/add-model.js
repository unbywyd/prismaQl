import { createPrismaSchemaBuilder } from "@mrleebo/prisma-ast";
/**
 * Adds a new model to the Prisma schema.
 * @param modelName - The name of the model to add.
 * @param fields - An array of field definitions.
 * @returns Promise<void> Resolves when the model is added successfully.
 */
export function addModel(modelName, fields) {
    const { schemaPath, schemaContent, parsedSchema } = loadPrismaSchema();
    const builder = createPrismaSchemaBuilder(schemaContent);
    // Check if model already exists
    const existingModel = parsedSchema.list.find(item => item.type === "model" && item.name === modelName);
    if (existingModel) {
        throw new Error(`Model "${modelName}" already exists.`);
    }
    // Add new model to the schema
    const model = builder.model(modelName);
    fields.forEach(field => {
        let fieldBuilder = model.field(field.name, field.type);
        // Apply attributes separately
        field.attributes?.forEach(attr => {
            fieldBuilder = fieldBuilder.attribute(attr);
        });
    });
    // Generate new schema content
    const updatedSchema = builder.print({ sort: true });
    console.log(updatedSchema);
}
//# sourceMappingURL=add-model.js.map
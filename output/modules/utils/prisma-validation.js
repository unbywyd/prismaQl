import pkg from '@prisma/internals';
const { getDMMF } = pkg;
/**
 * Finds and validates the Prisma schema.
 * @returns Promise<void> Resolves if valid, throws an error if invalid.
 */
export async function validatePrismaSchema(schema) {
    try {
        await getDMMF({ datamodel: schema });
        return true;
    }
    catch (error) {
        return error;
    }
}
//# sourceMappingURL=prisma-validation.js.map
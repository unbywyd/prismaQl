/**
 * Finds and validates the Prisma schema.
 * @returns Promise<void> Resolves if valid, throws an error if invalid.
 */
declare function validatePrismaSchema(schema: string): Promise<true | Error>;

export { validatePrismaSchema };

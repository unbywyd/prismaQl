declare const loadPrismaSchema: (inputPath?: string) => Promise<{
    schema: string;
    path: string;
}>;

export { loadPrismaSchema };

declare const loadPrismaSchema: (cwd: string, inputPath?: string) => Promise<{
    schema: string;
    path: string;
}>;

export { loadPrismaSchema };

import fs from "fs";
import path from "path";

export const loadPrismaSchema = async (filePath?: string): Promise<{
    schema: string,
    path: string
}> => {
    const cwd = process.cwd();
    let schemaPath = filePath || path.join(cwd, "prisma", "schema.prisma");

    if (!fs.existsSync(schemaPath)) {
        schemaPath = path.join(cwd, "schema.prisma");
        if (!fs.existsSync(schemaPath)) {
            throw new Error(`Prisma schema file not found.`);
        }
    }

    const schemaContent = await fs.promises.readFile(schemaPath, "utf-8");
    return {
        schema: schemaContent,
        path: schemaPath
    }
}
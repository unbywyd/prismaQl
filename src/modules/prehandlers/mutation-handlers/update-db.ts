import { handlerResponse, PrismaQlHandler } from "src/modules/handler-registries/handler-registry.js";

export function normalizeQuotes(input: string): string {
    return input
        .replace(/^[\'"]+/, '')
        .replace(/[\'"]+$/, '');
}
export const updateDB: PrismaQlHandler<"UPDATE", "DB", "mutation"> = (prismaState, data) => {
    const { options } = data;
    const response = handlerResponse(data);

    if (!options?.provider && !options?.url) {
        return response.error("No provider or url provided. Example: 'UPDATE DB (->[url='sqlite://prisma.db' provider='sqlite']);'");
    }

    const builder = prismaState.builder;

    const prev = builder.findByType("datasource", {
        name: "db"
    });
    if (!prev) {
        return response.error("No datasource found");
    }

    const provider = (options.provider ? `"${options.provider}"` : null) || (prev as any)?.assignments?.find((a: any) => a.key == "provider")?.value;
    let prevUrl = options.url?.toString() || (prev as any)?.assignments?.find((a: any) => a.key == "url")?.value as any;

    if (typeof prevUrl == "object" && prevUrl.name == 'env') {
        prevUrl = {
            env: normalizeQuotes(prevUrl.params[0])
        }
    }

    builder.datasource(provider, prevUrl || {
        env: "DATABASE_URL"
    });

    return response.result(`DB updated successfully`);
}
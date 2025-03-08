import { handlerResponse } from "src/modules/handler-registries/handler-registry.js";
export function normalizeQuotes(input) {
    return input
        .replace(/^[\'"]+/, '')
        .replace(/[\'"]+$/, '');
}
export const updateDB = (prismaState, data) => {
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
    const provider = (options.provider ? `"${options.provider}"` : null) || prev?.assignments?.find((a) => a.key == "provider")?.value;
    let prevUrl = options.url?.toString() || prev?.assignments?.find((a) => a.key == "url")?.value;
    if (typeof prevUrl == "object" && prevUrl.name == 'env') {
        prevUrl = {
            env: normalizeQuotes(prevUrl.params[0])
        };
    }
    builder.datasource(provider, prevUrl || {
        env: "DATABASE_URL"
    });
    return response.result(`DB updated successfully`);
};
//# sourceMappingURL=update-db.js.map
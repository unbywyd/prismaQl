import boxen from "boxen";
import chalk from "chalk";
import { handlerResponse, PrismaQlHandler } from "src/modules/handler-registries/handler-registry.js";

export function normalizeQuotes(input: string): string {
    return input
        .replace(/^[\'"]+/, '')
        .replace(/[\'"]+$/, '');
}
export const getDB: PrismaQlHandler<"GET", "DB", "query"> = (prismaState, data) => {
    const response = handlerResponse(data);

    const builder = prismaState.builder;

    const prev = builder.findByType("datasource", {
        name: "db"
    });
    if (!prev) {
        return response.error("No datasource found");
    }

    const provider = (prev as any)?.assignments?.find((a: any) => a.key == "provider")?.value;
    let prevUrl = (prev as any)?.assignments?.find((a: any) => a.key == "url")?.value as any;
    if (typeof prevUrl == "object" && prevUrl.name == 'env') {
        prevUrl = "env(" + normalizeQuotes(prevUrl.params[0]) + ")";
    }
    return response.result(boxen(`${chalk.gray('Provider')}: ${provider}\n${chalk.gray('URL')}: ${prevUrl}`, { padding: 1, textAlignment: 'left',  margin: 1, borderStyle: 'double' }));
}
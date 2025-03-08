import boxen from "boxen";
import chalk from "chalk";
import { handlerResponse } from "../../handler-registries/handler-registry.js";
export function normalizeQuotes(input) {
    return input
        .replace(/^[\'"]+/, '')
        .replace(/[\'"]+$/, '');
}
export const getDB = (prismaState, data) => {
    const response = handlerResponse(data);
    const builder = prismaState.builder;
    const prev = builder.findByType("datasource", {
        name: "db"
    });
    if (!prev) {
        return response.error("No datasource found");
    }
    const provider = prev?.assignments?.find((a) => a.key == "provider")?.value;
    let prevUrl = prev?.assignments?.find((a) => a.key == "url")?.value;
    if (typeof prevUrl == "object" && prevUrl.name == 'env') {
        prevUrl = "env(" + normalizeQuotes(prevUrl.params[0]) + ")";
    }
    return response.result(boxen(`${chalk.gray('Provider')}: ${provider}\n${chalk.gray('URL')}: ${prevUrl}`, { padding: 1, textAlignment: 'left', margin: 1, borderStyle: 'double' }));
};
//# sourceMappingURL=get-db.js.map
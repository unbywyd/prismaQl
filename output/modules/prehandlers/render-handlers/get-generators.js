import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";
import Table from "cli-table3";
import boxen from "boxen";
import chalk from "chalk";
export const getGenerators = (prismaState, data) => {
    const response = handlerResponse(data);
    const helper = useHelper(prismaState);
    const generators = helper.getGenerators();
    if (!generators)
        return response.result("No generators found.");
    const sections = [];
    generators.forEach((generator) => {
        const table = new Table({
            head: ['Property', 'Value'],
            colWidths: [20, 50]
        });
        generator?.assignments?.forEach((assignment) => {
            if (!assignment)
                return;
            table.push([assignment?.key, assignment?.value]);
        });
        sections.push({
            name: generator.name,
            table: table.toString()
        });
    });
    const result = sections.map(section => {
        return boxen(chalk.bold(section.name) + "\n" + section.table, { padding: 1, borderStyle: 'bold' });
    }).join("\n");
    return response.result(`
Generators found: ${generators.length}
${result}
`);
};
//# sourceMappingURL=get-generators.js.map
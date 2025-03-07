import chalk from "chalk";
import { handlerResponse } from "../../handler-registries/handler-registry.js";
import { useHelper } from "../../utils/schema-helper.js";
import boxen from "boxen";
/**
 * Splits an array into columns
 */
export const formatColumns = (items, columns = 2) => {
    const columnWidth = Math.max(...items.map(name => name.length)) + 2; // Dynamic column width
    const rows = Math.ceil(items.length / columns);
    let output = "";
    for (let i = 0; i < rows; i++) {
        let rowItems = [];
        for (let j = 0; j < columns; j++) {
            const index = i + j * rows;
            if (index < items.length) {
                rowItems.push(items[index].padEnd(columnWidth)); // Align text
            }
        }
        output += rowItems.join("  ") + "\n"; // Separate columns with spaces
    }
    return output.trim();
};
/**
 * Registers a handler for the `GET_MODEL_NAMES` command with columns
 */
export const sortModelNames = (modelNames) => {
    modelNames.sort((a, b) => a.localeCompare(b));
};
export const getModelNames = (prismaState, data) => {
    const response = handlerResponse(data);
    const models = useHelper(prismaState).getModels();
    if (models.length === 0) {
        return response.result(chalk.red.bold("❌ No models in Prisma schema."));
    }
    const modelNames = models.map(model => model.name);
    sortModelNames(modelNames);
    // Determine the number of columns (if models > 6, make 3 columns)
    const columns = modelNames.length > 6 ? 3 : 2;
    // Statistics
    const stats = `${chalk.white("📊 Total models:")} ${chalk.white.bold(modelNames.length)}`;
    // Nicely format the list of models into columns
    const formattedModels = formatColumns(modelNames.map(name => `${chalk.hex("#11FF00")("•")} ${chalk.bold(name)}`), columns);
    // Final output in a box
    return response.result(boxen(`${stats}\n\n${formattedModels}`, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan",
        title: "Prisma Models",
        titleAlignment: "center"
    }));
};
//# sourceMappingURL=get-model-names.js.map
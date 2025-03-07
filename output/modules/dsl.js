const DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,*]+))?(?:\s*\(\{([\s\S]*?)\}\))?(?:\s*\(([^)]*?)\))?$/i;
const ACTION_COMMAND_MAP = {
    GET: ["MODELS", "MODEL", "ENUM_RELATIONS", "FIELDS", "RELATIONS", "ENUMS", "MODELS_LIST"],
    ADD: ["MODEL", "FIELD", "RELATION", "ENUM"],
    DELETE: ["MODEL", "FIELD", "RELATION", "ENUM"],
    UPDATE: ["FIELD", "ENUM"],
    PRINT: [],
    VALIDATE: [],
};
export class PrismaQlDslParser {
    argsProcessors;
    customCommands = {};
    actionTypeMap = {
        GET: "query",
        ADD: "mutation",
        DELETE: "mutation",
        UPDATE: "mutation",
        PRINT: "query",
        VALIDATE: "query",
    };
    constructor(argsProcessors) {
        this.argsProcessors = argsProcessors;
    }
    registerCommand(action, command, type) {
        if (!this.customCommands[action]) {
            this.customCommands[action] = [];
        }
        this.customCommands[action].push(command);
        this.actionTypeMap[action] = type;
    }
    getCommands() {
        return {
            ...ACTION_COMMAND_MAP,
            ...this.customCommands,
        };
    }
    parseCommand(input) {
        const trimmed = input.trim();
        if (!trimmed.endsWith(";")) {
            throw new Error("DSL command must end with a semicolon.");
        }
        const raw = trimmed.slice(0, -1).trim();
        const match = raw.match(DSL_PATTERN);
        if (!match) {
            throw new Error(`Unable to parse DSL line: "${raw}"`);
        }
        const actionStr = match[1].toUpperCase();
        const commandStr = match[2]?.toUpperCase();
        const argsStr = match[3]?.trim() || undefined;
        let prismaBlockStr = match[4]?.trim() || undefined;
        if (prismaBlockStr) {
            prismaBlockStr = prismaBlockStr.replace(/'/g, '"');
            prismaBlockStr = prismaBlockStr.replace(/'/g, '"');
            prismaBlockStr = prismaBlockStr.replace(/\\n/g, "\n");
            prismaBlockStr = prismaBlockStr.replace(/\|/g, "\n");
        }
        const optionsStr = match[5]?.trim() || undefined;
        if (!(actionStr in ACTION_COMMAND_MAP) && !(actionStr in this.customCommands)) {
            throw new Error(`Unsupported action "${actionStr}". Supported actions: ${Object.keys(ACTION_COMMAND_MAP).join(", ")}`);
        }
        let finalCommand;
        const actionKey = actionStr;
        const commands = this.getCommands();
        const availableCommands = commands[actionKey] || [];
        if (commandStr) {
            if (!availableCommands.includes(commandStr)) {
                throw new Error(`Invalid command "${commandStr}" for action "${actionStr}". Supported: ${availableCommands.join(", ")}`);
            }
            finalCommand = commandStr;
        }
        const parsedOptions = optionsStr ? this.parseParams(optionsStr) : undefined;
        const baseArgs = this.parseArgs(argsStr);
        const argsProcessor = this.argsProcessors[actionStr][finalCommand || "default"];
        const finalArgs = argsProcessor ? argsProcessor(baseArgs, argsStr) : baseArgs;
        return {
            action: actionStr,
            command: finalCommand,
            args: finalArgs,
            options: parsedOptions,
            prismaBlock: prismaBlockStr,
            raw: input,
            type: this.actionTypeMap[actionStr],
        };
    }
    parseParams(input) {
        const result = {};
        const tokens = input.split(",").map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            const eqIndex = token.indexOf("=");
            if (eqIndex > 0) {
                const key = token.slice(0, eqIndex).trim();
                let valueStr = token.slice(eqIndex + 1).trim();
                if (/^\d+$/.test(valueStr)) {
                    result[key] = parseInt(valueStr, 10);
                }
                if (valueStr === "true") {
                    result[key] = true;
                }
                else if (valueStr === "false") {
                    result[key] = false;
                }
                else {
                    result[key] = valueStr;
                }
                if (valueStr.includes(",")) {
                    result[key] = valueStr.split(",").map(v => v.trim());
                }
                else {
                    try {
                        result[key] = JSON.parse(valueStr);
                    }
                    catch (e) {
                        result[key] = valueStr;
                    }
                }
            }
            else {
                const flag = token.trim();
                result[flag] = true;
            }
        }
        return result;
    }
    parseArgs(argsStr) {
        const args = {};
        if (!argsStr)
            return args;
        const tokens = argsStr.split(",").map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            args.models = args.models || [];
            args.models.push(token);
        }
        return args;
    }
    detectActionType(source) {
        const DSL_ACTION_PATTERN = /^([A-Z]+)/i;
        const match = source.match(DSL_ACTION_PATTERN);
        if (!match)
            return null;
        const actionStr = match[1].toUpperCase();
        return this.actionTypeMap[actionStr] || null;
    }
    isValid(source) {
        try {
            this.parseCommand(source);
            return true;
        }
        catch (e) {
            return e;
        }
    }
}
export const basePrismaQlAgsProcessor = {
    GET: {
        default: (parsedArgs) => parsedArgs,
        MODEL: (parsedArgs, rawArgs) => {
            if (rawArgs?.includes("IN")) {
                return { models: [rawArgs.split("IN")[1].trim()] };
            }
            return parsedArgs;
        },
        MODELS: (_, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
        RELATIONS: (_, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(r => r.trim()) : [] };
        },
        FIELDS: (parsedArgs, rawArgs) => {
            const [fieldsStr, modelName] = rawArgs?.split("IN") || [];
            if (!fieldsStr || !modelName)
                return parsedArgs;
            return { models: [modelName.trim()], fields: fieldsStr.split(",").map(f => f.trim()) };
        },
        ENUMS: (_, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        },
        ENUM_RELATIONS: (_, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        }
    },
    ADD: {
        default: (parsedArgs) => parsedArgs,
        MODEL: (_, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
        ENUM: (_, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        },
        FIELD: (parsedArgs, rawArgs) => {
            const [fieldName, modelName] = rawArgs?.split("TO") || [];
            if (!fieldName || !modelName)
                return parsedArgs;
            return { models: [modelName.trim()], fields: [fieldName.trim()] };
        },
        RELATION: (parsedArgs, rawArgs) => {
            const [fromModel, toModel] = rawArgs?.split("TO") || [];
            if (!fromModel || !toModel)
                return parsedArgs;
            return { models: [fromModel.trim(), toModel.trim()] };
        }
    },
    DELETE: {
        default: (parsedArgs) => parsedArgs,
        MODEL: (_, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
        ENUM: (_, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        },
        FIELD: (parsedArgs, rawArgs) => {
            const [fieldName, modelName] = rawArgs?.split("IN") || [];
            if (!fieldName || !modelName)
                return parsedArgs;
            return { models: [modelName.trim()], fields: [fieldName.trim()] };
        },
        RELATION: (_, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        }
    },
    UPDATE: {
        default: (parsedArgs) => parsedArgs,
        FIELD: (parsedArgs, rawArgs) => {
            const [fieldName, modelName, prismaBlock] = rawArgs?.split("IN") || [];
            if (!fieldName || !modelName)
                return parsedArgs;
            return {
                models: [modelName.trim()], fields: [fieldName
                        .trim()], prismaBlock: prismaBlock?.trim()
            };
        },
        ENUM: (_, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        }
    },
    PRINT: {
        default: (parsedArgs) => parsedArgs,
    },
    VALIDATE: {
        default: (parsedArgs) => parsedArgs,
    },
};
export const prismaQlParser = new PrismaQlDslParser(basePrismaQlAgsProcessor);
const customArgsProcessors = {
    // Берём все базовые обработчики как есть:
    ...basePrismaQlAgsProcessor,
    // Добавляем свой
    CUSTOM_ACTION: {
        default: (parsedArgs) => parsedArgs,
        CUSTOM_COMMAND: (parsedArgs, rawArgs) => {
            return {
                models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [],
            };
        },
    },
};
export const customParser = new PrismaQlDslParser(customArgsProcessors);
console.log('test', customParser.parseCommand('CUSTOM_ACTION CUSTOM_COMMAND model1, model2;'));
//# sourceMappingURL=dsl.js.map
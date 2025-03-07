const DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,*]+))?(?:\s*\(\{([\s\S]*?)\}\))?(?:\s*\(([^)]*?)\))?$/i;
const ACTION_TYPE_MAP = {
    GET: "query",
    ADD: "mutation",
    DELETE: "mutation",
    UPDATE: "mutation",
    PRINT: "query",
    VALIDATE: "query"
};
const ACTION_COMMAND_MAP = {
    GET: ["MODELS", "MODEL", "ENUM_RELATIONS", "FIELDS", "RELATIONS", "ENUMS", "MODELS_LIST"],
    ADD: ["MODEL", "FIELD", "RELATION", "ENUM"],
    DELETE: ["MODEL", "FIELD", "RELATION", "ENUM"],
    UPDATE: ["FIELD", "ENUM"],
    PRINT: [],
    VALIDATE: [],
};
export class DslParser {
    argsProcessors;
    constructor(argsProcessors) {
        this.argsProcessors = argsProcessors;
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
        if (!(actionStr in ACTION_COMMAND_MAP)) {
            throw new Error(`Unsupported action "${actionStr}". Supported actions: ${Object.keys(ACTION_COMMAND_MAP).join(", ")}`);
        }
        let finalCommand;
        if (commandStr) {
            if (!ACTION_COMMAND_MAP[actionStr].includes(commandStr)) {
                throw new Error(`Invalid command "${commandStr}" for action "${actionStr}". Supported: ${ACTION_COMMAND_MAP[actionStr].join(", ")}`);
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
            raw,
            type: ACTION_TYPE_MAP[actionStr],
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
        return ACTION_TYPE_MAP[actionStr] || null;
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
const instance = new DslParser({
    GET: {
        default: (parsedArgs, rawArgs) => parsedArgs,
        MODEL: (parsedArgs, rawArgs) => {
            if (rawArgs?.includes("IN")) {
                return { models: [rawArgs.split("IN")[1].trim()] };
            }
            return parsedArgs;
        },
        MODELS: (parsedArgs, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
        RELATIONS: (parsedArgs, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(r => r.trim()) : [] };
        },
        FIELDS: (parsedArgs, rawArgs) => {
            const [fieldsStr, modelName] = rawArgs?.split("IN") || [];
            if (!fieldsStr || !modelName)
                return parsedArgs;
            return { models: [modelName.trim()], fields: fieldsStr.split(",").map(f => f.trim()) };
        },
        ENUMS: (parsedArgs, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        },
        ENUM_RELATIONS: (parsedArgs, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        }
    },
    ADD: {
        default: (parsedArgs, rawArgs) => parsedArgs,
        MODEL: (parsedArgs, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
        ENUM: (parsedArgs, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        },
        FIELD: (parsedArgs, rawArgs) => {
            const [fieldName, modelName, fieldArgs] = rawArgs?.split("TO") || [];
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
        default: (parsedArgs, rawArgs) => parsedArgs,
        MODEL: (parsedArgs, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
        ENUM: (parsedArgs, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        },
        FIELD: (parsedArgs, rawArgs) => {
            const [fieldName, modelName] = rawArgs?.split("IN") || [];
            if (!fieldName || !modelName)
                return parsedArgs;
            return { models: [modelName.trim()], fields: [fieldName.trim()] };
        },
        RELATION: (parsedArgs, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        }
    },
    UPDATE: {
        default: (parsedArgs, rawArgs) => parsedArgs,
        FIELD: (parsedArgs, rawArgs) => {
            const [fieldName, modelName, prismaBlock] = rawArgs?.split("IN") || [];
            if (!fieldName || !modelName)
                return parsedArgs;
            return {
                models: [modelName.trim()], fields: [fieldName
                        .trim()], prismaBlock: prismaBlock?.trim()
            };
        },
        ENUM: (parsedArgs, rawArgs) => {
            return { enums: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
        }
    },
    PRINT: {
        default: (parsedArgs, rawArgs) => parsedArgs,
    },
    VALIDATE: {
        default: (parsedArgs, rawArgs) => parsedArgs,
    },
});
export default instance;
//# sourceMappingURL=dsl.js.map
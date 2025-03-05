const DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,]+))?(?:\s*\(([^)]*?)\))?(?:\s*\{([\s\S]*)\})?$/i;
const ACTION_TYPE_MAP = {
    GET: "query",
    ADD: "mutation",
    DELETE: "mutation",
    UPDATE: "mutation",
    PRINT: "query",
    VALIDATE: "query",
};
const ACTION_COMMAND_MAP = {
    GET: ["MODELS", "MODEL", "FIELDS", "RELATIONS", "RELATION_FIELDS", "ENUMS", "ENUM", "MODEL_NAMES", "ENUM_NAMES"],
    ADD: ["MODEL", "FIELD", "RELATION", "ENUM"],
    DELETE: ["MODEL", "FIELD", "RELATION", "ENUM"],
    UPDATE: ["FIELD"],
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
        const optionsStr = match[4]?.trim() || undefined;
        const prismaBlockStr = match[5]?.trim() || undefined;
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
                const key = token.slice(0, eqIndex).trim().toUpperCase();
                let valueStr = token.slice(eqIndex + 1).trim();
                if (/^\d+$/.test(valueStr)) {
                    result[key] = parseInt(valueStr, 10);
                }
                else {
                    result[key] = valueStr;
                }
            }
            else {
                const flag = token.trim().toUpperCase();
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
    },
    ADD: {
        default: (parsedArgs, rawArgs) => parsedArgs,
        MODEL: (parsedArgs, rawArgs) => {
            return { models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [] };
        },
    },
    DELETE: {
        default: (parsedArgs, rawArgs) => parsedArgs,
    },
    UPDATE: {
        default: (parsedArgs, rawArgs) => parsedArgs,
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
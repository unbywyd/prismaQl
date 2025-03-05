export type DSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";

export type DSLCommand =
    | "MODELS"
    | "MODEL"
    | "FIELD"
    | "FIELDS"
    | "RELATIONS"
    | "RELATION_FIELDS"
    | "ENUMS"
    | "ENUM"
    | "MODEL_NAMES"
    | "ENUM_NAMES"
    | "RELATION";

export type DSLType = "query" | "mutation";

export type MutationAction = "ADD" | "DELETE" | "UPDATE";
export type QueryAction = "GET" | "PRINT" | "VALIDATE";

export type DSLArgs<A extends DSLAction, C extends DSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    relations?: string[];
    enums?: string[];
};

export type DSLOptions<A extends DSLAction, C extends DSLCommand | undefined> = Record<string, string | number | boolean>;

export interface ParsedDSL<A extends DSLAction, C extends DSLCommand | undefined> {
    action: A;
    command?: C;
    args?: DSLArgs<A, C>;
    options?: DSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: DSLType;
}

export type DSLArgsProcessor<A extends DSLAction, C extends DSLCommand | undefined> = (
    parsedArgs: DSLArgs<A, C>,
    rawArgs: string | undefined
) => DSLArgs<A, C>;

const DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,]+))?(?:\s*\(([^)]*?)\))?(?:\s*\{([\s\S]*)\})?$/i;

const ACTION_TYPE_MAP: Record<DSLAction, DSLType> = {
    GET: "query",
    ADD: "mutation",
    DELETE: "mutation",
    UPDATE: "mutation",
    PRINT: "query",
    VALIDATE: "query",
};

const ACTION_COMMAND_MAP: Record<DSLAction, DSLCommand[]> = {
    GET: ["MODELS", "MODEL", "FIELDS", "RELATIONS", "RELATION_FIELDS", "ENUMS", "ENUM", "MODEL_NAMES", "ENUM_NAMES"],
    ADD: ["MODEL", "FIELD", "RELATION", "ENUM"],
    DELETE: ["MODEL", "FIELD", "RELATION", "ENUM"],
    UPDATE: ["FIELD"],
    PRINT: [],
    VALIDATE: [],
};

export class DslParser {
    constructor(
        public argsProcessors: Record<
            DSLAction,
            { default: DSLArgsProcessor<any, any> } & Partial<Record<DSLCommand, DSLArgsProcessor<any, any>>>
        >
    ) {
    }
    public parseCommand<A extends DSLAction, C extends DSLCommand | undefined>(input: string): ParsedDSL<A, C> {
        const trimmed = input.trim();
        if (!trimmed.endsWith(";")) {
            throw new Error("DSL command must end with a semicolon.");
        }
        const raw = trimmed.slice(0, -1).trim();

        const match = raw.match(DSL_PATTERN);
        if (!match) {
            throw new Error(`Unable to parse DSL line: "${raw}"`);
        }

        const actionStr = match[1].toUpperCase() as DSLAction;
        const commandStr = match[2]?.toUpperCase() as DSLCommand | undefined;
        const argsStr = match[3]?.trim() || undefined;
        const optionsStr = match[4]?.trim() || undefined;
        const prismaBlockStr = match[5]?.trim() || undefined;

        if (!(actionStr in ACTION_COMMAND_MAP)) {
            throw new Error(`Unsupported action "${actionStr}". Supported actions: ${Object.keys(ACTION_COMMAND_MAP).join(", ")}`);
        }

        let finalCommand: DSLCommand | undefined;
        if (commandStr) {
            if (!ACTION_COMMAND_MAP[actionStr].includes(commandStr)) {
                throw new Error(`Invalid command "${commandStr}" for action "${actionStr}". Supported: ${ACTION_COMMAND_MAP[actionStr].join(", ")}`);
            }
            finalCommand = commandStr;
        }

        const parsedOptions = optionsStr ? this.parseParams(optionsStr) : undefined;
        const baseArgs = this.parseArgs<A, C>(argsStr);
        const argsProcessor = this.argsProcessors[actionStr][finalCommand || "default"];
        const finalArgs = argsProcessor ? argsProcessor(baseArgs, argsStr) : baseArgs;

        return {
            action: actionStr as A,
            command: finalCommand as C,
            args: finalArgs,
            options: parsedOptions,
            prismaBlock: prismaBlockStr,
            raw,
            type: ACTION_TYPE_MAP[actionStr],
        };
    }
    parseParams(input: string): DSLOptions<any, any> {
        const result: DSLOptions<any, any> = {};
        const tokens = input.split(",").map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            const eqIndex = token.indexOf("=");
            if (eqIndex > 0) {
                const key = token.slice(0, eqIndex).trim().toUpperCase();
                let valueStr = token.slice(eqIndex + 1).trim();
                if (/^\d+$/.test(valueStr)) {
                    result[key] = parseInt(valueStr, 10);
                } else {
                    result[key] = valueStr;
                }
            } else {
                const flag = token.trim().toUpperCase();
                result[flag] = true;
            }
        }
        return result;
    }
    parseArgs<A extends DSLAction, C extends DSLCommand | undefined>(argsStr: string | undefined): DSLArgs<A, C> {
        const args: DSLArgs<A, C> = {};
        if (!argsStr) return args;

        const tokens = argsStr.split(",").map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            args.models = args.models || [];
            args.models.push(token);
        }
        return args;
    }
    detectActionType(source: string): DSLType | null {
        const DSL_ACTION_PATTERN = /^([A-Z]+)/i;
        const match = source.match(DSL_ACTION_PATTERN);
        if (!match) return null;
        const actionStr = match[1].toUpperCase() as DSLAction;
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
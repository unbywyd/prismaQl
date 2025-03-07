import { RelationType } from "./field-relation-collector.js";

export type DSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";

export type DSLCommand =
    | "MODELS"
    | "MODEL"
    | "FIELD"
    | "FIELDS"
    | "RELATIONS"
    | "ENUM_RELATIONS"
    | "ENUMS"
    | "ENUM"
    | "MODELS_LIST"
    | "RELATION";

export type DSLType = "query" | "mutation";

export type DSLMutationAction = "ADD" | "DELETE" | "UPDATE";
export type DSLQueryAction = "GET" | "PRINT" | "VALIDATE";

export type DSLArgs<A extends DSLAction, C extends DSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
};

export type DSLPrismaRelationType = RelationType;

export type DSLOptionMap = {
    GET: {
        ENUMS: { raw?: boolean };
        RELATIONS: { depth?: number };
    },
    ADD: {
        RELATION: {
            type: DSLPrismaRelationType,
            pivotTable?: string | true,
            fkHolder?: string,
            required?: boolean,
            relationName?: string,
        };
    },
    UPDATE: {
        ENUM: {
            replace: boolean;
        }
    },
    DELETE: {
        RELATION: {
            fieldA?: string;
            fieldB?: string;
            relationName?: string;
        }
    }
};

export type DSLOptions<A extends DSLAction, C extends DSLCommand | undefined> =
    A extends keyof DSLOptionMap
    ? C extends keyof DSLOptionMap[A]
    ? DSLOptionMap[A][C]
    : Record<string, string | number | boolean | Array<string>>
    : Record<string, string | number | boolean | Array<string>>;


export interface ParsedDSL<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType> {
    action: A;
    command?: C;
    args?: DSLArgs<A, C>;
    options?: DSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}

export type DSLArgsProcessor<A extends DSLAction, C extends DSLCommand | undefined> = (
    parsedArgs: DSLArgs<A, C>,
    rawArgs: string | undefined
) => DSLArgs<A, C>;

const DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,*]+))?(?:\s*\(\{([\s\S]*?)\}\))?(?:\s*\(([^)]*?)\))?$/i;

const ACTION_TYPE_MAP: Record<DSLAction, DSLType> = {
    GET: "query",
    ADD: "mutation",
    DELETE: "mutation",
    UPDATE: "mutation",
    PRINT: "query",
    VALIDATE: "query"
};

const ACTION_COMMAND_MAP: Record<DSLAction, DSLCommand[]> = {
    GET: ["MODELS", "MODEL", "ENUM_RELATIONS", "FIELDS", "RELATIONS", "ENUMS", "MODELS_LIST"],
    ADD: ["MODEL", "FIELD", "RELATION", "ENUM"],
    DELETE: ["MODEL", "FIELD", "RELATION", "ENUM"],
    UPDATE: ["FIELD", "ENUM"],
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
    public parseCommand<A extends DSLAction, C extends DSLCommand | undefined, T extends DSLType>(input: string): ParsedDSL<A, C, T> {
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
            raw: input,
            type: ACTION_TYPE_MAP[actionStr] as T,
        };
    }
    parseParams(input: string): DSLOptions<any, any> {
        const result: DSLOptions<any, any> = {};
        const tokens = input.split(",").map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            const eqIndex = token.indexOf("=");
            if (eqIndex > 0) {
                const key = token.slice(0, eqIndex).trim();
                let valueStr = token.slice(eqIndex + 1).trim();
                if (/^\d+$/.test(valueStr)) {
                    result[key] = parseInt(valueStr, 10);
                } if (valueStr === "true") {
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
                } else {
                    try {
                        result[key] = JSON.parse(valueStr);
                    } catch (e) {
                        result[key] = valueStr;
                    }
                }
            } else {
                const flag = token.trim();
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
    isValid(source: string): boolean | Error {
        try {
            this.parseCommand(source);
            return true;
        } catch (e) {
            return e;
        }
    }
}

export const dslParser = new DslParser({
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
            if (!fieldsStr || !modelName) return parsedArgs;
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
            if (!fieldName || !modelName) return parsedArgs;
            return { models: [modelName.trim()], fields: [fieldName.trim()] };
        },
        RELATION: (parsedArgs, rawArgs) => {
            const [fromModel, toModel] = rawArgs?.split("TO") || [];
            if (!fromModel || !toModel) return parsedArgs;
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
            if (!fieldName || !modelName) return parsedArgs;
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
            if (!fieldName || !modelName) return parsedArgs;
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
});

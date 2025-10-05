import chalk from "chalk";
import { PrismaQlRelationType } from "./field-relation-collector.js";

export type BasePrismaQlDSLAction = "GET" | "ADD" | "DELETE" | "UPDATE" | "PRINT" | "VALIDATE";

export type BasePrismaQLDSLCommand =
    | "MODELS"
    | "MODEL"
    | "FIELD"
    | "FIELDS"
    | "RELATIONS"
    | "DB"
    | "ENUM_RELATIONS"
    | "ENUMS"
    | "ENUM"
    | "MODELS_LIST"
    | "RELATION"
    | "GENERATOR"
    | "GENERATORS";

export type PrismaQlDSLAction<A extends string = BasePrismaQlDSLAction> = A;
export type PrismaQLDSLCommand<C extends string = BasePrismaQLDSLCommand> = C;

export type PrismaQlDSLType = "query" | "mutation";

export type PrismaQlDSLMutationAction = "ADD" | "DELETE" | "UPDATE";
export type PrismaQlDSLQueryAction = "GET" | "PRINT" | "VALIDATE";

export type PrismaQLDSLArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> = {
    models?: string[];
    fields?: string[];
    enums?: string[];
    generators?: string[];
};

export type DSLPrismaRelationType = PrismaQlRelationType;

export type PrismaQlDSLOptionMap = {
    GET: {
        ENUMS: { raw?: boolean };
        RELATIONS: { depth?: number };
    },
    ADD: {
        RELATION: {
            type: DSLPrismaRelationType,
            pivotTable?: string | true,
            pivotOnly?: boolean,
            fkHolder?: string,
            required?: boolean,
            relationName?: string,
            pluralName?: string,
            fkName?: string,
            refName?: string,
        };
        MODEL: {
            empty?: boolean;
        }
    },
    UPDATE: {
        ENUM: {
            replace: boolean;
        },
        GENERATOR: {
            output?: string;
            provider?: string;
            binaryTargets?: string | string[];
        },
        DB: {
            provider?: string;
            url?: string;
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

export type PrismaQlDSLOptions<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined> =
    A extends keyof PrismaQlDSLOptionMap
    ? C extends keyof PrismaQlDSLOptionMap[A]
    ? PrismaQlDSLOptionMap[A][C]
    : Record<string, string | number | boolean | Array<string>>
    : Record<string, string | number | boolean | Array<string>>;


export interface PrismaQLParsedDSL<
    A extends PrismaQlDSLAction = PrismaQlDSLAction,
    C extends PrismaQLDSLCommand = PrismaQLDSLCommand,
    T extends PrismaQlDSLType = PrismaQlDSLType
> {
    action: A;
    command?: C;
    args?: PrismaQLDSLArgs<A, C>;
    options?: PrismaQlDSLOptions<A, C>;
    prismaBlock?: string;
    raw: string;
    type: T;
}

export type PrismaQlDSLArgsProcessor<
    A extends PrismaQlDSLAction = PrismaQlDSLAction,
    C extends PrismaQLDSLCommand = PrismaQLDSLCommand
> = (
    parsedArgs: PrismaQLDSLArgs<A, C>,
    rawArgs: string | undefined
) => PrismaQLDSLArgs<A, C>;

const DSL_PATTERN = /^([A-Z]+)(?:\s+([A-Z_]+))?(?:\s+([\w\s,*]+))?(?:\s*\(\{([\s\S]*?)\}\))?(?:\s*\(([^)]*?)\))?$/i;

const ACTION_COMMAND_MAP: Record<PrismaQlDSLAction, PrismaQLDSLCommand[]> = {
    GET: ["MODELS", "DB", "GENERATORS", "MODEL", "ENUM_RELATIONS", "FIELDS", "RELATIONS", "ENUMS", "MODELS_LIST"],
    ADD: ["MODEL", "GENERATOR", "FIELD", "RELATION", "ENUM"],
    DELETE: ["MODEL", "FIELD", "RELATION", "ENUM", "GENERATOR"],
    UPDATE: ["FIELD", "ENUM", "GENERATOR", "DB"],
    PRINT: [],
    VALIDATE: [],
};

export class PrismaQlDslParser<
    A extends string = PrismaQlDSLAction,
    C extends string = PrismaQLDSLCommand
> {
    private customCommands: Record<A, C[]> = {} as Record<A, C[]>;
    private actionTypeMap: Record<PrismaQlDSLAction, PrismaQlDSLType> = {
        GET: "query",
        ADD: "mutation",
        DELETE: "mutation",
        UPDATE: "mutation",
        PRINT: "query",
        VALIDATE: "query",
    };
    constructor(
        public argsProcessors: Record<
            PrismaQlDSLAction,
            { default: PrismaQlDSLArgsProcessor<any, any> } & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>
        >
    ) {
    }
    public registerCommand(action: A, command: C, type: PrismaQlDSLType) {
        if (!this.customCommands[action]) {
            this.customCommands[action] = [];
        }
        this.customCommands[action].push(command);
        (this.actionTypeMap as Record<string, PrismaQlDSLType>)[action] = type;
    }
    public getCommands(): Record<A, C[]> {
        return {
            ...ACTION_COMMAND_MAP,
            ...this.customCommands,
        } as Record<A, C[]>;
    }

    parseCommand<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand, T extends 'query' | 'mutation'>(input: string): PrismaQLParsedDSL<A, C, T> {
        const trimmed = input.trim();
        if (!trimmed.endsWith(";")) {
const errorMessage = `
${chalk.red("Syntax Error: Missing semicolon (;) at the end of the command.")}

${chalk.yellow("Each DSL command must end with a semicolon.")} 
For example:

    ${chalk.green("GET MODELS;")}
    ${chalk.green("DELETE MODEL Product;")}

Please check your input and try again.
`;
console.error(errorMessage);
            throw new Error("DSL command must end with a semicolon.");
        }
        const raw = trimmed.slice(0, -1).trim();

        const match = raw.match(DSL_PATTERN);
        if (!match) {
            throw new Error(`Unable to parse DSL line: "${raw}"`);
        }

        const actionStr = match[1].toUpperCase() as PrismaQlDSLAction;
        const commandStr = match[2]?.toUpperCase() as C;
        const argsStr = match[3]?.trim() || undefined;
        let prismaBlockStr = match[4]?.trim() || undefined;
        if (prismaBlockStr) {
            prismaBlockStr = prismaBlockStr.replace(/'/g, '"');
            prismaBlockStr = prismaBlockStr.replace(/\\n/g, "\n");
            prismaBlockStr = prismaBlockStr.replace(/\|/g, "\n");
        }
        let optionsStr = match[5]?.trim() || undefined;
        if (optionsStr) {
            optionsStr = optionsStr.replace(/'/g, '"');
            optionsStr = optionsStr.replace(/\\n/g, "\n");
            optionsStr = optionsStr.replace(/\|/g, "\n");
        }

        if (!(actionStr in ACTION_COMMAND_MAP) && !(actionStr in this.customCommands)) {
            throw new Error(`Unsupported action "${actionStr}". Supported actions: ${Object.keys(ACTION_COMMAND_MAP).join(", ")}`);
        }

        let finalCommand: C | undefined;
        const actionKey = actionStr as A;
        const commands = this.getCommands() as unknown as Record<A, C[]>;
        const availableCommands = commands[actionKey] || [];

        if (commandStr) {
            if (!availableCommands.includes(commandStr)) {
                throw new Error(`Invalid command "${commandStr}" for action "${actionStr}". Supported: ${availableCommands.join(", ")}`);
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
            type: this.actionTypeMap[actionStr] as T,
        };
    }
    parseParams(input: string): PrismaQlDSLOptions<any, any> {
        const result: PrismaQlDSLOptions<any, any> = {};
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
                    result[key] = valueStr.split(",").map(v => v.trim().replace(/^["']+|["']+$/g, ''));
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
    parseArgs<A extends PrismaQlDSLAction, C extends PrismaQLDSLCommand | undefined>(argsStr: string | undefined): PrismaQLDSLArgs<A, C> {
        const args: PrismaQLDSLArgs<A, C> = {};
        if (!argsStr) return args;

        const tokens = argsStr.split(",").map(t => t.trim()).filter(Boolean);
        for (const token of tokens) {
            args.models = args.models || [];
            args.models.push(token);
        }
        return args;
    }
    detectActionType(source: string): PrismaQlDSLType | null {
        const DSL_ACTION_PATTERN = /^([A-Z]+)/i;
        const match = source.match(DSL_ACTION_PATTERN);
        if (!match) return null;
        const actionStr = match[1].toUpperCase() as PrismaQlDSLAction;
        return this.actionTypeMap[actionStr] || null;
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

export const basePrismaQlAgsProcessor: Record<
    PrismaQlDSLAction,
    { default: PrismaQlDSLArgsProcessor<any, any> } & Partial<Record<PrismaQLDSLCommand, PrismaQlDSLArgsProcessor<any, any>>>
> = {
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
        GENERATOR: (parsedArgs, rawArgs) => {
            return { generators: rawArgs ? rawArgs.split(",").map(g => g.trim()) : [] };
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
            const [fromModel, toModel] = rawArgs?.split("AND") || [];
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
        },
        GENERATOR: (_, rawArgs) => {
            return { generators: rawArgs ? rawArgs.split(",").map(e => e.trim()) : [] };
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
        },
        GENERATOR: (parsedArgs, rawArgs) => {
            return { generators: rawArgs ? rawArgs.split(",").map(g => g.trim()) : [] };
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

/**
 * Example of extending the base parser with custom actions and commands
 *
type CustomAction = BasePrismaQlDSLAction | "SAY";
type CustomCommand = BasePrismaQLDSLCommand | "HI";
type CustomParserArgsProcessors = Record<
    CustomAction,
    {
        default: PrismaQlDSLArgsProcessor<any, any>;
    } & Partial<Record<CustomCommand, PrismaQlDSLArgsProcessor<any, any>>>
>;

const customArgsProcessors: CustomParserArgsProcessors = {
    ...basePrismaQlAgsProcessor,
    SAY: {
        default: (parsedArgs) => parsedArgs,
        HI: (parsedArgs, rawArgs) => {
            return {
                models: rawArgs ? rawArgs.split(",").map(m => m.trim()) : [],
            };
        },
    },
};

export const customParser = new PrismaQlDslParser<CustomAction, CustomCommand>(
    customArgsProcessors
);
customParser.registerCommand("SAY", "HI", "query");
console.log('test', customParser.parseCommand('SAY HI model1, model2;'));
*/
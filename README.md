# PrismaQL Core - Advanced Prisma Schema Editing Library

[![npm version](https://img.shields.io/npm/v/prismaql?color=blue)](https://www.npmjs.com/package/prismaql)
[![license](https://img.shields.io/npm/l/prismaql.svg)](LICENSE.md)
[![GitHub issues](https://img.shields.io/github/issues/unbywyd/prismaql)](https://github.com/unbywyd/prismaql/issues)
[![GitHub stars](https://img.shields.io/github/stars/unbywyd/prismaql?style=social)](https://github.com/unbywyd/prismaql)

## Introduction

**PrismaQL Core** provides a **powerful SQL-like DSL** for safely and programmatically **editing Prisma schema files**. It allows you to manage **models**, **fields**, **relations**, and **enums** while preserving schema integrity via **AST-based validation**, **commit tracking**, and **backup mechanisms**.

Designed as a **standalone library** or to be used alongside the [PrismaQL CLI](https://github.com/unbywyd/prismaql-cli), PrismaQL Core offers:

- **Declarative Command Syntax** – Easy-to-read commands like `GET MODELS`, `ADD FIELD`, and more.
- **Query & Mutation Separation** – Read-only operations (`GET`, `PRINT`, `VALIDATE`) versus modifying ones (`ADD`, `DELETE`, `UPDATE`).
- **Configurable Workflow** – Integrate your own handlers for queries and mutations.
- **Safe & Reversible Edits** – Full validation and commit logs, plus automatic backups.
- **Extensibility** – Register custom commands or augment existing ones.

> **Note:** PrismaQL is alpha-stage software. APIs may evolve, and advanced features are still in development.

---

## How It Works

1. **Parsing DSL** – Raw text commands (e.g. `GET MODEL User;`) go through the **PrismaQlDslParser**, producing a structured object.
2. **Validation & Execution** – Queries simply inspect the schema; mutations modify it, ensuring AST-level integrity.
3. **Backup & Commit** – Each mutation can undergo a dry run, then commit changes. Old versions are stored in `.prisma/backups`.
4. **Extensible Handlers** – You can register **query** or **mutation** handlers to shape how commands are processed.

---

## Supported Commands

 [PrismaQL CLI](https://github.com/unbywyd/prismaql-cli) supports the same **Query** and **Mutation** commands as the core library:

### 1. Query Commands

- `GET MODELS` – List all models with highlighting.
- `GET MODEL <name>` – Show details for a specific model (fields, relations, etc.).
- `GET ENUM_RELATIONS <enum>` – Show references to a specific enum across models.
- `GET FIELDS <model>` – List fields for a model.
- `GET FIELDS <field,field2> IN <model>` – Show specific fields.
- `GET RELATIONS <model,model2> (depth?=1)` – Display relations; optionally set a depth.
- `GET ENUMS (raw?)` / `GET ENUMS <enum, ...>` – Show one or more enums.
- `GET MODELS_LIST` – Display a sorted list of all models.
- `PRINT` – Print the entire schema in color.
- `GET DB` – Show the current database connection.
- `GET GENERATORS` – List all generators.
- `VALIDATE` – Validate the schema.

### 2. Mutation Commands

- `ADD MODEL <name> ({...})` – Create a new model with a Prisma block.
- `ADD FIELD <name> TO <model> ({String})` – Add a field to a model.
- `ADD RELATION <modelA> AND <modelB> (type=1:M, ...)` – Create a relation between two models.
- `ADD ENUM <name> ({A|B|C})` – Create a new enum.
- `DELETE MODEL <name>` – Delete a model.
- `DELETE FIELD <name> IN <model>` – Remove a field.
- `DELETE RELATION <modelA>, <modelB> (relationName=...)` – Remove a relation.
- `DELETE ENUM <name>` – Delete an enum.
- `UPDATE FIELD <name> IN <model> ({...})` – Recreate a field (caution).
- `UPDATE ENUM <name> ({A|B}) (replace=?)` – Append or replace enum values.
- `UPDATE DB (url='...', provider='...')` – Update the database connection.
- `UPDATE GENERATOR <name> ({...}) (provider='...', output='...')` – Update a generator.
- `ADD GENERATOR <name> ({...})` – Add a new generator.
- `DELETE GENERATOR <name>` – Remove a generator.

#### 📸 Preview

![Prismalux Syntax Highlighting](https://raw.githubusercontent.com/unbywyd/prismaql/master/assets/1.png)
![Prismalux Syntax Highlighting](https://raw.githubusercontent.com/unbywyd/prismaql/master/assets/2.png)




## Flow of Execution

1. **Parse Command** – `PrismaQlDslParser` converts your raw command string into a structured `PrismaQLParsedDSL` object.
2. **Send to Provider** – `PrismaQlProvider` receives the parsed command. For example:
   ```ts
   provider.apply(parsedCommand);
   ```
3. **Handlers** – The provider dispatches the command to the correct handler (`QueryHandler` or `MutationHandler`) based on `type`.
4. **Validation & Dry Run** – Each mutation can be tested in a `dryRun` mode before final commit.
5. **Commit & Backup** – If the command is valid, changes are saved, and the old schema is backed up under `.prisma/backups`.
6. **Rebase** – The schema loader can rebase the in-memory state to reflect the final updated schema.

---

## Extending PrismaQL

### Custom Parsers

You can build your own DSL commands:

```ts
import {
  PrismaQlDslParser,
  BasePrismaQlDSLAction,
  BasePrismaQLDSLCommand,
  PrismaQlDSLArgsProcessor,
} from "prismaql";

// Extend base actions with a custom action
type CustomAction = BasePrismaQlDSLAction | "SAY";
// Extend base commands with a custom command
type CustomCommand = BasePrismaQLDSLCommand | "HI";

// Provide argument processors
const customArgsProcessors: Record<
  CustomAction,
  {
    default: PrismaQlDSLArgsProcessor<any, any>;
  } & Partial<Record<CustomCommand, PrismaQlDSLArgsProcessor<any, any>>>
> = {
  // Use existing base processors here
  ...basePrismaQlAgsProcessor,
  // Add custom action
  SAY: {
    default: (parsedArgs) => parsedArgs,
    HI: (parsedArgs, rawArgs) => {
      return {
        models: rawArgs ? rawArgs.split(",").map((m) => m.trim()) : [],
      };
    },
  },
};

// Create a custom parser
const customParser = new PrismaQlDslParser<CustomAction, CustomCommand>(
  customArgsProcessors
);

// Register custom command
customParser.registerCommand("SAY", "HI", "query");
console.log(customParser.parseCommand("SAY HI model1, model2;"));
```

### Custom Handlers

Register your own logic for queries or mutations:

```ts
import {
  PrismaQlMutationHandlerRegistry,
  PrismaQlQueryHandlerRegistry,
} from "prismaql";

export const mutationsHandler = new PrismaQlMutationHandlerRegistry();
mutationsHandler.register("ADD", "MODEL", addModel);

export const queryHandler = new PrismaQlQueryHandlerRegistry();
queryHandler.register("GET", "MODEL", getModel);
```

### The Provider

Once you have parsers and handlers, set up a provider:

```ts
import {
  PrismaQlProvider,
  PrismaQlSchemaLoader,
  PrismaQlRelationCollector,
} from "prismaql";

const manager = new PrismaQlSchemaLoader(new PrismaQlRelationCollector());
await manager.loadFromFile("./prisma/schema.prisma");

const provider = new PrismaQlProvider({
  queryHandler: queryHandler,
  mutationHandler: mutationsHandler,
  loader: manager,
});

// Apply commands
provider.multiApply(`
  ADD MODEL User ({ id Int @id, name String });
  ADD FIELD email TO User ({String @unique});
`);
```

This approach works both **programmatically** and through the **CLI**, making dynamic schema changes easy.

---

## Example Usage

### Using PrismaQL in Code

```ts
import { prismaQlParser, PrismaQlProvider } from "prismaql";

const command =
  "ADD MODEL User ({ id Int @id @default(autoincrement()), name String });";
const parsedCommand = prismaQlParser.parseCommand(command);

const provider = new PrismaQlProvider({
  queryHandler: myQueryHandler,
  mutationHandler: myMutationHandler,
  loader: mySchemaLoader,
});

provider.apply(parsedCommand);
```

### Using PrismaQL CLI

Check out the [PrismaQL CLI](https://github.com/unbywyd/prismaql-cli):

```sh
# Query schema
prismaql "GET MODELS"

# Add a field programmatically
prismaql "ADD FIELD email TO User ({String})"

# Delete an entire model
prismaql "DELETE MODEL TempData"
```

---

## Current Status

🚧 **This project is in alpha (v0.0.1-alpha).**  
⚠️ Features are actively being developed, and APIs may change.

If you're interested in contributing, reporting issues, or suggesting features, check out the [GitHub repository](https://github.com/unbywyd/prismaql).

---

## License

PrismaQL Core is licensed under the **MIT License**.
© 2025 [Artyom Gorlovetskiy](https://unbywyd.com).

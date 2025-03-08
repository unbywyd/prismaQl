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

## Command Pattern

A command typically follows this structure:

```
ACTION COMMAND ...ARGS ({PRISMA_BLOCK}) (OPTIONS)
```

- **ACTION** – One of `GET`, `PRINT`, `VALIDATE`, `ADD`, `DELETE`, `UPDATE`.
- **COMMAND** – A specific target (e.g., `MODEL`, `RELATION`, `ENUM`).
- **ARGS** – Varies by command (e.g., `User`, `User,Post`, `fieldName`).
- **PRISMA_BLOCK** – An optional Prisma snippet in `({ ... })` format, used for model/field definitions.
- **OPTIONS** – Additional parameters in `(key=value, flag, ...)` format.

---

## Query Commands (READ-ONLY)

### `GET MODELS`

- **Description**: Lists all models with syntax highlighting.
- **Usage**: `GET MODELS;`

### `GET MODEL <name>`

- **Description**: Shows a detailed view of a specific model, including required fields and relations.
- **Usage**: `GET MODEL User;`

### `GET ENUM_RELATIONS <enum>`

- **Description**: Displays all models and fields referencing a specific enum.
- **Usage**: `GET ENUM_RELATIONS UserRoleEnum;`

### `GET FIELDS <model>`

- **Description**: Lists all fields of a given model.
- **Usage**: `GET FIELDS User;`

### `GET FIELDS <field, field2> IN <model>`

- **Description**: Retrieves and filters specific fields of a model.
- **Usage**: `GET FIELDS name, email IN User;`

### `GET RELATIONS <model, model2> (depth?=1)`

- **Description**: Shows relations among specified models. Accepts an optional depth.
- **Usage**: `GET RELATIONS User, Post (depth=2);`

### `GET DB`

- **Description**: Outputs the provider's current database connection and url.
- **Usage**: `GET DB;`

### `GET GENERATORS`

- **Description**: Lists all generators in the schema.
- **Usage**: `GET GENERATORS;`

### `GET ENUMS (raw?)`

- **Description**: Lists all enums in a formatted or raw representation.
- **Usage**: `GET ENUMS (raw=true);`

### `GET ENUMS <enum, enum>`

- **Description**: Filters and displays specific enums.
- **Usage**: `GET ENUMS UserRole, AnotherEnum;`

### `GET MODELS_LIST`

- **Description**: Outputs all model names in a sorted list.
- **Usage**: `GET MODELS_LIST;`

### `PRINT`

- **Description**: Prints the entire schema with color formatting.
- **Usage**: `PRINT;`

### `VALIDATE`

- **Description**: Validates the current schema, checking for errors.
- **Usage**: `VALIDATE;`

---

## Mutation Commands (WRITE OPERATIONS)

### `ADD MODEL <name> ({...})`

- **Description**: Creates a new model. Requires two parameters: `name` and a **Prisma block** with fields.
- **Example**: `ADD MODEL User ({ id Int @id @default(autoincrement()), name String });`

### `ADD FIELD <name> TO <model> ({String})`

- **Description**: Adds a new field to a model. Requires the field name, the model name, and a Prisma block describing field attributes.
- **Example**: `ADD FIELD email TO User ({String @unique});`

### `ADD RELATION <modelA> TO <modelB> (...options)`

- **Description**: Creates a relation between two models. Supports multiple options:
  - **`type`** (required): Defines the relation type: `"1:1" | "1:M" | "M:N"`.
  - **`pivotTable`** (optional): `string | true`. If `true`, a pivot table is created automatically. In `1:1` or `1:M`, it can create an intermediate table.
  - **`fkHolder`** (optional): Specifies which model holds the foreign key.
  - **`required`** (optional): Marks the relation as required (`true`) or optional (`false`). Defaults to `true`.
  - **`relationName`** (optional): Custom relation name. If omitted, a name is generated.
- **Example**:
  ```
  ADD RELATION User TO Profile (
      type=1:1,
      pivotTable=true,
      fkHolder=User,
      required=false,
      relationName=UserProfile
  );
  ```

### `ADD ENUM <name> ({A|B|C})`

- **Description**: Creates a new enum. The block can include values separated by `|`.
- **Example**: `ADD ENUM Role ({ADMIN|USER|SUPERUSER});`

### `DELETE MODEL <name>`

- **Description**: Removes a model by name.
- **Example**: `DELETE MODEL TempData;`

### `DELETE FIELD <name> IN <model>`

- **Description**: Removes a specific field from a model.
- **Example**: `DELETE FIELD email IN User;`

### `DELETE RELATION <modelA>, <modelB> (...options)`

- **Description**: Unlinks relations between two models. If no options are passed, **all** relations between them are removed.
  - **`fieldA`** (optional): Field name on Model A.
  - **`fieldB`** (optional): Field name on Model B.
  - **`relationName`** (optional): If a relation was named via `@relation("myRel")`, specify it here.
- **Example**:
  ```
  DELETE RELATION User, Post (
      fieldA=userId,
      fieldB=authorId,
      relationName=UserPosts
  );
  ```

### `DELETE ENUM <name>`

- **Description**: Removes an existing enum.
- **Example**: `DELETE ENUM Role;`

### `UPDATE FIELD <name> IN <model> ({...})`

- **Description**: Recreates the specified field in a model, which can break migrations if used carelessly.
- **Example**: `UPDATE FIELD email IN User ({String @unique @db.VarChar(255)});`

### `UPDATE ENUM <name> ({A|B})(replace?)`

- **Description**: Updates an enum. By default, new values are appended; with `replace=true`, the existing enum is replaced.
- **Example**:
  ```
  UPDATE ENUM Role ({ADMIN|SUPERADMIN}) (replace=true);
  ```

### `UPDATE DB (url='...', provider='...')`

- **Description**: Updates the database connection URL and provider.
- **Example**:
  ```
  UPDATE DB (
      url='mysql://user:password@localhost:3306/db',
      provider='mysql'
  );
  ```

### `UPDATE GENERATOR <name> ({...})(provider='...', output='...')`

- **Description**: Updates a generator with new options.
- **Example**:
  ```
  UPDATE GENERATOR client ({provider='prisma-client-js', output='@prisma/client'});
  ```

### `ADD GENERATOR <name> ({...})`

- **Description**: Adds a new generator to the schema.
- **Example**:
  ```
  ADD GENERATOR client ({provider='', output=''});
  ```

### `DELETE GENERATOR <name>`
- **Description**: Removes a generator from the schema.
- **Example**:
  ```
  DELETE GENERATOR client;
  ```
---

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

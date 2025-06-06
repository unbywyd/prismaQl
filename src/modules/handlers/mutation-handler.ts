import { addEnum } from "../prehandlers/mutation-handlers/add-enum.js";
import { addField } from "../prehandlers/mutation-handlers/add-field.js";
import { addModel } from "../prehandlers/mutation-handlers/add-model.js";
import { addRelation } from "../prehandlers/mutation-handlers/add-relation.js";
import { deleteEnum } from "../prehandlers/mutation-handlers/delete-enum.js";
import { deleteField } from "../prehandlers/mutation-handlers/delete-field.js";
import { deleteModel } from "../prehandlers/mutation-handlers/delete-model.js";
import { deleteRelation } from "../prehandlers/mutation-handlers/delete-relations.js";
import { updateEnum } from "../prehandlers/mutation-handlers/update-enum.js";
import { updateField } from "../prehandlers/mutation-handlers/update-field.js";
import { PrismaQlMutationHandlerRegistry } from "../handler-registries/mutation-handler-registry.js";
import { addGenerator } from "../prehandlers/mutation-handlers/add-generator.js";
import { updateGenerator } from "../prehandlers/mutation-handlers/update-generator.js";
import { updateDB } from "../prehandlers/mutation-handlers/update-db.js";

export const mutationsHandler = new PrismaQlMutationHandlerRegistry();

mutationsHandler.register("ADD", "MODEL", addModel);
mutationsHandler.register("ADD", "FIELD", addField);
mutationsHandler.register("ADD", "ENUM", addEnum);
mutationsHandler.register("ADD", "RELATION", addRelation);
mutationsHandler.register("ADD", "GENERATOR", addGenerator);

mutationsHandler.register("DELETE", "ENUM", deleteEnum);
mutationsHandler.register("DELETE", "MODEL", deleteModel);
mutationsHandler.register("DELETE", "FIELD", deleteField);
mutationsHandler.register("DELETE", "RELATION", deleteRelation);
mutationsHandler.register("DELETE", "GENERATOR", deleteRelation);

mutationsHandler.register("UPDATE", "FIELD", updateField);
mutationsHandler.register("UPDATE", "ENUM", updateEnum);
mutationsHandler.register("UPDATE", "GENERATOR", updateGenerator);
mutationsHandler.register("UPDATE", "DB", updateDB);

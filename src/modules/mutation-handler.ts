import { addEnum } from "./cli-handlers/add-enum.js";
import { addField } from "./cli-handlers/add-field.js";
import { addModel } from "./cli-handlers/add-model.js";
import { addRelation } from "./cli-handlers/add-relation.js";
import { deleteEnum } from "./cli-handlers/delete-enum.js";
import { deleteField } from "./cli-handlers/delete-field.js";
import { deleteModel } from "./cli-handlers/delete-model.js";
import { deleteRelation } from "./cli-handlers/delete-relations.js";
import { updateEnum } from "./cli-handlers/update-enum.js";
import { updateField } from "./cli-handlers/update-field.js";
import { MutationHandlerRegistry } from "./handler-registries/mutation-handler-registry.js";

const mutationHandler = new MutationHandlerRegistry();

mutationHandler.register("ADD", "MODEL", addModel);
mutationHandler.register("ADD", "FIELD", addField);
mutationHandler.register("ADD", "ENUM", addEnum);
mutationHandler.register("ADD", "RELATION", addRelation);

mutationHandler.register("DELETE", "ENUM", deleteEnum);
mutationHandler.register("DELETE", "MODEL", deleteModel);
mutationHandler.register("DELETE", "FIELD", deleteField);
mutationHandler.register("DELETE", "RELATION", deleteRelation);

mutationHandler.register("UPDATE", "FIELD", updateField);
mutationHandler.register("UPDATE", "ENUM", updateEnum);

export default mutationHandler;
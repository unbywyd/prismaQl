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
import { MutationHandlerRegistry } from "../handler-registries/mutation-handler-registry.js";

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
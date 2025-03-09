import { addEnum } from './modules/prehandlers/mutation-handlers/add-enum.cjs';
import { addField } from './modules/prehandlers/mutation-handlers/add-field.cjs';
import { addModel } from './modules/prehandlers/mutation-handlers/add-model.cjs';
import { addRelation } from './modules/prehandlers/mutation-handlers/add-relation.cjs';
import { deleteEnum } from './modules/prehandlers/mutation-handlers/delete-enum.cjs';
import { deleteField } from './modules/prehandlers/mutation-handlers/delete-field.cjs';
import { deleteModel } from './modules/prehandlers/mutation-handlers/delete-model.cjs';
import { deleteRelation } from './modules/prehandlers/mutation-handlers/delete-relations.cjs';
import { updateEnum } from './modules/prehandlers/mutation-handlers/update-enum.cjs';
import { updateField } from './modules/prehandlers/mutation-handlers/update-field.cjs';

declare const index_addEnum: typeof addEnum;
declare const index_addField: typeof addField;
declare const index_addModel: typeof addModel;
declare const index_addRelation: typeof addRelation;
declare const index_deleteEnum: typeof deleteEnum;
declare const index_deleteField: typeof deleteField;
declare const index_deleteModel: typeof deleteModel;
declare const index_deleteRelation: typeof deleteRelation;
declare const index_updateEnum: typeof updateEnum;
declare const index_updateField: typeof updateField;
declare namespace index {
  export { index_addEnum as addEnum, index_addField as addField, index_addModel as addModel, index_addRelation as addRelation, index_deleteEnum as deleteEnum, index_deleteField as deleteField, index_deleteModel as deleteModel, index_deleteRelation as deleteRelation, index_updateEnum as updateEnum, index_updateField as updateField };
}

export { index as i };

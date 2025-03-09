import { getJsonEnumRelations } from './modules/prehandlers/json-handlers/get-enum-relations.cjs';
import { getJsonEnums } from './modules/prehandlers/json-handlers/get-enums.cjs';
import { getJsonFields } from './modules/prehandlers/json-handlers/get-fields.cjs';
import { getJsonModelNames, sortModelNames } from './modules/prehandlers/json-handlers/get-model-names.cjs';
import { FieldSummary, getJsonModel } from './modules/prehandlers/json-handlers/get-model.cjs';
import { getJsonModels } from './modules/prehandlers/json-handlers/get-models.cjs';
import { getJsonRelations } from './modules/prehandlers/json-handlers/get-relations.cjs';

declare const index_FieldSummary: typeof FieldSummary;
declare const index_getJsonEnumRelations: typeof getJsonEnumRelations;
declare const index_getJsonEnums: typeof getJsonEnums;
declare const index_getJsonFields: typeof getJsonFields;
declare const index_getJsonModel: typeof getJsonModel;
declare const index_getJsonModelNames: typeof getJsonModelNames;
declare const index_getJsonModels: typeof getJsonModels;
declare const index_getJsonRelations: typeof getJsonRelations;
declare const index_sortModelNames: typeof sortModelNames;
declare namespace index {
  export { index_FieldSummary as FieldSummary, index_getJsonEnumRelations as getJsonEnumRelations, index_getJsonEnums as getJsonEnums, index_getJsonFields as getJsonFields, index_getJsonModel as getJsonModel, index_getJsonModelNames as getJsonModelNames, index_getJsonModels as getJsonModels, index_getJsonRelations as getJsonRelations, index_sortModelNames as sortModelNames };
}

export { index as i };

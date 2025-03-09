import { getEnumRelations } from './modules/prehandlers/render-handlers/get-enum-relations.cjs';
import { getEnums } from './modules/prehandlers/render-handlers/get-enums.cjs';
import { getFields } from './modules/prehandlers/render-handlers/get-fields.cjs';
import { formatColumns, getModelNames, sortModelNames } from './modules/prehandlers/render-handlers/get-model-names.cjs';
import { FieldSummary, getModel } from './modules/prehandlers/render-handlers/get-model.cjs';
import { getModels } from './modules/prehandlers/render-handlers/get-models.cjs';
import { getRelations } from './modules/prehandlers/render-handlers/get-relations.cjs';

declare const index_FieldSummary: typeof FieldSummary;
declare const index_formatColumns: typeof formatColumns;
declare const index_getEnumRelations: typeof getEnumRelations;
declare const index_getEnums: typeof getEnums;
declare const index_getFields: typeof getFields;
declare const index_getModel: typeof getModel;
declare const index_getModelNames: typeof getModelNames;
declare const index_getModels: typeof getModels;
declare const index_getRelations: typeof getRelations;
declare const index_sortModelNames: typeof sortModelNames;
declare namespace index {
  export { index_FieldSummary as FieldSummary, index_formatColumns as formatColumns, index_getEnumRelations as getEnumRelations, index_getEnums as getEnums, index_getFields as getFields, index_getModel as getModel, index_getModelNames as getModelNames, index_getModels as getModels, index_getRelations as getRelations, index_sortModelNames as sortModelNames };
}

export { index as i };

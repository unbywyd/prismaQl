import { getManyToManyTableName } from "../field-relation-collector.js";
import { handlerResponse } from "../handler-registries/handler-registry.js";
import pluralize from "pluralize";
import { camelCase, pascalCase } from "change-case";
export const addRelation = (prismaState, data) => {
    const { args, options, prismaBlock } = data;
    const response = handlerResponse(data);
    const type = options?.type;
    if (!type) {
        return response.error("Relation type is required");
    }
    const models = args?.models;
    if (!models || models.length !== 2) {
        return response.error("Two models are required for relation");
    }
    const [modelA, modelB] = models;
    const modelARef = prismaState.builder.findByType("model", { name: modelA });
    const modelBRef = prismaState.builder.findByType("model", { name: modelB });
    if (!modelARef) {
        return response.error(`Model ${modelA} not found, please add it first`);
    }
    if (!modelBRef) {
        return response.error(`Model ${modelB} not found, please add it first`);
    }
    const optional = options?.required === false || options?.required === undefined;
    const relationName = `"${options?.relationName || getManyToManyTableName(modelA, modelB)}"`;
    if (type == '1:1') {
        const fkHolder = options?.fkHolder || modelBRef.name;
        const refModel = fkHolder === modelA ? modelB : modelA;
        const modelA_Builder = prismaState.builder.model(fkHolder); // Session
        if (!modelA_Builder) {
            return response.error(`Model ${fkHolder} not found, please add it first`);
        }
        const fkKey = camelCase(`${refModel}Id`);
        let refKey = camelCase(refModel);
        let fkFieldBuilder = modelA_Builder.field(fkKey, "String" + (optional ? "?" : ""));
        fkFieldBuilder = fkFieldBuilder.attribute("unique");
        refKey = refKey == camelCase(fkHolder) ? 'by' + pascalCase(refKey) : refKey;
        let fkFieldBuilder2 = modelA_Builder.field(refKey, refModel + (optional ? "?" : ""));
        fkFieldBuilder2.attribute("relation", [relationName, `fields: [${fkKey}]`, `references: [id]`]);
        const modelB_Builder = prismaState.builder.model(refModel);
        let fkFieldBuilder3 = modelB_Builder.field(camelCase(fkHolder), fkHolder + "?");
        fkFieldBuilder3.attribute("relation", [relationName]);
        return response.result(`One-to-One relation added between ${modelA} and ${modelB}`);
    }
    else if (type == "1:M") {
        const fkHolder = options?.fkHolder || modelARef.name;
        const refModel = fkHolder === modelA ? modelB : modelA;
        const modelA_Builder = prismaState.builder.model(fkHolder); // Session
        if (!modelA_Builder) {
            return response.error(`Model ${fkHolder} not found, please add it first`);
        }
        const fkKey = camelCase(`${refModel}Id`);
        const refKey = camelCase(refModel);
        let fkFieldBuilder = modelA_Builder.field(fkKey, "String" + (optional ? "?" : ""));
        fkFieldBuilder = fkFieldBuilder.attribute("unique");
        let fkFieldBuilder2 = modelA_Builder.field(refKey, refModel + (optional ? "?" : ""));
        fkFieldBuilder2.attribute("relation", [relationName, `fields: [${fkKey}]`, `references: [id]`]);
        const modelB_Builder = prismaState.builder.model(refModel);
        let fkFieldBuilder3 = modelB_Builder.field(pluralize.plural(camelCase(fkHolder)), fkHolder + "[]");
        fkFieldBuilder3.attribute("relation", [relationName]);
        return response.result(`One-to-Many relation added between ${modelA} and ${modelB}`);
    }
    else {
        // Тут сложнее, надо создавать промежуточную таблицу 
    }
    return response.error("Not implemented");
};
/*
Option 1:M
model Contact {
  id           String   @id @default(cuid())
  name         String?
  photoMediaId String?  @unique
  telegram     String?
  phoneNumber  String?
  hasWhatsapp  Boolean? @default(false)
  userId       String
  sessionId    String?  @unique
  session      Session? @relation("ContactToSession", fields: [sessionId], references: [id])
}

model Session {
  id          String    @id @default(cuid())
  email       String?
  phoneNumber String?
  code        String
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  deletedAt   DateTime?
  isDeleted   Boolean   @default(false)
  contacts    Contact[] @relation("ContactToSession")
}

*/
/*
model Contact {
  id           String   @id @default(cuid())
  name         String?
  photoMediaId String?  @unique
  telegram     String?
  phoneNumber  String?
  hasWhatsapp  Boolean? @default(false)
  userId       String
  sessionId    String  @unique
  session      Session @relation("ContactToSession", fields: [sessionId], references: [id])
}
*/ 
//# sourceMappingURL=add-relation.js.map
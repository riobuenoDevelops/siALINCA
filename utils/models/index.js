const Ajv = require("ajv").default;
const ajv = new Ajv();

//schemas
const modelIdSchema = require("./ModelId");
const { roleSchema, updatedRoleSchema } = require("./Role");
const { userSchema, updatedUserSchema } = require("./User");
const { applicantSchema, updatedApplicantSchema } = require("./Applicant");
const {
  deliveryNoteSchema,
  updatedDeliveryNoteSchema,
} = require("./DeliveryNote");
const {
  electroDeviceSchema,
  updatedElectorDeviceSchema,
} = require("./ElectroDevice");
const { enamelwareSchema, updatedEnamelwareSchema } = require("./Enamelware");
const { mealSchema, updatedMealSchema } = require("./Meal");
const { medicineSchema, updatedMedicineSchema } = require("./Medicine");
const { propertySchema, updatedPropertySchema } = require("./Property");
const {
  purchaseOrderSchema,
  updatedPurchaseOrderSchema,
} = require("./PurchaseOrder");
const { sedeSchema, updatedSedeSchema } = require("./Sede");
const { stationarySchema, updatedStationarySchema } = require("./Stationary");
const { storeSchema, updatedStoreSchema } = require("./Store");
const { itemSchema, updatedItemSchema } = require("./Item");

//load schemas
ajv.addSchema(modelIdSchema);
ajv.addSchema(roleSchema);
ajv.addSchema(updatedRoleSchema);
ajv.addSchema(userSchema);
ajv.addSchema(updatedUserSchema);
ajv.addSchema(applicantSchema);
ajv.addSchema(updatedApplicantSchema);
ajv.addSchema(deliveryNoteSchema);
ajv.addSchema(updatedDeliveryNoteSchema);
ajv.addSchema(enamelwareSchema);
ajv.addSchema(updatedEnamelwareSchema);
ajv.addSchema(mealSchema);
ajv.addSchema(updatedMealSchema);
ajv.addSchema(medicineSchema);
ajv.addSchema(updatedMedicineSchema);
ajv.addSchema(propertySchema);
ajv.addSchema(updatedPropertySchema);
ajv.addSchema(purchaseOrderSchema);
ajv.addSchema(updatedPurchaseOrderSchema);
ajv.addSchema(sedeSchema);
ajv.addSchema(updatedSedeSchema);
ajv.addSchema(stationarySchema);
ajv.addSchema(updatedStationarySchema);
ajv.addSchema(storeSchema);
ajv.addSchema(updatedStoreSchema);
ajv.addSchema(electroDeviceSchema);
ajv.addSchema(updatedElectorDeviceSchema);
ajv.addSchema(itemSchema);
ajv.addSchema(updatedItemSchema);

//compiling schemas
ajv.compile(modelIdSchema);
ajv.compile(roleSchema);
ajv.compile(updatedRoleSchema);
ajv.compile(userSchema);
ajv.compile(updatedUserSchema);
ajv.compile(applicantSchema);
ajv.compile(updatedApplicantSchema);
ajv.compile(deliveryNoteSchema);
ajv.compile(updatedDeliveryNoteSchema);
ajv.compile(enamelwareSchema);
ajv.compile(updatedEnamelwareSchema);
ajv.compile(mealSchema);
ajv.compile(updatedMealSchema);
ajv.compile(medicineSchema);
ajv.compile(updatedMedicineSchema);
ajv.compile(propertySchema);
ajv.compile(updatedPropertySchema);
ajv.compile(purchaseOrderSchema);
ajv.compile(updatedPurchaseOrderSchema);
ajv.compile(sedeSchema);
ajv.compile(updatedSedeSchema);
ajv.compile(stationarySchema);
ajv.compile(updatedStationarySchema);
ajv.compile(storeSchema);
ajv.compile(updatedStoreSchema);
ajv.compile(electroDeviceSchema);
ajv.compile(updatedElectorDeviceSchema);
ajv.compile(itemSchema);
ajv.compile(updatedItemSchema);

module.exports = ajv;

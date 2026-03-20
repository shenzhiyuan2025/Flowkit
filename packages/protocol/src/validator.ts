import Ajv from "ajv";
import widgetSchema from "./schemas/widget.schema.json";
import type { FlowKitWidget, ValidationResult } from "./types";

const ajv = new Ajv({ allErrors: true });
const validateWidgetSchema = ajv.compile(widgetSchema);

export function validateWidget(input: unknown): ValidationResult<FlowKitWidget> {
  const valid = validateWidgetSchema(input);
  if (!valid) {
    return {
      valid: false,
      errors: (validateWidgetSchema.errors ?? []).map(
        (item) => `${item.instancePath || "/"} ${item.message || "invalid"}`
      )
    };
  }
  return { valid: true, errors: [], value: input as FlowKitWidget };
}

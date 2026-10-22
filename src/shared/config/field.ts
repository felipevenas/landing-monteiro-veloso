export type ConfigField = {
  readonly value: string;
  readonly label: string;
  readonly required: boolean;
  readonly note?: string;
};

export function configField(
  value: string,
  label: string,
  required = false,
  note?: string,
): ConfigField {
  return { value: value.trim(), label, required, note };
}

export function publishable(field: ConfigField): string | null {
  return field.value.length > 0 ? field.value : null;
}

export function isPending(field: ConfigField): boolean {
  return field.value.length === 0;
}

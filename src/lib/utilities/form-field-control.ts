export interface GalFormFieldControl extends HTMLElement {
  disabled: boolean;
  required: boolean;
  readonly: boolean;
  value: unknown;
  fontSize?: string;
  maxLength?: number;
  max?: number;
  min?: number;
  step?: number;
}

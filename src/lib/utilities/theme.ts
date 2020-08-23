export interface IThemer {}

export enum ThemeVariables {
  foreground = '--gal-foreground-color',
  background = '--gal-background-color',
}

export const themer: Readonly<IThemer> = {};

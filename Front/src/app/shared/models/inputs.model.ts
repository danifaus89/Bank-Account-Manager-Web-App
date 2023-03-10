export interface InputMes {
  name: string;
  code: string;
}

export interface InputDescripcio {
  name?: string;
}

export interface FormObject {
  _id: any;
  concepte: string;
  import: string;
  descripcio: InputDescripcio[];
  tipus: string;
  date?: Date;
}

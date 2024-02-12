import { ICourt } from "./types";

export class Court implements ICourt {
  private _name: string;
  private _color: string;

  constructor(name: string, color: string) {
    this._name = name;
    this._color = color;
  }

  get name() {
    return this._name;
  }

  get color() {
    return this._color;
  }

  setColor(color: string): void {
    this._color = color;
  }
}

export class Buffer<T> {
  private _size: number;
  private _stack: T[] = [];

  constructor(size: number) {
    this._size = size;
  }

  public push(item: T) {
    this._stack.push(item);
    if (this._stack.length > this._size) {
      this._stack.shift();
    }
  }

  public shift(): T | undefined {
    return this._stack.shift();
  }

  public get isEmtpy(): Boolean {
    return this._stack.length === 0;
  }
}

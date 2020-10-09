export class TransactionFileRequest<T> {
  public file: T;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}

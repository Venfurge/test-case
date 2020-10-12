export class GetTransactionExcelRequest {
  status: number = null;
  type: number = null;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}

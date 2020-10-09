export class AddTransactionRequest {
  public status: number;
  public type: number;
  public clientName: string;
  public amount: number;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}

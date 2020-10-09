export class TransactionModel {
  public id: number;
  public status: number;
  public type: number;
  public clientName: string;
  public amount: number;

  constructor() {
    this.id = null;
    this.status = null;
    this.type = null;
    this.clientName = "";
    this.amount = null;
  }
}

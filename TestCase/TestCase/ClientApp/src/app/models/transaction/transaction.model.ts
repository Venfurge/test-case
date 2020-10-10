export class TransactionModel {
  public id: number;
  public status: string;
  public type: string;
  public clientName: string;
  public amount: number;

  constructor() {
    this.id = null;
    this.status = "";
    this.type = "";
    this.clientName = "";
    this.amount = null;
  }
}

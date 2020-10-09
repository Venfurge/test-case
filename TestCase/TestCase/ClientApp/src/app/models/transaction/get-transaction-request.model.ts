export class GetTransactionRequest {
  pn: number = 0;
  ps: number = 0;
  sort: string = "id";
  sortDir: string = "asc";
  status: number = null;
  type: number = null;

  constructor(model) {
    if (model == null) return;
    Object.assign(this, model);
  }
}

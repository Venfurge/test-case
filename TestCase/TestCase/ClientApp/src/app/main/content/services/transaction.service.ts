import { Injectable } from '@angular/core';
import { APITransactionService } from '../../../services/api/api-transaction.service';
import { DialogService } from '../../../services/dialog.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { GetTransactionRequest } from '../../../models/transaction/get-transaction-request.model';
import { PagingList } from '../../../models/paging-list.model';
import { TransactionModel } from '../../../models/transaction/transaction.model';
import { AddTransactionRequest } from '../../../models/transaction/add-transaction-request.model';
import { IdModelRequest } from '../../../models/id-model-request.model';
import { TransactionFileRequest } from '../../../models/transaction/transaction-file-request.model';
import { GetTransactionExcelRequest } from '../../../models/transaction/get-transaction-excel-request.model';

@Injectable()
export class TransactionService {

  onEditTransaction: Subject<IdModelRequest<AddTransactionRequest>>;
  onDeleteTransaction: Subject<number>;
  onAddTransactions: Subject<TransactionFileRequest<FormData>>;
  onGetTransactions: Subject<GetTransactionRequest>;
  onGetTransactionsExcel: Subject<GetTransactionExcelRequest>;

  onTransactionsChanged: BehaviorSubject<PagingList<TransactionModel>>;
  onGetTransactionsChanged: BehaviorSubject<GetTransactionRequest>;
  onTransactionssLoadingChanged: BehaviorSubject<boolean>;
  onTransactionsExcelFileChanged: BehaviorSubject<Blob>;

  request: GetTransactionRequest;

  constructor(
    private _apiService: APITransactionService,
    private _dialogService: DialogService,
  ) {
    this.request = new GetTransactionRequest({});

    this.onEditTransaction = new Subject();
    this.onDeleteTransaction = new Subject();
    this.onAddTransactions = new Subject();
    this.onGetTransactions = new Subject();
    this.onGetTransactionsExcel = new Subject();

    this.onTransactionsChanged = new BehaviorSubject(new PagingList<TransactionModel>());
    this.onGetTransactionsChanged = new BehaviorSubject<GetTransactionRequest>(this.request);
    this.onTransactionssLoadingChanged = new BehaviorSubject(false);
    this.onTransactionsExcelFileChanged = new BehaviorSubject(null);

    this.onEditTransaction.subscribe(request => this.editTransaction(request));
    this.onDeleteTransaction.subscribe(request => this.deleteTransaction(request));
    this.onAddTransactions.subscribe(request => this.addTransactions(request));
    this.onGetTransactionsExcel.subscribe(request => this.getTransactionsExcel(request));

    this.onGetTransactions.subscribe(request => {
      if (request != null) {
        this.request = request;
        this.onGetTransactionsChanged.next(this.request);
      }

      this.getTransactions();
    });
  }

  private async editTransaction(request: IdModelRequest<AddTransactionRequest>): Promise<void> {
    let response = await this._apiService.editTransaction(request);

    if (response.success) {
      this.onGetTransactions.next(null);
      this._dialogService.showSnackBar("Changed!");
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Transaction doesn't exist!");
        break;
    }
  }

  private async deleteTransaction(request: number): Promise<void> {
    let response = await this._apiService.deleteTransaction(request);

    if (response.success) {
      this.onGetTransactions.next(null);
      this._dialogService.showSnackBar("Deleted!");
      return;
    }

    switch (response.status) {
      case 404:
        this._dialogService.showSnackBar("Transaction doesn't exist!");
        break;
    }
  }

  private async addTransactions(request: TransactionFileRequest<FormData>): Promise<void> {
    let response = await this._apiService.addTransactions(request);

    if (response.success) {
      this.onGetTransactions.next(null);
      this._dialogService.showSnackBar("Successfully added!");
      return;
    }
  }

  public async getTransactionsExcel(request: GetTransactionExcelRequest): Promise<void> {
    let response = await this._apiService.getTransactionsExcel(request);

    if (response.size > 0) {
      this._dialogService.showSnackBar("Successfully downloaded!");
      this.onTransactionsExcelFileChanged.next(response);
      return;
    }

    this._dialogService.showSnackBar("Something goes wrong! Try again.");
    this.onTransactionsExcelFileChanged.next(null);
    return;
  }

  private async getTransactions(): Promise<void> {
    this.onTransactionssLoadingChanged.next(true);
    let response = await this._apiService.getTransactions(this.request);
    this.onTransactionssLoadingChanged.next(false);

    if (response.success) {
      this.onTransactionsChanged.next(response.model);
      return;
    }
  }
}

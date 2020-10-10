import { Injectable } from '@angular/core';
import { APITransactionService } from '../../../services/api/api-transaction.service';
import { DialogService } from '../../../services/dialog.service';
import { Subject, BehaviorSubject } from 'rxjs';
import { GetTransactionRequest } from '../../../models/transaction/get-transaction-request.model';
import { PagingList } from '../../../models/paging-list.model';
import { TransactionModel } from '../../../models/transaction/transaction.model';
import { AddTransactionRequest } from '../../../models/transaction/add-transaction-request.model';
import { IdModelRequest } from '../../../models/id-model-request.model';

@Injectable()
export class TransactionService {

  onEditTransaction: Subject<IdModelRequest<AddTransactionRequest>>;
  onDeleteTransaction: Subject<number>;
  onGetTransactions: Subject<GetTransactionRequest>;

  onTransactionsChanged: BehaviorSubject<PagingList<TransactionModel>>;
  onGetTransactionsChanged: BehaviorSubject<GetTransactionRequest>;
  onTransactionssLoadingChanged: BehaviorSubject<boolean>;

  request: GetTransactionRequest;

  constructor(
    private _apiService: APITransactionService,
    private _dialogService: DialogService,
  ) {
    this.request = new GetTransactionRequest({});

    this.onEditTransaction = new Subject();
    this.onDeleteTransaction = new Subject();
    this.onGetTransactions = new Subject();

    this.onTransactionsChanged = new BehaviorSubject(new PagingList<TransactionModel>());
    this.onGetTransactionsChanged = new BehaviorSubject<GetTransactionRequest>(this.request);
    this.onTransactionssLoadingChanged = new BehaviorSubject(false);

    this.onEditTransaction.subscribe(request => this.editTransaction(request));
    this.onDeleteTransaction.subscribe(request => this.deleteTransaction(request));

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

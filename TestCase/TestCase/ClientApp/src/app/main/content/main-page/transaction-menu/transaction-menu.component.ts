import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { GetTransactionRequest } from '../../../../models/transaction/get-transaction-request.model';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.component.html',
  styleUrls: ['./transaction-menu.component.scss']
})
export class TransactionMenuComponent implements OnInit, OnDestroy {
  selectedStatus: number = null;
  selectedType: number = null;

  request: GetTransactionRequest;

  private _unsubscribe: Subject<any>;

  constructor(
    private _transactionService: TransactionService,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit(): void {
    this._transactionService.onGetTransactionsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  onStatusChanged(status: number): void {
    this.request.status = status;
    this._transactionService.onGetTransactions.next(this.request);
  }

  onTypeChanged(type: number): void {
    this.request.type = type;
    this._transactionService.onGetTransactions.next(this.request);
  }
}

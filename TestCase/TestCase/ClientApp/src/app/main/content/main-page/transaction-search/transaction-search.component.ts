import { Component, OnInit, OnDestroy } from '@angular/core';
import { GetTransactionRequest } from '../../../../models/transaction/get-transaction-request.model';
import { Subject } from 'rxjs';
import { TransactionService } from '../../services/transaction.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { takeUntil } from "rxjs/operators";

@Component({
  selector: 'app-transaction-search',
  templateUrl: './transaction-search.component.html',
  styleUrls: ['./transaction-search.component.scss']
})
export class TransactionSearchComponent implements OnInit, OnDestroy {

  form: FormGroup;
  request: GetTransactionRequest;

  private _unsubscribe: Subject<any>;

  constructor(
    private _transactionService: TransactionService,
    private _builder: FormBuilder,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit(): void {
    this._transactionService.onGetTransactionsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });

    this.form = this.createForm();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  createForm(): FormGroup {
    let form = this._builder.group({
      find: [this.request.find || ''],
    });

    return form;
  }

  search() {
    this.request.find = this.form.value.find;

    this.request.pn = 0;
    this._transactionService.onGetTransactions.next(this.request);
  }
}

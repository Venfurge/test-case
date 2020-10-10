import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TransactionModel } from '../../../../../models/transaction/transaction.model';
import { Subject } from 'rxjs';
import { TransactionService } from '../../../services/transaction.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../../../services/dialog.service';
import { AddTransactionRequest } from '../../../../../models/transaction/add-transaction-request.model';
import { TransactionListComponent } from '../transaction-list.component';

@Component({
  selector: 'app-change-transaction-status',
  templateUrl: './change-transaction-status.component.html',
  styleUrls: ['./change-transaction-status.component.scss']
})
export class ChangeTransactionStatusComponent implements OnInit, OnDestroy {

  form: FormGroup;
  transactionStatusNumber: number = 0;
  transaction: TransactionModel;

  private _unsubscribe: Subject<any>;

  constructor(
    private _transactionService: TransactionService,
    private _dialogService: DialogService,
    private _builder: FormBuilder,
    public dialogRef: MatDialogRef<TransactionListComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    this.transaction = data.transaction;
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit(): void {

    //Switching transaction status string to int value
    switch (this.transaction.status) {
      case 'Pending':
        this.transactionStatusNumber = 0;
        break;
      case 'Completed':
        this.transactionStatusNumber = 1;
        break;
      case 'Cancelled':
        this.transactionStatusNumber = 2;
        break;
    }

    //Creating form
    this.form = this.createForm();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  createForm() {
    let form = this._builder.group({
      status: [this.transactionStatusNumber, Validators.required],
    });

    return form;
  }

  save() {
    if (!this.form.valid) {
      this._dialogService.showSnackBar("Incorrect change!");
      return;
    }

    //Checking if user set the same status
    if (this.transactionStatusNumber == this.form.value.status) {
      this._dialogService.showSnackBar("You set the same status!");
      this.dialogRef.close();
      return;
    }

    //Switching transactionType to number for Request
    let transactionType: number = 0;
    switch (this.transaction.type) {
      case 'Refill':
        transactionType = 0;
        break;
      case 'Withdrawal':
        transactionType = 1;
        break;
    }

    let request = new AddTransactionRequest({
      status: this.form.value.status,
      type: transactionType,
      clientName: this.transaction.clientName,
      amount: this.transaction.amount,
    });

    this._transactionService.onEditTransaction.next({ id: this.transaction.id, model: request });
    this.dialogRef.close();
  }

  close(): void {
    this.dialogRef.close();
  }
}

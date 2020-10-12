import { Component, OnInit, OnDestroy } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { GetTransactionRequest } from '../../../../models/transaction/get-transaction-request.model';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { DialogService } from '../../../../services/dialog.service';
import { TransactionFileRequest } from '../../../../models/transaction/transaction-file-request.model';

@Component({
  selector: 'app-transaction-menu',
  templateUrl: './transaction-menu.component.html',
  styleUrls: ['./transaction-menu.component.scss']
})
export class TransactionMenuComponent implements OnInit, OnDestroy {
  selectedStatus: number = null;
  selectedType: number = null;

  request: GetTransactionRequest;

  private _selectedFile: File;
  private _unsubscribe: Subject<any>;

  constructor(
    private _dialogService: DialogService,
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

    this._transactionService.onTransactionsExcelFileChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        if (request == null) {
          return;
        }

        const blob = new Blob([request], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = window.URL.createObjectURL(blob);

        //Creating link for correct file name
        const a: HTMLAnchorElement = document.createElement('a') as HTMLAnchorElement;
        a.href = url;
        a.download = "Transactions.xlsx";

        //Appeding and removing link
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        URL.revokeObjectURL(url);
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

  onFileSelect(event) {
    this._selectedFile = event.target.files[0];

    //Checking if file has correct type
    if (this._selectedFile.type != "application/vnd.ms-excel") {
      this._dialogService.showAlertDialog("File must have type .csv");
      return;
    }

    //Creating file and sending request
    let file = new FormData();
    file.append('file', this._selectedFile);

    let request = new TransactionFileRequest<FormData>({ file: file });
    this._transactionService.onAddTransactions.next(request);
  }

  async getTransactionsExcel() {
    this._transactionService.onGetTransactionsExcel.next({ status: this.request.status, type: this.request.type });
  }
}

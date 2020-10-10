import { Component, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { TransactionModel } from '../../../../models/transaction/transaction.model';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Subject } from 'rxjs';
import { takeUntil } from "rxjs/operators";
import { TransactionService } from '../../services/transaction.service';
import { DialogService } from '../../../../services/dialog.service';
import { GetTransactionRequest } from '../../../../models/transaction/get-transaction-request.model';
import { ChangeTransactionStatusComponent } from './change-transaction-status/change-transaction-status.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent implements OnInit, OnDestroy {

  dataSource: MatTableDataSource<TransactionModel>;
  columnsToDisplay = [
    'id',
    'status',
    'type',
    'clientName',
    'amount',
    'actions',
  ];
  totalCount: number = 0;
  request: GetTransactionRequest;
  isLoading: boolean = false;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  private _unsubscribe: Subject<any>;

  constructor(
    private _transactionService: TransactionService,
    private _dialogService: DialogService,
    public dialog: MatDialog,
  ) {
    this._unsubscribe = new Subject<any>();
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource<TransactionModel>([]);

    this._transactionService.onGetTransactionsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(request => {
        this.request = request;
      });

    this._transactionService.onTransactionssLoadingChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(isLoading => {
        this.isLoading = isLoading;
      });

    this._transactionService.onTransactionsChanged
      .pipe(takeUntil(this._unsubscribe))
      .subscribe(list => {
        this.dataSource.data = list.items;
        this.totalCount = list.totalCount;
      });

    //Subscribe for sorting table
    this.sort.sortChange.subscribe((s: Sort) => {
      this.request.sortDir = s.direction;
      this.request.sort = s.active;
      this._transactionService.onGetTransactions.next(this.request);
    });

    //Subscrive for table paginator
    this.paginator.page.subscribe((p: PageEvent) => {
      this.request.pn = p.pageIndex;
      this.request.ps = p.pageSize;
      this._transactionService.onGetTransactions.next(this.request);
    });

    this._transactionService.onGetTransactions.next(null);
  }

  ngOnDestroy(): void {
    this._unsubscribe.next(null);
    this._unsubscribe.complete();
  }

  editTransaction(transaction: TransactionModel): void {
    let dialogRef = this.dialog.open(ChangeTransactionStatusComponent, {
      panelClass: 'dialog-container-zero-padding',
      width: '300px',
      data: {
        transaction: transaction,
      }
    });
  }

  deleteTransaction(id: number): void {
    this._dialogService.showConfirmationDialog("Are you sure you want to delete transaction?",
      result => {
        if (result)
          this._transactionService.onDeleteTransaction.next(id);
      }
    );
  }
}

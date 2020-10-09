import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MainPageComponent } from './main-page/main-page.component';
import { TransactionListComponent } from './main-page/transaction-list/transaction-list.component';
import { TransactionSearchComponent } from './main-page/transaction-search/transaction-search.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  declarations: [
    MainPageComponent,
    TransactionSearchComponent,
    TransactionListComponent,
  ],
  entryComponents: [
    MainPageComponent,
    TransactionSearchComponent,
    TransactionListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class ContentModule {}

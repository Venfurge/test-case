import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DialogModule } from './shared/dialog.module';
import { DialogService } from './services/dialog.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { APITransactionService } from './services/api/api-transaction.service';

const routes: Routes = [
  {
    path: '',
    loadChildren: './main/main.module#MainModule'
  }
];

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    BrowserAnimationsModule,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot(routes),

    MatSnackBarModule,
    DialogModule,
  ],
  providers: [
    DialogService,

    APITransactionService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

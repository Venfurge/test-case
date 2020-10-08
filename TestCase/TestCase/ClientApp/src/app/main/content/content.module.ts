import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { CommonModule } from '@angular/common';

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
  ],
  entryComponents: [
    MainPageComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
  ],
  providers: [],
})
export class ContentModule {}

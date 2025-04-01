import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { SplitEaseComponent } from './split-ease/split-ease.component';

const routes: Routes = [
  { path: 'split-ease', component: SplitEaseComponent },
  { path: '', redirectTo: 'split-ease', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    SplitEaseComponent
  ],
  exports: [RouterModule]
})
export class FinanceToolsModule { } 
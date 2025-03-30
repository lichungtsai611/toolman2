import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { FormatterComponent } from './formatter/formatter.component';
import { CounterComponent } from './counter/counter.component';
import { CaseConverterComponent } from './case-converter/case-converter.component';

const routes: Routes = [
  { path: 'formatter', component: FormatterComponent },
  { path: 'counter', component: CounterComponent },
  { path: 'case-converter', component: CaseConverterComponent },
  { path: '', redirectTo: 'formatter', pathMatch: 'full' }
];

@NgModule({
  declarations: [
    FormatterComponent,
    CounterComponent,
    CaseConverterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TextToolsModule { }

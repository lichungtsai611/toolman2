import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UnitConverterComponent } from './unit-converter/unit-converter.component';
import { BaseConverterComponent } from './base-converter/base-converter.component';
import { TimeConverterComponent } from './time-converter/time-converter.component';

const routes: Routes = [
  { path: 'unit', component: UnitConverterComponent },
  { path: 'base', component: BaseConverterComponent },
  { path: 'time', component: TimeConverterComponent },
  { path: '', redirectTo: 'unit', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    UnitConverterComponent,
    BaseConverterComponent,
    TimeConverterComponent
  ],
  exports: [RouterModule]
})
export class ConvertToolsModule { }

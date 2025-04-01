import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CompressorComponent } from './compressor/compressor.component';
import { ConverterComponent } from './converter/converter.component';
import { CropperComponent } from './cropper/cropper.component';

const routes: Routes = [
  { path: 'compressor', component: CompressorComponent },
  { path: 'converter', component: ConverterComponent },
  { path: 'cropper', component: CropperComponent },
  { path: '', redirectTo: 'compressor', pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    CompressorComponent,
    ConverterComponent,
    CropperComponent
  ],
  exports: [RouterModule]
})
export class ImageToolsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule, 
  MatCheckboxModule, 
  MatInputModule,
  MatIconModule } from '@angular/material';

const matModules = [
  MatButtonModule,
  MatCheckboxModule,
  MatInputModule,
  MatIconModule
]

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ...matModules
  ],
  exports: [
    ...matModules
  ]
})
export class MaterialDepsModule { }

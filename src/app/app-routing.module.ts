import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmpComponent } from './emp/emp.component';

const routes: Routes = [
  {path: "", component:EmpComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

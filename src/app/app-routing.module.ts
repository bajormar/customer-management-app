import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { DetailsPageComponent } from './details-page/details-page.component';

const routes: Routes = [{
  path: '', component: MainPageComponent
}, {
  path: 'customer/:customerId', component: DetailsPageComponent
}, {
  path: '**', redirectTo: ''
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

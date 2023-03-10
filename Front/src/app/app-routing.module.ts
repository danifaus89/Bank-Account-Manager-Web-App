import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { ComptesComponent } from './components/comptes/comptes.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { AltresComponent } from './components/altres/altres.component';
import { IniciComponent } from './components/inici/inici.component';

const routes: Routes = [

  { path: 'home', component: HomeComponent },
  { path: 'inici', component: IniciComponent },
  { path: 'comptes', component: ComptesComponent },
  { path: 'vehicles', component: VehiclesComponent },
  { path: 'altres', component: AltresComponent },

  { path: '', pathMatch: 'full', redirectTo: 'inici' },
  { path: '**', pathMatch: 'full', redirectTo: 'inici' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

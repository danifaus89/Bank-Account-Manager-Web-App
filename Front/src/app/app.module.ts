import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { DatePipe } from '@angular/common';

// MODULS
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/modules/shared.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { ScrollPanelModule } from 'primeng/scrollpanel';

// COMPONENTS
import { AppComponent } from './app.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { TabmenuComponent } from './shared/components/tabmenu/tabmenu.component';
import { HomeComponent } from './components/home/home.component';
import { ComptesComponent } from './components/comptes/comptes.component';
import { PagenotfoundComponent } from './shared/components/pagenotfound/pagenotfound.component';
import { VehiclesComponent } from './components/vehicles/vehicles.component';
import { AltresComponent } from './components/altres/altres.component';
import { IniciComponent } from './components/inici/inici.component';

// SERVICES

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    TabmenuComponent,
    HomeComponent,
    ComptesComponent,
    PagenotfoundComponent,
    VehiclesComponent,
    AltresComponent,
    IniciComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    SharedModule,
    ReactiveFormsModule,
    ScrollPanelModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}

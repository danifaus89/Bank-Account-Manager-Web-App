import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-tabmenu',
  templateUrl: './tabmenu.component.html',
  styleUrls: ['./tabmenu.component.css']
})
export class TabmenuComponent implements OnInit {

  items: MenuItem[];

  activeItem: MenuItem;

  constructor() { }

  ngOnInit(): void {


    this.items = [
      {label: 'Home', icon: 'pi pi-fw pi-home', routerLink: ['/navbar']},
      {label: 'Calendar', icon: 'pi pi-fw pi-calendar',routerLink: ['/footer']},
      {label: 'Edit', icon: 'pi pi-fw pi-pencil'},
      {label: 'Documentation', icon: 'pi pi-fw pi-file'},
      {label: 'Settings', icon: 'pi pi-fw pi-cog'}
  ];

    this.activeItem = this.items[0];

  }


}

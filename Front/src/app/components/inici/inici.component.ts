import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-inici',
  templateUrl: './inici.component.html',
  styleUrls: ['./inici.component.css'],
})
export class IniciComponent implements OnInit {
  constructor(private route: Router) {}

  ngOnInit(): void {}

  public goToComptes(): void {
    this.route.navigate(['/comptes']);
  }

  public goToVehicles(): void {
    this.route.navigate(['/vehicles']);
  }
}

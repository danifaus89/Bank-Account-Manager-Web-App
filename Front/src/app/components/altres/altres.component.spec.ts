import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltresComponent } from './altres.component';

describe('AltresComponent', () => {
  let component: AltresComponent;
  let fixture: ComponentFixture<AltresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AltresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AltresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

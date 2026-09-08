import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlShorted } from './url-shorted';

describe('UrlShorted', () => {
  let component: UrlShorted;
  let fixture: ComponentFixture<UrlShorted>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlShorted]
    })
      .compileComponents();

    fixture = TestBed.createComponent(UrlShorted);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

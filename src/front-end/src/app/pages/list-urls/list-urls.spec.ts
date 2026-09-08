import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListUrls } from './list-urls';

describe('ListUrls', () => {
  let component: ListUrls;
  let fixture: ComponentFixture<ListUrls>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListUrls],
    }).compileComponents();

    fixture = TestBed.createComponent(ListUrls);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

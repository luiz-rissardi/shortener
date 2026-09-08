import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlDeleteModal } from './url-delete-modal';

describe('UrlDeleteModal', () => {
  let component: UrlDeleteModal;
  let fixture: ComponentFixture<UrlDeleteModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UrlDeleteModal],
    }).compileComponents();

    fixture = TestBed.createComponent(UrlDeleteModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';
import { Teste } from './teste';

describe('Teste', () => {
  let service: Teste;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Teste);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

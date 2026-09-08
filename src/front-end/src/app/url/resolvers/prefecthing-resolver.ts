import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { UrlFacade } from '../facade/url-facade';


export const prefetchingResolver: ResolveFn<boolean> = (route, state) => {
  const facade = inject(UrlFacade);
  facade.getAllUrls();
  return true;
};

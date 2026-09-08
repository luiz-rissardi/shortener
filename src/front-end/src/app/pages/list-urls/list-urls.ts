import { Component, inject } from '@angular/core';
import { UrlShorted } from '../../url/components/url-shorted/url-shorted';
import { UrlsListState } from '../../url/state/urls-list';
import { LongTextPipe } from '../../url/utils/long-text-pipe-pipe';
import { DatePipe } from '@angular/common';

@Component({
  imports: [UrlShorted, LongTextPipe,DatePipe],
  selector: 'app-list-urls',
  styleUrl: './list-urls.scss',
  templateUrl: './list-urls.html',
})
export class ListUrls {

  protected state = inject(UrlsListState);

}

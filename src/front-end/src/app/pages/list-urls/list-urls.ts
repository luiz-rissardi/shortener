import { Component, inject, signal } from '@angular/core';
import { UrlShorted } from '../../url/components/url-shorted/url-shorted';
import { UrlModel, UrlsListState } from '../../url/state/urls-list';
import { LongTextPipe } from '../../url/utils/long-text-pipe-pipe';
import { DatePipe } from '@angular/common';
import { UrlDeleteModal } from "../../url/components/url-delete-modal/url-delete-modal";

@Component({
  imports: [UrlShorted, LongTextPipe, DatePipe, UrlDeleteModal],
  selector: 'app-list-urls',
  styleUrl: './list-urls.scss',
  templateUrl: './list-urls.html',
})
export class ListUrls {

  protected state = inject(UrlsListState);
  protected statusModal = signal("hidden");
  protected chosenUrlModel = signal<UrlModel>({
    accessCount:0,
    createdAt:"",
    shortCode:"",
    targetUrl:""
  })

  protected openModal(urlModel:UrlModel){
    this.chosenUrlModel.set(urlModel);
    this.statusModal.set("show")
  }

  protected addView(urlModel:UrlModel){
    urlModel.accessCount += 1;
  }

  protected async copy(shortCode:string) {
    navigator.clipboard.writeText(`http://localhost:3000/${shortCode}`)
  }

}

import { Component, effect, ElementRef, inject, input, model, untracked, ViewChild } from '@angular/core';
import { LongTextPipe } from '../../utils/long-text-pipe-pipe';
import { UrlModel, UrlsListState } from '../../state/urls-list';
import { UrlFacade } from '../../facade/url-facade';

@Component({
  imports: [LongTextPipe],
  selector: 'app-url-delete-modal',
  styleUrl: './url-delete-modal.scss',
  templateUrl: './url-delete-modal.html',
})
export class UrlDeleteModal {

  private facade = inject(UrlFacade);
  private urlsListState = inject(UrlsListState);
  @ViewChild('modal') protected modal!: ElementRef<HTMLDialogElement>;

  status = model("hidden");
  urlModel = model.required<UrlModel>();

  constructor() {
    effect(() => {
      if (this.status() == "hidden") {
        this.close();
      } else {
        this.open()
      }
    })
  }

  open() {
    this.modal.nativeElement.showModal();
    document.body.style.overflow = 'hidden'; // fallback
  }

  close() {
    untracked(() => this.status.set("hidden"))
    this.modal.nativeElement.close();
    document.body.style.overflow = ''; // fallback
  }

  protected deleteUrl() {
    this.close();
    this.urlsListState.removeOne(this.urlModel().shortCode)
    this.facade.deleteUrlModel(this.urlModel().shortCode)
  }
}

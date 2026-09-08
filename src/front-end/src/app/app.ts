import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterLinkWithHref } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLinkWithHref],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front-end');

  protected readonly activeTab = signal<'encurtar' | 'meus-links'>('encurtar');

  protected setTab(tab: 'encurtar' | 'meus-links'): void {
    this.activeTab.set(tab);
  }
}

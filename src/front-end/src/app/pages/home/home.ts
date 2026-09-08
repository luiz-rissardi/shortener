import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { UrlState } from '../../url/state/url-state';
import { UrlShorted } from "../../url/components/url-shorted/url-shorted";
import { LongTextPipe } from '../../url/utils/long-text-pipe-pipe';



@Component({
  imports: [UrlShorted,LongTextPipe],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home implements OnInit{

  
  protected state = inject(UrlState);

  ngOnInit(): void {
    this.state.reset()
  }

  protected async copy() {
    navigator.clipboard.writeText(`http://localhost:3000/${this.state.shortCode()}`)
  }
  
  protected openTargetUrl() {
    const fullUrl = `http://localhost:3000/${this.state.shortCode()}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer')
  }

}

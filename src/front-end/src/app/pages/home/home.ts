import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { form, FormField, FormRoot, required, validate } from '@angular/forms/signals';
import { UrlFacade } from '../../url/facade/url-facade';
import { UrlState } from '../../url/state/url-state';


interface UrlFormModel {
  targetUrl: string
}

@Component({
  imports: [FormField, FormRoot],
  selector: 'app-home',
  styleUrl: './home.scss',
  templateUrl: './home.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Home {

  private regexUrlValid = /^https?:\/\/(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}(?::\d{1,5})?(?:\/[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/]*)?(?:\?[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?(?:#[a-zA-Z0-9\-._~%!$&'()*+,;=:@\/?]*)?$/;
  private urlFacade = inject(UrlFacade);
  private urlTarget = signal<UrlFormModel>({
    targetUrl: ""
  })

  protected state = inject(UrlState);

  protected urlForm = form(this.urlTarget, (fields) => {
    required(fields.targetUrl, { message: "o campo url é obrigatório" })

    validate(fields.targetUrl, (context) => {
      const targetUrl = context.value();
      if (this.regexUrlValid.test(targetUrl) == false) {
        return {
          kind: "targetUrl",
          message: "o formato da url é invalido"
        }
      }
      return null // valid Url
    })
  }, {
    submission: {
      action: async (fields) => {
        this.state.reset();
        const targetUrl = fields.targetUrl().value();
        this.urlFacade.createShortCode(targetUrl)
      }
    }
  })


}

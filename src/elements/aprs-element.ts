import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { emitEvent } from '../lib';

@customElement('affirm-calculator-aprs')
export class AffirmCalculatorApr extends LitElement {
  static styles = css`
    #affirm-calculator-aprs {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 0px 5px;
    }  

    #affirm-calculator-apr {
      padding: 10px;
      border: 1px solid;
      border-radius: 5px;
      background-color: #f4f4f4;
      display: inline-block;
      text-align: center;
      opacity: 0.5
    }

    .active {
      font-weight: 600 !important;
      opacity: 1 !important;
    }
  `;

  @property({ type: Array })
    aprs = [0.10, 0.20, 0.30];

  @property({ type: Number })
    selectedApr = 0.10;

  @property({ type: String })
    color = '#f4f4f4';

  onChange(event: Event) {
    const target = event.target as any;
    const selectedApr = target['data-value'];
    this.selectedApr = selectedApr;
    emitEvent.call(this, 'affirm-apr-changed', { newApr: selectedApr });
  }

  getClasses(apr: number) {
    return apr === this.selectedApr ? 'active' : '';
  }

  render() {
    return html`
      <div>
        <div>
          <p>Interest Rate (APR)</p>
        </div>
        <div id="affirm-calculator-aprs">
          ${repeat(this.aprs, (apr) => apr, (apr) => html`
              <div id="affirm-calculator-apr" class="${this.getClasses(apr)}" .data-value=${apr} @click=${this.onChange}>${apr * 100}%</div>
          `)}
        </div>
      </div>
    `;
  }
}

import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';

@customElement('affirm-calculator-aprs')
export class AffirmCalculatorApr extends LitElement {
  static styles = css`
    #affirm-calculator-aprs {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 0px 5px;
    }

    .affirm-calculator-apr {
      padding: 10px;
      border: 1px solid;
      border-radius: 5px;
      background-color: #f4f4f4;
      display: inline-block;
      text-align: center;
      opacity: 0.5;
      cursor: pointer;
    }

    .active {
      font-weight: 600 !important;
      opacity: 1 !important;
    }
  `;

  @property({ type: Array })
    aprs: number[] = [];

  @property({ type: Number })
    selectedApr = 0;

  @property({ type: String })
    color = '#f4f4f4';

  private onAprClick(event: Event) {
    const target = event.currentTarget as HTMLElement;
    const aprValue = target.dataset.apr;
    if (!aprValue) return;

    const selectedApr = parseFloat(aprValue);
    this.selectedApr = selectedApr;
    this.dispatchEvent(new CustomEvent('affirm-apr-changed', {
      detail: { newApr: selectedApr },
      bubbles: true,
      composed: true,
    }));
  }

  private getClasses(apr: number): string {
    return apr === this.selectedApr ? 'affirm-calculator-apr active' : 'affirm-calculator-apr';
  }

  render() {
    return html`
      <div>
        <div>
          <p>Interest Rate (APR)</p>
        </div>
        <div id="affirm-calculator-aprs">
          ${repeat(this.aprs, (apr) => apr, (apr) => html`
              <div class="${this.getClasses(apr)}" data-apr="${apr}" @click=${this.onAprClick}>${apr * 100}%</div>
          `)}
        </div>
      </div>
    `;
  }
}

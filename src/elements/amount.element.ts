import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('affirm-calculator-amount')
export class AffirmCalculatorAmountInput extends LitElement {
  static styles = css`
    #affirm-calculator-amount {
      display: flex;
      align-items: center;
      justify-content: stretch;
      width: 100%;
    }

    #affirm-calculator-amount input {
      padding: 15px;
      font-size: 18px;
      width: 100%;
    }
  `;

  @property({ type: Number })
    amount = 0;

  private onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.dispatchEvent(new CustomEvent('affirm-amount-changed', {
      detail: { newAmount: parseFloat(target.value) },
      bubbles: true,
      composed: true,
    }));
  }

  render() {
    return html`
      <div id="affirm-calculator-amount">
        <input type="text" .value=${this.amount} @change=${this.onChange}/>
      </div>
    `;
  }
}

import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { emitEvent } from '../lib';

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
    amount = 1000;

  onChange(event: Event) {
    const target = event.target as HTMLInputElement;
    emitEvent.call(this, 'affirm-amount-changed', { newAmount: parseFloat(target.value) });
  }

  render() {
    return html`
      <div id="affirm-calculator-amount">
        <input type="text" .value=${this.amount} @change=${this.onChange}/>
      </div>
    `;
  }
}

import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
import { Estimate } from '../domain/types';
import { formatCents } from '../lib';

@customElement('affirm-calculator-estimates')
export class AffirmCalculatorEstimates extends LitElement {
  static styles = css`
    #affirm-calculator-estimates {
      display: grid;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-columns: 1fr;
      width: 100%;
    }

    .affirm-calculator-estimate {
      padding: 10px 20px;
      margin-bottom: 15px;
      border: 1px solid black;
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .bold {
      font-weight: 600;
    }
  `;

  @property({ type: Array })
    estimates: Estimate[] = [];

  private formatPayment(payment: number): string {
    return typeof payment === 'number' ? formatCents(payment) : '--';
  }

  private formatMonths(months: number): string {
    return typeof months === 'number' ? String(months) : '--';
  }

  render() {
    return html`
      <div id="affirm-calculator-estimates">
        ${repeat(this.estimates, (estimate) => estimate.disclosure, (estimate) => html`
            <div class="affirm-calculator-estimate">
                <p><span class="bold">$${this.formatPayment(estimate.payment)}/mo</span> for <span class="bold">${this.formatMonths(estimate.months)} months</span></p>
            </div>
        `)}
      </div>
    `;
  }
}

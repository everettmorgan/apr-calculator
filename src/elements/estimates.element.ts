import _ from 'lodash';
import { LitElement, html, css } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { customElement, property } from 'lit/decorators.js';
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
      padding: 10px; 20px;
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
    estimates = [{
      apr: 0.10,
      apr_string: '10.12',
      disclosure: 'Based on the purchase price of $1500.00 at 10% APR for 12 months',
      months: 12,
      payment: 13198,
      payment_string: '132',
    }];

  parsePayment(estimate: any) {
    return _.isNumber(estimate) ? formatCents(estimate) : '--';
  }

  parseMonth(month: any) {
    return _.isNumber(month) ? month : '--';
  }

  render() {
    return html`
      <div id="affirm-calculator-estimates">
        ${repeat(this.estimates, (estimate) => estimate.disclosure, (estimate) => html`
            <div class="affirm-calculator-estimate">
                <p><span class="bold">$${this.parsePayment(estimate.payment)}/mo</span> for <span class="bold">${this.parseMonth(estimate.months)} months</span></p>
            </div>
        `)}
      </div>
    `;
  }
}

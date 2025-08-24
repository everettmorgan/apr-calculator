import './amount-element';
import './aprs-element';
import './estimates';

import _ from 'lodash';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

@customElement('affirm-calculator')
export class AffirmCalculatorRoot extends LitElement {
  static styles = css`
    #affirm-calculator {
      font-family: Roboto, sans-serif;
      max-width: 750px;
      margin: 0 auto;
    }

    #affirm-calculator-header {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      text-align: center;
    }

    #affirm-calculator-body {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr;
      gap: 0px 25px;
    }

    #affirm-calculator-settings {
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
      justify-self: stretch;
      width: 100%;
    }

    #affirm-calculator-terms {
      display: grid;
      align-items: center;
      justify-self: stretch;
      width: 100%;
    }
  `;

  @property({ type: String })
    title = "Here's what you'll pay";

  @property({ type: String })
    subtitle = 'We offer payments at a rate between 10-30% APR based on your credit. With no fees or compounding interest, what you see is what you pay--never a penny more.';

  @property({ type: String })
    color = '#f4f4f4';

  @property({ type: Array })
    plans = [{ apr: 0.10, months: 12 }];

  @property({ type: Array })
    estimates = [{
      apr: 0.10,
      apr_string: '10.12',
      disclosure: 'Based on the purchase price of $1500.00 at 10% APR for 12 months',
      months: 12,
      payment: 13198,
      payment_string: '132',
    }];

  @property({ type: Number })
    purchaseAmount = 1000;

  @property({ type: Number })
    selectedApr = 0.10;

  getUniqueAprs() {
    return _.uniq(this.plans.map((plan) => plan.apr));
  }

  render() {
    return html`
      <div id="affirm-calculator">
          <div id="affirm-calculator-header">
            <div><h1>${this.title}</h1></div>
            <div><h4>${this.subtitle}</h4></div>
          </div>
          <div id="affirm-calculator-body">
            <div id="affirm-calculator-settings">
              <div><affirm-calculator-amount .amount=${this.purchaseAmount}></affirm-calculator-amount></div>
              <div><affirm-calculator-aprs .color=${this.color} .aprs=${this.getUniqueAprs()}></affirm-calculator-aprs></div>
            </div>
            <div id="affirm-calculator-terms">
              <affirm-calculator-estimates .estimates=${this.estimates}></affirm-calculator-estimates>
            </div>
          </div>
      </div>
    `;
  }
}

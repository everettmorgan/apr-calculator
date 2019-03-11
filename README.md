|Status|In Progress|
|------|-----------|

# Affirm APR Calculator using "As low as" API Endpoint

## Prerequisites
- Contact your account manager to setup special promo_ids. Each promo MUST have "_aprXX_" somewhere in the string.

## Setup (in progress)
1) Add the apr_calculator script from the assests folder to your site.
2) Expects "#affirm-apr-calculator-input" id assigned to a text input element
```
<input id="affirm-apr-calculator-input" type="text"...>
```
3) Expects APR selectors to have two things: 1) name set to "interest" 2) value set to "apr%%"
```
e.g. <input name="interest" value="apr10" ...>
```
4) Expects two arguments: 1) Public API key 2) Promos Object
```
const promoOptions = {
  apr10: ["promo_set_alaonly_12r_apr10_product", "promo_set_alaonly_24r_apr10_product", "promo_set_alaonly_48r_apr10_product"], 
  apr20: ["promo_set_alaonly_12r_apr20_product", "promo_set_alaonly_24r_apr20_product", "promo_set_alaonly_48r_apr20_product"], 
  apr30: ["promo_set_alaonly_12r_apr30_product", "promo_set_alaonly_24r_apr30_product", "promo_set_alaonly_48r_apr30_product"]  
}

let example = AffirmAprCalculator("ABCDEFGHIJKLMNOPQRSTUVWXYZ", promoOptions)

function foo() {
  // do something with the AffirmAprCalculator object
  // example.data
}
```

## Example Object
```
{
  apikey: String,
  data: Object {
    amount: String,
    elements: Array,
    promosIds: Object,
    receivedData: Array,
    urls: Array
  }
}
```

### Example Object Key-Values

#### apikey: String
```
"ABCDEFGHIJKLMNOPQRSTUVWXYZ"
```

#### amount: String
```
"149999"
```

#### elements: Array
```
[
  0: div.term, 
  1: div.term, 
  2: div.term, 
  3: ...div.term
]
```

#### promosIds: Object
```
{
  apr10: ["promo_apr10_1", ...],
  apr20: ["promo_apr20_1", ...],
  apr30: ["promo_apr30_1", ...]
}
```

#### receivedData: Array
```
[
  0: {
      gid: "apr10",
      apr: "10",
      term: "12",
      perMonth: "132.01",
      total: "1584.00"
    },
  1: ...
]
```

#### urls: Array
```
[
  0: "https://affirm.com/api/v2/promos/v2/ABCDEFG?promo_external_id=promo_set_alaonly_12r_apr10_product&amount=149999",
  1: ...
]
```

#### TODOS (in progress)
- add automatic data binding to term elements upon element creation
- enable user to pass custom regexp for input format
- enable user to pass custom HTML term element
- create simple html markup to display example setup

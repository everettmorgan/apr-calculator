# Affirm APR Calculator using "As low as" API Endpoint

## Setup (in progress)
- Add the apr_calculator script from the assests folder to your site.
- Expects two arguments: 1) Public API key 2) Promos Object
```
const promoOptions = {
  apr10: ["promo_set_alaonly_12r_apr10_product", "promo_set_alaonly_24r_apr10_product", "promo_set_alaonly_48r_apr10_product"], 
  apr20: ["promo_set_alaonly_12r_apr20_product", "promo_set_alaonly_24r_apr20_product", "promo_set_alaonly_48r_apr20_product"], 
  apr30: ["promo_set_alaonly_12r_apr30_product", "promo_set_alaonly_24r_apr30_product", "promo_set_alaonly_48r_apr30_product"]  
}

let example = AffirmAprCalculator("ABCDEFGHIJKLMNOPQRSTUVWXYZ", promoOptions)
```

## Object
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

### Object Key-Value Example

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
[div.term, div.term, div.term, ...div.term]
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

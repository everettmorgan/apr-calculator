# Affirm APR Calculator using "As low as" API Endpoint

## Goals & TODOs
- COMING SOON

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

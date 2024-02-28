# How to use
To use the Mock server, first you have to ask yourself two things."_What type of network participant(NP) I am going to send to?"_ and "_what would be the action/on_action I am going to use_". With these you can easily construct the URL you need to mock and then find that among this list.

**_NOTE:_** Currently mocker server supports only B2B and Services.

## Servers
There are two type of NPs one is BPP(Seller app) and BAP(Buyer app). 

* All the **actions** calls are hosted on the BPP server. So if you want to make mock requests to BPP, then select _/b2b/bpp_ from the servers dropdown.

* All the **on_actions** calls are hosted on the BAP server. So if you want make mock requests to BAP or the buyer app, then select _/b2b/bap_ from the servers dropdown.

## Make a request
Since you have selected the desired server, now you can make the requests to that server. There are two environments you can make requests to:
  * Sandbox
  * Mock

You can select environment from `mode` which will be passed as a query param in request.

### Sandbox
To to use the sandbox you need to have a signing key(authorization key) which is to be passed in the header to make requests. For creating the signing key you can refer this [document](https://docs.google.com/document/d/1brvcltG_DagZ3kGr1ZZQk4hG4tze3zvcxmGV4NMTzr8/edit?pli=1#heading=h.hdylqyv4bn12)

### Mock
You can use Mock environment to mock the requests. It doesn't require any authorization. So you can use this if NP is not registered or on-boarded on ONDC.

### Query params
* mode: Environment to be used for the making the calls
* scenario: Select the scenario for which you want to make call

### Request body
Pass the schema as the payload for the request. Each request must be having two properties `context` and `message`. You can refer these [examples](https://github.com/ONDC-Official/ONDC-RET-Specifications/tree/master/api/components/Examples/B2B_json ) as request body for each request. You can select the schema from the `examples` dropdown.

__Note__: All the requests must pass the schema validation which is present in the ONDC reference implementations repo. You can refer this [log utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/logistics-b2b/log-verification-utility/schema/B2B_json_schema/v2) for the schema validations.

### Response body
1. If the payload is in-valid then the response would be something like this
```json
{
  "message": {
    "ack": {
      "status": "NACK"
    }
  },
  "error": {
    "type": "JSON-SCHEMA-ERROR",
    "code": "50009",
    "message": [
      {
        "message": "must have required property 'domain'"
      }
    ]
  }
}
```
As it is clearly mentioned that `domain` property is missing in the payload which is required field.


2. If the payload is valid and passed the schema validation then response body will look like this
```json
{
  "sync": {
    "message": {
      "ack": {
        "status": "ACK"
      }
    }
  },
  "async": {
    "context": {
      "domain": "ONDC:RET10",
      "location": {
        "city": {
          "code": "std:080"
        },
        "country": {
          "code": "IND"
        }
      },
      "action": "on_select",
      "version": "2.0.2",
      "transaction_id": "4a6d97c4-3b98-4d86-813c-951599e3048d",
      "message_id": "ad6c9c07-adf9-4532-9c58-2057e32c8368",
      "timestamp": "2024-01-19T13:17:55.842Z",
      "bpp_id": "b2b.ondc-mockserver.com",
      "bpp_uri": "b2b.ondc-mockserver.com/uri",
      "ttl": "PT30S",
      "timeStamp": "2024-01-19T13:17:56.842Z"
    },
    "message": {
      "order": {
        "provider": {
          "id": "9829644477",
          "locations": [
            {
              "id": "L1"
            }
          ]
        },
        "payments": [
          {
            "type": "ON-FULFILLMENT",
            "collected_by": "BPP"
          }
        ],
        "items": [
          {
            "remaining": {
              "id": "BESAN-500G",
              "fulfillment_ids": [
                "1"
              ],
              "quantity": {
                "selected": {
                  "count": 2
                }
              }
            }
          }
        ],
        "fulfillments": [
          {
            "id": "1",
            "type": "Delivery",
            "stops": [
              {
                "type": "end",
                "location": {
                  "address": "uti, itu, Tui, uiuitt, Bangalore Rural, 560001",
                  "gps": "12.976594,77.599271",
                  "area_code": "560001",
                  "state": {
                    "name": "Karnataka"
                  },
                  "city": {
                    "name": "Bangalore Rural"
                  },
                  "country": {
                    "code": "IND"
                  }
                },
                "contact": {
                  "phone": "9947328084"
                }
              }
            ]
          }
        ],
        "quote": {
          "breakup": [
            {
              "@ondc/org/item_id": "I1",
              "title": "Tax",
              "@ondc/org/title_type": "tax",
              "price": {
                "currency": "INR",
                "value": "0"
              }
            },
            {
              "@ondc/org/item_id": "I1",
              "title": "Discount",
              "@ondc/org/title_type": "discount",
              "price": {
                "currency": "INR",
                "value": "-1000"
              }
            },
            {
              "@ondc/org/item_id": "BESAN-500G",
              "@ondc/org/item_quantity": {
                "count": 2
              },
              "title": "Product Name Here",
              "@ondc/org/title_type": "item",
              "price": {
                "currency": "INR",
                "value": "500"
              },
              "item": {
                "price": {
                  "currency": "INR",
                  "value": "250"
                }
              }
            },
            {
              "@ondc/org/item_id": "1",
              "title": "Delivery charges",
              "@ondc/org/title_type": "delivery",
              "price": {
                "currency": "INR",
                "value": "4000"
              }
            },
            {
              "@ondc/org/item_id": "1",
              "title": "Packing charges",
              "@ondc/org/title_type": "packing",
              "price": {
                "currency": "INR",
                "value": "500"
              }
            },
            {
              "@ondc/org/item_id": "1",
              "title": "Convenience Fee",
              "@ondc/org/title_type": "misc",
              "price": {
                "currency": "INR",
                "value": "100"
              }
            }
          ],
          "price": {
            "currency": "INR",
            "value": "53600"
          },
          "ttl": "P1D"
        }
      }
    }
  }
}
```

Response object will be contaning two objects `sync` and `async`.
`sync` will be returning `ACK` (acknowledgement), if the passed schema is valid and `NACK` otherwise. `async` means recipient sends response through the callback for the corresponding request API e.g. /on_search callback for /search request. For more information on this, you can refer this [document](https://docs.google.com/document/d/1brvcltG_DagZ3kGr1ZZQk4hG4tze3zvcxmGV4NMTzr8/edit?pli=1#heading=h.g50qz1ji881f) 

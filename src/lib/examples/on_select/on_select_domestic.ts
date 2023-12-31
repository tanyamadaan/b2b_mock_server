export const onSelectDomestic = {
  context: {
    domain: "ONDC:RET10",
    location: {
      city: {
        code: "std:080"
      },
      country: {
        code: "IND"
      }
    },
    action: "on_select",
    version: "2.0.1",
    bap_id: "buyerapp.com",
    bap_uri: "https://buyerapp.com/grocery",
    bpp_id: "sellerapp.com",
    bpp_uri: "https://sellerapp.com/grocery",
    transaction_id: "T1",
    message_id: "M1",
    timestamp: "2023-01-08T22:00:30.000Z",
    ttl: "PT30S"
  },
  message: {
    order: {
      provider: {
        id: "P1",
        locations: [
          {
            id: "L1"
          }
        ]
      },
      items: [
        {
          fulfillment_ids: [
            "F1"
          ],
          id: "I1",
          quantity: {
            selected: {
              count: 200
            }
          },
          "add-ons": [
            {
              id: "78787723"
            }
          ],
          tags: [
            {
              descriptor: {
                code: "BUYER_TERMS"
              },
              list: [
                {
                  descriptor: {
                    code: "ITEM_REQ"
                  },
                  value: "free text on Item Customization"
                },
                {
                  descriptor: {
                    code: "PACKAGING_REQ"
                  },
                  value: "free text on packaging Customization"
                }
              ]
            }
          ]
        }
      ],
      fulfillments: [
        {
          id: "F1",
          "@ondc/org/provider_name": "Loadshare",
          tracking: false,
          "@ondc/org/category": "Express Delivery",
          "@ondc/org/TAT": "P7D",
          state: {
            descriptor: {
              code: "Serviceable"
            }
          }
        }
      ],
      quote: {
        price: {
          currency: "INR",
          value: "53600"
        },
        breakup: [
          {
            "@ondc/org/item_id": "I1",
            "@ondc/org/item_quantity": {
              count: 200
            },
            title: "Dhara Mustard Oil",
            "@ondc/org/title_type": "item",
            price: {
              currency: "INR",
              value: "50000"
            },
            item: {
              price: {
                currency: "INR",
                value: "250"
              }
            }
          },
          {
            "@ondc/org/item_id": "F1",
            title: "Delivery charges",
            "@ondc/org/title_type": "delivery",
            price: {
              currency: "INR",
              value: "4000"
            }
          },
          {
            "@ondc/org/item_id": "F1",
            title: "Packing charges",
            "@ondc/org/title_type": "packing",
            price: {
              currency: "INR",
              value: "500"
            }
          },
          {
            "@ondc/org/item_id": "I1",
            title: "Tax",
            "@ondc/org/title_type": "tax",
            price: {
              currency: "INR",
              value: "0"
            }
          },
          {
            "@ondc/org/item_id": "I1",
            title: "Discount",
            "@ondc/org/title_type": "discount",
            price: {
              currency: "INR",
              value: "-1000"
            }
          },
          {
            "@ondc/org/item_id": "F1",
            title: "Convenience Fee",
            "@ondc/org/title_type": "misc",
            price: {
              currency: "INR",
              value: "100"
            }
          }
        ],
        ttl: "P1D"
      },
      payments: [
        {
          type: "ON-FULFILLMENT",
          collected_by: "BPP"
        }
      ]
    }
  }
}
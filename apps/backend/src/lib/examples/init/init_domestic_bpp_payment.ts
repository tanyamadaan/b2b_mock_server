export const initDomesticBPPPayment = {
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
    action: "init",
    version: "2.0.2",
    bap_id: "buyerapp.com",
    bap_uri: "https://buyerapp.com/grocery",
    bpp_id: "sellerapp.com",
    bpp_uri: "https://sellerapp.com/grocery",
    transaction_id: "9568beb3-265a-4730-be4e-c00ba2e5e30a",
    message_id: "582eb99f-a7c1-46ae-8174-936757d2d96f",
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
          id: "I1",
          fulfillment_ids: [
            "F1"
          ],
          quantity: {
            selected: {
              count: 200
            }
          },
          add_ons: [
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
      billing: {
        name: "ONDC buyer",
        address: "22, Mahatma Gandhi Rd, Craig Park Layout, Ashok Nagar, Bengaluru, Karnataka 560001",
        state: {
          name: "Karnataka"
        },
        city: {
          name: "Bengaluru"
        },
        tax_id: "XXXXXXXXXXXXXXX",
        email: "nobody@nomail.com",
        phone: "9886098860"
      },
      fulfillments: [
        {
          id: "F1",
          type: "Delivery",
          stops: [
            {
              type: "end",
              location: {
                gps: "12.974002,77.613458",
                address: "My House #, My buildin",
                city: {
                  name: "Bengaluru"
                },
                country: {
                  code: "IND"
                },
                area_code: "560001",
                state: {
                  name: "Karnataka"
                }
              },
              contact: {
                phone: "9886098860"
              }
            }
          ]
        }
      ],
      payments: [
        {
          type: "PRE-FULFILLMENT",
          collected_by: "BPP"
        }
      ],
      tags: [
        {
          descriptor: {
            code: "buyer_id"
          },
          list: [
            {
              descriptor: {
                code: "buyer_id_code"
              },
              value: "gst"
            },
            {
              descriptor: {
                code: "buyer_id_no"
              },
              value: "12345678"
            }
          ]
        }
      ]
    }
  }
}
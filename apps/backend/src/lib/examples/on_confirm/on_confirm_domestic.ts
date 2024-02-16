export const onConfirmDomestic = {
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
    action: "on_confirm",
    version: "2.0.2",
    bap_id: "buyerapp.com",
    bap_uri: "https://buyerapp.com/grocery",
    bpp_id: "sellerapp.com",
    bpp_uri: "https://sellerapp.com/grocery",
    transaction_id: "9568beb3-265a-4730-be4e-c00ba2e5e30a",
    message_id: "ad33f8db-cc87-4470-961a-e5555869fd3c",
    timestamp: "2023-01-08T22:00:30.000Z",
    ttl: "PT30S"
  },
  message: {
    order: {
      id: "O1",
      state: "Accepted",
      provider: {
        id: "P1",
        locations: [
          {
            id: "L1"
          }
        ],
        rateable: true
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
          "@ondc/org/provider_name": "Loadshare",
          state: {
            descriptor: {
              code: "Pending"
            }
          },
          type: "Delivery",
          tracking: false,
          stops: [
            {
              type: "start",
              location: {
                id: "L1",
                descriptor: {
                  name: "ABC Store"
                },
                gps: "12.956399,77.636803"
              },
              time: {
                range: {
                  start: "2023-02-03T10:00:00.000Z",
                  end: "2023-02-03T10:30:00.000Z"
                }
              },
              instructions: {
                name: "Status for pickup",
                short_desc: "Pickup Confirmation Code"
              },
              contact: {
                phone: "9886098860",
                email: "nobody@nomail.com"
              }
            },
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
          ],
          rateable: true
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
          params: {
            currency: "INR",
            amount: "53600"
          },
          status: "NOT-PAID",
          uri: "https://snp.com/pg",
          type: "PRE-FULFILLMENT",
          collected_by: "BPP",
          "@ondc/org/buyer_app_finder_fee_type": "percent",
          "@ondc/org/buyer_app_finder_fee_amount": "0",
          "@ondc/org/settlement_basis": "delivery",
          "@ondc/org/settlement_window": "P1D",
          "@ondc/org/withholding_amount": "10.00",
          "@ondc/org/settlement_details": [
            {
              settlement_counterparty: "seller-app",
              settlement_phase: "sale-amount",
              beneficiary_name: "xxxxx",
              settlement_type: "upi",
              upi_address: "gft@oksbi",
              settlement_bank_account_no: "XXXXXXXXXX",
              settlement_ifsc_code: "XXXXXXXXX",
              bank_name: "xxxx",
              branch_name: "xxxx"
            }
          ],
          tags: [
            {
              descriptor: {
                code: "BPP_payment"
              },
              list: [
                {
                  descriptor: {
                    code: "signature"
                  },
                  value: "xxxxxxxxxxxxxx"
                },
                {
                  descriptor: {
                    code: "dsa"
                  },
                  value: "ED25519"
                },
                {
                  descriptor: {
                    code: "ttl"
                  },
                  value: "PT30M"
                }
              ]
            }
          ]
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
        },
        {
          descriptor: {
            code: "bpp_terms"
          },
          list: [
            {
              descriptor: {
                code: "max_liability"
              },
              value: "2"
            },
            {
              descriptor: {
                code: "max_liability_cap"
              },
              value: "10000"
            },
            {
              descriptor: {
                code: "mandatory_arbitration"
              },
              value: "false"
            },
            {
              descriptor: {
                code: "court_jurisdiction"
              },
              value: "Bengaluru"
            },
            {
              descriptor: {
                code: "delay_interest"
              },
              value: "1000"
            }
          ]
        },
        {
          descriptor: {
            code: "bap_terms"
          },
          list: [
            {
              descriptor: {
                code: "accept_bpp_terms"
              },
              value: "Y"
            }
          ]
        }
      ],
      created_at: "2023-02-03T09:30:00.000Z",
      updated_at: "2023-02-03T09:31:30.000Z"
    }
  }
}
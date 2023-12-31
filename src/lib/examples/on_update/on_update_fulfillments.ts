export const onUpdateFulfillments = {
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
    action: "on_update",
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
      id: "O1",
      state: "Accepted",
      provider: {
        id: "P1"
      },
      items: [
        {
          id: "I1",
          quantity: {
            selected: {
              count: 200
            }
          },
          fulfillment_ids: [
            "F1",
            "F2"
          ]
        }
      ],
      payments: [
        {
          uri: "https://ondc.transaction.com/payment",
          tl_method: "http/get",
          params: {
            currency: "INR",
            transaction_id: "3937",
            amount: "53600"
          },
          status: "PAID",
          type: "PRE-FULFILLMENT",
          collected_by: "BPP",
          "@ondc/org/buyer_app_finder_fee_type": "percent",
          "@ondc/org/buyer_app_finder_fee_amount": "0",
          "@ondc/org/settlement_details": [
            {
              settlement_counterparty: "buyer-app",
              settlement_phase: "sale-amount",
              settlement_type: "upi",
              upi_address: "gft@oksbi",
              settlement_bank_account_no: "XXXXXXXXXX",
              settlement_ifsc_code: "XXXXXXXXX",
              beneficiary_name: "xxxxx",
              bank_name: "xxxx",
              branch_name: "xxxx"
            }
          ]
        }
      ],
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
                gps: "1.3806217468119772, 103.74636438437074",
                address: "My House #, My buildin",
                city: {
                  name: "Jurong East"
                },
                country: {
                  code: "SGP"
                },
                area_code: "680230",
                state: {
                  name: ""
                }
              },
              time: {
                range: {
                  start: "2023-02-07T11:00:00.000Z",
                  end: "2023-02-07T11:30:00.000Z"
                }
              },
              instructions: {
                name: "Status for drop",
                short_desc: "Delivery Confirmation Code"
              },
              contact: {
                phone: "9886098860"
              }
            }
          ],
          rateable: true,
          tags: [
            {
              descriptor: {
                code: "ITEM_DETAILS"
              },
              list: [
                {
                  descriptor: {
                    code: "ITEM_ID"
                  },
                  value: "I1"
                },
                {
                  descriptor: {
                    code: "COUNT"
                  },
                  value: "100"
                },
                {
                  descriptor: {
                    code: "MEASURE_UNIT"
                  },
                  value: "millilitre"
                },
                {
                  descriptor: {
                    code: "MEASURE_VALUE"
                  },
                  value: "500"
                }
              ]
            }
          ]
        },
        {
          id: "F2",
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
                gps: "1.3806217468119772, 103.74636438437074",
                address: "My House #, My buildin",
                city: {
                  name: "Jurong East"
                },
                country: {
                  code: "SGP"
                },
                area_code: "680230",
                state: {
                  name: ""
                }
              },
              time: {
                range: {
                  start: "2023-02-07T11:00:00.000Z",
                  end: "2023-02-07T11:30:00.000Z"
                }
              },
              instructions: {
                name: "Status for drop",
                short_desc: "Delivery Confirmation Code"
              },
              contact: {
                phone: "9886098860"
              }
            }
          ],
          rateable: true,
          tags: [
            {
              descriptor: {
                code: "ITEM_DETAILS"
              },
              list: [
                {
                  descriptor: {
                    code: "ITEM_ID"
                  },
                  value: "I1"
                },
                {
                  descriptor: {
                    code: "COUNT"
                  },
                  value: "100"
                },
                {
                  descriptor: {
                    code: "MEASURE_UNIT"
                  },
                  value: "millilitre"
                },
                {
                  descriptor: {
                    code: "MEASURE_VALUE"
                  },
                  value: "500"
                }
              ]
            }
          ]
        }
      ]
    }
  }
}
export const searchByItem = {
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
    action: "search",
    version: "2.0.1",
    bap_id: "buyerapp.com",
    bap_uri: "https://buyerapp.com/grocery",
    transaction_id: "T1",
    message_id: "M1",
    timestamp: "2023-01-08T22:00:00.000Z",
    ttl: "PT30S"
  },
  message: {
    intent: {
      item: {
        descriptor: {
          name: "oil"
        }
      },
      fulfillment: {
        type: "Delivery",
        stops: [
          {
            type: "end",
            location: {
              gps: "1.3806217468119772, 103.74636438437074",
              area_code: "680230"
            }
          },
          {
            type: "end",
            location: {
              gps: "1.3813081446741677, 103.74788789072721",
              area_code: "680207"
            }
          },
          {
            type: "end",
            location: {
              gps: "1.3826059101531494, 103.743617819222",
              area_code: "680354"
            }
          }
        ]
      },
      payment: {
        type: "ON-FULFILLMENT"
      },
      tags: [
        {
          descriptor: {
            code: "bap_terms"
          },
          list: [
            {
              descriptor: {
                code: "finder_fee_type"
              },
              value: "percent"
            },
            {
              descriptor: {
                code: "finder_fee_amount"
              },
              value: "0"
            }
          ]
        },
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
              value: "xxxxxxxxxxxxxxx"
            }
          ]
        }
      ]
    }
  }
}
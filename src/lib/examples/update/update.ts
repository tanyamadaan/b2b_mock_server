export const update = {
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
    action: "update",
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
    update_target: "item",
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
          }
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
          "@ondc/org/settlement_basis": "delivery",
          "@ondc/org/settlement_window": "P1D",
          "@ondc/org/withholding_amount": "10.00",
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
      ]
    }
  }
}
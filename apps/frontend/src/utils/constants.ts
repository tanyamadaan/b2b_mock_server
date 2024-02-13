
export const NEXT_ACTION = {
  search: "on_search",
  on_search: "select",
  select: "on_select",
  on_select: "init",
  init: "on_init",
  on_init: "confirm",
  confirm: "on_confirm",
  update: "on_update",
  status: "on_status",
  cancel: "on_cancel"
}

export const SCENARIOS = {
	select: [
		{
			name: "Domestic",
		},
		{
			name: "Domestic Self-Pickup",
		},
		{
			name: "Domestic Non-RFQ",
		},
		{
			name: "BAP Chat",
		},
		{
			name: "Exports",
		},
	],
	on_select: [
		{
			name: "Domestic",
		},
		{
			name: "Domestic Self-Pickup",
		},
		{
			name: "Domestic Non-RFQ",
		},
		{
			name: "BAP Chat",
		},
		{
			name: "Exports",
		},
		{
			name: "Non Serviceable",
		},
		{
			name: "Quantity Unavailable",
		},
	],
  init: [
    {
      name: "Domestic"
    },
    {
      name: "Domestic Non-RFQ"
    },
    {
      name: "Domestic BPP Payment"
    },
    {
      name: "Exports"
    }
  ],
  on_init: [
    {
      name: "Domestic"
    },
    {
      name: "Domestic Non-RFQ"
    },
    {
      name: "Domestic Payment BPP Non-RFQ"
    },
    {
      name: "Domestic Self-Pickup"
    },
    {
      name: "Domestic Exports"
    },
    {
      name: "Reject RFQ"
    },
  ],
  confirm: [
    {
      name: "Domestic"
    },
    {
      name: "Exports"
    },
    {
      name: "Non-RFQ"
    },
  ],
  on_confirm: [
    {
      name: "Domestic Non-RFQ"
    },
    {
      name: "Domestic Rejected"
    },
    {
      name: "Domestic"
    },
    {
      name: "Exports"
    },
  ],
  on_status: [
    {
      name: "BPP Payment"
    },
    {
      name: "BPP Payment Error"
    },
    {
      name: "Delivered"
    },
    {
      name: "Out for Delivery"
    },
    {
      name: "Pickup Up"
    },
    {
      name: "Proforma Invoice"
    },
    {
      name: "Self Pickup-up"
    }
  ],
  on_update: [
    {
      name: "Fulfillments"
    },
    {
      name: "Prepaid BAP"
    },
    {
      name: "Prepaid"
    }
  ]
};

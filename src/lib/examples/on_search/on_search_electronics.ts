export const onSearchElectronics = {
	context: {
		domain: "ONDC:RET14",
		location: {
			city: {
				code: "std:080"
			},
			country: {
				code: "IND"
			}
		},
		action: "on_search",
		version: "2.0.1",
		bap_id: "buyerapp.com",
		bap_uri: "https://buyerapp.com/electronics",
		bpp_id: "sellerapp.com",
		bpp_uri: "https://sellerapp.com/electronics",
		transaction_id: "T1",
		message_id: "M1",
		timestamp: "2023-01-08T22:00:30.000Z",
		ttl: "PT30S"
	},
	message: {
		catalog: {
			fulfillments: [
				{
					id: "1",
					type: "Delivery"
				},
				{
					id: "2",
					type: "Self-Pickup"
				}
			],
			payments: [
				{
					id: "1",
					type: "PRE-FULFILLMENT"
				},
				{
					id: "2",
					type: "ON-FULFILLMENT"
				},
				{
					id: "3",
					type: "POST-FULFILLMENT"
				}
			],
			descriptor: {
				name: "ABC store",
				short_desc: "Online eCommerce Store",
				long_desc: "Online eCommerce Store",
				images: [
					{
						url: "https://abc.com/images/1-shop-img"
					}
				]
			},
			providers: [
				{
					id: "P1",
					descriptor: {
						name: "ABC store",
						code: "P001",
						short_desc: "ABC store",
						long_desc: "ABC store",
						additional_desc: {
							url: "chat link",
							content_type: "text/html"
						},
						images: [
							{
								url: "https://abc.com/images/1-shop-img"
							}
						]
					},
					rating: "4.4",
					ttl: "PT1D",
					locations: [
						{
							id: "L1",
							gps: "12.967555,77.749666",
							address: "Jayanagar 4th Block",
							city: {
								code: "std:080",
								name: "Bengaluru"
							},
							state: {
								code: "KA"
							},
							country: {
								code: "IND"
							},
							area_code: "560076"
						}
					],
					creds: [
						{
							id: "ESG-12345678",
							type: "License",
							desc: "Export License No. ESG-12345678",
							url: "https://abcd.cdn.com/images/license-img"
						}
					],
					tags: [
						{
							code: "serviceability",
							list: [
								{
									code: "location",
									value: "L1"
								},
								{
									code: "category",
									value: "RET10-1042"
								},
								{
									code: "type",
									value: "12"
								},
								{
									code: "val",
									value: "SGP"
								},
								{
									code: "unit",
									value: "country"
								}
							]
						},
						{
							code: "seller_terms",
							list: [
								{
									code: "gst_credit_invoice",
									value: "Y"
								}
							]
						},
						{
							code: "seller_id",
							list: [
								{
									code: "seller_id_code",
									value: "gst"
								},
								{
									code: "seller_id_no",
									value: "xxxxxxxxxxxxxxx"
								}
							]
						}
					],
					categories: [
						{
							id: "V1",
							descriptor: {
								name: "Variant Group 1"
							},
							tags: [
								{
									code: "type",
									list: [
										{
											code: "type",
											value: "variant_group"
										}
									]
								},
								{
									code: "attr",
									list: [
										{
											code: "name",
											value: "item.tags.attribute.colour"
										},
										{
											code: "seq",
											value: "1"
										}
									]
								},
								{
									code: "attr",
									list: [
										{
											code: "name",
											value: "item.tags.attribute.storage"
										},
										{
											code: "seq",
											value: "2"
										}
									]
								}
							]
						}
					],
					items: [
						{
							id: "I1",
							parent_item_id: "V1",
							descriptor: {
								name: "Apple Iphone 14",
								code: "UPC / EAN code",
								short_desc: "Apple Iphone 14",
								long_desc: "Apple Iphone 14",
								images: [
									{
										url: "https://abc.com/images/207.png"
									}
								],
								media: [
									{
										mimetype: "video/mp4",
										url: "https://abc.com/images/207.mp4"
									}
								]
							},
							creator: {
								descriptor: {
									name: "Iphone",
									contact: {
										name: "Raj Kumar",
										address: {
											full: "Iphone Ltd., Delhi"
										},
										phone: "18001801018",
										email: "consumer.services@abc.com"
									}
								}
							},
							price: {
								currency: "INR",
								value: "300.00",
								offered_value: "250.00",
								maximum_value: "350.00"
							},
							quantity: {
								unitized: {
									measure: {
										unit: "unit",
										value: "1"
									}
								},
								available: {
									measure: {
										unit: "unit",
										value: "1"
									},
									count: "2000"
								},
								maximum: {
									measure: {
										unit: "unit",
										value: "1"
									},
									count: "4000"
								}
							},
							category_ids: [
								"RET14-1042"
							],
							fulfillment_ids: [
								"1"
							],
							location_ids: [
								"L1"
							],
							payment_ids: [
								"2"
							],
							"add-ons": [
								{
									id: "78787723",
									descriptor: {
										name: "Iphone Cover",
										short_desc: "Iphone Cover",
										long_desc: "Iphone Cover",
										images: [
											{
												url: "https://abc.com/images/208.png"
											}
										]
									},
									price: {
										currency: "INR",
										value: "170.0",
										offered_value: "100.0",
										maximum_value: "170.0"
									}
								}
							],
							cancellation_terms: [
								{
									fulfillment_state: {
										descriptor: {
											code: "Pending"
										}
									},
									refund_eligible: "true"
								},
								{
									fulfillment_state: {
										descriptor: {
											code: "Packed"
										}
									},
									refund_eligible: "true"
								},
								{
									fulfillment_state: {
										descriptor: {
											code: "Order-delivered"
										}
									},
									return_policy: {
										return_eligible: "true",
										return_within: "P7D",
										fulfillment_managed_by: "seller",
										return_location: {
											address: "RTO address",
											gps: "12.667555,77.349666"
										}
									}
								}
							],
							replacement_terms: [
								{
									replace_within: "P7D"
								}
							],
							time: {
								label: "validity",
								range: {
									start: "2022-12-24T00:00:00.000Z",
									end: "2022-12-31T00:00:00.000Z"
								}
							},
							matched: "true",
							recommended: "true",
							tags: [
								{
									code: "origin",
									list: [
										{
											code: "country",
											value: "IND"
										}
									]
								},
								{
									code: "image",
									list: [
										{
											code: "type",
											value: "back_image"
										},
										{
											code: "url",
											value: "https://sellerNP.com/images/i1_back_image.png"
										}
									]
								},
								{
									code: "attribute",
									list: [
										{
											code: "brand",
											value: "Samsung"
										},
										{
											code: "model",
											value: "Galaxy Bean Buds Live"
										},
										{
											code: "colour",
											value: "mystic black"
										},
										{
											code: "connectivity",
											value: "wireless"
										},
										{
											code: "form_factor",
											value: "In Ear"
										},
										{
											code: "size",
											value: "128GB"
										},
										{
											code: "style",
											value: "Modern"
										},
										{
											code: "screen_size",
											value: "1.99"
										},
										{
											code: "memory",
											value: "8GB"
										},
										{
											code: "cpu",
											value: "Core M family"
										},
										{
											code: "cpu_mfr",
											value: "Intel"
										},
										{
											code: "storage",
											value: "256GB"
										},
										{
											code: "os",
											value: "Windows 11"
										},
										{
											code: "includes",
											value: "Desktop, User Manual, Warranty Card"
										},
										{
											code: "compatible_devices",
											value: "PC, MAC, Laptop, Smartphone, Tablet"
										},
										{
											code: "type",
											value: "wireless"
										},
										{
											code: "special_feature",
											value: "wireless,laser"
										},
										{
											code: "display",
											value: "1920x1080px"
										},
										{
											code: "refresh",
											value: "60Hz"
										}
									]
								},
								{
									code: "g2",
									list: [
										{
											code: "time_to_ship",
											value: "P1D"
										},
										{
											code: "tax_rate",
											value: "12"
										}
									]
								},
								{
									code: "g3",
									list: [
										{
											code: "brand",
											value: "Dhara"
										},
										{
											code: "pack_size",
											value: "5"
										},
										{
											code: "num_price_slabs",
											value: "3"
										}
									]
								},
								{
									code: "price_slab",
									list: [
										{
											code: "min_pack_size",
											value: "1"
										},
										{
											code: "max_pack_size",
											value: "4"
										},
										{
											code: "unit_sale_price",
											value: "250"
										}
									]
								},
								{
									code: "price_slab",
									list: [
										{
											code: "min_pack_size",
											value: "5"
										},
										{
											code: "max_pack_size",
											value: "9"
										},
										{
											code: "unit_sale_price",
											value: "200"
										}
									]
								},
								{
									code: "price_slab",
									list: [
										{
											code: "min_pack_size",
											value: "10"
										},
										{
											code: "max_pack_size",
											value: ""
										},
										{
											code: "unit_sale_price",
											value: "175"
										}
									]
								}
							]
						}
					],
					fulfillments: [
						{
							contact: {
								phone: "9886098860",
								email: "abc@xyz.com"
							}
						}
					]
				}
			]
		}
	}
}
import { DOMAIN, VERSION, TERMS, LOG_BPP_TERMS, PAYMENT_TERMS, PAYMENT_BPP_TERMS } from "./constants";

export const confirmSchema = {
	$id: "confirmSchema",
	type: "object",
	properties: {
		context: {
			type: "object",
			properties: {
				domain: {
					type: "string",
					enum: DOMAIN,
				},
				location: {
					type: "object",
					properties: {
						city: {
							type: "object",
							properties: {
								code: {
									type: "string",
								},
							},
							required: ["code"],
						},
						country: {
							type: "object",
							properties: {
								code: {
									type: "string",
								},
							},
							required: ["code"],
						},
					},
					required: ["city", "country"],
				},
				action: {
					type: "string",
					const: "confirm",
				},
				version: {
					type: "string",
					const: VERSION,
				},
				bap_id: {
					type: "string",
				},
				bap_uri: {
					type: "string",
				},
				bpp_id: {
					type: "string",
				},
				bpp_uri: {
					type: "string",
				},
				transaction_id: {
					type: "string",
				},
				message_id: {
					type: "string",
				},
				timestamp: {
					type: "string",
				},
				ttl: {
					type: "string",
				},
			},
			required: [
				"domain",
				"location",
				"action",
				"version",
				"bap_id",
				"bap_uri",
				"bpp_id",
				"bpp_uri",
				"transaction_id",
				"message_id",
				"timestamp",
				"ttl",
			],
		},
		message: {
			type: "object",
			properties: {
				order: {
					type: "object",
					properties: {
						id: {
							type: "string",
						},
						status: {
							type: "string",
							enum: ["Created"]
						},
						provider: {
							type: "object",
							properties: {
								id: {
									type: "string",
								},
								locations: {
									type: "array",
									items: 
										{
											type: "object",
											properties: {
												id: {
													type: "string",
												},
											},
											required: ["id"],
										},
									
								},
							},
							required: ["id", "locations"],
						},
						items: {
							type: "array",
							items: 
								{
									type: "object",
									properties: {
										id: {
											type: "string",
										},
										fulfillment_ids: {
											type: "array",
											items: 
												{
													type: "string",
												},
											
										},
										category_ids: {
											type: "array",
											items:
												{
													type: "string",
												},
											
										},
										descriptor: {
											type: "object",
											properties: {
												code: {
													type: "string",
													enum: ["P2P","P2H2P"],
												},
											},
											required: ["code"],
										},
									},
									required: [
										"id",
										"fulfillment_ids",
										"category_ids",
										"descriptor",
									],
								},
							
						},
						fulfillments: {
							type: "array",
							items: 
								{
									type: "object",
									properties: {
										id: {
											type: "string",
										},
										type: {
											type: "string",
										},
										agent: {
											type: "object",
											properties: {
												person: {
													type: "object",
													properties: {
														name: {
															type: "string",
														},
													},
													required: ["name"],
												},
											},
											required: ["person"],
										},
										stops: {
											type: "array",
											items: 
												{
													type: "object",
													properties: {
														id: {
															type: "string",
														},
														parent_stop_id: {
															type: "string",
														},
														type: {
															type: "string",
														},
														location: {
															type: "object",
															properties: {
																gps: {
																	type: "string",
																	pattern:
																"^(-?[0-9]{1,3}(?:.[0-9]{6,15})?),( )*?(-?[0-9]{1,3}(?:.[0-9]{6,15})?)$",
																	errorMessage:
																"Incorrect gps value (minimum of six decimal places are required)",
																},
																address: {
																	type: "string",
																},
																city: {
																	type: "object",
																	properties: {
																		name: {
																			type: "string",
																		},
																	},
																	required: ["name"],
																},
																state: {
																	type: "object",
																	properties: {
																		name: {
																			type: "string",
																		},
																	},
																	required: ["name"],
																},
																country: {
																	type: "object",
																	properties: {
																		name: {
																			type: "string",
																		},
																		code: {
																			type: "string",
																		},
																	},
																	required: ["name", "code"],
																},
																area_code: {
																	type: "string",
																},
															},
															required: [
																"gps",
																"address",
																"city",
																"state",
																"country",
																"area_code",
															],
														},
														contact: {
															type: "object",
															properties: {
																phone: {
																	type: "string",
																},
																email: {
																	type: "string",
																},
															},
															required: ["phone", "email"],
														},
													},
													required: [
														"id",
														"parent_stop_id",
														"type",
														"location",
														"contact",
													],
												},		
										},
									},
									required: ["id", "type", "agent", "stops"],
								},
							
						},
						quote: {
							type: "object",
							properties: {
								price: {
									type: "object",
									properties: {
										currency: {
											type: "string",
										},
										value: {
											type: "string",
										},
									},
									required: ["currency", "value"],
								},
								breakup: {
									type: "array",
									items: 
										{
											type: "object",
											properties: {
												item: {
													type: "object",
													properties: {
														id: {
															type: "string",
														},
													},
													required: ["id"],
												},
												title: {
													type: "string",
												},
												price: {
													type: "object",
													properties: {
														currency: {
															type: "string",
														},
														value: {
															type: "string",
														},
													},
													required: ["currency", "value"],
												},
											},
											required: ["item", "title", "price"],
										},
								},
							},
							required: ["price", "breakup"],
						},
						billing: {
							type: "object",
							properties: {
								name: {
									type: "string",
								},
								address: {
									type: "string",
								},
								city: {
									type: "string",
								},
								state: {
									type: "string",
								},
								tax_id: {
									type: "string",
								},
								phone: {
									type: "string",
								},
								email: {
									type: "string",
								},
								time: {
									type: "object",
									properties: {
										timestamp: {
											type: "string",
										},
									},
									required: ["timestamp"],
								},
							},
							required: [
								"name",
								"address",
								"city",
								"state",
								"tax_id",
								"phone",
								"email",
							],
						},
						payments: {
							type: "array",
							items: 
								{
									type: "object",
									properties: {
										id: {
											type: "string",
										},
										collected_by: {
											type: "string",
										},
										params: {
											type: "object",
											properties: {
												amount: {
													type: "string",
												},
												currency: {
													type: "string",
												},
												bank_account_number: {
													type: "string",
												},
												virtual_payment_address: {
													type: "string",
												},
											},
											required: [
												"amount",
												"currency",
												"bank_account_number",
												"virtual_payment_address",
											],
										},
										type: {
											type: "string",
										},
										tags: {
											type: "array",
											items: 
												{
													type: "object",
													properties: {
														descriptor: {
															type: "object",
															properties: {
																code: {
																	type: "string",
																},
															},
															required: ["code"],
														},
														list: {
															type: "array",
															items: 
																{
																	type: "object",
																	properties: {
																		descriptor: {
																			type: "object",
																			properties: {
																				code: {
																					type: "string",
																				},
																			},
																			required: ["code"],
																		},
																		value: {
																			type: "string",
																		},
																	},
																	required: ["descriptor", "value"],
																},			
														},
													},
													required: ["descriptor", "list"],
												},		
										},
									},
									required: ["id", "collected_by", "params", "type", "tags"],
								},
							
						},
						tags: {
							type: "array",
							items: 
								{
									type: "object",
									properties: {
										descriptor: {
											type: "object",
											properties: {
												code: {
													type: "string",
													enum: TERMS,
												},
											},
											required: ["code"],
										},
										list: {
											type: "array",
											items: 
												{
													type: "object",
													properties: {
														descriptor: {
															type: "object",
															properties: {
																code: {
																	type: "string",
																	enum: LOG_BPP_TERMS
																},
															},
															required: ["code"],
														},
														value: {
															type: "string",
														},
													},
													required: ["descriptor", "value"],
												},
										},
									},
									required: ["descriptor", "list"],
								},
						},
						created_at: {
							type: "string",
						},
						updated_at: {
							type: "string",
						},
					},
					required: [
						"id",
						"status",
						"provider",
						"items",
						"fulfillments",
						"quote",
						"billing",
						"payments",
						"tags",
						"created_at",
						"updated_at",
					],
				},
			},
			required: ["order"],
		},
	},
	required: ["context", "message"],
};

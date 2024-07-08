import {
	CONTEXT_DOMAIN,
	VERSION,
	TERMS,
	LOG_ORDER_TAGS,
	PAYMENT_TERMS,
	PAYMENT_BPP_TERMS,
} from "./constants";

export const onCancelSchema = {
	$id: "onCancelSchema",
	type: "object",
	properties: {
		context: {
			type: "object",
			properties: {
				domain: {
					type: "string",
					const: CONTEXT_DOMAIN,
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
					const: "on_cancel",
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
							const: "Cancelled",
						},
						cancellation: {
							type: "object",
							properties: {
								cancelled_by: {
									type: "string",
								},
								reason: {
									type: "object",
									properties: {
										id: {
											type: "string",
										},
									},
									required: ["id"],
								},
							},
							required: ["cancelled_by", "reason"],
						},
						provider: {
							type: "object",
							properties: {
								id: {
									type: "string",
								},
								locations: {
									type: "array",
									items: {
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
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									category_ids: {
										type: "array",
										items: {
											type: "string",
										},
									},
									descriptor: {
										type: "object",
										properties: {
											code: {
												type: "string",
												enum: ["P2P", "P2H2P"],
											},
										},
										required: ["code"],
									},
									fulfillment_ids: {
										type: "array",
										items: {
											type: "string",
										},
									},
									time: {
										type: "object",
										properties: {
											label: {
												type: "string",
											},
											duration: {
												type: "string",
											},
											timestamp: {
												type: "string",
											},
										},
										required: ["label", "duration", "timestamp"],
									},
								},
								required: [
									"id",
									"category_ids",
									"descriptor",
									"fulfillment_ids",
									"time",
								],
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
									items: {
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
												const: "delivery",
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
						fulfillments: {
							type: "array",
							items: {
								type: "object",
								properties: {
									id: {
										type: "string",
									},
									type: {
										type: "string",
										const: "Delivery",
									},
									state: {
										type: "object",
										properties: {
											descriptor: {
												type: "object",
												properties: {
													code: {
														type: "string",
														const: "Cancelled",
													},
												},
												required: ["code"],
											},
										},
										required: ["descriptor"],
									},
									tracking: {
										type: "boolean",
									},
									stops: {
										type: "array",
										items: {
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
														area_code: {
															type: "string",
														},
														map_url: {
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
														country: {
															type: "string",
														},
													},
													required: [
														"gps",
														"area_code",
														"map_url",
														"address",
														"city",
														"state",
														"country",
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
												authorization: {
													type: "object",
													properties: {
														type: {
															type: "string",
														},
														token: {
															type: "string",
														},
														valid_from: {
															type: "string",
														},
														valid_to: {
															type: "string",
														},
													},
													required: ["type", "token", "valid_from", "valid_to"],
												},
												instructions: {
													type: "object",
													properties: {
														short_desc: {
															type: "string",
														},
														long_desc: {
															type: "string",
														},
														additional_desc: {
															type: "object",
															properties: {
																content_type: {
																	type: "string",
																},
																url: {
																	type: "string",
																},
															},
															required: ["content_type", "url"],
														},
														images: {
															type: "array",
															items: {
																type: "string",
															},
														},
													},
													required: [
														"short_desc",
														"long_desc",
														"additional_desc",
													],
												},
												time: {
													type: "object",
													properties: {
														range: {
															type: "object",
															properties: {
																start: {
																	type: "string",
																},
																end: {
																	type: "string",
																},
															},
															required: ["start", "end"],
														},
													},
													required: ["range"],
												},
											},
											required: [
												"id",
												"parent_stop_id",
												"type",
												"location",
												"contact",
												"authorization",
												"instructions",
												"time",
											],
										},
									},
									tags: {
										type: "array",
										items: {
											type: "object",
											properties: {
												descriptor: {
													type: "object",
													properties: {
														code: {
															type: "string",
															const: "Delivery_Terms",
														},
													},
													required: ["code"],
												},
												list: {
													type: "array",
													items: {
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
								required: ["id", "type", "state", "tracking", "stops", "tags"],
							},
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
						payment: {
							type: "array",
							items: {
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
										items: {
											type: "object",
											properties: {
												descriptor: {
													type: "object",
													properties: {
														code: {
															type: "string",
															enum: PAYMENT_TERMS,
														},
													},
													required: ["code"],
												},
												list: {
													type: "array",
													items: {
														type: "object",
														properties: {
															descriptor: {
																type: "object",
																properties: {
																	code: {
																		type: "string",
																		enum: PAYMENT_BPP_TERMS,
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
							items: {
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
										items: {
											type: "object",
											properties: {
												descriptor: {
													type: "object",
													properties: {
														code: {
															type: "string",
															enum: LOG_ORDER_TAGS,
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
						updated_at: {
							type: "string",
						},
					},
					required: [
						"id",
						"status",
						"cancellation",
						"provider",
						"items",
						"quote",
						"fulfillments",
						"billing",
						"payment",
						"tags",
						"updated_at",
					],
				},
			},
			required: ["order"],
		},
	},
	required: ["context", "message"],
};

import { NextFunction, Request, Response } from "express";
import {
	responseBuilder_logistics,
	LOGISTICS_EXAMPLES_PATH,
	MOCKSERVER_ID,
	send_response,
	redis,
	send_nack,
	Item,
} from "../../../lib/utils";

import fs from "fs";
import path from "path";
import YAML from "yaml";
import { v4 as uuidv4 } from "uuid";
import { update } from "lodash";

export const initiateConfirmController = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const { transactionId } = req.body;
		var transactionKeys = await redis.keys(`${transactionId}-*`);
		var ifTransactionExist = transactionKeys.filter((e) =>
			e.includes("on_init-from-server")
		);
		if (ifTransactionExist.length === 0) {
			return send_nack(res, "On Init doesn't exist");
		}
		var transaction = await redis.mget(ifTransactionExist);
		var parsedTransaction = transaction.map((ele) => {
			return JSON.parse(ele as string);
		});

		const onInit = parsedTransaction[0].request;
		if (Object.keys(onInit).includes("error")) {
			return send_nack(res, "On Init had errors");
		}
		transactionKeys = await redis.keys(`${transactionId}-*`);
		ifTransactionExist = transactionKeys.filter((e) =>
			e.includes("init-from-server")
		);
		if (ifTransactionExist.length === 0) {
			return send_nack(res, "Init doesn't exist");
		}
		transaction = await redis.mget(ifTransactionExist);
		parsedTransaction = transaction.map((ele) => {
			return JSON.parse(ele as string);
		});
		const Init = parsedTransaction[1].request;
		if (Object.keys(onInit).includes("error")) {
			return send_nack(res, "Init had errors");
		}
		let confirm = {
			context: {
				...Init.context,
				timestamp: new Date().toISOString(),
				action: "confirm",
				message_id: uuidv4(),
			},
			message: {
				order: {
					id: "O2",
					status: "Created",
					provider: Init.message.order.provider,
					items: Init.message.order.items,
					fulfillments: [
						{
							...Init.message.order.fulfillments[0],
							agent: {
								person: {
									name: "Ramu",
								},
							},
						},
					],
					quote: onInit.message.order.quote,
					billing: Init.message.order.billing,
					payments: onInit.message.order.payments,
					tags: [
						{
							descriptor: {
								code: "Package_Weight",
							},
							list: [
								{
									descriptor: {
										code: "Unit",
									},
									value: "kilogram",
								},
								{
									descriptor: {
										code: "Value",
									},
									value: "5",
								},
							],
						},
						{
							descriptor: {
								code: "Package_Dimensions",
							},
							list: [
								{
									descriptor: {
										code: "Unit",
									},
									value: "centimeter",
								},
								{
									descriptor: {
										code: "Length",
									},
									value: "100",
								},
								{
									descriptor: {
										code: "Breadth",
									},
									value: "100",
								},
								{
									descriptor: {
										code: "Height",
									},
									value: "100",
								},
							],
						},
						{
							descriptor: {
								code: "Package_Details",
							},
							list: [
								{
									descriptor: {
										code: "Category",
									},
									value: "Grocery",
								},
								{
									descriptor: {
										code: "Dangerous_Goods",
									},
									value: "true",
								},
								{
									descriptor: {
										code: "Stackable",
									},
									value: "true",
								},
								{
									descriptor: {
										code: "Shipment_Value",
									},
									value: "50000",
								},
								{
									descriptor: {
										code: "Package_Count",
									},
									value: "10",
								},
							],
						},
						{
							descriptor: {
								code: "Cold_Logistics",
							},
							list: [
								{
									descriptor: {
										code: "Temp_Control",
									},
									value: "true",
								},
								{
									descriptor: {
										code: "Temp_Unit",
									},
									value: "Celsius",
								},
								{
									descriptor: {
										code: "Temp_Min",
									},
									value: "0",
								},
								{
									descriptor: {
										code: "Temp_Max",
									},
									value: "4",
								},
							],
						},
						{
							descriptor: {
								code: "BPP_Terms",
							},
							list: [
								{
									descriptor: {
										code: "Max_Liability",
									},
									value: "2",
								},
								{
									descriptor: {
										code: "Max_Liability_Cap",
									},
									value: "10000",
								},
								{
									descriptor: {
										code: "Mandatory_Arbitration",
									},
									value: "false",
								},
								{
									descriptor: {
										code: "Court_Jurisdiction",
									},
									value: "Bengaluru",
								},
								{
									descriptor: {
										code: "Delay_Interest",
									},
									value: "1000",
								},
								{
									descriptor: {
										code: "Static_Terms",
									},
									value:
										"https://github.com/ONDC-Official/protocol-network-extension/discussions/79",
								},
							],
						},
						{
							descriptor: {
								code: "BAP_Terms",
							},
							list: [
								{
									descriptor: {
										code: "Accept_BPP_Terms",
									},
									value: "Y",
								},
							],
						},
					],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
				},
			},
		};
    await send_response(res, next, confirm, transactionId, "confirm");

	} catch (error) {
		return next(error);
	}
};

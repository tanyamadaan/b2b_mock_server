import { Request, Response } from "express";
import {
	B2B_BAP_MOCKSERVER_URL,
	createAuthHeader,
	MOCKSERVER_ID,
	redis,
} from "../../../lib/utils";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { selectController } from "../bpp/select";

export const initiateUpdateController = async (req: Request, res: Response) => {

  const { scenario, transactionId } = req.body;
  const transactionKeys = await redis.keys(`${transactionId}-*`);
	const ifTransactionExist = transactionKeys.filter((e) =>
		e.includes("on_confirm-to-server")
	);
  if (ifTransactionExist.length === 0) {
		return res.status(400).json({
			message: {
				ack: {
					status: "NACK",
				},
			},
			error: {
				message: "On Confirm doesn't exist",
			},
		});
	}
  

	const transaction = await redis.mget(ifTransactionExist);
	const parsedTransaction = transaction.map((ele) => {
		return JSON.parse(ele as string);
	});

	const {context,message} = parsedTransaction[0].request;
  const timestamp = new Date().toISOString();
  context.action="update"
  context.timestamp=timestamp

  switch(scenario){
    case "selection":
      const responseMessage=selectionRequest(message)
      break 
    case "customization":
      const responseMessage1=customizationRequest(message)
      break
  }
}
function selectionRequest(message:any){
  let {
		order: { items, payments ,fulfillments,quote},
	} = message;
  items = items.map(({ id, parent_item_id ,...every}: { id: string; parent_item_id: object }) => ({
		...every,
    id,
		parent_item_id,
	}));
  fulfillments.map((itm:any)=>{
    itm.state.descriptor.code="Completed"
  });
  
  const responseMessage={
    id: message.order.id,
    state: message.order.state,
    update_target:"payments",
    provider: {
      id: message.order.provider.id,
    },
    items,
    payments,
    fulfillments:fulfillments.map(({id,itm}:{id:String,itm:any})=>({
      ...itm,
      stops:itm.stops.map((stop:any)=>({
        ...stop,
      }))
    })),
    quote
  }
  return responseMessage
}



function customizationRequest(message:any){

}
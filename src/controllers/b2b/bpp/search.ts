import { Request, Response } from "express";
import { onSearch, onSearchBpc, onSearchElectronics, onSearchFashion, onSearchGrocery } from "../../../lib/examples";

export const searchController = (req: Request, res: Response) => {
  const domain = req.body.context.domain;
  var ts = new Date(req.body.context.timestamp);
  ts.setSeconds(ts.getSeconds() + 1)
  const context = { ...req.body.context, action: "on_search", bpp_id: "b2b.ondc-mockserver.com", bpp_uri: "b2b.ondc-mockserver.com/url", timeStamp: ts.toISOString() };
  return res.json({
    // context,
    sync: {
      message: {
        ack: {
          status: "ACK",
        },
      },
    },
    async: {
      context,
      message: domain === "ONDC:RET13" ? onSearchBpc.message : domain === "ONDC:RET14" ? onSearchElectronics.message : domain === "ONDC:RET12" ? onSearchFashion.message : domain === "ONDC:RET10" ? onSearchGrocery.message : onSearch.message
    }
  });
};

# How to use
To start, first you have to ask yourself two things. "_To which service I am making requests to(BAP or BPP)?"_ and "_what would be the action/on_action I am going to use_". With these you can easily construct the URL you need to mock and then find that among this list.

**_NOTE:_** Currently mocker server supports only B2B and Services.

## Servers
There are two type of NPs one is BPP(Seller app) and BAP(Buyer app). 

* All the **actions** calls are hosted on the BPP server. So if you want to make mock requests to BPP, then select _/b2b/bpp_ from the servers dropdown.

* All the **on_actions** calls are hosted on the BAP server. So if you want make mock requests to BAP or the buyer app, then select _/b2b/bap_ from the servers dropdown.

## Make a request
Since you have selected the desired server, now you can make the requests to that server. There are two serivces available to test with :
  * Sandbox
  * Mock

You can select service from `mode` dropdown.

### Sandbox
To to use the sandbox you need to have an authorization header which is to be passed in the header to make requests. For creating the authorization header you can refer this [document](https://docs.google.com/document/d/1brvcltG_DagZ3kGr1ZZQk4hG4tze3zvcxmGV4NMTzr8/edit?pli=1#heading=h.hdylqyv4bn12)

### Mock
You can use Mock service to mock the requests. It doesn't require authorization header to be passed. 

### Request body
You can refer these [examples](https://github.com/ONDC-Official/ONDC-RET-Specifications/tree/release-2.0.2/api/components/Examples/B2B_json) for request body.

__Note__: All the requests must pass the schema validation based on the examples. You can refer this [log utility](https://github.com/ONDC-Official/reference-implementations/tree/main/utilities/logistics-b2b/log-verification-utility) for the schema validations.

### Response body
1. In the case of schema validation failure, you will receive a `NACK`. A sample `NACK` response is as below:
```json
{
  "message": {
    "ack": {
      "status": "NACK"
    }
  },
  "error": {
    "type": "JSON-SCHEMA-ERROR",
    "code": "50009",
    "message": [
      {
        "message": "must have required property 'domain'"
      }
    ]
  }
}
```
2. In the case of schema validation success 
```json
{
  
    "message": {
      "ack": {
        "status": "ACK"
      }
  },
 ```
   
In case you use mock service you will receive both `sync` and `async` and in case of sandbox service you will receive only `sync` response with `ACK` and `async` response will be sent back to the respective NP.


### CURL request
You can also make curl request from the CLI. You don't have to use only swagger or UI to make requests. You can also use the curl command to make the requests. A sample `/on_search` curl request would look like this 

```
curl -X POST \
		  http://localhost:3000/b2b/bap/on_search?mode=mock&scenario=self-pickup \
		-H 'accept: application/json' \
		-H 'Content-Type: application/json' \
		-d '{
  "context": {
    ...
  },
  "message": {
    ...
    }
}'
```
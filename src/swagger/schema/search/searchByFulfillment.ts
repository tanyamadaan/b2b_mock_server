export const searchByFulfillmentSchema = {
  type: "object",
  properties: {
    context: {
      type: "object",
      properties: {
        domain: {
          type: "string"
        },
        location: {
          type: "object",
          properties: {
            city: {
              type: "object",
              properties: {
                code: {
                  type: "string"
                }
              }
            },
            country: {
              type: "object",
              properties: {
                code: {
                  type: "string"
                }
              }
            }
          }
        },
        action: {
          type: "string"
        },
        version: {
          type: "string"
        },
        bap_id: {
          type: "string"
        },
        bap_uri: {
          type: "string"
        },
        transaction_id: {
          type: "string"
        },
        message_id: {
          type: "string"
        },
        timestamp: {
          type: "string",
          format: "date-time"
        },
        ttl: {
          type: "string"
        }
      }
    },
    message: {
      type: "object",
      properties: {
        intent: {
          type: "object",
          properties: {
            fulfillment: {
              type: "object",
              properties: {
                type: {
                  type: "string"
                },
                stops: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      type: {
                        type: "string"
                      },
                      location: {
                        type: "object",
                        properties: {
                          gps: {
                            type: "string"
                          },
                          area_code: {
                            type: "string"
                          }
                        }
                      }
                    }
                  }
                }
              }
            },
            payment: {
              type: "object",
              properties: {
                type: {
                  type: "string"
                }
              }
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
                        type: "string"
                      }
                    }
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
                              type: "string"
                            }
                          }
                        },
                        value: {
                          type: "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
}
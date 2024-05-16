import { redis } from "./redis"
async function redisFetchToServer(action: string, transaction_id: string) {
    const transactionKeys = await redis.keys(`${transaction_id}-*`);
    const ifTransactionExist = transactionKeys.filter((e) =>
        e.includes(`${action}-to-server`)
    );
    if (ifTransactionExist.length === 0) {
        return null
    }

    const transaction = await redis.mget(ifTransactionExist);
    const parsedTransaction = transaction.map((ele: any) => {
        return JSON.parse(ele as string);
    });

    return parsedTransaction[0].request
}

async function redisFetchFromServer(action: string, transaction_id: string) {
    const transactionKeys = await redis.keys(`${transaction_id}-*`);
    const ifTransactionExist = transactionKeys.filter((e) =>
        e.includes(`${action}-from-server`)
    );

    if (ifTransactionExist.length === 0) {
        return null
    }

    const transaction = await redis.mget(ifTransactionExist);
    const parsedTransaction = transaction.map((ele: any) => {
        return JSON.parse(ele as string);
    });

    return parsedTransaction[0].request
}

async function redisExistToServer(action: string, transaction_id: string) {
    const transactionKeys = await redis.keys(`${transaction_id}-*`);
    const ifTransactionExist = transactionKeys.filter((e) =>
        e.includes(`${action}-to-server`)
    );

    if (ifTransactionExist.length === 0) {
        return false
    }
    else
        return true
}

async function redisExistFromServer(action: string, transaction_id: string) {
    const transactionKeys = await redis.keys(`${transaction_id}-*`);
    const ifTransactionExist = transactionKeys.filter((e) =>
        e.includes(`${action}-from-server`)
    );

    if (ifTransactionExist.length === 0) {
        return false
    }
    else
        return true
}
export { redisFetchToServer, redisFetchFromServer,redisExistFromServer,redisExistToServer }
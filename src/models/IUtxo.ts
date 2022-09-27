export interface IUtxo {
    rid: number,
    pending: boolean,
    txid: string,
    amount: string,
    amountUnformatted: number
}
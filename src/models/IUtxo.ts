export interface IUtxo {
    pending: boolean,
    txid: string,
    amount: string,
    amountUnformatted: number
}
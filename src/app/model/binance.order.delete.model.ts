export class BinanceOrderDeleteRequest {

      symbol : string;
      orderIds : number[];
   
  
      constructor(orderIds: number[], symbol: string) {
        this.orderIds = orderIds;
        this.symbol = symbol;
      }
  }
export class BinanceApiResponse {

      orderId : number;
      symbol : string;
      status : string;
      clientOrderId : string;
      price : string;
      avgPrice : string;
      origQty : string;
      executedQty : string;
      cumQuote : string;
      timeInForce : string;
      type : string;
      reduceOnly : boolean;
      closePosition : boolean;
      side : string;
      positionSide: string;
      stopPrice: string;
      workingType: string;
      priceProtect: boolean;
      origType : string;
      priceMatch : string;
      selfTradePreventionMode : string;
      goodTillDate : number;
      time : number;
      updateTime : number;
   
  
      constructor(
        orderId: number,
        symbol: string,
        status: string,
        clientOrderId: string,
        price: string,
        avgPrice: string,
        origQty: string,
        executedQty: string,
        cumQuote: string,
        timeInForce: string,
        type: string,
        reduceOnly: boolean,
        closePosition: boolean,
        side: string,
        positionSide: string,
        stopPrice: string,
        workingType: string,
        priceProtect: boolean,
        origType: string,
        priceMatch: string,
        selfTradePreventionMode: string,
        goodTillDate: number,
        time: number,
        updateTime: number
      ) {
        this.orderId = orderId;
        this.symbol = symbol;
        this.status = status;
        this.clientOrderId = clientOrderId;
        this.price = price;
        this.avgPrice = avgPrice;
        this.origQty = origQty;
        this.executedQty = executedQty;
        this.cumQuote = cumQuote;
        this.timeInForce = timeInForce;
        this.type = type;
        this.reduceOnly = reduceOnly;
        this.closePosition = closePosition;
        this.side = side;
        this.positionSide = positionSide;
        this.stopPrice = stopPrice;
        this.workingType = workingType;
        this.priceProtect = priceProtect;
        this.origType = origType;
        this.priceMatch = priceMatch;
        this.selfTradePreventionMode = selfTradePreventionMode;
        this.goodTillDate = goodTillDate;
        this.time = time;
        this.updateTime = updateTime;
      }
  }
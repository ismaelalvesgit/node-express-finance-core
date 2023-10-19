export interface IQuoteBrapi {
    symbol: string
    shortName: string
    logourl: string
    longName: string
    currency: string
    currencyRateFromUSD: number
    regularMarketPrice: number
    regularMarketDayHigh: number
    regularMarketDayLow: number
    regularMarketDayRange: string
    regularMarketChange: number
    regularMarketChangePercent: number
    regularMarketTime: Date
    marketCap: number
    regularMarketVolume: number
    regularMarketPreviousClose: number
    regularMarketOpen: number
    averageDailyVolume10Day: number
    averageDailyVolume3Month: number
    fiftyTwoWeekLowChange: number
    fiftyTwoWeekLowChangePercent: number
    fiftyTwoWeekRange: string
    fiftyTwoWeekHighChange: number
    fiftyTwoWeekHighChangePercent: number
    fiftyTwoWeekLow: number
    fiftyTwoWeekHigh: number
    twoHundredDayAverage: number
    twoHundredDayAverageChange: number
    twoHundredDayAverageChangePercent: number
}

export interface IQuoteCoinBrapi {
    currency: string
    coinName: string
    coin: string
    currencyRateFromUSD: number
    regularMarketChange: number
    regularMarketPrice: number
    regularMarketChangePercent: number
    regularMarketDayLow: number
    regularMarketDayHigh: number
    regularMarketDayRange: string
    regularMarketVolume: number
    marketCap: number
    regularMarketTime: number
    coinImageUrl: string
}

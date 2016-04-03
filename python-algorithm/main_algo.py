from pyalgotrade import strategy
from pyalgotrade.barfeed import yahoofeed
from pyalgotrade.technical import ma
import os

print "Our algorithm helps to close the gap between investors in the real world"
print "Hello! Welcome to the algorithm tester"
print "Algoritms allow investors to take their "
longPositionPurchases = input("Please enter the number of shares in Oracle you would like to purchase in the long position:  ")
print "At what percentage would you like to sell/buy (buy when it dips under the percentage, and sell when it goes over the percentage)"
percentageOfTrade = input("Percentage: ")
print "What duration do you want to calculate your moving average on?"
userSmaDuration = input("Days: ")
        
        
class MyTradingStrategy(strategy.BacktestingStrategy):
    def __init__(self, feed, instrument, smaPeriod, startingBalance):
        strategy.BacktestingStrategy.__init__(self, feed, startingBalance)
        self.__position = None
        self.__instrument = instrument
        self.setUseAdjustedValues(True)
        self.__sma = ma.SMA(feed[instrument].getCloseDataSeries(), smaPeriod)
       
    def onEnterOk(self, position):
        execInfo = position.getEntryOrder().getExecutionInfo()
        self.info("BUY at $%.2f" % (execInfo.getPrice()))
        
    def onEnterCanceled(self, position):
        self.__position = None
        
    def onExitOk(self, position):
        execInfo = position.getExitOrder().getExecutionInfo()
        self.info("SELL at $%.2f" % (execInfo.getPrice()))
        self.__position = None
        
    def onExitCanceled(self, position):
        self.__position.exitMarket()
        
    def onBars(self, bars):  #wait for enough bars to be available to calculate SMA
        if self.__sma[-1] is None:
            return 
        
        bar = bars[self.__instrument]  #if a position is not open, checks to see if we should enter a long position
        if self.__position is None:
            if bar.getPrice() > self.__sma[-1]:  #Enter a buy market order for as many shares as the user would like. The order stands until it is canceled
                self.__position = self.enterLong(self.__instrument, longPositionPurchases, True)
        elif bar.getPrice() < self.__sma[-1] and not self.__position.exitActive():
            self.__position.exitMarket()
            
    
def run_strategy(smaPeriod, startingBalance):  #Loads yahoo feed from csv file
    feed = yahoofeed.Feed()
    # feed.addBarsFromCSV("orcl", os.path.abspath(os.path.join(os.pardir, 'machine-learning', 'data', 'json2csv', 'btc_cny.csv')));
    # Azure URL
     feed.addBarsFromCSV("orcl", os.path.abspath(os.path.join(os.pardir, 'wwwroot', 'data', 'json2csv', 'btc_cny.csv')));
    
    #Evalutes strategy by testing it using the feed
    
    TradingStrategy = MyTradingStrategy(feed, "orcl", smaPeriod, startingBalance)
    TradingStrategy.run()
    print "You made: $%.2f" % (TradingStrategy.getBroker().getEquity() - startingBalance)

run_strategy(userSmaDuration, 1000000)

# The Doges of Wall St.

Anyone can do algorithmic trading, no matter their age or experience level. We are democratizing the worldwide financial system, one derivative product at a time.

![Doge](https://i.imgur.com/byi1DAi.png?1)

## How We Did It
1. Scraped data (1 million trades) from [Bter](http://bter.com) (cyrptocoin exchange) API on the CNY/BTC pair
2. Sifted through those records using higher-order array functions to reduce data to daily stats: open, close, high, low, volume
3. Get user parameters for momentum trading algorithm
4. Use momentum trading algorithm (python code) on daily records to determine daily returns
5. Return result to Node.js and present to the user

## Our Inspriration

As a kid, I had grown up reading Michael Lewis's stories about stock market phenomena, and how certain people were able to pick up on the hints that something was a miss, and make a lot of money. I wanted to be like that. For that reason, I would always ask my father if I could open my own brokerage account, so I could be the next Louis Ranieri. Unfortunately, two things stood in my way: the fact that you had to be 18 in order to open an account, and my dad's fear that I would lose all of his money in a bad trade.

I wanted to get firsthand experience of the market trends that Lewis talked about in his book, but my father had a point about me losing his money, I mean, I don't really know what I am doing.

Months go by, and I find myself at HackBCA with my teammate, and in need of an idea. After a lot of searching around for cool projects, we encountered the pyalgotrade library in python. The pyalgotrade library is used to help investors make automated trades, by allowing them to program their trading habits into a program that executes these habits automatically.

We decided to use this library to make a website that would allow investors to test their trading algorithms to see if they would be profitable. Gone are the days of people hopelessly gambling away their money in an effort to see what trades work, and don't at a given moment in time.

Now, simulations are great because they allow the user to see a projected result without having to actually execute the trade, but that does not really help the budding trader who is under the age of 18.

For that reason, we decided to use cryptocurrencies like bitcoin and dogecoin, in an effort to bring the rush of trading to people of all ages. These forms of currency do not require the user to be 18 to trade, so anyone who is interested can do that.

Gone are the days where we have to wait until we are older to experience the things we want to experience now. Inspiration can be fleeting, so to those kids out there that have just finished Flash Boys or Liar's Poker, and want to learn more about the incredibly volatile world of investment banking and trading, the Doges of Wall Street have a solution.

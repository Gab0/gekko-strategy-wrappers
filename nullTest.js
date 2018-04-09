// Gab0 method of stacking strategies.
// two RSI_BULL_BEAR that are consulted depending on SMA result
// this concept is a sample, this is entirely customizable
// RSI_BULL_BEAR by @TommieHansen, sample concept by @BradT7

var _ = require('lodash');
var log = require('../core/log.js');

// all used child strategies are "required"

var method = {};
method.init = function() {

    this.age = 0;

    this.currentTrend;
    this.requiredHistory = 20;

    // this SMA will choose wich RSI_BULL_BEAR will be asked for advice;
    // this is a part of this sample concept and is changeable;


    var STRATEGY = "RSI_BULL_BEAR";


   // here we init child strategies. 
   // take note that each one takes corresponding subdict of this.settings;
   this.TEST = this.createChild(STRATEGY, this.settings);


}


// what happens on every new candle?
method.update = function(candle) {
/*
    this.rsi = this.indicators.rsi.result;
    this.RSIhistory.push(this.rsi);

    if(_.size(this.RSIhistory) > this.interval)
		    // remove oldest RSI value
		    this.RSIhistory.shift();*/

}


method.log = function() {
    // for debugging purposes;;;

}

method.cloneCandle = function(candle) {
//well, some strategies take candle as argument of method.check, some get externally
//as method.candle SOMEHOW; this may be not necessary at all just a reminder - Gab0
return JSON.parse(JSON.stringify(candle));

}


method.check = function(candle) {


    // now our strategy logic of selecting the consultant RBB;
    this.TEST.tick(candle);

    if (this.TEST.lastAdvice)
        this.advice(this.TEST.lastAdvice.recommendation);




    // clear advices for each child strategy!
    this.TEST.lastAdvice = false;

	// and thats it;
}

// BELOW METHODS ARE INNER WORKINGS AND NOT INTERESTING FOR A STRATEGY DESIGNER;
method.createChild = function(stratname, settings) {
    //  REPRODUCE STEPS ON gekko/plugins/tradingAdvisor.js

    var Consultant = require('../plugins/tradingAdvisor/baseTradingMethod');

    var stratMethod = require('./'+stratname+'.js');

    _.each(stratMethod, function(fn, name) {
        Consultant.prototype[name] = fn;
    });

    Consultant.prototype.collectAdvice = function(advice)
    {
        this.lastAdvice = advice;

    }
    var Strategy = new Consultant(settings);

    Strategy.on('advice', Strategy.collectAdvice );

    return Strategy;
}

method.collectAdvice = function(advice)
{
    this.advices.push(advice);
}

module.exports = method;

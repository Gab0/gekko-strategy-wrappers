// Gab0 method of stacking strategies.
// two RSI_BULL_BEAR that are consulted depending on SMA result
// this concept is a sample, this is entirely customizable
// RSI_BULL_BEAR by @TommieHansen, sample concept by @BradT7

var _ = require('lodash');
var log = require('../core/log.js');

var method = {};
method.init = function() {

    this.age = 0;

    this.currentTrend;
    this.requiredHistory = 20;


    var STRATEGY = "RSI_BULL_BEAR";
    this.STRATEGY = this.createChild(STRATEGY, this.settings);

    this.lastVolumesCount = this.settings.lastVolumes;

    this.lastVolumes = [];
}


method.update = function(candle) {

}


method.log = function() {

}

method.cloneCandle = function(candle) {
//well, some strategies take candle as argument of method.check, some get externally
//as method.candle SOMEHOW; this may be not necessary at all just a reminder - Gab0
return JSON.parse(JSON.stringify(candle));

}


method.check = function(candle) {

    this.STRATEGY.tick(candle);

    this.lastVolumes.push(candle.volume);

    if (this.lastVolumes.length > this.lastVolumesCount)
        this.lastVolumes.shift();

    // now our strategy logic of selecting the consultant RBB;
    if (this.STRATEGY.lastAdvice)
    {
        var medianVolumes = this.lastVolumes.reduce(function(a,b){return a+b;},0);
        if (candle.volume > medianVolumes)
            this.advice(this.STRATEGY.lastAdvice.recommendation);

    }



    this.STRATEGY.lastAdvice = false;

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

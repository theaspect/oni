const CYCLE = 600;

function Item() {}
Item.prototype.calculate = function () {
    return {};
}

function Dup() {
}
Dup.prototype = Object.create(Item.prototype);
Dup.prototype.constructor = Dup;

Dup.prototype.calculate = function(){
    return {
        calories: -1000,
        oxygen: -100 * CYCLE,
        carbon_dioxide: 2 * CYCLE,
        // polluted_water: 592 // 1628 1359.6
    }
};

function Base() {
    this.items = [];
};

Base.prototype.merge = function (a, b) {
    const sum = Object.assign(a);
    const bCalc = b.calculate();
    Object.keys(bCalc).forEach(function(k,i) {
        if(!sum[k]) {sum[k] = 0}
        sum[k] += bCalc[k];
    });
    return sum;
};

Base.prototype.calculate = function() {
    return this.items.reduce (this.merge, {});
};

Base.prototype.addDup = function (cnt) {
    for(i=0;i<cnt;i++){
        this.items.push(new Dup());
    }
    return this;
};
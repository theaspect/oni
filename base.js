const CYCLE = 600;

function Elem(mass, temp){
    this.mass = mass
    this.temp = temp
};

Elem.prototype.add = function(add) {
    // In case we don't know temperature of one element we simply ignore it
    if(this.temp == null || add.temp == null) {
        return new Elem(this.mass+add.mass, this.temp || add.temp)
    } else {
        return new Elem(this.mass+add.mass, 
            (this.mass * this.temp + add.mass * add.temp) / this.mass + add.mass
        )
    }
}
Elem.prototype.toString = function() {
    if (this.mass == 0 ){
        return undefined;
    } else if (this.temp == null){
        return "" + (this.mass / 1000) + "kg";
    }else{
        return "" + (this.mass / 1000) + "kg of " + this.temp + "C";
    }
}


function Item() {}
Item.prototype.calculate = function () {
    return {};
}

function Dup() {}
Dup.prototype = Object.create(Item.prototype);
Dup.prototype.constructor = Dup;

Dup.prototype.calculate = function(){
    return {
        calories: -1000,
        oxygen: new Elem(-100 * CYCLE),
        carbon_dioxide: new Elem(2 * CYCLE),
        // polluted_water: 592 // 1628 1359.6
    }
};

function TMP() {}
TMP.prototype = Object.create(Item.prototype);
TMP.prototype.constructor = Dup;

TMP.prototype.calculate = function(){
    return {
    }
};

function AlgaeDeoxydizer() {}
AlgaeDeoxydizer.prototype = Object.create(Item.prototype);
AlgaeDeoxydizer.prototype.constructor = Dup;

AlgaeDeoxydizer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 1.5,
        oxygen: new Elem(500*CYCLE, 30),
        aglae: new Elem(-550*CYCLE)

    }
};

function AlgaeTerrarium() {}
AlgaeTerrarium.prototype = Object.create(Item.prototype);
AlgaeTerrarium.prototype.constructor = Dup;

AlgaeTerrarium.prototype.calculate = function(){
    return {
        polluted_water: new Elem(290.33 * CYCLE, 30),
        oxygen: new Elem(40*CYCLE, 30),
        carbon_dioxide: new Elem(-0.33333*CYCLE),
        aglae: new Elem(-30*CYCLE)
    }
};

function Deodorizer() {}
Deodorizer.prototype = Object.create(Item.prototype);
Deodorizer.prototype.constructor = Dup;

Deodorizer.prototype.calculate = function(){
    return {
        oxygen: new Elem(90 * CYCLE, 46.85),
        polluted_oxygen: new Elem(-100 * CYCLE),
        filtrate: new Elem(-133.33 * CYCLE),
        clay: new Elem(143.33 * CYCLE)
    }
};

function CarbonSkimmer() {}
CarbonSkimmer.prototype = Object.create(Item.prototype);
CarbonSkimmer.prototype.constructor = Dup;

CarbonSkimmer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 1,
        water: new Elem(-1000 * CYCLE),
        polluted_water: new Elem(1000 * CYCLE, 40),
        carbon_dioxide: new Elem(-300 * CYCLE),
    }
};

function Electrolyzer() {}
Electrolyzer.prototype = Object.create(Item.prototype);
Electrolyzer.prototype.constructor = Dup;

Electrolyzer.prototype.calculate = function(){
    return {
        power: 120,
        heat: 1.25,
        water: new Elem(-1000 * CYCLE),
        oxygen: new Elem(888 * CYCLE, 70),
        hydrogen: new Elem(122 * CYCLE, 70)
    }
};

function Base() {
    this.objects = {
        "Dup": Dup,
        "AlgaeDeoxydizer": AlgaeDeoxydizer,
        "AlgaeTerrarium": AlgaeTerrarium,
        "Deodorizer": Deodorizer,
        "CarbonSkimmer": CarbonSkimmer,
        "Electrolyzer": Electrolyzer
    }

    this.items = [];
};

Base.prototype.merge = function (a, b) {
    const sum = Object.assign(a);
    const bCalc = b.calculate();
    Object.keys(bCalc).forEach(function(k) {
        if(bCalc[k] instanceof Elem){
            if(!sum[k]) {sum[k] = new Elem(0)}
            sum[k] = sum[k].add(bCalc[k]);
        }else{
            if(!sum[k]) {sum[k] = 0}
            sum[k] += bCalc[k];
        }
    });
    return sum;
};

Base.prototype.calculate = function() {
    return this.items.reduce (this.merge, {});
};

Base.prototype.addItem = function (item, cnt) {
    const ctor = Object.keys(this.objects).find(function(k){
        return k.toLowerCase() === item.toLowerCase();
    });

    if(ctor == null) {throw new Error("Unknow object " + item + ". Valid are: " + Object.keys(this.objects).join(", "))}

    for(i=0;i<cnt;i++){
        this.items.push(new this.objects[ctor]());
    }
    return this;
};
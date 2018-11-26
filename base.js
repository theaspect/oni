const CYCLE = 600;

function Elem(mass, temp){
    this.mass = mass;
    this.temp = temp;
};

Elem.prototype.add = function(add) {
    // In case we don't know temperature of one element we simply ignore it
    if(this.temp == null || add.temp == null) {
        return new Elem(this.mass+add.mass, this.temp || add.temp)
    } else {
        return new Elem(this.mass+add.mass, 
            (this.mass * this.temp + add.mass * add.temp) / (this.mass + add.mass)
        )
    }
}
Elem.prototype.toString = function() {
    if (this.mass == 0 ){
        return "0 kg";
    } else if (this.mass == Infinity && this.temp == null) {
        return "&infin; kg"
    } else if (this.mass == Infinity && this.temp == null) {
        return "&infin; kg of " + this.temp + "C";
    } else if (this.temp == null){
        return "" + (this.mass / 1000) + " kg";
    }else{
        return "" + (this.mass / 1000) + " kg of " + this.temp + "C";
    }
}


function Item(params) {
    this.params = params || {}
}
Item.prototype.calculate = function () {
    return {};
}

function Supply(elem, mass, temp){
    Item.call(this, {});

    this.elem = elem;
    this.mass = mass;
    this.temp = temp;
};
Supply.prototype = Object.create(Item.prototype);
Supply.prototype.constructor = Supply;

Supply.prototype.calculate = function(){
    const result = {};
    result[this.elem] = new Elem(this.mass, this.temp);
    return result;
}

function Dup(params) {
    Item.call(this, params)
}
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

function TMP(params) {
    Item.call(this, params)
}
TMP.prototype = Object.create(Item.prototype);
TMP.prototype.constructor = Dup;

TMP.prototype.calculate = function(){
    return {
    }
};

/** Oxygen */

function AlgaeDeoxydizer(params) {
    Item.call(this, params)
}
AlgaeDeoxydizer.prototype = Object.create(Item.prototype);
AlgaeDeoxydizer.prototype.constructor = Dup;

AlgaeDeoxydizer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 1.5 * CYCLE,
        oxygen: new Elem(500*CYCLE, 30),
        algae: new Elem(-550*CYCLE)

    }
};

function AlgaeTerrarium(params) {
    Item.call(this, params)
}
AlgaeTerrarium.prototype = Object.create(Item.prototype);
AlgaeTerrarium.prototype.constructor = Dup;

AlgaeTerrarium.prototype.calculate = function(){
    return {
        polluted_water: new Elem(290.33 * CYCLE, 30),
        oxygen: new Elem((this.params["lighted"] ? 44 : 40)*CYCLE, 30),
        carbon_dioxide: new Elem(-0.33333*CYCLE),
        algae: new Elem(-30*CYCLE)
    }
};

function Deodorizer(params) {
    Item.call(this, params)
}
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

function CarbonSkimmer(params) {
    Item.call(this, params)
}
CarbonSkimmer.prototype = Object.create(Item.prototype);
CarbonSkimmer.prototype.constructor = Dup;

CarbonSkimmer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 1 * CYCLE,
        water: new Elem(-1000 * CYCLE),
        polluted_water: new Elem(1000 * CYCLE, 40),
        carbon_dioxide: new Elem(-300 * CYCLE),
    }
};

function Electrolyzer(params) {
    Item.call(this, params)
}
Electrolyzer.prototype = Object.create(Item.prototype);
Electrolyzer.prototype.constructor = Dup;

Electrolyzer.prototype.calculate = function(){
    return {
        power: 120,
        heat: 1.25 * CYCLE,
        water: new Elem(-1000 * CYCLE),
        oxygen: new Elem(888 * CYCLE, 70),
        hydrogen: new Elem(122 * CYCLE, 70)
    }
};

/** Generators */

function ManualGenerator(params) {
    Item.call(this, params)
}
ManualGenerator.prototype = Object.create(Item.prototype);
ManualGenerator.prototype.constructor = Dup;

ManualGenerator.prototype.calculate = function(){
    return {
        power: 400,
        heat: 1 * CYCLE
    }
};

function CoalGenerator(params) {
    Item.call(this, params)
}
CoalGenerator.prototype = Object.create(Item.prototype);
CoalGenerator.prototype.constructor = Dup;

CoalGenerator.prototype.calculate = function(){
    return {
        power : 600,
        heat: 9 * CYCLE,
        carbon_dioxide: new Elem(20 * CYCLE, 36.85),
        coal: new Elem(-1000 * CYCLE)
    }
};

function HydrogenGenerator(params) {
    Item.call(this, params)
}
HydrogenGenerator.prototype = Object.create(Item.prototype);
HydrogenGenerator.prototype.constructor = Dup;

HydrogenGenerator.prototype.calculate = function(){
    return {
        power: 800,
        heat: 4 * CYCLE,
        hydrogen: new Elem(-100 * CYCLE)
    }
};

function NaturalGasGenerator(params) {
    Item.call(this, params)
}
NaturalGasGenerator.prototype = Object.create(Item.prototype);
NaturalGasGenerator.prototype.constructor = Dup;

NaturalGasGenerator.prototype.calculate = function(){
    return {
        power: 800,
        heat: 10 * CYCLE,
        natural_gas: new Elem(-90 * CYCLE),
        polluted_water: new Elem(67.5 * CYCLE, this.params["temp"]||undefined),
        carbon_dioxide: new Elem(22.5 * CYCLE, this.params["temp"]||undefined)
    }
};

function PetroleumGenerator(params) {
    Item.call(this, params)
}
PetroleumGenerator.prototype = Object.create(Item.prototype);
PetroleumGenerator.prototype.constructor = Dup;

PetroleumGenerator.prototype.calculate = function(){
    return {
        power: 2000,
        heat: 20 * CYCLE,
        polluted_water: new Elem(750 * CYCLE, this.params["temp"]||undefined),
        petroleum: new Elem(-2000 * CYCLE),
        carbon_dioxide: new Elem(500 * CYCLE, this.params["temp"]||undefined)
    }
};

function SteamTurbine(params) {
    Item.call(this, params)
}
SteamTurbine.prototype = Object.create(Item.prototype);
SteamTurbine.prototype.constructor = Dup;

SteamTurbine.prototype.calculate = function(){
    return {
        power: 2000,
        // steam: 10000 delta temp -151.85C
    }
};

function SolarPower(params) {
    Item.call(this, params)
}
SolarPower.prototype = Object.create(Item.prototype);
SolarPower.prototype.constructor = Dup;

SolarPower.prototype.calculate = function(){
    return {
        power: 380
    }
};

/** Power */

function TinyBattery(params) {
    Item.call(this, params)
}
TinyBattery.prototype = Object.create(Item.prototype);
TinyBattery.prototype.constructor = Dup;

TinyBattery.prototype.calculate = function(){
    return {
        heat: 1.25 * CYCLE
    }
};

function Battery(params) {
    Item.call(this, params)
}
Battery.prototype = Object.create(Item.prototype);
Battery.prototype.constructor = Dup;

Battery.prototype.calculate = function(){
    return {
        heat: 1.25 * CYCLE
    }
};

function SmartBattery(params) {
    Item.call(this, params)
}
SmartBattery.prototype = Object.create(Item.prototype);
SmartBattery.prototype.constructor = Dup;

SmartBattery.prototype.calculate = function(){
    return {
        heat: 0.5 * CYCLE
    }
};

function SmallPowerTransformer(params) {
    Item.call(this, params)
}
SmallPowerTransformer.prototype = Object.create(Item.prototype);
SmallPowerTransformer.prototype.constructor = Dup;

SmallPowerTransformer.prototype.calculate = function(){
    return {
        heat: 1 * CYCLE
    }
};

function PowerTransformer(params) {
    Item.call(this, params)
}
PowerTransformer.prototype = Object.create(Item.prototype);
PowerTransformer.prototype.constructor = Dup;

PowerTransformer.prototype.calculate = function(){
    return {
        heat: 1 * CYCLE
    }
};

/** Base */

function Base() {
    this.keywords = ["Supply"];
    this.flags = ["lighted"];
    this.properties = ["temp", "mass"];

    this.elements = [
        "algae",
        "calories",
        "carbon_dioxide",
        "coal",
        "hydrogen",
        "natural_gas",
        "oxygen",
        "petroleum",
        "polluted_oxygen",
        "polluted_water",
        "water",
        "filtrate",
        "clay"
    ];

    this.objects = {
        "Dup": Dup,

        "AlgaeDeoxydizer": AlgaeDeoxydizer,
        "AlgaeTerrarium": AlgaeTerrarium,
        "Deodorizer": Deodorizer,
        "CarbonSkimmer": CarbonSkimmer,
        "Electrolyzer": Electrolyzer,

        "ManualGenerator" : ManualGenerator,
        "CoalGenerator" : CoalGenerator,
        "HydrogenGenerator" : HydrogenGenerator,
        "NaturalGasGenerator" : NaturalGasGenerator,
        "PetroleumGenerator" : PetroleumGenerator,
        "SteamTurbine" : SteamTurbine,
        "SolarPower" : SolarPower,

        "TinyBattery" : TinyBattery,
        "Battery" : Battery,
        "SmartBattery" : SmartBattery,
        "SmallPowerTransformer" : SmallPowerTransformer,
        "PowerTransformer" : PowerTransformer
    }

    this.items = [];
    this.supplies = [];
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
    let result = this.items.reduce (this.merge, {});
    return result;
};

Base.prototype.addItem = function (item, cnt, params) {
    const ctor = Object.keys(this.objects).find(function(k){
        return k.toLowerCase() === item.toLowerCase();
    });

    if(ctor == null) {throw new Error("Unknow object " + item + ". Valid are: " + Object.keys(this.objects).join(", "))}

    for(i=0;i<cnt;i++){
        this.items.push(new this.objects[ctor](params));
    }
    return this;
};

Base.prototype.addSupply = function (item, params) {
    this.items.push(new Supply(item, params["mass"] || Infinity, params["temp"]));
}
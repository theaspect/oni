const CYCLE = 600;

(function() {
    /**
     * https://developer.mozilla.org/ru/docs/Web/JavaScript/Reference/Global_Objects/Math/round
     * Корректировка округления десятичных дробей.
     *
     * @param {String}  type  Тип корректировки.
     * @param {Number}  value Число.
     * @param {Integer} exp   Показатель степени (десятичный логарифм основания корректировки).
     * @returns {Number} Скорректированное значение.
     */
    function decimalAdjust(type, value, exp) {
        // Если степень не определена, либо равна нулю...
        if (typeof exp === 'undefined' || +exp === 0) {
        return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // Если значение не является числом, либо степень не является целым числом...
        if (isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
        return NaN;
        }
        // Сдвиг разрядов
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Обратный сдвиг
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Десятичное округление к ближайшему
    if (!Math.round10) {
        Math.round10 = function(value, exp) {
        return decimalAdjust('round', value, exp);
        };
    }
    // Десятичное округление вниз
    if (!Math.floor10) {
        Math.floor10 = function(value, exp) {
        return decimalAdjust('floor', value, exp);
        };
    }
    // Десятичное округление вверх
    if (!Math.ceil10) {
        Math.ceil10 = function(value, exp) {
        return decimalAdjust('ceil', value, exp);
        };
    }
})();

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
        return "&infin; kg of " + Math.round10(this.temp, -2) + "C";
    } else if (this.temp == null){
        return "" + Math.round10(this.mass / 1000, -2) + " kg";
    }else{
        return "" + Math.round10(this.mass / 1000, -2) + " kg of " + Math.round10(this.temp, -2) + "C";
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

function Food(food){
    Item.call(this, {});

    this.food = food;
};
Food.prototype = Object.create(Item.prototype);
Food.prototype.constructor = Supply;

Food.prototype.calculate = function(){
    return this.food;
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

/** Food by default calculat as planted */

function Mealwood(params) {
    Item.call(this, params)
}
Mealwood.prototype = Object.create(Item.prototype);
Mealwood.prototype.constructor = Dup;

Mealwood.prototype.calculate = function(){
    return {
        "dirt": new Elem(-10000),
        "meal_lice": 1/3
    }
};

function DuskCap(params) {
    Item.call(this, params)
}
DuskCap.prototype = Object.create(Item.prototype);
DuskCap.prototype.constructor = Dup;

DuskCap.prototype.calculate = function(){
    return {
        "slime": new Elem(-4000),
        "mushroom": 1/7.5
    }
};

function BristleBlossom(params) {
    Item.call(this, params)
}
BristleBlossom.prototype = Object.create(Item.prototype);
BristleBlossom.prototype.constructor = Dup;

BristleBlossom.prototype.calculate = function(){
    return {
        "water": new Elem(-20000),
        "bristle_berry": 1/6
    }
};

function SleetWheat(params) {
    Item.call(this, params)
}
SleetWheat.prototype = Object.create(Item.prototype);
SleetWheat.prototype.constructor = Dup;

SleetWheat.prototype.calculate = function(){
    return {
        "water": new Elem(-20000),
        "dirt": new Elem(-5000),
        "sleet_wheat_grain": 18/18
    }
};

function PinchaPepper(params) {
    Item.call(this, params)
}
PinchaPepper.prototype = Object.create(Item.prototype);
PinchaPepper.prototype.constructor = Dup;

PinchaPepper.prototype.calculate = function(){
    return {
        "pincha_peppernut": 4/8,
        "polluted_water": new Elem(-35000),
        "phosphorite": new Elem(-1000)
    }
};

function BalmLily(params) {
    Item.call(this, params)
}
BalmLily.prototype = Object.create(Item.prototype);
BalmLily.prototype.constructor = Dup;

BalmLily.prototype.calculate = function(){
    return {
        "balm_lily_flower": 2/12
    }
};

function ThimbleReed(params) {
    Item.call(this, params)
}
ThimbleReed.prototype = Object.create(Item.prototype);
ThimbleReed.prototype.constructor = Dup;

ThimbleReed.prototype.calculate = function(){
    return {
        "reed_fiber": 1/2,
        "polluted_water": new Elem(-160000)
    }
};

/** Base */

function Base() {
    this.keywords = ["Supply", "Cook"];
    this.flags = ["lighted"];
    this.properties = ["temp"];

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

    this.food = {
        // Raw
        "meal_lice": {
            "calories": 600
        },
        "mushroom": {
            "calories": 2400
        },
        "bristle_berry": {
            "calories": 1600
        },
        "sleet_wheat_grain": {},
        "pincha_peppernut": {},
        "balm_lily_flower": {},
        "reed_fiber": {},
        "meat": {
            "calories": 1600 // per 1000g
        },
        // Microbe musher
        "mush_bar":{
            "dirt": new Elem(75,000),
            "water": new Elem(75,000),
            "calories": 800
        },
        "berry_sludge":{
            "sleet_wheat_grain": -5,
            "bristle_berry": -1,
            "calories": 4000
        },
        "lice_loaf":{
            "meal_lice": -2,
            "water": new Elem(-50,000),
            "calories": 1700
        },
        // Electric Grill
        "pickled_meal":{
            "meal_lice": -3,
            "calories": 1800
        },
        "mush_fly":{
            "mush_bar": -1,
            "calories": 1050
        },
        "fried_mushroom":{
            "mushroom": -1,
            "calories": 2800
        },
        "gristle_berry":{
            "bristle_berry": -1,
            "calories": 2000
        },
        "frost_bun":{
            "sleet_wheat_grain": -3,
            "calories": 1200
        },
        "omelette":{
            "raw_egg": -1000,
            "calories": 2800
        },
        "stuffed_berry":{
            "bristle_berry": -2,
            "pincha_peppernut": -2000,
            "calories": 4000
        },
        "bbq":{
            "meat": -2,
            "pincha_peppernut": -1000,
            "calories": 4000
        },
        "pepper_bread":{
            "sleet_wheat_grain": -10,
            "pincha_peppernut": -1000,
            "calories": 4000
        }
    };

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
        "PowerTransformer" : PowerTransformer,

        "Mealwood": Mealwood,
        "DuskCap": DuskCap,
        "BristleBlossom": BristleBlossom,
        "SleetWheat": SleetWheat,
        "PinchaPepper": PinchaPepper,
        "BalmLily": BalmLily,
        "ThimbleReed": ThimbleReed,
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

Base.prototype.addSupply = function (item, amount, params) {
    this.items.push(new Supply(item, amount || Infinity, params["temp"]));
    return this;
}

Base.prototype.addFood = function (item, cnt) {
    for(i=0;i<cnt;i++){
        this.items.push(new Food(this.food[item], cnt));
    }
    return this;
}
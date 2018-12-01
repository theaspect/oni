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
    } else if (this.mass == Infinity && this.temp != null) {
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

function Energy(kdtu){
    Item.call(this, {});

    this.kdtu = kdtu;
};
Energy.prototype = Object.create(Item.prototype);
Energy.prototype.constructor = Energy;

Energy.prototype.calculate = function(){
    const result = {
        energy: this.kdtu * 1000
    };
    return result;
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
Food.prototype.constructor = Food;

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
TMP.prototype.constructor = TMP;

TMP.prototype.calculate = function(){
    return {
    }
};

/** Oxygen */

function AlgaeDeoxydizer(params) {
    Item.call(this, params)
}
AlgaeDeoxydizer.prototype = Object.create(Item.prototype);
AlgaeDeoxydizer.prototype.constructor = AlgaeDeoxydizer;

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
AlgaeTerrarium.prototype.constructor = AlgaeTerrarium;

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
Deodorizer.prototype.constructor = Deodorizer;

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
CarbonSkimmer.prototype.constructor = CarbonSkimmer;

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
Electrolyzer.prototype.constructor = Electrolyzer;

Electrolyzer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 1.25 * CYCLE,
        water: new Elem(-1000 * CYCLE),
        oxygen: new Elem(888 * CYCLE, 70),
        hydrogen: new Elem(122 * CYCLE, 70)
    }
};

/** Refinement */

function Compost(params) {
    Item.call(this, params)
}
Compost.prototype = Object.create(Item.prototype);
Compost.prototype.constructor = Compost;

Compost.prototype.calculate = function(){
    return {
        heat: 1.125 * CYCLE,
        polluted_dirt: new Elem(-100*CYCLE),
        dirt: new Elem(100*CYCLE, 75)
    }
};

function WaterSieve(params) {
    Item.call(this, params)
}
WaterSieve.prototype = Object.create(Item.prototype);
WaterSieve.prototype.constructor = WaterSieve;

WaterSieve.prototype.calculate = function(){
    return {
        power: -120,
        heat: 4 * CYCLE,
        filtrate: new Elem(-1000 * CYCLE),
        polluted_water: new Elem(-5000 * CYCLE),
        water: new Elem(5000 * CYCLE, 40),
        polluted_dirt: new Elem(200 * CYCLE, 40)
    }
};

function AlgaeDistillizer(params) {
    Item.call(this, params)
}
AlgaeDistillizer.prototype = Object.create(Item.prototype);
AlgaeDistillizer.prototype.constructor = AlgaeDistillizer;

AlgaeDistillizer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 1.5 * CYCLE,
        slime: new Elem(-600 * CYCLE, 30),
        polluted_water: new Elem(400 * CYCLE, 30),
        algae: new Elem(200 * CYCLE, 30)
    }
};

function FertilizerSynthesizer(params) {
    Item.call(this, params)
}
FertilizerSynthesizer.prototype = Object.create(Item.prototype);
FertilizerSynthesizer.prototype.constructor = FertilizerSynthesizer;

FertilizerSynthesizer.prototype.calculate = function(){
    return {
        power: -120,
        heat: 3 * CYCLE,
        polluted_water: new Elem(-39 * CYCLE),
        dirt: new Elem(-65 * CYCLE),
        phosphorite: new Elem(-26 * CYCLE),
        natural_gas: new Elem(10 * CYCLE, 50),
        fertilizer: new Elem(120 * CYCLE, 29.85)
    }
};

function OilRefinery(params) {
    Item.call(this, params)
}
OilRefinery.prototype = Object.create(Item.prototype);
OilRefinery.prototype.constructor = OilRefinery;

OilRefinery.prototype.calculate = function(){
    return {
        power: -480,
        heat: 10 * CYCLE,
        crude_oil: new Elem(-10000 * CYCLE),
        petroleum: new Elem(5000 * CYCLE, 75),
        natural_gas: new Elem(90 * CYCLE, 75) //???
    }
};

function PolymerPress(params) {
    Item.call(this, params)
}
PolymerPress.prototype = Object.create(Item.prototype);
PolymerPress.prototype.constructor = PolymerPress;

PolymerPress.prototype.calculate = function(){
    return {
        power: -240,
        heat: 32.5 * CYCLE,

        petroleum: new Elem(-833.33 * CYCLE),
        plastic: new Elem(500 * CYCLE, 75),
        steam: new Elem(8.33 * CYCLE, 200),
        carbon_dioxide: new Elem(8.33 * CYCLE, 150)
    }
};

/** Generators */

function ManualGenerator(params) {
    Item.call(this, params)
}
ManualGenerator.prototype = Object.create(Item.prototype);
ManualGenerator.prototype.constructor = ManualGenerator;

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
CoalGenerator.prototype.constructor = CoalGenerator;

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
HydrogenGenerator.prototype.constructor = HydrogenGenerator;

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
NaturalGasGenerator.prototype.constructor = NaturalGasGenerator;

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
PetroleumGenerator.prototype.constructor = PetroleumGenerator;

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
SteamTurbine.prototype.constructor = SteamTurbine;

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
SolarPower.prototype.constructor = SolarPower;

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
TinyBattery.prototype.constructor = TinyBattery;

TinyBattery.prototype.calculate = function(){
    return {
        heat: 1.25 * CYCLE
    }
};

function Battery(params) {
    Item.call(this, params)
}
Battery.prototype = Object.create(Item.prototype);
Battery.prototype.constructor = Battery;

Battery.prototype.calculate = function(){
    return {
        heat: 1.25 * CYCLE
    }
};

function SmartBattery(params) {
    Item.call(this, params)
}
SmartBattery.prototype = Object.create(Item.prototype);
SmartBattery.prototype.constructor = SmartBattery;

SmartBattery.prototype.calculate = function(){
    return {
        heat: 0.5 * CYCLE
    }
};

function SmallPowerTransformer(params) {
    Item.call(this, params)
}
SmallPowerTransformer.prototype = Object.create(Item.prototype);
SmallPowerTransformer.prototype.constructor = SmallPowerTransformer;

SmallPowerTransformer.prototype.calculate = function(){
    return {
        heat: 1 * CYCLE
    }
};

function PowerTransformer(params) {
    Item.call(this, params)
}
PowerTransformer.prototype = Object.create(Item.prototype);
PowerTransformer.prototype.constructor = PowerTransformer;

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
Mealwood.prototype.constructor = Mealwood;

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
DuskCap.prototype.constructor = DuskCap;

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
BristleBlossom.prototype.constructor = BristleBlossom;

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
SleetWheat.prototype.constructor = SleetWheat;

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
PinchaPepper.prototype.constructor = PinchaPepper;

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
BalmLily.prototype.constructor = BalmLily;

BalmLily.prototype.calculate = function(){
    return {
        "balm_lily_flower": 2/12
    }
};

function ThimbleReed(params) {
    Item.call(this, params)
}
ThimbleReed.prototype = Object.create(Item.prototype);
ThimbleReed.prototype.constructor = ThimbleReed;

ThimbleReed.prototype.calculate = function(){
    return {
        "reed_fiber": 1/2,
        "polluted_water": new Elem(-160000)
    }
};

/** Geysers */

function Geyser(params) {
    Item.call(this, params || {});

    this.yield_gramm = params["yield_gramm"];

    this.eruption_seconds = params["eruption_seconds"];
    this.every_seconds = params["every_seconds"];

    this.activity_cycles = params["activity_cycles"];
    this.every_cycles = params["every_cycles"];
}
Geyser.prototype = Object.create(Item.prototype);
Geyser.prototype.constructor = Geyser;

Geyser.prototype.get_yield = function(){
    if (this.yield_gramm == null || this.yield_gramm == 0){
        return 0;
    } else {
        if (this.eruption_seconds == null || this.every_seconds == null || 
            this.eruption_seconds == 0 || this.every_seconds == 0) {
            return this.yield_gramm * CYCLE;
        } else {
            if (this.activity_cycles == null || this.every_cycles == null || 
                this.activity_cycles == 0 || this.every_cycles == 0) {
                return this.yield_gramm * CYCLE * 
                    (this.eruption_seconds / this.every_seconds);
            } else {
                return this.yield_gramm * CYCLE * 
                    (this.eruption_seconds / this.every_seconds) * 
                    (this.activity_cycles / this.every_cycles);
            }
        }
        
    }
};

function CoolSteamVent(params) {
    Geyser.call(this, params);
}

CoolSteamVent.prototype = Object.create(Geyser.prototype);
CoolSteamVent.prototype.constructor = CoolSteamVent;

CoolSteamVent.prototype.calculate = function() {
    return {
        "steam": new Elem(this.get_yield(), 110)
    }
}

function SteamVent(params) {
    Geyser.call(this, params);
}

SteamVent.prototype = Object.create(Geyser.prototype);
SteamVent.prototype.constructor = SteamVent;

SteamVent.prototype.calculate = function() {
    return {
        "steam": new Elem(this.get_yield(), 500)
    }
}

function WaterGeyser(params) {
    Geyser.call(this, params);
}

WaterGeyser.prototype = Object.create(Geyser.prototype);
WaterGeyser.prototype.constructor = WaterGeyser;

WaterGeyser.prototype.calculate = function() {
    return {
        "water": new Elem(this.get_yield(), 95)
    }
}

function CoolSlushGeyser(params) {
    Geyser.call(this, params);
}

CoolSlushGeyser.prototype = Object.create(Geyser.prototype);
CoolSlushGeyser.prototype.constructor = CoolSlushGeyser;

CoolSlushGeyser.prototype.calculate = function() {
    return {
        "polluted_water": new Elem(this.get_yield(), -10)
    }
}

function PollutedWaterVent(params) {
    Geyser.call(this, params);
}

PollutedWaterVent.prototype = Object.create(Geyser.prototype);
PollutedWaterVent.prototype.constructor = PollutedWaterVent;

PollutedWaterVent.prototype.calculate = function() {
    return {
        "polluted_water": new Elem(this.get_yield(), 30)
    }
}

function MinorVolcano(params) {
    Geyser.call(this, params);
}

MinorVolcano.prototype = Object.create(Geyser.prototype);
MinorVolcano.prototype.constructor = MinorVolcano;

MinorVolcano.prototype.calculate = function() {
    return {
        "magma": new Elem(this.get_yield(), 1726.85)
    }
}

function Volcano(params) {
    Geyser.call(this, params);
}

Volcano.prototype = Object.create(Geyser.prototype);
Volcano.prototype.constructor = Volcano;

Volcano.prototype.calculate = function() {
    return {
        "magma": new Elem(this.get_yield(), 1726.85)
    }
}

function CarbonDioxideGeyser(params) {
    Geyser.call(this, params);
}

CarbonDioxideGeyser.prototype = Object.create(Geyser.prototype);
CarbonDioxideGeyser.prototype.constructor = CarbonDioxideGeyser;

CarbonDioxideGeyser.prototype.calculate = function() {
    return {
        "carbon_dioxide_liquid": new Elem(this.get_yield(), -55.15)
    }
}

function CarbonDioxideVent(params) {
    Geyser.call(this, params);
}

CarbonDioxideVent.prototype = Object.create(Geyser.prototype);
CarbonDioxideVent.prototype.constructor = CarbonDioxideVent;

CarbonDioxideVent.prototype.calculate = function() {
    return {
        "carbon_dioxide": new Elem(this.get_yield(), 500)
    }
}

function HydrogenVent(params) {
    Geyser.call(this, params);
}

HydrogenVent.prototype = Object.create(Geyser.prototype);
HydrogenVent.prototype.constructor = HydrogenVent;

HydrogenVent.prototype.calculate = function() {
    return {
        "hydrogen": new Elem(this.get_yield(), 500)
    }
}

function HotPollutedOxygenVent(params) {
    Geyser.call(this, params);
}

HotPollutedOxygenVent.prototype = Object.create(Geyser.prototype);
HotPollutedOxygenVent.prototype.constructor = HotPollutedOxygenVent;

HotPollutedOxygenVent.prototype.calculate = function() {
    return {
        "polluted_oxygen": new Elem(this.get_yield(), 500)
    }
}

function InfectiousPollutedOxygenVent(params) {
    Geyser.call(this, params);
}

InfectiousPollutedOxygenVent.prototype = Object.create(Geyser.prototype);
InfectiousPollutedOxygenVent.prototype.constructor = InfectiousPollutedOxygenVent;

InfectiousPollutedOxygenVent.prototype.calculate = function() {
    return {
        "polluted_oxygen": new Elem(this.get_yield(), 60)
    }
}

function ChlorineGasVent(params) {
    Geyser.call(this, params);
}

ChlorineGasVent.prototype = Object.create(Geyser.prototype);
ChlorineGasVent.prototype.constructor = ChlorineGasVent;

ChlorineGasVent.prototype.calculate = function() {
    return {
        "chlorine": new Elem(this.get_yield(), 60)
    }
}

function NaturalGasGeyser(params) {
    Geyser.call(this, params);
}

NaturalGasGeyser.prototype = Object.create(Geyser.prototype);
NaturalGasGeyser.prototype.constructor = NaturalGasGeyser;

NaturalGasGeyser.prototype.calculate = function() {
    return {
        "natural_gas": new Elem(this.get_yield(), 150)
    }
}

function CopperVolcano(params) {
    Geyser.call(this, params);
}

CopperVolcano.prototype = Object.create(Geyser.prototype);
CopperVolcano.prototype.constructor = CopperVolcano;

CopperVolcano.prototype.calculate = function() {
    return {
        "copper_liquid": new Elem(this.get_yield(), 2226.85)
    }
}

function IronVolcano(params) {
    Geyser.call(this, params);
}

IronVolcano.prototype = Object.create(Geyser.prototype);
IronVolcano.prototype.constructor = IronVolcano;

IronVolcano.prototype.calculate = function() {
    return {
        "iron_liquid": new Elem(this.get_yield(), 2526.85)
    }
}

function GoldVolcano(params) {
    Geyser.call(this, params);
}

GoldVolcano.prototype = Object.create(Geyser.prototype);
GoldVolcano.prototype.constructor = GoldVolcano;

GoldVolcano.prototype.calculate = function() {
    return {
        "gold_liquid": new Elem(this.get_yield(), 2626.85)
    }
}

function LeakyOilFissure(params) {
    Geyser.call(this, params);
}

LeakyOilFissure.prototype = Object.create(Geyser.prototype);
LeakyOilFissure.prototype.constructor = LeakyOilFissure;

LeakyOilFissure.prototype.calculate = function() {
    return {
        "crude_oil": new Elem(this.get_yield(), 326.85)
    }
}

/** Special */
function AntiEntropyThermoNullifier (params) {
    Item.call(params);
}

AntiEntropyThermoNullifier.prototype = Object.create(Item.prototype);
AntiEntropyThermoNullifier.prototype.constructor = AntiEntropyThermoNullifier;

AntiEntropyThermoNullifier.prototype.calculate = function() {
    return {
        "hydrogen": new Elem(-10 * CYCLE),
        "heat": -80 * CYCLE
    }
}

/** Base */

function Base() {
    this.items = [];
    this.heatSink = null;
};

Base.prototype.keywords = ["Supply", "Cook", "HeatSink", "Energy"];
Base.prototype.flags = ["lighted"];
Base.prototype.properties = ["temp",
    "yield_gramm", "eruption_seconds", "every_seconds", "activity_cycles", "every_cycles"];

// (DTU/g)/°C
Base.prototype.elements = {
    "algae" : 0.2,
    "calories": 0,
    "carbon_dioxide": 0.846,
    "carbon_dioxide_liquid": 0.846,
    "chlorine": 0.48,
    "clay": 0.92,
    "coal": 0.710,
    "copper_liquid": 0.386,
    "crude_oil": 1.69,
    "fertilizer": 0.83,
    "filtrate": 0,
    "gold_liquid": 0.129,
    "hydrogen": 2.4,
    "iron_liquid": 0.449,
    "magma": 1,
    "natural_gas": 2.191,
    "oxygen": 1.005,
    "petroleum": 1.76,
    "plastic": 1.92,
    "polluted_oxygen": 1.01,
    "polluted_water": 4.179,
    "steam": 4.179,
    "water": 4.179
};

Base.prototype.food = this.food = {
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

Base.prototype.objects = {
    "Dup": Dup,

    "AlgaeDeoxydizer": AlgaeDeoxydizer,
    "AlgaeTerrarium": AlgaeTerrarium,
    "Deodorizer": Deodorizer,
    "CarbonSkimmer": CarbonSkimmer,
    "Electrolyzer": Electrolyzer,

    "Compost": Compost,
    "FertilizerSynthesizer": FertilizerSynthesizer,
    "WaterSieve": WaterSieve,
    "AlgaeDistillizer": AlgaeDistillizer,
    "OilRefinery": OilRefinery,
    "PolymerPress": PolymerPress,

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

    "CoolSteamVent": CoolSteamVent,
    "SteamVent": SteamVent,
    "WaterGeyser": WaterGeyser,
    "CoolSlushGeyser": CoolSlushGeyser,
    "PollutedWaterVent": PollutedWaterVent,
    "MinorVolcano": MinorVolcano,
    "Volcano": Volcano,
    "CarbonDioxideGeyser": CarbonDioxideGeyser,
    "CarbonDioxideVent": CarbonDioxideVent,
    "HydrogenVent": HydrogenVent,
    "HotPollutedOxygenVent": HotPollutedOxygenVent,
    "InfectiousPollutedOxygenVent": InfectiousPollutedOxygenVent,
    "ChlorineGasVent": ChlorineGasVent,
    "NaturalGasGeyser": NaturalGasGeyser,
    "CopperVolcano": CopperVolcano,
    "IronVolcano": IronVolcano,
    "GoldVolcano": GoldVolcano,
    "LeakyOilFissure": LeakyOilFissure,

    "AntiEntropyThermoNullifier": AntiEntropyThermoNullifier
};

Base.prototype.merge = function (a, b) {
    const sum = Object.assign(a);
    const bCalc = b.calculate();

    Object.keys(bCalc).forEach(function(k) {
        if(bCalc[k] instanceof Elem){

            // Calculate energy balance
            if(sum[k] && sum[k].temp != null && bCalc[k].mass > 0 && bCalc[k].temp != null){
                // Adding energy, took new temperature
                sum.energy += bCalc[k].temp * bCalc[k].mass * Base.prototype.elements[k];
            }else if(sum[k] && sum[k].temp != null && bCalc[k].mass < 0 && bCalc[k].temp == null){
                // Removing energy ignoring temperature, just took temperature we have
                sum.energy += sum[k].temp * bCalc[k].mass * Base.prototype.elements[k];
            }

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
    let result = this.items.reduce (this.merge, {energy: 0});

    if(result["heat"] != null || result["energy"]!=null){
        result["balance"] = `total energy balance ${Math.round10((result["heat"] || 0) + (result["energy"] || 0)/1000, -2)} kDtu`
    }

    // Try to sink to current element
    if(this.heatSink && this.heatSink.elem != null && this.heatSink.mass == null){
        this.heatSink.mass = result[this.heatSink.elem].mass;
        this.heatSink.temp = result[this.heatSink.elem].temp;
    }

    if(result["balance"] && this.heatSink && this.heatSink.elem != null && 
        this.heatSink.mass != null){
        const balance = (result["heat"] || 0) * 1000 + (result["energy"] || 0);

        // Heat value is in kDtu but elements value is dtu/g/C
        const delta = balance / (this.elements[this.heatSink.elem] * this.heatSink.mass)
        const mass = this.heatSink.mass == Infinity ? "&infin;" : Math.round10(this.heatSink.mass/1000, -2);
        if(this.heatSink.temp != null){
            result.sink = `${Math.round10(balance/1000, -2)} kDtu sinked to ${mass}kg of ${this.heatSink.elem} will change temp from ${Math.round10(this.heatSink.temp,-2)}C to ${Math.round10(this.heatSink.temp + delta, -2)}C`
        }else{
            result.sink = `${Math.round10(balance/1000, -2)} kDtu sinked to ${mass}kg of ${this.heatSink.elem} will change temp for ${Math.round10(delta, -2)}C`
        }
    }

    if(result["energy"]){
        result.energy = `system ${result["energy"]>0?"added":"removed"} ${Math.round10(Math.abs(result["energy"]/1000), -2)} kDtu of energy`
    }else{
        delete result.energy
    }

    if(result["heat"]){
        result.heat = `${result["heat"]} kDtu of energy from devices`
    }else{
        delete result.heat
    }

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

Base.prototype.addHeatSink = function (item, amount, params) {
    this.heatSink = new Supply(item, amount, params["temp"]);
    return this;
}

Base.prototype.addFood = function (item, cnt) {
    for(i=0;i<cnt;i++){
        this.items.push(new Food(this.food[item], cnt));
    }
    return this;
}

Base.prototype.addEnergy = function(kdtu) {
    this.items.push(new Energy(kdtu));
    return this;
}
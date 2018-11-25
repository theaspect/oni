{
    function toNumber(s) {
        return parseInt(s, 10);
    }
    
    function getOrDefault(v, dflt){
        return (v !== null && v !== undefined) ? v : dflt;
    }

    const base = new Base();
}

Expression = objects: (
	Dup
    ) *
    {
    return base.calculate();
    }

Dup = count: (Square / Number)? _ "Dup"i
    { return base.addDup(getOrDefault(count, 1))}

Square = first:Number _ [x*] _ second:Number
    { return first * second }

Number = _ [0-9]+ 
    { return toNumber(text()) }

_ "whitespace"
  = [ \t\n\r]*
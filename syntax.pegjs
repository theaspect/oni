{
    function toNumber(s) {
        return parseInt(s, 10);
    }
    
    function getOrDefault(v, dflt){
        return (v !== null && v !== undefined) ? v : dflt;
    }

    const base = new Base();
}

Expression = objects: _ (
	    Object
    ) * _ { return base.calculate(); }
    

Object = count: (Square / Number)? _ item: String
    {
        try{
            return base.addItem(item, getOrDefault(count, 1));
        }catch(e){
            error(e.message);
        }
    }

Square = first:Number _ [x*] _ second:Number
    { return first * second }

Number = _ [0-9]+ 
    { return toNumber(text()) }

String = _ [a-zA-Z]+
    { return text() }

_ "whitespace"
  = [ \t\n\r]*
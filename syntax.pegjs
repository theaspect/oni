// TODO add tracer to predicates
// TODO add example for predicates

{
    function toNumber(s) {
        return parseInt(s, 10);
    }
    
    function getOrDefault(v, dflt){
        return (v !== null && v !== undefined) ? v : dflt;
    }

    const base = new Base();
}


Expression = NL* Object (NL Object)* NL?
	{ return base.calculate(); }
    

Object = count: (Square / Number)? _ item: String _ params: (Property / Flag)* _
    & {
        return Object.keys(base.objects).includes(item);
    }
    {
        try{
            return base.addItem(item, getOrDefault(count, 1), Object.assign({}, ...params));
        }catch(e){
            error(e.message);
        }
    }

Property = property:String _ "=" _ value:Float
    &{
        return base.properties.includes(property)
    }
    {
        const result = {}
        result[property] = value;
        return result;
    }

Flag = flag:String 
    &{
        return base.flags.includes(flag)
    }
    {
        const result = {}
        result[flag] = true;
        return result;
    }

Square = first:Number _ [x*] _ second:Number
    { return first * second }

Float = ("-"? [0-9]+ "."? [0-9]*)
    { return parseFloat(text()) }

Number = _ [0-9]+ 
    { return parseInt(text()) }

String = _ [a-zA-Z]+
    { return text() }

_ "whitespace"
  = [ \t]*

NL = [\n\r]+
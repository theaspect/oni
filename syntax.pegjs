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

Start = NL* Expression (NL Expression)* NL?
	{ return base.calculate(); }

Expression = 
    Supply
    / Object

Object "Object" = count: (Square / Number)? _ item: ObjectName _ params: (_ Property / Flag)* _
    {
        try{
            return base.addItem(item, getOrDefault(count, 1), Object.assign({}, ...params.map((e) => e[1])));
        }catch(e){
            error(e.message);
        }
    }

ObjectName "Object name" = item: String
    & {
        return Object.keys(base.objects).includes(item);
    }
    {
        return text();
    }

Supply "Supply" = "Supply"i _ element: Element _ params: (_ Property / Flag)* _
    {
        try{
            return base.addSupply(element, Object.assign({}, ...params.map((e) => e[1])));
        }catch(e){
            error(e.message);
        }
    }

Element "Element" = element: String
    & {
        return base.elements.includes(element);
    }
    {
        return text();
    }

Property = property:PropertyName _ "=" _ value:Float
    {
        const result = {}
        result[property] = value;
        return result;
    }

PropertyName "Property" = property:String
    &{
        return base.properties.includes(property)
    }
    {
        return text()
    }

Flag "Flag" = flag:String 
    &{
        return base.flags.includes(flag)
    }
    {
        const result = {}
        result[flag] = true;
        return result;
    }

Square "Square" = first:Number _ [x*] _ second:Number
    { return first * second }

Float "Float" = ("-"? [0-9]+ "."? [0-9]*)
    { return parseFloat(text()) }

Number "Integer" = _ [0-9]+ 
    { return parseInt(text()) }

String = [a-zA-Z_]+
    { return text() }

_ "whitespace" = [ \t]*

NL "New Line" = [\n\r]+
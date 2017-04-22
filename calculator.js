var Calculator = function(inputString){
	this.tokenStream = this.lexer(inputString);

}

Calculator.prototype.peek = function(){
return this.tokenStream[0] || null
}

Calculator.prototype.get = function(){
return this.tokenStream.shift()
}

Calculator.prototype.lexer = function(input){
	var tokenTypes = [
	["NUMBER", /^\d+/],
	["ADD", /^\+/],
	["SUB", /^\=/],
	["MUL", /^\*/],
	["DIV",/^\//],
	["LPAREN",/^\(/],
	["RPAREN", /^\)/]
	]

	var tokens = [];
	var match = true;
	var i = 0;

	while(input.length > 0 && match){
		match = false;

		tokenTypes.forEach(tokenRegEx => {
			var type = tokenRegEx[0];
			var regEx = tokenRegEx[1];

			var result = regEx.exec(input);

			if(result !== null){
				match = true;
				tokens.push({'name' : type, 'value' : result[0]});
				input = input.slice(1/*result[0].length*/)
			}
		});
  if(match === false) throw Error('Unparseable token: ' + inputString)
	}

	

	return tokens;
}
var calc = new Calculator('1+1');
console.log(calc.tokenStream);
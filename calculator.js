var Calculator = function(inputString){
	this.tokenStream = this.lexer(inputString);

}

Calculator.prototype.peek = function(){
return this.tokenStream[0] || null
}

Calculator.prototype.get = function(){
return this.tokenStream.shift()
}

var TreeNode = function(name,...children){
	this.name = name;
	this.children = children;
	

}

Calculator.prototype.parseExpression = function(){

	var term = this.parseTerm();
	var a = this.parseA();
	
	// var factor = this.parseFactor();

	return new TreeNode('Expression',term,a)
}

Calculator.prototype.parseTerm = function(){
	// var token = this.get();
	var factor = this.parseFactor();
	var b = this.parseB();
	
	return new TreeNode('Term',factor,b)

}

Calculator.prototype.parseA = function(){
	var next = this.peek();

	if(next && next.name === "ADD"){
		this.get();
		return new TreeNode("A","+",this.parseTerm(),this.parseA())
	}
	else if(next && next.name === "SUB"){
		this.get();
		return new TreeNode("A", "-", this.parseTerm(), this.parseA())
	}

	else return new TreeNode("A")
};


Calculator.prototype.parseB = function(){
	var next = this.peek();

	if(next && next.name === "MUL"){
		this.get();
		return new TreeNode("B","*",this.parseTerm(),this.parseA())
	}
	if(next && next.name === "DIV"){
		this.get();
		return new TreeNode("B", "/", this.parseTerm(), this.parseA())
	}

	else return new TreeNode("B")
};

Calculator.prototype.parseFactor = function(){
	var next = this.peek()

	if(next && next.name === 'LPAREN'){
		this.get();
		var exp = this.parseExpression();
		this.get();
		return new TreeNode("Factor","(",exp,")")
	}
	else if (next && next.name === 'NUMBER') return new TreeNode("Factor",this.get())

}

Calculator.prototype.lexer = function(input){
	var tokenTypes = [
	["NUMBER", /^\d+/],
	["ADD", /^\+/],
	["SUB", /^\-/],
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
  if(match === false) throw Error('Unparseable token: ' + input)
	}

	

	return tokens;
}

TreeNode.prototype.accept = function(visitor){
	return visitor.visit(this)
}

function InfixVisitor() {

  this.visit = function(node) {
    switch(node.name) {
      case "Expression":
        return node.children[0].accept(this) + node.children[1].accept(this);
        break;

      case "A":
        if(node.children.length > 0) {
          return  node.children[0] + node.children[1].accept(this) + node.children[2].accept(this);
        } else {
          return "";
        }
        break;      
      default:
        break;
    }
  }
}



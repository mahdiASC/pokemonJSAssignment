function rand(num){
	return Math.floor(Math.random()*num);
}

function Attack(name, type, damage){
	this.name = name;
	this.type = type;
	this.damage = damage;
}

function Pokemon(name,type,baseAtk,baseDef,baseStam,attack){
	this.name = name;
	this.type = type;
	this.baseAtk = baseAtk;
	this.baseDef = baseDef;
	this.baseStam = baseStam;
	this.attack = attack;
	this.atkIV = rand(16);
	this.defIV = rand(16);
	this.stamIV = rand(16);
	this.hp = Math.floor((baseStam+this.stamIV)*0.79);

	this.calcEffectiveness = function(pokemon){
		// https://i.stack.imgur.com/RBHCa.png
		if (this.attack.type == "grass"){
			if (pokemon.type == "fire"){
				return 0.8;
			}else if (pokemon.type == "grass"){
				return 0.8;
			}else if (pokemon.type == "water"){
				return 1.25;
			}else{
				return 1;
			}
		}else if (this.attack.type == "fire"){
			if (pokemon.type == "grass"){
				return 1.25;
			}else if (pokemon.type == "water"){
				return 0.8;
			}else if (pokemon.type == "fire"){
				return 0.8;
			}else{
				return 1;
			}
		}else if (this.attack.type == "water"){
			if (pokemon.type == "grass"){
				return 0.8;
			}else if (pokemon.type == "water"){
				return 0.8;
			}else if (pokemon.type == "fire"){
				return 1.25;
			}else{
				return 1;
			}
		}else{
			console.log("Something's not right!");
		}
	}

	this.attacks = function(pokemon){
		console.log(this.name + " attacks " + pokemon.name + " with " + this.attack.name + " for " + this.calcDamage(pokemon) + " damage!");
		pokemon.hp = pokemon.hp - this.calcDamage(pokemon);
	}

	this.calcDamage = function(pokemon){
		var power = this.attack.damage;
		var atk = (this.baseAtk + this.atkIV) * 0.79;
		var defense = (pokemon.baseDef + pokemon.defIV) * 0.79;

		if (this.type == this.attack.type){
			var stab = 1.25;
		}else{
			var stab = 1;
		}

		var effective = this.calcEffectiveness(pokemon);
		// https://pokemongo.gamepress.gg/damage-mechanics
		return Math.floor(0.5 * (power) * (atk/defense) * (stab) * (effective)) + 1;
	}
}

function randPokemon(){
	// https://pokemongo.gamepress.gg/pokemon-list
	var name = ["Bulbasaur","Charmander","Squirtle"];
	var types = ["grass","fire","water"];
	var baseAtk = [118,116,94];
	var baseDef = [118,96,122];
	var baseStam = [90,78,88];
	var attack = [["Power Whip","grass",70],["Flamethrower","fire",55],["Aqua Tail","water",45]];
	var pick = rand(name.length);
	return new Pokemon(name[pick],types[pick],baseAtk[pick],baseDef[pick],baseStam[pick], new Attack(attack[pick][0],attack[pick][1],attack[pick][2]));
}

function randRoster(){
	var output = [];
	for (var i = 0; i <6 ; i++){
		output.push(randPokemon());
	}
	return output;
}

function Player(){
	this.roster = randRoster();
	this.currentPokemon = this.roster[0];

	this.currentPokeAlive = function(){
		return this.currentPokemon.hp > 0;
	}

	this.anyAlive = function(){
		var counter = 0;
		for (var i = 0; i < 6; i++){
			if (this.roster[i].hp > 0){
				counter++;
			}
		}
		return counter > 0;
	}

	this.changePokemon = function(){
		var index = 0;
		while (!this.currentPokeAlive()){
			this.currentPokemon = this.roster[index];
			index++;
		}
	}
}

function Game(){
	this.player1 = new Player();
	this.player2 = new Player();

	this.playersHavePokemon = function(){
		return this.player1.anyAlive() && this.player2.anyAlive()
	}

	this.call = function(){
		var firstAttacker;
		var secondAttacker;
		while (this.playersHavePokemon()){
			if (Math.random()>.5){
				firstAttacker = this.player1;
				secondAttacker = this.player2;
			}else{
				firstAttacker = this.player2;
				secondAttacker = this.player1;
			}

			while (firstAttacker.currentPokeAlive() && secondAttacker.currentPokeAlive()){
				firstAttacker.currentPokemon.attacks(secondAttacker.currentPokemon);
				if (secondAttacker.currentPokeAlive()){
					secondAttacker.currentPokemon.attacks(firstAttacker.currentPokemon);
				}
			}

			if (!this.player1.currentPokeAlive() && this.player1.anyAlive()){
				this.player1.changePokemon();
			}else if(!this.player2.currentPokeAlive() && this.player2.anyAlive()){
				this.player2.changePokemon();
			}
		}
		var winner;
		if (this.player1.anyAlive()){
			winner = "Player 1";
		}else{
			winner = "Player 2";
		}
		console.log("The winner is " + winner + "!");
	}
}

//Initiating the game
var game = new Game();
game.call();
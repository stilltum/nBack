Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

class nBack {

    constructor (nbackLevel, nbackTypes)  {

        this.level = nbackLevel
        this.current = -nbackLevel
        this.types = {}

        if (nbackTypes.includes("symbol")) {
            this.types.symbols =  new Object()
            this.types.symbols.options = ["!","@","#","$","%"]
            this.types.symbols.items = new Array()
            this.types.symbols.correct = 0
            this.types.symbols.incorrect = 0
        }
        if (nbackTypes.includes("colour")) {
            this.types.colours =  new Object()
            this.types.colours.options = ["blue","green","red","black","white"]
            this.types.colours.items = new Array()
            this.types.colours.correct = 0
            this.types.colours.incorrect = 0
        }
        if (nbackTypes.includes("position")) {
            this.types.positions =  new Object()
            this.types.positions.options = ["0","1","2","3","4","5","6","7","38"]
            this.types.positions.items = new Array()
            this.types.positions.correct = 0
            this.types.positions.incorrect = 0
        }
    }

    guess (guess) {
        switch (guess) {
            case "symbol":
                if (this.types.symbols.items.at(-1) == this.types.symbols.items[this.current - 1]) {
                    this.types.symbols.correct += 1
                } else {
                    this.types.symbols.incorrect += 1
                }
                break
            case "colour":
                if (this.types.colours.items.at(-1) == this.types.colours.items[this.current - 1]) {
                    this.types.colours.correct += 1
                } else {
                    this.types.colours.incorrect += 1
                }
                break
            case "position":
                if (this.types.positions.items.at(-1) == this.types.positions.items[this.current - 1]) {
                    this.types.positions.correct += 1
                } else {
                    this.types.positions.incorrect += 1
                }
                break
        }
    }
 
    stepForward () {
        this.current += 1
        let currentState = new Object()

        // Make sure there is only one match per step
        let gameTypes = Object.keys(this.types)
        if (gameTypes[0] == "symbols") {
            let symbol = this.types.symbols.options.random()
            currentState.symbols = symbol
            if (symbol == this.types.symbols.items[this.current - 1]) {
                let otherTypes = gameTypes.filter(x => x !== "symbols")
                for (let otherType of otherTypes) {
                    let invalidOption = this.types[otherType].items[this.current - 1]
                    currentState[otherType] = this.types[otherType].options.filter(x => x !== invalidOption).random()
                }
            } else {
                let otherTypes = gameTypes.filter(x => x !== "symbols")
                for (let otherType of otherTypes) {
                    let invalidOption = this.types[otherType].items[this.current - 1]
                    currentState[otherType] = this.types[otherType].options.random()
                }
            }
        } else if (gameTypes[0] == "colours") {
            let colour = this.types.colours.options.random()
            currentState.colours = colour
            if (colour == this.types.colours.items[this.current - 1]) {
                let otherTypes = gameTypes.filter(x => x !== "colours")
                for (let otherType of otherTypes) {
                    let invalidOption = this.types[otherType].items[this.current - 1]
                    currentState[otherType] = this.types[otherType].options.filter(x => x !== invalidOption).random()
                }
            } else {
                let otherTypes = gameTypes.filter(x => x !== "colours")
                for (let otherType of otherTypes) {
                    let invalidOption = this.types[otherType].items[this.current - 1]
                    currentState[otherType] = this.types[otherType].options.random()
                }
            }
        } else if (gameTypes[0] == "positions") {
            let position = this.types.positions.options.random()
            currentState.positions = position
            if (position == this.types.position.items[this.current - 1]) {
                let otherTypes = gameTypes.filter(x => x !== "positions")
                for (let otherType of otherTypes) {
                    let invalidOption = this.types[otherType].items[this.current - 1]
                    currentState[otherType] = this.types[otherType].options.filter(x => x !== invalidOption).random()
                }
            } else {
                let otherTypes = gameTypes.filter(x => x !== "positions")
                for (let otherType of otherTypes) {
                    let invalidOption = this.types[otherType].items[this.current - 1]
                    currentState[otherType] = this.types[otherType].options.random()
                }
            }
        }
        
        // Add new elements to array
        for (let element in currentState) {
            this.types[element].items.push(currentState[element])
        }
            
        return currentState
    }

    getMatches (array) {
        let matches = 0
        for (let i = this.level; i < array.length; i++) {
            if (array[i] == array[i - this.level]) {
                matches += 1
            }
        }

        return matches
    }

    getStats () {
        var stats = new Object()
        let vaild_matches = 0

        for (let type in this.types) {
            switch (type) {
            case "symbols":
                vaild_matches = this.getMatches(this.types.symbols.items)
                stats.symbol = new Object()
                stats.symbol.correct = this.types.symbols.correct
                stats.symbol.incorrect = vaild_matches - this.types.symbols.correct + this.types.symbols.incorrect
                break
            case "colours":
                vaild_matches = this.getMatches(this.types.colours.items)
                stats.colour = new Object()
                stats.colour.correct = this.types.colours.correct
                stats.colour.incorrect = vaild_matches - this.types.colours.correct + this.types.colours.incorrect
                break
            case "positions":
                vaild_matches = this.getMatches(this.types.positions.items)
                stats.position = new Object()
                stats.position.correct = this.types.positions.correct
                stats.position.incorrect = vaild_matches - this.types.positions.correct + this.types.positions.incorrect
                break
            }
        }

        return stats
    }
}
// Global class variable
var game;

// Main game loop
const timer = ms => new Promise(res => setTimeout(res, ms))
async function run_game (game, iterations) {

    for (let i = 0; i < iterations; i++) {
        // Blank out cells
        for (var nBack_cell of document.getElementsByClassName("nBack_cell")) {
            nBack_cell.innerHTML = ""
            nBack_cell.style.backgroundColor = "White"
        }

        // Update game state
        let current_state = game.stepForward()
        console.log(current_state)
        game.guess("symbol")

        //Draw game state
      
        // Main loop tick
        await timer(3000);
    }
    console.log(game.getStats())
}

// Console Test
// game = new nBack(1, ["symbol","colour","position"])
// run_game(game, 10)

// New game button
function start_game () {
    let level = document.getElementById("nback_level").selectedOptions[0].value
    let nBackTypes = document.getElementById('game_mode').selectedOptions
    nBackTypes = Array.from(nBackTypes).map(x => x.value)
    console.log(nBackTypes);

    game = new nBack(level, nBackTypes)
    run_game(game, 10)
}
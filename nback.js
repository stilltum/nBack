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
            this.types.colours.options = ["blue","green","red","purple","yellow"]
            this.types.colours.items = new Array()
            this.types.colours.correct = 0
            this.types.colours.incorrect = 0
        }
        if (nbackTypes.includes("position")) {
            this.types.positions =  new Object()
            this.types.positions.options = ["0","1","2","3","4","5","6","7","8"]
            this.types.positions.items = new Array()
            this.types.positions.correct = 0
            this.types.positions.incorrect = 0
        }
    }

    guess (guess, writeLocation) {
        switch (guess) {
            case "symbol":
                if (this.types.symbols.items.at(-1) == this.types.symbols.items[this.current - 1]) {
                    this.types.symbols.correct += 1
                    document.getElementById("symbol_button").style.background = "green"
                } else {
                    this.types.symbols.incorrect += 1
                    document.getElementById("symbol_button").style.background = "red"
                }
                break
            case "colour":
                if (this.types.colours.items.at(-1) == this.types.colours.items[this.current - 1]) {
                    this.types.colours.correct += 1
                    document.getElementById("colour_button").style.background = "green"
                } else {
                    this.types.colours.incorrect += 1
                    document.getElementById("colour_button").style.background = "red"
                }
                break
            case "position":
                if (this.types.positions.items.at(-1) == this.types.positions.items[this.current - 1]) {
                    this.types.positions.correct += 1
                    document.getElementById("position_button").style.background = "green"
                } else {
                    this.types.positions.incorrect += 1
                    document.getElementById("position_button").style.background = "red"
                }
                break
        }
    }
 
    stepForward () {
        this.current += 1
        let currentState = new Object()

        // Only one match per tick
        let match = 0
        for (let gameType in this.types) {
            let nextElement = 0
            if (!match) {
                nextElement = this.types[gameType].options.random()
            } else {
                let invalidOption = this.types[gameType].items[this.current - 1]
                nextElement = this.types[gameType].options.filter(x => x !== invalidOption).random()
            }
            
            if (nextElement == this.types[gameType].items[this.current - 1]) {
                match = 1
            }

            this.types[gameType].items.push(nextElement)
            currentState[gameType] = nextElement
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
        // Blank out answer response
        for (let button of document.getElementsByClassName("guess_button")) {
            button.style.background = "white"
        }

        // Update game state
        let current_state = game.stepForward()

        //Draw game state
        if (current_state.positions) {
            nBack_cell = document.getElementById("pos" + current_state.positions)
        } else {
            nBack_cell = document.getElementById("pos0")
        }
        if (current_state.symbols) {
            nBack_cell.innerHTML = current_state.symbols
        }
        if (current_state.colours) {
            nBack_cell.style.backgroundColor = current_state.colours
        }
      
        // Main loop tick
        document.getElementById("round").innerHTML = i + 1
        await timer(3000);
    }
    console.log(game.getStats())
}

// New game button
function new_game () {
    let level = document.getElementById("nback_level").selectedOptions[0].value
    let nBackTypes = document.getElementById('game_mode').selectedOptions
    nBackTypes = Array.from(nBackTypes).map(x => x.value)
    game = new nBack(level, nBackTypes)

    let guessOptions = document.getElementById("guess_options")
    guessOptions.innerHTML = ""
    if (nBackTypes.includes("symbol")) {
        let button = document.createElement("button")
        button.setAttribute("class", "guess_button")
        button.setAttribute("id", "symbol_button")
        button.setAttribute("onclick", "game.guess(\"symbol\")")
        button.textContent = "Symbol"
        guessOptions.appendChild(button)
    }
    if (nBackTypes.includes("colour")) {
        let button = document.createElement("button")
        button.setAttribute("class", "guess_button")
        button.setAttribute("id", "colour_button")
        button.setAttribute("onclick", "game.guess(\"colour\")")
        button.textContent = "Colour"
        guessOptions.appendChild(button)
    }
    if (nBackTypes.includes("position")) {
        let button = document.createElement("button")
        button.setAttribute("class", "guess_button")
        button.setAttribute("id", "position_button")
        button.setAttribute("onclick", "game.guess(\"position\")")
        button.textContent = "Position"
        guessOptions.appendChild(button)
    }
    run_game(game, 10)
}

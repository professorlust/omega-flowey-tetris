function Flower(){

	this.queued_text = [];
	this.currentLine = 0;
	this.currentLineChars = 0;
	this.printedChars = 0;
	this.displayText = "";

	this.se = se_flowey;

}

Flower.prototype.init = function() {

	bgm_flowey_intro1.play();

}

Flower.prototype.advanceOneFrame = function() {

	if (this.queued_text[this.currentLine].substr(this.printedChars, 2) == "%1"){
		this.currentLineChars += 0.05;
	} else if (this.queued_text[this.currentLine].substr(this.printedChars, 2) == "%2"){
		this.currentLineChars += 0.02;
	} else {
		this.currentLineChars += 0.4;
	}

	var sound = false;

	while (this.currentLineChars > 1){
		if (this.printedChars >= this.queued_text[this.currentLine].length) {
			break;
		}
		this.currentLineChars -= 1;

		if (this.queued_text[this.currentLine][this.printedChars] == "%"){
			this.printedChars += 2;
		} else {
			this.displayText += this.queued_text[this.currentLine][this.printedChars];
			this.printedChars += 1;
			if (this.queued_text[this.currentLine][this.printedChars] != " ") {
				sound = true;
			}
		}
	}

	if (sound) this.se.play();

}

Flower.prototype.advanceTextA = function() {

	if (this.printedChars >= this.queued_text[this.currentLine].length) {
		this.currentLine += 1;
		this.currentLineChars = 0;
		this.printedChars = 0;
		this.displayText = "";
		if (this.currentLine >= this.queued_text.length) {
			// go to next scene
			localStorage["oft.intro"] = true;
			localStorage["oft.plays"] = parseInt(localStorage["oft.plays"]) + 1;

			document.getElementById("textbox").innerHTML = "";
			bgm_flowey_intro1.stop();
			scene.scene_state = "tetris";
			tetrion.resetBoard();
		}
	}

}

Flower.prototype.advanceTextB = function() {

	if (this.printedChars < this.queued_text[this.currentLine].length) {
		this.printedChars = this.queued_text[this.currentLine].length;
		this.displayText = this.queued_text[this.currentLine].replace(/%./g, "");
		this.se.play();
	}

}

Flower.prototype.getIntroLine = function(runaway, escapes, deaths) {

	if (runaway) {
		switch (escapes){
			case 1: return [
				"Hee hee hee...",
				"Did you really think\nyou could run away?",
				"Now you have to play\neverything you just did...",
				"Right from the VERY\nBEGINNING."
			];
			case 2: return [
				"Looks like we've got a\nrunner here.",
				"Pathetic. You can't even\nLOSE the game properly."
			];
			default: return ["Don't you have anything\nbetter to do...",
				"...than wasting your time\ntrying to save-scum your\nway to victory?"];
		}
	} else {
		switch (deaths){
			case 0: return [
				"Hee hee hee...",
				"Did you really think\nyou could run away?"
			];
			case 1: return [
				"Hee hee hee...",
				"Did you really think I'd\nbe satisfied...%2\nkilling you just ONCE?",
				"And don't think you've\nmade it to a checkpoint.",
				"When you lose THIS game,%1\nyou have to start\nAAAALLLL over again."
			];
			default: return ["Don't you have anything\nbetter to do?",
				"Being beaten senseless by\nthis game over and over\nmust really fill you with\nDETERMINATION, huh?"];
		}
	}

	return ["ahhhhh what the hell"];

}

var flowey = new Flower();

flowey.queued_text = [
	// 4567890123456789012 <- 22 character limit
	"Howdy!%1\nIt's me, FLOWEY!%1\nFLOWEY the FLOWER!",
	"Boy, you're really\nsomething, aren't you?",
	"You couldn't get enough\nof that old fool Sans,\nso you came back for more.",
	"Well I for one hate to\ndisappoint my admirers.",
	"But I've got a different\ngame in store for you.",
	"No more dodging those\nstupid bullets.",
	"I'm going to give you a\ngame that requires\nactual SKILL.",
	"How do you feel about%1.%1.%1.%2 Tetris?"
]

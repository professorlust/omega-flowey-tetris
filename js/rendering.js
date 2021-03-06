function setup_graphics(){

    var p = new Processing(document.getElementById("blockbox"));

    var piece_colours = {
		" ": p.color(  0,   0,   0),
    	"G": p.color(127, 127, 127), // G for garbage.
    	"H": p.color(255, 255, 255), // H for healing.
    	"I": p.color(255,  40,   0),
    	"J": p.color(  0,  40, 255),
    	"L": p.color(255, 135,   0),
    	"O": p.color(255, 255,   0),
    	"S": p.color( 40, 216,  40),
    	"T": p.color(105,   0, 210),
    	"Z": p.color(255,   0, 255),
    };

	var opening_banner = p.loadImage("img/undertale_f_open.png");
	var glitched_banners = [
		p.loadImage("img/undertale_f_open_big-glitched1.png"),
		p.loadImage("img/undertale_f_open_big-glitched2.png"),
		p.loadImage("img/undertale_f_open_big-glitched3.png"),
		p.loadImage("img/undertale_f_open_big-glitched4.png"),
		p.loadImage("img/undertale_f_open_big-glitched5.png"),
		p.loadImage("img/undertale_f_open_big-glitched6.png"),
	];
	var gameover_banner = p.loadImage("img/gameover.png");
	var hahahahahahahaha = p.loadImage("img/hahahahahahahaha.png");

    p.setup = function() {
        p.size(640, 480);
        p.frameRate(60);
    };

	p.drawTetrion = function(t_pos) {

		p.background(0);
		p.fill(0);
        p.stroke(16);

		// Draw the tetrion

/*
        for(var a = 0; a <= 10; ++a){
            p.line(a * 16 + t_pos.x, 0 + t_pos.y, a * 16 + t_pos.x, 321 + t_pos.y);
        }

        for(var b = 0; b <= 20; ++b){
            p.line(0 + t_pos.x, b * 16 + t_pos.y, 161 + t_pos.x, b * 16 + t_pos.y);
        }
*/

		p.rect(t_pos.x, t_pos.y, 160, 320);

        for(var a = 0; a < 10; ++a){
            for(var b = 0; b < 20; ++b){
                var block = tetrion.getBlockAt(a, b);
                p.fill(piece_colours[block], 127);
                p.rect(a * 16 + t_pos.x, b * 16 + t_pos.y, 16, 16);
            }
        }

        var piece = tetrion.getCurrentPiece();
        if (piece != null){
            if (piece.lock_flash) {
                p.fill(255);
				p.stroke(255);
                piece.lock();
            } else {
                p.fill(piece_colours[piece.shape], 55 + 200 * (piece.lock_delay / tetrion.lock_delay));
				if (tetrion.healing) p.fill(255);
				p.stroke(piece_colours[piece.shape], 0 * (piece.lock_delay / tetrion.lock_delay));
            }
            for(var a = 0; a < 4; ++a){
                var x = piece.position.x + piece.kick_offset.x + piece.block_offsets[piece.rotation_state][a].x;
                var y = piece.position.y + piece.kick_offset.y + piece.block_offsets[piece.rotation_state][a].y;
                p.rect(x * 16 + t_pos.x, y * 16 + t_pos.y, 16, 16);
            }
        }

	};

	p.drawNextQueue = function(t_pos) {

		// next queue

		var piece = tetrion.next_queue[0];
        var shape = piece_shapes[piece];
		if (tetrion.healing) shape = tetrion.heal_piece;

        p.fill(piece_colours[shape]);
		if (tetrion.healing) p.fill(255);
		p.stroke(16);

        for(var a = 0; a < 4; ++a){
            var x = block_offsets[shape][0][a].x + spawn_positions[shape].x;
            var y = block_offsets[shape][0][a].y + 1;
            p.rect(x * 16 + t_pos.x, y * 16 + t_pos.y - 40, 16, 16);
        }

        for(var n = 1; n < 5; ++n){
            var piece = tetrion.next_queue[n];
            var shape = piece_shapes[piece];

			if (tetrion.healing) shape = tetrion.heal_piece;

            var location = 90 + n * 48;
            if(shape == "I" || shape == "O") location = 101 + n * 48;

            p.fill(piece_colours[shape]);
			if (tetrion.healing) p.fill(255);

            for(var a = 0; a < 4; ++a){
                var x = block_offsets[shape][0][a].x;
                var y = block_offsets[shape][0][a].y + 1;
                p.rect(x * 11 + location + t_pos.x, y * 11 + t_pos.y - 30, 11, 11);
            }
        }

	};

	p.drawHoldPiece = function(t_pos) {
		var piece = tetrion.hold_piece;
		if (!piece) return;

		var shape = piece;

		var location = 0;
		if(shape == "I" || shape == "O") location = 11;

		p.fill(piece_colours[shape]);

		for (var a = 0; a < 4; ++a) {
			var x = block_offsets[shape][0][a].x;
			var y = block_offsets[shape][0][a].y + 1;
			p.rect(x * 11 + location + t_pos.x, y * 11 + t_pos.y - 30, 11, 11);
		}
	}

	p.drawIntroScene = function() {

		var queued_text = [
			"Long ago, two races\nruled over Earth:\nHUMANS and MONSTERS.",
			"One day, the",
			"One day, they all\nturned into Tetris\npieces and died."
		];

		p.background(0);

		if (scene.scene_frames < 300) {
			p.image(opening_banner, 120, 40);
			document.getElementById("textbox").innerHTML = queued_text[0].substr(0, scene.scene_frames / 4);
		} else if (scene.scene_frames < 375) {
			p.image(opening_banner, 120, 40);
			document.getElementById("textbox").innerHTML = queued_text[1].substr(0, (scene.scene_frames - 300) / 4);
		} else if (scene.scene_frames < 600) {
			if (scene.scene_frames < 425) p.image(glitched_banners[0], 0, 0);
			else if (scene.scene_frames < 445) p.image(glitched_banners[1], 0, 0);
			else if (scene.scene_frames < 470) p.image(glitched_banners[2], 0, 0);
			else if (scene.scene_frames < 508) p.image(glitched_banners[3], 0, 0);
			else if (scene.scene_frames < 568) p.image(glitched_banners[4], 0, 0);
			else if (scene.scene_frames < 575) p.image(glitched_banners[3], 0, 0);
			else p.image(glitched_banners[5], 0, 0);

			if (scene.scene_frames == 375) {
				bgm_intro.stop();
				bgm_audio_glitch.play();
				intro_scene.garbled_text_length = queued_text[2].length;
				document.getElementById("textbox").innerHTML = queued_text[2];
			} else if (scene.scene_frames > 470 && Math.random() < 0.15) {
				intro_scene.garbled_text_length = Math.floor((0.6 + Math.random() * 0.2) * intro_scene.garbled_text_length);
				document.getElementById("textbox").innerHTML = queued_text[2].substr(0, intro_scene.garbled_text_length) + generateGarbledString();
			}
		} else {
			bgm_audio_glitch.stop();
			document.title = "Floweytris";
			document.getElementById("textbox").innerHTML = "";
			document.getElementById("controlbox").style.display = "block";
		}

	};

	p.drawFlowey = function() {

		p.background(0);
		document.getElementById("textbox").innerHTML = flowey.displayText;

	};

	p.drawFloweyAlt = function() {

		p.background(0);
		document.getElementById("textbox").innerHTML = flowey.displayText;

	};


	p.drawBrokenTetrion = function(t_pos) {

		p.background(0);

		for(var a = 0; a < 10; ++a){
			for(var b = 0; b < 20; ++b){
				var block = tetrion.getParticleAt(a, b);

				p.pushMatrix();
				p.translate(block.position.x + t_pos.x + 8, block.position.y + t_pos.y + 8);
				p.rotate(block.rotation);

				p.fill(piece_colours[block.color], block.brightness);
                p.rect(-8, -8, 16, 16);

				p.popMatrix();
			}
		}

	};

	p.drawGameOver = function() {

		p.background(0);

		var queued_text = [
			"\xa0\xa0\xa0You can make it\n\xa0\xa0\xa0through this game!",
			"\xa0\xa0\xa0Nah, git gud scrub."
		];

		if (scene.scene_frames < 90) {

			p.tint(255, scene.scene_frames * 3);
			p.image(gameover_banner, 112, 50, 416, 156);

			// change opacity
		} else if (scene.scene_frames < 300) {

			p.image(gameover_banner, 112, 50, 416, 156);

			document.getElementById("textbox").innerHTML = queued_text[0].substr(0, (scene.scene_frames - 90) / 4);

			if ((scene.scene_frames - 90) % 4 == 0 &&
				(scene.scene_frames - 90) / 4 <= queued_text[0].length &&
				isNotWhitespace(queued_text[0][(scene.scene_frames - 90) / 4 - 1]) ) se_asgore.play();

		} else if (scene.scene_frames < 450) {

			p.image(gameover_banner, 112, 50, 416, 156);

			if (scene.scene_frames == 300) bgm_gameover.stop();
			document.getElementById("textbox").innerHTML = queued_text[1].substr(0, (scene.scene_frames - 300) / 4);

			if ((scene.scene_frames - 300) % 4 == 0 &&
				(scene.scene_frames - 300) / 4 <= queued_text[1].length &&
				isNotWhitespace(queued_text[1][(scene.scene_frames - 300) / 4 - 1]) ) se_evilflowey.play();

		} else if (scene.scene_frames < 800) {

			document.getElementById("textbox").innerHTML = "";
			if (scene.scene_frames == 450) {
				bgm_gameover2.play();
				se_flowey_laugh.play();
			}

			if (scene.scene_frames < 490) {
				p.image(hahahahahahahaha, 0, 480 - (scene.scene_frames - 450) * 17);
			} else {
				p.image(hahahahahahahaha, 0, 0 - (((scene.scene_frames - 450) * 17) % 66));
			}

		} else {

			bgm_gameover2.stop();
			window.close();

		}

	};

    p.draw = function() {

		var t_pos = { x: 240, y: 120 };

		if (scene.scene_state == "intro") {
			p.drawIntroScene();
		} else if (scene.scene_state == "flowey") {
			p.drawFlowey();
		} else if (scene.scene_state == "flowey_alt") {
			p.drawFloweyAlt();
		} else if (scene.scene_state == "tetris") {
			if (!tetrion.gameover) {
				p.drawTetrion(t_pos);
				p.drawNextQueue(t_pos);
				p.drawHoldPiece(t_pos);
			} else {
				p.drawBrokenTetrion(t_pos);
			}
		} else if (scene.scene_state == "gameover") {
			p.drawGameOver();
		} else {
			p.background(0); // blank
		}

    };

    p.setup();

};

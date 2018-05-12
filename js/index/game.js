const GAME = {
	GROUND_Y: 382,
	ASSETS: {
		spritesheets: {
			expected: 0,
			loaded: 0,
			load: function(imagePathsArray) {
				GAME.ASSETS.spritesheets.expected = imagePathsArray.length;
				for(var i in imagePathsArray) {
					const name = imagePathsArray[i].replace(/[^a-zA-Z0-9]+/, '');
					const spritesheet = {};
					spritesheet.base = new Image();
					spritesheet.base.onload = GAME.ASSETS.spritesheets.onLoad;
					spritesheet.base.onerror = GAME.ASSETS.spritesheets.onError;
					spritesheet.base.src = "./resources/assets/" + imagePathsArray[i] + ".png";
					GAME.ASSETS.spritesheets[name] = spritesheet;
				}
			},
			onLoad: function() {
				GAME.ASSETS.spritesheets.loaded++;
				if(GAME.ASSETS.spritesheets.loaded == GAME.ASSETS.spritesheets.expected) {
					GAME.ASSETS.spritesheets.onAllLoaded();
					GAME.onAssetsLoaded();
				}
			},
			onError: function(e) {
				alert(e);
			},
			onAllLoaded: function() {
				GAME.ASSETS.spritesheets.cvbug.sheet = new createjs.SpriteSheet({
					images: [GAME.ASSETS.spritesheets.cvbug.base],
					frames: {
						width: 48,
						height: 48,
						regX: 24,
						regY: 44
					},
					animations: {
						walk: [0, 7, "walk"]
					}
				});
				GAME.ASSETS.spritesheets.cvmap.sheet = new createjs.SpriteSheet({
					images: [GAME.ASSETS.spritesheets.cvmap.base],
					frames: {
						width: 48,
						height: 48,
						regX: 24,
						regY: 24
					},
					animations: {
						ug: 0,
						gr: 1,
						gw: 6,
						wa: 7,
						c1: 4,
						c2: 5
					}
				});
				GAME.ASSETS.spritesheets.cvme.sheet = new createjs.SpriteSheet({
					images: [GAME.ASSETS.spritesheets.cvme.base],
					frames: {
						width: 144,
						height: 144,
						regX: 72,
						regY: 128
					},
					animations: {
						idle_right: [56, 63, "idle", 4],
						idle: [8, 15, "idle", 4],
						idle_watch: [16, 23, "idle", 4],
						idle_dunno: [24, 31, "idle", 4],
						idle_showdir: [32, 39, "idle", 4],
						idle_w: [7, 8, "idle_w", 4],
						shoot: [0, 7, "stop", 4],
						run_right: [64, 71, "run_right", 4],
						jump_start: [65, 65, "jump", 4],
						jump: [66, 66, "jump", 4]
					}
				});
			}
		},
		init: function() {
			GAME.ASSETS.spritesheets.load(["cv-bug", "cv-me", "cv-map"]);
		}
	},
	ENTITIES: {
		PLAYER: {
			controls: {
				onKeyDown: function(e) {
					switch(e.code) {
						case "KeyD":
							return GAME.ENTITIES.PLAYER.goRight();
						case "KeyA":
							return GAME.ENTITIES.PLAYER.goLeft();
						case "Space":
							return GAME.ENTITIES.PLAYER.jump();
						case "KeyF":
							return GAME.ENTITIES.PLAYER.shoot();
					}
					e.stopPropagation();
				},
				onKeyUp: function(e) {
					const player = GAME.ENTITIES.PLAYER;
					switch(e.code) {
						case "KeyD":
							return player.actions.movement === player.allActions.goRight && GAME.ENTITIES.PLAYER.idle();
						case "KeyA":
							return player.actions.movement === player.allActions.goLeft && GAME.ENTITIES.PLAYER.idle();
					}
					e.stopPropagation();
				}
			},
			allActions: {
				idle: {
					POS_ON_SCREEN: null,
					animationSpriteName: "idle",
					idleTime: 0,
					tick: function(delta) {
						const player = GAME.ENTITIES.PLAYER;
						const action = player.allActions.idle;
						action.idleTime += delta;
						if(action.idleTime % 30000 > 18050 && action.idleTime % 30000 < 18100 && !player.actions.jump) player.sprite.gotoAndPlay("idle_watch");
						if(action.idleTime % 18000 > 12050 && action.idleTime % 18000 < 12100 && !player.actions.jump) player.sprite.gotoAndPlay("idle_dunno");
						if(action.idleTime % 27000 > 11050 && action.idleTime % 27000 < 11100 && !player.actions.jump) player.sprite.gotoAndPlay("idle_showdir");
					}
				},
				goRight: {
					POS_ON_SCREEN: null,
					animationSpriteName: "run_right",
					speed: 200,
					tick: function(delta) {
						const player = GAME.ENTITIES.PLAYER;
						const action = player.allActions.goRight;
						player.sprite.x += action.speed * delta / 1000;
					}
				},
				goLeft: {
					POS_ON_SCREEN: null,
					animationSpriteName: "run_right",
					speed: -200,
					tick: function(delta) {
						const player = GAME.ENTITIES.PLAYER;
						const action = player.allActions.goLeft;
						player.sprite.x += action.speed * delta / 1000;
						if(player.sprite.x < 56) player.sprite.x = 56;
					}
				},
				jump: {
					animationSpriteName: "jump_start",
					currentYSpeed: 0,
					startYSpeed: -300,
					g: 500,
					tick: function(delta) {
						const player = GAME.ENTITIES.PLAYER;
						const action = player.allActions.jump;
						player.sprite.y += action.currentYSpeed * delta / 1000;
						action.currentYSpeed += action.g * delta / 1000;
						if(player.sprite.y > GAME.GROUND_Y) {
							player.sprite.y = GAME.GROUND_Y;
							player.actions.jump = null;
							if(player.actions.movement) player.sprite.gotoAndPlay(player.actions.movement.animationSpriteName);
						}
					}
				},
				shoot: {
					animationSpriteName: "shoot",
					tick: function(delta) {}
				}
			},
			actions: {
				movement: null,
				jump: null,
				shoot: null
			},
			sprite: null,
			init: function() {
				const player = GAME.ENTITIES.PLAYER;
				player.allActions.idle.POS_ON_SCREEN = GAME.STAGE.WIDTH / 2;
				player.allActions.goRight.POS_ON_SCREEN = 100;
				player.allActions.goLeft.POS_ON_SCREEN = GAME.STAGE.WIDTH - 100;
				player.actions.movement = player.allActions.idle;
				player.sprite = new createjs.Sprite(GAME.ASSETS.spritesheets.cvme.sheet, "idle_right");
				player.sprite.x = 120;
				player.sprite.y = GAME.MAP.GROUND_Y;
				player.sprite.framerate = 2;
				document.addEventListener("keydown", player.controls.onKeyDown);
				document.addEventListener("keyup", player.controls.onKeyUp);
				GAME.STAGE.easel.addChild(player.sprite);
			},
			tick: function(delta) {
				for(var i in GAME.ENTITIES.PLAYER.actions)
					if(GAME.ENTITIES.PLAYER.actions[i]) GAME.ENTITIES.PLAYER.actions[i].tick(delta)
			},
			goRight: function() {
				if(GAME.ENTITIES.PLAYER.actions.movement !== GAME.ENTITIES.PLAYER.allActions.goRight) {
					GAME.ENTITIES.PLAYER.actions.movement = GAME.ENTITIES.PLAYER.allActions.goRight;
					GAME.ENTITIES.PLAYER.sprite.scaleX = 1;
					if(!GAME.ENTITIES.PLAYER.actions.jump) GAME.ENTITIES.PLAYER.sprite.gotoAndPlay(GAME.ENTITIES.PLAYER.actions.movement.animationSpriteName);
				}
			},
			goLeft: function() {
				if(GAME.ENTITIES.PLAYER.actions.movement !== GAME.ENTITIES.PLAYER.allActions.goLeft) {
					GAME.ENTITIES.PLAYER.actions.movement = GAME.ENTITIES.PLAYER.allActions.goLeft;
					GAME.ENTITIES.PLAYER.sprite.scaleX = -1;
					if(!GAME.ENTITIES.PLAYER.actions.jump) GAME.ENTITIES.PLAYER.sprite.gotoAndPlay(GAME.ENTITIES.PLAYER.actions.movement.animationSpriteName);
				}
			},
			idle: function() {
				if(GAME.ENTITIES.PLAYER.actions.movement !== GAME.ENTITIES.PLAYER.allActions.idle) {
					GAME.ENTITIES.PLAYER.actions.movement = GAME.ENTITIES.PLAYER.allActions.idle;
					GAME.ENTITIES.PLAYER.actions.movement.idleTime = 0;
					GAME.ENTITIES.PLAYER.sprite.scaleX = 1;
					if(!GAME.ENTITIES.PLAYER.actions.jump) GAME.ENTITIES.PLAYER.sprite.gotoAndPlay(GAME.ENTITIES.PLAYER.actions.movement.animationSpriteName);
				}
			},
			shoot: function() {
				GAME.ENTITIES.PLAYER.actions.shoot = GAME.ENTITIES.PLAYER.allActions.shoot;
				GAME.ENTITIES.PLAYER.sprite.gotoAndPlay(GAME.ENTITIES.PLAYER.actions.shoot.animationSpriteName);
			},
			jump: function() {
				const player = GAME.ENTITIES.PLAYER;
				const action = player.allActions.jump;
				const currentActions = player.actions;
				if(currentActions.jump !== action) {
					currentActions.jump = action;
					action.currentYSpeed = action.startYSpeed;
					player.sprite.gotoAndPlay(action.animationSpriteName);
				}
			},
			getPositionOnScreen: function() {
				const player = GAME.ENTITIES.PLAYER;
				return player.actions.movement.POS_ON_SCREEN - player.sprite.x;
			}
		},
		BUGS: {
			all: [],
			init: function() {},
			tick: function(delta) {
				for(var i in GAME.ENTITIES.BUGS.all) GAME.ENTITIES.BUGS.all[i].tick(delta);
			},
			addNew: function() {
				const bug = {
					sprite: new createjs.Sprite(GAME.ASSETS.spritesheets.cvbug.sheet, "walk"),
					tick: function(delta) {
						GAME.ENTITIES.PLAYER.sprite.x -= delta / 1000 * 100;
						if(GAME.ENTITIES.PLAYER.sprite.x < -50) GAME.ENTITIES.PLAYER.sprite.x = 650;
					}
				};
				GAME.ENTITIES.BUGS.all[GAME.ENTITIES.BUGS.all.length] = bug;
				bug.sprite.x = x;
				bug.sprite.y = y;
				bug.sprite.framerate = 6;
				GAME.STAGE.easel.addChild(bug.sprite);
			}
		},
		init: function() {
			GAME.ENTITIES.PLAYER.init();
			GAME.ENTITIES.BUGS.init();
		},
		tick: function(delta) {
			GAME.ENTITIES.PLAYER.tick(delta);
			GAME.ENTITIES.BUGS.tick(delta);
		}
	},
	STAGE: {
		WIDTH: 600,
		HEIGHT: 400,
		SPRITE_WIDTH: 48,
		SPRITE_HEIGHT: 48,
		REFRESH_POSITION_SPEED: 300.0,
		easel: null,
		init: function() {
			GAME.STAGE.easel = new createjs.Stage("canvas_game");
		},
		refreshPosition: function(delta, playerX) {
			var newPositionX = GAME.STAGE.easel.x;
			if(playerX > newPositionX) newPositionX = Math.min(playerX, newPositionX + Math.abs(playerX - newPositionX) * delta / 400);
			else if(playerX < newPositionX) newPositionX = Math.max(playerX, newPositionX - Math.abs(playerX - newPositionX) * delta / 400);
			GAME.STAGE.easel.x = parseInt(Math.max(GAME.MAP.MAX_X, Math.min(GAME.MAP.MIN_X, newPositionX)));
		},
		update(event) {
			GAME.STAGE.easel.update(event);
		}
	},
	MAP: {
		MIN_X: null,
		MAX_X: null,
		MIN_Y: null,
		MAX_Y: null,
		GROUND_Y: null,
		table: null,
		init: function() {
			GAME.MAP.MIN_X = 0;
			GAME.MAP.MAX_X = -26 * GAME.STAGE.SPRITE_WIDTH + GAME.STAGE.WIDTH;
			GAME.MAP.MIN_Y = 0;
			GAME.MAP.MAX_Y = GAME.STAGE.HEIGHT;
			GAME.MAP.GROUND_Y = GAME.STAGE.HEIGHT - (GAME.STAGE.HEIGHT % GAME.STAGE.SPRITE_HEIGHT);
			GAME.MAP.table = [
				["wa", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "wa"],
				["wa", null, "c1", null, null, null, null, null, null, null, null, null, null, null, "c2", null, null, null, null, null, null, null, null, null, null, "wa"],
				["wa", null, null, null, null, null, null, null, null, null, null, "c2", null, null, null, null, null, null, null, null, null, null, null, null, null, "wa"],
				["wa", null, null, null, null, "c2", null, null, null, null, null, null, "c1", null, null, null, null, null, null, null, null, null, null, null, null, "wa"],
				["wa", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "wa"],
				["wa", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "wa"],
				["wa", null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, "wa"],
				["gw", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gr", "gw"],
				["ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug", "ug"]
			];
			for(var line = 0; line < GAME.MAP.table.length; ++line) {
				for(var cell = 0; cell < GAME.MAP.table[line].length; ++cell) {
					if(GAME.MAP.table[line][cell]) {
						const cellSprite = new createjs.Sprite(GAME.ASSETS.spritesheets.cvmap.sheet, GAME.MAP.table[line][cell]);
						cellSprite.x = (cell + .5) * 48;
						cellSprite.y = (line + .5) * 48;
						GAME.STAGE.easel.addChild(cellSprite);
					}
				}
			}
		}
	},
	init: function() {
		$(window).resize(GAME.updateCanvasFrame);
		GAME.updateCanvasFrame();
		GAME.STAGE.init();
		GAME.ASSETS.init();
	},
	updateCanvasFrame: function() {
		$(".div_frame").remove();
		$("body").append($("div.div_canvas").clone().removeClass("div_canvas").addClass("div_frame").offset({
			left: $("div.div_canvas").offset().left,
			top: $("div.div_canvas").offset().top
		}).css("position", "absolute"));
	},
	onAssetsLoaded: function() {
		GAME.MAP.init();
		GAME.ENTITIES.init();
		createjs.Ticker.on("tick", GAME.tick);
		createjs.Ticker.framerate = 60;
	},
	tick: function(event) {
		GAME.ENTITIES.tick(event.delta);
		GAME.STAGE.refreshPosition(event.delta, GAME.ENTITIES.PLAYER.getPositionOnScreen());
		GAME.STAGE.update(event);
	}
};

function init() {
	$(".link-to-cv > span").on("click", redirectToCv);
	if(isMobileOrTablet()) redirectToCv();
}

function isMobileOrTablet() {
	var check = false;
	(function(a) {
		if(
			/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i
			.test(a) ||
			/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i
			.test(a.substr(0, 4))) check = true;
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

function redirectToCv() {
	window.location.href = "cv.html";
}
$(init);
$(GAME.init);
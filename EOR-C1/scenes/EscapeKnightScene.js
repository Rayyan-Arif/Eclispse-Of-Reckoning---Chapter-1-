import Phaser from "phaser";
import Helper from "../HelperClass";

class EscapeKnight extends Phaser.Scene{
    constructor(){
        super("escape-knight-scene");
        this.w;
        this.h;
        this.background;
        this.player;
        this.exitbutton;
        this.walls = [];
        this.playerSpeed;
        this.slab;
        this.knight;
        this.knightSleeping = true;
        this.timerNotRegistered = true;
        this.knightAttackPlayer = false;
        this.sleepTimer;
        this.hint;
        this.diedText;
        this.alert;
    }

    preload(){
        this.load.image('wall','../UI Images/wall.png');
        this.load.image('knight-alert','../UI Images/guard-alert.png');
        this.load.image('knight-sleeping','../UI Images/guard-sleeping.png');
    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.playerSpeed = Helper.scaleWidth(200, this.w);

        this.background = this.add.image(0,0,'arrows-bg').setOrigin(0,0).setAlpha(0);
        this.background.setDisplaySize(this.w, this.h);

        this.player = this.physics.add.image(this.w/15, this.h/1.11, 'player-right').setOrigin(0.5).setAlpha(0);
        this.player.setScale(1.7);
        this.player.body.updateFromGameObject();
        this.player.body.setSize(this.player.displayWidth*0.14, this.player.displayHeight*0.55);
        this.player.body.setOffset(this.player.displayWidth/4.6, this.player.displayHeight/7.2);
        this.player.setDepth(1);

        this.exitbutton = this.add.text(Helper.scaleWidth(90,this.w),Helper.scaleHeight(40,this.h),'EXIT',{
            fontSize: '32px',
            fontFamily: 'Segoe UI',
            fontStyle: 'bold',
            backgroundColor: '#0E2A2A',
            color: '#20D38B',       
            padding: { left: Helper.scaleWidth(50,this.w), right: Helper.scaleWidth(50,this.w), top: Helper.scaleHeight(10,this.h), bottom: Helper.scaleHeight(10,this.h) },
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#20D38B',             
                blur: 25,
                stroke: true,                 
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        this.exitbutton.setInteractive({ useHandCursor: true })
        .on('pointerdown',() => {
            this.exitbutton.setScale(0.9);
            this.exitbutton.disableInteractive();
            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
            this.tweens.add({
                targets: fade,
                alpha: 1,
                duration: 100,
                onComplete: () => {
                    this.scene.stop();
                    this.scene.start('main-menu-scene');
                }
            })
        })
        .on('pointerup',() => this.exitbutton.setScale(1));

        const xWalls = [20,250,550,850];

        for(let i=0 ; i<4 ; i++){
            const wall = this.physics.add.image(Helper.scaleWidth(xWalls[i], this.w), Helper.scaleHeight(640, this.h), 'wall').setOrigin(0.5).setAlpha(0);
            wall.setDisplaySize(Helper.scaleWidth(150, this.w),Helper.scaleHeight(150, this.h));
            wall.body.setSize(wall.displayWidth*5);
            this.walls.push(wall);
        }

        this.slab = this.add.rectangle(Helper.scaleWidth(940, this.w),Helper.scaleHeight(250, this.h),Helper.scaleWidth(150,this.w),Helper.scaleHeight(10,this.h),0x000000).setOrigin(0.5).setAlpha(0);

        this.knight = this.add.image(Helper.scaleWidth(940, this.w),Helper.scaleHeight(250, this.h),'knight-sleeping').setOrigin(0.5).setAlpha(0);
        this.knight.setScale(3);
        this.knight.setDepth(2);

        this.hint = this.add.text(
            Helper.scaleWidth(100, this.w),
            Helper.scaleHeight(100, this.h),
            `Be careful! The Purple Thorn's knight is sleepy but he is\n
waking up randomly at any time so hide under the walls\n
while he is awake. You cannot fight him at the\n
moment as you have no weapon.
            `,
            {
                color: 'black',
                fontSize: `${Helper.scaleWidth(22,this.w)}px`,
                align: 'center',
                fontStyle: 'bold',
                fontFamily: 'Arial'
            }
        );

        this.diedText = this.add.text(this.w/2, this.h/2, 'YOU DIED!!! 💀',{
            color: '#8B0000',
            fontStyle: 'bold',
            fontSize: `${Helper.scaleWidth(30,this.w)}px`,
        }).setOrigin(0.5).setAlpha(0);

        this.alert = this.add.text(Helper.scaleWidth(910, this.w),Helper.scaleHeight(120, this.h), '!',{
            color: 'black',
            fontStyle: 'bold',
            fontSize: `${Helper.scaleWidth(50,this.w)}px`,
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [this.player, this.background, this.exitbutton, ...this.walls, this.slab, this.knight, this.hint],
            alpha: 1,
            duration: 100,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.player.setVelocity(0);

        const {left, right} = this.cursors;
        if(left.isDown && !this.knightAttackPlayer){
            this.player.setTexture('player-left');
            this.player.setVelocityX(-this.playerSpeed);
        } else if(right.isDown && !this.knightAttackPlayer){
            this.player.setTexture('player-right');
            this.player.setVelocityX(this.playerSpeed);
        }

        this.wakeUpKnight();

        if(this.knightCatchesPlayer()){
            this.sleepTimer?.remove();
            this.killPlayer();
        }

        this.exitScene();
    }

    wakeUpKnight(){
        if(this.knightSleeping && this.timerNotRegistered && !this.knightAttackPlayer){
            this.timerNotRegistered = false;
            const time = Math.floor(Math.random() * (1501)) + 1500;
            this.time.delayedCall(time, () => {
                this.knightSleeping = false;
                this.knight.setTexture('knight-alert');
                this.knight.x = Helper.scaleWidth(900, this.w);
                this.knight.y = Helper.scaleHeight(285, this.h);
                this.alert.setAlpha(1);
                this.sleepTimer = this.time.delayedCall(3000, () => {
                    this.knightSleeping = true;
                    this.timerNotRegistered = true;
                    this.knight.setTexture('knight-sleeping');
                    this.knight.x = Helper.scaleWidth(940, this.w);
                    this.knight.y = Helper.scaleHeight(250, this.h);
                    this.alert.setAlpha(0);
                });  
            });
        }
    }

    knightCatchesPlayer(){
        if(!this.knightSleeping && !this.knightAttackPlayer){
            for(let i=0 ; i<this.walls.length ; i++){
                if(this.physics.world.overlap(this.walls[i], this.player)){
                    return false;
                }
            }
            this.knightAttackPlayer = true;
            return true;
        }
        return false;
    }

    killPlayer(){
        if(this.knightAttackPlayer){
            this.input.keyboard.enabled = false;
            this.alert.setAlpha(0);
            this.tweens.add({
                targets: this.knight,
                x: this.player.x + this.player.width/3,
                y: this.player.y + this.player.height/2,
                duration: 1000,
                ease: 'Power2',
                onComplete: () => {
                    this.diedTextAnimate = this.tweens.add({
                        targets: this.diedText,
                        alpha: 1,
                        duration: 300,
                        yoyo: true,
                        repeat: -1
                    });

                    this.tweens.add({
                        targets: this.player,
                        x: -this.w*2,
                        y: -this.player.y,
                        duration: 3000,
                        ease: 'Power2',
                        onComplete: () => {
                            this.knight.setTexture('knight-sleeping');
                            this.knight.x = Helper.scaleWidth(940, this.w);
                            this.knight.y = Helper.scaleHeight(250, this.h);
                            this.knightSleeping = true;
                            this.timerNotRegistered = true;
                            this.knightAttackPlayer = false;
                            this.player.setTexture('player-right');
                            this.player.x = this.w / 15;
                            this.player.y = this.h / 1.11;
                            this.input.keyboard.enabled = true;
                            this.input.keyboard.resetKeys();
                            this.diedTextAnimate.remove();
                            this.diedText.setAlpha(0);
                        }
                    });
                }
            });
        }
    }

    exitScene(){
        if(this.player.x > this.scale.width - Helper.scaleWidth(5, this.w)){
            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
            this.tweens.add({
                targets: fade,
                alpha: 1,
                duration: 100,
                onComplete: () => {
                    this.scene.stop();
                    this.scene.start("");
                }
            })
        }
    }
}

export default EscapeKnight;
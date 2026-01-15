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
        this.playerSpeed = 200;
        this.slab;
        this.knight;
        this.knightSleeping = true;
        this.timerNotRegistered = true;
        this.sleepTimer;
    }

    preload(){
        //temporary loading for testing.....
        this.load.image('arrows-bg','../UI Images/arrows-bg.png');
        this.load.image('player-left','../UI Images/main-character-left.png');
        this.load.image('player-right','../UI Images/main-character-right.png');

        //actual loading needed
        this.load.image('wall','../UI Images/wall.png');
        this.load.image('knight-alert','../UI Images/guard-alert.png');
        this.load.image('knight-sleeping','../UI Images/guard-sleeping.png');
    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

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

        this.tweens.add({
            targets: [this.player, this.background, this.exitbutton, ...this.walls, this.slab, this.knight],
            alpha: 1,
            duration: 100,
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.player.setVelocityX(0);

        const {left, right} = this.cursors;
        if(left.isDown){
            this.player.setVelocityX(-this.playerSpeed);
        } else if(right.isDown){
            this.player.setVelocityX(this.playerSpeed);
        }

        this.wakeUpKnight();

        if(this.knightCatchesPlayer()){
            
            this.sleepTimer?.remove();
        }
    }

    wakeUpKnight(){
        if(this.knightSleeping && this.timerNotRegistered){
            this.timerNotRegistered = false;
            const time = Math.floor(Math.random() * (2001)) + 1000;
            this.time.delayedCall(time, () => {
                this.knightSleeping = false;
                this.knight.setTexture('knight-alert');
                this.knight.x = Helper.scaleWidth(900, this.w);
                this.knight.y = Helper.scaleHeight(285, this.h);
                this.sleepTimer = this.time.delayedCall(3000, () => {
                    this.knightSleeping = true;
                    this.timerNotRegistered = true;
                    this.knight.setTexture('knight-sleeping');
                    this.knight.x = Helper.scaleWidth(940, this.w);
                    this.knight.y = Helper.scaleHeight(250, this.h);
                });  
            });
        }
    }

    knightCatchesPlayer(){
        if(!this.knightSleeping){
            this.walls.forEach(wall => {
                if(this.physics.world.overlap(wall, this.player)){
                    return false;
                }
            });
            return true;
        }
        return false;
    }
}

export default EscapeKnight;
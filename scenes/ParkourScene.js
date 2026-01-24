import Phaser from "phaser";
import Helper from "../HelperClass";

class Parkour extends Phaser.Scene{
    constructor(){
        super("parkour-scene");
        this.w;
        this.h;
        this.parkour;
        this.exitButton;
        this.title;
        this.slab1;
        this.slab2;
        this.slab3;
        this.player;
        this.playerSpeed;
        this.slabButton;
        this.slabButtonBg;
        this.hint;
        this.emitter;
    }

    init(){
        this.imageChange = true;
        this.buttonPressed = false;
        this.slabMoving = false;
        this.isDiedOnce = false;
    }
    
    preload(){
        this.load.image('parkour','../UI Images/parkour.png');
        this.load.image('player-left','../UI Images/main-character-left.png');
        this.load.image('player-right','../UI Images/main-character-right.png');

        this.load.audio('jump','../Audios/jump.wav');
        this.load.audio('enable-parkour-button','../Audios/enable-parkour-button.wav');
        this.load.audio('death','../Audios/death.wav');
    }
    
    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.playerSpeed = Helper.scaleWidth(200, this.w);

        this.emitter = this.add.particles(0, 0, 'particle', {
            speed: { min: -200, max: 200 },
            angle: { min: 0, max: 360 },
            lifespan: 1000,
            scale: { start: 1, end: 0 },
            quantity: 4,
            blendMode: 'MULTIPLY',
            tint: [0xff6600, 0xff3300, 0xcc0000],
            emitting: false
        }).setDepth(3);

        this.parkour = this.add.image(0,0,'parkour').setOrigin(0,0);
        this.parkour.setDisplaySize(this.scale.width, this.scale.height);

        this.title = this.add.text(Helper.scaleWidth(500, this.w),Helper.scaleHeight(45, this.h),"Don't fall into the LAVA!!!",{
            fontSize: `${Helper.scaleWidth(30, this.w)}px`,
            fontStyle: 'bold',
            color: 'black'
        }).setOrigin(0.5);

        this.exitButton = this.add.text(Helper.scaleWidth(90, this.w),Helper.scaleHeight(40, this.h),'EXIT',{
            fontSize: `${Helper.scaleWidth(32, this.w)}px`,
            fontFamily: 'Segoe UI',
            fontStyle: 'bold',
            backgroundColor: '#0E2A2A',
            color: '#20D38B',       
            padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#20D38B',             
                blur: 25,
                stroke: true,                 
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        this.exitButton.setInteractive({ useHandCursor: true })
        .on('pointerdown',() => {
            this.exitButton.setScale(0.9);
            this.exitButton.disableInteractive();
            this.sound.play('button-click');

            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
            this.tweens.add({
                targets: fade,
                alpha: 1,
                duration: 100,
                onComplete: () => {
                    this.exitButton.disableInteractive();
                    this.scene.stop();
                    this.scene.start('main-menu-scene');
                }
            })
        })
        .on('pointerup',() => this.exitButton.setScale(1));

        this.tweens.add({
            targets: this.exitButton,
            alpha: 1,
            duration: 100,
            ease: 'linear'
        });

        this.player = this.physics.add.image(Helper.scaleWidth(70, this.w),Helper.scaleHeight(560, this.h),'player-right').setOrigin(0.5).setDepth(1);
        this.player.setScale(1.7);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.slab1 = this.add.rectangle(
            Helper.scaleWidth(190, this.w),
            Helper.scaleHeight(520, this.h),
            Helper.scaleWidth(150, this.w),
            Helper.scaleHeight(10, this.h),
            0x000000
        ).setOrigin(0, 0);

        this.slab2 = this.add.rectangle(
            Helper.scaleWidth(410, this.w),
            Helper.scaleHeight(450, this.h),
            Helper.scaleWidth(150, this.w),
            Helper.scaleHeight(10, this.h),
            0x000000
        ).setOrigin(0, 0);

        this.slab3 = this.add.rectangle(
            Helper.scaleWidth(640, this.w),
            Helper.scaleHeight(400, this.h),
            Helper.scaleWidth(150, this.w),
            Helper.scaleHeight(10, this.h),
            0x000000
        ).setOrigin(0, 0);

        this.slabButtonBg = this.add.rectangle(this.scale.width/2.1, this.scale.height/2.4, Helper.scaleWidth(50, this.w), Helper.scaleHeight(50, this.h), 'black').setOrigin(0.5);
        this.slabButton = this.add.circle(this.scale.width/2.1, this.scale.height/2.4, Helper.scaleWidth(20, this.w), 0xff0000).setOrigin(0.5);
        this.slabButton.setInteractive({ useHandCursor: true })
        .on('pointerdown',() => {
            this.sound.play('enable-parkour-button');
            this.slabButton.setScale(0.8);
            this.buttonPressed = true;
            this.slabButton.disableInteractive();
            this.hint.setText('You can now safely\n go to the other side!');
        });

        this.hint = this.add.text(this.scale.width/4.3, this.scale.height/2.4, 'Do not press the button -->',{
            fontSize: `${Helper.scaleWidth(25, this.w)}px`,
            color: 'black',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
    }

    update(){ 
        if(this.checkIfInLava()){
            this.player.x = Helper.scaleWidth(70, this.w);
            this.player.y = Helper.scaleHeight(560, this.h);
        }

        if(!this.checkIfInAir()){
            this.player.setVelocityY(this.playerSpeed*3)
        } else{
            this.player.setVelocityY(0);
        }
        if(this.player.x < 5) this.player.x = 0;
        this.player.setVelocityX(0);

        const {left,right,up} = this.cursors;
        if(left.isDown){
            this.player.setTexture('player-left');
            this.player.setVelocityX(-this.playerSpeed*1.5);
        }
        if(right.isDown){
            this.player.setTexture('player-right');
            this.player.setVelocityX(this.playerSpeed*1.5);
        }
        if(Phaser.Input.Keyboard.JustDown(up) && this.checkIfInAir()){
            this.sound.play('jump');
            this.moveUp();
        }

        this.moveSlab();
        this.exitScene();
    }

    moveUp(){
        this.tweens.add({
            targets: this.player,
            y: this.player.y - Helper.scaleHeight(100, this.h),
            duration: 150,
            ease: 'Power2'
        });
    }

    checkIfInAir(){
        if (
            ((this.player.x < Helper.scaleWidth(5, this.w)) || 
            (this.player.x >= Helper.scaleWidth(5, this.w) && this.player.x < Helper.scaleWidth(150, this.w))) &&
            this.player.y >= Helper.scaleHeight(560, this.h) && this.player.y <= Helper.scaleHeight(565, this.h)
        ) return true;

        else if (
            ((this.player.x > this.w - Helper.scaleWidth(5, this.w)) || 
            (this.player.x >= Helper.scaleWidth(875, this.w) && this.player.x < this.w)) &&
            this.player.y >= Helper.scaleHeight(560, this.h) && this.player.y <= Helper.scaleHeight(565, this.h)
        ) return true;

        else if (
            this.player.x >= Helper.scaleWidth(170, this.w) && this.player.x < Helper.scaleWidth(360, this.w) &&
            this.player.y >= Helper.scaleHeight(497, this.h) && this.player.y <= Helper.scaleHeight(502, this.h)
        ) return true;

        else if (
            this.player.x >= Helper.scaleWidth(390, this.w) && this.player.x < Helper.scaleWidth(580, this.w) &&
            this.player.y >= Helper.scaleHeight(425, this.h) && this.player.y <= Helper.scaleHeight(432, this.h)
        ) return true;

        else if (
            this.player.x >= Helper.scaleWidth(620, this.w) && this.player.x < Helper.scaleWidth(810, this.w) &&
            this.player.y >= Helper.scaleHeight(377, this.h) && this.player.y <= Helper.scaleHeight(382, this.h) &&
            this.buttonPressed
        ) return true;

        else return false;
    }

    checkIfInLava(){
        if(this.player.x >= Helper.scaleWidth(150, this.w) && this.player.x < Helper.scaleWidth(875, this.w) && this.player.y >= Helper.scaleHeight(620, this.h)){
            this.sound.play('death');

            this.emitter.explode(40, this.player.x, this.player.y);
            
            if(!this.isDiedOnce){
                this.hint.setText('I guess you should press it!');
                this.isDiedOnce = true;
            }

            return true;
        }
        else return false;
    }

    moveSlab(){
        if(!this.slabMoving && this.player.x >= Helper.scaleWidth(600, this.w) && this.player.x < Helper.scaleWidth(810, this.w) && this.player.y >= Helper.scaleHeight(377, this.h) && this.player.y <= Helper.scaleHeight(382, this.h) && !this.buttonPressed){
            this.slabMoving = true;
            this.tweens.add({
                targets: this.slab3,
                duration: 200,
                x: Helper.scaleWidth(840, this.w),
                ease: 'linear',
                yoyo: true,
                onComplete: () => {
                    this.slabMoving = false;
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
                    this.scene.start("escape-arrows-scene");
                }
            });
        }
    }
}

export default Parkour;
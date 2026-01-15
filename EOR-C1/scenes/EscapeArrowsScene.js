import Phaser from "phaser";
import Helper from "../HelperClass";

class EscapeArrows extends Phaser.Scene{
    constructor(){
        super("escape-arrows-scene");
        this.w;
        this.h;
        this.background;
        this.player;
        this.cannons = [];
        this.playerSpeed = 300;
        this.arrows = [];
        this.hint;
        this.exitbutton;
    }

    preload(){
        this.load.image('arrows-bg','../UI Images/arrows-bg.png');
        this.load.image('arrow','../UI Images/arrow.png');
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

        const xCannons = [250,400,550,700,850];

        for(let i=0 ; i<5 ; i++){
            const arrow = this.physics.add.image(Helper.scaleWidth(xCannons[i], this.w),Helper.scaleHeight(0,this.h),'arrow').setOrigin(0.5).setAlpha(0);
            arrow.setScale(0.3);
            arrow.body.updateFromGameObject();
            arrow.body.setSize(arrow.displayWidth*0.1, arrow.displayHeight*0.9);
            const cannon = this.add.rectangle(Helper.scaleWidth(xCannons[i], this.w),Helper.scaleHeight(15,this.h),Helper.scaleWidth(100,this.w),Helper.scaleHeight(30,this.h),0x964B00).setOrigin(0.5).setAlpha(0);
            this.arrows.push(arrow);
            this.cannons.push(cannon);
        }

        this.hint = this.add.text(this.w/2, this.h/2, 'Escape The Arrows!!!',{
            color: 'black',
            fontStyle: 'bold',
            fontSize: '40px'
        }).setOrigin(0.5).setAlpha(0);

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
        
        this.tweens.add({
            targets: [this.player, this.background, ...this.arrows, ...this.cannons, this.exitbutton, this.hint],
            alpha: 1,
            duration: 100,
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        this.arrows.forEach(arrow => {
            this.tweens.add({
                targets: arrow,
                duration: 550,
                y: this.scale.height + 100,
                repeat: -1
            });
            this.physics.add.overlap(arrow, this.player, this.killPlayer, null, this);
        });

    }

    update(){
        this.player.setVelocityX(0);

        if(this.player.x < Helper.scaleWidth(5,this.w)) this.player.x = 0;

        const {left, right} = this.cursors;
        if(left.isDown){
            this.player.setTexture('player-left');
            this.player.setVelocityX(-this.playerSpeed);
        } 
        if(right.isDown){
            this.player.setTexture('player-right');
            this.player.setVelocityX(this.playerSpeed);
        }
        
        this.exitScene();
    }

    killPlayer(){
        this.player.x = this.w / 15;
        this.player.y = this.h / 1.11;
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
                    this.scene.start("escape-knight-scene");
                }
            })
        }
    }
}

export default EscapeArrows;
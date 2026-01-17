import Phaser from "phaser";
import Helper from "../HelperClass";

class Battle extends Phaser.Scene{
    constructor(){
        super("battle-scene");
        this.w;
        this.h;
        this.background;
        this.navbar;
        this.exitbutton;
        this.context;
        this.startbutton;
        this.healthText;
        this.healthbar;
        this.timer;
        this.player;
        this.playerSpeed = 300;
    }

    preload(){
        this.load.image('battlefield','../UI Images/battlefield.png');
        this.load.image('player-fight-left','../UI Images/player-fight-left.png');
        this.load.image('player-fight-right','../UI Images/player-fight-right.png');
        this.load.image('enemy-left','../UI Images/battlefield-enemy-left.png');
        this.load.image('enemy-right','../UI Images/battlefield-enemy-right.png');
    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.background = this.add.image(0,0,'battlefield').setOrigin(0,0).setAlpha(0);
        this.background.setDisplaySize(this.w, this.h);

        this.navbar = this.add.rectangle(0,0,this.w,Helper.scaleHeight(80, this.h),0x333333).setOrigin(0,0).setAlpha(0);
        this.physics.add.existing(this.navbar, true);

        this.exitbutton = this.add.text(Helper.scaleWidth(90,this.w),Helper.scaleHeight(40,this.h),'EXIT',{
            fontSize: `${Helper.scaleWidth(32, this.w)}px`,
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

        this.context = this.add.text(
            this.w/2,
            this.h/2,
            "You have been spotted by a group\nof Purple Thorn's pets. You have to fight them\nuntil the timer runs out. You have a sword.\nClick on the enemy to hit them.\nShow them what you got!!!!",
            {
                align: 'center',
                color: '#E0FFFF',
                fontSize: `${Helper.scaleWidth(40, this.w)}px`,
                lineSpacing: Helper.scaleHeight(35, this.h),
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5).setAlpha(0);
        
        this.startbutton = this.add.text(this.w/2,Helper.scaleHeight(650,this.h),'BRING IT ON!!!',{
            fontSize: `${Helper.scaleWidth(32, this.w)}px`,
            fontFamily: 'Segoe UI',
            fontStyle: 'bold',
            backgroundColor: '#0E2A2A',
            color: '#20D38B',       
            padding: { left: Helper.scaleWidth(40,this.w), right: Helper.scaleWidth(40,this.w), top: Helper.scaleHeight(10,this.h), bottom: Helper.scaleHeight(10,this.h) },
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#20D38B',             
                blur: 25,
                stroke: true,                 
                fill: true
            }
        }).setOrigin(0.5).setAlpha(0);
        this.startbutton.setInteractive({ useHandCursor: true })
        .on('pointerdown',() => {
            this.startbutton.setScale(0.9);
            this.startbutton.disableInteractive();
            this.startFight();
        })
        .on('pointerup',() => this.startbutton.setScale(1));

        this.healthText = this.add.text(
            Helper.scaleWidth(350, this.w),
            Helper.scaleHeight(40, this.h),
            'Health: ',
            {
                fontSize: `${Helper.scaleWidth(30, this.w)}px`,
            }
        ).setOrigin(0.5).setAlpha(0);

        const dummyHealthBar = this.add.rectangle(this.w/1.9, Helper.scaleHeight(40, this.h), Helper.scaleWidth(220, this.w), Helper.scaleHeight(50, this.h), 0x000000).setOrigin(0.5).setAlpha(0);

        this.healthbar = this.add.rectangle(this.w/1.9, Helper.scaleHeight(40, this.h), Helper.scaleWidth(205, this.w), Helper.scaleHeight(30, this.h), 0xFF0000).setOrigin(0.5).setAlpha(0);

        this.timer = this.add.text(
            Helper.scaleWidth(850, this.w),
            Helper.scaleHeight(40, this.h),
            'Time: 02:00',
            {
                fontSize: `${Helper.scaleWidth(30, this.w)}px`,
            }
        ).setOrigin(0.5).setAlpha(0);

        this.player = this.physics.add.image(this.w/2, this.h/2, 'player-fight-right').setOrigin(0.5).setAlpha(1);
        this.player.setScale(0.5);
        this.player.body.setSize(this.player.displayWidth/4, this.player.displayHeight);
        this.player.body.setOffset(this.player.body.offset.x, this.player.body.offset.y + Helper.scaleHeight(50, this.h));

        this.physics.add.collider(this.player, this.navbar, () => {this.player.setVelocity(0)});
        this.player.setCollideWorldBounds(true);

        this.tweens.add({
            targets: [this.background, this.navbar, this.exitbutton, this.context, this.startbutton, this.healthText, dummyHealthBar, this.healthbar, this.timer],
            duration: 100,
            alpha: 1
        });

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.player.setVelocity(0);

        const {left, right, up, down} = this.cursors;
        if(left.isDown){
            this.player.setTexture('player-fight-left');
            this.player.setVelocityX(-this.playerSpeed/1.5);
        }
        if(right.isDown){
            this.player.setTexture('player-fight-right');
            this.player.setVelocityX(this.playerSpeed/1.5);
        }
        if(up.isDown){
            this.player.setVelocityY(-this.playerSpeed);
        }
        if(down.isDown){
            this.player.setVelocityY(this.playerSpeed);
        }
    }

    startFight(){
        this.context.setAlpha(0);
        this.startbutton.setAlpha(0);
        this.player.setAlpha(1);
    }
}

export default Battle;
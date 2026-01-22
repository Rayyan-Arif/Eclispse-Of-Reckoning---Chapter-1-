import Phaser from "phaser";
import Helper from "../HelperClass";

class Maze extends Phaser.Scene{
    constructor(){
        super("maze-scene");
        this.w;
        this.h;
        this.background;
        this.maze = [
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
            [1,0,0,0,1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,1,0,0,0,0,1,0,0,1],
            [1,1,1,0,1,0,1,1,1,0,1,0,1,0,1,1,1,1,0,1,0,1,1,1,1,0,1,1,0,1],
            [1,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,0,0,1,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,1,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
            [1,0,0,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1],
            [1,1,1,1,0,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1],
            [1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,1],
            [1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,0,1,1,1,1,1,1],
            [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
            [1,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1],
            [1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
            [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
            [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1],
        ];

        this.mazeTiles = [];
        this.player;
        this.playerSpeed = 300;
        this.exitbutton;
        this.gun;
        this.hint;
        this.arrow;
    }

    preload(){
        this.load.image('gun','../UI Images/gun.png');

        this.load.audio('success','../Audios/success.wav');
    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;
        
        this.background = this.add.rectangle(0,0,this.w,this.h,0x008000).setOrigin(0).setAlpha(0);

        let rectWidth = Helper.scaleWidth(25, this.w);  
        let rectHeight = Helper.scaleHeight(25, this.h); 

        for(let i=0 ; i<this.maze.length ; i++){
            for(let j=0 ; j<this.maze[i].length ; j++){
                if(this.maze[i][j] === 1){
                    let rectX = Helper.scaleWidth((i+5)*25, this.w);
                    let rectY = Helper.scaleHeight((j+0.85)*25, this.h);
                    const rectangle = this.add.rectangle(rectX, rectY, rectWidth, rectHeight, 0x000000).setAlpha(0);
                    this.physics.add.existing(rectangle, true);
                    this.mazeTiles.push(rectangle);
                }
            }
        }

        this.player = this.physics.add.image(this.w/20, this.h/2, 'player-right').setOrigin(0.5).setAlpha(0);
        this.player.setScale(0.4);
        this.player.setDepth(2);
        this.player.setPostPipeline('GlowFX');
        this.player.postFX.addGlow(0xffff00, 4, 0, false, 0.1);

        this.player.body.setSize(
            this.player.displayWidth/3, this.player.displayHeight/1.6
        );

        this.player.body.setOffset(
            this.player.body.offset.x - Helper.scaleWidth(1, this.w),
            this.player.body.offset.y - Helper.scaleHeight(8, this.h)
        );

        this.exitbutton = this.add.text(Helper.scaleWidth(930,this.w),Helper.scaleHeight(40,this.h),'EXIT',{
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
            this.sound.play('button-click');

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

        this.gun = this.add.image(Helper.scaleWidth(930, this.w),Helper.scaleHeight(200,this.h),'gun').setOrigin(0.5).setAlpha(0);
        this.gun.setScale(0.2);  
        this.physics.add.existing(this.gun, true);
        this.gun.body.setSize(this.gun.displayWidth/1.1, this.gun.displayHeight/1.2);

        this.hint = this.add.text(
            this.w/1.1,
            Helper.scaleHeight(500, this.h),
            'Complete\nthe\nmaze\nand\ntake\nthe\ngun!',
            {
                fontSize: `${Helper.scaleWidth(30,this.w)}px`,
                fontFamily: 'Arial',
                color: 'black',
                fontStyle: 'bold',
                align: 'center'
            }
        ).setOrigin(0.5).setAlpha(0);

        this.arrow = this.add.text(
            Helper.scaleWidth(50, this.w),
            Helper.scaleHeight(300, this.h),
            '↓',
            {
                fontSize: `${Helper.scaleWidth(60,this.w)}px`,
                color: 'black',
                fontFamily: 'Arial',
                fontStyle: 'bold',
                align: 'center',
                lineSpacing: 0
            }
        ).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [this.background, ...this.mazeTiles, this.player, this.exitbutton, this.gun, this.hint, this.arrow],
            duration: 100,
            alpha: 1
        });

        for(let i=0 ; i<this.mazeTiles.length ; i++){
            this.physics.add.collider(this.player, this.mazeTiles[i]);
        }

        this.physics.add.collider(this.player, this.gun, () => {
            this.sound.play('success');
            this.exitScene();
        });

        this.player.setCollideWorldBounds(true);

        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update(){
        this.player.setVelocity(0);

        const {left, right, up, down} = this.cursors;
        if(left.isDown){
            this.player.setTexture('player-left');
            this.player.setVelocityX(-this.playerSpeed/1.5);
        } else if(right.isDown){
            this.player.setTexture('player-right');
            this.player.setVelocityX(this.playerSpeed/1.5);
        } else if(up.isDown){
            this.player.setVelocityY(-this.playerSpeed);
        } else if(down.isDown){
            this.player.setVelocityY(this.playerSpeed);
        }
    }

    exitScene(){
        const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0).setDepth(3);
        this.tweens.add({
            targets: fade,
            alpha: 1,
            duration: 300,
            onComplete: () => {
                this.scene.stop();
                this.scene.start("battle-scene");
            }
        })
    }
}

export default Maze;
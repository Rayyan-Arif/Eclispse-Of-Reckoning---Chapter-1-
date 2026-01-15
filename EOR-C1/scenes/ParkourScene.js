import Phaser from "phaser";

class Parkour extends Phaser.Scene{
    constructor(){
        super("parkour-scene");
        this.imageChange = true;
        this.parkour;
        this.exitButton;
        this.title;
        this.slab1;
        this.slab2;
        this.slab3;
        this.player;
        this.playerSpeed = 200;
        this.buttonPressed = false;
        this.slabMoving = false;
        this.slabButton;
        this.slabButtonBg;
        this.hint;
    }
    
    preload(){
        this.load.image('parkour','../UI Images/parkour.png');
        this.load.image('player-left','../UI Images/main-character-left.png');
        this.load.image('player-right','../UI Images/main-character-right.png');
    }
    
    create(){
        this.parkour = this.add.image(0,0,'parkour').setOrigin(0,0);
        this.parkour.setDisplaySize(this.scale.width, this.scale.height);

        this.title = this.add.text(500,45,"Don't fall into the LAVA!!!",{
            fontSize: '30px',
            fontStyle: 'bold',
            color: 'black'
        }).setOrigin(0.5);

        this.exitButton = this.add.text(90,40,'EXIT',{
            fontSize: '32px',
            fontFamily: 'Segoe UI',
            fontStyle: 'bold',
            backgroundColor: '#0E2A2A',
            color: '#20D38B',       
            padding: { left: 50, right: 50, top: 10, bottom: 10 },
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

        this.player = this.physics.add.image(70,560,'player-right').setOrigin(0.5);
        this.player.setScale(1.7);

        this.cursors = this.input.keyboard.createCursorKeys();

        this.slab1 = this.add.rectangle(190, 520, 150, 10, 0x000000).setOrigin(0,0);
        this.slab2 = this.add.rectangle(410, 450, 150, 10, 0x000000).setOrigin(0,0);
        this.slab3 = this.add.rectangle(640, 400, 150, 10, 0x000000).setOrigin(0,0);

        this.slabButtonBg = this.add.rectangle(this.scale.width/2.1, this.scale.height/2.4, 50, 50, 'black').setOrigin(0.5);
        this.slabButton = this.add.circle(this.scale.width/2.1, this.scale.height/2.4, 20, 0xff0000).setOrigin(0.5);
        this.slabButton.setInteractive({ useHandCursor: true })
        .on('pointerdown',() => {
            this.slabButton.setScale(0.8);
            this.buttonPressed = true;
            this.slabButton.disableInteractive();
            this.hint.setText('You can now safely\n go to the other side!');
        });

        this.hint = this.add.text(this.scale.width/4.3, this.scale.height/2.4, 'Is this button dangerous? -->',{
            fontSize: '25px',
            color: 'black',
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
    }

    update(){
        if(this.checkIfInLava()){
            this.player.x = 70;
            this.player.y = 560;
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
            this.moveUp();
        }

        this.moveSlab();
        this.exitScene();
    }

    moveUp(){
        this.tweens.add({
            targets: this.player,
            y: this.player.y - 100,
            duration: 150,
            ease: 'Power2'
        });
    }

    checkIfInAir(){
        if(((this.player.x < 5) || (this.player.x >= 5 && this.player.x < 153)) && this.player.y >= 555 && this.player.y <= 570) return true;
        else if(((this.player.x > this.scale.width - 5) ||  (this.player.x >= 875 && this.player.x < this.scale.width)) && this.player.y >= 560 && this.player.y <= 565) return true;
        else if(this.player.x >= 170 && this.player.x < 360 && this.player.y >= 497 && this.player.y <= 502) return true;
        else if(this.player.x >= 390 && this.player.x < 580 && this.player.y >= 425 && this.player.y <= 432) return true;
        else if(this.player.x >= 620 && this.player.x < 810 && this.player.y >= 377 && this.player.y <= 382 && this.buttonPressed) return true;
        else return false;
    }

    checkIfInLava(){
        if(this.player.x >= 153 && this.player.x < 875 && this.player.y >= 620) return true;
        else return false;
    }

    moveSlab(){
        if(!this.slabMoving && this.player.x >= 600 && this.player.x < 810 && this.player.y >= 377 && this.player.y <= 382 && !this.buttonPressed){
            this.slabMoving = true;
            this.tweens.add({
                targets: this.slab3,
                duration: 200,
                x: 840,
                ease: 'linear',
                yoyo: true,
                onComplete: () => {
                    this.slabMoving = false;
                }
            });
        }
    }

    exitScene(){
        if(this.player.x > this.scale.width - 5){
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
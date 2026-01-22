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
        this.enemies = [];
        this.newTextureEnemy = [];
        this.bullet;
        this.fightStarted = false;
        this.isDamaged = false;
        this.timerCount;
        this.timeEnded = false;
        this.isReloading = false;
        this.showReloading;
        this.canMove = true;
    }

    preload(){
        this.load.image('battlefield','../UI Images/battlefield.png');
        this.load.image('player-fight-left','../UI Images/player-fight-left.png');
        this.load.image('player-fight-right','../UI Images/player-fight-right.png');
        this.load.image('enemy-left','../UI Images/battlefield-enemy-left.png');
        this.load.image('enemy-right','../UI Images/battlefield-enemy-right.png');
        this.load.image('bullet','../UI Images/bullet.png');

        this.load.audio('button-click','../Audios/button-click.wav');
        this.load.audio('shoot','../Audios/shoot.wav');
        this.load.audio('damage','../Audios/damage.wav');
        this.load.audio('win','../Audios/win.wav');
    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.background = this.add.image(0,0,'battlefield').setOrigin(0,0).setAlpha(0);
        this.background.setDisplaySize(this.w, this.h);

        this.navbar = this.add.rectangle(0,0,this.w,Helper.scaleHeight(80, this.h),0x333333).setOrigin(0,0).setAlpha(0).setDepth(1);
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
        }).setOrigin(0.5).setAlpha(0).setDepth(1);
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
            });
        })
        .on('pointerup',() => this.exitbutton.setScale(1));

        this.context = this.add.text(
            this.w/2,
            this.h/2,
            "You have been spotted by a group\nof Purple Thorn's pets. You have to fight them\nuntil the timer runs out. You have a gun.\nClick on the screen to shoot bullet in that direction.\nShow them what you got!!!!",
            {
                align: 'center',
                color: '#E0FFFF',
                fontSize: `${Helper.scaleWidth(40, this.w)}px`,
                lineSpacing: Helper.scaleHeight(35, this.h),
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5).setAlpha(0);
        
        this.startbutton = this.add.text(this.w/2,Helper.scaleHeight(650,this.h),'BRING IT ON!!!',{
            fontSize: `${Helper.scaleWidth(25, this.w)}px`,
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
            this.sound.play('button-click');

            this.input.setDefaultCursor('default');
            this.time.delayedCall(0, () => {this.fightStarted = true});

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
        ).setOrigin(0.5).setAlpha(0).setDepth(1);

        const dummyHealthBar = this.add.rectangle(this.w/1.9, Helper.scaleHeight(40, this.h), Helper.scaleWidth(220, this.w), Helper.scaleHeight(50, this.h), 0x000000).setOrigin(0.5).setAlpha(0).setDepth(1);

        this.healthbar = this.add.rectangle(this.w/1.9, Helper.scaleHeight(40, this.h), Helper.scaleWidth(205, this.w), Helper.scaleHeight(30, this.h), 0xFF0000).setOrigin(0.5).setAlpha(0).setDepth(1);

        this.timer = this.add.text(
            Helper.scaleWidth(850, this.w),
            Helper.scaleHeight(40, this.h),
            'Time: 02:00',
            {
                fontSize: `${Helper.scaleWidth(30, this.w)}px`,
            }
        ).setOrigin(0.5).setAlpha(0).setDepth(1);

        this.player = this.physics.add.image(this.w/2, this.h/2, 'player-fight-right').setOrigin(0.5).setAlpha(0);
        this.player.setScale(0.3);
        this.player.body.setSize(this.player.displayWidth/1.1, this.player.displayHeight*2.6);
        this.player.body.setOffset(this.player.body.offset.x - Helper.scaleWidth(120, this.w), this.player.body.offset.y + Helper.scaleHeight(10, this.h));

        this.physics.add.collider(this.player, this.navbar, () => {this.player.setVelocity(0)});
        this.player.setCollideWorldBounds(true);

        for(let i=0 ; i<5 ; i++){
            const enemy = this.physics.add.image(this.w/2, this.h/2, 'enemy-right').setOrigin(0.5).setAlpha(0);
            enemy.setScale(1.5);
            enemy.body.setSize(enemy.width/5, enemy.height/1.5);
            enemy.body.setOffset(enemy.body.offset.x - Helper.scaleWidth(5, this.w), enemy.body.offset.y - Helper.scaleHeight(15, this.h));
            this.generatePositionEnemy(enemy);
            this.enemies.push(enemy);
            this.newTextureEnemy.push('enemy-left');
        }

        this.bullet = this.physics.add.image(this.w/2, this.h/2, 'bullet').setOrigin(0.5).setAlpha(0);
        this.bullet.setScale(2.5);
        this.bullet.body.setSize(this.bullet.displayWidth/30, this.bullet.displayHeight/30);
        this.bullet.body.setOffset(this.bullet.body.offset.x - Helper.scaleWidth(3, this.w), this.bullet.body.offset.y - Helper.scaleHeight(6, this.h));

        this.showReloading = this.add.text(this.w/2, this.h/1.1, 'reloading....',{
            align: 'center',
            color: '#E0FFFF',
            fontSize: `${Helper.scaleWidth(30, this.w)}px`,
            fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: [this.background, this.navbar, this.exitbutton, this.context, this.startbutton, this.healthText, dummyHealthBar, this.healthbar, this.timer],
            duration: 100,
            alpha: 1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        for(let i=0 ; i<5 ; i++){
            this.physics.add.overlap(this.player, this.enemies[i], this.damagePlayer, null, this);
        }

        this.input.mouse.disableContextMenu();

        this.input.on('pointerdown', (pointer) => {
            if(pointer.rightButtonDown()) return;
            if(!this.isReloading) this.fireBullet(pointer.x, pointer.y);
        });

        for(let i=0 ; i<5 ; i++){
            for(let j=i+1 ; j<5 ; j++){
                this.physics.add.collider(this.enemies[i], this.enemies[j], () => {
                    this.enemies[j].setVelocity(0);
                });
            }
        }

        this.bulletSound = this.sound.add('shoot');
    }

    update(){
        this.player.setVelocity(0);

        const {left, right, up, down} = this.cursors;
        
        if(this.canMove){
            if(left.isDown){
                if(this.player.texture.key !== 'player-fight-left'){
                    this.player.body.setOffset(this.player.body.offset.x + Helper.scaleWidth(230, this.w), this.player.body.offset.y);
                    this.player.setTexture('player-fight-left');
                }
                this.player.setVelocityX(-this.playerSpeed/1.5);
            }
            if(right.isDown){
                if(this.player.texture.key !== 'player-fight-right'){
                    this.player.body.setOffset(this.player.body.offset.x - Helper.scaleWidth(230, this.w), this.player.body.offset.y);
                    this.player.setTexture('player-fight-right');
                }
                this.player.setVelocityX(this.playerSpeed/1.5);
            }
            if(up.isDown){
                this.player.setVelocityY(-this.playerSpeed);
            }
            if(down.isDown){
                this.player.setVelocityY(this.playerSpeed);
            }
        }

        if(this.fightStarted){
            this.updateEnemyPosition();
            this.updateTimer();
        }

        if(this.isReloading){
            for(let i=0 ; i<5 ; i++){
                if(this.physics.world.overlap(this.enemies[i], this.bullet)) this.generatePositionEnemy(this.enemies[i]);
            }
        }
    }

    startFight(){
        this.context.setAlpha(0);
        this.startbutton.setAlpha(0);
        this.player.setAlpha(1);

        for(let i=0 ; i<5 ; i++){
            this.enemies[i].setAlpha(1);
            this.physics.moveToObject(this.enemies[i], this.player, 150);
        }

        const time = 2 * 60 * 1000;
        this.timerCount = this.time.delayedCall(time, () => {this.exitScene()});
    }

    generatePositionEnemy(enemy){
        const random = Math.floor(Math.random() * 4);
        
        if(random === 0){
            enemy.x = Math.random() * this.w;
            enemy.y = -this.h * 1.1;
        } else if(random === 1){
            enemy.x = Math.random() * this.w;
            enemy.y = this.h * 1.1;
        } else if(random === 2){
            enemy.x = Math.random() * this.h;
            enemy.y = -this.w * 1.1;
        } else if(random === 3){
            enemy.x = Math.random() * this.h;
            enemy.y = this.w * 1.1;
        }
    }

    updateEnemyPosition(){
        if(!this.timeEnded){
            for(let i=0 ; i<5 ; i++){
                this.physics.moveToObject(this.enemies[i], this.player, 150);

                if(this.enemies[i].x > this.player.x) {
                    this.enemies[i].setTexture('enemy-left');
                }
                else if(this.enemies[i].x < this.player.x){
                    this.enemies[i].setTexture('enemy-right');
                }
                
                if(this.enemies[i].texture.key === this.newTextureEnemy[i]){
                    if(this.newTextureEnemy[i] === 'enemy-left'){
                        this.newTextureEnemy[i] = 'enemy-right';
                        this.enemies[i].body.setOffset(this.enemies[i].body.offset.x + Helper.scaleWidth(5, this.w), this.enemies[i].body.offset.y);
                    } else {
                        this.newTextureEnemy[i] = 'enemy-left';
                        this.enemies[i].body.setOffset(this.enemies[i].body.offset.x - Helper.scaleWidth(5, this.w), this.enemies[i].body.offset.y);
                    }
                } else {
                    this.enemies[i].body.setOffset(this.enemies[i].body.offset.x, this.enemies[i].body.offset.y);
                }
            }
        }
    }

    fireBullet(px,py){
        if(this.fightStarted && !this.isReloading){
            this.bulletSound.play();

            this.isReloading = true;
            this.bullet.x = this.player.x;
            this.bullet.y = this.player.y;
            this.bullet.setAlpha(1);

            this.fadeInOut = this.tweens.add({
                targets: this.showReloading,
                alpha: 1,
                duration: 100,
                yoyo: true,
                repeat: -1
            });

            const bulletSpeed = 1000;

            let angle = Phaser.Math.Angle.Between(this.player.x, this.player.y, px, py);
            this.physics.velocityFromRotation(angle, bulletSpeed, this.bullet.body.velocity); 

            this.time.delayedCall(1000, () => {
                this.bullet.x = this.player.x;
                this.bullet.y = this.player.y;
                this.bullet.setAlpha(0);
                this.isReloading = false;
                this.fadeInOut.remove();
                this.showReloading.setAlpha(0);
            });
        }
    }

    damagePlayer(){
        if(this.healthbar.scaleX > 0){
            if(!this.isDamaged){
                this.healthbar.scaleX -= 0.125;
                this.isDamaged = true;
                this.sound.play('damage');
                this.time.delayedCall(3000, () => {this.isDamaged = false});
            }
        } else {
            this.killPlayer();
        }
    }

    updateTimer(){
        const time = Math.floor(this.timerCount.getRemaining() / 1000);
        const min = Math.floor(time / 60);
        const sec = Math.floor(time) % 60;
        this.timer.setText(`Time: 0${min}:${sec < 10 ? '0' : ''}${sec}`);
    }

    exitScene(){
        if(this.timerCount.getRemaining() === 0){
            this.timeEnded = true;

            this.sound.play('win');

            for(let i=0 ; i<5 ; i++) this.generatePositionEnemy(this.enemies[i]);

            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0).setDepth(4);
                this.time.delayedCall(3000, () => {

                this.tweens.add({
                    targets: fade,
                    alpha: 1,
                    duration: 1000,
                    onComplete: () => {
                        this.scene.stop();
                        this.scene.start('character-thinking-2-scene');
                    }
                });
            });
        }
    }

    killPlayer(){
        this.fightStarted = false;
        this.isDamaged = false;
        this.timeEnded = false;
        this.isReloading = false;

        this.canMove = false;

        this.healthText.setText('You Died!');

        this.sound.play('death');

        for(let i=0 ; i<5 ; i++){
            this.enemies[i].setVelocity(0);
        }

        this.time.delayedCall(3000, () => {
            this.healthbar.scaleX = 1;
            this.timer.setText('Time: 02:00');
            this.context.setAlpha(1);
            this.player.setAlpha(0);

            this.startbutton.setAlpha(1);
            this.startbutton.setInteractive({useHandCursor: true});
            this.startbutton.setScale(1);

            for(let i=0 ; i<5 ; i++){
                this.generatePositionEnemy(this.enemies[i]);
                this.enemies[i].setAlpha(0);
                this.physics.moveToObject(this.enemies[i], this.player, 0);
            }

            this.canMove = true;

            this.healthText.setText('Health: ');
            this.player.x = this.w/2;
            this.player.y = this.h/2;
            this.player.setTexture('player-fight-right');
        });
    }
}

export default Battle;
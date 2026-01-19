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
        this.newTexture = [];
        this.sword;
        this.fightStarted = true;
        this.isDamaged = false;
    }

    preload(){
        //temporary
        this.load.image('sword','../UI Images/sword.png');
        //actual
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
            "You have been spotted by a group\nof Purple Thorn's pets. You have to fight them\nuntil the timer runs out. You have a magical sword \nthat you can throw infinite amount of times\nand still have it in your hands. Click on the screen\nand the sword will be released in that direction.\nIf it hit the enemy, it will kill\nthe enemy. Show them what you got!!!!",
            {
                align: 'center',
                color: '#E0FFFF',
                fontSize: `${Helper.scaleWidth(30, this.w)}px`,
                lineSpacing: Helper.scaleHeight(35, this.h),
                fontFamily: 'Arial'
            }
        ).setOrigin(0.5).setAlpha(0);
        
        this.startbutton = this.add.text(this.w/2,Helper.scaleHeight(700,this.h),'BRING IT ON!!!',{
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
            this.input.setDefaultCursor('default');
            this.fightStarted = true;
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
        this.player.setScale(0.5);
        this.player.body.setSize(this.player.displayWidth/4, this.player.displayHeight);
        this.player.body.setOffset(this.player.body.offset.x, this.player.body.offset.y + Helper.scaleHeight(50, this.h));

        this.physics.add.collider(this.player, this.navbar, () => {this.player.setVelocity(0)});
        this.player.setCollideWorldBounds(true);

        for(let i=0 ; i<7 ; i++){
            const enemy = this.physics.add.image(this.w/2, this.h/2, 'enemy-right').setOrigin(0.5).setAlpha(1);
            enemy.setScale(1.5);
            enemy.body.setSize(enemy.width/5, enemy.height/1.5);
            enemy.body.setOffset(enemy.body.offset.x - Helper.scaleWidth(5, this.w), enemy.body.offset.y - Helper.scaleHeight(15, this.h));
            this.generatePositionEnemy(enemy);
            this.enemies.push(enemy);
            this.newTexture.push('enemy-left');
        }

        this.sword = this.physics.add.image(this.player.x, this.player.y, 'sword').setOrigin(0.5).setScale(0.26);
        this.sword.body.setSize(this.sword.width/15, this.sword.height/1.1);

        this.tweens.add({
            targets: [this.background, this.navbar, this.exitbutton, this.context, this.startbutton, this.healthText, dummyHealthBar, this.healthbar, this.timer],
            duration: 100,
            alpha: 1
        });

        this.cursors = this.input.keyboard.createCursorKeys();

        for(let i=0 ; i<7 ; i++){
            this.physics.add.overlap(this.player, this.enemies[i], this.damagePlayer, null, this);
        }

        this.input.on('pointerdown', (pointer) => {
            this.throwSword(pointer.x, pointer.y);
        });
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

        if(this.fightStarted) this.updateEnemyPosition();
    }

    startFight(){
        this.context.setAlpha(0);
        this.startbutton.setAlpha(0);
        this.player.setAlpha(1);
        for(let i=0 ; i<7 ; i++){
            this.enemies[i].setAlpha(1);
        }
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
        for(let i=0 ; i<7 ; i++){
            if(this.enemies[i].x > this.player.x) {
                this.enemies[i].x -= 0.8;
                this.enemies[i].setTexture('enemy-left');
            }
            else if(this.enemies[i].x < this.player.x){
                this.enemies[i].x += 0.8;
                this.enemies[i].setTexture('enemy-right');
            }

            if(this.enemies[i].y > this.player.y) this.enemies[i].y -= 0.8;
            else if(this.enemies[i].y < this.player.y) this.enemies[i].y += 0.8;
            
            if(this.enemies[i].texture.key === this.newTexture[i]){
                if(this.newTexture[i] === 'enemy-left'){
                    this.newTexture[i] = 'enemy-right';
                    this.enemies[i].body.setOffset(this.enemies[i].body.offset.x + Helper.scaleWidth(5, this.w), this.enemies[i].body.offset.y);
                } else {
                    this.newTexture[i] = 'enemy-left';
                    this.enemies[i].body.setOffset(this.enemies[i].body.offset.x - Helper.scaleWidth(5, this.w), this.enemies[i].body.offset.y);
                }
            } else {
                this.enemies[i].body.setOffset(this.enemies[i].body.offset.x, this.enemies[i].body.offset.y);
            }
        }
    }

    throwSword(px,py){
        let angle = Math.atan2(this.h/2 - py, px - this.w/2) * 180 / Math.PI;
        if(angle < 0) angle += 360;
        this.sword.setAngle(-angle + 90);
        const ox = this.sword.x;
        const oy = this.sword.y;
        this.tweens.add({
            targets: this.sword,
            duration: 3000,
            x: px * 5,
            y: py * 5,
            onUpdate: () => {
                for(let i=0 ; i<7 ; i++){
                    if(this.physics.world.overlap(this.sword, this.enemies[i])) this.generatePositionEnemy(this.enemies[i]);
                }
            },
            onComplete: () => {
                this.sword.x = ox;
                this.sword.y = oy;
            }
        });
    }

    damagePlayer(){
        if(this.healthbar.scaleX > 0){
            if(!this.isDamaged){
                this.healthbar.scaleX -= 0.25;
                this.isDamaged = true;
            }
            // this.generatePositionEnemy(this.enemies[i]);
            this.isDamaged = false;
        }
    }
}

export default Battle;
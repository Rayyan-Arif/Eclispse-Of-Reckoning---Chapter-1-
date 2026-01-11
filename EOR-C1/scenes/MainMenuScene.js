import Phaser from 'phaser';

class MainMenu extends Phaser.Scene{
    constructor(){
        super("main-menu-scene");
        this.title;
        this.subtitle;
        this.play;
        this.credits;
        this.player;
        this.enemy;
        this.knight;
        this.heightTracker = 0;
    }

    preload(){
        this.load.image("background","../UI Images/background.png");
        this.load.image("player","../UI Images/angrypose.png");
        this.load.image("enemy","../UI Images/angryenemy.png");
        this.load.image("knight","../UI Images/guard-alert.png");
        this.load.image('particle', '../UI Images/particle.png');
    }

    create(){
        const background = this.add.image(0,0,"background").setOrigin(0,0);
        const scaleX = this.scale.width / background.width;
        const scaleY = this.scale.height / background.height;
        background.setScale(Math.max(scaleX,scaleY));

        this.title = this.add.text(this.scale.width / 2, -200, "ECLIPSE OF\nRECKONING", {
            fontSize: '4.5rem',
            fontFamily: 'Segoe UI',
            fontStyle: 'bold',
            align: 'center',
            color: '#20D38B',
            lineSpacing: 20,
            stroke: '#ffffff',
            strokeThickness: 3,
            shadow: { x: 3, y: 3, color: '#000000', blur: 10, stroke: false, fill: true }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: this.title,
            y: this.scale.height/4,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.subtitle = this.add.text(this.scale.width/2, -this.scale.height, "The Resistive Force",{
            fontSize: '30px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 20,
        });
        this.subtitle.setOrigin(0.5);

        this.tweens.add({
            targets: this.subtitle,
            y: this.scale.height/2.5,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.play = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'PLAY',
            {
                fontSize: '36px',
                fontFamily: 'Segoe UI',
                fontStyle: 'bold',
                color: '#ffffff',               // text color
                backgroundColor: '#00874E',     // base button color
                stroke: '#20D38B',              // border color
                strokeThickness: 3,
                padding: { left: 50, right: 50, top: 10, bottom: 10 },
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#20D38B',          // glow color
                    blur: 30,                  // makes the button “glow” around edges
                    stroke: true,              // apply glow around the border
                    fill: true
                }
            }
        ).setOrigin(0.5);
        this.play.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>{
          this.play.setScale(0.9);
          const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
          this.tweens.add({
            targets: fade,
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                this.scene.stop();
            }
          })
        })
        .on('pointerup',()=>this.play.setScale(1))

        this.tweens.add({
            targets: this.play,
            y: this.scale.height/1.5,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.credits = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'CREDITS',
            {
                fontSize: '32px',                  // slightly bigger for emphasis
                fontFamily: 'Segoe UI',            // modern clean font
                fontStyle: 'bold',
                color: '#ffffff',                  // text color
                backgroundColor: '#0E2A2A',       // dark base background
                stroke: '#20D38B',                 // bright green border
                strokeThickness: 3,
                padding: { left: 30, right: 30, top: 10, bottom: 10 },
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#20D38B',             // glow around the button
                    blur: 25,
                    stroke: true,                 // glow along the button border
                    fill: true
                }
            }
        ).setOrigin(0.5)
        this.credits.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>this.credits.setScale(0.9))
        .on('pointerup',()=>this.credits.setScale(1))

        this.tweens.add({
            targets: this.credits,
            y: this.scale.height/1.3,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.player = this.add.image(-this.scale.width, this.scale.height, "player").setOrigin(0,1);
        
        this.enemy = this.add.image(this.scale.width, this.scale.height, "enemy").setOrigin(0,1);

        this.knight = this.add.image(this.scale.width, this.scale.height/0.7, "knight").setOrigin(0,1);
        this.knight.setPipeline('TextureTintPipeline'); // optional for Phaser 3.60+
        this.knight.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);
        this.knight.setScale(8);

        const pHeight = this.player.displayHeight;
        const eHeight = this.enemy.displayHeight;
        const kHeight = this.knight.displayHeight;

        this.time.addEvent({
            delay: 500,         
            callback: () => {
                if(this.heightTracker === 0){
                    this.player.displayHeight *= 1.02;
                    this.enemy.displayHeight *= 1.02;
                    this.knight.displayHeight *= 1.02;
                } else{
                    this.player.displayHeight = pHeight;
                    this.enemy.displayHeight = eHeight;
                    this.knight.displayHeight = kHeight;
                }
                this.heightTracker = (this.heightTracker+1)%2;
            },
            callbackScope: this,
            loop: true          
        });

        this.tweens.add({
            targets: this.player,
            x: this.scale.width*0.01,            
            duration: 1000,     
            ease: 'Power2'     
        });

        this.tweens.add({
            targets: this.enemy,
            x: this.scale.width/1.6,            
            duration: 1000,     
            ease: 'Power2'     
        });

        this.tweens.add({
            targets: this.knight,
            x: this.scale.width/3.5,            
            duration: 1000,     
            ease: 'Power2'     
        });

        const widths = [
            100,190,250,100,370,550,735,770,815,900
        ];

        const heights = [
            100,300,620,700,100,370,250,650,700,175
        ];

        for(let i=0 ; i<10 ; i++){
            const particle = this.add.image(widths[i],heights[i],'particle');
            this.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    update(){

    }

    getRandomWidth(){
        return Math.floor(Math.random()*this.scale.width + 1);
    }

    getRandomHeight(){
        return Math.floor(Math.random()*this.scale.height + 1);
    }
}

export default MainMenu;
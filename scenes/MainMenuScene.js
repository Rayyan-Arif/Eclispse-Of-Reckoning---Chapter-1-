import Phaser from 'phaser';
import Helper from '../HelperClass';

class MainMenu extends Phaser.Scene{
    constructor(){
        super("main-menu-scene");
        this.w;
        this.h;
        this.background;
        this.title;
        this.subtitle;
        this.play;
        this.credits;
        this.player;
        this.enemy;
        this.knight;
        this.theme;
        this.decoration;
        this.startOnClick;
        this.overlay;
    }

    init(){
        this.heightTracker = 0;
    }

    preload(){

    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.overlay = this.add.rectangle(0,0,this.w,this.h,0x000000).setOrigin(0,0).setAlpha(0.7).setDepth(1);

        this.startOnClick = this.add.text(this.w/2, this.h/2, 'Click anywhere to start!',{
            fontSize: `${Helper.scaleWidth(40, this.w)}px`,
            fontFamily: 'Arial',
            fontStyle: 'bold italic'
        }).setOrigin(0.5).setDepth(2);

        this.background = this.add.image(0,0,"background").setOrigin(0,0);
        this.background.setDisplaySize(this.w, this.h);

        if(Helper.startGame){
            this.startGame();
        } else {
            this.input.once('pointerdown',() => {
                Helper.startGame = true;
                this.startGame();
            });
        }
    }

    update(){

    }

    startGame(){
        this.startOnClick.setAlpha(0);
        this.overlay.setAlpha(0);

        if(!this.sound.get('theme')){
            this.theme = this.sound.add('theme', {loop: true, volume: 0.2});
            this.theme.play();
        }

        this.decoration = this.add.image(this.w/2, this.h/1.9, 'decoration').setOrigin(0.5); 

        this.title = this.add.text(this.w / 2, Helper.scaleHeight(-200, this.h), "ECLIPSE OF\nRECKONING", {
            fontSize: `${Helper.scaleWidth(70, this.w)}px`,
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
            y: this.h/4,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.subtitle = this.add.text(this.w/2, -this.h, "The Resistive Force",{
            fontSize: '30px',
            fontFamily: 'Arial',
            fontStyle: 'bold',
            align: 'center',
            lineSpacing: 20,
        });
        this.subtitle.setOrigin(0.5);

        this.tweens.add({
            targets: this.subtitle,
            y: this.h/2.5,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.play = this.add.text(
            this.w / 2,
            this.h,
            'PLAY',
            {
                fontSize: '36px',
                fontFamily: 'Segoe UI',
                fontStyle: 'bold',
                color: '#ffffff',               
                backgroundColor: '#00874E',     
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#20D38B',        
                    blur: 30,                  
                    stroke: true,              
                    fill: true
                }
            }
        ).setOrigin(0.5);
        this.play.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>{
        this.play.setScale(0.9);
        this.sound.play('button-click');

        const fade = this.add.rectangle(0,0,this.w,this.h,0x000000).setOrigin(0,0).setAlpha(0);
        this.tweens.add({
            targets: fade,
            alpha: 1,
            duration: 1000,
            onComplete: () => {
                this.scene.stop();
                this.scene.start('story-narration-scene');
            }
        })
        })
        .on('pointerup',()=>this.play.setScale(1))

        this.tweens.add({
            targets: this.play,
            y: this.h/1.5,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.credits = this.add.text(
            this.w / 2,
            this.h,
            'CREDITS',
            {
                fontSize: '32px',                  
                fontFamily: 'Segoe UI',            
                fontStyle: 'bold',
                color: '#ffffff',                 
                backgroundColor: '#0E2A2A',       
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#20D38B',             
                    blur: 25,
                    stroke: true,                 
                    fill: true
                }
            }
        ).setOrigin(0.5)
        this.credits.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>{
                this.credits.setScale(0.9);
                this.sound.play('button-click');

                const fade = this.add.rectangle(0,0,this.w,this.h,0x000000).setOrigin(0,0).setAlpha(0);
                this.tweens.add({
                    targets: fade,
                    alpha: 1,
                    duration: 100,
                    onComplete: () => {
                        this.scene.stop();
                        this.scene.start('credits-scene');
                    }
                })
            }
        )
        .on('pointerup',()=>this.credits.setScale(1));

        this.tweens.add({
            targets: this.credits,
            y: this.h/1.3,           
            duration: 1000,     
            ease: 'Power2'     
        });

        this.player = this.add.image(-this.w, this.h, "player").setOrigin(0,1);
        
        this.enemy = this.add.image(this.w, this.h, "enemy").setOrigin(0,1);

        this.knight = this.add.image(this.w, this.h/0.7, "knight").setOrigin(0,1);
        this.knight.setPipeline('TextureTintPipeline');
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
            x: this.w*0.01,            
            duration: 1000,     
            ease: 'Power2'     
        });

        this.tweens.add({
            targets: this.enemy,
            x: this.w/1.6,            
            duration: 1000,     
            ease: 'Power2'     
        });

        this.tweens.add({
            targets: this.knight,
            x: this.w/3.5,            
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
            const particle = this.add.image(Helper.scaleWidth(widths[i], this.w),Helper.scaleHeight(heights[i], this.h),'particle');
            this.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }
}

export default MainMenu;
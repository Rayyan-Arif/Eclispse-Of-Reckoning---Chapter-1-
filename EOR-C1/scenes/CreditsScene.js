import Phaser from 'phaser';
import Helper from '../HelperClass';

class Credits extends Phaser.Scene{
    constructor(){
        super('credits-scene');
        this.w;
        this.h;
        this.background;
        this.title;
        this.devTitle;
        this.devName;
        this.thanks;
        this.gameName;
        this.back;
    }

    preload(){}

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.background = this.add.image(0,0,'background').setOrigin(0,0).setAlpha(0);
        this.background.setDisplaySize(this.w, this.h);

        this.tweens.add({
            targets: this.background,
            alpha: 1,
            duration: 100
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

        this.title = this.add.text(
            this.scale.width,
            this.scale.height / 4,            
            'CREDITS',
            {
                fontSize: `${Helper.scaleWidth(50, this.w)}px`,
                fontFamily: 'Segoe UI',
                fontStyle: 'bold',
                color: '#20D38B',       
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },                
            }
        ).setOrigin(0.5);

        this.devTitle = this.add.text(
            -this.scale.width,
            this.scale.height / 2.5,
            'Developer',
            {
                fontSize: `${Helper.scaleWidth(30, this.w)}px`,
                fontFamily: 'Segoe UI',
                color: '#20D38B',       
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },                
            }
        ).setOrigin(0.5);

        this.devName = this.add.text(
            this.scale.width,
            this.scale.height / 2.2,
            'Rayyan Arif',
            {
                fontSize: `${Helper.scaleWidth(23, this.w)}px`,
                fontFamily: 'Segoe UI',
                color: 'white',       
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },              
            }
        ).setOrigin(0.5);

        this.thanks = this.add.text(
            -this.scale.width,
            this.scale.height / 1.7,
            'Thank you for playing',
            {
                fontSize: `${Helper.scaleWidth(27, this.w)}px`,
                fontFamily: 'Segoe UI',
                color: '#03a87c',       
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },
            }
        ).setOrigin(0.5);

        this.gameName = this.add.text(
            this.scale.width,
            this.scale.height / 1.5,
            'Eclipse Of Reckoning',
            {
                fontSize: `${Helper.scaleWidth(23, this.w)}px`,
                fontFamily: 'Segoe UI',
                color: '#20D38B',       
                padding: { left: Helper.scaleWidth(50, this.w), right: Helper.scaleWidth(50, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },                
            }
        ).setOrigin(0.5);

        this.back = this.add.text(
            -this.scale.width,
            this.scale.height / 1.3,
            'BACK',
            {
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
            }
        ).setOrigin(0.5);
        this.back.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>{
            this.back.setScale(0.9);
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
        .on('pointerup',()=>this.back.setScale(1));

        [this.title, this.devTitle, this.devName, this.thanks, this.gameName, this.back].forEach((el,i) => {
            this.tweens.add({
                targets: el,
                x: this.scale.width / 2,
                duration: 1000,
                ease: 'Power2'  
            });
        });
    }

    update(){}
}

export default Credits;
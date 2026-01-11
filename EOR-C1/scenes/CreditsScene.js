import Phaser from 'phaser';

class Credits extends Phaser.Scene{
    constructor(){
        super('credits-scene');
        this.title;
        this.devTitle;
        this.devName;
        this.thanks;
        this.gameName;
        this.back;
    }

    preload(){}

    create(){
        const background = this.add.image(0,0,'background').setOrigin(0,0).setAlpha(0);
        const scaleX = this.scale.width / background.width;
        const scaleY = this.scale.height / background.height;
        background.setScale(Math.max(scaleX,scaleY));

        this.tweens.add({
            targets: background,
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
            const particle = this.add.image(widths[i],heights[i],'particle');
            this.tweens.add({
                targets: particle,
                alpha: 0,
                duration: 1000,
                yoyo: true,
                repeat: -1
            });
        }

        this.title = this.add.text(
            this.scale.width / 2,
            this.scale.height,            
            'CREDITS',
            {
                fontSize: '50px',
                fontFamily: 'Segoe UI',
                fontStyle: 'bold',
                color: '#20D38B',       
                padding: { left: 50, right: 50, top: 10, bottom: 10 },
                
            }
        ).setOrigin(0.5);

        this.devTitle = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'Developer',
            {
                fontSize: '30px',
                fontFamily: 'Segoe UI',
                // fontStyle: 'bold',
                color: '#20D38B',       
                padding: { left: 50, right: 50, top: 10, bottom: 10 },
                
            }
        ).setOrigin(0.5);

        this.devName = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'Rayyan Arif',
            {
                fontSize: '23px',
                fontFamily: 'Segoe UI',
                color: 'white',       
                padding: { left: 50, right: 50, top: 10, bottom: 10 },
                
            }
        ).setOrigin(0.5);

        this.thanks = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'Thank you for playing',
            {
                fontSize: '27px',
                fontFamily: 'Segoe UI',
                color: '#03a87c',       
                padding: { left: 50, right: 50, top: 10, bottom: 10 },
                
            }
        ).setOrigin(0.5);

        this.gameName = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'Eclipse Of Reckoning',
            {
                fontSize: '23px',
                fontFamily: 'Segoe UI',
                color: '#20D38B',       
                padding: { left: 50, right: 50, top: 10, bottom: 10 },
                
            }
        ).setOrigin(0.5);

        this.back = this.add.text(
            this.scale.width / 2,
            this.scale.height,
            'BACK',
            {
                fontSize: '23px',
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
            }
        ).setOrigin(0.5);
        this.back.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>{
            this.back.setScale(0.9);
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

        const textHeights = [4,2.5,2.2,1.7,1.5,1.3];
        [this.title, this.devTitle, this.devName, this.thanks, this.gameName, this.back].forEach((el,i) => {
            this.tweens.add({
                targets: el,
                y: this.scale.height / textHeights[i],
                duration: 1000,
                ease: 'Power2'  
            });
        });
    }

    update(){}
}

export default Credits;
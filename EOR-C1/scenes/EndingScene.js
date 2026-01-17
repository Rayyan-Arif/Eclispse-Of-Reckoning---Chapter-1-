import Phaser from "phaser";
import Helper from "../HelperClass";

class Ending extends Phaser.Scene{
    constructor(){
        super("ending-scene");
        this.w;
        this.h;
        this.background;
        this.title;
        this.line;
        this.subtext;
        this.backbutton;
    }

    preload(){

    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.background = this.add.image(0,0,'background').setOrigin(0,0).setAlpha(0.4);
        this.background.setDisplaySize(this.w, this.h);

        this.title = this.add.text(
            this.w/2,
            -this.h*2,
            'Eclipse Of Reckoning',
            {
                fontSize: `${Helper.scaleWidth(35, this.w)}px`,
                color: '#1ABC9C',
                stroke: '#1ABC9C',  
                strokeThickness: 2   
            }
        ).setOrigin(0.5).setAlpha(1);

        this.subtext = this.add.text(
            this.w*2,
            this.h/2,
            'The journey is not over yet!\nPurple Thorn is yet to be defeated!\nBut our hero is not giving up already!\nThe world needs to wait....',
            {
                fontSize: `${Helper.scaleWidth(25, this.w)}px`,
                align: 'center',
                lineSpacing: Helper.scaleHeight(40, this.h),
                fontFamily: 'times new roman, arial',
                color: '#009688',
                stroke: '#009688',
                strokeThickness: 0.5
            }
        ).setOrigin(0.5).setAlpha(1);

        this.backbutton = this.add.text(
            this.w/2,
            this.h*2,
            'BACK TO HOME',
            {
                fontSize: '25px',                  
                fontFamily: 'Segoe UI',            
                fontStyle: 'bold',
                color: '#ffffff',                 
                backgroundColor: '#0E2A2A',       
                padding: { left: Helper.scaleWidth(30, this.w), right: Helper.scaleWidth(30, this.w), top: Helper.scaleHeight(10, this.h), bottom: Helper.scaleHeight(10, this.h) },
                shadow: {
                    offsetX: 0,
                    offsetY: 0,
                    color: '#20D38B',             
                    blur: 25,
                    stroke: true,                 
                    fill: true
                }
            }
        ).setOrigin(0.5).setAlpha(1);
        this.backbutton.setInteractive({ useHandCursor: true })
        .on('pointerdown',()=>{
                this.backbutton.setScale(0.9);
                this.backbutton.disableInteractive();
                this.sound.play('button-click');
                const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
                this.tweens.add({
                    targets: fade,
                    alpha: 1,
                    duration: 1000,
                    onComplete: () => {
                        this.scene.stop();
                        this.scene.start('main-menu-scene');
                    }
                })
            }
        )
        .on('pointerup',()=>this.backbutton.setScale(1));

        this.line = this.add.rectangle(this.w/2, this.h/3.4, this.title.displayWidth, Helper.scaleHeight(2, this.h), 0x20D38B).setOrigin(0.5);
        this.line.scaleX = 0;

        const y = [4, 2, 1.3];
        [this.title, this.subtext, this.backbutton].forEach((el,i) => {
            this.tweens.add({
                targets: el,
                x: this.w / 2,
                y: this.h / y[i],
                duration: 2000,
                onComplete: () => {
                    if(el === this.title){
                        this.tweens.add({
                            targets: this.line,
                            duration: 1000,
                            scaleX: 1
                        });
                    }
                }
            });
        })
    }

    update(){

    }
}

export default Ending;
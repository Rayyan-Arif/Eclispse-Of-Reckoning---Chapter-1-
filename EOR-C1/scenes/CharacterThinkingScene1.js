import Phaser from "phaser";
import Helper from "../HelperClass";

class CharacterThinking1 extends Phaser.Scene{
    constructor(){
        super("character-thinking-1-scene");
        this.w;
        this.h;
        this.background;
        this.dialogueText = [
            "I will not allow\nPurple Thorn to succeed.",
            "I will defeat him\nand save the world.",
            "I will become the\n RESISTIVE FORCE!!!",
            "First I need to find him.",
            "There must be his\n traps on the way.",
            "They will try to stop me!",
        ];
        this.dialogue;
    }

    init(){
        this.index = 0;
        this.counter = 0;
    }

    preload(){
        this.load.image("thinking-bg","../UI Images/character-thinking-1.png");
    }

    create(){
        this.w = this.scale.width;
        this.h = this.scale.height;

        this.background = this.add.image(0,0,'thinking-bg').setOrigin(0,0).setAlpha(0);
        this.background.setDisplaySize(this.scale.width, this.scale.height);

        this.tweens.add({
            targets: this.background,
            alpha: 1,
            duration: 1000
        });

        this.dialogue = this.add.text(Helper.scaleWidth(760, this.w),Helper.scaleHeight(330, this.h),'',{
            fontSize: `${Helper.scaleWidth(30, w)}px`,
            fontFamily: 'Arial',
            color: 'black',
            align: 'center',
            lineSpacing: Helper.scaleWidth(30, w)
        }).setOrigin(0.5);

        this.time.delayedCall(2000,() => {
            const timer = this.time.addEvent({
                delay: 70,
                callback: () => {
                    if(this.index >= this.dialogueText.length){
                        this.time.delayedCall(1500, () => {
                            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
                            this.tweens.add({
                                targets: fade,
                                alpha: 1,
                                duration: 1000,
                                onComplete: () => {
                                    this.scene.stop();
                                    this.scene.start('parkour-scene');
                                }
                            });
                        });
                        timer.remove();
                    } else{
                        this.dialogue.setText(this.dialogueText[this.index].slice(0,this.counter++));
                        if(this.counter > this.dialogueText[this.index].length){
                            timer.paused = true;
                            this.time.delayedCall(1000, () => {
                                this.index++;
                                this.counter = 0;
                                timer.paused = false;
                            });
                        }
                    }
                },
                callbackScope: this,
                loop: true
            })
        });
    }

    update(){}
}

export default CharacterThinking1;
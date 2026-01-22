import Phaser from "phaser";

class Story extends Phaser.Scene{
    constructor(){
        super("story-narration-scene");
        this.storyText = 
`15th Nov, 2026. The day the world fell.
Humanity’s last taste of peace ended in a single, fiery crash.
Something unknown fell from the skies. It called itself The Purple Thorn.
Wherever it stepped, life withered, twisted, and obeyed its dark will.
Its army grew, its terror spread, and nothing could stand against it… except one.

"Radiant", a lone soul of defiance refused to bend.
Now, the fate of the world rests in your hands.
Use the arrow keys to guide him.
Every stage brings new threats, and every decision shapes the battle against The Purple Thorn.

Can you stop the darkness before it consumes everything?`;

        this.story;
        this.counter = 0;
        this.exitButton;
        this.skipButton;
    }

    preload(){}

    create(){
        this.exitbutton = this.add.text(95,40,'EXIT',{
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

        this.skipbutton = this.add.text(this.scale.width/1.105,this.scale.height/1.06,'SKIP',{
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
        this.skipbutton.setInteractive({ useHandCursor: true })
        .on('pointerdown',() => {
            this.skipbutton.setScale(0.9);
            this.skipbutton.disableInteractive();
            this.sound.play('button-click');
            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
            this.tweens.add({
                targets: fade,
                alpha: 1,
                duration: 1000,
                onComplete: () => {
                    this.scene.stop();
                    this.scene.start("character-thinking-1-scene");
                }
            })  
        })
        .on('pointerup',() => this.skipbutton.setScale(1));

        [this.exitbutton, this.skipbutton].forEach(btn => {
            this.tweens.add({
                targets: btn,
                alpha: 1,
                duration: 1000,
                ease: 'linear'
            });
        });

        this.story = this.add.text(30,100,'',{
            fontFamily: 'Georgia, Arial',
            fontSize: '25px',
            lineSpacing: 20,
            wordWrap: { width: 1000 }
        });

        let startStory = false;
        this.time.delayedCall(2000, () => {
            startStory = true;
        });

        const timer = this.time.addEvent({
            delay: 70,
            callback: () => {
                if(startStory){
                    this.story.setText(this.storyText.slice(0,this.counter++));
                    if(this.counter > this.storyText.length){
                        timer.remove();
                        this.time.delayedCall(3000, () => {
                            const fade = this.add.rectangle(0,0,this.scale.width,this.scale.height,0x000000).setOrigin(0,0).setAlpha(0);
                            this.tweens.add({
                                targets: fade,
                                alpha: 1,
                                duration: 1000,
                                onComplete: () => {
                                    this.scene.stop();
                                    this.scene.start("character-thinking-1-scene");
                                }
                            });
                        });
                    }
                }
            },
            callbackScope: this,
            loop: true
        });
    }

    update(){}
}

export default Story;
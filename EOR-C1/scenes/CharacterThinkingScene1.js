import Phaser from "phaser";

class CharacterThinking1 extends Phaser.Scene{
    constructor(){
        super("character-thinking-1-scene");
        this.background;
        this.dialogueText = `
        I will not allow Purple Thorn to succeed.
        I will defeat him and save the world.
        I will become the RESISTIVE FORCE!!!
        First I need to find him.
        There must be his pets on the way.
        They will try to stop me!
        `;
    }

    preload(){
        this.load.image("thinking-bg","../UI Images/character-thinking-1.png");
    }

    create(){
        this.background = this.add.image(0,0,'thinking-bg').setOrigin(0,0).setAlpha(0);
        this.background.setDisplaySize(this.scale.width, this.scale.height);

        this.tweens.add({
            targets: this.background,
            alpha: 1,
            duration: 1000
        });
    }

    update(){}
}

export default CharacterThinking1;
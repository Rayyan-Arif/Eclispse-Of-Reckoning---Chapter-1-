import Phaser from "phaser";
import Helper from '../HelperClass';

class Loading extends Phaser.Scene{
    constructor(){
        super('loading-scene');
    }

    preload(){
        const {width, height} = this.cameras.main;

        const loadingText = this.add.text(width/2, height/2, 'Loading: 0%',{
            fontSize: `40px`,
            fontStyle: 'bold italic'
        }).setOrigin(0.5);

        this.load.on('progress', (value) => {
            loadingText.setText(`Loading: ${Math.floor(value*100)}%`);
        });

        this.load.image("background","../images/background.png");
        this.load.image("player","../images/angrypose.png");
        this.load.image("enemy","../images/angryenemy.png");
        this.load.image("knight","../images/guard-alert.png");
        this.load.image('particle', '../images/particle.png');
        this.load.image('decoration','../images/decoration.png');
        
        this.load.audio('button-click','../Audios/button-click.wav');
        this.load.audio('theme', '../Audios/theme.mp3');
        this.load.audio('narrator','../Audios/narrator.mp3');

        this.load.image('parkour','../images/parkour.png');
        this.load.image('player-left','../images/main-character-left.png');
        this.load.image('player-right','../images/main-character-right.png');

        this.load.audio('jump','../Audios/jump.wav');
        this.load.audio('enable-parkour-button','../Audios/enable-parkour-button.wav');
        this.load.audio('death','../Audios/death.wav');

        this.load.image('gun','../images/gun.png');

        this.load.audio('success','../Audios/success.wav');

        this.load.image('wall','../images/wall.png');
        this.load.image('knight-alert','../images/guard-alert.png');
        this.load.image('knight-sleeping','../images/guard-sleeping.png');

        this.load.audio('alert','../Audios/alert.wav');

        this.load.image('arrows-bg','../images/arrows-bg.png');
        this.load.image('arrow','../images/arrow.png');

        this.load.audio('arrow-shoot','../Audios/arrow-shoot.wav');
        this.load.image("thinking-bg-2","../images/character-thinking-2.png");
        this.load.image("thinking-bg-1","../images/character-thinking-1.png");

        this.load.image('battlefield','../images/battlefield.png');
        this.load.image('player-fight-left','../images/player-fight-left.png');
        this.load.image('player-fight-right','../images/player-fight-right.png');
        this.load.image('enemy-left','../images/battlefield-enemy-left.png');
        this.load.image('enemy-right','../images/battlefield-enemy-right.png');
        this.load.image('bullet','../images/bullet.png');

        this.load.audio('button-click','../Audios/button-click.wav');
        this.load.audio('shoot','../Audios/shoot.wav');
        this.load.audio('damage','../Audios/damage.wav');
        this.load.audio('win','../Audios/win.wav');
    }

    create(){
        this.scene.start('parkour-scene');
    }

    update(){

    }
}

export default Loading;
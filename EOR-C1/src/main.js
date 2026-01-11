import './style.css'
import Phaser, { Physics } from 'phaser';
import MainMenu from '../scenes/MainMenuScene';

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade:{
      debug: true
    }
  },
  scene: [MainMenu]
}

const game = new Phaser.Game(config);
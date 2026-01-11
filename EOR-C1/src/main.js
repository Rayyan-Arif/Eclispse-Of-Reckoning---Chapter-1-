import './style.css'
import Phaser, { Physics } from 'phaser';
import MainMenu from '../scenes/MainMenuScene';
import Credits from '../scenes/CreditsScene';

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade:{
      debug: true
    }
  },
  scene: [MainMenu,Credits]
}

const game = new Phaser.Game(config);
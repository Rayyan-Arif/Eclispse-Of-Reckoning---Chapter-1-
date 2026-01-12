import './style.css'
import Phaser, { Physics } from 'phaser';
import MainMenu from '../scenes/MainMenuScene';
import Credits from '../scenes/CreditsScene';
import Story from '../scenes/StoryScene';
import CharacterThinking1 from '../scenes/CharacterThinkingScene1';

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade:{
      debug: true
    }
  },
  scene: [MainMenu, Credits, Story, CharacterThinking1]
}

const game = new Phaser.Game(config);
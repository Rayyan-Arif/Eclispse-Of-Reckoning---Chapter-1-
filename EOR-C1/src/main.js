import './style.css'
import Phaser, { Physics } from 'phaser';
import MainMenu from '../scenes/MainMenuScene';
import Credits from '../scenes/CreditsScene';
import Story from '../scenes/StoryScene';
import CharacterThinking1 from '../scenes/CharacterThinkingScene1';
import Parkour from '../scenes/ParkourScene';

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade:{
      debug: false
    }
  },
  scene: [MainMenu, Credits, Story, CharacterThinking1, Parkour]
}

const game = new Phaser.Game(config);
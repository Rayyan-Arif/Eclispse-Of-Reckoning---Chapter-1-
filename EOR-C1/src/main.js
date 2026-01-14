import './style.css'
import Phaser from 'phaser';
import MainMenu from '../scenes/MainMenuScene';
import Credits from '../scenes/CreditsScene';
import Story from '../scenes/StoryScene';
import CharacterThinking1 from '../scenes/CharacterThinkingScene1';
import Parkour from '../scenes/ParkourScene';
import EscapeArrows from '../scenes/EscapeArrowsScene';

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade:{
      debug: false
    }
  },
  // scene: [MainMenu, Credits, Story, CharacterThinking1, Parkour, EscapeArrows]
  scene: [EscapeArrows]
}

const game = new Phaser.Game(config);
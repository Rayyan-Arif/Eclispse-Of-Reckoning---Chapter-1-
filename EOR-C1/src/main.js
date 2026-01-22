import './style.css'
import Phaser from 'phaser';
import MainMenu from '../scenes/MainMenuScene';
import Credits from '../scenes/CreditsScene';
import Story from '../scenes/StoryScene';
import CharacterThinking1 from '../scenes/CharacterThinkingScene1';
import Parkour from '../scenes/ParkourScene';
import EscapeArrows from '../scenes/EscapeArrowsScene';
import EscapeKnight from '../scenes/EscapeKnightScene';
import Maze from '../scenes/MazeScene';
import Battle from '../scenes/BattleScene';
import Ending from '../scenes/EndingScene';
import CharacterThinking2 from '../scenes/CharacterThinkingScene2';

const config = {
  type: Phaser.WEBGL,
  canvas: gameCanvas,
  pixelArt: true,
  physics: {
    default: "arcade",
    arcade:{
      debug: false,
    }
  },
  // scene: [MainMenu, Credits, Story, CharacterThinking1, Parkour, EscapeArrows, EscapeKnight, Maze, Battle, CharacterThinking2, Ending]
  scene: [Battle]
}

const game = new Phaser.Game(config);
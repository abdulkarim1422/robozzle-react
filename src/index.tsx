import React, { Component } from "react";
import ReactDOM from "react-dom";
import GitHubForkRibbon from "react-github-fork-ribbon";

import "./styles.css";
import Boards from "./data";
import Game from "./game";


interface AppState {
  selectedBoard: number,
  dragging: boolean,
  completedLevels: Set<number>,
  lightTheme: boolean,
  showInstructions: boolean,
}


class App extends Component<{}, AppState> {
  state: AppState;

  constructor(props) {
    super(props);
    // Initial state
    const completedLevels = new Set<number>(JSON.parse(localStorage.getItem('completedLevels') || '[]'));
    const savedTheme = localStorage.getItem('lightTheme') === 'true';
    this.state = {
      selectedBoard: this.getSelectedBoardFromUrl() || 285,
      dragging: null,
      completedLevels: completedLevels,
      lightTheme: savedTheme,
      showInstructions: true,
    };
  }

  componentDidMount() {
    // Apply saved theme on mount
    if (this.state.lightTheme) {
      document.body.classList.add('light-theme');
    }
  }

  toggleTheme = () => {
    this.setState(prevState => {
      const newTheme = !prevState.lightTheme;
      localStorage.setItem('lightTheme', String(newTheme));
      if (newTheme) {
        document.body.classList.add('light-theme');
      } else {
        document.body.classList.remove('light-theme');
      }
      return { lightTheme: newTheme };
    });
  };

  getSelectedBoardFromUrl(): number {
    const searchParams = new URLSearchParams(window.location.search);
    const level = parseInt(searchParams.get('level'), 10);
    if (isNaN(level)) {
      return -1;
    }
    if (!Boards.find(b => b.Id === level)) {
      return -1;
    }
    return level;
  }

  handleLevelComplete = (levelId: number): void => {
    this.setState((prevState) => {
      const updatedCompletedLevels = new Set(prevState.completedLevels).add(levelId);
      localStorage.setItem('completedLevels', JSON.stringify(Array.from(updatedCompletedLevels)));
      return {
        completedLevels: updatedCompletedLevels
      };
    });
  };

  printProgress = (): void => {
    setTimeout(() => {
      const sortedLevels = Array.from(this.state.completedLevels).sort((a, b) => a - b);
      window.alert(`You've completed ${sortedLevels.length} levels: \n${sortedLevels}`)
    });
  }

  render() {
    const { dragging, selectedBoard, completedLevels, lightTheme, showInstructions } = this.state;
    return (
      <div className={`App ${dragging ? "dragging" : ""}`}>
        <button 
          className="theme-toggle" 
          onClick={this.toggleTheme}
          title={lightTheme ? "Switch to dark theme" : "Switch to light theme"}
        >
          {lightTheme ? "🌙" : "☀️"}
        </button>
        <GitHubForkRibbon
          href="//github.com/alexanderson1993/robozzle-react"
          target="_blank"
          position="left-bottom"
          color="black"
        >
          Fork me on GitHub
        </GitHubForkRibbon>
        <div className="boards">
          <h1 onClick={this.printProgress} >Robozzle-React</h1>
          <p
            className={`${showInstructions && !selectedBoard ? "selected" : ""}`}
            onClick={() => {
              this.setState({ selectedBoard: null, showInstructions: true });
              const url = new URL(window.location.href);
              url.searchParams.delete("level");
              window.history.pushState({ path: url.toString() }, '', url.toString());
            }}
          >
            📖 How to Play
          </p>
          {Boards.map(d => (
            <p
              key={`board-${d.Id}`}
              className={`${selectedBoard === d.Id ? "selected" : ""}`}
              onClick={() => {
                this.setState({ selectedBoard: d.Id, showInstructions: false })
                const url = new URL(window.location.href);
                url.searchParams.set("level", `${d.Id}`);
                window.history.pushState({ path: url.toString() }, '', url.toString());
              }}
            >
              {completedLevels.has(d.Id) ? `✅ ${d.Title}` : `⬜ ${d.Title}`}
            </p>
          ))}
        </div>
        {showInstructions && !selectedBoard ? (
          <div className="instructions-page">
            <h2>🤖 Welcome to Robozzle!</h2>
            <div className="instructions-content">
              <section>
                <h3>🎯 Goal</h3>
                <p>Guide the robot to collect all the stars on the board using programmed functions.</p>
              </section>
              
              <section>
                <h3>🎮 How to Play</h3>
                <ul>
                  <li><strong>Program Functions:</strong> Drag and drop commands into the function slots (F1, F2, etc.)</li>
                  <li><strong>Available Commands:</strong>
                    <ul>
                      <li>⬆️ <strong>Forward</strong> - Move one step forward</li>
                      <li>↩️ <strong>Turn Left</strong> - Rotate 90° counterclockwise</li>
                      <li>↪️ <strong>Turn Right</strong> - Rotate 90° clockwise</li>
                      <li>🔵🟢🔴 <strong>Paint</strong> - Paint the current tile</li>
                      <li><strong>Call F1/F2/F3/F4/F5</strong> - Execute another function</li>
                    </ul>
                  </li>
                  <li><strong>Conditional Execution:</strong> Commands can be set to execute only on specific colored tiles</li>
                  <li><strong>Run Your Program:</strong> Click the play button to test your solution</li>
                </ul>
              </section>
              
              <section>
                <h3>💡 Tips</h3>
                <ul>
                  <li>Start with simple movements and build up complexity</li>
                  <li>Use functions recursively to create loops</li>
                  <li>Pay attention to the limited number of command slots</li>
                  <li>Colored conditions help you create branching logic</li>
                </ul>
              </section>
              
              <section>
                <h3>🎨 Controls</h3>
                <ul>
                  <li><strong>Drag & Drop:</strong> Click and drag commands from the palette to function slots</li>
                  <li><strong>Remove Commands:</strong> Click on a command to cycle through options or remove it</li>
                  <li><strong>Speed Control:</strong> Adjust execution speed with the slider</li>
                  <li><strong>Reset:</strong> Clear the board and start over</li>
                </ul>
              </section>
              
              <section className="cta">
                <p>Ready to start? Select a level from the sidebar to begin!</p>
              </section>
            </div>
          </div>
        ) : selectedBoard && (
          <Game
            key={selectedBoard}
            setDragging={which => this.setState({ dragging: which })}
            board={Boards.find(b => b.Id === selectedBoard)}
            onLevelComplete={() => this.handleLevelComplete(selectedBoard)}
          />
        )}
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

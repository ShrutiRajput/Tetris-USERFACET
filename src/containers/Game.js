import { useState, useEffect, useRef } from "react";
import { Column } from "./Column";
import { GameOver } from "./GameOver";
import { About } from "./About";
import "./style.css";
import {
  noOfColumn,
  numberOfRow,
  moveTime,
  checkWordTime
} from "../config/config";
import { checkWord, sortWordQueue } from "../config/wordCheck";
import { wordsAdjustedPerFrequency } from "../config/GenerateWords";

const GAMESTATE = {
  INITIAL: "initial",
  IN_PROGRESS: "inProgress",
  PAUSED: "paused",
  ENDED: "ended"
};

const sentence =
  "we design and develop applications that run the world and showcase the future";

const allletters = wordsAdjustedPerFrequency(sentence);

function Game() {
  const [updateFlag, setUpdateFlag] = useState(false);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState(GAMESTATE.INITIAL);
  const nextLetterRef = useRef(undefined);
  const lettersRef = useRef([]);
  const wordQueueRef = useRef([]);
  const checkWordAutomaticRef = useRef(null);

  useEffect(() => {
    const handleKeyPress = (evt) => {
      if (evt.key === "a" || evt.keyCode === 37) {
        evt.preventDefault();
        moveLeft();
      } else if (evt.key === "d" || evt.keyCode === 39) {
        evt.preventDefault();
        moveRight();
      } else if (evt.key === "s" || evt.keyCode === 40) {
        evt.preventDefault();
        moveDown();
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  const moveLeft = () => {
    let updatedSomething = false;
    const updatedLetters = [...lettersRef.current];
    for (let i = 0; i < updatedLetters.length; i++) {
      if (updatedLetters[i].moving) {
        if (
          updatedLetters[i].pos.x > 0 &&
          !alreadyHasLetterInPos({
            x: updatedLetters[i].pos.x - 1,
            y: updatedLetters[i].pos.y
          })
        ) {
          updatedLetters[i].pos.x = updatedLetters[i].pos.x - 1;
          updatedSomething = true;
        }
      }
    }
    if (updatedSomething) {
      setUpdateFlag(!updateFlag);
    }
  };

  const moveRight = () => {
    let updatedSomething = false;
    const updatedLetters = [...lettersRef.current];
    for (let i = 0; i < updatedLetters.length; i++) {
      if (updatedLetters[i].moving) {
        if (
          updatedLetters[i].pos.x < noOfColumn - 1 &&
          !alreadyHasLetterInPos({
            x: updatedLetters[i].pos.x + 1,
            y: updatedLetters[i].pos.y
          })
        ) {
          updatedLetters[i].pos.x = updatedLetters[i].pos.x + 1;
          updatedSomething = true;
        }
      }
    }
    if (updatedSomething) {
      setUpdateFlag(!updateFlag);
    }
  };

  const moveDown = () => {
    let updatedSomething = false;
    const updatedLetters = [...lettersRef.current];
    for (let i = 0; i < updatedLetters.length; i++) {
      if (updatedLetters[i].moving) {
        const alreadyHas = alreadyHasLetterInPos({
          x: updatedLetters[i].pos.x,
          y: updatedLetters[i].pos.y + 1
        });
        if (updatedLetters[i].pos.y < numberOfRow - 1 && !alreadyHas) {
          updatedLetters[i].pos.y = updatedLetters[i].pos.y + 1;
        }

        if (updatedLetters[i].pos.y === numberOfRow - 1 || alreadyHas) {
          updatedLetters[i].moving = false;
        }
        updatedSomething = true;
      }
    }
    if (updatedSomething) {
      setUpdateFlag(!updateFlag);
    }
  };

  const startGame = () => {
    if (gameState !== GAMESTATE.PAUSED) {
      setScore(0);
    }
    setGameState(GAMESTATE.IN_PROGRESS);
    if (lettersRef.current.length === 0) {
      generateLetter();
    }
    setTimeout(startMoving, moveTime);
  };

  const pauseGame = () => {
    setGameState(GAMESTATE.PAUSED);
    clearInterval(gameIntervalRef.current);
    setUpdateFlag(!updateFlag);
  };

  const gameIntervalRef = useRef(null);

  const startMoving = () => {
    clearInterval(gameIntervalRef.current);
    gameIntervalRef.current = setInterval(moveLetters, moveTime);
  };

  const alreadyHasLetterInPos = (pos) => {
    const updatedLetters = [...lettersRef.current];
    for (let i = 0; i < updatedLetters.length; i++) {
      if (
        updatedLetters[i].pos.x === pos.x &&
        updatedLetters[i].pos.y === pos.y
      ) {
        return true;
      }
    }
    return false;
  };

  const moveLetters = () => {
    let updatedSomething = false;
    const updatedLetters = [...lettersRef.current];
    for (let i = 0; i < updatedLetters.length; i++) {
      if (
        updatedLetters[i].pos.y < numberOfRow - 1 &&
        updatedLetters[i].moving
      ) {
        const alreadyHas = alreadyHasLetterInPos({
          x: updatedLetters[i].pos.x,
          y: updatedLetters[i].pos.y + 1
        });
        if (!alreadyHas) {
          updatedLetters[i].pos.y = updatedLetters[i].pos.y + 1;
        }
        if (updatedLetters[i].pos.y === numberOfRow - 1 || alreadyHas) {
          updatedLetters[i].moving = false;
        }
        if (updatedLetters[i].pos.y === 0) {
          // One column is full, Game over
          lettersRef.current = [];
          clearInterval(gameIntervalRef.current);
          setGameState(GAMESTATE.ENDED);
          setUpdateFlag(!updateFlag);
        }
        updatedSomething = true;
      }
    }
    if (updatedSomething) {
      setUpdateFlag(!updateFlag);
    } else {
      generateLetter();
    }
  };

  const getNewLetter = () => {
    let newLetter;
    if (nextLetterRef.current) {
      newLetter = nextLetterRef.current;
      nextLetterRef.current =
        allletters[Math.floor(Math.random() * allletters.length)];
    } else {
      newLetter = allletters[Math.floor(Math.random() * allletters.length)];
      nextLetterRef.current =
        allletters[Math.floor(Math.random() * allletters.length)];
    }
    return newLetter;
  };

  const generateLetter = () => {
    const letter = getNewLetter();
    const columnno = Math.floor(Math.random() * noOfColumn);
    const newLetter = {
      letter: letter,
      moving: true,
      isWord: false,
      pos: {
        x: columnno,
        y: 0
      }
    };
    lettersRef.current = [...lettersRef.current, newLetter];
    setUpdateFlag(!updateFlag);
  };

  const getLetterForThisColumn = (column) => {
    const _letterInColumn = [];
    const updatedLetters = [...lettersRef.current];
    for (let i = 0; i < updatedLetters.length; i++) {
      if (updatedLetters[i].pos.x === column) {
        _letterInColumn.push(updatedLetters[i]);
      }
    }
    return _letterInColumn;
  };

  const getColumn = () => {
    let columns = [];
    for (let i = 0; i < noOfColumn; i++) {
      const letter = getLetterForThisColumn(i);
      columns.push(
        <Column
          key={`column${i}`}
          columnId={i}
          letters={letter}
          onLetterClick={onLetterClick}
        />
      );
    }
    return columns;
  };

  const onLetterClick = (letter) => {
    const updatedLetters = [...lettersRef.current];

    const foundLetter = updatedLetters.find((_l) => {
      return _l && _l.pos.x === letter.pos.x && _l.pos.y === letter.pos.y;
    });

    if (foundLetter) {
      foundLetter.isWord = !foundLetter.isWord;

      if (foundLetter.isWord) wordQueueRef.current.push(foundLetter);
      else {
        // Remove from wordQueue
        const indexToRemove = wordQueueRef.current.findIndex(
          (_l) => _l && _l.pos.x === letter.pos.x && _l.pos.y === letter.pos.y
        );

        if (indexToRemove !== -1) {
          wordQueueRef.current.splice(indexToRemove, 1);
        }
      }
    }

    setUpdateFlag(!updateFlag);

    // Check word automatically
    clearTimeout(checkWordAutomaticRef.current);
    checkWordAutomaticRef.current = setTimeout(
      checkWordAndDestroy,
      checkWordTime
    );
  };

  const checkWordAndDestroy = () => {
    if (wordQueueRef.current.length > 0) {
      wordQueueRef.current = sortWordQueue(wordQueueRef.current);
      // Check if it's properly selected in sequence
      // Row check
      let wordIsInRow = true;
      let wordIsInColumn = true;
      if (wordQueueRef.current.length > 1) {
        for (let i = 0; i < wordQueueRef.current.length - 1; i++) {
          if (
            Math.abs(
              wordQueueRef.current[i].pos.x - wordQueueRef.current[i + 1].pos.x
            ) !== 1
          ) {
            wordIsInRow = false;
          }
        }
      }

      if (!wordIsInRow) {
        // If not in row, then only we will check for column
        for (let i = 0; i < wordQueueRef.current.length - 1; i++) {
          if (
            Math.abs(
              wordQueueRef.current[i].pos.y - wordQueueRef.current[i + 1].pos.y
            ) !== 1
          ) {
            wordIsInColumn = false;
          }
        }
      }

      if (wordIsInRow || wordIsInColumn) {
        let word = "";
        let word1 = "";
        wordQueueRef.current.forEach((_w) => (word += _w.letter));
        wordQueueRef.current.reduceRight(
          (_, item) => (word1 += item.letter),
          null
        );

        if (checkWord(word.toLowerCase())) {
          foundValidWord(word, wordIsInRow, wordIsInColumn);
        } else if (checkWord(word1.toLowerCase())) {
          // Check reverse word as well
          foundValidWord(word1, wordIsInRow, wordIsInColumn);
        }
      }
      wordQueueRef.current = [];
      const updatedLetters = [...lettersRef.current];
      updatedLetters.forEach((_l) => (_l.isWord = false));
      setUpdateFlag(!updateFlag);
    }
  };

  const foundValidWord = (word, wordIsInRow, wordIsInColumn) => {
    // Valid word
    lettersRef.current = lettersRef.current.filter((_letter) => {
      const _letterInWordQueue = wordQueueRef.current.find(
        (_wl) =>
          _wl && _wl.pos.x === _letter.pos.x && _wl.pos.y === _letter.pos.y
      );
      if (_letterInWordQueue) return false;
      return true;
    });
    const newScore = score + word.length;

    // Fill empty space left by destroyed letters
    if (wordIsInRow) {
      wordQueueRef.current.forEach((_wq) => {
        lettersRef.current.forEach((_l) => {
          if (_l.pos.x === _wq.pos.x && _l.pos.y < _wq.pos.y) {
            _l.pos.y = _l.pos.y + 1;
          }
        });
      });
    } else if (wordIsInColumn) {
      lettersRef.current.forEach((_l) => {
        if (
          _l.pos.x === wordQueueRef.current[0].pos.x &&
          _l.pos.y < wordQueueRef.current[0].pos.y
        ) {
          _l.pos.y = _l.pos.y + wordQueueRef.current.length;
        }
      });
    }

    setUpdateFlag(!updateFlag);
    setScore(newScore);
  };

  return (
    <div className="container">
      <div className="scoreLine">
        <div className="score">{`USERFACET`}</div>
        <div className="score">{`Score : ${score}`}</div>

        {nextLetterRef.current && (
          <div className="score">
            {`Next : ${nextLetterRef.current.toUpperCase()}`}
          </div>
        )}
      </div>
      {gameState !== GAMESTATE.ENDED && (
        <div className="gameContainer">{getColumn()}</div>
      )}
      {gameState === GAMESTATE.ENDED && <GameOver score={score} />}
      <div className="controlContainer">
        <div className="controlContainer">
          {gameState !== GAMESTATE.IN_PROGRESS && (
            <button className="buttons" onClick={startGame}>
              {lettersRef.current.length > 0 ? "Resume" : "Start"}
            </button>
          )}
          {gameState !== GAMESTATE.PAUSED &&
            gameState === GAMESTATE.IN_PROGRESS && (
              <button className="buttons" onClick={pauseGame}>
                Pause
              </button>
            )}
          {wordQueueRef.current.length > 0 && (
            <button
              className={`buttons destroyColor`}
              onClick={checkWordAndDestroy}
            >
              Destroy
            </button>
          )}
          {gameState !== GAMESTATE.PAUSED &&
            gameState === GAMESTATE.IN_PROGRESS && (
              <button className="buttons" onClick={moveLeft}>
                &#9665; {/* Left arrow */}
              </button>
            )}
          {gameState !== GAMESTATE.PAUSED &&
            gameState === GAMESTATE.IN_PROGRESS && (
              <button className="buttons" onClick={moveDown}>
                &#9661; {/* Down arrow */}
              </button>
            )}
          {gameState !== GAMESTATE.PAUSED &&
            gameState === GAMESTATE.IN_PROGRESS && (
              <button className="buttons" onClick={moveRight}>
                &#9655; {/* Right arrow */}
              </button>
            )}
        </div>
      </div>
      <About score={score} />
    </div>
  );
}

export default Game;

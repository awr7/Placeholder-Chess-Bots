import React, { useState, useEffect } from "react";
import "./Play.css";
import { animated, useSpring } from "react-spring";
import playbg from "../../assets/img/play.png";
import Chessboard from "chessboardjsx";
import { Chess } from "chess.js";

const Play = () => {
  const [game, setGame] = useState(new Chess());
  const [highlightSquares, setHighlightSquares] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);
  const [flashSquare, setFlashSquare] = useState(null);
  const finalMarginTop = "30px";

  const videoStyles = useSpring({
    opacity: 1,
    filter: "blur(0px)",
    config: { duration: 500 },
  });

  const flashSquareTwice = (square) => {
    setFlashSquare(square);
    setTimeout(() => setFlashSquare(null), 250);
    setTimeout(() => setFlashSquare(square), 500);
    setTimeout(() => setFlashSquare(null), 750);
  };

  const onDrop = ({ sourceSquare, targetSquare }) => {
    try {
      const move = game.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });

      if (move === null) {
        throw new Error("Invalid move");
      }

      setGame(game);
      setHighlightSquares([]);
    } catch (error) {
      console.error(error);
      flashSquareTwice(sourceSquare);
    }
  };

  const onSquareClick = (square) => {
    const moves = game.moves({ square, verbose: true });
    const squaresToHighlight = moves.map((move) => move.to);
    setHighlightSquares(squaresToHighlight);
  };

  const onMouseOverSquare = (square) => {
    const moves = game.moves({ square, verbose: true });
    if (moves.length > 0) {
      const squaresToHighlight = moves.map((move) => move.to);
      setHighlightSquares(squaresToHighlight);
    }
  };

  const onMouseOutSquare = () => {
    setHighlightSquares([]);
  };

  const squareStyles = highlightSquares.reduce((a, c) => {
    a[c] = { backgroundColor: "rgba(255, 255, 0, 0.4)" };
    return a;
  }, {});

  if (flashSquare) {
    squareStyles[flashSquare] = { backgroundColor: "rgba(255, 0, 0, 0.4)" };
  }

  useEffect(() => {
    setAnimationKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <div className="play-container">
      <animated.img
        src={playbg}
        alt="Static background"
        className="video-background"
        style={videoStyles}
      />
      <div className="content">
        <div className="title">Play against AI</div>
        <ExpandingLine
          key={animationKey}
          isHalf={false}
          marginTop={finalMarginTop}
        />
        <div className="play-content">
          <Chessboard
            calcWidth={({ screenWidth, screenHeight }) => {
              let width = 700;

              if (screenWidth <= 1300 || screenHeight <= 900) {
                width = 600;
              }

              if (screenWidth <= 680 || screenHeight <= 850) {
                width = Math.min(screenWidth * 0.9, screenHeight * 0.6);
              }

              return width;
            }}
            position={game.fen()}
            onDrop={onDrop}
            onSquareClick={onSquareClick}
            onMouseOverSquare={onMouseOverSquare}
            onMouseOutSquare={onMouseOutSquare}
            squareStyles={squareStyles}
            lightSquareStyle={{ backgroundColor: "#ffffff" }}
            darkSquareStyle={{ backgroundColor: "#999999" }}
            boardStyle={{
              borderRadius: "5px",
              boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`,
            }}
          />
          <div className="play-menu">
            <div className="play-menu-title"> Move List </div>
            <div className="play-gradient-line" />
            <div className="move-container">
              <div className="move-list">
                {game.history().map((move, index) => {
                  const moveNumber = Math.floor(index / 2) + 1;
                  const isWhiteMove = index % 2 === 0;
                  return isWhiteMove ? (
                    <div key={index} className="move-row">
                      <div className="move-number">{moveNumber}.</div>
                      <div className="white-move">{move}</div>
                      <div className="black-move">
                        {game.history()[index + 1]
                          ? game.history()[index + 1]
                          : ""}
                      </div>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
            <div className="play-gradient-line" />
            <div className="play-menu-buttons">
              <button
                className="play-menu-button"
                onClick={() => setGame(new Chess())}
              >
                Rematch
              </button>
              <button
                className="play-menu-button"
                onClick={() => setGame(new Chess())}
              >
                New Bot
              </button>
            </div>
          </div>
          <div className="mobile-buttons">
            <button
              className="play-menu-button"
              onClick={() => setGame(new Chess())}
            >
              Rematch
            </button>
            <button
              className="play-menu-button"
              onClick={() => setGame(new Chess())}
            >
              New Bot
            </button>
          </div>
        </div>
        <ExpandingLine
          key={`${animationKey}-half`}
          isHalf={true}
          marginTop={finalMarginTop}
        />
      </div>
    </div>
  );
};

const ExpandingLine = ({ isHalf, marginTop }) => {
  return (
    <div
      className={`expanding-line ${isHalf ? "half" : "full"}`}
      style={{ marginTop: marginTop }}
    />
  );
};

export default Play;
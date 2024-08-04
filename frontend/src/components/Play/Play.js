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
  const finalMarginTop = "30px";

  const videoStyles = useSpring({
    opacity: 1,
    filter: "blur(0px)",
    config: { duration: 500 },
  });

  const onDrop = ({ sourceSquare, targetSquare }) => {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (move === null) return;
    setGame(new Chess(game.fen()));
    setHighlightSquares([]);
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
            width={700}
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
              {game.history().map((move, index) => (
                <div key={index} className="play-menu-item">
                  {move}
                </div>
              ))}
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
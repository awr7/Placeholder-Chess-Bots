import React, { useState } from 'react';
import './Play.css';
import { animated } from 'react-spring';
import playbg from '../../assets/img/play.png';
import Chessboard from 'chessboardjsx';
import { Chess } from 'chess.js';

const Play = () => {
    const [game, setGame] = useState(new Chess());
    const [highlightSquares, setHighlightSquares] = useState([]);

    const onDrop = ({ sourceSquare, targetSquare }) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q'
        });

        if (move === null) return;
        setGame(new Chess(game.fen()));
        setHighlightSquares([]);
    };

    const onSquareClick = (square) => {
        const moves = game.moves({ square, verbose: true });
        const squaresToHighlight = moves.map(move => move.to);
        setHighlightSquares(squaresToHighlight);
    };

    const onMouseOverSquare = (square) => {
        const moves = game.moves({ square, verbose: true });
        if (moves.length > 0) {
            const squaresToHighlight = moves.map(move => move.to);
            setHighlightSquares(squaresToHighlight);
        }
    };

    const onMouseOutSquare = () => {
        setHighlightSquares([]);
    };

    const squareStyles = highlightSquares.reduce((a, c) => {
        a[c] = { backgroundColor: 'rgba(255, 255, 0, 0.4)' };
        return a;
    }, {});

    return (
        <div className="play-container">
            <animated.img
                src={playbg}
                alt="Static background"
                className="video-background play-background"
            />
            <Chessboard
                width={800}
                position={game.fen()}
                onDrop={onDrop}
                onSquareClick={onSquareClick}
                onMouseOverSquare={onMouseOverSquare}
                onMouseOutSquare={onMouseOutSquare}
                squareStyles={squareStyles}
                lightSquareStyle={{ backgroundColor: '#ffffff' }}
                darkSquareStyle={{ backgroundColor: '#999999' }}
                boardStyle={{
                    borderRadius: '5px',
                    boxShadow: `0 5px 15px rgba(0, 0, 0, 0.5)`
                }}
            />
            <h1>Play</h1>
        </div>
    );
}

export default Play;
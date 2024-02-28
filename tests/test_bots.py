import unittest
import chess
from bots.random_bot import select_random_move as random_move
from bots.minimax_bot import make_move as minimax_move

class TestBots(unittest.TestCase):
    def setUp(self):
        self.board = chess.Board()

    def test_random_bot_legal_move(self):
        move = random_move(self.board)
        self.assertIn(move, self.board.legal_moves, "Random Bot should return a legal move.")

    def test_minimax_bot_legal_move(self):
        move = minimax_move(self.board, depth=3)
        self.assertIn(move, self.board.legal_moves, "Minimax Bot should return a legal move.")

if __name__ == '__main__':
    unittest.main()

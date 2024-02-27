"""Bot that simply plays random legal moves"""

import random

def select_random_move(board):
    legal_moves = list(board.legal_moves)
    return random.choice(legal_moves) if legal_moves else None
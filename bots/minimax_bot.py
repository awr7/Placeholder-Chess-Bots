""" Bot that follows the minimax algorithm to decide the best move """
import chess

def terminal(board):
    return board.is_checkmate() or board.is_stalemate() or board.is_insufficient_material()

CHECKMATE_SCORE = 10000

piece_square_tables = {
    'P':[
        0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
        5,  5, 10, 25, 25, 10,  5,  5,
        0,  0,  0, 20, 20,  0,  0,  0,
        5, -5,-10,  0,  0,-10, -5,  5,
        5, 10, 10,-20,-20, 10, 10,  5,
        0,  0,  0,  0,  0,  0,  0,  0
    ],
    'N':[
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50,
    ],
    'B':[
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20,
    ],
    'R':[
        0,  0,  0,  0,  0,  0,  0,  0,
        5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        0,  0,  0,  5,  5,  0,  0,  0
    ],
    'Q':[
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
        -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
    ],
    'K':[
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20, 20,  0,  0,  0,  0, 20, 20,
        20, 30, 10,  0,  0, 10, 30, 20
    ]
}

def get_piece_square_score(piece, square):
    piece_type = piece.symbol().upper()
    is_white = piece.color == chess.WHITE
    table = piece_square_tables.get(piece_type, [0] * 64)
    index = square if is_white else 63 - square
    return table[index]

def evaluate_board(board):
    if board.is_checkmate():
        return -CHECKMATE_SCORE if board.turn else CHECKMATE_SCORE
    if board.is_stalemate() or board.is_insufficient_material():
        return 0

    piece_values = {
        'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
        'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000
    }
    score = 0

    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            # Adjust score based on piece value
            score += piece_values.get(piece.symbol(), 0)
            # Adjust score based on piece square table
            score += get_piece_square_score(piece, square)

    return score

def sort_moves(board):
    legal_moves = list(board.legal_moves)
    return sorted(legal_moves, key=lambda move: evaluate_move(board, move), reverse=True)

def evaluate_move(board, move):
    # Simple heuristic: prioritize captures
    if board.is_capture(move):
        return 10
    else:
        return 0

def minimax(board, depth, is_maximizing):
    if depth == 0 or terminal(board):
        return evaluate_board(board)
    
    if is_maximizing:
        max_eval = float('-inf')
        for move in sort_moves(board):
            board.push(move)
            evaluation = minimax(board, depth - 1, False)
            board.pop()
            max_eval = max(max_eval, evaluation)
        return max_eval
    else:
        min_eval = float('inf')
        for move in sort_moves(board):
            board.push(move)
            evaluation = minimax(board, depth - 1, True)
            board.pop()
            min_eval = min(min_eval, evaluation)
        return min_eval

def make_move(board, depth=3):
    best_move = None
    best_value = float('-inf') if board.turn == chess.WHITE else float('inf')

    for move in sort_moves(board):
        board.push(move)
        move_value = minimax(board, depth - 1, board.turn == chess.BLACK)
        board.pop()
        if (board.turn == chess.WHITE and move_value > best_value) or (board.turn == chess.BLACK and move_value < best_value):
            best_value = move_value
            best_move = move
    
    return best_move

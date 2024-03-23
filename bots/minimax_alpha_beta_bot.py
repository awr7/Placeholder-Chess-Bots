""" Bot that follows the minimax algorithm to decide the best move """
import chess

CHECKMATE_SCORE = 1000000
INFINITY = float('inf')
transposition_table = {}

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

piece_values = {
    'P': 100, 'N': 320, 'B': 330, 'R': 500, 'Q': 900, 'K': 20000,
    'p': -100, 'n': -320, 'b': -330, 'r': -500, 'q': -900, 'k': -20000
}

def terminal(board):
    return board.is_checkmate() or board.is_stalemate() or board.is_insufficient_material()

def get_piece_square_score(piece, square):
    if not piece:
        return 0
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

    score = 0
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            # Adjust the score based on piece value and position
            score += piece_values.get(piece.symbol(), 0)
            score += get_piece_square_score(piece, square)

            # Encourage development and central control
            if piece.piece_type != chess.PAWN:
                score += len(board.attacks(square)) * 10  # Bonus for active pieces
                
    # Penalty for attacks on king
    king_square = board.king(board.turn)
    if king_square:
        score -= len(board.attackers(not board.turn, king_square)) * 50

    return score



def quiescence_search(board, alpha, beta):
    stand_pat = evaluate_board(board)
    if stand_pat >= beta:
        return beta
    if alpha < stand_pat:
        alpha = stand_pat

    for move in board.legal_moves:
        if board.is_capture(move):
            board.push(move)
            score = -quiescence_search(board, -beta, -alpha)
            board.pop()

            if score >= beta:
                return beta
            if score > alpha:
                alpha = score

    return alpha

def sort_moves(board):
    legal_moves = list(board.legal_moves)
    return sorted(legal_moves, key=lambda move: evaluate_move(board, move), reverse=board.turn)

def evaluate_move(board, move):
    score = 0

    board.push(move)

    # Immediate checkmate check
    if board.is_checkmate():
        score += CHECKMATE_SCORE
    else:
        moving_piece = board.piece_at(move.from_square)
        captured_piece = board.piece_at(move.to_square)
        
        if moving_piece:
            score += get_piece_square_score(moving_piece, move.to_square)
            moving_piece_value = piece_values.get(moving_piece.symbol(), 0)

            if captured_piece:
                captured_piece_value = piece_values.get(captured_piece.symbol(), 0)
                score += captured_piece_value

                # Evaluate the trade-off
                if captured_piece_value < moving_piece_value:
                    score -= moving_piece_value

            # Penalize if the moved piece can be captured next
            if board.is_attacked_by(not board.turn, move.to_square):
                score -= moving_piece_value

    board.pop()
    #print(f"Evaluating move {move}: Score = {score}")
    return score


def minimax_with_alpha_beta(board, depth, alpha, beta, is_maximizing):
    global transposition_table
    board_fen = board.fen()

    if board_fen in transposition_table:
        return transposition_table[board_fen]

    if depth == 0 or terminal(board):
        return quiescence_search(board, alpha, beta)

    sorted_moves = sort_moves(board)

    if is_maximizing:
        max_eval = -INFINITY
        for move in sorted_moves:
            board.push(move)
            eval = minimax_with_alpha_beta(board, depth - 1, -beta, -alpha, not is_maximizing)
            board.pop()
            max_eval = max(max_eval, eval)
            alpha = max(alpha, eval)
            if beta <= alpha:
                break
        transposition_table[board_fen] = max_eval
        return max_eval
    else:
        min_eval = INFINITY
        for move in sorted_moves:
            board.push(move)
            eval = minimax_with_alpha_beta(board, depth - 1, -beta, -alpha, not is_maximizing)
            board.pop()
            min_eval = min(min_eval, eval)
            beta = min(beta, eval)
            if beta <= alpha:
                break
        transposition_table[board_fen] = min_eval
        return min_eval

def iterative_deepening(board, max_depth):
    best_move = None
    best_value = -INFINITY
    alpha = -INFINITY
    beta = INFINITY

    for depth in range(1, max_depth + 1):
        for move in sort_moves(board):
            board.push(move)
            value = minimax_with_alpha_beta(board, depth - 1, -beta, -alpha, False)
            board.pop()
            if value > best_value:
                best_value = value
                best_move = move
                alpha = max(alpha, value)
                # print(f"New best move: {best_move} with score {best_value}")
    return best_move

def make_move_with_alpha_beta(board, depth=7):
    return iterative_deepening(board, depth)
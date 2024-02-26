import chess

class ChessBoard:
    def __init__(self):
        self.board = chess.Board()

    def display(self):
        print("Current Board: ")
        print(self.board)
    
    def make_move(self, move):
        try:
            move = self.board.parse_san(move) if not chess.Move.from_uci(move) in self.board.legal_moves else chess.Move.from_uci(move)
            self.board.push(move)
            return True
        except ValueError:
            print("Illegal move bitch!")
            return False
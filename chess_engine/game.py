from board import ChessBoard

class ChessGame:
    def __init__(self):
        self.chess_board = ChessBoard()

    def start_game(self):
        self.chess_board.display()

        while not self.chess_board.board.is_game_over():
            move = input("Enter your move: ")
            if self.chess_board.make_move(move):
                self.chess_board.display()
            else:
                print("Try again")
        
        print("Game over. You: ", self.chess_board.board.result())
    
if __name__ == "__main__":
    game = ChessGame()
    game.start_game()
import time
import chess
from board import ChessBoard
from bots.random_bot import select_random_move as random_move
from bots.minimax_bot import make_move as minimax_move

class ChessGame:
    def __init__(self):
        self.chess_board = ChessBoard()
        self.game_results = []
        self.start_time = None
        self.time_limit = 180
        self.captures = []

    def play_game(self, white_bot, black_bot, white_bot_name="White Bot", black_bot_name="Black Bot", time_limit=60):
        self.chess_board = ChessBoard()
        self.start_time = time.time()
        self.time_limit = time_limit
        self.captures = []  # Reset captures for each game
        move_count = 0

        while not self.chess_board.board.is_game_over() and time.time() - self.start_time < self.time_limit:
            current_player = 'White' if self.chess_board.board.turn == chess.WHITE else 'Black'
            bot_name = white_bot_name if current_player == 'White' else black_bot_name
            move = white_bot(self.chess_board.board) if current_player == 'White' else black_bot(self.chess_board.board)
            
            if move:
                # Check for capture
                if self.chess_board.board.is_capture(move):
                    captured_piece = self.chess_board.board.piece_at(move.to_square)
                    self.captures.append(f"{bot_name} captured {captured_piece} on move {move_count + 1}.")
                print(f"{current_player} ({bot_name}) moved: {move}")
                self.chess_board.make_move(move.uci())
                move_count += 1
            else:
                print(f"{current_player} bot failed to make a move.")
                break

        game_result, reason = self.get_game_result()
        self.game_results.append((white_bot_name, black_bot_name, game_result, reason, move_count, self.captures))


    def get_game_result(self):
        if self.chess_board.board.is_checkmate():
            return ("win", "checkmate")
        elif self.chess_board.board.is_stalemate():
            return ("draw", "stalemate")
        elif self.chess_board.board.can_claim_draw():
            return ("draw", "insufficient material or repetition")
        elif self.chess_board.board.is_seventyfive_moves() or self.chess_board.board.is_fivefold_repetition():
            return ("draw", "75 moves rule or fivefold repetition")
        elif time.time() - self.start_time >= self.time_limit:
            # Determine which player ran out of time
            loser = "White" if self.chess_board.board.turn == chess.BLACK else "Black"
            # Check if the opponent has sufficient material to win
            has_material_to_win = not self.chess_board.board.has_insufficient_material(chess.WHITE) or not self.chess_board.board.has_insufficient_material(chess.BLACK)
            if has_material_to_win:
                return ("loss", f"{loser} ran out of time")
            else:
                return ("draw", "insufficient material despite time out")
        else:
            return ("unknown", "")


    def display_results_summary(self):
        for i, (white, black, result, reason, moves, captures) in enumerate(self.game_results, 1):
            game_desc = f"Game {i}: "
            if result == "win":
                # Determine the winner based on who was set to move next (because the last move made was by the winner)
                winner = black if self.chess_board.board.turn == chess.WHITE else white
                game_desc += f"{winner} ({'White' if winner == white else 'Black'}) won by {reason} in {moves} moves."
            elif result == "loss":
                # Determine the loser based on who ran out of time, and thus the other player wins
                loser = white if reason.endswith("White ran out of time") else black
                winner = black if loser == white else white  # The opposite player is the winner
                game_desc += f"{winner} ({'White' if winner == white else 'Black'}) won because {loser} ran out of time in {moves} moves."
            else:  # Handles draws differently
                game_desc += f"Draw due to {reason} in {moves} moves."

            print("\nMaterial count at the end of Game", i)
            self.print_material_count()
            print(game_desc)
            
            # for capture in captures:
            #     print(capture)
            
    def print_material_count(self):
        piece_types = [chess.PAWN, chess.KNIGHT, chess.BISHOP, chess.ROOK, chess.QUEEN, chess.KING]
        white_material = {piece: len(self.chess_board.board.pieces(piece, chess.WHITE)) for piece in piece_types}
        black_material = {piece: len(self.chess_board.board.pieces(piece, chess.BLACK)) for piece in piece_types}
        print("White Material:")
        for piece, count in white_material.items():
            print(f"{chess.piece_name(piece).capitalize()}: {count}")
        print("Black Material:")
        for piece, count in black_material.items():
            print(f"{chess.piece_name(piece).capitalize()}: {count}")

if __name__ == "__main__":
    game = ChessGame()
    games_to_play = 3
    for i in range(games_to_play):
        if i % 2 == 0:
            game.play_game(random_move, minimax_move, "Random Bot", "Minimax Bot")
        else:
            game.play_game(minimax_move, random_move, "Minimax Bot", "Random Bot")
    game.display_results_summary()
# Available bots:
# Random bot: random_move
# Minimax: minimax_move
# Minimax with alpha beta pruning: alpha_beta_move

import time
import chess
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), '..'))
from board import ChessBoard
from bots.random_bot import select_random_move as random_move
from bots.minimax_bot import make_move as minimax_move
from bots.minimax_alpha_beta_bot import make_move_with_alpha_beta as alpha_beta_move

class ChessGame:
    def __init__(self):
        self.chess_board = ChessBoard()
        self.game_results = []
        self.white_time_left = 180
        self.black_time_left = 180
        self.captures = []

    def play_game(self, white_bot, black_bot, white_bot_name="White Bot", black_bot_name="Black Bot"):
        self.chess_board = ChessBoard()
        self.captures = []  # Reset captures for each game
        move_count = 0

        while not self.chess_board.board.is_game_over():
            start_time = time.time()
            current_player = 'White' if self.chess_board.board.turn == chess.WHITE else 'Black'

            if (current_player == 'White' and white_bot is None) or (current_player == 'Black' and black_bot is None):
                move = self.human_move()
            else:
                move = white_bot(self.chess_board.board) if current_player == 'White' else black_bot(self.chess_board.board)

            if move:
                end_time = time.time()
                elapsed_time = end_time - start_time

                if current_player == 'White' and white_bot is not None:
                    self.white_time_left -= elapsed_time
                    if self.white_time_left <= 0:
                        break
                elif current_player == 'Black' and black_bot is not None:
                    self.black_time_left -= elapsed_time
                    if self.black_time_left <= 0:
                        break

                if self.chess_board.board.is_capture(move):
                    captured_piece = self.chess_board.board.piece_at(move.to_square)
                    capture_message = f"{current_player} captured {captured_piece.symbol().upper()} on move {move_count + 1}." if captured_piece else f"{current_player} made an en passant capture on move {move_count + 1}."
                    self.captures.append(capture_message)

                print(f"{current_player} moved: {move}")
                self.chess_board.make_move(move.uci())
                move_count += 1
            else:
                print(f"{current_player} failed to make a move.")
                break

        game_result, reason = self.get_game_result()
        self.game_results.append((white_bot_name, black_bot_name, game_result, reason, move_count, self.captures))

    def human_move(self):
        legal_moves = [self.chess_board.board.san(move) for move in self.chess_board.board.legal_moves]
        print("Legal moves are:", ', '.join(legal_moves))
        move = input("Your move: ")
        while move not in legal_moves:
            print("Invalid move. Legal moves are:", ', '.join(legal_moves))
            move = input("Your move: ")
        return self.chess_board.board.parse_san(move)

    def get_game_result(self):
        if self.chess_board.board.is_checkmate():
            winner = "Black" if self.chess_board.board.turn == chess.WHITE else "White"
            return ("win", f"checkmate by {winner}")
        elif self.chess_board.board.is_stalemate():
            return ("draw", "stalemate")
        elif self.chess_board.board.can_claim_draw():
            return ("draw", "insufficient material or repetition")
        elif self.chess_board.board.is_seventyfive_moves() or self.chess_board.board.is_fivefold_repetition():
            return ("draw", "75 moves rule or fivefold repetition")
        elif self.white_time_left <= 0:
            return ("loss", "White ran out of time")
        elif self.black_time_left <= 0:
            return ("loss", "Black ran out of time")
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
    player_choice = input("Do you want to play? (y/n): ")
    if player_choice.lower() == 'y':
        player_color = input("Choose your color (White/Black): ").capitalize()
        if player_color == 'White':
            game.play_game(None, alpha_beta_move, "Human", "Alpha-Beta Bot")
        else:
            game.play_game(alpha_beta_move, None, "Alpha-Beta Bot", "Human")
    else:
        game.play_game(alpha_beta_move, minimax_move, "Alpha-Beta Bot", "MinMax bot")

    game.display_results_summary()
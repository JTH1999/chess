import { useState } from "react";
import {
  capturePiece,
  checkIfCheck,
  checkIfCheckmate,
  checkAvailableMoves,
} from "./helperFunctions.js";

export default function Square({
  row,
  col,
  piece,
  pieces,
  setPieces,
  selectedPiece,
  setSelectedPiece,
  whiteToMove,
  setWhiteToMove,
  capturedPieces,
  setCapturedPieces,
  whiteKingSquare,
  setWhiteKingSquare,
  blackKingSquare,
  setBlackKingSquare,
  check,
  setCheck,
  checkmate,
  setCheckmate,
  promote,
  setPromote,
}) {
  let cn;
  if (row % 2 == 0) {
    cn = col % 2 == 0 ? "square black" : "square";
  } else {
    cn = col % 2 !== 0 ? "square black" : "square";
  }

  const square = row.toString() + col.toString();
  piece = null;

  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].currentRow == row && pieces[i].currentCol == col) {
      piece = pieces[i];
      break;
    }
  }

  function promotePiece() {}

  function handleClick() {
    // if there is a selected piece
    if (selectedPiece.piece) {
      if (promote) {
        return;
      }
      if (selectedPiece.piece.availableMoves.includes(square)) {
        let piecesCopy = JSON.parse(JSON.stringify(pieces));
        let selectedPieceIndex;
        for (let i = 0; i < pieces.length; i++) {
          if (pieces[i].name === selectedPiece.piece.name) {
            selectedPieceIndex = i;
            break;
          }
        }
        piecesCopy[selectedPieceIndex].currentCol = col;
        piecesCopy[selectedPieceIndex].currentRow = row;
        piecesCopy[selectedPieceIndex].moved = true;

        let capturedPiecesCopy = capturedPieces.slice(0);

        if (piece) {
          capturePiece(
            piece,
            capturedPiecesCopy,
            piecesCopy,
            selectedPieceIndex
          );
        }

        let newWhiteKingSquare = whiteKingSquare;
        let newBlackKingSquare = blackKingSquare;

        if (selectedPiece.piece.type == "king") {
          selectedPiece.piece.colour == "white"
            ? (newWhiteKingSquare = square)
            : (newBlackKingSquare = square);
        }

        // must finish move out of check
        for (let i = 0; i < piecesCopy.length; i++) {
          piecesCopy[i].availableMoves = checkAvailableMoves(
            piecesCopy[i],
            piecesCopy
          );
          if (
            piecesCopy[i].colour != selectedPiece.piece.colour &&
            ((selectedPiece.piece.colour == "black" &&
              piecesCopy[i].availableMoves.includes(newBlackKingSquare)) ||
              (selectedPiece.piece.colour == "white" &&
                piecesCopy[i].availableMoves.includes(newWhiteKingSquare)))
          ) {
            return;
          }
        }

        // if promoting pawn, set promote to true and return,
        // following logic then handled by other function
        if (selectedPiece.piece.type == "pawn" && (row == 0 || row == 7)) {
          setPromote(true);
          setPieces(piecesCopy);
          setCapturedPieces(capturedPiecesCopy);
          return;
        }

        const inCheck = checkIfCheck(
          piecesCopy,
          selectedPieceIndex,
          newBlackKingSquare,
          newWhiteKingSquare
        );

        // check if checkmate
        let inCheckmate = false;
        if (inCheck) {
          inCheckmate = checkIfCheckmate(
            piecesCopy,
            selectedPieceIndex,
            newBlackKingSquare,
            newWhiteKingSquare
          );
        }

        if (selectedPiece.piece.type == "king") {
          selectedPiece.piece.colour == "white"
            ? setWhiteKingSquare(square)
            : setBlackKingSquare(square);
        }
        setCheck(inCheck);
        setCheckmate(inCheckmate);
        setPieces(piecesCopy);
        setSelectedPiece({ piece: null, square: null });
        setWhiteToMove(!whiteToMove);
        setCapturedPieces(capturedPiecesCopy);
      } else if (selectedPiece.square == square) {
        setSelectedPiece({ piece: null, square: null });
      }
      // if no piece selected yet
    } else if (piece) {
      if (
        (whiteToMove && piece.colour == "white") ||
        (!whiteToMove && piece.colour == "black")
      ) {
        let pieceCopy = { ...piece };
        setSelectedPiece({
          piece: pieceCopy,
          square: square,
        });
      }
    }
  }

  return (
    <div
      className={selectedPiece.square == square ? cn + " selected" : cn}
      onClick={handleClick}
    >
      <img src={piece ? piece.src : null} className="piece" />
    </div>
  );
}

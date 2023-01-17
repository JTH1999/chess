export function capturePiece(
  piece,
  capturedPiecesCopy,
  piecesCopy,
  selectedPieceIndex
) {
  for (let i = 0; i < piecesCopy.length; i++) {
    if (piecesCopy[i].name === piece.name) {
      capturedPiecesCopy.push(piece);
      piecesCopy.splice(i, 1);
      if (i < selectedPieceIndex) {
        selectedPieceIndex -= 1;
      }
      break;
    }
  }
}

export function checkIfCheck(
  piecesCopy,
  selectedPieceIndex,
  blackKingSquare,
  whiteKingSquare
) {
  for (let i = 0; i < piecesCopy.length; i++) {
    if (
      (piecesCopy[i].colour == piecesCopy[selectedPieceIndex].colour &&
        piecesCopy[i].colour == "white" &&
        piecesCopy[i].availableMoves.includes(blackKingSquare)) ||
      (piecesCopy[i].colour == piecesCopy[selectedPieceIndex].colour &&
        piecesCopy[i].colour == "black" &&
        piecesCopy[i].availableMoves.includes(whiteKingSquare))
    ) {
      return true;
    }
  }
  return false;
}

export function checkIfCheckmate(
  piecesCopy,
  selectedPieceIndex,
  blackKingSquare,
  whiteKingSquare
) {
  // loop through all possible moves and see if still in check after move
  // returns false if a possible move results in no check, true if still check after all moves
  for (let i = 0; i < piecesCopy.length; i++) {
    if (piecesCopy[i].colour != piecesCopy[selectedPieceIndex].colour) {
      for (let j = 0; j < piecesCopy[i].availableMoves.length; j++) {
        let piecesCopyCopy = JSON.parse(JSON.stringify(piecesCopy));
        let piece = piecesCopyCopy[i];
        piece.currentRow = piecesCopy[i].availableMoves[j][0];
        piece.currentCol = piecesCopy[i].availableMoves[j][1];
        let newWhiteKingSquare = whiteKingSquare;
        let newBlackKingSquare = blackKingSquare;

        if (piece.type == "king") {
          piece.colour == "white"
            ? (newWhiteKingSquare = piecesCopy[i].availableMoves[j])
            : (newBlackKingSquare = piecesCopy[i].availableMoves[j]);
        }
        // if piece on that square, remove
        let tbrIndex;
        for (let k = 0; k < piecesCopyCopy.length; k++) {
          if (
            piecesCopyCopy[k].currentRow == piece.currentRow &&
            piecesCopyCopy[k].currentCol == piece.currentCol &&
            k != i
          ) {
            tbrIndex = k;
            break;
          }
        }
        if (tbrIndex >= 0) {
          piecesCopyCopy.splice(tbrIndex, 1);
          if (tbrIndex < i) {
            piece = piecesCopyCopy[i - 1];
          }
        }

        for (let z = 0; z < piecesCopyCopy.length; z++) {
          piecesCopyCopy[z].availableMoves = checkAvailableMoves(
            piecesCopyCopy[z],
            piecesCopyCopy
          );
        }

        const inCheck = checkIfCheck(
          piecesCopyCopy,
          selectedPieceIndex,
          newBlackKingSquare,
          newWhiteKingSquare
        );
        if (!inCheck) {
          return false;
        }
      }
    }
  }
  return true;
}

// checks if a square contains a piece. Returns true if does, false if not.
function rookBishopCheckIfPiece(pieces, piece, direction, possibleMoves, i) {
  for (let j = 0; j < pieces.length; j++) {
    if (
      (direction == "left" &&
        pieces[j].currentRow == piece.currentRow &&
        pieces[j].currentCol == piece.currentCol - i) ||
      (direction == "right" &&
        pieces[j].currentRow == piece.currentRow &&
        pieces[j].currentCol == piece.currentCol + i) ||
      (direction == "up" &&
        pieces[j].currentRow == piece.currentRow + i &&
        pieces[j].currentCol == piece.currentCol) ||
      (direction == "down" &&
        pieces[j].currentRow == piece.currentRow - i &&
        pieces[j].currentCol == piece.currentCol) ||
      (direction == "upLeft" &&
        pieces[j].currentRow == piece.currentRow + i &&
        pieces[j].currentCol == piece.currentCol - i) ||
      (direction == "upRight" &&
        pieces[j].currentRow == piece.currentRow + i &&
        pieces[j].currentCol == piece.currentCol + i) ||
      (direction == "downLeft" &&
        pieces[j].currentRow == piece.currentRow - i &&
        pieces[j].currentCol == piece.currentCol - i) ||
      (direction == "downRight" &&
        pieces[j].currentRow == piece.currentRow - i &&
        pieces[j].currentCol == piece.currentCol + i)
    ) {
      if (pieces[j].colour != piece.colour) {
        const square =
          pieces[j].currentRow.toString() + pieces[j].currentCol.toString();
        possibleMoves.push(square);
        return true;
      } else {
        return true;
      }
    }
  }

  return false;
}

function checkIfPiece(pieces, piece, square, possibleMoves) {
  for (let i = 0; i < pieces.length; i++) {
    if (
      pieces[i].currentRow == parseInt(square[0]) &&
      pieces[i].currentCol == parseInt(square[1])
    ) {
      if (pieces[i].colour != piece.colour) {
        possibleMoves.push(square);
        return true;
      } else {
        return true;
      }
    }
  }
  return false;
}

export function checkAvailableMoves(piece, pieces) {
  let possibleMoves = [];
  // Square name system is [row][column]
  if (piece.type == "pawn") {
    const rowMove = piece.colour == "white" ? 1 : -1;
    const oneAhead =
      (piece.currentRow + 1 * rowMove).toString() + piece.currentCol.toString();
    possibleMoves.push(oneAhead);
    if (!piece.moved) {
      const twoAhead =
        (piece.currentRow + 2 * rowMove).toString() +
        piece.currentCol.toString();
      possibleMoves.push(twoAhead);
    }

    const diagonalLeft =
      (piece.currentRow + 1 * rowMove).toString() +
      (piece.currentCol - 1).toString();
    const diagonalRight =
      (piece.currentRow + 1 * rowMove).toString() +
      (piece.currentCol + 1).toString();

    // Loop through all pieces to see if any are in the in any of the possible slots
    // plus see if any opposition pieces are in the diagonals
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i] == piece) {
        continue;
      }

      const square =
        pieces[i].currentRow.toString() + pieces[i].currentCol.toString();
      const index = possibleMoves.indexOf(square);
      if (index > -1) {
        possibleMoves.splice(index, 1);
      }

      if (
        pieces[i].colour != piece.colour &&
        (square == diagonalLeft || square == diagonalRight)
      ) {
        possibleMoves.push(square);
      }
    }
  } else if (piece.type == "rook") {
    // row moves
    const rowsLeft = piece.currentCol;
    const rowsRight = 7 - piece.currentCol;

    // col moves
    const colsUp = 7 - piece.currentRow;
    const colsDown = piece.currentRow;

    // left
    for (let i = 1; i <= rowsLeft; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "left",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          piece.currentRow.toString() + (piece.currentCol - i).toString();
        possibleMoves.push(square);
      }
    }

    // right
    for (let i = 1; i <= rowsRight; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "right",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          piece.currentRow.toString() + (piece.currentCol + i).toString();
        possibleMoves.push(square);
      }
    }

    // up
    for (let i = 1; i <= colsUp; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "up",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow + i).toString() + piece.currentCol.toString();
        possibleMoves.push(square);
      }
    }

    // down
    for (let i = 1; i <= colsDown; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "down",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow - i).toString() + piece.currentCol.toString();
        possibleMoves.push(square);
      }
    }
  } else if (piece.type == "knight") {
    // all 8 knight moves, even those outside of the board
    let allKnightMoves = [];
    allKnightMoves.push(
      (piece.currentRow + 2).toString() + (piece.currentCol + 1).toString()
    );
    allKnightMoves.push(
      (piece.currentRow + 1).toString() + (piece.currentCol + 2).toString()
    );
    allKnightMoves.push(
      (piece.currentRow - 1).toString() + (piece.currentCol + 2).toString()
    );
    allKnightMoves.push(
      (piece.currentRow - 2).toString() + (piece.currentCol + 1).toString()
    );
    allKnightMoves.push(
      (piece.currentRow + 2).toString() + (piece.currentCol - 1).toString()
    );
    allKnightMoves.push(
      (piece.currentRow + 1).toString() + (piece.currentCol - 2).toString()
    );
    allKnightMoves.push(
      (piece.currentRow - 1).toString() + (piece.currentCol - 2).toString()
    );
    allKnightMoves.push(
      (piece.currentRow - 2).toString() + (piece.currentCol - 1).toString()
    );

    // knight moves within the board
    let correctKnightMoves = [];
    for (let i = 0; i < allKnightMoves.length; i++) {
      if (
        parseInt(allKnightMoves[i][0]) >= 0 &&
        parseInt(allKnightMoves[i][1]) >= 0 &&
        parseInt(allKnightMoves[i][0]) <= 7 &&
        parseInt(allKnightMoves[i][1]) <= 7
      ) {
        correctKnightMoves.push(allKnightMoves[i]);
      }
    }

    // populate possible moves
    for (let i = 0; i < correctKnightMoves.length; i++) {
      if (!checkIfPiece(pieces, piece, correctKnightMoves[i], possibleMoves)) {
        possibleMoves.push(correctKnightMoves[i]);
      }
    }
  } else if (piece.type == "bishop") {
    // up left
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow + i <= 7 && piece.currentCol - i >= 0)) {
        break;
      }
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "upLeft",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow + i).toString() + (piece.currentCol - i).toString();
        possibleMoves.push(square);
      }
    }

    // up right
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow + i <= 7 && piece.currentCol + i <= 7)) {
        break;
      }

      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "upRight",
        possibleMoves,
        i
      );

      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow + i).toString() + (piece.currentCol + i).toString();
        possibleMoves.push(square);
      }
    }

    // down left
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow - i >= 0 && piece.currentCol - i >= 0)) {
        break;
      }

      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "downLeft",
        possibleMoves,
        i
      );

      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow - i).toString() + (piece.currentCol - i).toString();
        possibleMoves.push(square);
      }
    }

    // down right
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow - i >= 0 && piece.currentCol + i <= 7)) {
        break;
      }
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "downRight",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow - i).toString() + (piece.currentCol + i).toString();
        possibleMoves.push(square);
      }
    }
  } else if (piece.type == "queen") {
    // up left
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow + i <= 7 && piece.currentCol - i >= 0)) {
        break;
      }
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "upLeft",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow + i).toString() + (piece.currentCol - i).toString();
        possibleMoves.push(square);
      }
    }

    // up right
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow + i <= 7 && piece.currentCol + i <= 7)) {
        break;
      }

      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "upRight",
        possibleMoves,
        i
      );

      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow + i).toString() + (piece.currentCol + i).toString();
        possibleMoves.push(square);
      }
    }

    // down left
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow - i >= 0 && piece.currentCol - i >= 0)) {
        break;
      }

      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "downLeft",
        possibleMoves,
        i
      );

      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow - i).toString() + (piece.currentCol - i).toString();
        possibleMoves.push(square);
      }
    }

    // down right
    for (let i = 1; i <= 7; i++) {
      if (!(piece.currentRow - i >= 0 && piece.currentCol + i <= 7)) {
        break;
      }
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "downRight",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow - i).toString() + (piece.currentCol + i).toString();
        possibleMoves.push(square);
      }
    }

    // row moves
    const rowsLeft = piece.currentCol;
    const rowsRight = 7 - piece.currentCol;

    // col moves
    const colsUp = 7 - piece.currentRow;
    const colsDown = piece.currentRow;

    // left
    for (let i = 1; i <= rowsLeft; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "left",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          piece.currentRow.toString() + (piece.currentCol - i).toString();
        possibleMoves.push(square);
      }
    }

    // right
    for (let i = 1; i <= rowsRight; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "right",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          piece.currentRow.toString() + (piece.currentCol + i).toString();
        possibleMoves.push(square);
      }
    }

    // up
    for (let i = 1; i <= colsUp; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "up",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow + i).toString() + piece.currentCol.toString();
        possibleMoves.push(square);
      }
    }

    // down
    for (let i = 1; i <= colsDown; i++) {
      const check = rookBishopCheckIfPiece(
        pieces,
        piece,
        "down",
        possibleMoves,
        i
      );
      if (check) {
        break;
      } else {
        const square =
          (piece.currentRow - i).toString() + piece.currentCol.toString();
        possibleMoves.push(square);
      }
    }
  } else if (piece.type == "king") {
    // all 8 knight moves, even those outside of the board
    let allKingMoves = [];
    allKingMoves.push(
      (piece.currentRow + 1).toString() + piece.currentCol.toString()
    );
    allKingMoves.push(
      (piece.currentRow + 1).toString() + (piece.currentCol + 1).toString()
    );
    allKingMoves.push(
      piece.currentRow.toString() + (piece.currentCol + 1).toString()
    );
    allKingMoves.push(
      (piece.currentRow - 1).toString() + (piece.currentCol + 1).toString()
    );
    allKingMoves.push(
      (piece.currentRow - 1).toString() + piece.currentCol.toString()
    );
    allKingMoves.push(
      (piece.currentRow - 1).toString() + (piece.currentCol - 1).toString()
    );
    allKingMoves.push(
      piece.currentRow.toString() + (piece.currentCol - 1).toString()
    );
    allKingMoves.push(
      (piece.currentRow + 1).toString() + (piece.currentCol - 1).toString()
    );

    // king moves within the board
    let correctKingMoves = [];
    for (let i = 0; i < allKingMoves.length; i++) {
      if (
        parseInt(allKingMoves[i][0]) >= 0 &&
        parseInt(allKingMoves[i][1]) >= 0 &&
        parseInt(allKingMoves[i][0]) <= 7 &&
        parseInt(allKingMoves[i][1]) <= 7
      ) {
        correctKingMoves.push(allKingMoves[i]);
      }
    }

    // populate possible moves
    for (let i = 0; i < correctKingMoves.length; i++) {
      if (!checkIfPiece(pieces, piece, correctKingMoves[i], possibleMoves)) {
        possibleMoves.push(correctKingMoves[i]);
      }
    }
  }

  return possibleMoves;
}

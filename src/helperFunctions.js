export function capturePiece(piece, capturedPiecesCopy, piecesCopy) {
    for (let i = 0; i < piecesCopy.length; i++) {
        if (piecesCopy[i].name === piece.name) {
            capturedPiecesCopy.push(piece);
            piecesCopy[i].currentCol = -1;
            piecesCopy[i].currentRow = -1;
        }
    }
}

// Calculate every piece's available moves - return true if no check, false if check
export function finishOutOfCheck(
    piecesCopy,
    selectedPiece,
    newBlackKingSquare,
    newWhiteKingSquare,
    moves
) {
    for (let i = 0; i < piecesCopy.length; i++) {
        piecesCopy[i].availableMoves = checkAvailableMoves(
            piecesCopy[i],
            piecesCopy,
            moves
        );
        if (
            piecesCopy[i].colour != selectedPiece.piece.colour &&
            ((selectedPiece.piece.colour == "black" &&
                piecesCopy[i].availableMoves.includes(newBlackKingSquare)) ||
                (selectedPiece.piece.colour == "white" &&
                    piecesCopy[i].availableMoves.includes(newWhiteKingSquare)))
        ) {
            return false;
        }
    }

    return true;
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
    whiteKingSquare,
    moves
) {
    // loop through all possible moves and see if still in check after move
    // returns false if a possible move results in no check, true if still check after all moves
    for (let i = 0; i < piecesCopy.length; i++) {
        if (piecesCopy[i].colour != piecesCopy[selectedPieceIndex].colour) {
            for (let j = 0; j < piecesCopy[i].availableMoves.length; j++) {
                let piecesCopyCopy = JSON.parse(JSON.stringify(piecesCopy));
                let piece = piecesCopyCopy[i];
                piece.currentRow = piecesCopy[i].availableMoves[j][1];
                piece.currentCol = piecesCopy[i].availableMoves[j][0];
                let newWhiteKingSquare = whiteKingSquare;
                let newBlackKingSquare = blackKingSquare;

                if (piece.type == "king") {
                    piece.colour == "white"
                        ? (newWhiteKingSquare = piecesCopy[i].availableMoves[j])
                        : (newBlackKingSquare =
                              piecesCopy[i].availableMoves[j]);
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
                    // piecesCopyCopy.splice(tbrIndex, 1);
                    // if (tbrIndex < i) {
                    //     piece = piecesCopyCopy[i - 1];
                    // }
                    // if (tbrIndex < selectedPieceIndex) {
                    //     selectedPieceIndex -= 1;
                    // }
                    piecesCopyCopy[tbrIndex].currentRow = -1;
                    piecesCopyCopy[tbrIndex].currentCol = -1;
                }

                for (let z = 0; z < piecesCopyCopy.length; z++) {
                    piecesCopyCopy[z].availableMoves = checkAvailableMoves(
                        piecesCopyCopy[z],
                        piecesCopyCopy,
                        moves
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

export function checkCastleValid(
    check,
    newWhiteKingSquare,
    newBlackKingSquare,
    square,
    piecesCopy,
    selectedPiece,
    moves,
    selectedPieceIndex,
    previousSquare
) {
    if (check) {
        return false;
    }

    // white king side - 71, queen side - 31
    // black king side - 78, queen side - 38
    if (square == "71") {
        newWhiteKingSquare = "61";
    } else if (square == "31") {
        newWhiteKingSquare = "41";
    } else if (square == "78") {
        newBlackKingSquare = "68";
    } else if (square == "38") {
        newBlackKingSquare = "48";
    }

    if (
        !finishOutOfCheck(
            piecesCopy,
            selectedPiece,
            newBlackKingSquare,
            newWhiteKingSquare,
            moves
        )
    ) {
        return false;
    }

    piecesCopy[selectedPieceIndex].currentCol = parseInt(square[0]);
    piecesCopy[selectedPieceIndex].currentRow = parseInt(square[1]);
    piecesCopy[selectedPieceIndex].moved = true;

    if (square == "71") {
        newWhiteKingSquare = square;
    } else if (square == "31") {
        newWhiteKingSquare = square;
    } else if (square == "78") {
        newBlackKingSquare = square;
    } else if (square == "38") {
        newBlackKingSquare = square;
    }

    let pieceCopy = JSON.parse(JSON.stringify(piecesCopy[selectedPieceIndex]));
    let movesCopy = moves.slice(0);
    movesCopy.push([pieceCopy, previousSquare]);

    if (
        !finishOutOfCheck(
            piecesCopy,
            selectedPiece,
            newBlackKingSquare,
            newWhiteKingSquare,
            movesCopy
        )
    ) {
        return false;
    }

    return true;
}

export function checkSquareForPiece(pieces, square, selectedPiece) {
    for (let i = 0; i < pieces.length; i++) {
        if (
            pieces[i].currentRow.toString() == square[1] &&
            pieces[i].currentCol.toString() == square[0] &&
            pieces[i].colour != selectedPiece.colour
        ) {
            return pieces[i];
        }
    }
    return null;
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
                    pieces[j].currentCol.toString() +
                    pieces[j].currentRow.toString();
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
            pieces[i].currentRow == parseInt(square[1]) &&
            pieces[i].currentCol == parseInt(square[0])
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

function checkIfPieceCastle(pieces, castleSquares) {
    for (let i = 0; i < pieces.length; i++) {
        for (let j = 0; j < castleSquares.length; j++) {
            if (
                pieces[i].currentRow == parseInt(castleSquares[j][1]) &&
                pieces[i].currentCol == parseInt(castleSquares[j][0])
            ) {
                return true;
            }
        }
    }

    return false;
}

export function checkAvailableMoves(piece, pieces, moves) {
    let possibleMoves = [];
    // Square name system is [column number][row number]
    if (piece.type == "pawn") {
        const rowMove = piece.colour == "white" ? 1 : -1;
        const oneAhead =
            piece.currentCol.toString() +
            (piece.currentRow + 1 * rowMove).toString();
        possibleMoves.push(oneAhead);
        if (!piece.moved) {
            const twoAhead =
                piece.currentCol.toString() +
                (piece.currentRow + 2 * rowMove).toString();
            possibleMoves.push(twoAhead);
        }

        const diagonalLeft =
            (piece.currentCol - 1).toString() +
            (piece.currentRow + 1 * rowMove).toString();
        const diagonalRight =
            (piece.currentCol + 1).toString() +
            (piece.currentRow + 1 * rowMove).toString();
        // Loop through all pieces to see if any are in the in any of the possible slots
        // plus see if any opposition pieces are in the diagonals
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i] == piece) {
                continue;
            }

            const square =
                pieces[i].currentCol.toString() +
                pieces[i].currentRow.toString();
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

        // En passant
        if (moves.length > 0) {
            const previousPiece = moves[moves.length - 1][0];
            const previousSquare = moves[moves.length - 1][1];
            if (
                previousPiece.type == "pawn" &&
                (previousPiece.currentCol == piece.currentCol + 1 ||
                    previousPiece.currentCol == piece.currentCol - 1) &&
                previousPiece.currentRow == piece.currentRow &&
                (previousPiece.currentRow == previousSquare[1] + 2 ||
                    previousPiece.currentRow == previousSquare[1] - 2)
            ) {
                const enPassantCol = previousPiece.currentCol;
                const enPassantRow =
                    previousPiece.currentRow == previousSquare[1] + 2
                        ? previousPiece.currentRow - 1
                        : previousPiece.currentRow + 1;
                const enPassantSquare =
                    enPassantCol.toString() + enPassantRow.toString();
                possibleMoves.push(enPassantSquare);
            }
        }
    } else if (piece.type == "rook") {
        // row moves
        const rowsLeft = piece.currentCol - 1;
        const rowsRight = 8 - piece.currentCol;

        // col moves
        const colsUp = 8 - piece.currentRow;
        const colsDown = piece.currentRow - 1;

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
                    (piece.currentCol - i).toString() +
                    piece.currentRow.toString();
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
                    (piece.currentCol + i).toString() +
                    piece.currentRow.toString();
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
                    piece.currentCol.toString() +
                    (piece.currentRow + i).toString();
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
                    piece.currentCol.toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
    } else if (piece.type == "knight") {
        // all 8 knight moves, even those outside of the board
        let allKnightMoves = [];
        allKnightMoves.push(
            (piece.currentCol + 1).toString() +
                (piece.currentRow + 2).toString()
        );
        allKnightMoves.push(
            (piece.currentCol + 2).toString() +
                (piece.currentRow + 1).toString()
        );
        allKnightMoves.push(
            (piece.currentCol + 2).toString() +
                (piece.currentRow - 1).toString()
        );
        allKnightMoves.push(
            (piece.currentCol + 1).toString() +
                (piece.currentRow - 2).toString()
        );
        allKnightMoves.push(
            (piece.currentCol - 1).toString() +
                (piece.currentRow + 2).toString()
        );
        allKnightMoves.push(
            (piece.currentCol - 2).toString() +
                (piece.currentRow + 1).toString()
        );
        allKnightMoves.push(
            (piece.currentCol - 2).toString() +
                (piece.currentRow - 1).toString()
        );
        allKnightMoves.push(
            (piece.currentCol - 1).toString() +
                (piece.currentRow - 2).toString()
        );

        // knight moves within the board
        let correctKnightMoves = [];
        for (let i = 0; i < allKnightMoves.length; i++) {
            if (
                parseInt(allKnightMoves[i][0]) >= 1 &&
                parseInt(allKnightMoves[i][1]) >= 1 &&
                parseInt(allKnightMoves[i][0]) <= 8 &&
                parseInt(allKnightMoves[i][1]) <= 8 &&
                allKnightMoves[i].length < 3
            ) {
                correctKnightMoves.push(allKnightMoves[i]);
            }
        }

        // populate possible moves
        for (let i = 0; i < correctKnightMoves.length; i++) {
            if (
                !checkIfPiece(
                    pieces,
                    piece,
                    correctKnightMoves[i],
                    possibleMoves
                )
            ) {
                possibleMoves.push(correctKnightMoves[i]);
            }
        }
    } else if (piece.type == "bishop") {
        // up left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol - i >= 1)) {
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
                    (piece.currentCol - i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }

        // up right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol + i <= 8)) {
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
                    (piece.currentCol + i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }

        // down left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol - i >= 1)) {
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
                    (piece.currentCol - i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }

        // down right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol + i <= 8)) {
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
                    (piece.currentCol + i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
    } else if (piece.type == "queen") {
        if (piece.name == "wq1") {
            console.log("nice");
        }
        // up left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol - i >= 1)) {
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
                    (piece.currentCol - i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }

        // up right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol + i <= 8)) {
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
                    (piece.currentCol + i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }

        // down left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol - i >= 1)) {
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
                    (piece.currentCol - i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }

        // down right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol + i <= 8)) {
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
                    (piece.currentCol + i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }

        // row moves
        const rowsLeft = piece.currentCol - 1;
        const rowsRight = 8 - piece.currentCol;

        // col moves
        const colsUp = 8 - piece.currentRow;
        const colsDown = piece.currentRow - 1;

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
                    (piece.currentCol - i).toString() +
                    piece.currentRow.toString();
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
                    (piece.currentCol + i).toString() +
                    piece.currentRow.toString();
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
                    piece.currentCol.toString() +
                    (piece.currentRow + i).toString();
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
                    piece.currentCol.toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
    } else if (piece.type == "king") {
        // all 8 knight moves, even those outside of the board
        let allKingMoves = [];
        allKingMoves.push(
            piece.currentCol.toString() + (piece.currentRow + 1).toString()
        );
        allKingMoves.push(
            (piece.currentCol + 1).toString() +
                (piece.currentRow + 1).toString()
        );
        allKingMoves.push(
            (piece.currentCol + 1).toString() + piece.currentRow.toString()
        );
        allKingMoves.push(
            (piece.currentCol + 1).toString() +
                (piece.currentRow - 1).toString()
        );
        allKingMoves.push(
            piece.currentCol.toString() + (piece.currentRow - 1).toString()
        );
        allKingMoves.push(
            (piece.currentCol - 1).toString() +
                (piece.currentRow - 1).toString()
        );
        allKingMoves.push(
            (piece.currentCol - 1).toString() + piece.currentRow.toString()
        );
        allKingMoves.push(
            (piece.currentCol - 1).toString() +
                (piece.currentRow + 1).toString()
        );

        // king moves within the board
        let correctKingMoves = [];
        for (let i = 0; i < allKingMoves.length; i++) {
            if (
                parseInt(allKingMoves[i][0]) >= 1 &&
                parseInt(allKingMoves[i][1]) >= 1 &&
                parseInt(allKingMoves[i][0]) <= 8 &&
                parseInt(allKingMoves[i][1]) <= 8
            ) {
                correctKingMoves.push(allKingMoves[i]);
            }
        }

        // populate possible moves
        for (let i = 0; i < correctKingMoves.length; i++) {
            if (
                !checkIfPiece(pieces, piece, correctKingMoves[i], possibleMoves)
            ) {
                possibleMoves.push(correctKingMoves[i]);
            }
        }

        // Castling
        if (!piece.moved) {
            // find rook indexes
            let wr1Index;
            let wr2Index;
            let br1Index;
            let br2Index;

            for (let i = 0; i < pieces.length; i++) {
                if (pieces[i].name == "wr1") {
                    wr1Index = i;
                } else if (pieces[i].name == "wr2") {
                    wr2Index = i;
                } else if (pieces[i].name == "br1") {
                    br1Index = i;
                } else if (pieces[i].name == "br2") {
                    br2Index = i;
                }
            }

            // king side
            let kingSideSquares = [];
            kingSideSquares.push(
                (piece.currentCol + 1).toString() + piece.currentRow.toString()
            );
            kingSideSquares.push(
                (piece.currentCol + 2).toString() + piece.currentRow.toString()
            );

            if (
                (piece.colour == "white" && !pieces[wr2Index]?.moved) ||
                (piece.colour == "black" && !pieces[br2Index]?.moved)
            ) {
                if (!checkIfPieceCastle(pieces, kingSideSquares)) {
                    possibleMoves.push(kingSideSquares[1]);
                }
            }

            // Queen side
            let queenSideSquares = [];
            queenSideSquares.push(
                (piece.currentCol - 1).toString() + piece.currentRow.toString()
            );
            queenSideSquares.push(
                (piece.currentCol - 2).toString() + piece.currentRow.toString()
            );
            queenSideSquares.push(
                (piece.currentCol - 3).toString() + piece.currentRow.toString()
            );

            if (
                (piece.colour == "white" && !pieces[wr1Index]?.moved) ||
                (piece.colour == "black" && !pieces[br1Index]?.moved)
            ) {
                if (!checkIfPieceCastle(pieces, queenSideSquares)) {
                    possibleMoves.push(queenSideSquares[1]);
                }
            }
        }
    }

    return possibleMoves;
}

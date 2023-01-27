import { useState } from "react";
import {
    capturePiece,
    checkIfCheck,
    checkIfCheckmate,
    checkAvailableMoves,
    finishOutOfCheck,
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
    moves,
    setMoves,
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

                let previousSquare =
                    selectedPiece.piece.currentRow.toString() +
                    selectedPiece.piece.currentCol.toString();

                let newWhiteKingSquare = whiteKingSquare;
                let newBlackKingSquare = blackKingSquare;
                let capturedPiecesCopy = capturedPieces.slice(0);
                let movesCopy;
                let pieceCopy;

                // castle
                if (
                    selectedPiece.piece.type == "king" &&
                    !selectedPiece.piece.moved &&
                    square[0] == selectedPiece.piece.currentRow.toString() &&
                    (square[1] ==
                        (selectedPiece.piece.currentCol + 2).toString() ||
                        square[1] ==
                            (selectedPiece.piece.currentCol - 2).toString())
                ) {
                    // Need to check if currently in check or the adjacent square would be in check. Already check the final square later on so no need to repeat
                    if (check) {
                        return;
                    }

                    // white king side - 06, queen side - 02
                    // black king side - 76, queen side - 72
                    if (square == "06") {
                        newWhiteKingSquare = "05";
                    } else if (square == "02") {
                        newWhiteKingSquare = "03";
                    } else if (square == "76") {
                        newBlackKingSquare = "75";
                    } else if (square == "72") {
                        newBlackKingSquare = "73";
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
                        return;
                    }

                    piecesCopy[selectedPieceIndex].currentCol = col;
                    piecesCopy[selectedPieceIndex].currentRow = row;
                    piecesCopy[selectedPieceIndex].moved = true;

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

                    if (square == "06") {
                        newWhiteKingSquare = square;
                        piecesCopy[wr2Index].currentRow = row;
                        piecesCopy[wr2Index].currentCol = col - 1;
                        piecesCopy[wr2Index].moved = true;
                    } else if (square == "02") {
                        newWhiteKingSquare = square;
                        piecesCopy[wr1Index].currentRow = row;
                        piecesCopy[wr1Index].currentCol = col + 1;
                        piecesCopy[wr1Index].moved = true;
                    } else if (square == "76") {
                        newBlackKingSquare = square;
                        piecesCopy[br2Index].currentRow = row;
                        piecesCopy[br2Index].currentCol = col - 1;
                        piecesCopy[br2Index].moved = true;
                    } else if (square == "72") {
                        newBlackKingSquare = square;
                        piecesCopy[br1Index].currentRow = row;
                        piecesCopy[br1Index].currentCol = col + 1;
                        piecesCopy[br1Index].moved = true;
                    }

                    pieceCopy = JSON.parse(
                        JSON.stringify(piecesCopy[selectedPieceIndex])
                    );
                    movesCopy = moves.slice(0);
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
                        return;
                    }
                } else {
                    // Not Castling
                    piecesCopy[selectedPieceIndex].currentCol = col;
                    piecesCopy[selectedPieceIndex].currentRow = row;
                    piecesCopy[selectedPieceIndex].moved = true;

                    if (piece) {
                        selectedPieceIndex = capturePiece(
                            piece,
                            capturedPiecesCopy,
                            piecesCopy,
                            selectedPieceIndex
                        );
                    }

                    // En Passant
                    if (
                        selectedPiece.piece.type == "pawn" &&
                        !piece &&
                        square[1] != selectedPiece.piece.currentCol
                    ) {
                        selectedPieceIndex = capturePiece(
                            moves[moves.length - 1][0],
                            capturedPiecesCopy,
                            piecesCopy,
                            selectedPieceIndex
                        );
                    }

                    if (selectedPiece.piece.type == "king") {
                        selectedPiece.piece.colour == "white"
                            ? (newWhiteKingSquare = square)
                            : (newBlackKingSquare = square);
                    }

                    pieceCopy = JSON.parse(
                        JSON.stringify(piecesCopy[selectedPieceIndex])
                    );
                    movesCopy = moves.slice(0);
                    movesCopy.push([pieceCopy, previousSquare]);

                    // must finish move out of check
                    if (
                        !finishOutOfCheck(
                            piecesCopy,
                            selectedPiece,
                            newBlackKingSquare,
                            newWhiteKingSquare,
                            movesCopy
                        )
                    ) {
                        return;
                    }

                    // if promoting pawn, set promote to true and return,
                    // following logic then handled by other function
                    if (
                        selectedPiece.piece.type == "pawn" &&
                        (row == 0 || row == 7)
                    ) {
                        setPromote(true);
                        setPieces(piecesCopy);
                        setCapturedPieces(capturedPiecesCopy);
                        setMoves(movesCopy);
                        return;
                    }
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
                        newWhiteKingSquare,
                        movesCopy
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
                setMoves(movesCopy);
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

                // check whether each available move would result put self in check
                // if does don't add, if doesn't add

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

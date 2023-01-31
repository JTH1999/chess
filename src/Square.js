import { useState } from "react";
import {
    capturePiece,
    checkIfCheck,
    checkIfCheckmate,
    checkAvailableMoves,
    finishOutOfCheck,
    checkSquareForPiece,
    checkCastleValid,
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
        cn = col % 2 !== 0 ? "square black" : "square";
    } else {
        cn = col % 2 == 0 ? "square black" : "square";
    }

    const square = col.toString() + row.toString();
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
                    selectedPiece.piece.currentCol.toString() +
                    selectedPiece.piece.currentRow.toString();

                let newWhiteKingSquare = whiteKingSquare;
                let newBlackKingSquare = blackKingSquare;
                let capturedPiecesCopy = capturedPieces.slice(0);
                let movesCopy;
                let pieceCopy;

                // castle
                if (
                    selectedPiece.piece.type == "king" &&
                    !selectedPiece.piece.moved &&
                    square[1] == selectedPiece.piece.currentRow.toString() &&
                    (square[0] ==
                        (selectedPiece.piece.currentCol + 2).toString() ||
                        square[0] ==
                            (selectedPiece.piece.currentCol - 2).toString())
                ) {
                    // Need to check if currently in check or the adjacent square would be in check. Already check the final square later on so no need to repeat
                    if (check) {
                        return;
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

                    if (square == "71") {
                        newWhiteKingSquare = square;
                        piecesCopy[wr2Index].currentRow = row;
                        piecesCopy[wr2Index].currentCol = col - 1;
                        piecesCopy[wr2Index].moved = true;
                    } else if (square == "31") {
                        newWhiteKingSquare = square;
                        piecesCopy[wr1Index].currentRow = row;
                        piecesCopy[wr1Index].currentCol = col + 1;
                        piecesCopy[wr1Index].moved = true;
                    } else if (square == "78") {
                        newBlackKingSquare = square;
                        piecesCopy[br2Index].currentRow = row;
                        piecesCopy[br2Index].currentCol = col - 1;
                        piecesCopy[br2Index].moved = true;
                    } else if (square == "38") {
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
                        capturePiece(piece, capturedPiecesCopy, piecesCopy);
                    }

                    // En Passant
                    if (
                        selectedPiece.piece.type == "pawn" &&
                        !piece &&
                        square[0] != selectedPiece.piece.currentCol
                    ) {
                        capturePiece(
                            moves[moves.length - 1][0],
                            capturedPiecesCopy,
                            piecesCopy
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
                        (row == 1 || row == 8)
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
                let legalMoves = [];
                let selectedPieceCopy = JSON.parse(
                    JSON.stringify(selectedPiece)
                );
                selectedPieceCopy.piece = { ...piece };
                let previousSquare =
                    selectedPieceCopy.piece.currentCol.toString() +
                    selectedPieceCopy.piece.currentRow.toString();
                let selectedPieceIndex;
                for (let i = 0; i < pieces.length; i++) {
                    if (pieces[i].name === selectedPieceCopy.piece.name) {
                        selectedPieceIndex = i;
                        break;
                    }
                }

                for (
                    let i = 0;
                    i < selectedPieceCopy.piece.availableMoves.length;
                    i++
                ) {
                    const square = selectedPieceCopy.piece.availableMoves[i];
                    let piecesCopy = JSON.parse(JSON.stringify(pieces));
                    let movesCopy;
                    let newWhiteKingSquare = whiteKingSquare;
                    let newBlackKingSquare = blackKingSquare;
                    let capturedPiecesCopy = capturedPieces.slice(0);
                    piecesCopy[selectedPieceIndex].currentRow = parseInt(
                        selectedPieceCopy.piece.availableMoves[i][1]
                    );
                    piecesCopy[selectedPieceIndex].currentCol = parseInt(
                        selectedPieceCopy.piece.availableMoves[i][0]
                    );

                    selectedPieceCopy.currentCol =
                        piecesCopy[selectedPieceIndex].currentCol;
                    selectedPieceCopy.currentRow =
                        piecesCopy[selectedPieceIndex].currentRow;

                    // castle
                    if (
                        selectedPieceCopy.piece.type == "king" &&
                        !selectedPieceCopy.piece.moved &&
                        square[1] ==
                            piecesCopy[
                                selectedPieceIndex
                            ].currentRow.toString() &&
                        (square[0] ==
                            (
                                piecesCopy[selectedPieceIndex].currentCol + 2
                            ).toString() ||
                            square[0] ==
                                (
                                    piecesCopy[selectedPieceIndex].currentCol -
                                    2
                                ).toString())
                    ) {
                        if (
                            checkCastleValid(
                                check,
                                newWhiteKingSquare,
                                newBlackKingSquare,
                                square,
                                piecesCopy,
                                selectedPieceCopy,
                                moves,
                                selectedPieceIndex,
                                previousSquare
                            )
                        ) {
                            legalMoves.push(square);
                        }
                    } else {
                        // Not Castling

                        let piece = checkSquareForPiece(
                            piecesCopy,
                            square,
                            selectedPieceCopy.piece
                        );

                        if (piece) {
                            capturePiece(piece, capturedPiecesCopy, piecesCopy);
                        }

                        // En Passant
                        if (
                            selectedPieceCopy.piece.type == "pawn" &&
                            !piece &&
                            square[0] != selectedPieceCopy.piece.currentCol
                        ) {
                            capturePiece(
                                moves[moves.length - 1][0],
                                capturedPiecesCopy,
                                piecesCopy
                            );
                        }

                        if (selectedPieceCopy.piece.type == "king") {
                            selectedPieceCopy.piece.colour == "white"
                                ? (newWhiteKingSquare = square)
                                : (newBlackKingSquare = square);
                        }

                        selectedPieceCopy.piece = JSON.parse(
                            JSON.stringify(piecesCopy[selectedPieceIndex])
                        );
                        movesCopy = moves.slice(0);
                        movesCopy.push([
                            selectedPieceCopy.piece,
                            previousSquare,
                        ]);

                        // must finish move out of check
                        if (
                            !finishOutOfCheck(
                                piecesCopy,
                                selectedPieceCopy,
                                newBlackKingSquare,
                                newWhiteKingSquare,
                                movesCopy
                            )
                        ) {
                            continue;
                        }

                        legalMoves.push(square);
                    }
                }

                selectedPieceCopy.piece.availableMoves = legalMoves;
                let piecesCopy = JSON.parse(JSON.stringify(pieces));
                piecesCopy[selectedPieceIndex] = selectedPieceCopy.piece;
                selectedPieceCopy.piece.currentCol = col;
                selectedPieceCopy.piece.currentRow = row;

                setSelectedPiece({
                    piece: selectedPieceCopy.piece,
                    square: square,
                });

                setPieces(piecesCopy);
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

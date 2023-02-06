import translucentCircle from "../Assets/TranslucentCircle.svg";
import translucentRing from "../Assets/TranslucentRing.svg";
import {
    capturePiece,
    checkIfCheck,
    checkIfCheckmate,
    finishOutOfCheck,
    calculateSelectedPieceLegalMoves,
} from "../helperFunctions.js";

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
    analysisMode,
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
        if (analysisMode) {
            return;
        }
        // if there is a selected piece
        if (selectedPiece) {
            if (promote) {
                return;
            }

            if (
                piece?.colour == selectedPiece.colour &&
                piece?.name != selectedPiece.name
            ) {
                let selectedPieceCopy = { ...piece };
                let previousSquare =
                    selectedPieceCopy.currentCol.toString() +
                    selectedPieceCopy.currentRow.toString();

                const legalMoves = calculateSelectedPieceLegalMoves(
                    selectedPieceCopy,
                    pieces,
                    whiteKingSquare,
                    blackKingSquare,
                    capturedPieces,
                    moves,
                    check,
                    previousSquare,
                    selectedPieceCopy.index
                );

                selectedPieceCopy.availableMoves = legalMoves;
                let piecesCopy = JSON.parse(JSON.stringify(pieces));
                piecesCopy[selectedPieceCopy.index] = selectedPieceCopy;
                selectedPieceCopy.currentCol = col;
                selectedPieceCopy.currentRow = row;

                setSelectedPiece(selectedPieceCopy);

                setPieces(piecesCopy);
                return;
            }

            if (selectedPiece.availableMoves.includes(square)) {
                let piecesCopy = JSON.parse(JSON.stringify(pieces));
                let newWhiteKingSquare = whiteKingSquare;
                let newBlackKingSquare = blackKingSquare;
                let capturedPiecesCopy = capturedPieces.slice(0);
                let movesCopy = moves.slice(0);
                let capturedPiece = null;

                // castle
                if (
                    selectedPiece.type == "king" &&
                    !selectedPiece.moved &&
                    square[1] == selectedPiece.currentRow.toString() &&
                    (square[0] == (selectedPiece.currentCol + 2).toString() ||
                        square[0] == (selectedPiece.currentCol - 2).toString())
                ) {
                    piecesCopy[selectedPiece.index].currentCol = col;
                    piecesCopy[selectedPiece.index].currentRow = row;
                    piecesCopy[selectedPiece.index].moved = true;

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

                    movesCopy.push({
                        movedPieceIndex: selectedPiece.index,
                        pieces: piecesCopy,
                    });
                } else {
                    // Not Castling
                    piecesCopy[selectedPiece.index].currentCol = col;
                    piecesCopy[selectedPiece.index].currentRow = row;
                    piecesCopy[selectedPiece.index].moved = true;

                    if (piece) {
                        capturePiece(piece, capturedPiecesCopy, piecesCopy);
                        capturedPiece = piece;
                    }

                    // En Passant
                    if (
                        selectedPiece.type == "pawn" &&
                        !piece &&
                        square[0] != selectedPiece.currentCol
                    ) {
                        capturePiece(
                            piecesCopy[moves[moves.length - 1].movedPieceIndex],
                            capturedPiecesCopy,
                            piecesCopy
                        );

                        capturedPiece =
                            piecesCopy[moves[moves.length - 1].movedPieceIndex];
                    }

                    if (selectedPiece.type == "king") {
                        selectedPiece.colour == "white"
                            ? (newWhiteKingSquare = square)
                            : (newBlackKingSquare = square);
                    }

                    movesCopy.push({
                        movedPieceIndex: selectedPiece.index,
                        pieces: piecesCopy,
                        capturedPiece: capturedPiece,
                    });

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
                        selectedPiece.type == "pawn" &&
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
                    selectedPiece.index,
                    newBlackKingSquare,
                    newWhiteKingSquare
                );

                // check if checkmate
                let inCheckmate = false;
                if (inCheck) {
                    inCheckmate = checkIfCheckmate(
                        piecesCopy,
                        selectedPiece.index,
                        newBlackKingSquare,
                        newWhiteKingSquare,
                        movesCopy
                    );
                }

                if (selectedPiece.type == "king") {
                    selectedPiece.colour == "white"
                        ? setWhiteKingSquare(square)
                        : setBlackKingSquare(square);
                }
                setCheck(inCheck);
                setCheckmate(inCheckmate);
                setPieces(piecesCopy);
                setMoves(movesCopy);
                setSelectedPiece(null);
                setWhiteToMove(!whiteToMove);
                setCapturedPieces(capturedPiecesCopy);
            } else if (
                selectedPiece.currentCol.toString() +
                    selectedPiece.currentRow.toString() ==
                square
            ) {
                setSelectedPiece(null);
            }
            // if no piece selected yet
        } else if (piece) {
            if (
                (whiteToMove && piece.colour == "white") ||
                (!whiteToMove && piece.colour == "black")
            ) {
                let selectedPieceCopy = { ...piece };
                let previousSquare =
                    selectedPieceCopy.currentCol.toString() +
                    selectedPieceCopy.currentRow.toString();

                const legalMoves = calculateSelectedPieceLegalMoves(
                    selectedPieceCopy,
                    pieces,
                    whiteKingSquare,
                    blackKingSquare,
                    capturedPieces,
                    moves,
                    check,
                    previousSquare,
                    selectedPieceCopy.index
                );

                selectedPieceCopy.availableMoves = legalMoves;
                let piecesCopy = JSON.parse(JSON.stringify(pieces));
                piecesCopy[selectedPieceCopy.index] = selectedPieceCopy;
                selectedPieceCopy.currentCol = col;
                selectedPieceCopy.currentRow = row;

                setSelectedPiece(selectedPieceCopy);
                setPieces(piecesCopy);
            }
        }
    }

    return (
        <div
            className={
                selectedPiece?.currentCol.toString() +
                    selectedPiece?.currentRow.toString() ==
                square
                    ? cn + " selected"
                    : cn
            }
            onClick={handleClick}
        >
            <img src={piece ? piece.src : null} className="piece" />
            <img
                src={
                    selectedPiece?.availableMoves.includes(square) && !piece
                        ? translucentCircle
                        : null
                }
                className="available-marker"
            />
            <img
                src={
                    selectedPiece?.availableMoves.includes(square) && piece
                        ? translucentRing
                        : null
                }
                className="available-marker-piece"
            />
        </div>
    );
}

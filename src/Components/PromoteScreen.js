import wRook from "../Assets/pieces/w_rook_svg_NoShadow.svg";
import bRook from "../Assets/pieces/b_rook_svg_NoShadow.svg";
import wKnight from "../Assets/pieces/w_knight_svg_NoShadow.svg";
import bKnight from "../Assets/pieces/b_knight_svg_NoShadow.svg";
import wBishop from "../Assets/pieces/w_bishop_svg_NoShadow.svg";
import bBishop from "../Assets/pieces/b_bishop_svg_NoShadow.svg";
import wQueen from "../Assets/pieces/w_queen_svg_NoShadow.svg";
import bQueen from "../Assets/pieces/b_queen_svg_NoShadow.svg";

import {
    checkIfCheck,
    checkIfCheckmate,
    checkAvailableMoves,
} from "../helperFunctions.js";

export default function PromoteScreen({
    pieces,
    promote,
    setCheck,
    setPromote,
    setCheckmate,
    setPieces,
    setWhiteToMove,
    whiteKingSquare,
    blackKingSquare,
    whiteToMove,
    selectedPiece,
    setSelectedPiece,
    moves,
}) {
    function handleClick(pieceType) {
        let piecesCopy = JSON.parse(JSON.stringify(pieces));

        if (pieceType == "queen") {
            piecesCopy[selectedPiece.index].type = "queen";
            piecesCopy[selectedPiece.index].src =
                piecesCopy[selectedPiece.index].colour == "white"
                    ? wQueen
                    : bQueen;
        } else if (pieceType == "rook") {
            piecesCopy[selectedPiece.index].type = "rook";
            piecesCopy[selectedPiece.index].src =
                piecesCopy[selectedPiece.index].colour == "white"
                    ? wRook
                    : bRook;
        } else if (pieceType == "knight") {
            piecesCopy[selectedPiece.index].type = "knight";
            piecesCopy[selectedPiece.index].src =
                piecesCopy[selectedPiece.index].colour == "white"
                    ? wKnight
                    : bKnight;
        } else if (pieceType == "bishop") {
            piecesCopy[selectedPiece.index].type = "bishop";
            piecesCopy[selectedPiece.index].src =
                piecesCopy[selectedPiece.index].colour == "white"
                    ? wBishop
                    : bBishop;
        }

        piecesCopy[selectedPiece.index].availableMoves = checkAvailableMoves(
            piecesCopy[selectedPiece.index],
            piecesCopy
        );

        const inCheck = checkIfCheck(
            piecesCopy,
            selectedPiece.index,
            blackKingSquare,
            whiteKingSquare
        );

        // check if checkmate
        let inCheckmate = false;
        if (inCheck) {
            inCheckmate = checkIfCheckmate(
                piecesCopy,
                selectedPiece.index,
                blackKingSquare,
                whiteKingSquare,
                moves
            );
        }

        setCheck(inCheck);
        setCheckmate(inCheckmate);
        setPieces(piecesCopy);
        setSelectedPiece(null);
        setWhiteToMove(!whiteToMove);
        setPromote(false);
    }

    return (
        <div
            className="promote-screen"
            style={promote ? { display: "grid" } : { display: "none" }}
        >
            <div className="promote-screen-item">
                <img
                    src={whiteToMove ? wQueen : bQueen}
                    className="promote-piece"
                    onClick={() => handleClick("queen")}
                />
            </div>
            <div className="promote-screen-item">
                <img
                    src={whiteToMove ? wBishop : bBishop}
                    className="promote-piece"
                    onClick={() => handleClick("bishop")}
                />
            </div>
            <div className="promote-screen-item">
                <img
                    src={whiteToMove ? wKnight : bKnight}
                    className="promote-piece"
                    onClick={() => handleClick("knight")}
                />
            </div>
            <div className="promote-screen-item">
                <img
                    src={whiteToMove ? wRook : bRook}
                    className="promote-piece"
                    onClick={() => handleClick("rook")}
                />
            </div>
        </div>
    );
}

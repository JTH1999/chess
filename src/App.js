import logo from "./logo.svg";
import wPawn from "./pieces/w_pawn_svg_NoShadow.svg";
import bPawn from "./pieces/b_pawn_svg_NoShadow.svg";
import wRook from "./pieces/w_rook_svg_NoShadow.svg";
import bRook from "./pieces/b_rook_svg_NoShadow.svg";
import wKnight from "./pieces/w_knight_svg_NoShadow.svg";
import bKnight from "./pieces/b_knight_svg_NoShadow.svg";
import wBishop from "./pieces/w_bishop_svg_NoShadow.svg";
import bBishop from "./pieces/b_bishop_svg_NoShadow.svg";
import wQueen from "./pieces/w_queen_svg_NoShadow.svg";
import bQueen from "./pieces/b_queen_svg_NoShadow.svg";
import wKing from "./pieces/w_king_svg_NoShadow.svg";
import bKing from "./pieces/b_king_svg_NoShadow.svg";
import "./App.css";
import { useState } from "react";
import BoardRow from "./BoardRow.js";
import {
    capturePiece,
    checkIfCheck,
    checkIfCheckmate,
    checkAvailableMoves,
} from "./helperFunctions.js";

function App() {
    const [whiteToMove, setWhiteToMove] = useState(true);
    const [capturedPieces, setCapturedPieces] = useState([]);
    const [whiteKingSquare, setWhiteKingSquare] = useState("51");
    const [blackKingSquare, setBlackKingSquare] = useState("58");
    const [check, setCheck] = useState(false);
    const [checkmate, setCheckmate] = useState(false);
    const [promote, setPromote] = useState(false);
    // moves will be an array of arrays [piece, previousSquare];
    const [moves, setMoves] = useState([]);
    const [pieces, setPieces] = useState([
        {
            name: "wp1",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 1,
            moved: false,
            src: wPawn,
            availableMoves: ["13", "14"],
        },
        {
            name: "wp2",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 2,
            moved: false,
            src: wPawn,
            availableMoves: ["23", "24"],
        },
        {
            name: "wp3",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 3,
            moved: false,
            src: wPawn,
            availableMoves: ["33", "34"],
        },
        {
            name: "wp4",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 4,
            moved: false,
            src: wPawn,
            availableMoves: ["43", "44"],
        },
        {
            name: "wp5",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 5,
            moved: false,
            src: wPawn,
            availableMoves: ["53", "54"],
        },
        {
            name: "wp6",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 6,
            moved: false,
            src: wPawn,
            availableMoves: ["63", "64"],
        },
        {
            name: "wp7",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 7,
            moved: false,
            src: wPawn,
            availableMoves: ["73", "74"],
        },
        {
            name: "wp8",
            type: "pawn",
            colour: "white",
            currentRow: 2,
            currentCol: 8,
            moved: false,
            src: wPawn,
            availableMoves: ["83", "84"],
        },
        {
            name: "bp1",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 1,
            moved: false,
            src: bPawn,
            availableMoves: ["16", "15"],
        },
        {
            name: "bp2",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 2,
            moved: false,
            src: bPawn,
            availableMoves: ["26", "25"],
        },
        {
            name: "bp3",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 3,
            moved: false,
            src: bPawn,
            availableMoves: ["36", "35"],
        },
        {
            name: "bp4",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 4,
            moved: false,
            src: bPawn,
            availableMoves: ["46", "45"],
        },
        {
            name: "bp5",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 5,
            moved: false,
            src: bPawn,
            availableMoves: ["56", "55"],
        },
        {
            name: "bp6",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 6,
            moved: false,
            src: bPawn,
            availableMoves: ["66", "65"],
        },
        {
            name: "bp7",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 7,
            moved: false,
            src: bPawn,
            availableMoves: ["76", "75"],
        },
        {
            name: "bp8",
            type: "pawn",
            colour: "black",
            currentRow: 7,
            currentCol: 8,
            moved: false,
            src: bPawn,
            availableMoves: ["86", "85"],
        },
        {
            name: "wr1",
            type: "rook",
            colour: "white",
            currentRow: 1,
            currentCol: 1,
            moved: false,
            src: wRook,
            availableMoves: [],
        },
        {
            name: "wr2",
            type: "rook",
            colour: "white",
            currentRow: 1,
            currentCol: 8,
            moved: false,
            src: wRook,
            availableMoves: [],
        },
        {
            name: "br1",
            type: "rook",
            colour: "black",
            currentRow: 8,
            currentCol: 1,
            moved: false,
            src: bRook,
            availableMoves: [],
        },
        {
            name: "br2",
            type: "rook",
            colour: "black",
            currentRow: 8,
            currentCol: 8,
            moved: false,
            src: bRook,
            availableMoves: [],
        },
        {
            name: "wn1",
            type: "knight",
            colour: "white",
            currentRow: 1,
            currentCol: 2,
            src: wKnight,
            availableMoves: ["31", "33"],
        },
        {
            name: "wn2",
            type: "knight",
            colour: "white",
            currentRow: 1,
            currentCol: 7,
            src: wKnight,
            availableMoves: ["36", "38"],
        },
        {
            name: "bn1",
            type: "knight",
            colour: "black",
            currentRow: 8,
            currentCol: 2,
            src: bKnight,
            availableMoves: ["61", "63"],
        },
        {
            name: "bn2",
            type: "knight",
            colour: "black",
            currentRow: 8,
            currentCol: 7,
            src: bKnight,
            availableMoves: ["66", "68"],
        },
        {
            name: "wb1",
            type: "bishop",
            colour: "white",
            currentRow: 1,
            currentCol: 3,
            src: wBishop,
            availableMoves: [],
        },
        {
            name: "wb2",
            type: "bishop",
            colour: "white",
            currentRow: 1,
            currentCol: 6,
            src: wBishop,
            availableMoves: [],
        },
        {
            name: "bb1",
            type: "bishop",
            colour: "black",
            currentRow: 8,
            currentCol: 3,
            src: bBishop,
            availableMoves: [],
        },
        {
            name: "bb2",
            type: "bishop",
            colour: "black",
            currentRow: 8,
            currentCol: 6,
            src: bBishop,
            availableMoves: [],
        },
        {
            name: "wq1",
            type: "queen",
            colour: "white",
            currentRow: 1,
            currentCol: 4,
            src: wQueen,
            availableMoves: [],
        },
        {
            name: "bq1",
            type: "queen",
            colour: "black",
            currentRow: 8,
            currentCol: 4,
            src: bQueen,
            availableMoves: [],
        },
        {
            name: "wk1",
            type: "king",
            colour: "white",
            currentRow: 1,
            currentCol: 5,
            moved: false,
            src: wKing,
            availableMoves: [],
        },
        {
            name: "bk1",
            type: "king",
            colour: "black",
            currentRow: 8,
            currentCol: 5,
            moved: false,
            src: bKing,
            availableMoves: [],
        },
    ]);
    const [selectedPiece, setSelectedPiece] = useState({
        piece: null,
        square: null,
    });

    return (
        <div className="App game">
            <h3>
                {checkmate ? (
                    <CheckmateScreen whiteToMove={whiteToMove} />
                ) : (
                    <>
                        {whiteToMove ? "White" : "Black"} to move
                        {check ? " - check" : ""}
                    </>
                )}
            </h3>
            <p>
                Available Moves:{" "}
                {selectedPiece.piece
                    ? selectedPiece.piece.availableMoves.toString()
                    : ""}
            </p>
            <p>
                Selected Piece:{" "}
                {selectedPiece.piece ? selectedPiece.piece.name.toString() : ""}
            </p>
            <PromoteScreen
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />

            <BoardRow
                row={8}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={7}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={6}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={5}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={4}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={3}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={2}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
            <BoardRow
                row={1}
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                check={check}
                setCheck={setCheck}
                checkmate={checkmate}
                setCheckmate={setCheckmate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
            />
        </div>
    );
}

function CheckmateScreen({ whiteToMove }) {
    return <>Checkmate - {whiteToMove ? "black" : "white"} wins!</>;
}

function PromoteScreen({
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
        let selectedPieceIndex;
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].name === selectedPiece.piece.name) {
                selectedPieceIndex = i;
                break;
            }
        }

        if (pieceType == "queen") {
            piecesCopy[selectedPieceIndex].type = "queen";
            piecesCopy[selectedPieceIndex].src =
                piecesCopy[selectedPieceIndex].colour == "white"
                    ? wQueen
                    : bQueen;
        } else if (pieceType == "rook") {
            piecesCopy[selectedPieceIndex].type = "rook";
            piecesCopy[selectedPieceIndex].src =
                piecesCopy[selectedPieceIndex].colour == "white"
                    ? wRook
                    : bRook;
        } else if (pieceType == "knight") {
            piecesCopy[selectedPieceIndex].type = "knight";
            piecesCopy[selectedPieceIndex].src =
                piecesCopy[selectedPieceIndex].colour == "white"
                    ? wKnight
                    : bKnight;
        } else if (pieceType == "bishop") {
            piecesCopy[selectedPieceIndex].type = "bishop";
            piecesCopy[selectedPieceIndex].src =
                piecesCopy[selectedPieceIndex].colour == "white"
                    ? wBishop
                    : bBishop;
        }

        piecesCopy[selectedPieceIndex].availableMoves = checkAvailableMoves(
            piecesCopy[selectedPieceIndex],
            piecesCopy
        );

        const inCheck = checkIfCheck(
            piecesCopy,
            selectedPieceIndex,
            blackKingSquare,
            whiteKingSquare
        );

        // check if checkmate
        let inCheckmate = false;
        if (inCheck) {
            inCheckmate = checkIfCheckmate(
                piecesCopy,
                selectedPieceIndex,
                blackKingSquare,
                whiteKingSquare,
                moves
            );
        }

        setCheck(inCheck);
        setCheckmate(inCheckmate);
        setPieces(piecesCopy);
        setSelectedPiece({ piece: null, square: null });
        setWhiteToMove(!whiteToMove);
        setPromote(false);
    }

    return (
        <div
            className="promote-screen"
            style={promote ? { display: "grid" } : { display: "none" }}
        >
            <img
                src={whiteToMove ? wQueen : bQueen}
                className="one"
                onClick={() => handleClick("queen")}
            />
            <img
                src={whiteToMove ? wBishop : bBishop}
                className="two"
                onClick={() => handleClick("bishop")}
            />
            <img
                src={whiteToMove ? wKnight : bKnight}
                className="three"
                onClick={() => handleClick("knight")}
            />
            <img
                src={whiteToMove ? wRook : bRook}
                className="four"
                onClick={() => handleClick("rook")}
            />
        </div>
    );
}

export default App;

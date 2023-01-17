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
  const [whiteKingSquare, setWhiteKingSquare] = useState("04");
  const [blackKingSquare, setBlackKingSquare] = useState("74");
  const [check, setCheck] = useState(false);
  const [checkmate, setCheckmate] = useState(false);
  const [promote, setPromote] = useState(false);
  const [pieces, setPieces] = useState([
    {
      name: "wp1",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 0,
      moved: false,
      src: wPawn,
      availableMoves: ["20", "30"],
    },
    {
      name: "wp2",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 1,
      moved: false,
      src: wPawn,
      availableMoves: ["21", "31"],
    },
    {
      name: "wp3",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 2,
      moved: false,
      src: wPawn,
      availableMoves: ["22", "32"],
    },
    {
      name: "wp4",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 3,
      moved: false,
      src: wPawn,
      availableMoves: ["23", "33"],
    },
    {
      name: "wp5",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 4,
      moved: false,
      src: wPawn,
      availableMoves: ["24", "34"],
    },
    {
      name: "wp6",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 5,
      moved: false,
      src: wPawn,
      availableMoves: ["25", "35"],
    },
    {
      name: "wp7",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 6,
      moved: false,
      src: wPawn,
      availableMoves: ["26", "36"],
    },
    {
      name: "wp8",
      type: "pawn",
      colour: "white",
      currentRow: 1,
      currentCol: 7,
      moved: false,
      src: wPawn,
      availableMoves: ["27", "37"],
    },
    {
      name: "bp1",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 0,
      moved: false,
      src: bPawn,
      availableMoves: ["50", "40"],
    },
    {
      name: "bp2",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 1,
      moved: false,
      src: bPawn,
      availableMoves: ["51", "41"],
    },
    {
      name: "bp3",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 2,
      moved: false,
      src: bPawn,
      availableMoves: ["52", "42"],
    },
    {
      name: "bp4",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 3,
      moved: false,
      src: bPawn,
      availableMoves: ["53", "43"],
    },
    {
      name: "bp5",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 4,
      moved: false,
      src: bPawn,
      availableMoves: ["54", "44"],
    },
    {
      name: "bp6",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 5,
      moved: false,
      src: bPawn,
      availableMoves: ["55", "45"],
    },
    {
      name: "bp7",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 6,
      moved: false,
      src: bPawn,
      availableMoves: ["56", "46"],
    },
    {
      name: "bp8",
      type: "pawn",
      colour: "black",
      currentRow: 6,
      currentCol: 7,
      moved: false,
      src: bPawn,
      availableMoves: ["57", "47"],
    },
    {
      name: "wr1",
      type: "rook",
      colour: "white",
      currentRow: 0,
      currentCol: 0,
      src: wRook,
      availableMoves: [],
    },
    {
      name: "wr2",
      type: "rook",
      colour: "white",
      currentRow: 0,
      currentCol: 7,
      src: wRook,
      availableMoves: [],
    },
    {
      name: "br1",
      type: "rook",
      colour: "black",
      currentRow: 7,
      currentCol: 0,
      src: bRook,
      availableMoves: [],
    },
    {
      name: "br2",
      type: "rook",
      colour: "black",
      currentRow: 7,
      currentCol: 7,
      src: bRook,
      availableMoves: [],
    },
    {
      name: "wn1",
      type: "knight",
      colour: "white",
      currentRow: 0,
      currentCol: 1,
      src: wKnight,
      availableMoves: ["20", "22"],
    },
    {
      name: "wn2",
      type: "knight",
      colour: "white",
      currentRow: 0,
      currentCol: 6,
      src: wKnight,
      availableMoves: ["25", "27"],
    },
    {
      name: "bn1",
      type: "knight",
      colour: "black",
      currentRow: 7,
      currentCol: 1,
      src: bKnight,
      availableMoves: ["50", "52"],
    },
    {
      name: "bn2",
      type: "knight",
      colour: "black",
      currentRow: 7,
      currentCol: 6,
      src: bKnight,
      availableMoves: ["55", "57"],
    },
    {
      name: "wb1",
      type: "bishop",
      colour: "white",
      currentRow: 0,
      currentCol: 2,
      src: wBishop,
      availableMoves: [],
    },
    {
      name: "wb2",
      type: "bishop",
      colour: "white",
      currentRow: 0,
      currentCol: 5,
      src: wBishop,
      availableMoves: [],
    },
    {
      name: "bb1",
      type: "bishop",
      colour: "black",
      currentRow: 7,
      currentCol: 2,
      src: bBishop,
      availableMoves: [],
    },
    {
      name: "bb2",
      type: "bishop",
      colour: "black",
      currentRow: 7,
      currentCol: 5,
      src: bBishop,
      availableMoves: [],
    },
    {
      name: "wq1",
      type: "queen",
      colour: "white",
      currentRow: 0,
      currentCol: 3,
      src: wQueen,
      availableMoves: [],
    },
    {
      name: "bq1",
      type: "queen",
      colour: "black",
      currentRow: 7,
      currentCol: 3,
      src: bQueen,
      availableMoves: [],
    },
    {
      name: "wk1",
      type: "king",
      colour: "white",
      currentRow: 0,
      currentCol: 4,
      src: wKing,
      availableMoves: [],
    },
    {
      name: "bk1",
      type: "king",
      colour: "black",
      currentRow: 7,
      currentCol: 4,
      src: bKing,
      availableMoves: [],
    },
  ]);
  const [selectedPiece, setSelectedPiece] = useState({
    piece: null,
    square: null,
  });

  function promotePiece(newType) {
    console.log(newType);
  }

  return (
    <div className="App game">
      <h3>
        {checkmate ? (
          <CheckmateScreen whiteToMove={whiteToMove} />
        ) : (
          <>
            {whiteToMove ? "White" : "Black"} to move{check ? " - check" : ""}
          </>
        )}
      </h3>
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
      />
      <BoardRow
        row={0}
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
        piecesCopy[selectedPieceIndex].colour == "white" ? wQueen : bQueen;
    } else if (pieceType == "rook") {
      piecesCopy[selectedPieceIndex].type = "rook";
      piecesCopy[selectedPieceIndex].src =
        piecesCopy[selectedPieceIndex].colour == "white" ? wRook : bRook;
    } else if (pieceType == "knight") {
      piecesCopy[selectedPieceIndex].type = "knight";
      piecesCopy[selectedPieceIndex].src =
        piecesCopy[selectedPieceIndex].colour == "white" ? wKnight : bKnight;
    } else if (pieceType == "bishop") {
      piecesCopy[selectedPieceIndex].type = "bishop";
      piecesCopy[selectedPieceIndex].src =
        piecesCopy[selectedPieceIndex].colour == "white" ? wBishop : bBishop;
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
        whiteKingSquare
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

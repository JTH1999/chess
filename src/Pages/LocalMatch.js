import { useState } from "react";
import Board from "../Components/Board";
import { newGamePieces } from "../Data/newGamePieces.js";
import AnalysisSection from "../Components/AnalysisSection";
import { Link } from "react-router-dom";
import CapturedPieces from "../Components/CapturedPieces";

export default function LocalMatch() {
    const [whiteToMove, setWhiteToMove] = useState(true);
    const [capturedPieces, setCapturedPieces] = useState([]);
    const [whiteKingSquare, setWhiteKingSquare] = useState("51");
    const [blackKingSquare, setBlackKingSquare] = useState("58");
    const [check, setCheck] = useState(false);
    const [checkmate, setCheckmate] = useState(false);
    const [promote, setPromote] = useState(false);
    const [moves, setMoves] = useState([]);
    const [pieces, setPieces] = useState(newGamePieces);
    const [selectedPiece, setSelectedPiece] = useState(null);
    const [analysisMode, setAnalysisMode] = useState(false);
    const [analysisMoveNumber, setAnalysisMoveNumber] = useState(1);

    return (
        <div className="App">
            <p className="toMove-text">
                {whiteToMove ? "White" : "Black"} to move
                {check ? " - check" : ""}
            </p>
            <CapturedPieces capturedPieces={capturedPieces} colour="white" />
            <Board
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
                analysisMode={analysisMode}
                setAnalysisMode={setAnalysisMode}
                setAnalysisMoveNumber={setAnalysisMoveNumber}
            />
            <CapturedPieces capturedPieces={capturedPieces} colour="black" />
            <AnalysisSection
                moves={moves}
                pieces={pieces}
                setPieces={setPieces}
                setAnalysisMode={setAnalysisMode}
                analysisMode={analysisMode}
                analysisMoveNumber={analysisMoveNumber}
                setAnalysisMoveNumber={setAnalysisMoveNumber}
            />
        </div>
    );
}

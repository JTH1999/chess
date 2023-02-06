import whiteCheckmate from "../Assets/WhiteCheckmate.png";
import blackCheckmate from "../Assets/BlackCheckmate.png";
import { newGamePieces } from "../Data/newGamePieces.js";

export default function CheckmateScreen({
    checkmate,
    whiteToMove,
    setWhiteToMove,
    setCapturedPieces,
    setWhiteKingSquare,
    setBlackKingSquare,
    setCheck,
    setCheckmate,
    setPromote,
    setMoves,
    setPieces,
    setSelectedPiece,
    setAnalysisMode,
    analysisMode,
    setAnalysisMoveNumber,
    moves,
}) {
    function resetBoard() {
        setWhiteToMove(true);
        setCapturedPieces([]);
        setWhiteKingSquare("51");
        setBlackKingSquare("58");
        setCheck(false);
        setCheckmate(false);
        setPromote(false);
        setMoves([]);
        setPieces(newGamePieces);
        setSelectedPiece(null);
        setAnalysisMode(false);
    }

    function enterAnalysisMode() {
        setAnalysisMode(true);
        setAnalysisMoveNumber(1);
        setPieces(moves[0].pieces);
    }
    return (
        <div
            className="checkmate-screen"
            style={
                checkmate && !analysisMode
                    ? { display: "flex" }
                    : { display: "none" }
            }
        >
            <p className="checkmate-winner-text">
                {whiteToMove ? "Black" : "White"} Wins
            </p>
            <p className="checkmate-text">Checkmate</p>
            <img
                src={whiteToMove ? blackCheckmate : whiteCheckmate}
                className="checkmate-screen-pieces"
            />
            <button className="button" onClick={resetBoard}>
                New Game
            </button>
            <button className="button" onClick={enterAnalysisMode}>
                Analyse
            </button>
        </div>
    );
}

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

export default function AnalysisSection({
    moves,
    pieces,
    setPieces,
    setAnalysisMode,
    analysisMode,
    analysisMoveNumber,
    setAnalysisMoveNumber,
}) {
    const move = analysisMode ? analysisMoveNumber : moves.length;
    const src = pieces[moves[move - 1]?.movedPieceIndex]?.src;
    const moveCol = pieces[moves[move - 1]?.movedPieceIndex]?.currentCol;
    const moveRow = pieces[moves[move - 1]?.movedPieceIndex]?.currentRow;

    function handleLeftClick() {
        if (move <= 1) {
            return;
        } else {
            setAnalysisMoveNumber(move - 1);
            setAnalysisMode(true);
            setPieces(moves[move - 2].pieces);
        }
    }

    function handleRightClick() {
        if (move == moves.length) {
            return;
        } else {
            setAnalysisMoveNumber(move + 1);
            setPieces(moves[move].pieces);
        }

        if (move + 1 == moves.length) {
            setAnalysisMode(false);
        }
    }

    return (
        <div className="analysis">
            <FontAwesomeIcon
                icon={faChevronLeft}
                className={move <= 1 ? "chevron disabled" : "chevron"}
                onClick={handleLeftClick}
            />
            {moves.length > 0 ? (
                <div className="unselectable">
                    {move + ".  "}

                    <img src={src} className="analysis-piece" />
                    {moves[move - 1].capturedPiece ? (
                        <>
                            {" "}
                            {" x "}
                            <img
                                src={moves[move - 1].capturedPiece.src}
                                className="analysis-piece"
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    {" " +
                        String.fromCharCode(moveCol + 64).toLowerCase() +
                        moveRow.toString()}
                </div>
            ) : (
                <></>
            )}

            <FontAwesomeIcon
                icon={faChevronRight}
                className={
                    move == moves.length ? "chevron disabled" : "chevron"
                }
                onClick={handleRightClick}
            />
        </div>
    );
}

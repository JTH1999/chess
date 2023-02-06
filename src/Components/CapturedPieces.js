export default function CapturedPieces({ capturedPieces, colour }) {
    // This is the pieces captured by the player
    const playerCapturedPieces = capturedPieces.filter(
        (capturedPiece) => capturedPiece.colour == colour
    );

    // Pieces captured by the opposition
    const oppositionCapturedPieces = capturedPieces.filter(
        (capturedPiece) => capturedPiece.colour != colour
    );

    let playerCapturedPiecesValue = 0;
    for (let i = 0; i < playerCapturedPieces.length; i++) {
        playerCapturedPiecesValue += playerCapturedPieces[i].value;
    }

    let oppositionCapturedPiecesValue = 0;
    for (let i = 0; i < oppositionCapturedPieces.length; i++) {
        oppositionCapturedPiecesValue += oppositionCapturedPieces[i].value;
    }

    const capturedPawns = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "pawn"
    );

    let capturedPawnsImgs = <></>;
    let zIndex = 9;
    if (capturedPawns.length > 0) {
        capturedPawnsImgs = (
            <div className="captured-piece-type">
                {capturedPawns.map((capturedPiece, index) => (
                    <img
                        key={capturedPiece.index}
                        src={capturedPiece.src}
                        className="captured-pieces"
                        style={{ zIndex: zIndex - index }}
                    />
                ))}
            </div>
        );
    }

    const capturedKnights = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "knight"
    );
    let capturedKnightsImgs = <></>;
    if (capturedKnights.length > 0) {
        capturedKnightsImgs = (
            <div className="captured-piece-type">
                {capturedKnights.map((capturedPiece, index) => (
                    <img
                        key={capturedPiece.index}
                        src={capturedPiece.src}
                        className="captured-pieces"
                        style={{ zIndex: zIndex - index }}
                    />
                ))}
            </div>
        );
    }

    const capturedBishops = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "bishop"
    );
    let capturedBishopsImgs = <></>;
    if (capturedBishops.length > 0) {
        capturedBishopsImgs = (
            <div className="captured-piece-type">
                {capturedBishops.map((capturedPiece, index) => (
                    <img
                        key={capturedPiece.index}
                        src={capturedPiece.src}
                        className="captured-pieces"
                        style={{ zIndex: zIndex - index }}
                    />
                ))}
            </div>
        );
    }

    const capturedRooks = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "rook"
    );
    let capturedRooksImgs = <></>;
    if (capturedRooks.length > 0) {
        capturedRooksImgs = (
            <div className="captured-piece-type">
                {capturedRooks.map((capturedPiece, index) => (
                    <img
                        key={capturedPiece.index}
                        src={capturedPiece.src}
                        className="captured-pieces"
                        style={{ zIndex: zIndex - index }}
                    />
                ))}
            </div>
        );
    }

    const capturedQueens = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "queen"
    );
    let capturedQueensImgs = <></>;
    if (capturedQueens.length > 0) {
        capturedQueensImgs = (
            <div className="captured-piece-type">
                {capturedQueens.map((capturedPiece, index) => (
                    <img
                        key={capturedPiece.index}
                        src={capturedPiece.src}
                        className="captured-pieces"
                        style={{ zIndex: zIndex - index }}
                    />
                ))}
            </div>
        );
    }

    // function compare(objectA, objectB) {
    //     if (objectA.index < objectB.index) {
    //         return -1;
    //     }

    //     if (objectA.index > objectB.index) {
    //         return 1;
    //     }

    //     return 0;
    // }

    // oppositionCapturedPieces.sort(compare);

    return (
        <div className="captured-pieces-section">
            {capturedPawnsImgs}
            {capturedKnightsImgs}
            {capturedBishopsImgs}
            {capturedRooksImgs}
            {capturedQueensImgs}
            {playerCapturedPiecesValue > oppositionCapturedPiecesValue
                ? "+ " +
                  (
                      playerCapturedPiecesValue - oppositionCapturedPiecesValue
                  ).toString()
                : ""}
        </div>
    );
}

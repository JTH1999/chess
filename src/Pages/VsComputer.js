import wBishop from "../Assets/pieces/w_bishop_svg_NoShadow.svg";
import bishopShadow from "../Assets/pieces/JohnPablok Cburnett Chess set/PNGs/With Shadow/256px/w_bishop_png_shadow_256px.png";
import { Link } from "react-router-dom";

export default function VsComputer() {
    return (
        <div className="center">
            <h1>Coming Soon!</h1>
            <img src={bishopShadow} className="coming-soon-image" />
        </div>
    );
}

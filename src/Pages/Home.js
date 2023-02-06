import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch("/api")
            .then((response) => response.json())
            .then((data) => setData(data.message));
    }, []);
    return (
        <div>
            <h1>Jack's Chess</h1>
            <p>{!data ? "Loading..." : data}</p>
            <Link to="/local-match">
                <button className="button">New Local Match</button>
            </Link>
            <Link to="/vs-computer">
                <button className="button">Play vs Computer</button>
            </Link>
            <Link to="/play-online">
                <button className="button">New Online Match</button>
            </Link>
        </div>
    );
}

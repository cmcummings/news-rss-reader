import { Link } from "react-router-dom"
import { newspapers } from "./data"

function Newspapers() {
    return (<div>
        All available newspapers:
        <ul>
            {newspapers.map(np => (
                <li>
                    <Link to={"/news-rss-reader/n/" + np.id}>{np.name}</Link>
                </li>
            ))}
        </ul>
    </div>)
}

export default Newspapers
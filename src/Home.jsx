import { newspapers } from './data';
import logo from './res/logo.png'

function Home() {
    return (
        <div>
            <div className="">
                <div className="container-sm">
                    <img src={logo} className="img-fluid w-50 my-3"></img>
                </div>
            </div>

            <div className="container-sm">
                <div className="container-sm w-100 mt-5 float-start">
                    <h3>News sources:</h3>
                    <div className="list-group">
                        {newspapers.map(np =>
                            <a href={"/news-rss-reader/n/" + np.id} className="list-group-item list-group-item-action">{np.name}</a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home;
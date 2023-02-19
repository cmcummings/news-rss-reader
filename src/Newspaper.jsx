import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { newspapers, categories } from "./data";
import axios from "axios";
import logo from "./res/logo.png"

function Newspaper() {
    let params = useParams()
    let [newspaper, setNewspaper] = useState(null)
    let [articles, setArticles] = useState([])
    let [showAmount, setShowAmount] = useState(10) // How many articles to show

    function parseDescription(desc) {
        let description = ""
        let counting = true
        for (let i = 0; i < desc.length; i++) {
            let c = desc[i]
            if (c === "<") {
                counting = false
            }

            if (counting) {
                description += c
            }

            if (c === ">") {
                counting = true
                description += " "
            }
        }
        return description
    }

    useEffect(() => {
        let np = newspapers.find(e => e.id === params.newspaper)
        if (!np) {
            window.location.replace("/news-rss-reader/")
        }

        document.title = np.name + " - News RSS Reader"
        setNewspaper(np)

        // Determine category
        if (params.category) {
            if (!np.categories[params.category]) {
                window.location.replace("/news-rss-reader/n/" + np.id)
            }
        }

        params.category = params.category || 'top'
        if (!np.categories[params.category]) {
            params.category = Object.keys(np.categories)[0]
        }

        // Get XML
        axios.request({ method: 'get', url: np.categories[params.category] }).then((response) => {
            let arts = []
            // Parse XML
            let xml = new DOMParser().parseFromString(response.data, "text/xml");
            let articlesXML = xml.getElementsByTagName("item")
            for (let i = 0; i < articlesXML.length; i++) {
                let article = articlesXML[i]
                let title = article.getElementsByTagName("title")[0].textContent
                let url = article.getElementsByTagName("link")[0].textContent

                // Parse description
                let description = parseDescription(article.getElementsByTagName("description")[0].textContent)

                // Parse published date
                let pubDate = article.getElementsByTagName("pubDate")[0].textContent
                pubDate = pubDate.split(" ").slice(0, 4).join(" ") // Remove junk

                let data = {
                    title: title,
                    url: url,
                    description: description,
                    date: pubDate
                }

                // Not all articles have images
                let imgXML = article.getElementsByTagName("media:content")[0]
                if (imgXML) {
                    data.img = imgXML.getAttribute("url")
                }

                arts.push(data)
            }

            setArticles(arts)
        }).catch(error => {

        });
    }, [params, showAmount])

    return (
        <div>
            {newspaper
                ?
                <div>
                    {/* Top navbar */}
                    <nav className="navbar sticky-top navbar-expand-lg navbar-light bg-light border-bottom">
                        <div className="container-fluid">
                            <a className="navbar-brand" href="/news-rss-reader"><img src={logo} height="30"></img></a>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <div>
                                    <ul className="navbar-nav">
                                        <li className="nav-item dropdown">
                                            <a className="nav-link active dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {newspaper.name}
                                            </a>
                                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                {newspapers.map(np => (
                                                    np.id !== newspaper.id &&
                                                    <li key={np.id}><a className="dropdown-item" href={"/news-rss-reader/n/" + np.id}>{np.name}</a></li>
                                                ))}
                                            </ul>
                                        </li>
                                        
                                        {Object.keys(newspaper.categories).map(cat => (
                                            <li className="nav-item">
                                                <a key={cat} 
                                                    href={"/news-rss-reader/n/" + newspaper.id + "/" + cat}
                                                    className={params.category === cat ? "nav-link active" : "nav-link"}
                                                    >{categories[cat]}</a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </nav>
                        
                    {/* Main view */}
                    <div className="container-sm mt-4">
                        <h2>{categories[params.category]} stories from the {newspaper.name}</h2>
                        
                        {articles.slice(0, showAmount).map((article, i) => (
                            <div className="card my-2" key={i} id={i}>
                                <div className="card-body">
                                    <h5 className="card-title"><a href={article.url}>{article.title}</a></h5>
                                    <h6 className="card-subtitle mb-2 text-muted">{article.date}</h6>
                                    <p className="card-text">{article.description}</p>
                                </div>
                            </div>
                        ))}

                        <nav aria-label="Page navigation">
                            <ul className="pagination">
                                <li className="page-item disabled"><a className="page-link" href="#">{"Showing " + showAmount}</a></li>
                                {articles.map((article, i) => (
                                    i === articles.length - 1 ? 
                                    <li key={i} className="page-item"><a className="page-link" onClick={() => setShowAmount(articles.length)}>{articles.length} (All)</a></li> 
                                    : (i > 0 && i % 10 === 0) && 
                                    <li key={i} className="page-item"><a className="page-link" onClick={() => setShowAmount(i)}>{i}</a></li>))
                                }
                            </ul>
                        </nav>
                    </div>
                </div>
                :
                <div>
                    {params.newspaper} is not a valid newspaper
                </div>
            }
        </div>
    )
}

export default Newspaper;
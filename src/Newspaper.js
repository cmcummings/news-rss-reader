import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { newspapers, categories } from "./data";
import axios from "axios";
import './Newspaper.css'

function Newspaper() {
    let params = useParams()
    let [newspaper, setNewspaper] = useState(null)
    let [articles, setArticles] = useState([])
    let [showAmount, setShowAmount] = useState(10) // How many articles to show

    useEffect(() => {
        let np = newspapers.find(e => e.id === params.newspaper)
        if (!np) {
            window.location.replace("/n/")
        }

        document.title = np.name + " - CNRR"
        setNewspaper(np)

        // Determine category
        if (params.category) {
            if (!np.categories[params.category]) {
                window.location.replace("/n/" + np.id)
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
                let description = article.getElementsByTagName("description")[0].textContent
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
                    <nav class="navbar sticky-top navbar-expand-lg navbar-light bg-light border-bottom">
                        <div class="container-fluid">
                            <a class="navbar-brand" href="/">News RSS Reader</a>
                            <div class="collapse navbar-collapse" id="navbarNav">
                                <div>
                                    <ul class="navbar-nav">
                                        <li class="nav-item dropdown">
                                            <a class="nav-link active dropdown-toggle" href="#" id="navbarDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                            {newspaper.name}
                                            </a>
                                            <ul class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                                                {newspapers.map(np => (
                                                    np.id !== newspaper.id &&
                                                    <li><a class="dropdown-item" href={"/n/" + np.id}>{np.name}</a></li>
                                                ))}
                                            </ul>
                                        </li>
                                        <span class="navbar-text"></span>
                                        {Object.keys(newspaper.categories).map(cat => (
                                            <li className="nav-item">
                                                <a key={cat} 
                                                    href={"/n/" + newspaper.id + "/" + cat}
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
                    <div class="container-sm mt-4">
                        <h2>{categories[params.category]} stories from the {newspaper.name}</h2>
                        
                        {articles.slice(0, showAmount).map((article, i) => (
                            <div className="card my-2" key={i} id={i}>
                                <div class="card-body">
                                    <h5 className="card-title"><a href={article.url}>{article.title}</a></h5>
                                    <h6 class="card-subtitle mb-2 text-muted">{article.date}</h6>
                                    <p class="card-text">{article.description}</p>
                                </div>
                            </div>
                        ))}

                        <nav aria-label="Page navigation example">
                            <ul class="pagination">
                                <li class="page-item disabled"><a class="page-link" href="#">{"Showing " + showAmount}</a></li>
                                {articles.map((article, i) => (
                                    i === articles.length - 1 ? 
                                    <li class="page-item"><a class="page-link" onClick={() => setShowAmount(articles.length)}>{articles.length} (All)</a></li> 
                                    : (i > 0 && i % 10 === 0) && 
                                    <li class="page-item"><a class="page-link" onClick={() => setShowAmount(i)}>{i}</a></li>))
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
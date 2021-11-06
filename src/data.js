// Maps category IDs to pretty names
let categories = {
    top: "Top",
    world: "World",
    us: "U.S.",
    tech: "Tech",
    biz: "Business",
    market: "Markets",
    health: "Health"
}

// List of available newspapers and their details
let newspapers = [
    {
        id: 'nytimes',
        name: "New York Times",
        categories: {
            top: "https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml",
            world: "https://rss.nytimes.com/services/xml/rss/nyt/World.xml",
            us: "https://rss.nytimes.com/services/xml/rss/nyt/US.xml",
            tech: "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml"
        }
    },
    {
        id: 'wsj',
        name: "Wall Street Journal",
        categories: {
            biz: "https://feeds.a.dj.com/rss/WSJcomUSBusiness.xml",
            world: "https://feeds.a.dj.com/rss/RSSWorldNews.xml",
            tech: "https://feeds.a.dj.com/rss/RSSWSJD.xml",
            market: "https://feeds.a.dj.com/rss/RSSMarketsMain.xml",
        }
    },
    {
        id: 'guardian',
        name: "The Guardian",
        categories: {
            world: "https://www.theguardian.com/world/rss",
            us: "https://www.theguardian.com/us-news/rss",
            tech: "https://www.theguardian.com/us/technology/rss",
            health: "https://www.theguardian.com/lifeandstyle/health-and-wellbeing/rss",
            biz: "https://www.theguardian.com/us/business/rss"
        }
    }
]

export {newspapers, categories}
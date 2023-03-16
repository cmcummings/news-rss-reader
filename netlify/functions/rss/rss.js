import { categories, newspapers } from "../../../src/data"
import axios from "axios"


const handler = async (event) => {
  try {
    const params = event.queryStringParameters
    let category = params.category
    const id = params.id
 
    if (!(id)) {
      throw "Insufficient parameters."
    }

    const np = newspapers.find(np => np.id === id)

    if (!np.categories.hasOwnProperty(category)) {
      category = Object.keys(np.categories)[0]
    }
    const url = np.categories[category]

    return await axios.request({
      method: 'get',
      url: url,
    }).then(res => {
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          newspaper: {
            id: np.id,
            name: np.name,
            categories: Object.keys(np.categories),
          },
          category: category,
          articleXML: res.data
        }),
      }
    }).catch(() => {
      throw "Failed request to RSS feed"
    });
  } catch (error) {
    return { 
      statusCode: 500, 
      body: JSON.stringify({ 
        message: error 
      })
    }
  }
}

export { handler }

import { useQuery } from "@apollo/client";

import { MY_RECOMMENDATIONS } from "../queries";

const Recommendations = (props) => {

    const result = useQuery(
        MY_RECOMMENDATIONS, 
        {
            pollInterval: props.pollInterval
        }
    )
    
    if (!props.show) {
        return null
    }


    if(result.loading) {
        return <div>Loading...</div>
    }

    if(result.data.myRecommendations.length === 0) {
        return (
            <div>
                <h2>Recommendations</h2>
                <div>
                    Sorry, but there wasn't any book that belong to your favourite genre [{result.data.me.favoriteGenre}]
                </div>
            </div>
        )
    }

    return (
        <div>
            <h2>Recommendations</h2>
            <div>
                books in your favorite genre <span style={{fontWeight: 'bold'}}>{result.data.me.favoriteGenre}</span>
            </div>

            <div style={{marginTop: '20px'}}>

                <table>
                    <tbody>
                    <tr>
                        <th></th>
                        <th>author</th>
                        <th>published</th>
                        <th>genres</th>
                    </tr>
                    {result.data.myRecommendations.map((a) => (
                        <tr key={a.title}>
                        <td>{a.title}</td>
                        <td>{a.author.name}</td>
                        <td>{a.published}</td>
                        <td>{a.genres.join(' ')}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>



        </div>
    );
};

export default Recommendations;
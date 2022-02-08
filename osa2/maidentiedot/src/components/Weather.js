import React from "react";

const Weather = ({weatherData}) => {

    console.log(weatherData)

    return (
        <div>
            <h3>{`Weather in ${weatherData.location.name}`}</h3>
            <p>{`temperature:  ${weatherData.current.temperature}`}</p>
            <p>
                {
                    weatherData.current.weather_icons.map((icon, index) => {
                        return (
                            <img key={index} src={icon} alt={`weather icon`} style={{border: "1px solid gray", maxWidth: '50px'}}/>
                        )
                    })
                }
            </p>
            <p>{`wind: ${weatherData.current.wind_speed} direction ${weatherData.current.wind_dir}`}</p>
        </div>
    )
}

export default Weather
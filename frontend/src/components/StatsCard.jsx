export default function StatsCard({

    title,

    value,

    color

}) {

    return (

        <div
            className="stats-card"
            style={{

                borderLeft:
                    `5px solid ${color}`

            }}
        >

            <h3>

                {title}

            </h3>

            <h2>

                {value}

            </h2>

        </div>

    );

}
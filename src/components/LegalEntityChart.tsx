import {Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

type LegalEntityChartProps = {
    legalEntities: {date:string, type:string}[]
    type: string
}
export const LegalEntityChart = (props: LegalEntityChartProps) => {
    const filteredData = props.legalEntities.filter((item) => {
        return item.type === props.type
    })


    // count each day
    const countsByDay: Record<string, number> = {}
    for (const f of filteredData) {
        countsByDay[f.date] = (countsByDay[f.date] || 0) + 1
    }

    const data = []
    let accumulator = 0
    for (const date of Object.keys(countsByDay).sort((a, b) => {
        return new Date(b).getDate() - new Date(a).getDate()
    })) {
       accumulator += countsByDay[date]
        data.push({
            date,
            count: accumulator
        })
    }

    if (data.length <= 3) {
        return <div/>
    }

    return (<div>
        <h1>{props.type}</h1>
        <LineChart width={730} height={250} data={data}>
            <Line type="monotone" dataKey="count" stroke="#8884d8"/>
            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>
        </LineChart>

    </div>)
}

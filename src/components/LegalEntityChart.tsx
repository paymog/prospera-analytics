import {Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import {legalEntities} from "@/data";

type LegalEntityChartProps = {
    legalEntities: {date:string, type:string}[]
}
export const LegalEntityChart = (props: LegalEntityChartProps) => {
    // const filteredData = props.legalEntities.filter((item) => {
    //     return item.type === props.type
    // })
    const legalEntityTypes: string[] = []
    for (const entity of legalEntities) {
        if (!legalEntityTypes.includes(entity.type)) {
            legalEntityTypes.push(entity.type)
        }
    }


    // count each day
    const countsByDay: Record<string, Record<string, number>> = {}
    for (const f of props.legalEntities) {
        countsByDay[f.date] = countsByDay[f.date] || {}
        countsByDay[f.date][f.type] = (countsByDay[f.date]?.[f.type] || 0) + 1
    }

    const data = []
    let accumulator: Record<string, number> = {}
    for (const date of Object.keys(countsByDay).sort((a, b) => {
        return new Date(b).getDate() - new Date(a).getDate()
    })) {
        const datum: Record<string, string|number> = {date}
        const counts = countsByDay[date]
        for (const type of Object.keys(counts)) {
            accumulator[type] = (accumulator[type] || 0) + counts[type]
            datum[type] = accumulator[type]
        }
        data.push(datum)
    }

    if (data.length <= 3) {
        return <div/>
    }

    return (<div>
        <h1>Legal Entities</h1>
        <LineChart width={730} height={250} data={data}>
            {legalEntityTypes.map((type, i) => {
                return <Line type="monotone" dataKey={type} stroke="#8884d8" key={i}/>
            })}

            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>
        </LineChart>

    </div>)
}

import {legalEntities} from "@/data";
import {stringToColour} from "@/lib/stringToColor";
import {LineChart} from "@/components/LineChart";

type LegalEntityChartProps = {
    legalEntities: {date:string, type:string}[]
}
export const LegalEntityChart = (props: LegalEntityChartProps) => {
    // const filteredData = props.legalEntities.filter((item) => {
    //     return item.type === props.type
    // })
    const keys: Record<string, {color: string, hidden: boolean}> = {}
    for (const entity of legalEntities) {
        if (!keys[entity.type]) {
            keys[entity.type] = {color: stringToColour(entity.type), hidden: false}
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
        <LineChart data={data} initialKeys={keys}/>

    </div>)
}

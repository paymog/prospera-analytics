import {useState} from "react";
import {Legend, Line, LineChart as RechartLineChart, Tooltip, XAxis, YAxis} from "recharts";

export const LineChart = ({
                              data,
                              initialKeys
                          }: { data: Record<string, any>[], initialKeys: Record<string, { color: string, hidden: boolean }> }) => {
    const [keys, setKeys] = useState(initialKeys);

    return <div>
        <RechartLineChart width={730} height={250} data={data}>
            {
                Object.entries(keys).map(([key, entry]) => {
                    return <Line type="monotone" dataKey={key} stroke={entry.color} connectNulls key={key} hide={entry.hidden}/>
                })
            }
            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>

            <Legend onClick={(e) => {
                console.log(e)
                setKeys({
                    ...keys,
                    [e.dataKey]: {
                        ...keys[e.dataKey],
                        hidden: !keys[e.dataKey].hidden
                    }
                })
            }
            }/>
        </RechartLineChart>
    </div>

}


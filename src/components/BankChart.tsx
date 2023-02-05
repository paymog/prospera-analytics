import {Legend, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts"

type BankChartProps = {
    bankData: Record<string, Record<string, (string | number)[][]>>
}

function stringToColour(str: string)  {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let colour = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        colour += ('00' + value.toString(16)).substr(-2);
    }
    return colour;
}

const collapseDailyBalanceChanges = (bankData: Record<string, Record<string, (string | number)[][]>>): Record<string, Record<string, Record<string, number>>> => {
    const collapsedData: Record<string, Record<string, Record<string, number>>> = {}
    for (const bank of Object.keys(bankData)) {
        collapsedData[bank] = collapsedData[bank] || {}
        for (const account of Object.keys(bankData[bank])) {
            collapsedData[bank][account] = collapsedData[bank][account] || {}
            for (const item of bankData[bank][account]) {
                collapsedData[bank][account][item[0]] = item[1] as number
            }
        }
    }

    return collapsedData
}

export const BankChart = (props: BankChartProps) => {
    // turn the data into kv pairs since there may be multiple values for a given date
    const collapsedBalances = collapseDailyBalanceChanges(props.bankData)

    const knownDates: string[] = []
    for (const bank of Object.keys(collapsedBalances)) {
        for (const account of Object.keys(collapsedBalances[bank])) {
            for (const date of Object.keys(collapsedBalances[bank][account])) {
                if (!knownDates.includes(date)) {
                    knownDates.push(date)
                }
            }
        }
    }

    const sortedDates = knownDates.sort((a, b) => {
        return new Date(b).getDate() - new Date(a).getDate()
    })
    const data = []
    const keys: Record<string, string> = {}
    for (const date of sortedDates) {
        const datum: Record<string, string | number> = {date}
        for (const bank of Object.keys(collapsedBalances)) {
            for (const account of Object.keys(collapsedBalances[bank])) {
                const key = `${bank} - ${account}`
                if (!keys[key]) {
                    keys[key] = stringToColour(key)
                }
                datum[key] = collapsedBalances[bank][account][date]
            }
        }
        data.push(datum)
    }


    return (<div>
        <h1>Bank Balances</h1>
        <LineChart width={730} height={250} data={data}>
            {
                Object.entries(keys).map(([key,color] ) => {
                    return <Line type="monotone" dataKey={key} stroke={color} key={key} hide={false}/>
                })
            }
            <XAxis dataKey="date"/>
            <YAxis/>
            <Tooltip/>
            <Legend onClick={() => {
            }
            }/>
        </LineChart>

    </div>)
}

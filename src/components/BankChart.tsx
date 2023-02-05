import {useState} from "react";
import {LineChart } from './LineChart'

type BankChartProps = {
    bankData: Record<string, Record<string, (string | number)[][]>>
}

// taken from https://stackoverflow.com/a/16348977/1489726
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
        return new Date(a).getTime() - new Date(b).getTime()
    })
    const data = []
    const calculatedKeys: Record<string, {color: string, hidden: boolean}> = {}
    for (const date of sortedDates) {
        const datum: Record<string, string | number> = {date}
        for (const bank of Object.keys(collapsedBalances)) {
            for (const account of Object.keys(collapsedBalances[bank])) {
                const key = `${bank} - ${account}`
                if (!calculatedKeys[key]) {
                    calculatedKeys[key] = {color: stringToColour(key), hidden: false}
                }
                datum[key] = collapsedBalances[bank][account][date]
            }
        }
        data.push(datum)
    }


    return (<div>
        <h1>Bank Balances</h1>
        <LineChart data={data} initialKeys={calculatedKeys} />
    </div>)
}

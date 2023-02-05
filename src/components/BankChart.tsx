import {useState} from "react";
import {LineChart } from './LineChart'
import {stringToColour} from "@/lib/stringToColor";

type BankChartProps = {
    bankData: Record<string, Record<string, (string | number)[][]>>
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

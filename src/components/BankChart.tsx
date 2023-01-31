import {Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"

type BankChartProps = {
    bankName: string,
    accountName: string,
    accountData: (string | number)[][]
}
export const BankChart = (props: BankChartProps) => {
    const data = props.accountData.sort((a, b) => {
        return new Date(b[0]).getDate() - new Date(a[0]).getDate()
    }).map((item) => {
        return {
            date: item[0],
            balance: item[1]
        }
    })
    return (<div>
        <h1>{props.bankName} - {props.accountName}</h1>
        <LineChart width={730} height={250} data={data}>
            <Line type="monotone" dataKey="balance" stroke="#8884d8"/>
            <XAxis dataKey="date"/>
            <YAxis />
            <Tooltip/>
        </LineChart>

    </div>)
}

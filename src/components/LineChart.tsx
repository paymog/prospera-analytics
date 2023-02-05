import { useState } from "react";
import {
  Legend,
  Line,
  LineChart as RechartLineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import groupBy from "lodash-es/groupBy";

const renderLegend = (props) => {
  const { payload, onClick } = props;

  const grouped = groupBy(payload, "value");

  console.log(props);
  return (
    <ul onClick={onClick} className="grid grid-cols-4 gap-3">
      {payload.map((entry, index) => (
        <li
          onClick={() => onClick(entry)}
          key={`item-${index}`}
          className=" text-xs font-bold"
          style={{ color: entry.color }}
        >
          {entry.value}
        </li>
      ))}
    </ul>
  );
};

export const LineChart = ({
  data,
  initialKeys,
}: {
  data: Record<string, any>[];
  initialKeys: Record<string, { color: string; hidden: boolean }>;
}) => {
  const [keys, setKeys] = useState(initialKeys);

  return (
    <ResponsiveContainer width="100%" height={500}>
      <RechartLineChart data={data}>
        {Object.entries(keys).map(([key, entry]) => {
          return (
            <Line
              type="monotone"
              dataKey={key}
              stroke={entry.color}
              connectNulls
              key={key}
              hide={entry.hidden}
            />
          );
        })}
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />

        <Legend
          onClick={(e) => {
            const clickedKey = keys[e.dataKey];
            // are some keys hidden?
            const someKeysHidden = Object.values(keys).some(
              (k) => k.hidden === true
            );
            const newKeys = {};
            if (!clickedKey.hidden && someKeysHidden) {
              Object.keys(keys).forEach((k) => {
                newKeys[k] = {
                  ...keys[k],
                  hidden: false,
                };
              });
              return setKeys(newKeys);
            }

            Object.keys(keys).forEach((k) => {
              newKeys[k] = {
                ...keys[k],
                hidden: k === e.dataKey ? false : true,
              };
            });

            setKeys(newKeys);
          }}
        />
      </RechartLineChart>
    </ResponsiveContainer>
  );
};

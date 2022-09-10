import { FC, useMemo } from "react";

interface Props {
  column: any;
  obj?: any;
}

const SelectFilter: FC<Props> = ({ column, obj }) => {
  const { filterValue, setFilter, preFilteredRows, id } = column;

  const options = useMemo(() => {
    const options = new Set();

    preFilteredRows.forEach((row: any) => options.add(row.values[id]));

    return [...(options.values() as any)];
  }, [id, preFilteredRows]);

  return (
    <select
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">Todos</option>
      {options.map((option: any, i: number) => (
        <option key={i} value={option}>
          {obj ? obj[option] : option}
        </option>
      ))}
    </select>
  );
};

export default SelectFilter;

import { DetailedHTMLProps, FC, InputHTMLAttributes } from "react";

interface Props {
  column: any;
  type?: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
}

const InputFilter: FC<Props> = ({ column, type }) => {
  const { filterValue, setFilter, preFilteredRows } = column;
  const count = preFilteredRows.length;

  return (
    <input
      className="form-control"
      value={filterValue || ""}
      onChange={(e) => setFilter(e.target.value)}
      placeholder={`Buscar en ${count} registros...`}
      {...type}
    />
  );
};

export default InputFilter;

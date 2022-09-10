import axios from "axios";
import type { NextPage } from "next";
import Head from "next/head";
import { useEffect, useState } from "react";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import InputFilter from "../src/components/table/filters/InputFilter";
import SelectFilter from "../src/components/table/filters/SelectFilter";

const columns = [
  {
    Header: "Nombre",
    accessor: "nombre",
    Filter: InputFilter,
  },
  {
    Header: "Email",
    accessor: "email",
    Filter: InputFilter,
  },
  {
    Header: "Sexo",
    accessor: "sexo",
    Cell: ({ row }: any) => {
      return <>{row.values.sexo === "F" ? "Femenino" : "Masculino"}</>;
    },
    Filter: (data: any) => (
      <SelectFilter {...data} obj={{ M: "Masculino", F: "Femenino" }} />
    ),
  },
  {
    Header: "Area",
    accessor: "area.nombre",
    Filter: InputFilter,
  },

  {
    Header: "Boletin",
    accessor: "boletin",
    Cell: ({ row }: any) => {
      return <>{row.values.boletin === 1 ? "Si" : "No"}</>;
    },
    Filter: (data: any) => (
      <SelectFilter {...data} obj={{ 1: "Si", 0: "No" }} />
    ),
  },
];

const Home: NextPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await axios.get("http://127.0.0.1:8000/api/employee/get_all");

    if (res) {
      setData(res.data.result);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const wipeWilter = () => {
    setAllFilters([]);
    setPageSize(10);
    gotoPage(0);
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    state,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    setAllFilters,
    filteredRows,
    rows,
  } = useTable(
    {
      columns,
      data,
    },
    useFilters,
    useSortBy,
    usePagination,
    (hooks) =>
      hooks.visibleColumns.push((columns) => [
        ...columns,
        {
          id: "actions",
          Header: "",
          Cell: ({ row }) => {
            return (
              <>
                <button className="btn btn-sm" onClick={() => {}}>
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button className="btn btn-sm" onClick={() => {}}>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </>
            );
          },
          disableFilters: true,
          disableSortBy: true,
        },
      ])
  );

  useEffect(() => {
    if (page.length === 0 && data.length !== 0) {
      gotoPage(0);
    }
  }, [data.length, filteredRows, gotoPage, page.length]);

  const { pageIndex, pageSize } = state;

  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <nav className="navbar navbar-dark bg-dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Nexura - Prueba técnica
          </a>
        </div>
      </nav>
      <div className="container mt-2">
        <div className="d-flex flex-row justify-content-between mb-3">
          <div className="">
            <select
              className="form-control mr-3"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              disabled={isLoading}
            >
              {[5, 10, 15].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Mostrar {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="d-flex align-items-center">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              disabled={isLoading}
              onClick={fetchData}
            >
              <i className="fas fa-sync" />
            </button>
            <button
              className="btn btn-sm btn-danger mx-2"
              disabled={isLoading}
              onClick={wipeWilter}
            >
              <i className="fa-solid fa-delete-left"></i>
            </button>
            <button
              className="btn btn-sm btn-success"
              disabled={isLoading}
              onClick={() => {}}
            >
              <i className="fa-solid fa-user-plus me-2"></i>Crear
            </button>
          </div>
        </div>
        <div style={{ overflow: "auto", maxWidth: "100%" }}>
          <table
            {...getTableProps()}
            className="table table-striped table-hover"
          >
            <thead>
              {headerGroups.map((headerGroup, i) => (
                <tr {...headerGroup.getHeaderGroupProps()} key={i}>
                  {headerGroup.headers.map((column: any, i) => (
                    <th key={i}>
                      <div>
                        <div
                          className="d-flex justify-content-between"
                          {...column.getHeaderProps(
                            column.getSortByToggleProps()
                          )}
                        >
                          <div>{column.render("Header")}</div>
                          <div>
                            <span>
                              {column.canSort &&
                                (column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <i
                                      className="fa-solid fa-chevron-down"
                                      style={{ fontSize: 10 }}
                                    ></i>
                                  ) : (
                                    <i
                                      className="fa-solid fa-chevron-up"
                                      style={{ fontSize: 10 }}
                                    ></i>
                                  )
                                ) : (
                                  <i
                                    className="fa-solid fa-right-left"
                                    style={{ fontSize: 10, marginLeft: 10 }}
                                  ></i>
                                ))}
                            </span>
                          </div>
                        </div>
                        <div>{column.canFilter && column.render("Filter")}</div>
                      </div>
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows.map((row, i) => {
                prepareRow(row);

                return (
                  <tr {...row.getRowProps()} key={i}>
                    {row.cells.map((cell, i) => {
                      return (
                        <td {...cell.getCellProps()} key={i}>
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {data.length === 0 && (
          <div className="d-flex justify-content-center my-4">No hay datos</div>
        )}
        <div className="d-flex  justify-content-around mb-3">
          <div>
            <button
              className="btn"
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage || isLoading}
            >
              <i className="fa fa-backward" />
            </button>
            <button
              className="btn btn-primary mx-1"
              onClick={previousPage}
              disabled={!canPreviousPage || isLoading}
            >
              <i className="fa fa-angle-left" />
            </button>
            <button
              className="btn btn-info mx-1"
              onClick={nextPage}
              disabled={!canNextPage || isLoading}
            >
              <i className="fa fa-angle-right" />
            </button>
            <button
              className="btn"
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canPreviousPage || isLoading}
            >
              <i className="fa fa-forward" />
            </button>
          </div>
          <div className="d-flex flex-row align-items-center">
            <span>
              Página{" "}
              <strong>
                {pageIndex + 1} de {pageOptions.length}
              </strong>
            </span>
            <span> | ir a la página: </span>
            <input
              className="form-control ms-3 w-25"
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const pageNumber = e.target.value
                  ? Number(e.target.value) - 1
                  : 0;
                gotoPage(pageNumber);
              }}
              disabled={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

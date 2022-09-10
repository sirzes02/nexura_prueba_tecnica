import type { NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useFilters, usePagination, useSortBy, useTable } from "react-table";
import { MySwal } from "../src/common/Alert";
import { requestSquematic } from "../src/common/Functions";
import { getValue, saveValue } from "../src/common/Storage";
import Layout from "../src/components/Layout";
import Loading from "../src/components/Loading";
import InputFilter from "../src/components/table/filters/InputFilter";
import SelectFilter from "../src/components/table/filters/SelectFilter";

const columns = [
  {
    Header: "Id",
    accessor: "id",
    Filter: InputFilter,
  },
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
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    setIsLoading(true);
    const res = await requestSquematic("GET", "/api/employee/get_all", {});

    if (res) {
      setData(res.result);
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
      initialState: {
        ...getValue(Home.displayName + "_1_data"),
      },
      useControlledState: (state: any) => {
        saveValue(Home.displayName + "_1_data", state);

        return state;
      },
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
            const handleDelete = async () => {
              const confirm = await MySwal.fire({
                title:
                  "¿Estás seguro de elimar el empleado: " +
                  row.values.nombre +
                  "?",
                text: "Esta acción no prodrá ser revertida",
                icon: "warning",
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Eliminar",
                cancelButtonText: "Cancelar",
                showCancelButton: true,
                denyButtonText: "Cancelar",
              });

              if (confirm.isConfirmed) {
                setIsLoading(true);

                const res = await requestSquematic(
                  "POST",
                  "/api/employee/delete",
                  {
                    id: row.values.id,
                  }
                );

                if (res) {
                  setIsLoading(false);

                  await MySwal.fire({
                    title: "Empleado eliminado con exito",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1500,
                  });
                  await fetchData();
                }

                setIsLoading(false);
              }
            };

            return (
              <>
                <Link href={"/employee/" + row.values.id}>
                  <button className="btn btn-sm">
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                </Link>
                <button className="btn btn-sm" onClick={handleDelete}>
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
    <Layout>
      {isLoading && <Loading />}
      <Head>
        <title>Inicio - Nexura</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
            <Link href="/employee/create">
              <button className="btn btn-sm btn-success" disabled={isLoading}>
                <i className="fa-solid fa-user-plus me-2"></i>Crear
              </button>
            </Link>
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
    </Layout>
  );
};

export default Home;

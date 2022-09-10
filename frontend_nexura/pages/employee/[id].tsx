import Head from "next/head";
import { useRouter } from "next/router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { MySwal } from "../../src/common/Alert";
import { requestSquematic } from "../../src/common/Functions";
import * as regex from "../../src/common/Regex";
import Layout from "../../src/components/Layout";
import Loading from "../../src/components/Loading";

interface IContactInformation {
  name: string;
  email: string;
  sex: "M" | "F";
  area: string;
  description: string;
  newspaper: boolean;
}

interface IContactInformationValidate {
  name: boolean;
  email: boolean;
  description: boolean;
}

const Post = () => {
  const router = useRouter();
  const { id } = router.query;

  const isCreating = useMemo(() => id === "create", [id]);

  const [areas, setAreas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [roles, setRoles] = useState<any[]>([]);
  const [isValid, setIsValid] = useState<IContactInformationValidate>({
    name: false,
    email: false,
    description: false,
  });
  const [data, setDate] = useState<IContactInformation>({
    name: "",
    email: "",
    sex: "F",
    area: "",
    description: "",
    newspaper: false,
  });
  const [selectedRoles, setSelectedRoles] = useState<
    { id: number; active: boolean }[]
  >([]);

  useEffect(() => {
    setIsValid((state) => ({
      ...state,
      name: regex.name.test(data.name),
      email: regex.email.test(data.email),
      description: regex.name.test(data.description),
    }));
  }, [data, setIsValid]);

  const handleChange = useCallback(
    (value: any) => {
      setDate((state) => ({ ...state, ...value }));
    },
    [setDate]
  );

  useEffect(() => {
    requestSquematic("GET", "/api/area/get_all", {}).then((data) => {
      if (data) {
        setAreas(data.result);
        handleChange({ area: data.result[0].id });
        setIsLoading(false);
      }
    });

    requestSquematic("GET", "/api/roles/get_all", {}).then((data) => {
      if (data) {
        setRoles(data.result);
        setIsLoading(false);
      }
    });

    if (!isCreating && id) {
      setIsLoading(true);

      requestSquematic("GET", "/api/employee/get_one", { id: id }).then(
        (data) => {
          if (data) {
            const handleRoles = data.result.roles.map(({ id }: any) => ({
              id,
              active: true,
            }));

            handleChange({
              name: data.result.nombre,
              email: data.result.email,
              sex: data.result.sexo,
              area: data.result.area.id,
              description: data.result.descripcion,
              newspaper: data.result.boletin === 1,
            });
            setSelectedRoles(handleRoles);

            setIsLoading(false);
          }
        }
      );
    }
  }, [handleChange, id, isCreating]);

  const handleCreate = async () => {
    setIsLoading(true);

    const handleRoles = selectedRoles
      .filter(({ active }) => active)
      .map(({ id }) => id);

    const res = await requestSquematic("POST", "/api/employee/create", {
      nombre: data.name,
      email: data.email,
      sexo: data.sex,
      area_id: data.area,
      boletin: data.newspaper ? 1 : 0,
      descripcion: data.description,
      roles: handleRoles,
    });

    if (res) {
      setIsLoading(false);

      await MySwal.fire({
        title: "Empleado creado con exito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      router.back();
    }

    setIsLoading(false);
  };

  const handleUpdate = async () => {
    setIsLoading(true);

    const handleRoles = selectedRoles
      .filter(({ active }) => active)
      .map(({ id }) => id);

    const res = await requestSquematic("PUT", "/api/employee/update", {
      id,
      nombre: data.name,
      email: data.email,
      sexo: data.sex,
      area_id: data.area,
      boletin: data.newspaper ? 1 : 0,
      descripcion: data.description,
      roles: handleRoles,
    });

    if (res) {
      setIsLoading(false);

      await MySwal.fire({
        title: "Empleado actualizado con exito",
        icon: "success",
        showConfirmButton: false,
        timer: 1500,
      });
      router.back();
    }

    setIsLoading(false);
  };

  return (
    <Layout>
      <Head>
        <title>Empleado - Nexura</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {isLoading && <Loading />}
      <div className="container mt-2">
        <div className="mb-3">
          <label className="form-label">Nombre completo *</label>
          <input
            type="text"
            className={
              "form-control " +
              (data.name.length !== 0 &&
                (isValid.name ? "is-valid" : "is-invalid"))
            }
            placeholder="Ingrese su nombre..."
            value={data.name}
            onChange={({ target }) => handleChange({ name: target.value })}
            disabled={isLoading}
          />
          <div className="valid-feedback">¡Luce bien!</div>
          <div className="invalid-feedback">
            ¡Por favor escribe un nombre correcto!
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Correo electrónico *</label>
          <input
            type="email"
            className={
              "form-control " +
              (data.email.length !== 0 &&
                (isValid.email ? "is-valid" : "is-invalid"))
            }
            placeholder="nombre@ejemplo.com"
            value={data.email}
            onChange={({ target }) => handleChange({ email: target.value })}
            disabled={isLoading}
          />
          <div className="valid-feedback">¡Luce bien!</div>
          <div className="invalid-feedback">
            ¡Por favor escribe un correo correcto!
          </div>
        </div>
        <div className="d-flex mb-2">
          <div className="">Sexo *</div>
          <div className="ms-3">
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={data.sex === "M"}
                onChange={() => handleChange({ sex: "M" })}
                disabled={isLoading}
              />
              <label className="form-check-label">Masculino</label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                checked={data.sex === "F"}
                onChange={() => handleChange({ sex: "F" })}
                disabled={isLoading}
              />
              <label className="form-check-label">Femenino</label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Area *</label>
          <select
            className="form-select"
            value={data.area}
            onChange={({ target }) => handleChange({ area: target.value })}
            disabled={isLoading}
          >
            {areas.length !== 0 ? (
              areas.map((item, i) => (
                <option value={item.id} key={i}>
                  {item.nombre}
                </option>
              ))
            ) : (
              <option>Cargando...</option>
            )}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción *</label>
          <textarea
            className={
              "form-control " +
              (data.description.length !== 0 &&
                (isValid.description ? "is-valid" : "is-invalid"))
            }
            rows={3}
            placeholder="Ingrese descripción"
            value={data.description}
            onChange={({ target }) =>
              handleChange({ description: target.value })
            }
            disabled={isLoading}
            maxLength={255}
          ></textarea>
          <div className="valid-feedback">¡Luce bien!</div>
          <div className="invalid-feedback">
            ¡Por favor escribe una descripción correcta!
          </div>
        </div>
        <div className="form-check mb-2">
          <input
            className="form-check-input"
            type="checkbox"
            checked={data.newspaper}
            onChange={() => handleChange({ newspaper: !data.newspaper })}
            disabled={isLoading}
          />
          <label className="form-check-label">
            Deseo recibir boletín informativo
          </label>
        </div>
        <div className="d-flex mb-2">
          <div className="">Roles *</div>
          <div className="ms-3">
            {roles.length !== 0 ? (
              roles.map((item, i) => (
                <div className="form-check" key={i}>
                  <input
                    className="form-check-input"
                    type="checkbox"
                    onChange={() => {
                      const temp = [...selectedRoles];
                      const findIndex = temp.findIndex(
                        (localItem) => localItem.id === item.id
                      );

                      if (findIndex > -1) {
                        temp[findIndex].active = !temp[findIndex].active;
                      } else {
                        temp.push({ id: item.id, active: true });
                      }

                      setSelectedRoles(temp);
                    }}
                    disabled={isLoading}
                    checked={
                      selectedRoles.find((selected) => item.id === selected.id)
                        ?.active ?? false
                    }
                  />
                  <label className="form-check-label">{item.nombre}</label>
                </div>
              ))
            ) : (
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  disabled={isLoading}
                />
                <label className="form-check-label">Cargando...</label>
              </div>
            )}
          </div>
        </div>
        <div className="mt-1 mb-3">
          {isCreating ? (
            <button
              className="btn btn-success"
              disabled={Object.values(isValid).includes(false) || isLoading}
              onClick={handleCreate}
            >
              Guardar
            </button>
          ) : (
            <button
              className="btn btn-primary"
              disabled={Object.values(isValid).includes(false) || isLoading}
              onClick={handleUpdate}
            >
              Actualizar
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Post;

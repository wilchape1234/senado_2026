import { useEffect, useState, type ChangeEvent } from 'react'

// interfaces.ts
export interface Departamento {
  code: number;
  departamento: string;
}

export interface Municipio {
  codigo_departamento: number;
  codigo_municipio: number;
  nombre_municipio: string;
}

export interface DataDepartamentos {
  departamentos: Departamento[];
}

export interface DataMunicipios {
  municipios: Municipio[];
}

function App() {
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [departamentosFil, setDepartamentosFil] = useState<Departamento[]>([]);
  const [municipiosFil, setMunicipiosFil] = useState<Municipio[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        // Asumiendo que los archivos están en la carpeta /public
        const resDeps = await fetch('/departamentos.json');
        const dataDeps: DataDepartamentos = await resDeps.json();

        const resMun = await fetch('/municipios.json');
        const dataMun: DataMunicipios = await resMun.json();

        // Mapeamos departamentos por código para búsqueda rápida


        setDepartamentos(dataDeps.departamentos);
        setMunicipios(dataMun.municipios);
      } catch (error) {
        console.error("Error cargando los archivos JSON", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  function handleChangeDepartamento(event: ChangeEvent<HTMLSelectElement | HTMLInputElement>): void {
    const { name, value } = event.target;

    if (name === 'code') {
      const seleccionado = Number(value); // Convertir a número

      // Filtrar los municipios cuyo codigo_departamento coincida con el code seleccionado
      const filtrados = municipios.filter((m) => m.codigo_departamento === seleccionado);

      setMunicipiosFil(filtrados);
    }
  }
  if (loading) return <p>Cargando datos...</p>;
  return (
    <div className="container mt-5">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Registro de Votantes - Senado 2026 G-70</h4>
        </div>
        <div className="card-body">
          <form className="row g-3">

            {/* Fila 1 */}
            <div className="col-md-4">
              <label className="form-label">Cédula</label>
              <input type="text" className="form-control" name='cedula' placeholder="Ej: 12345678" />
            </div>
            <div className="col-md-4">
              <label className="form-label">Nombres</label>
              <input type="text" className="form-control" name='nombres' />
            </div>
            <div className="col-md-4">
              <label className="form-label">Apellidos</label>
              <input type="text" className="form-control" name='apellidos' />
            </div>

            {/* Fila 2 */}
            <div className="col-md-6">
              <label className="form-label">Teléfono</label>
              <input type="tel" className="form-control" name='telefono' />
            </div>
            <div className="col-md-6">
              <label className="form-label">Correo Electrónico</label>
              <input type="email" className="form-control" name='correo' />
            </div>

            {/* Fila 3 */}
            <div className="col-md-3">
              <label className="form-label">Mesa de votación</label>
              <input type="text" className="form-control" name='mesa' />
            </div>
            <div className="col-md-9">
              <label className="form-label">Lugar de votación</label>
              <input type="text" className="form-control" name='lugar' />
            </div>
            <div className="col-md-12">
              <label className="form-label">Direccion / Barrio / Comuna</label>
              <input type="text" className="form-control" name='direccion' />
            </div>
            <div className="col-md-6">
              <label htmlFor="">Departamento</label>
              <select className="form-select" aria-label="Default select example"
                name='code'
                onChange={handleChangeDepartamento}
              >
                <option selected>Open this select menu</option>
                {departamentos.map((mun) => (
                  <option value={mun.code}>{mun.departamento}</option>

                ))}

              </select>
            </div>
            {/* Selector de Municipios */}
            <div className="col-md-6">
              <label htmlFor="">Municipio</label>
              <select
                className="form-select"
                name='codigo_municipio'
                defaultValue=""
              >
                <option value="" disabled>Seleccione un municipio</option>
                {/* IMPORTANTE: Usamos municipiosFil aquí */}
                {municipiosFil.map((mun) => (
                  <option key={mun.codigo_municipio} value={mun.codigo_municipio}>
                    {mun.nombre_municipio}
                  </option>
                ))}
              </select>
            </div>

            {/* Fila 4 */}
            <div className="col-md-12">
              <label className="form-label">Líder al que representa</label>
              <input type="text" className="form-control" name='lider_representante' />
            </div>

            {/* Fila 5 */}
            <div className="col-md-12">
              <label className="form-label">Observación</label>
              <textarea className="form-control" name='observacion' rows={3}></textarea>
            </div>

            <div className="col-12 mt-4">
              <button type="submit" className="btn btn-primary w-100">
                Guardar Registro
              </button>
            </div>

          </form>
        </div>
        <div className="table">
          <div className="container mt-4">
            <div className="table-responsive">
              <table className="table table-striped table-hover table-bordered">
                <thead>
                  <tr style={{ backgroundColor: '#f2f2f2' }}>
                    <th>Cód. Depto</th>
                    {/* <th>Departamento</th> */}
                    <th>Cód. Municipio</th>
                    <th>Municipio</th>
                  </tr>
                </thead>
                <tbody>
                  {municipios.map((mun) => (
                    <tr key={mun.codigo_municipio}>
                      <td>{mun.codigo_departamento}</td>
                      {/* <td>{departamentos}</td> */}
                      <td>{mun.codigo_municipio}</td>
                      <td>{mun.nombre_municipio}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
import { useState, useEffect } from "react"

import type { Ciudad, Departamento, RegistroVotacion } from "../../Types/interfaces" // Solo necesitamos RegistroVotacion
import { fetchRegistroVotacionPaginated, getAllCiudades, getAllDepartamentos } from "../../API/apiResponse";
// Importamos la función enriquecida


// Definimos un tipo que incluya el nombre de la ciudad



function AllRegistroVotacion() {
    // El estado ahora usa el tipo enriquecido
    const [data, setData] = useState<RegistroVotacion[]>([])
    const [dataCiudades, setDataCiudades] = useState<Ciudad[]>([])
    const [dataDepartamentos, setDataDepartamentos] = useState<Departamento[]>([])
    const [isLoading, setIsLoading] = useState(true);
    // Ya no necesitamos cityMap

    // **Lógica de Carga de Datos**
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const ciudades = await getAllCiudades()
                const departamentos = await getAllDepartamentos()
                // Llamamos a la función única que trae datos paginados y enriquecidos
                const response = await fetchRegistroVotacionPaginated({ skip: 0, limit: 10 });

                // La data ya viene lista con 'nombreCiudad'
                setData(response.data);
                setDataCiudades(ciudades)
                setDataDepartamentos(departamentos)
            } catch (error) {
                console.error("Error al cargar los datos del registro de votación:", error);
                setData([]); // Limpiar data en caso de error
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);



    const getNameCiudad = (idMunicipio: number, data: Ciudad[]) => {

        let mun = data.find(f => f.id == idMunicipio)
        return (mun?.name || "N/A")
    }
    const getNameDep = (idMunicipio: number, data: Ciudad[]) => {

        let mun = data.find(f => f.id == idMunicipio)
        let dep = dataDepartamentos.find(d=>d.id==mun?.departmentId)
        return (dep?.name || "N/A")
    }

    if (isLoading) {
        return <div className="loading-message">Cargando datos...</div>;
    }

    // **Renderizado del Componente**
    return (<>
        <div className="container-table">
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">Cédula</th>
                        <th scope="col">Nombre y Apellido</th>
                        <th scope="col">Mesa</th>
                        <th scope="col">Ciudad</th>
                        <th scope="col">Departamento</th>
                    </tr>
                </thead>
                <tbody>
                    {data.length > 0 ? (
                        data.map((r, index) => {

                            return (
                                <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td>{r.cedula}</td>
                                    <td>{r.nombres + ' ' + r.apellidos}</td>
                                    <td>{r.mesaVotacion}</td>
                                    {/* Usamos el campo enriquecido directamente */}
                                    <td>{getNameCiudad(Number(r.municipioId), dataCiudades)}</td>
                                    <td>{getNameDep(Number(r.municipioId), dataCiudades)}</td>
                                </tr>
                            );
                        })
                    ) : (
                        <tr>
                            <td colSpan={5} className="text-center">No hay registros de votación disponibles.</td>
                        </tr>
                    )}

                    <tr>
                        <th scope="row">end</th>
                        <td colSpan={3}>Total de registros: {data.length}</td>
                        <td colSpan={2}></td>
                    </tr>
                </tbody>
            </table>
        </div>
        
    </>)
}

export { AllRegistroVotacion }
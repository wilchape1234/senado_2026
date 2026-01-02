import { useState, useEffect } from "react"
import { Outlet } from "react-router"
import type { Ciudad, RegistroVotacion } from "../../Types/interfaces" // Solo necesitamos RegistroVotacion
import { fetchRegistroVotacionPaginated, getAllCiudades } from "../../API/apiResponse";
// Importamos la función enriquecida


// Definimos un tipo que incluya el nombre de la ciudad



function AllRegistroVotacion() {
    // El estado ahora usa el tipo enriquecido
    const [data, setData] = useState<RegistroVotacion[]>([])
    const [dataCiudades, setDataCiudades] = useState<Ciudad[]>([])
    const [isLoading, setIsLoading] = useState(true);
    // Ya no necesitamos cityMap

    // **Lógica de Carga de Datos**
    useEffect(() => {
        const loadData = async () => {
            setIsLoading(true);
            try {
                const ciudades = await getAllCiudades()
                // Llamamos a la función única que trae datos paginados y enriquecidos
                const response = await fetchRegistroVotacionPaginated({ skip: 0, limit: 10 });

                // La data ya viene lista con 'nombreCiudad'
                setData(response.data);
                setDataCiudades(ciudades)
            } catch (error) {
                console.error("Error al cargar los datos del registro de votación:", error);
                setData([]); // Limpiar data en caso de error
            } finally {
                setIsLoading(false);
            }
        };

        loadData();
    }, []);

    // Ya no necesitamos la función getCityName()

    const getNameC = (idMunicipio: number, data: Ciudad[]) => {

        let val = data.find(f => f.id == idMunicipio)
        return (val?.name || "N/A")
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
                                    <td>{getNameC(Number(r.municipioId), dataCiudades)}</td>
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
                        <td colSpan={2}>Total de registros: {data.length}</td>
                        <td colSpan={2}></td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Outlet />
    </>)
}

export { AllRegistroVotacion }
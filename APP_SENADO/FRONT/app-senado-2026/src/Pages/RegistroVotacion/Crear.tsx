import { useEffect, useState, type ChangeEvent } from "react";
import { regitroVotacionNulo, type Ciudad, type Departamento, type RegistroVotacion, } from "../../Types/interfaces";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { toPascalCase } from "../../Functions/formatters";
import { createRegistroVotacion } from "../../API/apiResponse";


function CrearRegistroVotacion() {
const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | ''>(''); 
    
    const [registroVotacion, setRegistroVotacion] = useState<RegistroVotacion>(regitroVotacionNulo);

    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [ciudadPorDepartamento, setCiudadPorDepartamento] = useState<Ciudad[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                // Asumiendo que los archivos están en la carpeta /public
                // const resDeps = await fetch('/departamentos.json');
                const responseDep: AxiosResponse<Departamento[]> = await axios.get(`http://192.168.18.18:3000/api/v1/departamentos`);
                const responseCiu: AxiosResponse<Ciudad[]> = await axios.get(`http://192.168.18.18:3000/api/v1/ciudades`);

                setDepartamentos(responseDep.data);
                setCiudades(responseCiu.data);
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

            // Filtrar los municipios cuyo departmentId coincida con el code seleccionado
            const filtrados = ciudades.filter((m) => m.departmentId === seleccionado);

            setCiudadPorDepartamento(filtrados);
        }
    }
    /* RegistroVotacion */

   const handleChangeInputValue = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Si el valor es una cadena vacía (el placeholder), queremos null o ''
        const valueNumOrStr = (value === '' || value === '0') ? null : value;
        
        // Determinar si el valor debe ser un número (y manejar null si es el placeholder)
        const isNumericField = ['cedula', 'municipioId', 'liderCedula', 'mesaVotacion', 'departamentoId'].includes(name);
        const finalValue = isNumericField && valueNumOrStr !== null ? Number(valueNumOrStr) : valueNumOrStr;
        
        // 1. Lógica para filtrar Ciudades/Municipios (Departamento Select)
        if (name === 'departamentoId') {
            const departamentoIdSeleccionado = finalValue as number | null;
            
            // 1a. Actualizar el estado del ID de departamento seleccionado
            setSelectedDepartamentoId(departamentoIdSeleccionado ?? '');
            
            // 1b. Filtrar las ciudades/municipios basados en el departamento seleccionado
            const filtrados = departamentoIdSeleccionado 
                ? ciudades.filter((c) => c.departmentId === departamentoIdSeleccionado)
                : [];

            setCiudadPorDepartamento(filtrados);

            // 1c. RESETEAR municipioId en el estado de registroVotacion
            setRegistroVotacion((r) => ({
                ...r,
                municipioId: null, // Resetear el municipio, ya que la lista ha cambiado.
            }));
            
            // Si es el select de departamento, no hacemos más, ya manejamos el reseteo
            return; 
        }

        // 2. Actualiza el estado de RegistroVotacion (para los demás campos)
        setRegistroVotacion((r) => {
            
            // Manejo de PascalCase para Nombres y Apellidos
            if (name === 'nombres' || name === 'apellidos') {
                return {
                    ...r,
                    [name]: toPascalCase(finalValue as string),
                };
            }
            
            // Para todos los demás campos (cédula, municipioId, etc.)
            return {
                ...r,
                [name]: finalValue,
            };
        });
    }
    const handleCrearRegistroVotacion = async () => {

        try {
            if (registroVotacion.cedula > 100) {

                let newRegistroVotacion = await createRegistroVotacion(registroVotacion)
                alert(`Se ha creado satisfactoriamente el registro de: ${newRegistroVotacion.cedula} ${newRegistroVotacion.nombres} ${newRegistroVotacion.apellidos} `)
            }
            else {
                alert(`No se pudo registar al votante con CC: ${registroVotacion.cedula}`)

            }
        } catch (error) {
            console.error(error)

        }
    }
    /* RegistroVotacion */






if (loading) return <p>Cargando datos...</p>;
    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white">
                    <h4 className="mb-0">Registro de Votantes - Senado 2026 G-70</h4>
                </div>
                <div className="card-body">
                    <form className="row g-3">

                        {/* ... (Fila 1 a Fila 3 - Se mantienen igual) ... */}
                        <div className="col-md-4">
                            <label className="form-label">Cédula</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='cedula' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Nombres</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='nombres' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Apellidos</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='apellidos' />
                        </div>

                        {/* Fila 2 */}
                        <div className="col-md-6">
                            <label className="form-label">N° Celular</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="tel" className="form-control" name='numeroCelular' />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="email" className="form-control" name='correoElectronico' />
                        </div>

                        {/* Fila 3 */}
                        <div className="col-md-3">
                            <label className="form-label">Mesa de votación</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='mesaVotacion' />
                        </div>
                        <div className="col-md-9">
                            <label className="form-label">Lugar de votación</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='lugarVotacion' />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Direccion </label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='direccion' />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Comuna Barrio </label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='comunaBarrio' />
                        </div>
                        
                        {/* Fila 4: SELECTS CORREGIDOS */}
                        <div className="col-md-6">
                            <label htmlFor="departamentoSelect">Departamento</label>
                            <select 
                                id="departamentoSelect"
                                className="form-select" 
                                name='departamentoId'
                                onChange={handleChangeInputValue}
                                // Usamos el nuevo estado para controlar el valor seleccionado
                                value={selectedDepartamentoId} 
                            >
                                {/* ELIMINADO: selected. Usamos value="" y disabled */}
                                <option value="" disabled>Elija el departamento</option>
                                {departamentos.map((dep) => (
                                    <option key={dep.id} value={dep.id}>
                                        {dep.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Selector de Municipios */}
                        <div className="col-md-6">
                            <label htmlFor="municipioSelect">Municipio</label>
                            <select
                                id="municipioSelect"
                                className="form-select"
                                name='municipioId'
                                onChange={handleChangeInputValue}
                                // El valor es controlado por el estado de RegistroVotacion (o '' si es null)
                                value={registroVotacion.municipioId || ''} 
                                disabled={ciudadPorDepartamento.length === 0}
                            >
                                {/* Usamos value="" y disabled */}
                                <option value="" disabled>Seleccione un municipio</option>
                                {ciudadPorDepartamento.map((mun) => (
                                    <option key={mun.id} value={mun.id}>
                                        {mun.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Fila 5 */}
                        <div className="col-md-4">
                            <label className="form-label">Cedula Líder al que representa</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='liderCedula' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Nombre Lider</label>
                            <input
                                // onChange={handleChangeInputValue}
                                type="text" className="form-control" name='lider-nombres' />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">Apellido Lider</label>
                            <input
                                // onChange={handleChangeInputValue}
                                type="text" className="form-control" name='lider-apellidos' />
                        </div>

                        {/* Fila 6 */}
                        <div className="col-md-12">
                            <label className="form-label">Observación</label>
                            <textarea
                                onChange={handleChangeInputValue}
                                className="form-control" name='observacion' rows={3}></textarea>
                        </div>

                        <div className="col-12 mt-4">
                            <button type="button" className="btn btn-primary w-100"
                                onClick={handleCrearRegistroVotacion}
                            >
                                Guardar Registro
                            </button>
                            <pre className="mt-4 bg-dark text-light rounded">
                                {JSON.stringify(registroVotacion, null, 2)}
                            </pre>
                        </div>

                    </form>
                </div>
                {/* ... (Tabla de debug oculta) ... */}
            </div>
        </div>
    )
}

export { CrearRegistroVotacion }
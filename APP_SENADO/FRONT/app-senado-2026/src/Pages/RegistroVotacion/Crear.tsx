import { useEffect, useState, type ChangeEvent, } from "react";
import { regitroVotacionNulo, type Ciudad, type Departamento, type RegistroVotacion, } from "../../Types/interfaces";
import type { AxiosResponse } from "axios";
import axios from "axios";
import { toPascalCase } from "../../Functions/formatters";
import { createRegistroVotacion } from "../../API/apiResponse";
import { initialValidationErrors, validarRegistro, type ValidationErrors, } from "../../Functions/global";

/* Imgenes */
import gisselaImage from "../../assets/Img/gissela_70_1.jpeg";

/* Imgenes */

function CrearRegistroVotacion() {
    const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | ''>('');

    // ❌ ELIMINAR ESTE ESTADO: Ya no es necesario, lo reemplaza 'validationErrors'
    // const [Validation, setValidation] = useState<ValitationMsg>({
    //     msg: "string",
    //     error: false,
    // })

    const [validationErrors, setValidationErrors] = useState<ValidationErrors>(initialValidationErrors);


    const [registroVotacion, setRegistroVotacion] = useState<RegistroVotacion>(regitroVotacionNulo);

    const [ciudades, setCiudades] = useState<Ciudad[]>([]);
    const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
    const [ciudadPorDepartamento, setCiudadPorDepartamento] = useState<Ciudad[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        if (!(departamentos.length > 0) && !(ciudadPorDepartamento.length > 0)) {

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
        }
    }, []);

    /* RegistroVotacion */


    /* Crear.tsx */
    /* Crear.tsx */
    // ----------------------------------------------------------------------
    // CORRECCIÓN: Agregar 'async' a la función handleChangeInputValue
    const handleChangeInputValue = async (e: ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Si el valor es una cadena vacía (el placeholder), queremos null o ''
        const valueNumOrStr = (value === '' || value === '0') ? null : value;
        // ASERTAMOS que 'name' es una clave de ValidationErrors. 
        // Si la clave no es válida, la validación fallará, pero el tipado es correcto para los campos que sí existen.
        const fieldName = name as keyof ValidationErrors;
        const isNumericField = ['cedula', 'municipioId', 'liderCedula', 'mesaVotacion', 'departamentoId'].includes(name);
        const finalValue = isNumericField && valueNumOrStr !== null ? Number(valueNumOrStr) : valueNumOrStr;


        // 1. Validar y actualizar el estado de errores INMEDIATAMENTE
        // ⭐ El 'await' en la línea 70 ahora es válido
        const error = await validarRegistro(fieldName, finalValue);
        setValidationErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));
        // 2. Lógica para filtrar Ciudades/Municipios (Departamento Select)
        if (name === 'departamentoId') {
            const departamentoIdSeleccionado = finalValue as number | null;
            // ... (lógica existente)

            // IMPORTANTE: Forzar la revalidación del municipioId al resetearlo
            // ⭐ El 'await' en la línea 82 ahora es válido
            const municipioError = await validarRegistro('municipioId', null);
            setValidationErrors(prevErrors => ({
                ...prevErrors,
                municipioId: municipioError,
            }));

            // Lógica para filtrar ciudades, basada en tu código anterior
            if (departamentoIdSeleccionado) {
                setSelectedDepartamentoId(departamentoIdSeleccionado);
                setCiudadPorDepartamento(ciudades.filter(c => c.departmentId === departamentoIdSeleccionado));
            } else {
                setSelectedDepartamentoId('');
                setCiudadPorDepartamento([]);
            }

            // Además, asegúrate de resetear municipioId en el estado de registroVotacion
            setRegistroVotacion(r => ({ ...r, municipioId: null }));
            return;
        }
        // 3. Actualiza el estado de RegistroVotacion (para los demás campos)
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
    // ----------------------------------------------------------------------

    const handleCrearRegistroVotacion = async () => {

        let hasErrors = false;
        const finalErrors: ValidationErrors = { ...initialValidationErrors };

        // ⭐ CAMBIO CLAVE: Usar un bucle for...of para usar await ⭐
        const fieldsToValidate = (Object.keys(initialValidationErrors) as Array<keyof ValidationErrors>);

        for (const fieldName of fieldsToValidate) {
            const fieldValue = (registroVotacion as any)[fieldName];

            // ⭐ Usar await para esperar el resultado de la validación
            const error = await validarRegistro(fieldName, fieldValue);

            finalErrors[fieldName] = error;
            if (error) {
                hasErrors = true;
            }
        }

        // Actualizar el estado de errores con el resultado final
        setValidationErrors(finalErrors);

        if (hasErrors) {
            alert('Por favor, corrige los errores en el formulario antes de continuar.');
            return;
        }

        // Si no hay errores, proceder con la creación
        try {


            let newRegistroVotacion = await createRegistroVotacion(registroVotacion);
            alert(`Se ha creado satisfactoriamente el registro de: ${newRegistroVotacion.cedula} ${newRegistroVotacion.nombres} ${newRegistroVotacion.apellidos} `);
        } catch (error) {
            console.error(error);
            alert('Ocurrió un error al intentar guardar el registro.');
        }
    }
    /* RegistroVotacion */






    if (loading) return <p>Cargando datos...</p>;
    return (
        <div className="container mt-5">
            <div className="card shadow">
                <div className="header p-4 text-white d-flex align-items-center justify-content-between flex-wrap" style={{backgroundColor:'#1e3a8a'}}>

                    {/* Contenedor del Título: Permite que el texto se ajuste */}
                    <div className="me-3">
                        <h1 className="fs-4 fw-bold mb-0" style={{ whiteSpace: 'normal' }}>
                            Con Gisella unidos habrán oportunidades al senado
                        </h1>
                    </div>

                    {/* Contenedor de la Imagen: Ajustado y con margen izquierdo */}
                    <div className="" style={{ height:'180px',maxHeight: '200px', flexShrink: 0 }}>
                        <img
                            src={gisselaImage}
                            alt="Gisella"
                            className="img-fluid rounded-2"
                            style={{ maxHeight: '100%', /* maxWidth: '80px' */ }}
                        />
                    </div>

                </div>
                <div className="card-body">
                    <form className="row g-3">

                        {/* Cédula */}
                        <div className="col-md-4">
                            <label className="form-label">Cédula</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='cedula' />
                            {/* 💥 CAMBIO CLAVE 3: Mostrar el error */}
                            {validationErrors.cedula && (
                                <div className="text-danger small mt-1">{validationErrors.cedula}</div>
                            )}
                        </div>

                        {/* Nombres */}
                        <div className="col-md-4">
                            <label className="form-label">Nombres</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='nombres' />
                            {/* 💥 CAMBIO CLAVE 3: Mostrar el error */}
                            {validationErrors.nombres && (
                                <div className="text-danger small mt-1">{validationErrors.nombres}</div>
                            )}
                        </div>

                        {/* Apellidos */}
                        <div className="col-md-4">
                            <label className="form-label">Apellidos</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='apellidos' />
                            {/* 💥 CAMBIO CLAVE 3: Mostrar el error */}
                            {validationErrors.apellidos && (
                                <div className="text-danger small mt-1">{validationErrors.apellidos}</div>
                            )}
                        </div>

                        {/* ... (Continuar aplicando el patrón para cada campo) ... */}

                        {/* N° Celular */}
                        <div className="col-md-6">
                            <label className="form-label">N° Celular</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="tel" className="form-control" name='numeroCelular' />
                            {validationErrors.numeroCelular && (
                                <div className="text-danger small mt-1">{validationErrors.numeroCelular}</div>
                            )}
                        </div>

                        {/* Correo Electrónico */}
                        <div className="col-md-6">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="email" className="form-control" name='correoElectronico' />
                            {validationErrors.correoElectronico && (
                                <div className="text-danger small mt-1">{validationErrors.correoElectronico}</div>
                            )}
                        </div>

                        {/* Mesa de votación */}
                        <div className="col-md-3">
                            <label className="form-label">Mesa de votación</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='mesaVotacion' />
                            {validationErrors.mesaVotacion && (
                                <div className="text-danger small mt-1">{validationErrors.mesaVotacion}</div>
                            )}
                        </div>

                        {/* Lugar de votación */}
                        <div className="col-md-9">
                            <label className="form-label">Lugar de votación</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='lugarVotacion' />
                            {validationErrors.lugarVotacion && (
                                <div className="text-danger small mt-1">{validationErrors.lugarVotacion}</div>
                            )}
                        </div>

                        {/* Dirección */}
                        <div className="col-md-6">
                            <label className="form-label">Direccion </label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='direccion' />
                            {validationErrors.direccion && (
                                <div className="text-danger small mt-1">{validationErrors.direccion}</div>
                            )}
                        </div>

                        {/* Comuna Barrio */}
                        <div className="col-md-6">
                            <label className="form-label">Comuna Barrio </label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='comunaBarrio' />
                            {validationErrors.comunaBarrio && (
                                <div className="text-danger small mt-1">{validationErrors.comunaBarrio}</div>
                            )}
                        </div>

                        {/* Departamento (Select) */}
                        <div className="col-md-6">
                            <label htmlFor="departamentoSelect">Departamento</label>
                            <select
                                id="departamentoSelect"
                                className="form-select"
                                name='departamentoId'
                                onChange={handleChangeInputValue}
                                value={selectedDepartamentoId}
                            >
                                <option value="" disabled>Elija el departamento</option>
                                {departamentos.map((dep) => (
                                    <option key={dep.id} value={dep.id}>
                                        {dep.name}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.departamentoId && (
                                <div className="text-danger small mt-1">{validationErrors.departamentoId}</div>
                            )}
                        </div>

                        {/* Municipio (Select) */}
                        <div className="col-md-6">
                            <label htmlFor="municipioSelect">Municipio</label>
                            <select
                                id="municipioSelect"
                                className="form-select"
                                name='municipioId'
                                onChange={handleChangeInputValue}
                                value={registroVotacion.municipioId || ''}
                                disabled={ciudadPorDepartamento.length === 0}
                            >
                                <option value="" disabled>Seleccione un municipio</option>
                                {ciudadPorDepartamento.map((mun) => (
                                    <option key={mun.id} value={mun.id}>
                                        {mun.name}
                                    </option>
                                ))}
                            </select>
                            {validationErrors.municipioId && (
                                <div className="text-danger small mt-1">{validationErrors.municipioId}</div>
                            )}
                        </div>

                        {/* Cédula Líder */}
                        <div className="col-md-4">
                            <label className="form-label">Cedula Líder al que representa</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='liderCedula' />
                            {validationErrors.liderCedula && (
                                <div className="text-danger small mt-1">{validationErrors.liderCedula}</div>
                            )}
                        </div>

                        {/* Fila de Observación */}
                        <div className="col-md-12">
                            <label className="form-label">Observación</label>
                            <textarea
                                onChange={handleChangeInputValue}
                                className="form-control" name='observacion' rows={3}></textarea>
                            {/* {validationErrors.observacion && (
                                <div className="text-danger small mt-1">{validationErrors.observacion}</div>
                            )} */}
                        </div>


                        <div className="col-12 mt-4">
                            <button type="button" className="btn btn-primary w-100"
                                onClick={handleCrearRegistroVotacion}
                            >
                                Guardar Registro
                            </button>
                            <pre className="bg-black text-white d-none">
                                {JSON.stringify(registroVotacion, null, 2)}
                            </pre>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export { CrearRegistroVotacion }
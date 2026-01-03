import { useEffect, useState, type ChangeEvent, } from "react";
import { regitroVotacionNulo, type Ciudad, type Departamento, type RegistroVotacion, } from "../../../Types/interfaces";
import type { AxiosResponse } from "axios";
import axios from "axios";

import { useCallback } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

import { useDropzone } from 'react-dropzone'; // Importación necesaria

/* Imgenes */
import gisselaImage from "../../../assets/Img/gissela_70_1.jpeg";
import { initialValidationErrors, validarRegistro, type ValidationErrors } from "../../../Functions/global";
import { toPascalCase } from "../../../Functions/formatters";
import { bulkInsertRegistroVotacion, createRegistroVotacion, type BulkResponse } from "../../../API/apiResponse";

export const imagenGisela_1 = gisselaImage;

/* Imgenes */

function CrearRegistroVotacion() {
    const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | ''>('');

    // ❌ ELIMINAR ESTE ESTADO: Ya no es necesario, lo reemplaza 'validationErrors'
    // const [Validation, setValidation] = useState<ValitationMsg>({
    //     msg: "string",
    //     error: false,
    // })
    const hostname = window.location.hostname
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
                    const responseDep: AxiosResponse<Departamento[]> = await axios.get(`http://${hostname}:3000/api/v1/departamentos`);
                    const responseCiu: AxiosResponse<Ciudad[]> = await axios.get(`http://${hostname}:3000/api/v1/ciudades`);

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
            let hoyF = new Date();
            setRegistroVotacion((r) => ({ ...r, fechaRegistro: hoyF }))

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
                <div className="header p-4 text-white d-flex align-items-center justify-content-between flex-wrap" style={{ backgroundColor: '#1e3a8a' }}>

                    {/* Contenedor del Título: Permite que el texto se ajuste */}
                    <div className="me-3">
                        <h1 className="fs-4 fw-bold mb-0" style={{ whiteSpace: 'normal' }}>
                            Con Gisella unidos habrán oportunidades al senado
                        </h1>
                    </div>
                    {/*  */}
                    {/* Contenedor de la Imagen: Ajustado y con margen izquierdo */}
                    <div className="" style={{ height: '180px', maxHeight: '200px', flexShrink: 0 }}>
                        <img
                            src={gisselaImage}
                            alt="Gisella"
                            className="img-fluid rounded-2"
                            style={{ maxHeight: '100%', /* maxWidth: '80px' */ }}
                        />
                    </div>

                </div>
                <div className="card-body" style={{ backgroundColor: 'rgba(255, 102, 0, 0.15)' }}>
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
                        <div className="col-md-6">
                            <label className="form-label">Cedula Líder al que representa</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='liderCedula' />
                            {validationErrors.liderCedula && (
                                <div className="text-danger small mt-1">{validationErrors.liderCedula}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="liderCedula">Líder al que representa</label>
                            <input
                                // onChange={handleChangeInputValue}
                                type="text" className="form-control" name='liderCedula' id="liderCedula" />
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
                            <pre className={"bg-black text-white " + 'd-block'}>
                                {JSON.stringify(registroVotacion, null, 2)}
                            </pre>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
function CrearRegistroVotacionAdmin() {
    const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | ''>('');

    // ❌ ELIMINAR ESTE ESTADO: Ya no es necesario, lo reemplaza 'validationErrors'
    // const [Validation, setValidation] = useState<ValitationMsg>({
    //     msg: "string",
    //     error: false,
    // })
    const hostname = window.location.hostname
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
                    const responseDep: AxiosResponse<Departamento[]> = await axios.get(`http://${hostname}:3000/api/v1/departamentos`);
                    const responseCiu: AxiosResponse<Ciudad[]> = await axios.get(`http://${hostname}:3000/api/v1/ciudades`);

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
            let hoyF = new Date();
            setRegistroVotacion((r) => ({ ...r, fechaRegistro: hoyF }))

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
                <div className="header p-4 text-white d-flex align-items-center justify-content-between flex-wrap" style={{ backgroundColor: '#1e3a8a' }}>

                    {/* Contenedor del Título: Permite que el texto se ajuste */}
                    <div className="me-3">
                        <h1 className="fs-4 fw-bold mb-0" style={{ whiteSpace: 'normal' }}>
                            Con Gisella unidos habrán oportunidades al senado
                        </h1>
                    </div>
                    {/*  */}
                    {/* Contenedor de la Imagen: Ajustado y con margen izquierdo */}
                    <div className="" style={{ height: '180px', maxHeight: '200px', flexShrink: 0 }}>
                        <img
                            src={gisselaImage}
                            alt="Gisella"
                            className="img-fluid rounded-2"
                            style={{ maxHeight: '100%', /* maxWidth: '80px' */ }}
                        />
                    </div>

                </div>
                <div className="card-body" style={{ backgroundColor: 'rgba(255, 102, 0, 0.15)' }}>
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
                        <div className="col-md-6">
                            <label className="form-label">Cedula Líder al que representa</label>
                            <input
                                onChange={handleChangeInputValue}
                                type="text" className="form-control" name='liderCedula' />
                            {validationErrors.liderCedula && (
                                <div className="text-danger small mt-1">{validationErrors.liderCedula}</div>
                            )}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label" htmlFor="liderCedula">Líder al que representa</label>
                            <input
                                // onChange={handleChangeInputValue}
                                type="text" className="form-control" name='liderCedula' id="liderCedula" />
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
                            <pre className={"bg-black text-white " + 'd-none'}>
                                {JSON.stringify(registroVotacion, null, 2)}
                            </pre>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}
function CrearRegistroVotacionMasivo() {
    // 1. Estados para el manejo de la UI
    const [status, setStatus] = useState<'idle' | 'loaded' | 'processing' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState<string>('');
    const [results, setResults] = useState<BulkResponse | null>(null);
    const [previewData, setPreviewData] = useState<any[]>([]);
    const [dataToRegister, setDataToRegister] = useState<Partial<RegistroVotacion>[]>([]);

    // 2. Función para procesar y enviar los datos
    const sendDataToApi = async (dataToSend: Partial<RegistroVotacion>[]) => {
        if (dataToSend.length === 0) {
            setMessage('No hay registros cargados para enviar.');
            setStatus('error');
            return;
        }
        setStatus('processing');
        setMessage('Enviando datos al servidor. Por favor, espere...');

        try {
            const response = await bulkInsertRegistroVotacion(dataToSend);

            setResults(response);
            setMessage('Migración masiva completada exitosamente.');
            setStatus('success');
            setDataToRegister([]);

        } catch (error) {
            console.error('Error en la migración:', error);
            const errorMessage = error instanceof Error ? error.message : 'Error desconocido de red o del servidor.';
            setMessage(errorMessage);
            setStatus('error');
            setResults(null);
        }
    };

    // 3. Lógica central de lectura y parseo, envuelta en useCallback
    const processFile = (file: File) => {
        setStatus('idle');
        setMessage(`Leyendo archivo: ${file.name}`);
        setResults(null);
        setDataToRegister([]);

        // Función de callback para guardar los datos leídos
        const processJsonRecords = (jsonRecords: Partial<RegistroVotacion>[]) => {
            if (jsonRecords.length > 0) {
                setDataToRegister(jsonRecords);
                setPreviewData(jsonRecords.slice(0, 5));
                setMessage(`Archivo ${file.name} cargado. ${jsonRecords.length} registros listos para registrar.`);
                setStatus('loaded');
            } else {
                setMessage('El archivo está vacío o no contiene datos válidos.');
                setStatus('error');
            }
        }

        const isCSV = file.name.toLowerCase().endsWith('.csv');

        // Lógica para CSV (Papa Parse)
        if (isCSV) {
            Papa.parse(file, {
                header: true,
                dynamicTyping: false,
                skipEmptyLines: true,
                complete: (results) => {
                    const rawRecords = results.data;
                    const jsonRecords = rawRecords
                        .filter(r => r && Object.keys(r).length > 0) as Partial<RegistroVotacion>[];
                    processJsonRecords(jsonRecords);
                },
            });

            // Lógica para XLSX (SheetJS)
        } else {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const arrayBuffer = e.target?.result;
                    const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet);

                    const jsonRecords = json
                        .filter(r => r && Object.keys(r).length > 0) as Partial<RegistroVotacion>[];
                    processJsonRecords(jsonRecords);
                } catch (error) {
                    setMessage('Error al procesar el archivo Excel. Asegúrate que no esté dañado.');
                    setStatus('error');
                }
            };
            reader.readAsArrayBuffer(file);
        }
    };

    // 3.1. Hook de Dropzone: Ejecuta 'processFile' cuando se suelta un archivo
    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles.length > 0) {
            processFile(acceptedFiles[0]); // Procesamos solo el primer archivo
        }
    }, [processFile]); // Agregamos 'processFile' como dependencia si fuese definida afuera

    const { getRootProps, getInputProps, isDragActive, acceptedFiles, fileRejections } = useDropzone({
        onDrop,
        multiple: false, // Solo aceptar un archivo
        accept: {
            'text/csv': ['.csv'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        },
        disabled: status === 'processing'
    });


    // 4. Función para manejar el click del botón de registro
    const handleBulkRegister = () => {
        if (dataToRegister.length > 0) {
            sendDataToApi(dataToRegister);
        } else {
            setMessage('Cargue un archivo primero.');
            setStatus('error');
        }
    };

    // 5. Renderizado del Componente
    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
            <h2>Migración Masiva de Registros</h2>

            {/* ESTILOS Y ESTRUCTURA DEL DROPZONE */}
            <div
                {...getRootProps()}
                style={dropzoneStyles(isDragActive, status === 'loaded')}
            >
                <input {...getInputProps()} />
                {isDragActive ? (
                    <p style={{ color: '#007bff', fontWeight: 'bold' }}>¡Suelta el archivo aquí!</p>
                ) : acceptedFiles.length > 0 ? (
                    <p>✅ Archivo cargado: <strong>{acceptedFiles[0].name}</strong> ({dataToRegister.length} registros)</p>
                ) : (
                    <p>Arrastra y suelta tu archivo **.csv** o **.xlsx** aquí, o haz click para seleccionar.</p>
                )}
            </div>
            {/* Mostrar rechazos */}
            {fileRejections.length > 0 && (
                <p style={{ color: 'red', marginTop: '10px' }}>
                    Archivo rechazado. Solo se permiten .csv, .xlsx o .xls.
                </p>
            )}

            {/* BOTÓN DE REGISTRO */}
            <button
                onClick={handleBulkRegister}
                disabled={status !== 'loaded' || dataToRegister.length === 0}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: status === 'loaded' ? '#28a745' : '#6c757d', // Verde cuando está cargado
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: status === 'loaded' ? 'pointer' : 'not-allowed'
                }}
            >
                {status === 'processing' ? 'Registrando...' : `Registrar Masivamente (${dataToRegister.length} registros)`}
            </button>


            {/* Mensajes de Estado y Resultados */}
            <div style={{ marginTop: '20px' }}>
                <p><strong>Estado:</strong> {message}</p>
                {status === 'processing' && (
                    <p style={{ color: 'blue' }}>Procesando... No cierres la ventana.</p>
                )}
                {status === 'error' && (
                    <p style={{ color: 'red' }}>¡Fallo! Revisa el formato del archivo y el mensaje de error del servidor.</p>
                )}
                {status === 'success' && results && (
                    <div style={{ color: 'green', border: '1px solid green', padding: '10px' }}>
                        <h3>✅ Migración Exitosa</h3>
                        <p>Total de registros insertados: <strong>{results.insertedCount}</strong></p>
                        <p>Total de errores (saltados o revertidos): <strong>{results.errorsCount}</strong></p>
                    </div>
                )}
            </div>

            {/* Previsualización de la Data */}
            {previewData.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h4>Previsualización (Primeras {previewData.length} filas):</h4>
                    <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', overflowX: 'auto' }}>
                        {JSON.stringify(previewData, null, 2)}
                    </pre>
                </div>
            )}
        </div>
    );
};

// Estilos para el dropzone
const dropzoneStyles = (isDragActive: boolean, isLoaded: boolean) => ({
    border: `2px dashed ${isDragActive ? '#007bff' : isLoaded ? '#28a745' : '#ccc'}`,
    borderRadius: '8px',
    padding: '30px',
    textAlign: 'center' as const,
    cursor: 'pointer',
    backgroundColor: isDragActive ? '#e9f5ff' : isLoaded ? '#f0fff4' : '#fafafa',
    transition: 'border 0.24s ease-in-out, background-color 0.24s ease-in-out',
    outline: 'none',
});

export { CrearRegistroVotacion, CrearRegistroVotacionAdmin, CrearRegistroVotacionMasivo }
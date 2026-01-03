import { useCallback, useState } from "react";
import { bulkInsertRegistroVotacion, type BulkResponse } from "../../../API/apiResponse";
import type { RegistroVotacion } from "../../../Types/interfaces";

import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { useDropzone } from "react-dropzone";

export function CrearRegistroVotacionMasivo() {
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
                setPreviewData(jsonRecords.slice(0, 20));
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
                    <div className="table table-bordered">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Cedula</th>
                                    <th>Nombre</th>
                                    <th>Lugar de Votacion</th>
                                </tr>
                            </thead>
                            <tbody>
                                {previewData.map((d: RegistroVotacion, i) => (

                                    <tr>
                                        <th>{i + 1}</th>
                                        <th>{d.cedula}</th>
                                        <th>{d.nombres}</th>
                                        <th>{d.lugarVotacion}</th>
                                    </tr>

                                ))}
                            </tbody>
                        </table>
                    </div>
                    {/* <pre style={{ backgroundColor: '#f4f4f4', padding: '10px', overflowX: 'auto' }}>
                        {JSON.stringify(previewData, null, 2)}
                    </pre> */}
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

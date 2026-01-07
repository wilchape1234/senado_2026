import { useState, useEffect, useMemo, type ChangeEvent } from "react";
import {
    useReactTable,
    getCoreRowModel,
    flexRender,
    createColumnHelper,
    type PaginationState,
} from "@tanstack/react-table";
import { Modal, Button, Form, Row, Col, InputGroup, Table, Pagination, Toast, ToastContainer } from "react-bootstrap";

// --- IMPORTACIONES DE TIPOS Y API ---
import type { Ciudad, Departamento, RegistroVotacion } from "../../Types/interfaces";
import {
    fetchRegistroVotacionPaginated,
    getAllCiudades,
    getAllDepartamentos,
    createRegistroVotacion,
    updateRegistroVotacion, // <--- NUEVO
    deleteRegistroVotacion  // <--- NUEVO
} from "../../API/apiResponse";

// --- IMPORTACIONES DE UTILIDADES (Asegúrate que la ruta sea correcta) ---
// Estas vienen de tu componente CrearAdmin, ajusta la ruta si es necesario
import { initialValidationErrors, validarRegistro, type ValidationErrors } from "../../Functions/global";
import { toPascalCase } from "../../Functions/formatters";
import { IconPencil, IconTrash } from "@tabler/icons-react";
import { useAuth } from "../../context/AuthProvider";
import { isDebugPayloadJSONRV } from "../../Functions/Variables";

// Objeto vacío para inicializar formulario
const initialRegistro: RegistroVotacion = {
    cedula: 0,
    nombres: '',
    apellidos: '',
    correoElectronico: '',
    numeroCelular: '',
    mesaVotacion: 0,
    lugarVotacion: '',
    departamentoId: 0,
    municipioId: 0,
    direccion: '',
    comunaBarrio: '',
    liderCedula: 0,
    fechaRegistro: new Date(),
    observacion: '',
    revisadoVerificado: false,
    testigo: false,
    jurado: false,
    lider: false,
};

export function AllRegistroVotacion() {

    const { user, } = useAuth(); //
    // --- ESTADOS DE DATOS ---
    const [data, setData] = useState<RegistroVotacion[]>([]);
    const [dataCiudades, setDataCiudades] = useState<Ciudad[]>([]);
    const [dataDepartamentos, setDataDepartamentos] = useState<Departamento[]>([]);

    // --- ESTADOS PARA FORMULARIO COMPLEJO ---
    const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<number | ''>('');
    const [ciudadPorDepartamento, setCiudadPorDepartamento] = useState<Ciudad[]>([]);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>(initialValidationErrors);

    // --- ESTADOS DE PAGINACIÓN ---
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10,
    });
    const [rowCount, setRowCount] = useState(0);
    // --- ESTADOS DE MENSAJES POST-ACCIONES ---
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState<'success' | 'danger' | 'warning' | 'info'>('info');

    const showToastMessage = (
        message: string,
        variant: 'success' | 'danger' | 'warning' | 'info' = 'info'
    ) => {
        setToastMessage(message);
        setToastVariant(variant);
        setShowToast(true);
    };


    // --- ESTADOS DE FILTRO Y CARGA ---
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [reloadTrigger, setReloadTrigger] = useState(0); // <-- NUEVO ESTADO

    // --- ESTADOS DEL MODAL ---
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<RegistroVotacion>(initialRegistro);

    // 1. Carga inicial de auxiliares
    useEffect(() => {
        const loadAuxData = async () => {
            const [ciudades, departamentos] = await Promise.all([
                getAllCiudades(),
                getAllDepartamentos()
            ]);
            setDataCiudades(ciudades);
            setDataDepartamentos(departamentos);
        };
        loadAuxData();
    }, []);

    // 2. Carga de datos de la tabla (Paginación/Search)
    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                const skip = pagination.pageIndex * pagination.pageSize;
                const response = await fetchRegistroVotacionPaginated({
                    skip: skip,
                    limit: pagination.pageSize,
                    search: searchQuery || undefined,
                });
                setData(response.data);
                setRowCount(response.total);
            } catch (error) {
                console.error("Error fetching data:", error);
                setData([]);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [pagination.pageIndex, pagination.pageSize, searchQuery, reloadTrigger]);


    // --- HELPERS VISUALES PARA LA TABLA ---
    const getCiudadName = (id: number | null) => {
        if (!id) return "N/A";
        return dataCiudades.find(c => c.id === id)?.name || "Desconocido";
    };

    const getDepartamentoName = (municipioId: number | null) => {
        if (!municipioId) return "N/A";
        const ciudad = dataCiudades.find(c => c.id === municipioId);
        if (!ciudad) return "N/A";
        const depto = dataDepartamentos.find(d => d.id === ciudad.departmentId);
        return depto ? depto.name : "N/A";
    };

    // --- LÓGICA DE FORMULARIO (Adaptada de CrearAdmin) ---
    const handleChangeInputValue = async (
        e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const target = e.target as HTMLInputElement;
        const { name, value, /* type, */ checked } = target;

        const fieldName = name as keyof ValidationErrors;

        // 1️⃣ Detectar booleanos (switch / checkbox)
        const isBooleanField = ['lider', 'jurado', 'testigo', 'revisadoVerificado'].includes(name);
        const booleanValue = checked;

        // 2️⃣ Lógica numérica existente
        const valueNumOrStr = (value === '' || value === '0') ? null : value;
        const isNumericField = ['cedula', 'municipioId', 'liderCedula', 'mesaVotacion', 'departamentoId'].includes(name);

        const finalValue =
            isBooleanField
                ? booleanValue
                : isNumericField && valueNumOrStr !== null
                    ? Number(valueNumOrStr)
                    : valueNumOrStr;

        // 3️⃣ Validación en tiempo real
        const error = await validarRegistro(
            fieldName,
            finalValue,
            isEditing,
            currentRecord.cedula
        );

        setValidationErrors(prev => ({
            ...prev,
            [name]: error,
        }));

        // 4️⃣ Lógica Departamento → Municipio (igual que antes)
        if (name === 'departamentoId') {
            const deptoId = finalValue as number | null;

            const municipioError = await validarRegistro('municipioId', null);
            setValidationErrors(prev => ({ ...prev, municipioId: municipioError }));

            if (deptoId) {
                setSelectedDepartamentoId(deptoId);
                setCiudadPorDepartamento(dataCiudades.filter(c => c.departmentId === deptoId));
                setCurrentRecord(prev => ({ ...prev, departamentoId: deptoId }));
            } else {
                setSelectedDepartamentoId('');
                setCiudadPorDepartamento([]);
            }

            setCurrentRecord(prev => ({ ...prev, municipioId: null }));
            return;
        }

        // 5️⃣ Actualizar estado
        setCurrentRecord(prev => {
            if (name === 'nombres' || name === 'apellidos') {
                return { ...prev, [name]: toPascalCase(finalValue as string) };
            }
            return { ...prev, [name]: finalValue };
        });
    };


    // --- ACCIONES CRUD ---

    // Abrir Modal (Configura si es Crear o Editar)
    const openModal = (registro?: RegistroVotacion) => {
        setValidationErrors(initialValidationErrors); // Limpiar errores previos

        if (registro) {
            // MODO EDICIÓN
            setIsEditing(true);
            setCurrentRecord(registro);

            // Lógica para pre-seleccionar Departamento basado en el Municipio guardado
            if (registro.municipioId) {
                const ciudad = dataCiudades.find(c => c.id === registro.municipioId);
                if (ciudad) {
                    setSelectedDepartamentoId(ciudad.departmentId);
                    setCiudadPorDepartamento(dataCiudades.filter(c => c.departmentId === ciudad.departmentId));
                }
            }
        } else {
            // MODO CREACIÓN
            setIsEditing(false);
            setCurrentRecord(initialRegistro);
            setSelectedDepartamentoId('');
            setCiudadPorDepartamento([]);
        }
        setShowModal(true);
    };

    // Guardar (Crear o Editar)
    const handleSave = async () => {
        let hasErrors = false;
        const finalErrors: ValidationErrors = { ...initialValidationErrors };

        // Validar todos los campos
        const fieldsToValidate = (Object.keys(initialValidationErrors) as Array<keyof ValidationErrors>);

        for (const fieldName of fieldsToValidate) {
            // Nota: Usamos 'any' temporalmente porque currentRecord no tiene 'departamentoId' directo en la interfaz, 
            // pero para validación asumimos la estructura.
            const fieldValue = (currentRecord as any)[fieldName];

            // Caso especial para validar departamentoId que no está en la interfaz RegistroVotacion pero sí en el form
            const valToTest = fieldName === 'departamentoId' ? selectedDepartamentoId : fieldValue;
            const error = await validarRegistro(
                fieldName,
                valToTest,
                isEditing, // <-- Pasar el estado de edición
                currentRecord.cedula // <-- Pasar la cédula original
            );

            finalErrors[fieldName] = error;
            if (error) hasErrors = true;
        }

        setValidationErrors(finalErrors);

        if (hasErrors) {
            showToastMessage('Por favor, corrige los errores en el formulario.', 'warning');
            return;
        }


        try {
            if (isEditing) {
                await updateRegistroVotacion(currentRecord.cedula, currentRecord);
                showToastMessage(`Registro actualizado: ${currentRecord.nombres}`, 'success');
            } else {
                const nuevo = await createRegistroVotacion(currentRecord);
                showToastMessage(`Registro creado: ${nuevo.cedula} - ${nuevo.nombres}`, 'success');
            }

            setShowModal(false);
            // Refrescar tabla (manteniendo página actual si es posible)
            setPagination(prev => ({ ...prev }));
            setReloadTrigger(prev => prev + 1);
        } catch (error) {
            console.error("Error al guardar", error);
            showToastMessage('Error al guardar el registro.', 'danger');
        }
    };

    // Eliminar
    const handleDelete = async (cedula: number) => {
        if (window.confirm(`¿Estás seguro de eliminar el registro con cédula ${cedula}?`)) {
            try {
                await deleteRegistroVotacion(cedula);
                showToastMessage('Registro eliminado correctamente.', 'success');

                // Refrescar tabla
                setPagination(prev => ({ ...prev }));
            } catch (error) {
                console.error("Error eliminando", error);
                showToastMessage('No se pudo eliminar el registro.', 'danger');
            }
            setReloadTrigger(prev => prev + 1);
        }
    };

    // --- CONFIGURACIÓN TANSTACK TABLE ---
    const columnHelper = createColumnHelper<RegistroVotacion>();
    const columns = useMemo(() => [
        columnHelper.accessor("cedula", {
            header: "Cédula",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor(row => `${row.nombres} ${row.apellidos || ''}`, {
            id: "nombreCompleto",
            header: "Nombre Completo",
        }),
        columnHelper.accessor("mesaVotacion", {
            header: "Mesa",
            cell: info => info.getValue(),
        }),
        columnHelper.accessor("municipioId", {
            header: "Ciudad",
            cell: info => getCiudadName(info.getValue()),
        }),
        columnHelper.display({
            id: "departamento",
            header: "Departamento",
            cell: props => getDepartamentoName(props.row.original.municipioId),
        }),
        columnHelper.accessor("revisadoVerificado", {
            header: "Verificado",
            cell: info => (
                <span className={`fw-bold ${info.getValue() ? 'text-success' : 'text-danger'}`}>
                    {info.getValue() ? 'SI' : 'NO'}
                </span>
            )
        }),
        columnHelper.accessor("testigo", {
            header: "Testigo",
            cell: info => (
                <span className={`fw-bold ${info.getValue() ? 'text-success' : 'text-danger'}`}>
                    {info.getValue() ? 'SI' : 'NO'}
                </span>
            )
        }),
        columnHelper.accessor("jurado", {
            header: "Jurado",
            cell: info => (
                <span className={`fw-bold ${info.getValue() ? 'text-success' : 'text-danger'}`}>
                    {info.getValue() ? 'SI' : 'NO'}
                </span>
            )
        }),
        columnHelper.accessor("lider", {
            header: "Lider",
            cell: info => (
                <span className={`fw-bold ${info.getValue() ? 'text-success' : 'text-danger'}`}>
                    {info.getValue() ? 'SI' : 'NO'}
                </span>
            )
        }),
        columnHelper.display({
            id: "actions",
            header: "Acciones",
            cell: props => (
                <div className="d-flex justify-content-center gap-2">
                    <Button
                        variant="primary"
                        size="sm"
                        onClick={() => openModal(props.row.original)}
                    >
                        <IconPencil></IconPencil>
                    </Button>
                    <Button
                        className={'d-' + ((user?.rolId || 4) > 2 ? 'none' : 'block')}

                        variant="danger"
                        size="sm"
                        onClick={() => handleDelete(props.row.original.cedula)}
                    >
                        <IconTrash></IconTrash>
                    </Button>
                </div >
            ),
        }),
    ], [dataCiudades, dataDepartamentos]);


    useEffect(() => {
        if (currentRecord.departamentoId && currentRecord.municipioId) {

            const ciudadDepartamento = (dataDepartamentos.find(p => p.id == currentRecord.departamentoId))?.name + " - " + (ciudadPorDepartamento.find(p => p.id == currentRecord.municipioId))?.name

            setCurrentRecord(prev => ({ ...prev, municipioDepartamento: ciudadDepartamento }))
        }
    }, [setCurrentRecord, currentRecord.departamentoId, currentRecord.municipioId])

    const table = useReactTable({
        data,
        columns,
        state: { pagination },
        pageCount: Math.ceil(rowCount / pagination.pageSize),
        manualPagination: true,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
    });

    const handleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    };

    return (
        <div className="container-fluid mt-5">
            <h2 className="mb-4">Gestión de Votantes</h2>

            {/* Barra superior */}
            <Row className="mb-3 align-items-center mx-4">
                <Col md={6}>
                    <InputGroup>
                        <InputGroup.Text>🔍</InputGroup.Text>
                        <Form.Control
                            type="text"
                            placeholder="Buscar por nombre, cédula..."
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                    </InputGroup>
                </Col>
                <Col md={6} className="text-end">
                    <Button variant="success" onClick={() => openModal()}>+ Nuevo Registro</Button>
                </Col>
            </Row>

            {/* Tabla */}
            <div className="table-responsive bg-white p-3 rounded shadow-sm mx-4">
                <Table striped hover bordered>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => (
                                    <th key={header.id}>
                                        {flexRender(header.column.columnDef.header, header.getContext())}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={columns.length} className="text-center">Cargando...</td></tr>
                        ) : table.getRowModel().rows.length === 0 ? (
                            <tr><td colSpan={columns.length} className="text-center">No hay datos</td></tr>
                        ) : (
                            table.getRowModel().rows.map(row => (
                                <tr key={row.id}>
                                    {row.getVisibleCells().map(cell => (
                                        <td key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </td>
                                    ))}
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>

                {/* Paginación */}
                <div className="d-flex justify-content-between align-items-center mt-3">
                    <div className="text-muted small">
                        Total: {rowCount} registros
                    </div>
                    <Pagination className="mb-0">
                        <Pagination.First onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} />
                        <Pagination.Prev onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} />
                        <Pagination.Item active>{table.getState().pagination.pageIndex + 1}</Pagination.Item>
                        <Pagination.Next onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} />
                        <Pagination.Last onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} />
                    </Pagination>
                    <Form.Select
                        style={{ width: '120px' }}
                        value={table.getState().pagination.pageSize}
                        onChange={e => table.setPageSize(Number(e.target.value))}
                    >
                        {[10, 20, 50].map(p => <option key={p} value={p}>{p} / pág</option>)}
                    </Form.Select>
                </div>
            </div>

            {/* MODAL CON FORMULARIO COMPLEJO (Adaptado de CrearAdmin) */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" backdrop="static">
                <Modal.Header closeButton className="bg-primary text-white">
                    <Modal.Title>{isEditing ? 'Editar Registro' : 'Nuevo Registro de Votación'}</Modal.Title>
                </Modal.Header>
                <Modal.Body style={{ backgroundColor: '#f8f9fa' }}>
                    <Form className="row g-3">

                        {/* Cédula */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Cédula</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.cedula || ''}
                                type="number"
                                className={`form-control ${validationErrors.cedula ? 'is-invalid' : ''}`}
                                name='cedula'
                                disabled={isEditing} // Generalmente no se edita la PK
                            />
                            {validationErrors.cedula && <div className="invalid-feedback">{validationErrors.cedula}</div>}
                        </div>

                        {/* Nombres */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Nombres</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.nombres || ''}
                                type="text" className={`form-control ${validationErrors.nombres ? 'is-invalid' : ''}`} name='nombres' />
                            {validationErrors.nombres && <div className="invalid-feedback">{validationErrors.nombres}</div>}
                        </div>

                        {/* Apellidos */}
                        <div className="col-md-4">
                            <label className="form-label fw-bold">Apellidos</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.apellidos || ''}
                                type="text" className={`form-control ${validationErrors.apellidos ? 'is-invalid' : ''}`} name='apellidos' />
                            {validationErrors.apellidos && <div className="invalid-feedback">{validationErrors.apellidos}</div>}
                        </div>

                        {/* Celular */}
                        <div className="col-md-4">
                            <label className="form-label">N° Celular</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.numeroCelular || ''}
                                type="tel" className={`form-control ${validationErrors.numeroCelular ? 'is-invalid' : ''}`} name='numeroCelular' />
                            {validationErrors.numeroCelular && <div className="invalid-feedback">{validationErrors.numeroCelular}</div>}
                        </div>

                        {/* Correo */}
                        <div className="col-md-4">
                            <label className="form-label">Correo Electrónico</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.correoElectronico || ''}
                                type="email" className={`form-control ${validationErrors.correoElectronico ? 'is-invalid' : ''}`} name='correoElectronico' />
                            {validationErrors.correoElectronico && <div className="invalid-feedback">{validationErrors.correoElectronico}</div>}
                        </div>

                        {/* Mesa */}
                        <div className="col-md-4">
                            <label className="form-label">Mesa</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.mesaVotacion || ''}
                                type="number" className={`form-control ${validationErrors.mesaVotacion ? 'is-invalid' : ''}`} name='mesaVotacion' />
                            {validationErrors.mesaVotacion && <div className="invalid-feedback">{validationErrors.mesaVotacion}</div>}
                        </div>
                        <div className="col-md-3">
                            <Form.Check
                                type="switch"
                                label="Es Líder"
                                name="lider"
                                checked={!!currentRecord.lider}
                                onChange={handleChangeInputValue}
                            />
                        </div>
                        <div className="col-md-3">
                            <Form.Check
                                type="switch"
                                label="Es Testigo"
                                name="testigo"
                                checked={!!currentRecord.testigo}
                                onChange={handleChangeInputValue}
                            />
                        </div>
                        <div className="col-md-3">
                            <Form.Check
                                type="switch"
                                label="Es Jurado"
                                name="jurado"
                                checked={!!currentRecord.jurado}
                                onChange={handleChangeInputValue}
                            />
                        </div>
                        <div className="col-md-3">
                            <Form.Check
                                type="switch"
                                label="Está Verificado"
                                name="revisadoVerificado"
                                checked={!!currentRecord.revisadoVerificado}
                                onChange={handleChangeInputValue}
                            />
                        </div>

                        {/* Lugar Votación */}
                        <div className="col-md-9">
                            <label className="form-label">Lugar de votación</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.lugarVotacion || ''}
                                type="text" className={`form-control ${validationErrors.lugarVotacion ? 'is-invalid' : ''}`} name='lugarVotacion' />
                            {validationErrors.lugarVotacion && <div className="invalid-feedback">{validationErrors.lugarVotacion}</div>}
                        </div>

                        {/* Dirección */}
                        <div className="col-md-6">
                            <label className="form-label">Dirección</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.direccion || ''}
                                type="text" className={`form-control ${validationErrors.direccion ? 'is-invalid' : ''}`} name='direccion' />
                            {validationErrors.direccion && <div className="invalid-feedback">{validationErrors.direccion}</div>}
                        </div>

                        {/* Comuna */}
                        <div className="col-md-6">
                            <label className="form-label">Comuna / Barrio</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.comunaBarrio || ''}
                                type="text" className={`form-control ${validationErrors.comunaBarrio ? 'is-invalid' : ''}`} name='comunaBarrio' />
                            {validationErrors.comunaBarrio && <div className="invalid-feedback">{validationErrors.comunaBarrio}</div>}
                        </div>

                        {/* --- LÓGICA DEPARTAMENTO / MUNICIPIO --- */}
                        <div className="col-md-6">
                            <label className="form-label">Departamento</label>
                            <select
                                className={`form-select ${validationErrors.departamentoId ? 'is-invalid' : ''}`}
                                name='departamentoId'
                                onChange={handleChangeInputValue}
                                value={selectedDepartamentoId}
                            >
                                <option value="" disabled>Seleccione...</option>
                                {dataDepartamentos.map((dep) => (
                                    <option key={dep.id} value={dep.id}>{dep.name}</option>
                                ))}
                            </select>
                            {validationErrors.departamentoId && <div className="invalid-feedback">{validationErrors.departamentoId}</div>}
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Municipio</label>
                            <select
                                className={`form-select ${validationErrors.municipioId ? 'is-invalid' : ''}`}
                                name='municipioId'
                                onChange={handleChangeInputValue}
                                value={currentRecord.municipioId || ''}
                                disabled={ciudadPorDepartamento.length === 0}
                            >
                                <option value="" disabled>Seleccione...</option>
                                {ciudadPorDepartamento.map((mun) => (
                                    <option key={mun.id} value={mun.id}>{mun.name}</option>
                                ))}
                            </select>
                            {validationErrors.municipioId && <div className="invalid-feedback">{validationErrors.municipioId}</div>}
                        </div>

                        {/* Líder */}
                        <div className="col-md-6">
                            <label className="form-label">Cédula del Líder</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.liderCedula || ''}
                                type="number" className={`form-control ${validationErrors.liderCedula ? 'is-invalid' : ''}`} name='liderCedula' />
                            {validationErrors.liderCedula && <div className="invalid-feedback">{validationErrors.liderCedula}</div>}
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Nombre y Apellido del Líder</label>
                            <input
                                onChange={handleChangeInputValue}
                                value={currentRecord.liderNombres || ''}
                                type="text" className={`form-control ${''}`} name='liderNombres' />

                        </div>

                        {/* Observación */}
                        <div className="col-md-12">
                            <label className="form-label">Observación</label>
                            <textarea
                                onChange={handleChangeInputValue}
                                value={currentRecord.observacion || ''}
                                className="form-control" name='observacion' rows={3}
                            ></textarea>
                        </div>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Cancelar</Button>
                    <Button variant="primary" onClick={handleSave}>{isEditing ? 'Actualizar' : 'Guardar'}</Button>
                    <pre className={"bg-black text-white " + (isDebugPayloadJSONRV ? 'd-block' : 'd-none')}>
                        {JSON.stringify(currentRecord, null, 2)}
                    </pre>
                </Modal.Footer>
            </Modal>
            <ToastContainer position="top-end" className="p-3" style={{ zIndex: 1060 }}>
                <Toast
                    bg={toastVariant}
                    show={showToast}
                    onClose={() => setShowToast(false)}
                    delay={3000}
                    autohide
                >
                    <Toast.Header>
                        <strong className="me-auto">
                            {toastVariant === 'success' && '✅ Éxito'}
                            {toastVariant === 'danger' && '❌ Error'}
                            {toastVariant === 'warning' && '⚠️ Atención'}
                            {toastVariant === 'info' && 'ℹ️ Información'}
                        </strong>
                    </Toast.Header>
                    <Toast.Body className="text-white">
                        {toastMessage}
                    </Toast.Body>
                </Toast>
            </ToastContainer>

        </div>

    );
}
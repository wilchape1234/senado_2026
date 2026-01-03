@echo off
title Iniciar APP-SENADO

echo.
echo =======================================================
echo     Iniciando Servidor Backend (API NestJS)
echo =======================================================
echo.

START cmd /k "cd BACK\api-senado-2026 && npm run start:debug"

@REM echo.
@REM echo =======================================================
@REM echo     Iniciando Servidor Backend RESPOSITORIO ARCHIVOS (API EXPRESS)
@REM echo =======================================================
@REM echo.

@REM START cmd /k "cd 1.BACKEND\UPLOAD_GOOGLE_DRIVE && npm run start"

echo.
echo =======================================================
echo     Iniciando Cliente Frontend (Vite/React)
echo =======================================================
echo.


START cmd /k "cd FRONT\app-senado-2026 && npm run dev"

echo.
echo -------------------------------------------------------
echo.
echo Servidor y Cliente iniciados. No cierre las ventanas!
echo Presione cualquier tecla para cerrar esta ventana.
pause > nul
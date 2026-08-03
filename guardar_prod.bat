@echo off
chcp 65001 >nul
echo.
echo 📦 ORUS v10.7.7 — Guardando src + informes-anuales...
echo.
cd /d "%~dp0"
python guardar_v10.7.7_simple.py
pause

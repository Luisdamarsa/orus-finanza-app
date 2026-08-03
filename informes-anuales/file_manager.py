#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
file_manager.py
Maneja la estructura de carpetas para informes
Cada informe tiene su carpeta: /output/Informe_XXX/
  ├─ info.json (siempre)
  └─ report.pdf (on-demand)
"""

import os
import json
import shutil


def create_report_folder(output_dir, report_name):
    """Crea carpeta para un informe"""
    folder_path = os.path.join(output_dir, report_name)
    os.makedirs(folder_path, exist_ok=True)
    return folder_path


def save_report_json(folder_path, data):
    """Guarda JSON dentro de la carpeta del informe"""
    json_path = os.path.join(folder_path, "info.json")
    with open(json_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    return json_path


def get_report_pdf_path(folder_path):
    """Devuelve ruta del PDF (sin verificar si existe)"""
    return os.path.join(folder_path, "report.pdf")


def get_report_json_path(folder_path):
    """Devuelve ruta del JSON"""
    return os.path.join(folder_path, "info.json")


def read_report_json(folder_path):
    """Lee JSON del informe"""
    json_path = get_report_json_path(folder_path)
    if os.path.exists(json_path):
        with open(json_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    return None


def cleanup_old_files(output_dir):
    """Limpia archivos sueltos .json/.pdf en output (migración)"""
    removed = 0
    for filename in os.listdir(output_dir):
        if filename.endswith(('.json', '.pdf')):
            file_path = os.path.join(output_dir, filename)
            try:
                os.remove(file_path)
                removed += 1
                print(f"Removido: {filename}")
            except Exception as e:
                print(f"Error removiendo {filename}: {e}")
    return removed

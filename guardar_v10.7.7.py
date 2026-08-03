#!/usr/bin/env python3
"""Guarda la versión actual como prod-v10.7.7"""

import shutil
import os

source = r"C:\Users\LuisDanielMartinezSa\Documents\Claude\Projects\Codigo"
dest = r"C:\Users\LuisDanielMartinezSa\Documents\Claude\Projects\prod-v10.7.7"

print(f"Guardando Codigo → prod-v10.7.7")

try:
    # Si existe la carpeta, eliminarla
    if os.path.exists(dest):
        shutil.rmtree(dest)
        print("(Antigua versión eliminada)")

    # Copiar
    shutil.copytree(source, dest)
    print(f"✅ Guardado: {dest}")

except Exception as e:
    print(f"❌ Error: {e}")

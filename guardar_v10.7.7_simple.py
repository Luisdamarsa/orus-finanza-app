#!/usr/bin/env python3
"""Guarda SOLO src/ + informes-anuales/ a prod-v10.7.7"""

import shutil
import os

source_dir = r"C:\Users\LuisDanielMartinezSa\Documents\Claude\Projects\Codigo"
dest_dir = r"C:\Users\LuisDanielMartinezSa\Documents\Claude\Projects\prod-v10.7.7"

folders_to_copy = ["src", "informes-anuales"]

print("📦 Guardando solo src/ + informes-anuales/ → prod-v10.7.7\n")

try:
    for folder in folders_to_copy:
        src = os.path.join(source_dir, folder)
        dst = os.path.join(dest_dir, folder)

        # Si existe, eliminar la carpeta vieja
        if os.path.exists(dst):
            print(f"  🗑️  Eliminando {folder}/ viejo...")
            shutil.rmtree(dst)

        # Copiar
        print(f"  📋 Copiando {folder}/...")
        shutil.copytree(src, dst)
        print(f"  ✅ {folder}/ copiado\n")

    print("✅ ¡Guardado! prod-v10.7.7 ahora tiene:")
    print("   - src/")
    print("   - informes-anuales/")
    print("   - package.json, vite.config.js, index.html, etc.")
    print("\n🚀 Próximo paso: cd prod-v10.7.7 && npm install")

except Exception as e:
    print(f"❌ Error: {e}")

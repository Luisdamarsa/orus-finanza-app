#!/usr/bin/env python3
"""
Copiar HTMLs generados desde informes-anuales/output/ a public/informes/
Ejecutar esto antes de npm run dev para que los informes estén disponibles
"""

import os
import shutil
from pathlib import Path

# Rutas
script_dir = Path(__file__).parent
output_dir = script_dir / "informes-anuales" / "output"
public_dir = script_dir / "public" / "informes"

print(f"📋 Copiando HTMLs a public/informes/\n")
print(f"  Origen: {output_dir}")
print(f"  Destino: {public_dir}\n")

# Crear public/informes/ si no existe
public_dir.mkdir(parents=True, exist_ok=True)

# Buscar y copiar HTMLs
if not output_dir.exists():
    print(f"⚠️  Carpeta {output_dir} no existe. Ejecuta primero el generador de reportes.")
    print(f"    python informes-anuales/generate_all_pdfs.py")
    exit(1)

html_files = list(output_dir.glob("**/*.html"))
if not html_files:
    print(f"⚠️  No hay HTMLs en {output_dir}")
    print(f"    Ejecuta: python informes-anuales/generate_all_pdfs.py")
    exit(1)

copied = 0
for html_file in html_files:
    # Nombre normalizado (carpeta)
    folder_name = html_file.parent.name
    dest_file = public_dir / f"{folder_name}.html"

    try:
        shutil.copy2(html_file, dest_file)
        print(f"  ✅ {folder_name}.html")
        copied += 1
    except Exception as e:
        print(f"  ❌ Error copiando {html_file}: {e}")

print(f"\n✅ {copied} informes copiados a public/informes/")
print(f"🚀 Ahora puedes hacer: npm run dev")

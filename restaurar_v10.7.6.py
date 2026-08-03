#!/usr/bin/env python3
"""
Restaura la versión prod-v10.7.6
Copia todos los archivos de prod-v10.7.6 a Codigo
"""

import shutil
import os

source = r"C:\Users\LuisDanielMartinezSa\Documents\Claude\Projects\prod-v10.7.6"
dest = r"C:\Users\LuisDanielMartinezSa\Documents\Claude\Projects\Codigo"

print(f"Copiando {source} → {dest}")
print("Esto sobrescribirá TODOS los archivos.\n")

try:
    # Copiar recursivamente
    for item in os.listdir(source):
        s = os.path.join(source, item)
        d = os.path.join(dest, item)

        if os.path.isdir(s):
            print(f"📁 {item}/")
            if os.path.exists(d):
                shutil.rmtree(d)
            shutil.copytree(s, d)
        else:
            print(f"📄 {item}")
            shutil.copy2(s, d)

    print("\n✅ Restauración completa")
    print("Ejecuta: npm run dev")

except Exception as e:
    print(f"❌ Error: {e}")

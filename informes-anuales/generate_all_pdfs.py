#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
generate_all_pdfs.py
Genera PDFs en nueva estructura: /output/Informe_XXX/report.pdf
"""

import os
import json
import datetime
from orus_monthly_report import generate_monthly_report
from orus_quarterly_report import generate_quarterly_report
from orus_annual_report import generate_annual_report
from file_manager import create_report_folder, get_report_pdf_path, cleanup_old_files

base = os.path.dirname(os.path.abspath(__file__))
tx = json.load(open(os.path.join(base, "data", "transactions_db.json")))
budgets = json.load(open(os.path.join(base, "data", "budgets.json")))
user = json.load(open(os.path.join(base, "data", "user.json")))

output_dir = os.path.join(base, "output")
os.makedirs(output_dir, exist_ok=True)

print("🚀 Generando PDFs en estructura de carpetas...\n")
print("⚠️ Limpiando archivos antiguos...")
removed = cleanup_old_files(output_dir)
print(f"   Removidos: {removed} archivos\n")

# MENSUALES (17)
months_2025 = [(2025, m) for m in range(1, 13)]
months_2026 = [(2026, m) for m in range(1, 6)]
all_months = months_2025 + months_2026

for year, month in all_months:
    try:
        month_name = datetime.date(year, month, 1).strftime('%B')
        report_name = f"Informe_ORUS_Mensual_{month_name}{year}"
        folder = create_report_folder(output_dir, report_name)
        pdf_path = get_report_pdf_path(folder)

        result = generate_monthly_report(
            tx, budgets, year, month, user, pdf_path,
            llm_call=None,
            publish_date=datetime.date(year, month, 1)
        )
        print(f"✅ {report_name}")
    except Exception as e:
        print(f"❌ Mensual {month}/{year}: {e}")

# TRIMESTRALES (6)
trimestral_months = {
    1: [(2025, 1), (2025, 2), (2025, 3)],
    2: [(2025, 4), (2025, 5), (2025, 6)],
    3: [(2025, 7), (2025, 8), (2025, 9)],
    4: [(2025, 10), (2025, 11), (2025, 12)],
    5: [(2026, 1), (2026, 2), (2026, 3)],
    6: [(2026, 4), (2026, 5), (2026, 6)],
}

for q, months in trimestral_months.items():
    year = months[0][0]
    try:
        report_name = f"Informe_ORUS_Trimestral_Q{q}_{year}"
        folder = create_report_folder(output_dir, report_name)
        pdf_path = get_report_pdf_path(folder)

        result = generate_quarterly_report(
            tx, budgets, months, user, pdf_path,
            llm_call=None,
            publish_date=datetime.date(year, months[-1][1], 1)
        )
        print(f"✅ {report_name}")
    except Exception as e:
        print(f"❌ Trimestral Q{q}/{year}: {e}")

# ANUALES (1)
try:
    report_name = f"Informe_ORUS_Anual_2025"
    folder = create_report_folder(output_dir, report_name)
    pdf_path = get_report_pdf_path(folder)

    result = generate_annual_report(
        tx, budgets, user, 2025, pdf_path,
        llm_call=None,
        publish_date=datetime.date(2025, 12, 31)
    )
    print(f"✅ {report_name}")
except Exception as e:
    print(f"❌ Anual 2025: {e}")

print("\n✅ Generación completada")
print(f"📁 Estructura: {output_dir}/Informe_XXX/")
print("   ├─ info.json")
print("   └─ report.pdf")

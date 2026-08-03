#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
pdf_generator.py
Convierte datos JSON de informes a PDF usando ReportLab
Usado por: orus_monthly_report, orus_quarterly_report, orus_annual_report
"""

import json
from datetime import datetime
from reportlab.lib.pagesizes import letter, A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT

# Colores ORUS
COLOR_PRIMARY = colors.HexColor("#9B6DFF")  # Púrpura
COLOR_DARK = colors.HexColor("#1A1830")    # Oscuro
COLOR_TEXT = colors.HexColor("#F0EEFF")    # Claro
COLOR_ACCENT = colors.HexColor("#93C5FD")  # Azul


def format_money(amount):
    """Formatea moneda colombiana"""
    if amount is None:
        return "N/A"
    return f"${amount:,.0f} COP"


def generate_pdf_from_json(json_file, output_pdf=None):
    """
    Lee un JSON de informe y genera un PDF

    Args:
        json_file: ruta del archivo JSON
        output_pdf: ruta del PDF (opcional, si no se proporciona usa json_file con extensión .pdf)
    """
    try:
        # Leer JSON
        with open(json_file, 'r', encoding='utf-8') as f:
            data = json.load(f)

        # Determinar ruta de salida
        if output_pdf is None:
            output_pdf = json_file.replace('.json', '.pdf')

        # Crear documento PDF
        doc = SimpleDocTemplate(
            output_pdf,
            pagesize=letter,
            rightMargin=0.5*inch,
            leftMargin=0.5*inch,
            topMargin=0.5*inch,
            bottomMargin=0.5*inch
        )

        # Estilo
        styles = getSampleStyleSheet()

        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=COLOR_PRIMARY,
            spaceAfter=6,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )

        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=12,
            textColor=COLOR_PRIMARY,
            spaceAfter=4,
            fontName='Helvetica-Bold'
        )

        normal_style = ParagraphStyle(
            'CustomNormal',
            parent=styles['Normal'],
            fontSize=10,
            textColor=COLOR_TEXT,
            spaceAfter=3,
            fontName='Helvetica'
        )

        # Contenido
        story = []

        # Header
        story.append(Paragraph("📊 ORUS - Finanzas Personales", title_style))
        story.append(Paragraph(data.get('titulo', 'Informe'), heading_style))
        story.append(Spacer(1, 0.2*inch))

        # Fecha
        fecha_descarga = data.get('fecha_descarga', datetime.now().strftime('%d/%m/%Y %H:%M'))
        story.append(Paragraph(f"<b>Descargado:</b> {fecha_descarga}", normal_style))
        story.append(Spacer(1, 0.15*inch))

        # Contenido principal
        contenido = data.get('contenido', {})

        if 'resumen' in contenido:
            story.append(Paragraph("<b>Resumen</b>", heading_style))
            story.append(Paragraph(contenido['resumen'], normal_style))
            story.append(Spacer(1, 0.1*inch))

        if 'periodo' in contenido:
            story.append(Paragraph(f"<b>Período:</b> {contenido['periodo']}", normal_style))
            story.append(Spacer(1, 0.1*inch))

        # Datos financieros (si existen)
        if 'gastos' in data or 'ingresos' in data or 'saldo' in data:
            story.append(Paragraph("<b>Resumen Financiero</b>", heading_style))

            data_table = []
            if 'ingresos' in data:
                data_table.append(['Ingresos', format_money(data['ingresos'])])
            if 'gastos' in data:
                data_table.append(['Gastos', format_money(data['gastos'])])
            if 'saldo' in data:
                data_table.append(['Saldo', format_money(data['saldo'])])

            if data_table:
                table = Table(data_table, colWidths=[3*inch, 2*inch])
                table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), COLOR_DARK),
                    ('TEXTCOLOR', (0, 0), (-1, -1), COLOR_TEXT),
                    ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
                    ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
                    ('FONTSIZE', (0, 0), (-1, -1), 10),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('GRID', (0, 0), (-1, -1), 1, COLOR_PRIMARY),
                ]))
                story.append(table)
                story.append(Spacer(1, 0.15*inch))

        # Nota
        if 'nota' in contenido:
            story.append(Paragraph(f"<i>{contenido['nota']}</i>", normal_style))
            story.append(Spacer(1, 0.1*inch))

        # Footer
        story.append(Spacer(1, 0.3*inch))
        story.append(Paragraph("© ORUS - Finanzas Personales | Informe Automático",
                              ParagraphStyle('footer', parent=styles['Normal'],
                                            fontSize=8, textColor=COLOR_PRIMARY,
                                            alignment=TA_CENTER)))

        # Generar PDF
        doc.build(story)

        return {
            'success': True,
            'pdf_file': output_pdf,
            'message': f'PDF generado: {output_pdf}'
        }

    except Exception as e:
        return {
            'success': False,
            'error': str(e),
            'message': f'Error generando PDF: {str(e)}'
        }


if __name__ == '__main__':
    import sys
    if len(sys.argv) > 1:
        json_file = sys.argv[1]
        result = generate_pdf_from_json(json_file)
        print(result['message'])

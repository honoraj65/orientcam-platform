"""
Générateur de PDF pour les résultats RIASEC
Design professionnel avec barres visuelles, couleurs par dimension et mise en page soignée
"""
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak,
    KeepTogether, HRFlowable
)
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.graphics.shapes import Drawing, Rect, String

# ============================================================
# Couleurs par dimension RIASEC (identiques au frontend)
# ============================================================
DIMENSION_COLORS = {
    'R': '#dc2626',  # Rouge - Réaliste
    'I': '#7c3aed',  # Violet - Investigateur
    'A': '#f59e0b',  # Orange - Artistique
    'S': '#059669',  # Vert - Social
    'E': '#2563eb',  # Bleu - Entreprenant
    'C': '#64748b',  # Gris-bleu - Conventionnel
}

DIMENSION_NAMES = {
    'R': 'Réaliste',
    'I': 'Investigateur',
    'A': 'Artistique',
    'S': 'Social',
    'E': 'Entreprenant',
    'C': 'Conventionnel',
}

# Couleurs principales du design
PRIMARY_BLUE = '#1e40af'
PRIMARY_BLUE_LIGHT = '#3b82f6'
EMERALD = '#059669'
EMERALD_LIGHT = '#d1fae5'
INDIGO = '#4f46e5'
GRAY_50 = '#f9fafb'
GRAY_100 = '#f3f4f6'
GRAY_200 = '#e5e7eb'
GRAY_500 = '#6b7280'
GRAY_700 = '#374151'
GRAY_900 = '#111827'

PAGE_WIDTH = A4[0]
PAGE_HEIGHT = A4[1]
CONTENT_WIDTH = PAGE_WIDTH - 4 * cm  # 2cm margins each side


def _hex(color_str):
    """Raccourci pour HexColor"""
    return colors.HexColor(color_str)


def _draw_score_bar(score_pct, dimension_code, bar_width=None):
    """
    Crée un Drawing avec une barre de progression colorée par dimension.
    """
    if bar_width is None:
        bar_width = CONTENT_WIDTH - 4 * cm
    bar_height = 14
    drawing = Drawing(bar_width, bar_height)

    # Fond gris
    drawing.add(Rect(0, 0, bar_width, bar_height,
                      fillColor=_hex('#e5e7eb'), strokeColor=None, rx=4, ry=4))

    # Barre colorée
    fill_width = max(bar_width * score_pct / 100, 0)
    if fill_width > 0:
        color = DIMENSION_COLORS.get(dimension_code, PRIMARY_BLUE_LIGHT)
        drawing.add(Rect(0, 0, fill_width, bar_height,
                          fillColor=_hex(color), strokeColor=None, rx=4, ry=4))

    return drawing


def _draw_holland_code_boxes(holland_code):
    """
    Crée un Drawing avec des boîtes colorées pour chaque lettre du code Holland.
    Style identique au frontend : carrés colorés avec la lettre et le nom.
    """
    box_size = 55
    gap = 10
    label_height = 20
    code_letters = [c for c in holland_code if c.strip()]
    total_width = len(code_letters) * box_size + (len(code_letters) - 1) * gap
    total_height = box_size + label_height + 10
    drawing = Drawing(total_width, total_height)

    for i, code in enumerate(code_letters):
        x = i * (box_size + gap)
        color = DIMENSION_COLORS.get(code, PRIMARY_BLUE)
        name = DIMENSION_NAMES.get(code, code)

        # Boîte colorée (positionnée en haut, au-dessus du label)
        box_y = label_height + 5
        drawing.add(Rect(x, box_y, box_size, box_size,
                          fillColor=_hex(color), strokeColor=None, rx=8, ry=8))

        # Lettre centrée en blanc
        drawing.add(String(x + box_size / 2, box_y + box_size / 2 - 8, code,
                           fontSize=26, fontName='Helvetica-Bold',
                           fillColor=colors.white, textAnchor='middle'))

        # Nom de la dimension en dessous de la boîte
        drawing.add(String(x + box_size / 2, 5, name,
                           fontSize=8, fontName='Helvetica',
                           fillColor=_hex(GRAY_700), textAnchor='middle'))

    return drawing


def _draw_decorated_line():
    """Ligne de séparation décorative"""
    return HRFlowable(
        width="100%", thickness=1.5,
        color=_hex(GRAY_200), spaceAfter=8, spaceBefore=8
    )


def add_page_number(canvas, doc):
    """En-têtes et pieds de page professionnels"""
    canvas.saveState()

    # En-tête (sauf première page)
    if doc.page > 1:
        # Bande verte subtile en haut
        canvas.setFillColor(_hex(EMERALD))
        canvas.rect(0, PAGE_HEIGHT - 0.8 * cm, PAGE_WIDTH, 0.8 * cm, fill=1, stroke=0)

        canvas.setFont('Helvetica-Bold', 8)
        canvas.setFillColor(colors.white)
        canvas.drawString(2 * cm, PAGE_HEIGHT - 0.55 * cm, "ORIENTUNIV")

        canvas.setFont('Helvetica', 8)
        canvas.drawRightString(PAGE_WIDTH - 2 * cm, PAGE_HEIGHT - 0.55 * cm,
                               "Résultats du Test RIASEC")

    # Pied de page
    canvas.setStrokeColor(_hex(GRAY_200))
    canvas.setLineWidth(0.5)
    canvas.line(2 * cm, 1.6 * cm, PAGE_WIDTH - 2 * cm, 1.6 * cm)

    canvas.setFont('Helvetica', 8)
    canvas.setFillColor(_hex(GRAY_500))
    canvas.drawString(2 * cm, 1.1 * cm,
                      "OrientUniv - Université de Bertoua")
    canvas.drawRightString(PAGE_WIDTH - 2 * cm, 1.1 * cm,
                           f"Page {doc.page}")

    canvas.restoreState()


def generate_riasec_pdf(student_profile, riasec_test, scores_list, careers_data, recommendations_data=None):
    """
    Génère un PDF professionnel avec les résultats du test RIASEC.
    """
    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2 * cm,
        leftMargin=2 * cm,
        topMargin=1.5 * cm,
        bottomMargin=2 * cm
    )

    # ============================================================
    # Styles
    # ============================================================
    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=28,
        textColor=_hex(PRIMARY_BLUE),
        spaceAfter=20,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold',
        leading=34
    )

    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=_hex(PRIMARY_BLUE),
        spaceAfter=10,
        spaceBefore=12,
        fontName='Helvetica-Bold',
        leading=20,
        borderPadding=(0, 0, 4, 0),
    )

    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        spaceAfter=4,
        leading=14,
        textColor=_hex(GRAY_700)
    )

    caption_style = ParagraphStyle(
        'Caption',
        parent=styles['Normal'],
        fontSize=9,
        textColor=_hex(GRAY_500),
        alignment=TA_CENTER,
        spaceAfter=4,
        leading=12
    )

    elements = []

    # ============================================================
    # PAGE DE COUVERTURE
    # ============================================================
    elements.append(Spacer(1, 2 * cm))

    # Logo / Branding
    elements.append(Paragraph(
        "ORIENTUNIV",
        ParagraphStyle('Brand', parent=title_style, fontSize=36,
                       textColor=_hex(EMERALD), spaceAfter=6)
    ))
    elements.append(Paragraph(
        "Université de Bertoua",
        ParagraphStyle('BrandSub', parent=normal_style, fontSize=14,
                       alignment=TA_CENTER, textColor=_hex(GRAY_500), spaceAfter=4)
    ))
    elements.append(Paragraph(
        "Plateforme d'Orientation Académique de l'Université de Bertoua",
        ParagraphStyle('BrandDesc', parent=normal_style, fontSize=11,
                       alignment=TA_CENTER, textColor=_hex(GRAY_500), spaceAfter=20)
    ))

    # Ligne décorative
    elements.append(HRFlowable(
        width="60%", thickness=2,
        color=_hex(EMERALD), spaceAfter=20, spaceBefore=10,
        hAlign='CENTER'
    ))

    # Titre du rapport
    elements.append(Paragraph("RAPPORT DE RÉSULTATS", title_style))
    elements.append(Paragraph(
        "TEST D'INTÉRÊTS PROFESSIONNELS RIASEC",
        ParagraphStyle('ReportSubtitle', parent=normal_style, fontSize=14,
                       alignment=TA_CENTER, textColor=_hex(PRIMARY_BLUE_LIGHT), spaceAfter=30)
    ))

    # Informations de l'étudiant sur la couverture
    full_name = f"{student_profile.last_name} {student_profile.first_name}".title()
    test_date = datetime.fromisoformat(riasec_test.created_at.isoformat()).strftime('%d/%m/%Y')

    cover_label_style = ParagraphStyle('CoverLabel', parent=normal_style, textColor=colors.white, fontSize=11)
    cover_val_style = ParagraphStyle('CoverVal', parent=normal_style, fontSize=12, textColor=_hex(GRAY_900))

    cover_data = [
        [Paragraph('<b>Étudiant</b>', cover_label_style),
         Paragraph(f'<b>{full_name}</b>', cover_val_style)],
        [Paragraph('<b>Date du test</b>', cover_label_style),
         Paragraph(test_date, cover_val_style)],
        [Paragraph('<b>Code Holland</b>', cover_label_style),
         Paragraph(f'<b><font size="14" color="{PRIMARY_BLUE}">{riasec_test.holland_code}</font></b>',
                   cover_val_style)],
    ]

    cover_table = Table(cover_data, colWidths=[5 * cm, 11 * cm])
    cover_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), _hex(PRIMARY_BLUE_LIGHT)),
        ('BACKGROUND', (1, 0), (1, -1), _hex('#f0f4ff')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 14),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 14),
        ('LEFTPADDING', (0, 0), (-1, -1), 14),
        ('RIGHTPADDING', (0, 0), (-1, -1), 14),
        ('LINEBELOW', (0, 0), (-1, -2), 1, _hex('#dbeafe')),
        ('ROUNDEDCORNERS', [6, 6, 6, 6]),
    ]))
    elements.append(cover_table)

    elements.append(PageBreak())

    # ============================================================
    # 1. INFORMATIONS DU PROFIL
    # ============================================================
    elements.append(Paragraph("1. Informations du Profil", section_title_style))
    elements.append(_draw_decorated_line())

    profile_name = f"{student_profile.last_name} {student_profile.first_name}".title()
    email = student_profile.user.email if student_profile.user else 'N/A'
    phone = student_profile.phone or 'Non renseigné'
    test_datetime = datetime.fromisoformat(riasec_test.created_at.isoformat()).strftime('%d/%m/%Y à %H:%M')

    profile_rows = [
        ['Nom complet', profile_name],
        ['Email', email],
        ['Téléphone', phone],
        ['Date du test', test_datetime],
    ]

    if student_profile.user_type == 'new_bachelor':
        if student_profile.bac_series:
            profile_rows.append(['Série du Bac', student_profile.bac_series])
        if student_profile.current_education_level:
            profile_rows.append(['Niveau actuel', student_profile.current_education_level])
    elif student_profile.user_type == 'university_student':
        if student_profile.current_university:
            profile_rows.append(['Université', student_profile.current_university])
        if student_profile.current_program:
            profile_rows.append(['Programme actuel', student_profile.current_program])

    profile_table = Table(profile_rows, colWidths=[5 * cm, 11 * cm])
    profile_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), _hex(GRAY_100)),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        ('TEXTCOLOR', (0, 0), (0, -1), _hex(GRAY_700)),
        ('TEXTCOLOR', (1, 0), (1, -1), _hex(GRAY_900)),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('TOPPADDING', (0, 0), (-1, -1), 9),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 9),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        ('LINEBELOW', (0, 0), (-1, -2), 0.5, _hex(GRAY_200)),
        ('LINEBELOW', (0, -1), (-1, -1), 0.5, _hex(GRAY_200)),
        ('LINEABOVE', (0, 0), (-1, 0), 0.5, _hex(GRAY_200)),
    ]))
    elements.append(profile_table)
    elements.append(Spacer(1, 1 * cm))

    # ============================================================
    # 2. CODE HOLLAND
    # ============================================================
    elements.append(Paragraph("2. Votre Code Holland", section_title_style))
    elements.append(_draw_decorated_line())
    elements.append(Spacer(1, 0.3 * cm))

    # Boîtes colorées du code Holland
    holland_drawing = _draw_holland_code_boxes(riasec_test.holland_code)
    # Centrer le drawing via un tableau
    holland_table = Table([[holland_drawing]], colWidths=[CONTENT_WIDTH])
    holland_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    elements.append(holland_table)

    elements.append(Spacer(1, 0.8 * cm))
    elements.append(Paragraph(
        "Vos trois dimensions dominantes définissent votre personnalité professionnelle "
        "et les environnements dans lesquels vous vous épanouirez le mieux.",
        ParagraphStyle('HollandDesc', parent=caption_style, fontSize=10,
                       textColor=_hex(GRAY_500))
    ))
    elements.append(Spacer(1, 0.8 * cm))

    # ============================================================
    # 3. SCORES PAR DIMENSION
    # ============================================================
    elements.append(Paragraph("3. Scores par Dimension", section_title_style))
    elements.append(_draw_decorated_line())
    elements.append(Spacer(1, 0.3 * cm))

    # Construire les lignes du tableau avec barres visuelles
    table_header_style = ParagraphStyle('TableHeader', parent=normal_style, textColor=colors.white, fontSize=10)
    table_header_center = ParagraphStyle('TableHeaderC', parent=table_header_style, alignment=TA_CENTER)

    score_header = [
        Paragraph('<b>Dimension</b>', table_header_style),
        Paragraph('<b>Progression</b>', table_header_center),
        Paragraph('<b>Score</b>', table_header_center),
    ]

    score_rows = [score_header]
    for idx, score in enumerate(scores_list):
        code = score['dimension_code']
        name = score['dimension_name']
        pct = score['percentage']
        color = DIMENSION_COLORS.get(code, PRIMARY_BLUE_LIGHT)

        # Badge coloré avec nom
        dim_label = Paragraph(
            f'<font color="{color}"><b>{code}</b></font> - {name}'
            + (f'  <font size="7" color="{EMERALD}"><b>#{idx + 1}</b></font>' if idx < 3 else ''),
            ParagraphStyle(f'DimLabel_{code}', parent=normal_style, fontSize=10,
                           textColor=_hex(GRAY_900))
        )

        # Barre visuelle
        bar = _draw_score_bar(pct, code, bar_width=200)

        # Score en gras
        score_label = Paragraph(
            f'<b><font color="{color}" size="12">{pct}%</font></b>',
            ParagraphStyle(f'ScoreLabel_{code}', parent=normal_style, alignment=TA_CENTER)
        )

        score_rows.append([dim_label, bar, score_label])

    scores_table = Table(score_rows, colWidths=[5.5 * cm, 8 * cm, 2.5 * cm])
    scores_table.setStyle(TableStyle([
        # En-tête
        ('BACKGROUND', (0, 0), (-1, 0), _hex(PRIMARY_BLUE)),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        # Lignes alternées
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, _hex(GRAY_50)]),
        # Alignement
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'CENTER'),
        ('ALIGN', (2, 0), (2, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        # Espacement
        ('TOPPADDING', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 10),
        ('TOPPADDING', (0, 1), (-1, -1), 8),
        ('BOTTOMPADDING', (0, 1), (-1, -1), 8),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        # Bordures subtiles
        ('LINEBELOW', (0, 0), (-1, 0), 1.5, _hex(PRIMARY_BLUE)),
        ('LINEBELOW', (0, 1), (-1, -2), 0.5, _hex(GRAY_200)),
        ('LINEBELOW', (0, -1), (-1, -1), 1, _hex(GRAY_200)),
    ]))
    elements.append(scores_table)
    elements.append(Spacer(1, 0.5 * cm))

    # Légende des top 3
    elements.append(Paragraph(
        f'<font color="{EMERALD}"><b>#1 #2 #3</b></font> = Vos trois dimensions dominantes (Code Holland)',
        ParagraphStyle('Legend', parent=caption_style, alignment=TA_LEFT)
    ))
    elements.append(Spacer(1, 0.5 * cm))

    # ============================================================
    # 4. CARRIÈRES RECOMMANDÉES
    # ============================================================
    elements.append(PageBreak())
    elements.append(Paragraph("4. Carrières Recommandées", section_title_style))
    elements.append(_draw_decorated_line())
    elements.append(Spacer(1, 0.3 * cm))

    for career_data in careers_data:
        if not career_data.get('dimension'):
            continue

        dimension = career_data['dimension']
        code = dimension.get('code', '')
        color = DIMENSION_COLORS.get(code, PRIMARY_BLUE)

        # En-tête de dimension avec couleur
        career_header_data = [[
            Paragraph(
                f'<font color="white" size="14"><b> {code} </b></font>',
                ParagraphStyle(f'CareerBadge_{code}', parent=normal_style, alignment=TA_CENTER)
            ),
            Paragraph(
                f'<b>{dimension.get("name", code)}</b>',
                ParagraphStyle(f'CareerName_{code}', parent=normal_style, fontSize=13,
                               textColor=_hex(color), fontName='Helvetica-Bold')
            )
        ]]

        career_header_table = Table(career_header_data, colWidths=[1.5 * cm, 14.5 * cm])
        career_header_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, 0), _hex(color)),
            ('BACKGROUND', (1, 0), (1, 0), _hex(GRAY_50)),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('LEFTPADDING', (0, 0), (-1, -1), 8),
            ('RIGHTPADDING', (0, 0), (-1, -1), 8),
            ('ROUNDEDCORNERS', [4, 4, 4, 4]),
        ]))

        career_block = [career_header_table]

        if dimension.get('description'):
            career_block.append(Spacer(1, 0.2 * cm))
            career_block.append(Paragraph(
                dimension['description'],
                ParagraphStyle(f'CareerDesc_{code}', parent=normal_style, fontSize=10,
                               leftIndent=12, textColor=_hex(GRAY_700))
            ))

        if career_data.get('careers'):
            career_block.append(Spacer(1, 0.2 * cm))
            # Liste structurée des métiers
            careers_items = career_data['careers'][:10]
            for career_name in careers_items:
                career_block.append(Paragraph(
                    f'<font color="{color}">&#8226;</font>  {career_name}',
                    ParagraphStyle(f'CareerItem_{code}', parent=normal_style, fontSize=10,
                                   leftIndent=20, spaceAfter=2)
                ))

        career_block.append(Spacer(1, 0.5 * cm))
        elements.append(KeepTogether(career_block))

    # ============================================================
    # 5. PROGRAMMES ACADÉMIQUES RECOMMANDÉS
    # ============================================================
    if recommendations_data and len(recommendations_data) > 0:
        elements.append(PageBreak())
        elements.append(Paragraph("5. Programmes Académiques Recommandés", section_title_style))
        elements.append(_draw_decorated_line())
        elements.append(Paragraph(
            f'{len(recommendations_data)} programme{"s" if len(recommendations_data) > 1 else ""} '
            f'compatible{"s" if len(recommendations_data) > 1 else ""} avec votre profil RIASEC',
            ParagraphStyle('RecCount', parent=caption_style, alignment=TA_LEFT, spaceAfter=10)
        ))

        for idx, rec in enumerate(recommendations_data):
            score_val = rec['score']

            # Couleur du score
            if score_val >= 75:
                score_color = '#059669'
                score_label = 'Excellent'
            elif score_val >= 60:
                score_color = '#2563eb'
                score_label = 'Très bon'
            elif score_val >= 50:
                score_color = '#f59e0b'
                score_label = 'Bon'
            else:
                score_color = '#6b7280'
                score_label = 'Modéré'

            rec_elements = []

            # En-tête : numéro + score + université
            header_row = [[
                Paragraph(
                    f'<font color="white" size="11"><b>#{idx + 1}</b></font>',
                    ParagraphStyle(f'RecNum_{idx}', parent=normal_style, alignment=TA_CENTER)
                ),
                Paragraph(
                    f'<b>{rec["university"]}</b><br/>'
                    f'<font size="9" color="{GRAY_500}">{rec.get("department", "")}</font>',
                    ParagraphStyle(f'RecUniv_{idx}', parent=normal_style, fontSize=12,
                                   textColor=_hex(EMERALD), fontName='Helvetica-Bold')
                ),
                Paragraph(
                    f'<font size="16" color="{score_color}"><b>{score_val}%</b></font><br/>'
                    f'<font size="8" color="{GRAY_500}">{score_label}</font>',
                    ParagraphStyle(f'RecScore_{idx}', parent=normal_style, alignment=TA_CENTER)
                ),
            ]]

            header_table = Table(header_row, colWidths=[1.5 * cm, 11 * cm, 3.5 * cm])
            header_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (0, 0), _hex(EMERALD)),
                ('BACKGROUND', (1, 0), (1, 0), _hex(EMERALD_LIGHT)),
                ('BACKGROUND', (2, 0), (2, 0), _hex(GRAY_50)),
                ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                ('TOPPADDING', (0, 0), (-1, -1), 10),
                ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
                ('LEFTPADDING', (0, 0), (-1, -1), 8),
                ('RIGHTPADDING', (0, 0), (-1, -1), 8),
                ('ROUNDEDCORNERS', [4, 4, 0, 0]),
            ]))
            rec_elements.append(header_table)

            # Parcours Licence → Master ou programme simple
            if rec['level'] == 'Licence' and rec.get('master_program'):
                master = rec['master_program']

                path_data = [[
                    Paragraph(
                        f'<font color="{PRIMARY_BLUE_LIGHT}"><b>LICENCE</b></font>'
                        f'  <font size="9" color="{GRAY_500}">Bac+{rec["duration_years"]}</font>',
                        ParagraphStyle(f'LicLabel_{idx}', parent=normal_style, fontSize=11)
                    ),
                    Paragraph(
                        f'<b>{rec["program_name"]}</b>',
                        ParagraphStyle(f'LicName_{idx}', parent=normal_style, fontSize=11,
                                       textColor=_hex(GRAY_900))
                    ),
                ], [
                    Paragraph(
                        f'<font color="{INDIGO}"><b>MASTER</b></font>'
                        f'  <font size="9" color="{GRAY_500}">Bac+{rec["duration_years"] + master["duration_years"]}</font>',
                        ParagraphStyle(f'MastLabel_{idx}', parent=normal_style, fontSize=11)
                    ),
                    Paragraph(
                        f'<b>{master["name"]}</b>',
                        ParagraphStyle(f'MastName_{idx}', parent=normal_style, fontSize=11,
                                       textColor=_hex(GRAY_900))
                    ),
                ]]

                path_table = Table(path_data, colWidths=[5 * cm, 11 * cm])
                path_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, 0), _hex('#eff6ff')),  # bleu clair pour Licence
                    ('BACKGROUND', (0, 1), (-1, 1), _hex('#eef2ff')),  # indigo clair pour Master
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('TOPPADDING', (0, 0), (-1, -1), 8),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('LEFTPADDING', (0, 0), (-1, -1), 10),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                    ('LINEBELOW', (0, 0), (-1, 0), 0.5, _hex('#bfdbfe')),
                    ('ROUNDEDCORNERS', [0, 0, 4, 4]),
                ]))
                rec_elements.append(path_table)
            else:
                # Programme simple
                prog_data = [[
                    Paragraph(
                        f'<font color="{GRAY_700}"><b>{rec["level"].upper()}</b></font>'
                        f'  <font size="9" color="{GRAY_500}">Bac+{rec["duration_years"]}</font>',
                        ParagraphStyle(f'ProgLabel_{idx}', parent=normal_style, fontSize=11)
                    ),
                    Paragraph(
                        f'<b>{rec["program_name"]}</b>',
                        ParagraphStyle(f'ProgName_{idx}', parent=normal_style, fontSize=11,
                                       textColor=_hex(GRAY_900))
                    ),
                ]]

                prog_table = Table(prog_data, colWidths=[5 * cm, 11 * cm])
                prog_table.setStyle(TableStyle([
                    ('BACKGROUND', (0, 0), (-1, -1), _hex(GRAY_50)),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('TOPPADDING', (0, 0), (-1, -1), 8),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
                    ('LEFTPADDING', (0, 0), (-1, -1), 10),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 10),
                    ('ROUNDEDCORNERS', [0, 0, 4, 4]),
                ]))
                rec_elements.append(prog_table)

            rec_elements.append(Spacer(1, 0.5 * cm))
            elements.append(KeepTogether(rec_elements))

    elif recommendations_data is not None:
        # État vide : aucune recommandation
        elements.append(Spacer(1, 1 * cm))
        elements.append(Paragraph("5. Programmes Académiques Recommandés", section_title_style))
        elements.append(_draw_decorated_line())
        elements.append(Paragraph(
            "Aucun programme recommandé pour le moment. "
            "Complétez votre profil (notes et valeurs professionnelles) pour obtenir des recommandations personnalisées.",
            ParagraphStyle('EmptyRec', parent=normal_style, fontSize=10, alignment=TA_CENTER,
                           textColor=_hex(GRAY_500), spaceBefore=20, spaceAfter=20)
        ))

    # ============================================================
    # PIED DE PAGE FINAL
    # ============================================================
    elements.append(Spacer(1, 1.5 * cm))
    elements.append(HRFlowable(
        width="40%", thickness=1,
        color=_hex(GRAY_200), spaceAfter=10, spaceBefore=10,
        hAlign='CENTER'
    ))
    elements.append(Paragraph(
        "OrientUniv - Plateforme d'Orientation Académique de l'Université de Bertoua",
        ParagraphStyle('FinalFooter', parent=caption_style, fontSize=9,
                       textColor=_hex(GRAY_500))
    ))
    elements.append(Paragraph(
        f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
        ParagraphStyle('FinalDate', parent=caption_style, fontSize=8,
                       textColor=_hex(GRAY_500))
    ))

    # ============================================================
    # BUILD
    # ============================================================
    doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)
    buffer.seek(0)
    return buffer

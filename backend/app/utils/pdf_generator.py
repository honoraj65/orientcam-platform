"""
Générateur de PDF pour les résultats RIASEC
"""
from io import BytesIO
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, PageBreak
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY


def add_page_number(canvas, doc):
    """
    Ajoute les en-têtes et pieds de page
    """
    canvas.saveState()

    # En-tête (sauf première page)
    if doc.page > 1:
        canvas.setFont('Helvetica', 9)
        canvas.setFillColor(colors.HexColor('#6b7280'))
        canvas.drawString(2*cm, A4[1] - 1.5*cm, "Résultats du Test RIASEC - OrientCam")

    # Pied de page avec numéro
    canvas.setFont('Helvetica', 9)
    canvas.setFillColor(colors.HexColor('#6b7280'))

    # Ligne de séparation
    canvas.setStrokeColor(colors.HexColor('#e5e7eb'))
    canvas.setLineWidth(0.5)
    canvas.line(2*cm, 1.8*cm, A4[0] - 2*cm, 1.8*cm)

    # OrientCam à gauche
    canvas.drawString(2*cm, 1.3*cm, "OrientCam")

    # Numéro de page à droite
    page_num = f"Page {doc.page}"
    canvas.drawRightString(A4[0] - 2*cm, 1.3*cm, page_num)

    canvas.restoreState()


def generate_riasec_pdf(student_profile, riasec_test, scores_list, careers_data, recommendations_data=None):
    """
    Génère un PDF avec les résultats du test RIASEC

    Args:
        student_profile: Profil de l'étudiant
        riasec_test: Résultats du test RIASEC
        scores_list: Liste des scores par dimension
        careers_data: Données des carrières recommandées
        recommendations_data: Liste des programmes recommandés (optionnel)

    Returns:
        BytesIO: Buffer contenant le PDF généré
    """
    buffer = BytesIO()

    # Créer le document PDF avec en-têtes et pieds de page
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=2*cm,
        leftMargin=2*cm,
        topMargin=2.5*cm,
        bottomMargin=2.5*cm
    )

    # Styles
    styles = getSampleStyleSheet()

    # Style pour le titre principal
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=26,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=30,
        alignment=TA_CENTER,
        fontName='Helvetica-Bold'
    )

    # Style pour les sous-titres de section
    section_title_style = ParagraphStyle(
        'SectionTitle',
        parent=styles['Heading2'],
        fontSize=16,
        textColor=colors.HexColor('#1e40af'),
        spaceAfter=12,
        spaceBefore=15,
        fontName='Helvetica-Bold'
    )

    # Style pour le texte normal
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=11,
        spaceAfter=6
    )

    # Contenu du PDF
    elements = []

    # ===== PAGE DE COUVERTURE =====
    elements.append(Spacer(1, 3*cm))

    # Titre principal
    elements.append(Paragraph("ORIENTCAM", ParagraphStyle(
        'MainTitle',
        parent=title_style,
        fontSize=32,
        textColor=colors.HexColor('#059669')
    )))
    elements.append(Paragraph("Plateforme d'Orientation Académique", ParagraphStyle(
        'Subtitle',
        parent=normal_style,
        fontSize=14,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#6b7280')
    )))
    elements.append(Spacer(1, 2*cm))

    # Titre du rapport
    elements.append(Paragraph("RÉSULTATS DU TEST RIASEC", title_style))
    elements.append(Spacer(1, 1.5*cm))

    # Informations de l'étudiant
    full_name = f"{student_profile.last_name} {student_profile.first_name}".title()
    student_info = [
        ['Étudiant:', full_name],
        ['Date du test:', datetime.fromisoformat(riasec_test.created_at.isoformat()).strftime('%d/%m/%Y')],
        ['Code Holland:', riasec_test.holland_code]
    ]

    student_table = Table(student_info, colWidths=[5*cm, 11*cm])
    student_table.setStyle(TableStyle([
        # Fonds
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#3b82f6')),
        ('BACKGROUND', (1, 0), (1, -1), colors.HexColor('#eff6ff')),
        # Texte
        ('TEXTCOLOR', (0, 0), (0, -1), colors.white),
        ('TEXTCOLOR', (1, 0), (1, -1), colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 13),
        # Alignement
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        # Espacement
        ('TOPPADDING', (0, 0), (-1, -1), 12),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('LEFTPADDING', (0, 0), (-1, -1), 12),
        ('RIGHTPADDING', (0, 0), (-1, -1), 12),
        # Bordures
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#3b82f6')),
    ]))
    elements.append(student_table)

    elements.append(PageBreak())

    # ===== INFORMATIONS DU PROFIL =====
    elements.append(Paragraph("1. INFORMATIONS DU PROFIL", section_title_style))
    elements.append(Spacer(1, 0.5*cm))

    profile_name = f"{student_profile.last_name} {student_profile.first_name}".title()
    profile_data = [
        ['Nom complet:', profile_name],
        ['Email:', student_profile.user.email if student_profile.user else 'N/A'],
        ['Téléphone:', student_profile.phone or 'Non renseigné'],
        ['Date du test:', datetime.fromisoformat(riasec_test.created_at.isoformat()).strftime('%d/%m/%Y à %H:%M')],
    ]

    if student_profile.user_type == 'new_bachelor':
        if student_profile.bac_series:
            profile_data.append(['Série du Bac:', student_profile.bac_series])
        if student_profile.current_education_level:
            profile_data.append(['Niveau actuel:', student_profile.current_education_level])
    elif student_profile.user_type == 'university_student':
        if student_profile.current_university:
            profile_data.append(['Université:', student_profile.current_university])
        if student_profile.current_program:
            profile_data.append(['Programme actuel:', student_profile.current_program])

    profile_table = Table(profile_data, colWidths=[5.5*cm, 10.5*cm])
    profile_table.setStyle(TableStyle([
        # Fonds
        ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#f3f4f6')),
        ('BACKGROUND', (1, 0), (1, -1), colors.white),
        # Texte
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
        ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 12),
        # Alignement
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        # Espacement
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        # Bordures
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#9ca3af')),
    ]))
    elements.append(profile_table)
    elements.append(Spacer(1, 1*cm))

    # Code Holland
    elements.append(Paragraph("2. VOTRE CODE HOLLAND", section_title_style))
    elements.append(Spacer(1, 0.3*cm))
    elements.append(Paragraph(
        f"<font size='28' color='#1e40af'><b>{riasec_test.holland_code}</b></font>",
        ParagraphStyle('HollandCode', parent=normal_style, alignment=TA_CENTER, spaceAfter=10)
    ))
    elements.append(Paragraph(
        "Ce code représente vos trois dimensions dominantes de personnalité professionnelle.",
        ParagraphStyle('HollandDesc', parent=normal_style, fontSize=11, alignment=TA_CENTER, textColor=colors.HexColor('#6b7280'))
    ))
    elements.append(Spacer(1, 1*cm))

    # Scores par dimension
    elements.append(PageBreak())
    elements.append(Paragraph("3. SCORES PAR DIMENSION", section_title_style))
    elements.append(Spacer(1, 0.5*cm))

    scores_data = [['Dimension', 'Score', '%']]
    for score in scores_list:
        scores_data.append([
            f"{score['dimension_code']} - {score['dimension_name']}",
            str(score['score']),
            f"{score['percentage']}%"
        ])

    scores_table = Table(scores_data, colWidths=[9*cm, 3.5*cm, 3.5*cm])
    scores_table.setStyle(TableStyle([
        # Fonds (en premier pour ne pas couvrir le texte)
        ('ROWBACKGROUNDS', (0, 0), (-1, 0), [colors.HexColor('#3b82f6')]),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#f9fafb')]),
        # Texte en-tête
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.white),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 13),
        # Texte données
        ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
        ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 1), (-1, -1), 12),
        # Alignement
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        # Espacement
        ('TOPPADDING', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 10),
        ('LEFTPADDING', (0, 0), (-1, -1), 10),
        ('RIGHTPADDING', (0, 0), (-1, -1), 10),
        # Bordures simples
        ('GRID', (0, 0), (-1, -1), 1, colors.HexColor('#3b82f6')),
    ]))
    elements.append(scores_table)
    elements.append(PageBreak())

    # Carrières recommandées
    elements.append(Paragraph("4. CARRIÈRES RECOMMANDÉES", section_title_style))
    elements.append(Spacer(1, 0.5*cm))

    for career_data in careers_data:
        if not career_data.get('dimension'):
            continue

        dimension = career_data['dimension']

        elements.append(Paragraph(
            f"<b>{dimension['code']} - {dimension['name']}</b>",
            ParagraphStyle('CareerDim', parent=normal_style, fontSize=13, textColor=colors.HexColor('#1e40af'), fontName='Helvetica-Bold')
        ))

        if dimension.get('description'):
            elements.append(Paragraph(
                dimension['description'],
                ParagraphStyle('CareerDesc', parent=normal_style, fontSize=11, leftIndent=15)
            ))

        if career_data.get('careers'):
            careers_list = ", ".join(career_data['careers'][:10])
            elements.append(Paragraph(
                f"<i>Exemples de métiers:</i> {careers_list}",
                ParagraphStyle('CareerList', parent=normal_style, fontSize=11, leftIndent=15, spaceBefore=5)
            ))

        elements.append(Spacer(1, 0.5*cm))

    # Programmes Recommandés
    if recommendations_data and len(recommendations_data) > 0:
        elements.append(PageBreak())
        elements.append(Paragraph("5. PROGRAMMES ACADÉMIQUES RECOMMANDÉS", section_title_style))
        elements.append(Spacer(1, 0.5*cm))

        for idx, rec in enumerate(recommendations_data):
            # En-tête de recommandation
            elements.append(Paragraph(
                f"<b>Recommandation #{idx + 1} - Score: {rec['score']}%</b>",
                ParagraphStyle('RecHeader', parent=normal_style, fontSize=12, textColor=colors.HexColor('#059669'), fontName='Helvetica-Bold')
            ))
            elements.append(Paragraph(
                f"<b>{rec['university']}</b>",
                ParagraphStyle('RecUniv', parent=normal_style, fontSize=13, textColor=colors.HexColor('#1e40af'), fontName='Helvetica-Bold')
            ))

            # Si c'est une Licence avec un Master
            if rec['level'] == 'Licence' and rec.get('master_program'):
                elements.append(Paragraph(
                    f"<b>LICENCE (Bac+{rec['duration_years']})</b>",
                    ParagraphStyle('LicTitle', parent=normal_style, fontSize=12, textColor=colors.HexColor('#2563eb'), fontName='Helvetica-Bold', leftIndent=10)
                ))
                elements.append(Paragraph(
                    f"{rec['program_name']}<br/><i>{rec['department']}</i>",
                    ParagraphStyle('LicText', parent=normal_style, fontSize=11, leftIndent=10)
                ))

                elements.append(Spacer(1, 0.2*cm))
                elements.append(Paragraph("↓", ParagraphStyle('Arrow', parent=normal_style, fontSize=16, alignment=TA_CENTER, textColor=colors.HexColor('#4f46e5'))))
                elements.append(Spacer(1, 0.2*cm))

                master = rec['master_program']
                elements.append(Paragraph(
                    f"<b>MASTER (Bac+{rec['duration_years'] + master['duration_years']})</b>",
                    ParagraphStyle('MastTitle', parent=normal_style, fontSize=12, textColor=colors.HexColor('#4f46e5'), fontName='Helvetica-Bold', leftIndent=10)
                ))
                elements.append(Paragraph(
                    f"{master['name']}<br/><i>{master['department']}</i>",
                    ParagraphStyle('MastText', parent=normal_style, fontSize=11, leftIndent=10)
                ))
            else:
                # Programme simple
                elements.append(Paragraph(
                    f"<b>{rec['level'].upper()} (Bac+{rec['duration_years']})</b>",
                    ParagraphStyle('ProgTitle', parent=normal_style, fontSize=12, textColor=colors.HexColor('#374151'), fontName='Helvetica-Bold', leftIndent=10)
                ))
                elements.append(Paragraph(
                    f"{rec['program_name']}<br/><i>{rec['department']}</i>",
                    ParagraphStyle('ProgText', parent=normal_style, fontSize=11, leftIndent=10)
                ))

            elements.append(Spacer(1, 0.6*cm))

    # Pied de page final
    elements.append(Spacer(1, 2*cm))
    elements.append(Paragraph(
        "OrientCam - Plateforme d'Orientation Académique du Cameroun",
        ParagraphStyle('Footer', parent=normal_style, fontSize=9, textColor=colors.grey, alignment=TA_CENTER)
    ))
    elements.append(Paragraph(
        f"Document généré le {datetime.now().strftime('%d/%m/%Y à %H:%M')}",
        ParagraphStyle('FooterDate', parent=normal_style, fontSize=8, textColor=colors.grey, alignment=TA_CENTER)
    ))

    # Construire le PDF avec en-têtes et pieds de page
    doc.build(elements, onFirstPage=add_page_number, onLaterPages=add_page_number)

    # Récupérer le contenu du buffer
    buffer.seek(0)
    return buffer

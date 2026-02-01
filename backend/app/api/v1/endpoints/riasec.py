"""
RIASEC test endpoints
"""
from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from datetime import datetime

from app.core.database import get_db
from app.core.deps import get_current_student
from app.models.user import User
from app.models.student_profile import StudentProfile
from app.models.riasec_test import RiasecTest, RiasecDimension, RiasecQuestion, RiasecTestDraft
from app.models.recommendation import Recommendation
from app.models.program import Program
from app.schemas.riasec import (
    RiasecTestQuestionsResponse, RiasecDimensionResponse, RiasecQuestionResponse,
    RiasecSubmit, RiasecResultResponse, RiasecScores, RiasecInterpretation,
    RiasecHistoryItem, RiasecCareerMatch, RiasecDraftSave, RiasecDraftResponse
)
from app.utils.pdf_generator import generate_riasec_pdf

router = APIRouter(prefix="/riasec", tags=["RIASEC Test"])


# Career mappings for each RIASEC dimension
RIASEC_CAREERS = {
    "R": {
        "name": "Réaliste",
        "description": "Personnes qui préfèrent les activités concrètes, techniques et manuelles. Elles aiment travailler avec des outils, des machines et dans des environnements structurés.",
        "careers": [
            "Ingénieur civil",
            "Technicien informatique",
            "Électricien",
            "Mécanicien",
            "Agriculteur",
            "Architecte",
            "Pilote",
            "Géomètre"
        ]
    },
    "I": {
        "name": "Investigateur",
        "description": "Personnes curieuses qui aiment observer, analyser, résoudre des problèmes et comprendre les phénomènes. Elles préfèrent la réflexion à l'action.",
        "careers": [
            "Chercheur scientifique",
            "Médecin",
            "Pharmacien",
            "Biologiste",
            "Mathématicien",
            "Statisticien",
            "Vétérinaire",
            "Chimiste"
        ]
    },
    "A": {
        "name": "Artistique",
        "description": "Personnes créatives qui apprécient l'expression artistique, l'originalité et les environnements non structurés. Elles valorisent l'esthétique et l'innovation.",
        "careers": [
            "Graphiste",
            "Architecte d'intérieur",
            "Musicien",
            "Journaliste",
            "Designer",
            "Photographe",
            "Écrivain",
            "Artiste"
        ]
    },
    "S": {
        "name": "Social",
        "description": "Personnes bienveillantes qui aiment aider, enseigner et prendre soin des autres. Elles recherchent l'interaction humaine et le travail d'équipe.",
        "careers": [
            "Enseignant",
            "Infirmier",
            "Psychologue",
            "Travailleur social",
            "Conseiller d'orientation",
            "Éducateur",
            "Sage-femme",
            "Assistant social"
        ]
    },
    "E": {
        "name": "Entreprenant",
        "description": "Personnes ambitieuses qui aiment diriger, persuader et prendre des initiatives. Elles recherchent le pouvoir, le statut et les défis.",
        "careers": [
            "Manager",
            "Chef d'entreprise",
            "Commercial",
            "Avocat",
            "Responsable marketing",
            "Directeur des ventes",
            "Consultant",
            "Entrepreneur"
        ]
    },
    "C": {
        "name": "Conventionnel",
        "description": "Personnes organisées qui préfèrent l'ordre, la précision et le respect des procédures. Elles excellent dans les tâches structurées et détaillées.",
        "careers": [
            "Comptable",
            "Secrétaire",
            "Gestionnaire de données",
            "Auditeur",
            "Banquier",
            "Administrateur",
            "Bibliothécaire",
            "Analyste financier"
        ]
    }
}


def calculate_riasec_scores(answers: Dict[int, int], db: Session) -> Dict[str, int]:
    """
    Calculate RIASEC scores from answers

    Returns dict with dimension codes as keys and scores (0-100) as values
    """
    # Get all questions with their dimensions
    questions = db.query(RiasecQuestion).all()

    # Initialize scores
    dimension_scores = {
        "R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0
    }
    dimension_counts = {
        "R": 0, "I": 0, "A": 0, "S": 0, "E": 0, "C": 0
    }

    # Calculate raw scores for each dimension
    for question in questions:
        answer_value = answers.get(question.question_number, 0)

        # Get dimension code
        dimension = db.query(RiasecDimension).filter(
            RiasecDimension.id == question.dimension_id
        ).first()

        if dimension:
            # Handle reverse scoring if needed
            if question.reverse_scored:
                answer_value = 6 - answer_value  # Reverse scale (1->5, 5->1)

            dimension_scores[dimension.code] += answer_value
            dimension_counts[dimension.code] += 1

    # Convert to percentage (0-100)
    # Each dimension has 5 questions, max score per question is 5
    # Max total = 5 * 5 = 25, so percentage = (score / 25) * 100
    final_scores = {}
    for code in dimension_scores:
        if dimension_counts[code] > 0:
            max_score = dimension_counts[code] * 5
            final_scores[code] = int((dimension_scores[code] / max_score) * 100)
        else:
            final_scores[code] = 0

    return final_scores


def get_holland_code(scores: Dict[str, int]) -> str:
    """
    Get Holland Code (top 3 dimensions) from scores

    Returns 3-letter code (e.g., "IAS")
    """
    # Sort dimensions by score (descending)
    sorted_dims = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    # Take top 3
    holland_code = "".join([dim[0] for dim in sorted_dims[:3]])

    return holland_code


@router.get("/questions", response_model=RiasecTestQuestionsResponse)
async def get_test_questions(db: Session = Depends(get_db)):
    """
    Get RIASEC test questions

    Returns all 30 questions with dimensions and answer scale.
    No authentication required - test is public.
    """
    # Get all dimensions
    dimensions = db.query(RiasecDimension).all()

    # Get all questions ordered by number
    questions = db.query(RiasecQuestion).order_by(RiasecQuestion.question_number).all()

    return RiasecTestQuestionsResponse(
        dimensions=[RiasecDimensionResponse.model_validate(d) for d in dimensions],
        questions=[RiasecQuestionResponse.model_validate(q) for q in questions]
    )


@router.post("/submit", response_model=RiasecResultResponse, status_code=status.HTTP_201_CREATED)
async def submit_test(
    test_data: RiasecSubmit,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Submit RIASEC test answers

    Requires exactly 30 answers (one for each question).
    Calculates scores, Holland Code, and provides interpretations.

    - **answers**: List of 30 answers with question_number (1-30) and answer (1-5)
    - **duration_seconds**: Optional test duration in seconds
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Convert answers to dict
    answers_dict = {answer.question_number: answer.answer for answer in test_data.answers}

    # Calculate scores
    scores = calculate_riasec_scores(answers_dict, db)

    # Get Holland Code
    holland_code = get_holland_code(scores)

    # Create test record
    riasec_test = RiasecTest(
        student_id=profile.id,
        realistic_score=scores["R"],
        investigative_score=scores["I"],
        artistic_score=scores["A"],
        social_score=scores["S"],
        enterprising_score=scores["E"],
        conventional_score=scores["C"],
        holland_code=holland_code,
        raw_answers=answers_dict,
        test_version="1.0",
        duration_seconds=test_data.duration_seconds
    )

    db.add(riasec_test)

    # Delete draft if exists (test completed successfully)
    draft = db.query(RiasecTestDraft).filter(
        RiasecTestDraft.student_id == profile.id
    ).first()
    if draft:
        db.delete(draft)

    db.commit()
    db.refresh(riasec_test)

    # Get dimensions for interpretations
    dimensions = db.query(RiasecDimension).all()
    dimensions_map = {d.code: d for d in dimensions}

    # Create interpretations for top 3 dimensions
    interpretations = []
    for code in holland_code:
        dimension = dimensions_map.get(code)
        if dimension and code in RIASEC_CAREERS:
            career_info = RIASEC_CAREERS[code]
            interpretations.append(RiasecInterpretation(
                dimension_code=code,
                dimension_name=dimension.name,
                score=scores[code],
                description=career_info["description"],
                typical_careers=career_info["careers"][:5],  # Top 5 careers
                color=dimension.color
            ))

    return RiasecResultResponse(
        test_id=riasec_test.id,
        scores=RiasecScores(
            realistic=scores["R"],
            investigative=scores["I"],
            artistic=scores["A"],
            social=scores["S"],
            enterprising=scores["E"],
            conventional=scores["C"]
        ),
        holland_code=holland_code,
        interpretations=interpretations,
        created_at=riasec_test.created_at.isoformat()
    )


@router.get("/results/latest", response_model=RiasecResultResponse)
async def get_latest_result(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get latest RIASEC test result for current student

    Returns the most recent test result with interpretations
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get latest test
    riasec_test = db.query(RiasecTest).filter(
        RiasecTest.student_id == profile.id
    ).order_by(RiasecTest.created_at.desc()).first()

    if not riasec_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No RIASEC test found. Please take the test first."
        )

    # Get dimensions
    dimensions = db.query(RiasecDimension).all()
    dimensions_map = {d.code: d for d in dimensions}

    # Create interpretations
    interpretations = []
    for code in riasec_test.holland_code:
        dimension = dimensions_map.get(code)
        if dimension and code in RIASEC_CAREERS:
            career_info = RIASEC_CAREERS[code]
            score = getattr(riasec_test, f"{dimension.name.lower()}_score", 0)
            # Map dimension names to score attributes
            score_map = {
                "Réaliste": riasec_test.realistic_score,
                "Investigateur": riasec_test.investigative_score,
                "Artistique": riasec_test.artistic_score,
                "Social": riasec_test.social_score,
                "Entreprenant": riasec_test.enterprising_score,
                "Conventionnel": riasec_test.conventional_score
            }
            score = score_map.get(dimension.name, 0)

            interpretations.append(RiasecInterpretation(
                dimension_code=code,
                dimension_name=dimension.name,
                score=score,
                description=career_info["description"],
                typical_careers=career_info["careers"][:5],
                color=dimension.color
            ))

    return RiasecResultResponse(
        test_id=riasec_test.id,
        scores=RiasecScores(
            realistic=riasec_test.realistic_score,
            investigative=riasec_test.investigative_score,
            artistic=riasec_test.artistic_score,
            social=riasec_test.social_score,
            enterprising=riasec_test.enterprising_score,
            conventional=riasec_test.conventional_score
        ),
        holland_code=riasec_test.holland_code,
        interpretations=interpretations,
        created_at=riasec_test.created_at.isoformat()
    )


@router.get("/results/latest/download-pdf")
async def download_latest_result_pdf(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Télécharger les résultats du test RIASEC en PDF

    Génère un PDF avec les informations du profil de l'étudiant et les résultats du test
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get latest test
    riasec_test = db.query(RiasecTest).filter(
        RiasecTest.student_id == profile.id
    ).order_by(RiasecTest.created_at.desc()).first()

    if not riasec_test:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No RIASEC test found. Please take the test first."
        )

    # Préparer les scores sous forme de liste
    scores_list = [
        {'dimension_code': 'R', 'dimension_name': 'Réaliste', 'score': riasec_test.realistic_score, 'percentage': riasec_test.realistic_score},
        {'dimension_code': 'I', 'dimension_name': 'Investigateur', 'score': riasec_test.investigative_score, 'percentage': riasec_test.investigative_score},
        {'dimension_code': 'A', 'dimension_name': 'Artistique', 'score': riasec_test.artistic_score, 'percentage': riasec_test.artistic_score},
        {'dimension_code': 'S', 'dimension_name': 'Social', 'score': riasec_test.social_score, 'percentage': riasec_test.social_score},
        {'dimension_code': 'E', 'dimension_name': 'Entreprenant', 'score': riasec_test.enterprising_score, 'percentage': riasec_test.enterprising_score},
        {'dimension_code': 'C', 'dimension_name': 'Conventionnel', 'score': riasec_test.conventional_score, 'percentage': riasec_test.conventional_score},
    ]
    # Trier par score décroissant
    scores_list.sort(key=lambda x: x['score'], reverse=True)

    # Préparer les données de carrières
    dimensions = db.query(RiasecDimension).all()
    dimensions_map = {d.code: d for d in dimensions}

    careers_data = []
    for code in riasec_test.holland_code:
        if code in RIASEC_CAREERS:
            dimension = dimensions_map.get(code)
            careers_data.append({
                'dimension': {
                    'code': code,
                    'name': dimension.name if dimension else code,
                    'description': RIASEC_CAREERS[code]['description']
                },
                'careers': RIASEC_CAREERS[code]['careers']
            })

    # Charger les recommandations (score >= 50%)
    recommendations = db.query(Recommendation).filter(
        Recommendation.student_id == profile.id,
        Recommendation.total_score >= 50
    ).order_by(Recommendation.total_score.desc()).all()

    # Préparer les données des recommandations pour le PDF
    recommendations_data = []
    for rec in recommendations:
        program = db.query(Program).filter(Program.id == rec.program_id).first()
        if program:
            rec_data = {
                'score': rec.total_score,
                'program_name': program.name,
                'department': program.department,
                'level': program.level,
                'university': program.university,
                'duration_years': program.duration_years,
                'master_program': None
            }

            # Si c'est une Licence avec un Master associé, récupérer les infos du Master
            if program.level == 'Licence' and program.master_program_id:
                master = db.query(Program).filter(Program.id == program.master_program_id).first()
                if master:
                    rec_data['master_program'] = {
                        'name': master.name,
                        'department': master.department,
                        'duration_years': master.duration_years
                    }

            recommendations_data.append(rec_data)

    # Générer le PDF
    pdf_buffer = generate_riasec_pdf(profile, riasec_test, scores_list, careers_data, recommendations_data)

    # Nom du fichier
    filename = f"RIASEC_{profile.first_name}_{profile.last_name}_{datetime.now().strftime('%Y%m%d')}.pdf"

    # Retourner le PDF
    return StreamingResponse(
        pdf_buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f"attachment; filename={filename}"
        }
    )


@router.get("/results/history", response_model=List[RiasecHistoryItem])
async def get_test_history(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get RIASEC test history for current student

    Returns all past tests ordered by date (most recent first)
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get all tests
    tests = db.query(RiasecTest).filter(
        RiasecTest.student_id == profile.id
    ).order_by(RiasecTest.created_at.desc()).all()

    return [RiasecHistoryItem.model_validate(test) for test in tests]


@router.get("/careers/{holland_code}", response_model=RiasecCareerMatch)
async def get_career_matches(holland_code: str, db: Session = Depends(get_db)):
    """
    Get career matches for a Holland Code

    - **holland_code**: 1-3 letter code (e.g., "I", "IA", "IAS")

    Returns matching and partially matching careers based on the code.
    """
    # Validate holland_code
    holland_code = holland_code.upper()
    if not all(c in "RIASEC" for c in holland_code):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Holland Code. Must contain only letters R, I, A, S, E, C"
        )

    if len(holland_code) < 1 or len(holland_code) > 3:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Holland Code must be 1-3 characters"
        )

    # Get primary dimension
    primary = holland_code[0] if holland_code else ""

    # Get matching careers
    matching_careers = []
    partially_matching_careers = []
    description = ""

    if primary in RIASEC_CAREERS:
        career_info = RIASEC_CAREERS[primary]
        matching_careers = career_info["careers"]
        description = career_info["description"]

        # Add partially matching from secondary dimensions
        if len(holland_code) > 1:
            for code in holland_code[1:]:
                if code in RIASEC_CAREERS:
                    partially_matching_careers.extend(RIASEC_CAREERS[code]["careers"][:3])

    return RiasecCareerMatch(
        holland_code=holland_code,
        matching_careers=matching_careers,
        partially_matching_careers=partially_matching_careers,
        description=description
    )


@router.post("/draft/save", status_code=status.HTTP_200_OK)
async def save_test_draft(
    draft_data: RiasecDraftSave,
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Save RIASEC test progress (draft)

    Allows students to save their test answers and resume later from any device.
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Check if draft exists
    draft = db.query(RiasecTestDraft).filter(
        RiasecTestDraft.student_id == profile.id
    ).first()

    if draft:
        # Update existing draft
        draft.answers = draft_data.answers
        draft.current_question_index = draft_data.current_question_index
        draft.updated_at = datetime.utcnow()
    else:
        # Create new draft
        draft = RiasecTestDraft(
            student_id=profile.id,
            answers=draft_data.answers,
            current_question_index=draft_data.current_question_index
        )
        db.add(draft)

    db.commit()

    return {"message": "Progrès sauvegardé avec succès", "answers_count": len(draft_data.answers)}


@router.get("/draft", response_model=RiasecDraftResponse)
async def get_test_draft(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Get saved RIASEC test progress (draft)

    Returns the student's saved test answers if they exist.
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Get draft
    draft = db.query(RiasecTestDraft).filter(
        RiasecTestDraft.student_id == profile.id
    ).first()

    if not draft:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No saved progress found"
        )

    return RiasecDraftResponse(
        answers=draft.answers,
        current_question_index=draft.current_question_index,
        updated_at=draft.updated_at.isoformat()
    )


@router.delete("/draft", status_code=status.HTTP_200_OK)
async def delete_test_draft(
    current_user: User = Depends(get_current_student),
    db: Session = Depends(get_db)
):
    """
    Delete saved RIASEC test progress (draft)

    Clears the student's saved test answers.
    """
    # Get student profile
    profile = db.query(StudentProfile).filter(
        StudentProfile.user_id == current_user.id
    ).first()

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Profile not found"
        )

    # Delete draft
    draft = db.query(RiasecTestDraft).filter(
        RiasecTestDraft.student_id == profile.id
    ).first()

    if draft:
        db.delete(draft)
        db.commit()

    return {"message": "Progrès supprimé avec succès"}

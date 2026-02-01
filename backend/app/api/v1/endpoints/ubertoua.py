"""
UBertoua data endpoints
"""
from typing import List, Dict, Any
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.data.ubertoua_data import (
    get_establishments,
    get_departments,
    get_programs,
    get_ue_for_program
)

router = APIRouter(prefix="/ubertoua", tags=["UBertoua Data"])


class EstablishmentResponse(BaseModel):
    id: str
    name: str


class DepartmentResponse(BaseModel):
    id: str
    name: str


class ProgramResponse(BaseModel):
    level: str
    name: str
    ue: List[str]


@router.get("/establishments", response_model=List[EstablishmentResponse])
async def list_establishments():
    """
    Get list of all establishments at University of Bertoua

    Returns list of establishments (faculties, schools, institutes)
    """
    establishments = get_establishments()
    return establishments


@router.get("/establishments/{establishment_id}/departments", response_model=List[DepartmentResponse])
async def list_departments(establishment_id: str):
    """
    Get departments for a specific establishment

    - **establishment_id**: ID of the establishment (e.g., "FS", "FSEG")
    """
    departments = get_departments(establishment_id)

    if not departments:
        raise HTTPException(
            status_code=404,
            detail=f"No departments found for establishment: {establishment_id}"
        )

    return departments


@router.get("/establishments/{establishment_id}/departments/{department_id}/programs")
async def list_programs(establishment_id: str, department_id: str, level: str):
    """
    Get programs/UE for a specific department and level

    - **establishment_id**: ID of the establishment (e.g., "FS")
    - **department_id**: ID of the department (e.g., "INFORMATIQUE")
    - **level**: Academic level (e.g., "Licence 1", "Licence 2", "Licence 3", "Master 1", "Master 2")

    Returns program information including UE (Unités d'Enseignement)
    """
    programs = get_programs(establishment_id, department_id, level)

    if not programs:
        raise HTTPException(
            status_code=404,
            detail=f"No programs found for {establishment_id}/{department_id} at level {level}"
        )

    return programs


@router.get("/establishments/{establishment_id}/departments/{department_id}/ue")
async def list_ue(establishment_id: str, department_id: str, level: str):
    """
    Get UE (Unités d'Enseignement) for a specific department and level

    - **establishment_id**: ID of the establishment (e.g., "FS")
    - **department_id**: ID of the department (e.g., "INFORMATIQUE")
    - **level**: Academic level (e.g., "Licence 1")

    Returns list of UE names
    """
    ue_list = get_ue_for_program(establishment_id, department_id, level)

    if not ue_list:
        raise HTTPException(
            status_code=404,
            detail=f"No UE found for {establishment_id}/{department_id} at level {level}"
        )

    return {"ue": ue_list}

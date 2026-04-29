"""Pydantic schemas for request/response validation."""
from datetime import date, datetime
from typing import Optional, Literal
from pydantic import BaseModel, EmailStr, Field


# ---------- Auth ----------
class LoginResponse(BaseModel):
    access_token: str
    token_type:   str = "bearer"
    role:         str
    name:         str


# ---------- Clients ----------
class ClientCreate(BaseModel):
    full_name:  str
    country_id: int
    company_id: Optional[int] = None
    agent_name: Optional[str] = None
    position:   Optional[str] = None


class ClientCard(BaseModel):
    id: int
    ref_no: str
    name: str
    company: Optional[str]
    agent:   Optional[str]
    stage:   str
    progress: int
    is_urgent: bool
    updated_at: Optional[str]


# ---------- Documents ----------
class DocumentOut(BaseModel):
    id: int
    client_id: int
    type: str
    status: str
    issue_date:  Optional[date] = None
    expiry_date: Optional[date] = None


# ---------- CV ----------
class CVUpdate(BaseModel):
    marital_status:  Literal["single", "married"]
    spouse_name:     Optional[str] = None
    religion:        Optional[str] = None
    permanent_address: Optional[str] = None
    position_applied:  Optional[str] = None
    years_experience:  Optional[int] = None
    languages:       Optional[str] = None


# ---------- Users ----------
class UserCreate(BaseModel):
    full_name: str
    email:     EmailStr
    password:  str = Field(min_length=8)
    role:      Literal["super_admin", "admin", "sub_admin", "viewer"]


class AssignClients(BaseModel):
    client_ids: list[int]


# ---------- Alerts / Warnings ----------
class WarningResponse(BaseModel):
    client_id: int
    ref_no:    str
    name:      str
    kind:      str
    severity:  Literal["info", "warn", "danger"]
    message:   str

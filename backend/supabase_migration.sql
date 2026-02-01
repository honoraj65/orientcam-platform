-- ============================================================================
-- OrientCam Supabase Migration Script
-- ============================================================================
-- This script creates all tables with proper constraints, indexes, and RLS policies
-- Run this in your Supabase SQL Editor

-- Enable UUID extension (usually already enabled in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- CORE TABLES
-- ============================================================================

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin', 'counselor')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Create indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

-- Programs table
CREATE TABLE IF NOT EXISTS public.programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(200) NOT NULL,
    level VARCHAR(20) NOT NULL CHECK (level IN ('Licence', 'Master', 'Doctorat', 'BTS', 'DUT')),
    department VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    objectives TEXT,
    career_prospects TEXT,
    required_bac_series JSONB NOT NULL DEFAULT '[]'::jsonb,
    min_bac_grade INTEGER CHECK (min_bac_grade >= 0 AND min_bac_grade <= 20),
    required_subjects JSONB DEFAULT '[]'::jsonb,
    riasec_match VARCHAR(3) NOT NULL,
    registration_fee INTEGER NOT NULL DEFAULT 0,
    annual_tuition INTEGER NOT NULL DEFAULT 0,
    total_cost_3years INTEGER NOT NULL DEFAULT 0,
    employment_rate INTEGER CHECK (employment_rate >= 0 AND employment_rate <= 100),
    average_starting_salary INTEGER,
    capacity INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programs_code ON public.programs(code);
CREATE INDEX IF NOT EXISTS idx_programs_level ON public.programs(level);
CREATE INDEX IF NOT EXISTS idx_programs_is_active ON public.programs(is_active);

-- RIASEC Dimensions table
CREATE TABLE IF NOT EXISTS public.riasec_dimensions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code CHAR(1) NOT NULL UNIQUE CHECK (code IN ('R', 'I', 'A', 'S', 'E', 'C')),
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    color VARCHAR(7) NOT NULL
);

-- RIASEC Questions table
CREATE TABLE IF NOT EXISTS public.riasec_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dimension_id UUID NOT NULL REFERENCES public.riasec_dimensions(id) ON DELETE CASCADE,
    question_number INTEGER NOT NULL UNIQUE,
    text TEXT NOT NULL,
    reverse_scored INTEGER NOT NULL DEFAULT 0 CHECK (reverse_scored IN (0, 1))
);

CREATE INDEX IF NOT EXISTS idx_riasec_questions_dimension ON public.riasec_questions(dimension_id);

-- ============================================================================
-- STUDENT-RELATED TABLES
-- ============================================================================

-- Student Profiles table
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    gender VARCHAR(10) CHECK (gender IN ('M', 'F', 'Autre')),
    date_of_birth DATE,
    city VARCHAR(100),
    region VARCHAR(100),
    current_education_level VARCHAR(50),
    bac_series VARCHAR(20),
    bac_year INTEGER,
    bac_grade INTEGER CHECK (bac_grade >= 0 AND bac_grade <= 20),
    max_annual_budget INTEGER,
    financial_aid_eligible INTEGER DEFAULT 0 CHECK (financial_aid_eligible IN (0, 1)),
    completion_percentage INTEGER DEFAULT 10 CHECK (completion_percentage >= 0 AND completion_percentage <= 100),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);

-- Academic Grades table
CREATE TABLE IF NOT EXISTS public.academic_grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    grade DECIMAL(4,2) NOT NULL CHECK (grade >= 0 AND grade <= 20),
    coefficient INTEGER NOT NULL CHECK (coefficient >= 1 AND coefficient <= 10),
    academic_year VARCHAR(9) NOT NULL,
    term VARCHAR(20) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_academic_grades_student ON public.academic_grades(student_id);

-- Professional Values table
CREATE TABLE IF NOT EXISTS public.professional_values (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL UNIQUE REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    autonomy INTEGER NOT NULL DEFAULT 3 CHECK (autonomy >= 1 AND autonomy <= 5),
    creativity INTEGER NOT NULL DEFAULT 3 CHECK (creativity >= 1 AND creativity <= 5),
    helping_others INTEGER NOT NULL DEFAULT 3 CHECK (helping_others >= 1 AND helping_others <= 5),
    job_security INTEGER NOT NULL DEFAULT 3 CHECK (job_security >= 1 AND job_security <= 5),
    salary INTEGER NOT NULL DEFAULT 3 CHECK (salary >= 1 AND salary <= 5),
    work_life_balance INTEGER NOT NULL DEFAULT 3 CHECK (work_life_balance >= 1 AND work_life_balance <= 5),
    prestige INTEGER NOT NULL DEFAULT 3 CHECK (prestige >= 1 AND prestige <= 5),
    variety INTEGER NOT NULL DEFAULT 3 CHECK (variety >= 1 AND variety <= 5),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- RIASEC Tests table
CREATE TABLE IF NOT EXISTS public.riasec_tests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    realistic_score INTEGER NOT NULL CHECK (realistic_score >= 0 AND realistic_score <= 100),
    investigative_score INTEGER NOT NULL CHECK (investigative_score >= 0 AND investigative_score <= 100),
    artistic_score INTEGER NOT NULL CHECK (artistic_score >= 0 AND artistic_score <= 100),
    social_score INTEGER NOT NULL CHECK (social_score >= 0 AND social_score <= 100),
    enterprising_score INTEGER NOT NULL CHECK (enterprising_score >= 0 AND enterprising_score <= 100),
    conventional_score INTEGER NOT NULL CHECK (conventional_score >= 0 AND conventional_score <= 100),
    holland_code VARCHAR(3) NOT NULL,
    raw_answers JSONB NOT NULL,
    test_version VARCHAR(10) NOT NULL DEFAULT '1.0',
    duration_seconds INTEGER,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_riasec_tests_student ON public.riasec_tests(student_id);

-- Recommendations table
CREATE TABLE IF NOT EXISTS public.recommendations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    total_score INTEGER NOT NULL CHECK (total_score >= 0 AND total_score <= 100),
    ranking INTEGER NOT NULL,
    riasec_score INTEGER NOT NULL,
    grades_score INTEGER NOT NULL,
    values_score INTEGER NOT NULL,
    employment_score INTEGER NOT NULL,
    financial_score INTEGER NOT NULL,
    strengths JSONB DEFAULT '[]'::jsonb,
    weaknesses JSONB DEFAULT '[]'::jsonb,
    advice TEXT,
    algorithm_version VARCHAR(10) NOT NULL DEFAULT '1.0',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendations_student ON public.recommendations(student_id);
CREATE INDEX IF NOT EXISTS idx_recommendations_program ON public.recommendations(program_id);

-- Student Favorites table
CREATE TABLE IF NOT EXISTS public.student_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.student_profiles(id) ON DELETE CASCADE,
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
    UNIQUE(student_id, program_id)
);

CREATE INDEX IF NOT EXISTS idx_student_favorites_student ON public.student_favorites(student_id);
CREATE INDEX IF NOT EXISTS idx_student_favorites_program ON public.student_favorites(program_id);

-- ============================================================================
-- SUPPORTING TABLES
-- ============================================================================

-- Program Subjects table
CREATE TABLE IF NOT EXISTS public.program_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    credits INTEGER NOT NULL,
    semester INTEGER NOT NULL,
    is_mandatory BOOLEAN NOT NULL DEFAULT true
);

CREATE INDEX IF NOT EXISTS idx_program_subjects_program ON public.program_subjects(program_id);

-- Testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    student_name VARCHAR(200) NOT NULL,
    graduation_year INTEGER NOT NULL,
    current_position VARCHAR(200),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_program ON public.testimonials(program_id);

-- Notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    notification_type VARCHAR(50) NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON public.notifications(is_read);

-- Activity Logs table
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    description TEXT,
    extra_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_user ON public.activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON public.activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_programs_updated_at BEFORE UPDATE ON public.programs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_student_profiles_updated_at BEFORE UPDATE ON public.student_profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_academic_grades_updated_at BEFORE UPDATE ON public.academic_grades
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_professional_values_updated_at BEFORE UPDATE ON public.professional_values
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- MIGRATION COMPLETE
-- ============================================================================
-- Next step: Run supabase_rls_policies.sql to enable Row Level Security

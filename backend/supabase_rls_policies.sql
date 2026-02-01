-- ============================================================================
-- OrientCam Row Level Security (RLS) Policies
-- ============================================================================
-- This script enables RLS and creates security policies for all tables
-- Run this AFTER supabase_migration.sql

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.programs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riasec_dimensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riasec_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_values ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.riasec_tests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.program_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Users can read their own profile
CREATE POLICY "Users can view own profile"
    ON public.users FOR SELECT
    USING (auth.uid()::text = id::text);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users FOR UPDATE
    USING (auth.uid()::text = id::text);

-- Anyone can insert (for registration)
CREATE POLICY "Anyone can register"
    ON public.users FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- PROGRAMS TABLE POLICIES
-- ============================================================================

-- Everyone can read active programs
CREATE POLICY "Anyone can view active programs"
    ON public.programs FOR SELECT
    USING (is_active = true);

-- Only admins can modify programs
CREATE POLICY "Admins can manage programs"
    ON public.programs FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id::text = auth.uid()::text
            AND users.role = 'admin'
        )
    );

-- ============================================================================
-- RIASEC TABLES POLICIES
-- ============================================================================

-- Everyone can read RIASEC dimensions and questions
CREATE POLICY "Anyone can view RIASEC dimensions"
    ON public.riasec_dimensions FOR SELECT
    USING (true);

CREATE POLICY "Anyone can view RIASEC questions"
    ON public.riasec_questions FOR SELECT
    USING (true);

-- ============================================================================
-- STUDENT PROFILES POLICIES
-- ============================================================================

-- Students can view their own profile
CREATE POLICY "Students can view own profile"
    ON public.student_profiles FOR SELECT
    USING (
        user_id::text = auth.uid()::text
    );

-- Students can create their own profile
CREATE POLICY "Students can create own profile"
    ON public.student_profiles FOR INSERT
    WITH CHECK (user_id::text = auth.uid()::text);

-- Students can update their own profile
CREATE POLICY "Students can update own profile"
    ON public.student_profiles FOR UPDATE
    USING (user_id::text = auth.uid()::text);

-- Admins and counselors can view all profiles
CREATE POLICY "Staff can view all profiles"
    ON public.student_profiles FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id::text = auth.uid()::text
            AND users.role IN ('admin', 'counselor')
        )
    );

-- ============================================================================
-- ACADEMIC GRADES POLICIES
-- ============================================================================

-- Students can view their own grades
CREATE POLICY "Students can view own grades"
    ON public.academic_grades FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = academic_grades.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can create their own grades
CREATE POLICY "Students can create own grades"
    ON public.academic_grades FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = academic_grades.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can update their own grades
CREATE POLICY "Students can update own grades"
    ON public.academic_grades FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = academic_grades.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can delete their own grades
CREATE POLICY "Students can delete own grades"
    ON public.academic_grades FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = academic_grades.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- ============================================================================
-- PROFESSIONAL VALUES POLICIES
-- ============================================================================

-- Students can view their own values
CREATE POLICY "Students can view own values"
    ON public.professional_values FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = professional_values.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can create/update their own values
CREATE POLICY "Students can manage own values"
    ON public.professional_values FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = professional_values.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = professional_values.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- ============================================================================
-- RIASEC TESTS POLICIES
-- ============================================================================

-- Students can view their own tests
CREATE POLICY "Students can view own tests"
    ON public.riasec_tests FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = riasec_tests.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can create their own tests
CREATE POLICY "Students can create own tests"
    ON public.riasec_tests FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = riasec_tests.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- ============================================================================
-- RECOMMENDATIONS POLICIES
-- ============================================================================

-- Students can view their own recommendations
CREATE POLICY "Students can view own recommendations"
    ON public.recommendations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = recommendations.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can create their own recommendations (via algorithm)
CREATE POLICY "Students can create own recommendations"
    ON public.recommendations FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = recommendations.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can delete their own recommendations
CREATE POLICY "Students can delete own recommendations"
    ON public.recommendations FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = recommendations.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- ============================================================================
-- STUDENT FAVORITES POLICIES
-- ============================================================================

-- Students can view their own favorites
CREATE POLICY "Students can view own favorites"
    ON public.student_favorites FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = student_favorites.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- Students can manage their own favorites
CREATE POLICY "Students can manage own favorites"
    ON public.student_favorites FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = student_favorites.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE student_profiles.id = student_favorites.student_id
            AND student_profiles.user_id::text = auth.uid()::text
        )
    );

-- ============================================================================
-- PROGRAM SUBJECTS POLICIES
-- ============================================================================

-- Everyone can read program subjects
CREATE POLICY "Anyone can view program subjects"
    ON public.program_subjects FOR SELECT
    USING (true);

-- ============================================================================
-- TESTIMONIALS POLICIES
-- ============================================================================

-- Everyone can read verified testimonials
CREATE POLICY "Anyone can view verified testimonials"
    ON public.testimonials FOR SELECT
    USING (is_verified = true);

-- Admins can manage all testimonials
CREATE POLICY "Admins can manage testimonials"
    ON public.testimonials FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id::text = auth.uid()::text
            AND users.role = 'admin'
        )
    );

-- ============================================================================
-- NOTIFICATIONS POLICIES
-- ============================================================================

-- Users can view their own notifications
CREATE POLICY "Users can view own notifications"
    ON public.notifications FOR SELECT
    USING (user_id::text = auth.uid()::text);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update own notifications"
    ON public.notifications FOR UPDATE
    USING (user_id::text = auth.uid()::text);

-- System can create notifications for users
CREATE POLICY "System can create notifications"
    ON public.notifications FOR INSERT
    WITH CHECK (true);

-- ============================================================================
-- ACTIVITY LOGS POLICIES
-- ============================================================================

-- Users can view their own activity logs
CREATE POLICY "Users can view own activity logs"
    ON public.activity_logs FOR SELECT
    USING (user_id::text = auth.uid()::text);

-- System can create activity logs
CREATE POLICY "System can create activity logs"
    ON public.activity_logs FOR INSERT
    WITH CHECK (true);

-- Admins can view all activity logs
CREATE POLICY "Admins can view all activity logs"
    ON public.activity_logs FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.users
            WHERE users.id::text = auth.uid()::text
            AND users.role = 'admin'
        )
    );

-- ============================================================================
-- RLS POLICIES COMPLETE
-- ============================================================================
-- All tables are now protected with Row Level Security

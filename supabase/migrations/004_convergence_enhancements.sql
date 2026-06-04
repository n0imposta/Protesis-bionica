-- Enhance convergence_nodes table with Vijay Kumar innovation framework fields
ALTER TABLE public.convergence_nodes 
ADD COLUMN IF NOT EXISTS primary_domain VARCHAR(20) NOT NULL DEFAULT 'healthcare',
ADD COLUMN IF NOT EXISTS secondary_domains TEXT[] NOT NULL DEFAULT '{}',
ADD COLUMN IF NOT EXISTS status VARCHAR(20) NOT NULL DEFAULT 'underReview',
ADD COLUMN IF NOT EXISTS validation_desirability TEXT,
ADD COLUMN IF NOT EXISTS validation_feasibility TEXT,
ADD COLUMN IF NOT EXISTS validation_viability TEXT,
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Create convergence_field_notes table for detailed validation logs
CREATE TABLE IF NOT EXISTS public.convergence_field_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  node_id UUID NOT NULL REFERENCES public.convergence_nodes(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(id),
  note_type VARCHAR(20) NOT NULL CHECK (note_type IN ('field', 'expertValidation', 'teamInsight')),
  title VARCHAR(200) NOT NULL,
  body TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_convergence_nodes_status ON public.convergence_nodes(status);
CREATE INDEX IF NOT EXISTS idx_convergence_nodes_updated_at ON public.convergence_nodes(updated_at DESC);
CREATE INDEX IF NOT EXISTS idx_convergence_field_notes_node ON public.convergence_field_notes(node_id);
CREATE INDEX IF NOT EXISTS idx_convergence_field_notes_created ON public.convergence_field_notes(created_at DESC);

-- Update existing rows to have default values for new columns
UPDATE public.convergence_nodes 
SET 
    primary_domain = COALESCE(primary_domain, 'healthcare'),
    secondary_domains = COALESCE(secondary_domains, '{}'),
    status = COALESCE(status, 'underReview'),
    updated_at = COALESCE(updated_at, NOW())
WHERE primary_domain IS NULL 
   OR secondary_domains IS NULL 
   OR status IS NULL 
   OR updated_at IS NULL;
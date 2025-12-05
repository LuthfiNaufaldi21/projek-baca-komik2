-- Migration: Fix ReadHistory to only store last chapter per comic
-- Run this on your Supabase database

-- Step 1: Drop old constraint
ALTER TABLE public.read_history DROP CONSTRAINT IF EXISTS unique_chapter_read;

-- Step 2: Delete duplicate entries (keep only the latest per user+comic)
DELETE FROM public.read_history
WHERE id NOT IN (
  SELECT MAX(id)
  FROM public.read_history
  GROUP BY user_id, comic_id
);

-- Step 3: Add new unique constraint (user_id, comic_id only)
ALTER TABLE public.read_history
ADD CONSTRAINT unique_user_comic_history UNIQUE (user_id, comic_id);

-- Verification query (should show 0 duplicates after migration)
SELECT user_id, comic_id, COUNT(*) as count
FROM public.read_history
GROUP BY user_id, comic_id
HAVING COUNT(*) > 1;

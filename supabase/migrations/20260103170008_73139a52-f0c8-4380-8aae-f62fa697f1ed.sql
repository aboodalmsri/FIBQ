-- Add policy to allow public certificate verification by certificate number
CREATE POLICY "Anyone can verify certificates by number"
ON public.certificates
FOR SELECT
USING (true);
-- ============================================================================
-- TABLA: password_reset_tokens
--
-- Almacena tokens OTP para reset de contraseña
-- Cada token es válido por 15 minutos
-- ============================================================================

CREATE TABLE IF NOT EXISTS public.password_reset_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL,
  token VARCHAR(6) NOT NULL,  -- Código de 6 dígitos
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (now() + INTERVAL '15 minutes'),
  used_at TIMESTAMP WITH TIME ZONE,  -- NULL hasta que se use el token
  CONSTRAINT valid_token CHECK (length(token) = 6)
);

-- Índices para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_email
  ON public.password_reset_tokens(email);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_token
  ON public.password_reset_tokens(token);

CREATE INDEX IF NOT EXISTS idx_password_reset_tokens_expires_at
  ON public.password_reset_tokens(expires_at);

-- Comentarios
COMMENT ON TABLE public.password_reset_tokens
  IS 'Almacena tokens temporales para reset de contraseña. Cada token expira en 15 minutos.';

COMMENT ON COLUMN public.password_reset_tokens.email
  IS 'Email del usuario que solicitó reset';

COMMENT ON COLUMN public.password_reset_tokens.token
  IS 'Código OTP de 6 dígitos que el usuario debe ingresar';

COMMENT ON COLUMN public.password_reset_tokens.expires_at
  IS 'Tiempo de expiración del token (15 min después de creación)';

COMMENT ON COLUMN public.password_reset_tokens.used_at
  IS 'Timestamp cuando el token fue usado (NULL = no usado todavía)';

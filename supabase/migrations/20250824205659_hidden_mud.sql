-- CÓDIGO SEGURO - SOLO CREA LAS TABLAS NUEVAS QUE NECESITAMOS
-- No toca las tablas existentes: clients, membership, appointments

-- 1. Tabla de membresías de clientes (nueva)
CREATE TABLE IF NOT EXISTS client_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  category text NOT NULL CHECK (category IN ('grandes', 'medianas', 'chicas')),
  plan text NOT NULL CHECK (plan IN ('esencial', 'completa', 'platinum')),
  areas text[] NOT NULL,
  monthly_payment numeric NOT NULL,
  total_sessions integer NOT NULL,
  completed_sessions integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  start_date date DEFAULT CURRENT_DATE,
  next_payment_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 2. Tabla de transacciones de puntos (nueva)
CREATE TABLE IF NOT EXISTS rewards_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  points integer NOT NULL,
  transaction_type text NOT NULL CHECK (transaction_type IN ('earned', 'redeemed')),
  reason text NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

-- 3. Catálogo de recompensas (nueva)
CREATE TABLE IF NOT EXISTS rewards_catalog (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  points_required integer NOT NULL,
  category text NOT NULL,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- 4. Combos personalizados (nueva)
CREATE TABLE IF NOT EXISTS custom_combos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES clients(id) ON DELETE CASCADE,
  name text NOT NULL,
  areas text[] NOT NULL,
  monthly_payment numeric NOT NULL,
  total_sessions integer NOT NULL,
  discount_percentage numeric DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

-- 5. Agregar puntos a clientes existentes (solo si no existe la columna)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'clients' AND column_name = 'points') THEN
        ALTER TABLE clients ADD COLUMN points integer DEFAULT 0;
    END IF;
END $$;

-- 6. Habilitar seguridad en nuevas tablas
ALTER TABLE client_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_catalog ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_combos ENABLE ROW LEVEL SECURITY;

-- 7. Crear políticas de acceso (solo si no existen)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'client_memberships') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON client_memberships FOR ALL TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rewards_transactions') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON rewards_transactions FOR ALL TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'rewards_catalog') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON rewards_catalog FOR ALL TO authenticated USING (true);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'custom_combos') THEN
        CREATE POLICY "Enable all operations for authenticated users" ON custom_combos FOR ALL TO authenticated USING (true);
    END IF;
END $$;

-- 8. Insertar premios predeterminados (solo si la tabla está vacía)
INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Referir amigas (+100 puntos)', 'Gana 100 puntos cuando una amiga firme su membresía', 0, 'earning'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog);

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Reseña 5 estrellas (+50 puntos)', 'Gana 50 puntos por dejar una reseña de 5 estrellas', 0, 'earning'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = 'Reseña 5 estrellas (+50 puntos)');

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Fotos antes/después (+40 puntos)', 'Gana 40 puntos por autorizar el uso de tus fotos', 0, 'earning'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = 'Fotos antes/después (+40 puntos)');

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Completar membresía (+200 puntos)', 'Bonus de 200 puntos al completar tu membresía', 0, 'earning'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = 'Completar membresía (+200 puntos)');

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT '20% descuento en nueva zona', 'Descuento del 20% al agregar una nueva zona de tratamiento', 200, 'discount'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = '20% descuento en nueva zona');

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Sesión de retoque GRATIS', 'Una sesión de retoque completamente gratuita', 300, 'session'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = 'Sesión de retoque GRATIS');

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Kit de productos exclusivos', 'Kit premium con productos para el cuidado de la piel', 150, 'products'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = 'Kit de productos exclusivos');

INSERT INTO rewards_catalog (name, description, points_required, category) 
SELECT 'Status VIP permanente', 'Beneficios VIP de por vida incluyendo horarios preferenciales', 500, 'vip'
WHERE NOT EXISTS (SELECT 1 FROM rewards_catalog WHERE name = 'Status VIP permanente');
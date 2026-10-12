-- ==============================================================================
-- SurakshitPath (PS-20) Enterprise Spatial Database Schema
-- Target: PostgreSQL 16 + PostGIS 3.4 / pgRouting
-- Statewide Maharashtra Public Safety & Infrastructure Telemetry Engine
-- ==============================================================================

-- 1. Enable PostGIS & Spatial Extensions
CREATE EXTENSION IF NOT EXISTS postgis;
CREATE EXTENSION IF NOT EXISTS postgis_topology;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. "Ask for Angela" Verified Safe Haven Refuges Table
CREATE TABLE IF NOT EXISTS safe_havens (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(32) NOT NULL CHECK (type IN ('police', 'pharmacy_247', 'hospital', 'commercial_refuge', 'transit_hub')),
    address TEXT NOT NULL,
    timing VARCHAR(64) NOT NULL,
    contact VARCHAR(64),
    geom GEOMETRY(Point, 4326) NOT NULL,
    ask_for_angela_trained BOOLEAN DEFAULT FALSE,
    has_phone_charger BOOLEAN DEFAULT FALSE,
    safe_waiting_area BOOLEAN DEFAULT FALSE,
    security_staff_on_duty BOOLEAN DEFAULT FALSE,
    accreditation_badge VARCHAR(128),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_safe_havens_geom ON safe_havens USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_safe_havens_type ON safe_havens(type);

-- 3. Citizen Incident Reports (Crowdsourced Safety Audits) Table
CREATE TABLE IF NOT EXISTS citizen_reports (
    id VARCHAR(64) PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(64) NOT NULL CHECK (category IN ('broken_lamp', 'harassment_loitering', 'dark_stretch', 'road_hazard')),
    urgency VARCHAR(16) NOT NULL CHECK (urgency IN ('low', 'medium', 'high')),
    description TEXT NOT NULL,
    photo_url TEXT,
    geom GEOMETRY(Point, 4326) NOT NULL,
    status VARCHAR(32) DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'resolved', 'escalated')),
    upvotes INT DEFAULT 1,
    reported_at TIMESTAMPTZ DEFAULT NOW(),
    resolved_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_citizen_reports_geom ON citizen_reports USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_category ON citizen_reports(category);
CREATE INDEX IF NOT EXISTS idx_citizen_reports_urgency ON citizen_reports(urgency);

-- 4. Municipal Dark Spots & High-Risk Segments Table
CREATE TABLE IF NOT EXISTS civic_dark_spots (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    district VARCHAR(64) DEFAULT 'Pune',
    severity NUMERIC(4, 2) NOT NULL CHECK (severity >= 0.0 AND severity <= 1.0),
    lux_level NUMERIC(6, 2) NOT NULL,
    status VARCHAR(32) DEFAULT 'open' CHECK (status IN ('open', 'inspected', 'under_repair', 'repaired')),
    reported_count INT DEFAULT 1,
    geom GEOMETRY(Point, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_civic_dark_spots_geom ON civic_dark_spots USING GIST(geom);

-- 5. PMC SCADA Streetlight Feeders & Grid Telemetry Table
CREATE TABLE IF NOT EXISTS scada_feeders (
    feeder_id VARCHAR(64) PRIMARY KEY,
    substation_name VARCHAR(255) NOT NULL,
    circuit_code VARCHAR(64) NOT NULL,
    status VARCHAR(32) DEFAULT 'ONLINE' CHECK (status IN ('ONLINE', 'FAULT', 'OFFLINE', 'SCHEDULED_OFF')),
    current_draw_amps NUMERIC(6, 2) DEFAULT 42.5,
    voltage_volts NUMERIC(6, 2) DEFAULT 230.0,
    lumens_utilization_pct NUMERIC(5, 2) DEFAULT 95.0,
    active_lamp_count INT DEFAULT 120,
    failed_lamp_count INT DEFAULT 0,
    last_heartbeat TIMESTAMPTZ DEFAULT NOW(),
    geom GEOMETRY(Point, 4326) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_scada_feeders_geom ON scada_feeders USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_scada_feeders_status ON scada_feeders(status);

-- 6. Statewide Multimodal Road Graph Edges (PostGIS pgRouting Schema)
CREATE TABLE IF NOT EXISTS road_edges (
    edge_id VARCHAR(64) PRIMARY KEY,
    source_node VARCHAR(64) NOT NULL,
    target_node VARCHAR(64) NOT NULL,
    name VARCHAR(255) NOT NULL,
    highway_type VARCHAR(64) NOT NULL,
    distance_meters NUMERIC(10, 2) NOT NULL,
    lighting_factor NUMERIC(4, 2) DEFAULT 0.50,
    commercial_activity NUMERIC(4, 2) DEFAULT 0.50,
    transit_proximity NUMERIC(4, 2) DEFAULT 0.50,
    emergency_haven_proximity NUMERIC(4, 2) DEFAULT 0.50,
    composite_safety_score NUMERIC(5, 2) DEFAULT 50.0,
    cost NUMERIC(10, 2) NOT NULL, -- Base length cost
    reverse_cost NUMERIC(10, 2) NOT NULL,
    geom GEOMETRY(LineString, 4326) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_road_edges_geom ON road_edges USING GIST(geom);
CREATE INDEX IF NOT EXISTS idx_road_edges_nodes ON road_edges(source_node, target_node);

-- ==============================================================================
-- 7. Seed Data: 20 Verified Safe Havens across Pune & Pimpri-Chinchwad Testbed
-- ==============================================================================
INSERT INTO safe_havens (id, name, type, address, timing, contact, geom, ask_for_angela_trained, has_phone_charger, safe_waiting_area, security_staff_on_duty, accreditation_badge)
VALUES
    ('haven_hinjawadi_police', 'Hinjawadi Police Station', 'police', 'Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune', '24 Hours Open', '020-22934200 / 112', ST_SetSRID(ST_MakePoint(73.7380, 18.5910), 4326), TRUE, TRUE, TRUE, TRUE, 'Pune City Police · 24/7 Division HQ'),
    ('haven_wakad_chowki', 'Wakad Police Chowki', 'police', 'Dange Chowk Road, Wakad, Pimpri-Chinchwad', '24 Hours Open', '020-27278100 / 112', ST_SetSRID(ST_MakePoint(73.7745, 18.5985), 4326), TRUE, TRUE, TRUE, TRUE, 'PCMC Police Commissionerate'),
    ('haven_baner_chowki', 'Baner Police Outpost', 'police', 'Baner Road, Near Sakal Nagar, Pune', '24 Hours Open', '020-25654100 / 112', ST_SetSRID(ST_MakePoint(73.7925, 18.5590), 4326), TRUE, TRUE, TRUE, TRUE, 'Pune City Police · Pink Security Chowki'),
    ('haven_chatushrungi_police', 'Chatushrungi Police Station', 'police', 'Senapati Bapat Road, Near SPPU Gate, Pune', '24 Hours Open', '020-25652500 / 112', ST_SetSRID(ST_MakePoint(73.8290, 18.5385), 4326), TRUE, TRUE, TRUE, TRUE, 'Pune City Police · Fast Response Hub'),
    ('haven_kothrud_police', 'Kothrud Police Station', 'police', 'Paud Road, Ideal Colony, Kothrud, Pune', '24 Hours Open', '020-25381100 / 112', ST_SetSRID(ST_MakePoint(73.8110, 18.5075), 4326), TRUE, TRUE, TRUE, TRUE, 'Pune City Police · Division 3 Outpost'),
    ('haven_wellness_wakad', 'Wellness Forever 24/7 Pharmacy', 'pharmacy_247', 'Shop 4, Datta Mandir Road, Wakad, Pune', '24 Hours Open', '020-67112233', ST_SetSRID(ST_MakePoint(73.7665, 18.5995), 4326), TRUE, TRUE, TRUE, TRUE, 'FDA Licensed 24/7 · Safe Night Sanctuary'),
    ('haven_apollo_baner', 'Apollo Pharmacy 24x7 Baner High St', 'pharmacy_247', 'Shop 12, Baner High Street, Pune', '24 Hours Open', '020-41008899', ST_SetSRID(ST_MakePoint(73.7845, 18.5615), 4326), TRUE, TRUE, TRUE, TRUE, 'Apollo National 24/7 Safety Partner'),
    ('haven_noble_aundh', 'Noble Chemists 24/7 Aundh', 'pharmacy_247', 'Parihar Chowk, DP Road, Aundh, Pune', '24 Hours Open', '020-25881234', ST_SetSRID(ST_MakePoint(73.8075, 18.5610), 4326), TRUE, TRUE, TRUE, TRUE, 'FDA Maharashtra Approved 24/7 Haven'),
    ('haven_medplus_kothrud', 'MedPlus 24/7 Paud Road', 'pharmacy_247', 'Paud Road, Near Vanaz Metro Station, Kothrud', '24 Hours Open', '020-25449988', ST_SetSRID(ST_MakePoint(73.8055, 18.5085), 4326), TRUE, TRUE, TRUE, TRUE, 'MedPlus Safe Haven Accredited'),
    ('haven_sanjiwani_tathawade', 'Sanjiwani 24x7 Chemist Tathawade', 'pharmacy_247', 'Opp. JSPM Gate No. 2, Tathawade, Pune', '24 Hours Open', '020-22939911', ST_SetSRID(ST_MakePoint(73.7550, 18.6160), 4326), TRUE, TRUE, TRUE, TRUE, 'PMC Health Network Certified Haven'),
    ('haven_jupiter_hospital', 'Jupiter Hospital ER Trauma Centre', 'hospital', 'Near Prathamesh Park, Aundh-Baner Link Road, Baner, Pune', '24 Hours Open · Trauma Code Red', '020-27999999 / 108', ST_SetSRID(ST_MakePoint(73.7895, 18.5620), 4326), TRUE, TRUE, TRUE, TRUE, 'NABH Accredited Multi-Specialty ER'),
    ('haven_lifepoint_wakad', 'Lifepoint Multispecialty Hospital', 'hospital', 'Mumbai-Bangalore Highway, Shankar Kalat Nagar, Wakad', '24 Hours Open', '020-67676767 / 108', ST_SetSRID(ST_MakePoint(73.7610, 18.6010), 4326), TRUE, TRUE, TRUE, TRUE, '24/7 Level-2 Trauma Centre'),
    ('haven_sahyadri_kothrud', 'Sahyadri Super Speciality Hospital', 'hospital', 'Plot No. 30 C, Erandwane, Karve Road, Pune', '24 Hours Open', '020-67213000 / 108', ST_SetSRID(ST_MakePoint(73.8295, 18.5070), 4326), TRUE, TRUE, TRUE, TRUE, 'NABH Emergency Care Facility'),
    ('haven_manipal_baner', 'Manipal Hospital Baner 24/7 ER', 'hospital', 'Pan Card Club Road, Baner, Pune', '24 Hours Open', '020-68138888 / 108', ST_SetSRID(ST_MakePoint(73.7780, 18.5695), 4326), TRUE, TRUE, TRUE, TRUE, 'NABH Level-1 Trauma Centre'),
    ('haven_bpcl_oasis_tathawade', 'Bharat Petroleum 24/7 City Oasis', 'commercial_refuge', 'Bhumkar Chowk, Tathawade-Wakad Link, Pune', '24 Hours Open · 24/7 Convenience Store & Air', '020-27271100', ST_SetSRID(ST_MakePoint(73.7545, 18.6045), 4326), TRUE, TRUE, TRUE, TRUE, 'BPCL Safety Partner & Staff On-Site'),
    ('haven_hp_balewadi', 'HP Auto Care 24/7 Balewadi High St', 'commercial_refuge', 'Balewadi High Street Junction, Pune', '24 Hours Open · Well-Lit Forecourt', '020-27293344', ST_SetSRID(ST_MakePoint(73.7740, 18.5770), 4326), TRUE, TRUE, TRUE, TRUE, 'HPCL Smart Haven Forecourt'),
    ('haven_ioc_pashan', 'Indian Oil 24/7 Swagat Plaza Pashan', 'commercial_refuge', 'Pashan-Sus Road Junction, Pashan, Pune', '24 Hours Open', '020-25895566', ST_SetSRID(ST_MakePoint(73.7910, 18.5390), 4326), TRUE, TRUE, TRUE, TRUE, 'IOCL 24/7 Illuminated Refuge'),
    ('haven_balewadi_metro', 'Balewadi Phata Metro Station Refuge', 'transit_hub', 'Pune Metro Line 3 Concourse, Baner-Balewadi Road', '06:00 - 00:30 · 24/7 CISF Security Desk', '020-26051100', ST_SetSRID(ST_MakePoint(73.7820, 18.5710), 4326), TRUE, TRUE, TRUE, TRUE, 'Pune Metro Rail Corporation / CISF Outpost'),
    ('haven_kothrud_stand', 'PMPML Kothrud Depot Control Hub', 'transit_hub', 'Paud Road, Near Chandani Chowk, Kothrud, Pune', '24 Hours Operational Control', '020-24503355', ST_SetSRID(ST_MakePoint(73.8080, 18.5060), 4326), TRUE, TRUE, TRUE, TRUE, 'PMPML Transit Command Center'),
    ('haven_shimla_office_shivajinagar', 'Shivajinagar Metro & Police Nexus', 'transit_hub', 'Old Pune-Mumbai Highway, Shivajinagar, Pune', '24 Hours Guarded Interchange', '020-25531200 / 112', ST_SetSRID(ST_MakePoint(73.8510, 18.5310), 4326), TRUE, TRUE, TRUE, TRUE, 'Integrated Multi-Modal Transit Nexus')
ON CONFLICT (id) DO UPDATE SET 
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    timing = EXCLUDED.timing,
    contact = EXCLUDED.contact,
    geom = EXCLUDED.geom,
    ask_for_angela_trained = EXCLUDED.ask_for_angela_trained,
    has_phone_charger = EXCLUDED.has_phone_charger,
    safe_waiting_area = EXCLUDED.safe_waiting_area,
    security_staff_on_duty = EXCLUDED.security_staff_on_duty,
    accreditation_badge = EXCLUDED.accreditation_badge;

-- ==============================================================================
-- 8. Seed Data: Municipal Dark Spots
-- ==============================================================================
INSERT INTO civic_dark_spots (id, name, district, severity, lux_level, status, reported_count, geom)
VALUES
    ('ds_sus_underpass', 'Sus Road Unlit Highway Underpass', 'Pune', 0.88, 1.20, 'open', 14, ST_SetSRID(ST_MakePoint(73.7712, 18.5408), 4326)),
    ('ds_service_lane_wakad', 'Wakad NH-48 Service Lane Dead Zone', 'Pune', 0.74, 2.80, 'open', 9, ST_SetSRID(ST_MakePoint(73.7622, 18.6015), 4326)),
    ('ds_pashan_isolated_alley', 'Pashan Tekdi Isolated Periphery', 'Pune', 0.92, 0.40, 'open', 22, ST_SetSRID(ST_MakePoint(73.7915, 18.5342), 4326)),
    ('ds_mula_river_bridge_blindspot', 'Mula River Bridge Unlit Service Arc', 'Pune', 0.68, 3.50, 'open', 6, ST_SetSRID(ST_MakePoint(73.7995, 18.5721), 4326))
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. Seed Data: PMC SCADA Smart Streetlight Feeders
-- ==============================================================================
INSERT INTO scada_feeders (feeder_id, substation_name, circuit_code, status, current_draw_amps, voltage_volts, lumens_utilization_pct, active_lamp_count, failed_lamp_count, geom)
VALUES
    ('scada_feeder_baner_main', 'Baner 33kV Substation', 'FDR-BNR-01', 'ONLINE', 46.2, 231.4, 98.2, 140, 2, ST_SetSRID(ST_MakePoint(73.7840, 18.5600), 4326)),
    ('scada_feeder_wakad_bhumkar', 'Wakad 22kV Distribution Substation', 'FDR-WKD-04', 'ONLINE', 52.8, 229.1, 94.5, 180, 5, ST_SetSRID(ST_MakePoint(73.7620, 18.6010), 4326)),
    ('scada_feeder_sus_underpass', 'Pashan-Sus Transformer Hub', 'FDR-SUS-09', 'FAULT', 0.0, 0.0, 0.0, 0, 48, ST_SetSRID(ST_MakePoint(73.7710, 18.5410), 4326)),
    ('scada_feeder_sppu_boulevard', 'University Circle Substation', 'FDR-SPPU-02', 'ONLINE', 61.5, 233.0, 99.1, 210, 1, ST_SetSRID(ST_MakePoint(73.8290, 18.5390), 4326)),
    ('scada_feeder_paud_kothrud', 'Kothrud Paud Road Substation', 'FDR-KTH-07', 'ONLINE', 48.9, 230.5, 96.0, 165, 3, ST_SetSRID(ST_MakePoint(73.8090, 18.5070), 4326))
ON CONFLICT (feeder_id) DO NOTHING;

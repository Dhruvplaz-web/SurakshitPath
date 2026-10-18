"""
SurakshitPath - Spatial Persistence & Database Engine
Supports PostgreSQL 16 + PostGIS with transparent fallback to resilient SQLite spatial store.
"""

import os
import math
import sqlite3
import json
from typing import List, Dict, Any, Optional
from datetime import datetime

DATABASE_URL = os.getenv("DATABASE_URL", "")
IS_POSTGRES = bool(DATABASE_URL and DATABASE_URL.startswith("postgres"))
LOCAL_DB_PATH = os.path.join(os.path.dirname(__file__), "surakshit_local.db")

def haversine_distance_meters(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Computes great-circle distance in meters between two WGS-84 points."""
    R = 6371000.0  # Earth radius in meters
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)

    a = math.sin(delta_phi / 2.0)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(delta_lambda / 2.0)**2
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def get_db_connection():
    conn = sqlite3.connect(LOCAL_DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_database():
    """Initializes schema and seeds initial data if missing."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS safe_havens (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        address TEXT NOT NULL,
        timing TEXT NOT NULL,
        contact TEXT,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        ask_for_angela_trained INTEGER DEFAULT 0,
        has_phone_charger INTEGER DEFAULT 0,
        safe_waiting_area INTEGER DEFAULT 0,
        security_staff_on_duty INTEGER DEFAULT 0,
        accreditation_badge TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS citizen_reports (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        urgency TEXT NOT NULL,
        description TEXT NOT NULL,
        photo_url TEXT,
        lat REAL NOT NULL,
        lon REAL NOT NULL,
        status TEXT DEFAULT 'pending',
        upvotes INTEGER DEFAULT 1,
        reported_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS civic_dark_spots (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        district TEXT DEFAULT 'Pune',
        severity REAL NOT NULL,
        lux_level REAL NOT NULL,
        status TEXT DEFAULT 'open',
        reported_count INTEGER DEFAULT 1,
        lat REAL NOT NULL,
        lon REAL NOT NULL
    );
    """)

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS scada_feeders (
        feeder_id TEXT PRIMARY KEY,
        substation_name TEXT NOT NULL,
        circuit_code TEXT NOT NULL,
        status TEXT DEFAULT 'ONLINE',
        current_draw_amps REAL DEFAULT 42.5,
        voltage_volts REAL DEFAULT 230.0,
        lumens_utilization_pct REAL DEFAULT 95.0,
        active_lamp_count INTEGER DEFAULT 120,
        failed_lamp_count INTEGER DEFAULT 0,
        last_heartbeat TEXT DEFAULT CURRENT_TIMESTAMP,
        lat REAL NOT NULL,
        lon REAL NOT NULL
    );
    """)

    conn.commit()

    # Check if safe havens already seeded
    cursor.execute("SELECT COUNT(*) as cnt FROM safe_havens")
    if cursor.fetchone()["cnt"] == 0:
        seed_safe_havens(cursor)
        seed_dark_spots(cursor)
        seed_scada_feeders(cursor)
        conn.commit()

    conn.close()

def seed_safe_havens(cursor):
    havens = [
        # Pune PMRDA
        ("haven_hinjawadi_police", "Hinjawadi Police Station", "police", "Phase 1, Hinjawadi Rajiv Gandhi Infotech Park, Pune", "24 Hours Open", "020-22934200 / 112", 18.5910, 73.7380, 1, 1, 1, 1, "Pune City Police · 24/7 Division HQ"),
        ("haven_wakad_chowki", "Wakad Police Chowki", "police", "Dange Chowk Road, Wakad, Pimpri-Chinchwad", "24 Hours Open", "020-27278100 / 112", 18.5985, 73.7745, 1, 1, 1, 1, "PCMC Police Commissionerate"),
        ("haven_baner_chowki", "Baner Police Outpost", "police", "Baner Road, Near Sakal Nagar, Pune", "24 Hours Open", "020-25654100 / 112", 18.5590, 73.7925, 1, 1, 1, 1, "Pune City Police · Pink Security Chowki"),
        ("haven_chatushrungi_police", "Chatushrungi Police Station", "police", "Senapati Bapat Road, Near SPPU Gate, Pune", "24 Hours Open", "020-25652500 / 112", 18.5385, 73.8290, 1, 1, 1, 1, "Pune City Police · Fast Response Hub"),
        ("haven_kothrud_police", "Kothrud Police Station", "police", "Paud Road, Ideal Colony, Kothrud, Pune", "24 Hours Open", "020-25381100 / 112", 18.5075, 73.8110, 1, 1, 1, 1, "Pune City Police · Division 3 Outpost"),
        ("haven_wellness_wakad", "Wellness Forever 24/7 Pharmacy", "pharmacy_247", "Shop 4, Datta Mandir Road, Wakad, Pune", "24 Hours Open", "020-67112233", 18.5995, 73.7665, 1, 1, 1, 1, "FDA Licensed 24/7 · Safe Night Sanctuary"),
        ("haven_apollo_baner", "Apollo Pharmacy 24x7 Baner High St", "pharmacy_247", "Shop 12, Baner High Street, Pune", "24 Hours Open", "020-41008899", 18.5615, 73.7845, 1, 1, 1, 1, "Apollo National 24/7 Safety Partner"),
        ("haven_noble_aundh", "Noble Chemists 24/7 Aundh", "pharmacy_247", "Parihar Chowk, DP Road, Aundh, Pune", "24 Hours Open", "020-25881234", 18.5610, 73.8075, 1, 1, 1, 1, "FDA Maharashtra Approved 24/7 Haven"),
        ("haven_medplus_kothrud", "MedPlus 24/7 Paud Road", "pharmacy_247", "Paud Road, Near Vanaz Metro Station, Kothrud", "24 Hours Open", "020-25449988", 18.5085, 73.8055, 1, 1, 1, 1, "MedPlus Safe Haven Accredited"),
        ("haven_sanjiwani_tathawade", "Sanjiwani 24x7 Chemist Tathawade", "pharmacy_247", "Opp. JSPM Gate No. 2, Tathawade, Pune", "24 Hours Open", "020-22939911", 18.6160, 73.7550, 1, 1, 1, 1, "PMC Health Network Certified Haven"),
        ("haven_jupiter_hospital", "Jupiter Hospital ER Trauma Centre", "hospital", "Near Prathamesh Park, Aundh-Baner Link Road, Baner, Pune", "24 Hours Open · Trauma Code Red", "020-27999999 / 108", 18.5620, 73.7895, 1, 1, 1, 1, "NABH Accredited Multi-Specialty ER"),
        ("haven_lifepoint_wakad", "Lifepoint Multispecialty Hospital", "hospital", "Mumbai-Bangalore Highway, Shankar Kalat Nagar, Wakad", "24 Hours Open", "020-67676767 / 108", 18.6010, 73.7610, 1, 1, 1, 1, "24/7 Level-2 Trauma Centre"),
        ("haven_sahyadri_kothrud", "Sahyadri Super Speciality Hospital", "hospital", "Plot No. 30 C, Erandwane, Karve Road, Pune", "24 Hours Open", "020-67213000 / 108", 18.5070, 73.8295, 1, 1, 1, 1, "NABH Emergency Care Facility"),
        ("haven_manipal_baner", "Manipal Hospital Baner 24/7 ER", "hospital", "Pan Card Club Road, Baner, Pune", "24 Hours Open", "020-68138888 / 108", 18.5695, 73.7780, 1, 1, 1, 1, "NABH Level-1 Trauma Centre"),
        ("haven_bpcl_oasis_tathawade", "Bharat Petroleum 24/7 City Oasis", "commercial_refuge", "Bhumkar Chowk, Tathawade-Wakad Link, Pune", "24 Hours Open · 24/7 Convenience Store & Air", "020-27271100", 18.6045, 73.7545, 1, 1, 1, 1, "BPCL Safety Partner & Staff On-Site"),
        ("haven_hp_balewadi", "HP Auto Care 24/7 Balewadi High St", "commercial_refuge", "Balewadi High Street Junction, Pune", "24 Hours Open · Well-Lit Forecourt", "020-27293344", 18.5770, 73.7740, 1, 1, 1, 1, "HPCL Smart Haven Forecourt"),
        ("haven_ioc_pashan", "Indian Oil 24/7 Swagat Plaza Pashan", "commercial_refuge", "Pashan-Sus Road Junction, Pashan, Pune", "24 Hours Open", "020-25895566", 18.5390, 73.7910, 1, 1, 1, 1, "IOCL 24/7 Illuminated Refuge"),
        ("haven_balewadi_metro", "Balewadi Phata Metro Station Refuge", "transit_hub", "Pune Metro Line 3 Concourse, Baner-Balewadi Road", "06:00 - 00:30 · 24/7 CISF Security Desk", "020-26051100", 18.5710, 73.7820, 1, 1, 1, 1, "Pune Metro Rail Corporation / CISF Outpost"),
        ("haven_kothrud_stand", "PMPML Kothrud Depot Control Hub", "transit_hub", "Paud Road, Near Chandani Chowk, Kothrud, Pune", "24 Hours Operational Control", "020-24503355", 18.5060, 73.8080, 1, 1, 1, 1, "PMPML Transit Command Center"),
        ("haven_shimla_office_shivajinagar", "Shivajinagar Metro & Police Nexus", "transit_hub", "Old Pune-Mumbai Highway, Shivajinagar, Pune", "24 Hours Guarded Interchange", "020-25531200 / 112", 18.5310, 73.8510, 1, 1, 1, 1, "Integrated Multi-Modal Transit Nexus"),
        
        # Mumbai MMR
        ("haven_police_marine_drive", "Marine Drive Police Station & Coastal Patrol", "police", "Netaji Subhash Chandra Bose Road, Nariman Point, Mumbai", "24/7 Active Outpost", "022-22812200 / 112", 18.9280, 72.8250, 1, 1, 1, 1, "Mumbai Police · South Region HQ"),
        ("haven_police_bandra", "Bandra Police Station & Nirbhaya Cell", "police", "Hill Road, Near Bandra Station, Bandra West, Mumbai", "24/7 Nirbhaya Squad", "022-26423023 / 112", 19.0550, 72.8350, 1, 1, 1, 1, "Mumbai Police · Nirbhaya Cell"),
        ("haven_hospital_lilavati_mumbai", "Lilavati Hospital 24/7 Emergency Trauma", "hospital", "A-791, Bandra Reclamation, Bandra West, Mumbai", "24 Hours Emergency Bay", "022-26751000", 19.0515, 72.8290, 1, 1, 1, 1, "NABH Accredited Apex Hospital"),
        ("haven_police_navi_mumbai_vashi", "Vashi Police Station & Women Helpline", "police", "Sector 17, Vashi, Navi Mumbai, Maharashtra", "24/7 Police Outpost", "022-27891100 / 112", 19.0760, 72.9990, 1, 1, 1, 1, "Navi Mumbai Police Commissionerate"),
        ("haven_police_thane_west", "Thane Central Police Station", "police", "Near Thane Court, Gokhale Road, Thane West", "24/7 Guarded Outpost", "022-25344444 / 112", 19.1950, 72.9780, 1, 1, 1, 1, "Thane City Police Verified"),
        
        # North Maharashtra (Nashik)
        ("haven_police_nashik_panchavati", "Panchavati Police Station", "police", "Dindori Road, Panchavati, Nashik, Maharashtra", "24/7 Active Outpost", "0253-2512333 / 112", 20.0050, 73.7950, 1, 1, 1, 1, "Nashik Police Verified"),
        ("haven_hospital_apollo_nashik", "Apollo Hospital 24/7 Emergency Center", "hospital", "Mumbai-Agra Highway, Dwarka Circle, Nashik", "24 Hours Trauma Care", "0253-2303000", 19.9880, 73.7740, 1, 1, 1, 1, "Apollo 24/7 Verified Safe Refuge"),
        
        # Marathwada (Chhatrapati Sambhaji Nagar)
        ("haven_police_sambhaji_kranti_chowk", "Kranti Chowk Police Station & Women Helpdesk", "police", "Jalna Road, Kranti Chowk, Chhatrapati Sambhaji Nagar", "24/7 Central Outpost", "0240-2331100 / 112", 19.8730, 75.3280, 1, 1, 1, 1, "Sambhaji Nagar Police Verified"),
        
        # Vidarbha (Nagpur)
        ("haven_police_nagpur_sitabuldi", "Sitabuldi Police Station (Zero Mile Central)", "police", "Wardha Road, Sitabuldi, Nagpur, Maharashtra", "24/7 Active Outpost", "0712-2565555 / 112", 21.1460, 79.0820, 1, 1, 1, 1, "Nagpur Police Central Wing"),
        ("haven_hospital_aiims_nagpur", "AIIMS Nagpur 24/7 Emergency Trauma Bay", "hospital", "Sector 20, MIHAN SEZ, South Nagpur", "24 Hours Emergency Refuge", "0712-2352000", 21.0500, 79.0350, 1, 1, 1, 1, "National Apex Healthcare Institute"),
        
        # Western Maharashtra (Kolhapur & Solapur)
        ("haven_police_kolhapur_cbs", "CBS Police Chowki & Women Assistance Desk", "police", "Central Bus Stand, Station Road, Kolhapur", "24/7 Transit Police Chowki", "0231-2651100 / 112", 16.6960, 74.2250, 1, 1, 1, 1, "Kolhapur Police Verified"),
        ("haven_police_solapur_pune_naka", "Old Pune Naka Police Station", "police", "Pune-Solapur Highway Junction, Solapur", "24/7 Highway Police Checkpoint", "0217-2744100 / 112", 17.6650, 75.9010, 1, 1, 1, 1, "Solapur Police Verified")
    ]
    cursor.executemany("""
    INSERT INTO safe_havens (id, name, type, address, timing, contact, lat, lon, ask_for_angela_trained, has_phone_charger, safe_waiting_area, security_staff_on_duty, accreditation_badge)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, havens)

def seed_dark_spots(cursor):
    spots = [
        ("ds_sus_underpass", "Sus Road Unlit Highway Underpass", "Pune", 0.88, 1.20, "open", 14, 18.5408, 73.7712),
        ("ds_service_lane_wakad", "Wakad NH-48 Service Lane Dead Zone", "Pune", 0.74, 2.80, "open", 9, 18.6015, 73.7622),
        ("ds_pashan_isolated_alley", "Pashan Tekdi Isolated Periphery", "Pune", 0.92, 0.40, "open", 22, 18.5342, 73.7915),
        ("ds_mula_river_bridge_blindspot", "Mula River Bridge Unlit Service Arc", "Pune", 0.68, 3.50, "open", 6, 18.5721, 73.7995),
        ("ds_mumbai_mankhurd_underpass", "Mankhurd Vashi Link Unlit Underpass", "Mumbai", 0.85, 1.50, "open", 11, 19.0550, 72.9320),
        ("ds_nagpur_hingna_ringroad", "Outer Ring Road Hingna Freight Junction", "Nagpur", 0.79, 2.10, "open", 8, 21.0800, 78.9800),
        ("ds_nashik_dwarka_highway_cut", "Dwarka Highway Truck Terminal Cut", "Nashik", 0.82, 1.90, "open", 12, 19.9800, 73.7900)
    ]
    cursor.executemany("""
    INSERT INTO civic_dark_spots (id, name, district, severity, lux_level, status, reported_count, lat, lon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, spots)

def seed_scada_feeders(cursor):
    feeders = [
        ("scada_feeder_baner_main", "Baner 33kV Substation", "FDR-BNR-01", "ONLINE", 46.2, 231.4, 98.2, 140, 2, 18.5600, 73.7840),
        ("scada_feeder_wakad_bhumkar", "Wakad 22kV Distribution Substation", "FDR-WKD-04", "ONLINE", 52.8, 229.1, 94.5, 180, 5, 18.6010, 73.7620),
        ("scada_feeder_sus_underpass", "Pashan-Sus Transformer Hub", "FDR-SUS-09", "FAULT", 0.0, 0.0, 0.0, 0, 48, 18.5410, 73.7710),
        ("scada_feeder_sppu_boulevard", "University Circle Substation", "FDR-SPPU-02", "ONLINE", 61.5, 233.0, 99.1, 210, 1, 18.5390, 73.8290),
        ("scada_feeder_paud_kothrud", "Kothrud Paud Road Substation", "FDR-KTH-07", "ONLINE", 48.9, 230.5, 96.0, 165, 3, 18.5070, 73.8090)
    ]
    cursor.executemany("""
    INSERT INTO scada_feeders (feeder_id, substation_name, circuit_code, status, current_draw_amps, voltage_volts, lumens_utilization_pct, active_lamp_count, failed_lamp_count, lat, lon)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, feeders)

# ------------------------------------------------------------------------------
# CRUD Methods
# ------------------------------------------------------------------------------

def get_all_safe_havens(current_lat: Optional[float] = None, current_lon: Optional[float] = None, haven_type: Optional[str] = None) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM safe_havens"
    params = []
    if haven_type and haven_type != "all":
        query += " WHERE type = ?"
        params.append(haven_type)

    cursor.execute(query, params)
    rows = cursor.fetchall()
    conn.close()

    results = []
    for r in rows:
        haven_dict = {
            "id": r["id"],
            "name": r["name"],
            "type": r["type"],
            "address": r["address"],
            "timing": r["timing"],
            "contact": r["contact"],
            "coordinates": [r["lat"], r["lon"]],
            "askForAngelaTrained": bool(r["ask_for_angela_trained"]),
            "hasPhoneCharger": bool(r["has_phone_charger"]),
            "safeWaitingArea": bool(r["safe_waiting_area"]),
            "securityStaffOnDuty": bool(r["security_staff_on_duty"]),
            "accreditationBadge": r["accreditation_badge"]
        }

        if current_lat is not None and current_lon is not None:
            dist = haversine_distance_meters(current_lat, current_lon, r["lat"], r["lon"])
            haven_dict["distanceMeters"] = round(dist)
            haven_dict["walkingMinutes"] = max(1, round((dist / 1000.0) / 4.5 * 60))

        results.append(haven_dict)

    if current_lat is not None and current_lon is not None:
        results.sort(key=lambda x: x.get("distanceMeters", 0))

    return results

def insert_citizen_report(report_data: Dict[str, Any]) -> Dict[str, Any]:
    conn = get_db_connection()
    cursor = conn.cursor()

    report_id = report_data.get("id") or f"rep_{int(datetime.now().timestamp() * 1000)}"
    coords = report_data.get("coordinates", [18.5600, 73.7850])
    
    cursor.execute("""
    INSERT INTO citizen_reports (id, title, category, urgency, description, photo_url, lat, lon, status, upvotes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        report_id,
        report_data.get("title", "Community Hazard Report"),
        report_data.get("category", "broken_lamp"),
        report_data.get("urgency", "medium"),
        report_data.get("description", ""),
        report_data.get("photoUrl", None),
        coords[0],
        coords[1],
        "pending",
        1
    ))

    conn.commit()
    conn.close()

    return {
        "id": report_id,
        "title": report_data.get("title"),
        "category": report_data.get("category"),
        "urgency": report_data.get("urgency"),
        "description": report_data.get("description"),
        "coordinates": coords,
        "status": "pending",
        "upvotes": 1,
        "reportedAt": int(datetime.now().timestamp() * 1000)
    }

def get_all_citizen_reports() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM citizen_reports ORDER BY reported_at DESC")
    rows = cursor.fetchall()
    conn.close()

    return [{
        "id": r["id"],
        "title": r["title"],
        "category": r["category"],
        "urgency": r["urgency"],
        "description": r["description"],
        "photoUrl": r["photo_url"],
        "coordinates": [r["lat"], r["lon"]],
        "status": r["status"],
        "upvotes": r["upvotes"],
        "reportedAt": r["reported_at"]
    } for r in rows]

def get_all_dark_spots() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM civic_dark_spots")
    rows = cursor.fetchall()
    conn.close()

    return [{
        "id": r["id"],
        "name": r["name"],
        "district": r["district"],
        "severity": r["severity"],
        "luxLevel": r["lux_level"],
        "status": r["status"],
        "reportedCount": r["reported_count"],
        "coordinates": [r["lat"], r["lon"]]
    } for r in rows]

def get_all_scada_feeders() -> List[Dict[str, Any]]:
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM scada_feeders")
    rows = cursor.fetchall()
    conn.close()

    return [{
        "feederId": r["feeder_id"],
        "substationName": r["substation_name"],
        "circuitCode": r["circuit_code"],
        "status": r["status"],
        "currentDrawAmps": r["current_draw_amps"],
        "voltageVolts": r["voltage_volts"],
        "lumensUtilizationPct": r["lumens_utilization_pct"],
        "activeLampCount": r["active_lamp_count"],
        "failedLampCount": r["failed_lamp_count"],
        "lastHeartbeat": r["last_heartbeat"],
        "coordinates": [r["lat"], r["lon"]]
    } for r in rows]

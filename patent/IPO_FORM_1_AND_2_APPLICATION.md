# FORM 1 & FORM 2 PATENT APPLICATION SPECIFICATION
### THE PATENTS ACT, 1970 (39 of 1970) & THE PATENTS RULES, 2003
**PATENT OFFICE BRANCH: MUMBAI / NEW DELHI / CHENNAI / KOLKATA, INDIA**

---

## FORM 1: APPLICATION FOR GRANT OF PATENT
*(See Sections 7, 54 & 135 and Rule 20(1))*

1. **APPLICANT(S) DETAILS:**
   - **Name:** Team SurakshitPath (Student Inventors & Innovators)
   - **Nationality:** Indian
   - **Address:** Maharashtra, India

2. **INVENTOR(S) DETAILS:**
   - **Name:** Team SurakshitPath
   - **Nationality:** Indian

3. **TITLE OF THE INVENTION:**
   **"A CYBER-PHYSICAL COMMUTER SAFETY SYSTEM COMPRISING A HOSTILE-DECOUPLING BREAKAWAY SMART CHARM AND MUNICIPAL SCADA DYNAMIC IMPEDANCE ROUTING ENGINE"**

4. **DECLARATION BY THE APPLICANT:**
   - The applicant claims priority from the date of filing of this complete specification.
   - The invention is novel, involves an inventive step, and possesses industrial applicability under Sections 2(1)(j) and 2(1)(ja) of The Patents Act, 1970.

---

## FORM 2: COMPLETE SPECIFICATION
*(See Section 10 and Rule 13)*

### 1. TITLE OF THE INVENTION
**A CYBER-PHYSICAL COMMUTER SAFETY SYSTEM COMPRISING A HOSTILE-DECOUPLING BREAKAWAY SMART CHARM AND MUNICIPAL SCADA DYNAMIC IMPEDANCE ROUTING ENGINE**

---

### 2. PREAMBLE TO THE DESCRIPTION
The following specification particularly describes the invention and the manner in which it is to be performed:

---

### 3. FIELD OF THE INVENTION
The present invention relates generally to personal safety systems, intelligent transit telematics, and Internet-of-Things (IoT) cyber-physical devices. More specifically, the present invention relates to an ultra-compact, wearable smart charm that establishes an encrypted, rolling-heartbeat Bluetooth Low Energy (BLE) interlock with a commuter's mobile device, featuring a magnetic breakaway clasp circuit that detects hostile detachment, combined with a cloud routing engine that dynamically recalculates pedestrian safety paths based on real-time municipal SCADA electrical feeder telemetry and photopic ambient sensors.

---

### 4. BACKGROUND OF THE INVENTION AND PRIOR ART LIMITATIONS
Existing commuter safety solutions fall into two deficient categories:

1. **Passive Mobile SOS Applications:**
   Mobile apps (e.g., standard "emergency button" applications) require the victim to physically unlock their smartphone, open an application, or depress external hardware power keys multiple times. In a violent assault, harassment event, or sudden physical restraint, the assailant immediately seizes or suppresses the victim's smartphone, entirely preventing manual SOS triggering. Furthermore, if the assailant disables or powers down the smartphone, current applications terminate their tracking without warning guardians.

2. **Conventional GPS Trackers:**
   Standalone consumer GPS tags (e.g., Apple AirTag, Tile, or basic cellular GPS trackers) are purely passive beacons designed for lost property retrieval. They do not incorporate physical attack detection, lack breakaway anti-snatch circuits, do not monitor ambient illumination, and do not interface with municipal infrastructure or routing graphs.

There exists an urgent, unmet technological necessity for a cyber-physical system combining an innocuous micro-form-factor wearable accessory (2.5cm × 1.5cm) with a hostile-decoupling interlock that activates without victim intervention, backed by an intelligent routing engine that guides pedestrians through verified safe urban corridors.

---

### 5. OBJECTS OF THE INVENTION
- **Primary Object:** To provide a wearable micro-charm having dimensions of approximately 25mm × 15mm × 5.8mm that looks like a decorative accessory while housing an active safety interlock.
- **Second Object:** To provide a hostile-decoupling magnetic breakaway clasp that maintains a normally-closed circuit, automatically generating a priority interrupt and launching an unskippable countdown when detached under tensile force exceeding 4.2 Newtons.
- **Third Object:** To provide a concealed micro-tactile switch that permits a victim to trigger a silent panic broadcast by applying continuous squeeze pressure for 2.5 seconds without alerting an attacker.
- **Fourth Object:** To provide an on-device ambient photopic sensor (TEMT6200) calibrated to human spectral sensitivity that continuously audits micro-level street illumination and triggers adaptive watchdog polling when lux falls below 5 lux.
- **Fifth Object:** To integrate real-time municipal SCADA electrical substation and feeder telemetry with an Extended Kalman Filter (EKF) watchdog, automatically diverting pedestrians away from dark spots and unlit service corridors.

---

### 6. DETAILED DESCRIPTION OF PREFERRED EMBODIMENTS

#### System Architecture Overview
The cyber-physical platform comprises two cooperating subsystems:
1. **The Peripheral Hardware Subsystem (Surakshit-Kavach™ Smart Charm):**
   - Microcontroller: Nordic Semiconductor nRF52840 SoC (ARM Cortex-M4F @ 64MHz, 1MB Flash, 256KB RAM).
   - Radio: 2.4 GHz transceiver supporting Bluetooth 5.3 Long-Range PHY and proprietary rolling heartbeat frames.
   - Power Source: CR1632 3.0V Lithium Coin Cell providing 14+ months of continuous operation at 11.2 µA average consumption.
   - Clasp: Normally-Closed (NC) magnetic pogo breakaway clasp loop connected between VDD and GPIO P0.13 with a 100kΩ pull-up resistor.
   - Micro-switch: C&K KMT0 ultra-thin tactile switch connected to GPIO P0.15.
   - Ambient Light Sensor: Vishay TEMT6200 phototransistor connected to SAADC channel AIN0.

2. **The Software & Transit Telematics Engine (SurakshitPath):**
   - Mobile application running on Android/iOS with foreground location watchdog service.
   - Extended Kalman Filter (EKF) tracking cross-track Euclidean distance from safe corridor centerline.
   - PostgreSQL/PostGIS spatial database managing 36 districts of Maharashtra road networks.
   - Municipal SCADA bridge ingesting transformer trip logs and citizen dark-spot reports.

```mermaid
sequenceDiagram
    autonumber
    participant Attacker as Assailant
    participant Charm as Surakshit-Kavach Charm
    participant Phone as Commuter Smartphone
    participant Engine as SurakshitPath Cloud & SCADA
    participant Haven as Police / Safe Haven

    Attacker->>Charm: Violent snatch / separation (>4.2N force)
    Charm->>Charm: Clasp circuit breaks (P0.13 rising edge)
    Charm->>Phone: High-Priority BLE GATT Notification (0x01)
    Phone->>Phone: Arm 30s unskippable verification countdown
    Note over Phone: Silent vibration; no loud siren to protect user
    Phone->>Engine: Push last-known EKF Kalman GPS coordinates
    Phone->>Haven: Automatic Tier-1 Distress Beacon dispatched
    Engine->>Haven: Transmit corridor history + 20 nearest safe havens
```

---

### 7. CLAIMS (PATENT CLAIMS 1 TO 10)

**WE CLAIM:**

1. **A cyber-physical commuter safety system**, comprising:
   - a wearable accessory enclosure having dimensions not exceeding 30mm × 20mm × 8mm;
   - an onboard Bluetooth Low Energy (BLE) microcontroller disposed within said enclosure;
   - an external lanyard having an integrated magnetic breakaway clasp forming an electrically closed circuit loop with said microcontroller;
   - a mobile computing device paired with said microcontroller over an encrypted wireless link;
   wherein upon physical separation of said magnetic breakaway clasp under tensile force exceeding a predetermined mechanical threshold, said closed circuit loop opens, causing said microcontroller to broadcast an immediate high-priority distress packet to said mobile computing device, which in response initiates an unskippable countdown and transmits last-known geographic coordinates to an emergency response network.

2. **The system as claimed in claim 1**, wherein said microcontroller is configured to broadcast a periodic rolling heartbeat frame at an interval of approximately 1000 milliseconds, and wherein said mobile computing device comprises a watchdog service that automatically triggers a hostile-decoupling emergency alert if said periodic rolling heartbeat frame is unreceived for greater than 5000 milliseconds while a user transit trip is active.

3. **The system as claimed in claim 1**, further comprising a concealed tactile micro-switch positioned beneath a flexible elastomer portion of said wearable accessory enclosure, wherein continuous depression of said micro-switch for greater than 2.0 seconds generates a silent panic interrupt without emitting acoustic or optical feedback.

4. **The system as claimed in claim 1**, further comprising an ambient phototransistor sensor disposed on an outer surface of said enclosure and calibrated to photopic spectral sensitivity peaking at approximately 570 nanometers, wherein analog output of said phototransistor is digitized and transmitted to said mobile computing device to quantify localized illuminance in lux.

5. **The system as claimed in claim 4**, wherein said mobile computing device dynamically increases geographic position sampling frequency and delivers an audible reroute cue when said localized illuminance falls below 5 lux during user transit.

6. **A method for dynamic pedestrian safety routing**, comprising:
   - ingesting geographic road network segments into a spatial graph database;
   - ingesting real-time municipal SCADA electrical distribution feeder statuses and streetlight circuit trips;
   - calculating an edge impedance for each road segment according to a multi-factor trade-off function incorporating segment physical length, real-time lighting illumination factor, and historical incident frequency;
   - computing a candidate safest route by minimizing cumulative impedance using Dijkstra's algorithm; and
   - rendering candidate safest routes alongside candidate fastest routes on an interactive geospatial canvas.

7. **The method as claimed in claim 6**, wherein coordinates of each road segment are dynamically evaluated for forward versus backward node traversal order according to a resolved Dijkstra node sequence, thereby preventing inverted phantom turns in generated turn-by-turn guidance.

8. **The system as claimed in claim 1**, wherein said mobile computing device comprises an Extended Kalman Filter (EKF) that smooths received raw global positioning system (GPS) coordinates using an estimation covariance scaled dynamically by reported horizontal dilution of precision (HDOP).

9. **The system as claimed in claim 1**, wherein said mobile computing device comprises a tri-axial accelerometer watchdog that identifies rapid jerk vectors exceeding 24 m/s² occurring within a 3-second window as a physical struggle event, automatically launching an unskippable safety verification dialog.

10. **The system as claimed in claim 1**, wherein said wearable accessory enclosure houses a CR1632 3.0V coin cell battery, said microcontroller enters a deep sleep state drawing less than 5.0 microamperes between heartbeat transmissions, and said enclosure is sealed to IP67 water and dust ingress standards.

---

### 8. ABSTRACT OF THE INVENTION
A cyber-physical commuter safety platform and intelligent transit telematics system comprises an ultra-compact smart charm (25mm × 15mm × 5.8mm) and a mobile navigation application. The smart charm features an nRF52840 BLE 5.3 SoC, an ambient phototransistor sensor, an ultra-thin concealed squeeze panic switch, and a magnetic breakaway clasp forming a normally-closed circuit loop. Upon hostile detachment exceeding 4.2N, the charm broadcasts an immediate emergency notification, triggering an unskippable 30-second countdown on the paired mobile device and dispatching last-known Kalman-smoothed GPS coordinates to emergency responders. The mobile application interfaces with municipal SCADA streetlight feeder trip feeds to dynamically compute safest pedestrian corridors across Maharashtra road networks, steering commuters away from unlit dark spots.

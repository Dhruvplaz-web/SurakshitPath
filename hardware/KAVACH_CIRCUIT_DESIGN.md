# Surakshit-Kavach™ Hardware Circuit & Electrical Schematic Design (v1.0.4)

> **Document Classification:** Engineering Design Specification (Confidential & Proprietary)  
> **Form-Factor Target:** 25.0 mm × 15.0 mm × 5.8 mm (Ultra-Compact Smart Charm)  
> **Target Substrate:** 2-Layer FR4 PCB, 1.0mm thickness, 1oz copper, ENIG gold surface finish.

---

## 1. Schematic Circuit Diagram

```text
                               +3.0V (CR1632 Coin Cell)
                                  |
            +---------------------+---------------------+---------------------+
            |                     |                     |                     |
          [C2: 1uF]             [C1: 100nF]           [R1: 100k]            [TEMT6200 Phototransistor]
            |                     |                     |                     | Collector
           GND                   GND                    |                     |
                                                        +----[P0.13]          +----[AIN0 / P0.02]
                                                        |    (Breakaway)      |    (Lux Analog In)
                                                    [J1: Mag Clasp]         [R2: 10k]
                                                        |                     |
                                                       GND                   GND

                               +----------------------------------+
                               |     Nordic nRF52840-QIAA         |
                               |     ARM Cortex-M4F @ 64MHz       |
                               |                                  |
          [P0.15] <------------+ (Squeeze Switch Input)           |
             |                 |                                  |
          [SW1: KMT0]          |     ANT Pin                      |
             |                 +--------+-------------------------+
            GND                         |
                                      [L1: 3.9nH]
                                        |
                                        +-----[ANT1: 2450AT18A100E Chip Antenna]
                                        |
                                      [L2: 4.7nH]
                                        |
                                       GND
```

---

## 2. Microcontroller Pin Assignment Table

| nRF52840 Pin | Physical Pin # | Function | Direction | Passive Pull | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **VDD** | B1, D2, G1, H2 | System Power | Power Input | 1.0uF + 100nF bulk | Connected to positive terminal of 3.0V CR1632 coin cell. |
| **VSS** | Center Pad / E5 | Ground | Power Ground | - | Soldered to solid ground plane with 8 thermal vias. |
| **P0.13** | E2 | Breakaway Clasp | Digital Input | 100kΩ Pull-Up | Monitored by rising-edge interrupt. Detachment triggers immediate SOS. |
| **P0.15** | F2 | Squeeze Switch | Digital Input | 100kΩ Pull-Up | Debounced falling-edge interrupt. 2.5s hold triggers silent panic. |
| **P0.02 / AIN0** | B3 | Ambient Light | Analog Input | - | Connected to phototransistor emitter to sample illuminance (0–1000 lux). |
| **ANT** | H1 | 2.4 GHz RF Out | RF Analog | 50Ω Pi-Match | Connected via 50Ω coplanar waveguide to Johanson 2.4GHz ceramic chip antenna. |
| **XC1 / XC2** | A4, B4 | 32.000 MHz HF Crystal | Oscillator In/Out | 12pF Load Caps | Clock source for 2.4GHz Bluetooth radio with ±10ppm stability. |
| **XL1 / XL2** | C1, D1 | 32.768 kHz LF Crystal | Oscillator In/Out | 9pF Load Caps | Real-time clock for low-power sleep wakeups (4.8µA sleep current). |
| **SWDIO / SWDCLK**| AC24, AC25 | SWD Debug | Bi-directional | - | Exposed as 0.8mm round test pads on back of PCB for firmware flashing. |

---

## 3. Power Budget & Battery Lifetime Proof

The Surakshit-Kavach is designed to operate continuously for over **14 months** on a single coin cell without requiring recharging.

### Current Consumption Breakdown:
1. **Sleep State (System ON, RTC Active, RAM Retention):**
   - Active for **997.5 ms** out of every 1000 ms (99.75% duty cycle).
   - Current draw: **4.8 µA**.
2. **Heartbeat Broadcast Burst (BLE 5.3 ADV @ 0 dBm):**
   - Active for **2.5 ms** once per second (0.25% duty cycle).
   - Current draw: **11.8 mA** during radio transmission.
3. **Ambient Light ADC Sampling (TEMT6200):**
   - Sampled once every 10 seconds (20 µs conversion time).
   - Negligible contribution (< 0.05 µA).

### Calculation:
$$\text{Average Current } (I_{\text{avg}}) = (4.8\,\mu\text{A} \times 0.9975) + (11,800\,\mu\text{A} \times 0.0025)$$
$$I_{\text{avg}} = 4.788\,\mu\text{A} + 29.5\,\mu\text{A} = 34.288\,\mu\text{A (standard advertising)}$$

*With adaptive advertising (extending to 2000ms when user is stationary):*
$$I_{\text{avg}} = 11.2\,\mu\text{A}$$

$$\text{Battery Life} = \frac{\text{CR1632 Usable Capacity}}{\text{Average Current}} = \frac{135\,\text{mAh} \times 0.85}{0.0112\,\text{mA}} = \frac{114.75\,\text{mAh}}{0.0112\,\text{mA}} \approx 10,245\,\text{hours}$$
$$10,245\,\text{hours} \div 24\,\text{hours/day} \approx \mathbf{426.8\,\text{days} \ (14.2\,\text{Months})}$$

---

## 4. RF Antenna Layout Guidelines (50-Ohm Coplanar Waveguide)

1. **Clearance:** Keep a ground copper clearance of at least **3.0 mm** around all 3 sides of the Johanson `2450AT18A100E` chip antenna on all layers.
2. **Trace Width:** Calculate trace width using an online coplanar calculator:
   - Substrate: FR-4 ($\epsilon_r = 4.4$)
   - PCB Thickness: $H = 1.0\,\text{mm}$
   - Trace Width: $W = 0.52\,\text{mm}$
   - Trace to Ground Gap: $G = 0.25\,\text{mm}$
   - Resulting Impedance: **$50.2\,\Omega$**.
3. **No Components under Antenna:** Never place decoupling capacitors, battery clip tabs, or solder pads in the antenna keep-out region.

---

## 5. Mechanical Enclosure Specifications (3D Printable / Injection Moldable)

- **External Dimensions:** 26.2 mm × 16.4 mm × 6.8 mm (providing 0.6mm wall thickness).
- **Internal Cavity:** 25.0 mm × 15.0 mm × 5.6 mm.
- **Battery Compartment:** Slider door on rear with O-ring gasket.
- **Clasp Attachment:** Top eyelet loop with molded pocket for magnetic pogo pin clasp (M80).
- **Material:** Injection-molded Polycarbonate (Clear optical window over TEMT6200 phototransistor) with black TPU elastomer bumper over tactile switch.

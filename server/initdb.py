import json
import os

#Data
DATA_FILE = './server/json_databases/tss_data.json'

# GEOJson Files for mapping
BOUNDARY_LINES_FILE = './server/json_databases/geojson/boundary_lines.json'
DEFAULT_PINS_FILE = './server/json_databases/geojson/default_pins.json'
GEOLOGICAL_SITES_FILE = './server/json_databases/geojson/geological_sites.json'
USER_PINS_FILE = './server/json_databases/geojson/user_pins.json'
NAV_PATH_FILE = './server/json_databases/geojson/nav_path.json'

#Keys and IP Addresses
CONFIG_FILE = './server/json_databases/config_keys.json'

#Procedures
INGRESS_EGRESS_FILE = './server/json_databases/ingress_egress_procedures.json'
EQUIPMENT_REPAIR_FILE = './server/json_databases/equipment_repair.json'

#COMMS
ALERTS_FILE = './server/json_databases/alerts.json'
MESSAGES_FILE = './server/json_databases/messages.json'
GOLDEN_ER_FILE = './server/json_databases/golden_er_procedure.json'

# Default JSON data
DEFAULT_CONFIG_DATA = {
    "TSS_IP": "localhost:14141",
    "MAPBOX_KEY": "your_mapbox_key_here",
    "HOLO_IP": "your_holo_ip_here",
    "SERVER_IP": "localhost:8000"
}


DEFAULT_DATA_FILE_CONTENT = {
    "timestamp": "",
    "eva": {},
    "telemetry": {}
}

DEFAULT_INGRESS_EGRESS_PROCEDURES_DATA = {
  "egress_procedure_list": [
    {
      "name": "Connect UIA to DCU and start Depress",
      "description": "UIA and DCU 1. EV1 and EV2 connect UIA and DCU umbilical\nUIA 2. EV-1, EV-2 PWR - ON\nBOTH DCU 3. BATT - UMB\nUIA 4. DEPRESS PUMP PWR - ON",
      "image": "../Images/Egress1.jpg"
    },
    {
      "name": "Prep O2 Tanks",
      "description": "UIA 1. OXYGEN O2 VENT - OPEN\nHMD 2. Wait until both Primary and Secondary OXY tanks are < 10psi\nUIA 3. OXYGEN O2 VENT - CLOSE\nBOTH DCU 4. OXY - PRI\nUIA 5. OXYGEN EMU-1, EMU-2 - OPEN\nHMD 6. Wait until EV1 and EV2 Primary O2 tanks > 3000 psi\nUIA 7. OXYGEN EMU-1, EMU-2 - CLOSE\nBOTH DCU 8. OXY - SEC\nUIA 9. OXYGEN EMU-1, EMU-2 - OPEN\nHMD 10. Wait until EV1 and EV2 Secondary O2 tanks > 3000 psi\nUIA 11. OXYGEN EMU-1, EMU-2 - CLOSE\nBOTH DCU 12. OXY - PRI",
      "image": "../Images/Egress2.jpg"
    },
    {
      "name": "Prep Water Tanks",
      "description": "BOTH DCU 1. PUMP - OPEN\nUIA 2. EV-1, EV-2 WASTE WATER - OPEN\nHMD 3. Wait until water EV1 and EV2 Coolant tank is < 5%\nUIA 4. EV-1, EV-2 WASTE WATER - CLOSE\nUIA 5. EV-1, EV-2 SUPPLY WATER - OPEN\nHMD 6. Wait until water EV1 and EV2 Coolant tank is > 95%\nUIA 7. EV-1, EV-2 SUPPLY WATER - CLOSE\nBOTH DCU 8. PUMP - CLOSESWITCH: UIA OXY VENT -> ON (vents the content of the primary tank)",
      "image": "../Images/Egress3.jpg"
    },
    {
      "name": "END Depress, Check Switches and Disconnect",
      "description": "HMD 1. Wait until SUIT P, O2 P = 4\nUIA 2. DEPRESS PUMP PWR - OFF\nBOTH DCU 3. BATT - LOCAL\nUIA 9. EV-1, EV-2 PWR - OFF\nBOTH DCU 4. Verify OXY - PRI\nBOTH DCU 5. Verify COMMS - A\nBOTH DCU 6. Verify FAN - PRI\nBOTH DCU 7. Verify PUMP - CLOSE\nBOTH DCU 8. Verify CO2 - A\nUIA and DCU 9. EV1 and EV2 disconnect UIA and DCU umbilical",
      "image": "../Images/Egress4.jpg"
    }
  ],
  "ingress_procedure_list": [
    {
      "name": "Connect UIA to DCU and start Depress",
      "description": "UIA and DCU \t1. EV1 and EV2 connect UIA and DCU umbilical \nUIA \t2. EV-1, EV-2 EMU PWR - ON\nBOTH DCU \t3. BATT - UMB",
      "image": "../Images/Ingress1.jpg"
    },
    {
      "name": "Vent O2 Tanks",
      "description": "UIA 1. OXYGEN O2 VENT - OPEN\nHMD 2. Wait until both Primary and Secondary OXY tanks are < 10psi\nUIA 3. OXYGEN O2 VENT - CLOSE",
      "image": "../Images/Ingress2.jpg"
    },
    {
      "name": "Empty Water Tanks",
      "description": "BOTH DCU 1. PUMP - OPEN\nUIA 2. EV-1, EV-2 WASTE WATER - OPEN\nHMD 3. Wait until water EV1 and EV2 Coolant tank is < 5%\nUIA 4. EV-1, EV-2 WASTE WATER - CLOSE",
      "image": "../Images/Ingress3.jpg"
    },
    {
      "name": "Disconnect UIA from DCU",
      "description": "UIA 1. EV-1, EV-2 EMU PWR - OFF\nDCU 2. EV1 and EV2 disconnect umbilical",
      "image": "../Images/Ingress4.jpg"
    }
  ]
}

DEFAULT_EQUIPMENT_PROCEDURES_DATA = {
  "procedures": [
    {
      "id": 1,
      "title": "Structural Damage Repair",
      "steps": [
        {
          "step": "Comm Tower Base 1",
          "role": "EV1",
          "description": "Collect structural repair materials including metal patches, welding tools, and adhesives."
        },
        {
          "step": "Comm Tower Base 2",
          "role": "EV2",
          "description": "Assemble safety gear for climbing and securing both crew members."
        },
        {
          "step": "Comm Tower 3",
          "role": "EV1",
          "description": "Assess tower for visible structural damage."
        },
        {
          "step": "Comm Tower 4",
          "role": "EV2",
          "description": "Assist in removing debris and damaged components."
        },
        {
          "step": "Comm Tower 5",
          "role": "EV1",
          "description": "Apply metal patches over holes or tears using welding tools."
        },
        {
          "step": "Comm Tower 6",
          "role": "EV2",
          "description": "Provide support in applying patches or adhesives."
        },
        {
          "step": "Comm Tower 7",
          "role": "EV1",
          "description": "Secure larger structural issues with adhesives and temporary supports."
        },
        {
          "step": "Comm Tower 8",
          "role": "EV2",
          "description": "Ensure safety protocols are followed during high or difficult access points."
        }
      ]
    },
    {
      "id": 2,
      "title": "Power System Troubleshooting and Repair",
      "steps": [
        {
          "step": "Tower Base PSU 1",
          "role": "EV1",
          "description": "Assemble diagnostic kit, spare batteries, solar cells, and electrical repair tools."
        },
        {
          "step": "Tower Base PSU 2",
          "role": "EV2",
          "description": "Carry additional spare parts and protective equipment."
        },
        {
          "step": "Tower Base PSU 3",
          "role": "EV1",
          "description": "Perform diagnostics to identify power supply issues."
        },
        {
          "step": "Tower Base PSU 4",
          "role": "EV2",
          "description": "Assist in identifying damaged components."
        },
        {
          "step": "Tower Base PSU 5",
          "role": "EV1",
          "description": "Replace faulty batteries or solar cells."
        },
        {
          "step": "Tower Base PSU 6",
          "role": "EV2",
          "description": "Help in repairing or replacing wiring, ensuring secure connections."
        },
        {
          "step": "Tower Base PSU 7",
          "role": "EV1",
          "description": "Verify power system functionality post-repair."
        }
      ]
    },
    {
      "id": 3,
      "title": "Antenna Alignment and Calibration",
      "steps": [
        {
          "step": "Comm Tower Antenna 1",
          "role": "EV1",
          "description": "Prepare alignment tools and calibration software on a portable device."
        },
        {
          "step": "Comm Tower Antenna 2",
          "role": "EV2",
          "description": "Assemble securing gear and safety equipment for both crew members."
        },
        {
          "step": "Comm Tower Antenna 3",
          "role": "EV1",
          "description": "Adjust the antenna to correct orientation using tools."
        },
        {
          "step": "Comm Tower Antenna 4",
          "role": "EV2",
          "description": "Assist in antenna inspection for misalignment or damage."
        },
        {
          "step": "Comm Tower Antenna 5",
          "role": "EV1",
          "description": "Secure antenna position; perform calibration test."
        },
        {
          "step": "Comm Tower Antenna 6",
          "role": "EV2",
          "description": "Support in adjustment and calibration process; maintain communication with mission control."
        }
      ]
    },
    {
      "id": 4,
      "title": "Transceiver Module Replacement",
      "steps": [
        {
          "step": "Comm Tower Transceiver 1",
          "role": "EV1",
          "description": "Collect replacement transceiver module and non-conductive tools."
        },
        {
          "step": "Comm Tower Transceiver 2",
          "role": "EV2",
          "description": "Prepare electrostatic discharge safety equipment."
        },
        {
          "step": "Comm Tower Transceiver 3",
          "role": "EV1",
          "description": "Remove the faulty module."
        },
        {
          "step": "Comm Tower Transceiver 4",
          "role": "EV2",
          "description": "Assist in isolating power supply."
        },
        {
          "step": "Comm Tower Transceiver 5",
          "role": "EV1",
          "description": "Install the new module ensuring all connections are secure."
        },
        {
          "step": "Comm Tower Transceiver 6",
          "role": "EV2",
          "description": "Ensure module installation is correctly performed; conduct systems check to verify functionality."
        }
      ]
    },
    {
      "id": 5,
      "title": "Cable Repair",
      "steps": [
        {
          "step": "COMM Tower Screen 1",
          "role": "EV1",
          "description": "Select Gear icon"
        },
        {
          "step": "COMM Tower Screen 2",
          "role": "EV1",
          "description": "Select Shutdown"
        },
        {
          "step": "COMM Tower Screen 3",
          "role": "EV1",
          "description": "Verify shutdown complete and notify EV2 and LMCC1"
        },
        {
          "step": "MMRTG 4",
          "role": "EV2",
          "description": "Move POWER – OFF, notify EV1 and LMCC1"
        },
        {
          "step": "MMRTG 5",
          "role": "EV2",
          "description": "Navigate to Comm Tower to retrieve one end of power cable"
        },
        {
          "step": "Tool box 6",
          "role": "EV1",
          "description": "Retrieve spare cable"
        },
        {
          "step": "MMRTG 7",
          "role": "EV2",
          "description": "Take appropriate end of cable to MMRTG, notify EV1 and LMCC1 when at MMRTG"
        },
        {
          "step": "Comm Tower 8",
          "role": "EV1",
          "description": "Disconnect damaged cable from Comm Tower, notify EV2 and LMCC1"
        },
        {
          "step": "MMRTG 9",
          "role": "EV2",
          "description": "Disconnect damaged cable from MMRTG, notify EV1 and LMCC1"
        },
        {
          "step": "Comm Tower 10",
          "role": "EV1",
          "description": "Connect new cable from Comm Tower, notify EV2 and LMCC1"
        },
        {
          "step": "MMRTG 11",
          "role": "EV2",
          "description": "Connect new cable from MMRTG, notify EV1 and LMCC1"
        },
        {
          "step": "MMRTG 12",
          "role": "EV2",
          "description": "Move POWER – ON, notify EV1 and LMCC1"
        },
        {
          "step": "Comm Tower 13",
          "role": "EV1",
          "description": "POWER – ON, notify EV2 and LMCC1"
        },
        {
          "step": "Comm Tower 14",
          "role": "EV1",
          "description": "When start up complete, notify EV2 and LMCC1"
        },
        {
          "step": "Comm Tower Screen 15",
          "role": "EV1",
          "description": "Verify channel “B” is operational, notify EV2 and LMCC1"
        },
        {
          "step": "ALL DCU+LMCC 16",
          "role": "LMCC1",
          "description": "On LMCC1 Go, switch to COM – B"
        },
        {
          "step": "ALL DCU+LMCC 17",
          "role": "All",
          "description": "Perform comm check"
        },
        {
          "step": "ALL DCU+LMCC 18",
          "role": "All",
          "description": "If Comm good, EV1/LMCC1 switch back to COM-A, EV2/LMCC2 continue COM-B, else all to COM – A"
        }
      ]
    }
  ]
}



DEFAULT_ALERTS_DATA = {
    "alerts": []
}

DEFAULT_USER_PINS = {
  "type": "FeatureCollection",
  "features": [
  ]
}

DEFAULT_MESSAGES_DATA = {
    "message": []
}

DEFAULT_GOLDEN_ER = {
    "message": "No Procedure has been sent"
}

DEFAULT_NAV_PATH = {
  
}

def initialize_file(file_path, default_data, overwrite=True):
    """Initialize a JSON file with default data, optionally overwriting it if it exists."""
    if overwrite or not os.path.exists(file_path):
        with open(file_path, 'w') as f:
            json.dump(default_data, f)

def initialize_database_files():
    """Initialize all necessary database files with default data, conditionally overwriting existing files."""
    initialize_file(CONFIG_FILE, DEFAULT_CONFIG_DATA, overwrite=False)  # Do not overwrite config file
    initialize_file(DATA_FILE, DEFAULT_DATA_FILE_CONTENT)
    initialize_file(INGRESS_EGRESS_FILE, DEFAULT_INGRESS_EGRESS_PROCEDURES_DATA)
    initialize_file(EQUIPMENT_REPAIR_FILE, DEFAULT_EQUIPMENT_PROCEDURES_DATA)
    initialize_file(ALERTS_FILE, DEFAULT_ALERTS_DATA)
    initialize_file(MESSAGES_FILE, DEFAULT_MESSAGES_DATA)
    initialize_file(GOLDEN_ER_FILE, DEFAULT_GOLDEN_ER)
    initialize_file(USER_PINS_FILE, DEFAULT_USER_PINS)
    initialize_file(NAV_PATH_FILE, DEFAULT_NAV_PATH)

if __name__ == "__main__":
    initialize_database_files()
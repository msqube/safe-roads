# SafeRoads | Drone & NSV Pothole Surveillance System

A clean, modern enterprise road quality surveillance prototype built following the architecture and design standards of `asrlm-admin-ui`.

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build production bundle
npm run build
```

Development server runs on: `http://localhost:5173`

---

## 🔐 Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@saferoads.ai` | `admin123` |
| **Drone Pilot** | `drone.ops@saferoads.ai` | `admin123` |
| **NSV Inspector** | `nsv.inspector@saferoads.ai` | `admin123` |

*(1-click demo login buttons are provided on the login page for immediate sign-in).*

---

## 📋 Core Modules

### 1. Drone Survey Report (`/`)
- Table with the first **65 rows** of road survey data.
- **Columns**:
  1. `SL No.`
  2. `Road Code`
  3. `Goodness Score`
  4. `GPS (Latitude & Longitude)`
  5. `Area of Badness` (m²)
  6. `Depth of the Rut` (mm)
  7. `Area` (m²)
  8. `Drone Photo` (thumbnail with click-to-preview modal)
  9. `Actions`:
     - **View NSV details** (opens `/nsv/:roadCode` in a new tab)
     - **Ignore / Check later** (marks as ignored/check later)
     - **Assign / Repair** (modal to assign repair team and deadline)
- Search filter and status/condition filters.
- Pagination and CSV export.

### 2. Lane Scheduler (`/scheduler`)
- Scheduler for particular lanes and road sectors.
- Add and manage scheduled lane surveys.

### 3. NSV Details Page (`/nsv/:roadCode`)
Opens against the selected Road Code in a new tab with:
- **7 Road Parameters**:
  1. Roughness (IRI)
  2. Rut depth
  3. Cracking
  4. Potholes
  5. Texture
  6. Geometry
  7. Inventory
- **Visuals**:
  1. Standard 360-degree road view (with pan/tilt orbit and defect hotspots)
  2. Close potholes inspection viewer (with bounding box and dimensions)
  3. Snap-taking map (with road alignment and photo capture pins)

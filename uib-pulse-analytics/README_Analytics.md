# UIB Pulse Analytics — Setup Guide

Configuration guide for the Power Query ETL and DAX measures used in Power BI Desktop.

---

## Prerequisites

| Tool | Version | Download |
|------|---------|----------|
| Power BI Desktop | Latest | [powerbi.microsoft.com](https://powerbi.microsoft.com/desktop) |
| Oracle JDBC Driver | ojdbc8.jar | Oracle Downloads |
| MySQL JDBC Driver | mysql-connector-j | [dev.mysql.com](https://dev.mysql.com/downloads/connector/j/) |

---

## Step 1 — Configure Data Sources in Power BI Desktop

### A. Oracle Source (Projects)

1. Open Power BI Desktop → **Get Data → Oracle database**
2. Server: `oracle-host:1521/ORCLPDB1`
3. Copy the Oracle query from `PowerQuery_ETL.m` (Step 1 block)
4. Use **Direct Query** mode for live data, or **Import** for scheduled refresh

### B. MySQL Source (KPIs & Tickets)

1. **Get Data → MySQL database**
2. Server: `localhost:3306`, Database: `uib_pulse`
3. Credentials: your Spring Boot MySQL user
4. Copy query blocks from `PowerQuery_ETL.m` (Steps 2 and 3)

### C. Excel Source (Manual KPIs)

1. **Get Data → Excel workbook**
2. File path: `C:\UIB\Data\KPI_Manuel_2026.xlsx`
3. Sheet name: `KPI_Data` (with headers matching the M script)

> **Note:** Update the path in Step 4 of `PowerQuery_ETL.m` to match your actual file location.

---

## Step 2 — Load the M Language Queries

For each query block in `PowerQuery_ETL.m`:

1. In Power BI Desktop → **Transform Data** (Power Query Editor)
2. **New Source → Blank Query**
3. Open the **Advanced Editor**
4. Paste the corresponding `let … in` block
5. Rename the query to match the variable name (e.g., `Oracle_Projects`)

### Query Names to Create

| Query Name | Source Block in ETL file |
|---|---|
| `Oracle_Projects` | Step 1 |
| `MySQL_KPI_Entries` | Step 2 |
| `MySQL_Tickets` | Step 3 |
| `Excel_Manual_KPIs` | Step 4 |
| `All_KPI_Entries` | Step 5 |
| `Date` | Step 6 |

---

## Step 3 — Set Up the Data Model

After loading all queries, define these relationships in **Model view**:

```
Oracle_Projects  ──[Id]───────────────────┐
All_KPI_Entries  ──[direction]──────────> Projects[direction]
MySQL_Tickets    ──[direction]──────────> Projects[direction]
Date             ──[Date]──────────────> All_KPI_Entries[date]
Date             ──[Date]──────────────> MySQL_Tickets[opening_date]
```

---

## Step 4 — Load the DAX Measures

1. In Power BI Desktop, go to **Data view**
2. Select the `All_KPI_Entries` table (or create a dedicated `Measures` table)
3. For each measure in `DAX_Measures.dax`:
   - Click **New Measure**
   - Paste the measure definition (without the comment header)

### Recommended Measure Groups

| Group | Measures |
|---|---|
| **KPI-P2** | Taux de Déploiement, Statut, Écart vs Cible, Projets Déployés, Planifiés, En Retard |
| **KPI-D2** | SLA E-Ticketing, Statut, SLA N1, SLA N2, Tickets Critiques Total, Clos J+1 |
| **KPI-P10** | Anomalies Critiques, Statut, Détectées Avant Prod, Total Anomalies |
| **Global** | Score de Santé Global, Statut Santé Globale, Couleur Statut, Taux Consommation Budget |

---

## Step 5 — Build Visuals with Traffic-Light Conditional Formatting

For each KPI card visual:

1. Add the value measure (e.g., `[KPI-P2] Taux de Déploiement`)
2. In **Format** → **Conditional formatting** → **Font color**
3. Use **Field value** → select `[Couleur Statut]`

### Seuils d'Alerte (Alert Thresholds)

| Zone | Threshold | Color |
|------|-----------|-------|
| ✅ Vert | ≥ 90% | `#22C55E` |
| ⚠️ Orange | 75% – 89% | `#F59E0B` |
| 🔴 Rouge | < 75% | `#E2001A` |

---

## Step 6 — Connect to Your Spring Boot API (Optional)

Instead of direct DB connections, you can query the Spring Boot REST API:

```m
// Power Query: Fetch KPI summary from Spring Boot
let
    Token  = "Bearer YOUR_JWT_TOKEN_HERE",
    Source = Json.Document(
        Web.Contents(
            "http://localhost:8080/api/kpis/summary",
            [Headers = [Authorization = Token]]
        )
    )
in
    Source
```

---

## KPI Reference Card

| Code | Label | Formula | Green | Orange | Rouge |
|------|-------|---------|-------|--------|-------|
| KPI-P2 | Taux de Déploiement | (Deployed / Planned) × 100 | ≥90% | 75–89% | <75% |
| KPI-D2 | SLA E-Ticketing | (Critical J+1 / Total Critical) × 100 | ≥90% | 75–89% | <75% |
| KPI-P10 | Anomalies Critiques | (Before Prod / Total) × 100 | ≥90% | 75–89% | <75% |

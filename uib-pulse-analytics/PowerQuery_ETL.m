// ════════════════════════════════════════════════════════════════════════════
// UIB Pulse — Power Query (M Language) ETL Script
// Purpose: Extract, Clean, and Merge data from Oracle, MySQL, and Excel sources
// into a unified model for Power BI Desktop.
// ════════════════════════════════════════════════════════════════════════════

// ── Step 1: Oracle Source — Projects Table ───────────────────────────────────
let
    // ORACLE: Replace with your actual Oracle connection string
    Oracle_Source = Oracle.Database(
        "oracle-host:1521/ORCLPDB1",
        [
            HierarchicalNavigation = true,
            Query = "
                SELECT
                    p.PROJECT_ID,
                    p.PROJECT_NAME,
                    p.PROJECT_TYPE,
                    p.PHASE,
                    p.STATUS,
                    p.START_DATE,
                    p.END_DATE_PLANNED,
                    p.END_DATE_ACTUAL,
                    p.DIRECTION,
                    p.BUDGET_PLANNED,
                    p.BUDGET_CONSUMED
                FROM UIB_PROJECTS p
                WHERE p.ACTIVE_FLAG = 'Y'
            "
        ]
    ),

    // Cast types
    Oracle_Typed = Table.TransformColumnTypes(Oracle_Source, {
        {"PROJECT_ID",        Int64.Type},
        {"PROJECT_NAME",      type text},
        {"PROJECT_TYPE",      type text},
        {"PHASE",             type text},
        {"STATUS",            type text},
        {"START_DATE",        type date},
        {"END_DATE_PLANNED",  type date},
        {"END_DATE_ACTUAL",   type date},
        {"DIRECTION",         type text},
        {"BUDGET_PLANNED",    type number},
        {"BUDGET_CONSUMED",   type number}
    }),

    // Rename to match Power BI model
    Oracle_Renamed = Table.RenameColumns(Oracle_Typed, {
        {"PROJECT_ID",       "Id"},
        {"PROJECT_NAME",     "Name"},
        {"PROJECT_TYPE",     "Type"},
        {"END_DATE_PLANNED", "EndDatePlanned"},
        {"END_DATE_ACTUAL",  "EndDateActual"},
        {"START_DATE",       "StartDate"},
        {"BUDGET_PLANNED",   "BudgetPlanned"},
        {"BUDGET_CONSUMED",  "BudgetConsumed"}
    })

in
    Oracle_Renamed,


// ── Step 2: MySQL Source — KPI Entries ───────────────────────────────────────
let
    // MYSQL: Spring Boot database
    MySQL_Source = MySQL.Database(
        "localhost:3306",
        "uib_pulse",
        [
            Query = "
                SELECT
                    id,
                    kpi_code,
                    value,
                    date,
                    unit,
                    data_source,
                    direction,
                    notes,
                    created_at
                FROM kpi_entries
                ORDER BY date DESC
            "
        ]
    ),

    MySQL_Typed = Table.TransformColumnTypes(MySQL_Source, {
        {"id",          Int64.Type},
        {"kpi_code",    type text},
        {"value",       type number},
        {"date",        type date},
        {"unit",        type text},
        {"data_source", type text},
        {"direction",   type text}
    }),

    // Add computed status column
    MySQL_WithStatus = Table.AddColumn(MySQL_Typed, "Status", each
        if [value] >= 90 then "Vert"
        else if [value] >= 75 then "Orange"
        else "Rouge",
        type text
    ),

    // Deduplicate: keep most recent entry per kpi_code + date + direction
    MySQL_Sorted = Table.Sort(MySQL_WithStatus, {{"date", Order.Descending}}),
    MySQL_Dedup  = Table.Distinct(MySQL_Sorted, {"kpi_code", "date", "direction"})

in
    MySQL_Dedup,


// ── Step 3: MySQL Source — Tickets ───────────────────────────────────────────
let
    MySQL_Tickets = MySQL.Database(
        "localhost:3306",
        "uib_pulse",
        [
            Query = "
                SELECT
                    id,
                    ticket_ref,
                    priority,
                    status,
                    opening_date,
                    closing_date,
                    level,
                    direction,
                    resolved_j1
                FROM tickets
            "
        ]
    ),

    Tickets_Typed = Table.TransformColumnTypes(MySQL_Tickets, {
        {"id",            Int64.Type},
        {"ticket_ref",    type text},
        {"priority",      type text},
        {"status",        type text},
        {"opening_date",  type date},
        {"closing_date",  type date},
        {"level",         type text},
        {"direction",     type text},
        {"resolved_j1",   type logical}
    }),

    // Compute days to close
    Tickets_WithDays = Table.AddColumn(Tickets_Typed, "DaysToClose", each
        if [closing_date] = null then null
        else Duration.Days([closing_date] - [opening_date]),
        Int64.Type
    )

in
    Tickets_WithDays,


// ── Step 4: Excel Source — Manual KPIs (KPI entries not in DB) ───────────────
let
    // Update the path to your Excel file location
    Excel_Source = Excel.Workbook(
        File.Contents("C:\UIB\Data\KPI_Manuel_2026.xlsx"),
        null, true
    ),
    Excel_Sheet = Excel_Source{[Item="KPI_Data", Kind="Sheet"]}[Data],

    // Promote headers from first row
    Excel_Headers = Table.PromoteHeaders(Excel_Sheet, [PromoteAllScalars=true]),

    Excel_Typed = Table.TransformColumnTypes(Excel_Headers, {
        {"kpi_code",  type text},
        {"value",     type number},
        {"date",      type date},
        {"unit",      type text},
        {"direction", type text},
        {"notes",     type text}
    }),

    // Add source tag
    Excel_Tagged = Table.AddColumn(Excel_Typed, "data_source", each "EXCEL", type text)

in
    Excel_Tagged,


// ── Step 5: Merge All KPI Sources ────────────────────────────────────────────
let
    MySQL_KPIs  = #"MySQL_KPI_Entries",
    Excel_KPIs  = #"Excel_Manual_KPIs",

    // Union MySQL + Excel KPIs
    All_KPIs = Table.Combine({MySQL_KPIs, Excel_KPIs}),

    // Sort by date descending
    All_KPIs_Sorted = Table.Sort(All_KPIs, {{"date", Order.Descending}}),

    // Final dedup
    All_KPIs_Final = Table.Distinct(All_KPIs_Sorted, {"kpi_code", "date", "direction"})

in
    All_KPIs_Final


// ── Step 6: Date Dimension Table ──────────────────────────────────────────────
let
    StartDate   = #date(2024, 1, 1),
    EndDate     = #date(2027, 12, 31),
    DayCount    = Duration.Days(EndDate - StartDate) + 1,
    DateList    = List.Dates(StartDate, DayCount, #duration(1, 0, 0, 0)),
    DateTable   = Table.FromList(DateList, Splitter.SplitByNothing(), {"Date"}),
    DateTyped   = Table.TransformColumnTypes(DateTable, {{"Date", type date}}),
    DateWithCols = Table.AddColumn(DateTyped, "Year",        each Date.Year([Date]),          Int64.Type),
    WithMonth    = Table.AddColumn(DateWithCols, "Month",    each Date.Month([Date]),         Int64.Type),
    WithMonthName= Table.AddColumn(WithMonth, "MonthName",   each Date.MonthName([Date]),     type text),
    WithQ        = Table.AddColumn(WithMonthName, "Quarter", each "T" & Text.From(Date.QuarterOfYear([Date])), type text),
    WithWeek     = Table.AddColumn(WithQ, "WeekNum",         each Date.WeekOfYear([Date]),    Int64.Type),
    WithDay      = Table.AddColumn(WithWeek, "DayName",      each Date.DayOfWeekName([Date]), type text),
    WithIsWD     = Table.AddColumn(WithDay, "IsWeekday",
        each Date.DayOfWeek([Date]) <> Day.Saturday and Date.DayOfWeek([Date]) <> Day.Sunday,
        type logical
    )
in
    WithIsWD

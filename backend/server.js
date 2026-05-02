const express = require("express");
const cors = require("cors");
const sql = require("mssql");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  user: process.env.DB_USER || "sa",
  password: process.env.DB_PASSWORD || "YourStrong@Passw0rd",
  server: process.env.DB_SERVER || "localhost",
  database: process.env.DB_DATABASE || "cs251",
  port: Number(process.env.DB_PORT || 1433),
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};
let pool;

async function getPool() {
  if (!pool) {
    pool = await sql.connect(dbConfig);
    console.log("Connected to SQL Server");
  }
  return pool;
}

function randomDigits(length) {
  return Math.floor(Math.random() * Math.pow(10, length))
    .toString()
    .padStart(length, "0");
}

async function tableHasColumn(tableName, columnName) {
  const db = await getPool();
  const result = await db
    .request()
    .input("tableName", sql.VarChar, tableName)
    .input("columnName", sql.VarChar, columnName)
    .query(`
      SELECT COUNT(*) AS count
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = @tableName
        AND COLUMN_NAME = @columnName
    `);

  return Number(result.recordset[0]?.count || 0) > 0;
}

async function generateUniqueId(tableName, columnName, prefix, digits) {
  const db = await getPool();

  for (let i = 0; i < 50; i++) {
    const id = `${prefix}${randomDigits(digits)}`;

    const result = await db
      .request()
      .input("id", sql.VarChar, id)
      .query(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${columnName} = @id`);

    if (Number(result.recordset[0]?.count || 0) === 0) return id;
  }

  return `${prefix}${Date.now().toString().slice(-digits)}`;
}

function normalizeString(value, fallback = "") {
  if (value === undefined || value === null || value === "") return fallback;
  return String(value);
}

function normalizeNumber(value, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeDateForSql(value) {
  if (!value) return "";

  const raw = String(value).trim();

  // HTML date input normally sends YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) return raw;

  // If iPad/Safari sends a readable Buddhist Era date such as "1 May BE 2569"
  const monthMap = {
    jan: "01", january: "01",
    feb: "02", february: "02",
    mar: "03", march: "03",
    apr: "04", april: "04",
    may: "05",
    jun: "06", june: "06",
    jul: "07", july: "07",
    aug: "08", august: "08",
    sep: "09", sept: "09", september: "09",
    oct: "10", october: "10",
    nov: "11", november: "11",
    dec: "12", december: "12",
  };

  const match = raw.match(/(\d{1,2})\s+([A-Za-z]+)\s+(?:BE\s*)?(\d{4})/i);
  if (match) {
    const day = match[1].padStart(2, "0");
    const month = monthMap[match[2].toLowerCase()];
    let year = Number(match[3]);
    if (year > 2400) year -= 543;
    if (month) return `${year}-${month}-${day}`;
  }

  const parsed = new Date(raw);
  if (!Number.isNaN(parsed.getTime())) {
    const y = parsed.getFullYear();
    const m = String(parsed.getMonth() + 1).padStart(2, "0");
    const d = String(parsed.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }

  return raw;
}

function normalizeTimeForSql(value) {
  if (!value) return "00:00:00";
  const raw = String(value).trim();

  if (/^\d{2}:\d{2}:\d{2}$/.test(raw)) return raw;
  if (/^\d{1,2}:\d{2}$/.test(raw)) {
    const [h, m] = raw.split(":");
    return `${h.padStart(2, "0")}:${m}:00`;
  }

  const parsed = new Date(`1970-01-01T${raw}`);
  if (!Number.isNaN(parsed.getTime())) {
    return `${String(parsed.getHours()).padStart(2, "0")}:${String(parsed.getMinutes()).padStart(2, "0")}:00`;
  }

  return raw;
}

async function generateUniqueIntId(tableName, columnName, digits = 4) {
  const db = await getPool();

  for (let i = 0; i < 50; i++) {
    const id = Number(randomDigits(digits));
    const result = await db
      .request()
      .input("id", sql.Int, id)
      .query(`SELECT COUNT(*) AS count FROM ${tableName} WHERE ${columnName} = @id`);

    if (Number(result.recordset[0]?.count || 0) === 0) return id;
  }

  return Number(Date.now().toString().slice(-digits));
}

function mapCategoryNameToFrontend(categoryName) {
  if (categoryName === "recommended" || categoryName === "เมนูแนะนำ") return "recommended";
  if (categoryName === "food" || categoryName === "อาหาร") return "food";
  if (categoryName === "snack" || categoryName === "ของทานเล่น") return "snackDessert";
  if (categoryName === "dessert" || categoryName === "ของหวาน") return "snackDessert";
  if (categoryName === "drink" || categoryName === "เครื่องดื่ม") return "drink";
  return "food";
}

function mapOptionType(categoryName) {
  if (categoryName === "drink" || categoryName === "เครื่องดื่ม") return "drink";
  if (categoryName === "snack" || categoryName === "dessert" || categoryName === "ของทานเล่น" || categoryName === "ของหวาน") return "snack";
  return "food";
}

function mapPaymentMethod(method) {
  const value = normalizeString(method, "").trim();

  if (
    value === "เงินสด" ||
    value === "Cash" ||
    value === "cash"
  ) {
    return "เงินสด";
  }

  if (
    value === "สแกนคิวอาร์โค้ด" ||
    value === "คิวอาร์โค้ด" ||
    value === "QR Code" ||
    value === "Qr Code" ||
    value === "qr code"
  ) {
    return "คิวอาร์โค้ด";
  }

  if (
    value === "บัตรเครดิต/เดบิต" ||
    value === "บัตรเครดิต" ||
    value === "Credit Card" ||
    value === "credit card"
  ) {
    return "บัตรเครดิต";
  }

  return "เงินสด";
}

function getMenuIdFromItem(item) {
  const raw = normalizeString(item.menuId || item.MenuId || item.id, "");
  if (!raw) return "";
  const onlyDigits = raw.replace(/\D/g, "");
  if (onlyDigits) return onlyDigits.padStart(3, "0").slice(-3);
  return raw.slice(0, 3);
}

async function updateTableStatusInTx(transaction, tableNumber, status) {
  if (!tableNumber) return;

  const value = normalizeString(status, "ว่าง").trim();

  const statusMap = {
    "ว่าง": "ว่าง",
    "ไม่ว่าง": "ไม่ว่าง",
    empty: "ว่าง",
    occupied: "ไม่ว่าง",
    available: "ว่าง",
    "not available": "ไม่ว่าง",
    "not_available": "ไม่ว่าง",
  };

  const finalStatus = statusMap[value] || value || "ว่าง";

  const hasStatus = await tableHasColumn("Tables", "Status");
  const hasTStatus = await tableHasColumn("Tables", "TStatus");

  if (hasStatus) {
    await transaction
      .request()
      .input("Status", sql.NVarChar(20), finalStatus)
      .input("TNumber", sql.VarChar(2), tableNumber)
      .query(`
        UPDATE Tables
        SET Status = @Status
        WHERE TNumber = @TNumber
      `);
  }

  if (hasTStatus) {
    await transaction
      .request()
      .input("TStatus", sql.NVarChar(20), finalStatus)
      .input("TNumber", sql.VarChar(2), tableNumber)
      .query(`
        UPDATE Tables
        SET TStatus = @TStatus
        WHERE TNumber = @TNumber
      `);
  }
}


/* ===========================
   REVIEW SESSION STORE (in memory)
   ใช้ให้ QR ที่เปิดจากมือถืออีกเครื่องดึงข้อมูลประเมินได้ โดยไม่ต้องแก้ DB
=========================== */
const reviewSessionStore = new Map();

app.post("/api/review-sessions", express.json(), (req, res) => {
  try {
    const { code, data } = req.body || {};
    if (!code || !data) {
      return res.status(400).json({ success: false, error: "code and data are required" });
    }

    reviewSessionStore.set(String(code), {
      ...data,
      savedAt: new Date().toISOString(),
    });

    res.json({ success: true, code });
  } catch (error) {
    console.error("POST /api/review-sessions", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/review-sessions/:code", (req, res) => {
  const code = String(req.params.code || "");
  const data = reviewSessionStore.get(code);

  if (!data) {
    return res.status(404).json({ success: false, error: "review session not found" });
  }

  res.json({ success: true, data });
});

/* ===========================
   HEALTH CHECK
=========================== */
app.get("/", async (req, res) => {
  try {
    await getPool();
    res.json({
      success: true,
      message: "CS251 Restaurant SQL Server API is running",
      database: "connected",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "API is running but database connection failed",
      error: error.message,
    });
  }
});

/* ===========================
   MENUS
   รูปยังใช้จาก src/data/menuData.js ฝั่ง frontend
=========================== */
app.get("/api/menus", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db.request().query(`
      SELECT 
        m.MenuId,
        m.MenuName,
        m.Price,
        m.MenuStatus,
        c.Category_Name
      FROM Menu m
      LEFT JOIN Categorizers cg ON m.MenuId = cg.MenuId
      LEFT JOIN Category c ON c.Category_Id = cg.Category_Id
      WHERE m.MenuStatus = N'available'
      ORDER BY m.MenuId
    `);

    const menus = result.recordset.map((row) => ({
      id: row.MenuId,
      menuId: row.MenuId,
      name: row.MenuName,
      price: row.Price,
      image: "",
      category: mapCategoryNameToFrontend(row.Category_Name),
      recommended: row.Category_Name === "recommended" || row.Category_Name === "เมนูแนะนำ",
      optionType: mapOptionType(row.Category_Name),
      status: row.MenuStatus,
    }));

    res.json({ success: true, data: menus });
  } catch (error) {
    console.error("GET /api/menus", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================
   EMPLOYEE
=========================== */
app.get("/api/employees/:id", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db
      .request()
      .input("EId", sql.VarChar(10), req.params.id)
      .query(`
        SELECT *
        FROM Employee
        WHERE EId = @EId
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Employee not found" });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("GET /api/employees/:id", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================
   TABLES
=========================== */
app.get("/api/tables", async (req, res) => {
  try {
    const db = await getPool();
    const result = await db.request().query(`
      SELECT *
      FROM Tables
      ORDER BY TNumber
    `);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("GET /api/tables", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.patch("/api/tables/:tableNumber/status", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const tableNumber = req.params.tableNumber;
    const status = req.body.status || "not available";

    await transaction.begin();
    await updateTableStatusInTx(transaction, tableNumber, status);
    await transaction.commit();

    res.json({ success: true, tableNumber, status });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("PATCH /api/tables/:tableNumber/status", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================
   CUSTOMER / MEMBER
=========================== */
app.post("/api/customers/general", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const customerId =
      req.body.customerId || (await generateUniqueId("Customer", "CId", "G", 9));

    await transaction.begin();

    await transaction
      .request()
      .input("CId", sql.VarChar(10), customerId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customer WHERE CId = @CId)
        INSERT INTO Customer (CId) VALUES (@CId)
      `);

    await transaction
      .request()
      .input("CId", sql.VarChar(10), customerId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM General WHERE CId = @CId)
        INSERT INTO General (CId) VALUES (@CId)
      `);

    await transaction.commit();

    res.json({ success: true, customerId });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("POST /api/customers/general", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/members", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const {
      customerId,
      firstName,
      lastName,
      tel,
      email,
      CId,
      MFirstName,
      MSurName,
      MTel,
      MEmail,
    } = req.body;

    const cId = customerId || CId || (await generateUniqueId("Customer", "CId", "M", 9));

    await transaction.begin();

    await transaction
      .request()
      .input("CId", sql.VarChar(10), cId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customer WHERE CId = @CId)
        INSERT INTO Customer (CId) VALUES (@CId)
      `);

    await transaction
      .request()
      .input("CId", sql.VarChar(10), cId)
      .input("MFirstName", sql.NVarChar(25), firstName || MFirstName || "")
      .input("MSurName", sql.NVarChar(25), lastName || MSurName || "")
      .input("MTel", sql.VarChar(10), String(tel || MTel || "").trim().slice(0, 10))
      .input("MEmail", sql.VarChar(50), email || MEmail || "")
      .query(`
        IF EXISTS (SELECT 1 FROM Member WHERE CId = @CId)
        BEGIN
          UPDATE Member
          SET MFirstName = @MFirstName,
              MSurName = @MSurName,
              MTel = @MTel,
              MEmail = @MEmail
          WHERE CId = @CId
        END
        ELSE
        BEGIN
          INSERT INTO Member (CId, MFirstName, MSurName, MTel, MEmail)
          VALUES (@CId, @MFirstName, @MSurName, @MTel, @MEmail)
        END
      `);

    await transaction.commit();

    res.json({
      success: true,
      customerId: cId,
      member: {
        CId: cId,
        MFirstName: firstName || MFirstName || "",
        MSurName: lastName || MSurName || "",
        MTel: tel || MTel || "",
        MEmail: email || MEmail || "",
      },
    });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("POST /api/members", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/members/by-phone/:tel", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db
      .request()
      .input("MTel", sql.VarChar(10), req.params.tel)
      .query(`
        SELECT *
        FROM Member
        WHERE MTel = @MTel
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ success: false, error: "Member not found" });
    }

    res.json({ success: true, data: result.recordset[0] });
  } catch (error) {
    console.error("GET /api/members/by-phone/:tel", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================
   RESERVATION
=========================== */
app.post("/api/reservations", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const {
      reservationId,
      customerId,
      tableNumber,
      date,
      time,
      count,
      peopleCount,
      RId,
      CId,
      TNumber,
      RDate,
      RTime,
      PeopleCount,
    } = req.body;

    const rid = Number(reservationId || RId) || (await generateUniqueIntId("Reservation", "RId", 4));
    const cId = customerId || CId || "M00001";
    const tNumber = tableNumber || TNumber;
    const rDate = normalizeDateForSql(date || RDate);
    const rTime = normalizeTimeForSql(time || RTime);
    const pCount = normalizeNumber(count || peopleCount || PeopleCount, 1);

    if (!tNumber || !rDate || !rTime) {
      return res.status(400).json({
        success: false,
        error: "tableNumber, date, time are required",
      });
    }

    await transaction.begin();

    await transaction
      .request()
      .input("CId", sql.VarChar(10), cId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customer WHERE CId = @CId)
        INSERT INTO Customer (CId) VALUES (@CId)
      `);

    const tableCheck = await transaction
      .request()
      .input("TNumber", sql.VarChar(2), tNumber)
      .query(`SELECT COUNT(*) AS count FROM Tables WHERE TNumber = @TNumber`);

    if (Number(tableCheck.recordset[0]?.count || 0) === 0) {
      throw new Error(`Table ${tNumber} not found in Tables table`);
    }

    const duplicate = await transaction
      .request()
      .input("TNumber", sql.VarChar(2), tNumber)
      .input("RDateText", sql.VarChar(10), rDate)
      .input("RTimeText", sql.VarChar(8), rTime)
      .query(`
        SELECT COUNT(*) AS count
        FROM Reservation
        WHERE TNumber = @TNumber
          AND RDate = CONVERT(date, @RDateText, 120)
          AND RTime = CONVERT(time, @RTimeText, 108)
      `);

    if (Number(duplicate.recordset[0]?.count || 0) > 0) {
      await transaction.rollback();
      return res.status(409).json({
        success: false,
        error: "This table is already reserved at selected date/time",
      });
    }

    const hasPeopleCount = await tableHasColumn("Reservation", "PeopleCount");

    if (hasPeopleCount) {
      await transaction
        .request()
        .input("RId", sql.Int, rid)
        .input("RDateText", sql.VarChar(10), rDate)
        .input("RTimeText", sql.VarChar(8), rTime)
        .input("CId", sql.VarChar(10), cId)
        .input("TNumber", sql.VarChar(2), tNumber)
        .input("PeopleCount", sql.Int, pCount)
        .query(`
          INSERT INTO Reservation (RId, RDate, RTime, CId, TNumber, PeopleCount)
          VALUES (@RId, CONVERT(date, @RDateText, 120), CONVERT(time, @RTimeText, 108), @CId, @TNumber, @PeopleCount)
        `);
    } else {
      await transaction
        .request()
        .input("RId", sql.Int, rid)
        .input("RDateText", sql.VarChar(10), rDate)
        .input("RTimeText", sql.VarChar(8), rTime)
        .input("CId", sql.VarChar(10), cId)
        .input("TNumber", sql.VarChar(2), tNumber)
        .query(`
          INSERT INTO Reservation (RId, RDate, RTime, CId, TNumber)
          VALUES (@RId, CONVERT(date, @RDateText, 120), CONVERT(time, @RTimeText, 108), @CId, @TNumber)
        `);
    }

    await transaction.commit();

    res.json({ success: true, reservationId: rid, date: rDate, time: rTime, peopleCount: pCount });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("POST /api/reservations", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/reservations/customer/:customerId", async (req, res) => {
  try {
    const db = await getPool();

    const hasPeopleCount = await tableHasColumn("Reservation", "PeopleCount");

    const peopleCountSelect = hasPeopleCount
      ? "PeopleCount"
      : "CAST(1 AS INT) AS PeopleCount";

    const peopleCountAliasSelect = hasPeopleCount
      ? "PeopleCount AS peopleCount"
      : "CAST(1 AS INT) AS peopleCount";

    const result = await db
      .request()
      .input("CId", sql.VarChar(10), req.params.customerId)
      .query(`
        SELECT
          RId,
          RId AS reservationId,
          CId,
          TNumber,
          TNumber AS tableNumber,
          CONVERT(varchar(10), RDate, 120) AS RDate,
          CONVERT(varchar(10), RDate, 120) AS reservationDate,
          CONVERT(varchar(5), RTime, 108) AS RTime,
          CONVERT(varchar(5), RTime, 108) AS reservationTime,
          ${peopleCountSelect},
          ${peopleCountAliasSelect},
          'reserved' AS status
        FROM Reservation
        WHERE CId = @CId
        ORDER BY RDate DESC, RTime DESC
      `);

    res.json({
      success: true,
      data: result.recordset,
      reservations: result.recordset,
    });
  } catch (error) {
    console.error("GET /api/reservations/customer/:customerId", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.delete("/api/reservations/:reservationId", async (req, res) => {
  try {
    const db = await getPool();

    await db
      .request()
      .input("RId", sql.Int, Number(req.params.reservationId))
      .query(`
        DELETE FROM Reservation
        WHERE RId = @RId
      `);

    res.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/reservations/:reservationId", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================
   ORDERS
=========================== */
app.post("/api/orders", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const { customerId, employeeId, tableNumber, items, CId, EId, TNumber } = req.body;

    const cId = customerId || CId || "G00001";
    const eId = employeeId || EId || "E123456";
    const tNumber = tableNumber || TNumber || "S3";
    const orderItems = Array.isArray(items) ? items : [];

    const cleanItems = orderItems
      .map((item) => {
        const menuId = getMenuIdFromItem(item);
        const quantity = normalizeNumber(item.quantity, 1);
        const unitPrice = normalizeNumber(
          item.finalPrice || item.price || item.basePrice || item.unitPrice || item.UnitPrice,
          0
        );

        return {
          ...item,
          __menuId: menuId,
          __quantity: quantity,
          __unitPrice: unitPrice,
        };
      })
      .filter((item) => item.__menuId && item.__quantity > 0 && item.__unitPrice > 0);

    if (cleanItems.length === 0) {
      return res.status(400).json({
        success: false,
        error: "No valid order items. Please clear cart and add menu again.",
      });
    }

    const orderId = await generateUniqueId("Orders", "OId", "O", 3);
    const hasOStatus = await tableHasColumn("Orders", "OStatus");

    await transaction.begin();

    // Ensure Customer exists so Orders FK will not fail.
    await transaction
      .request()
      .input("CId", sql.VarChar(10), cId)
      .query(`
        IF NOT EXISTS (SELECT 1 FROM Customer WHERE CId = @CId)
        INSERT INTO Customer (CId) VALUES (@CId)
      `);

    // Ensure General row exists for general customers.
    if (String(cId).startsWith("G")) {
      await transaction
        .request()
        .input("CId", sql.VarChar(10), cId)
        .query(`
          IF NOT EXISTS (SELECT 1 FROM General WHERE CId = @CId)
          INSERT INTO General (CId) VALUES (@CId)
        `);
    }

    // Fallback employee if incoming id is missing from Employee table.
    const employeeCheck = await transaction
      .request()
      .input("EId", sql.VarChar(10), eId)
      .query(`SELECT COUNT(*) AS count FROM Employee WHERE EId = @EId`);

    const finalEmployeeId =
      Number(employeeCheck.recordset[0]?.count || 0) > 0 ? eId : "E123456";

    if (hasOStatus) {
      await transaction
        .request()
        .input("OId", sql.VarChar(4), orderId)
        .input("ODateTime", sql.DateTime2, new Date())
        .input("CId", sql.VarChar(10), cId)
        .input("EId", sql.VarChar(10), finalEmployeeId)
        .input("TNumber", sql.VarChar(2), tNumber)
        .input("OStatus", sql.NVarChar(20), "รอดำเนินการ")
        .query(`
          INSERT INTO Orders (OId, ODateTime, CId, EId, TNumber, OStatus)
          VALUES (@OId, @ODateTime, @CId, @EId, @TNumber, @OStatus)
        `);
    } else {
      await transaction
        .request()
        .input("OId", sql.VarChar(4), orderId)
        .input("ODateTime", sql.DateTime2, new Date())
        .input("CId", sql.VarChar(10), cId)
        .input("EId", sql.VarChar(10), finalEmployeeId)
        .input("TNumber", sql.VarChar(2), tNumber)
        .query(`
          INSERT INTO Orders (OId, ODateTime, CId, EId, TNumber)
          VALUES (@OId, @ODateTime, @CId, @EId, @TNumber)
        `);
    }

    const hasSizeOption = await tableHasColumn("OrderDetails", "SizeOption");
    const hasToppings = await tableHasColumn("OrderDetails", "Toppings");
    const hasDrinkType = await tableHasColumn("OrderDetails", "DrinkType");
    const hasSweetness = await tableHasColumn("OrderDetails", "Sweetness");
    const hasNote = await tableHasColumn("OrderDetails", "Note");
    const hasSubTotal = await tableHasColumn("OrderDetails", "SubTotal");

    for (const item of cleanItems) {
      const detailId = await generateUniqueId("OrderDetails", "OD_Id", "D", 4);
      const quantity = item.__quantity;
      const unitPrice = item.__unitPrice;
      const menuId = item.__menuId;
      const options = item.options || {};
      const toppings = Array.isArray(options.toppings)
        ? options.toppings.join(",")
        : options.topping || "";

      const menuCheck = await transaction
        .request()
        .input("MenuId", sql.VarChar(3), menuId)
        .query(`SELECT COUNT(*) AS count FROM Menu WHERE MenuId = @MenuId`);

      if (Number(menuCheck.recordset[0]?.count || 0) === 0) {
        throw new Error(`MenuId ${menuId} not found in Menu table`);
      }

      const cols = ["OD_Id", "Quantity", "UnitPrice", "OId", "MenuId"];
      const params = [
        { name: "OD_Id", type: sql.VarChar(5), value: detailId },
        { name: "Quantity", type: sql.Int, value: quantity },
        { name: "UnitPrice", type: sql.Int, value: unitPrice },
        { name: "OId", type: sql.VarChar(4), value: orderId },
        { name: "MenuId", type: sql.VarChar(3), value: menuId },
      ];

      if (hasSubTotal) {
        cols.push("SubTotal");
        params.push({ name: "SubTotal", type: sql.Int, value: quantity * unitPrice });
      }
      if (hasSizeOption) {
        cols.push("SizeOption");
        params.push({ name: "SizeOption", type: sql.VarChar(20), value: options.size || "" });
      }
      if (hasToppings) {
        cols.push("Toppings");
        params.push({ name: "Toppings", type: sql.VarChar(100), value: toppings });
      }
      if (hasDrinkType) {
        cols.push("DrinkType");
        params.push({ name: "DrinkType", type: sql.VarChar(20), value: options.drinkType || "" });
      }
      if (hasSweetness) {
        cols.push("Sweetness");
        params.push({ name: "Sweetness", type: sql.VarChar(20), value: options.sweetness || "" });
      }
      if (hasNote) {
        cols.push("Note");
        params.push({ name: "Note", type: sql.VarChar(100), value: options.note || "" });
      }

      const req = transaction.request();
      params.forEach((p) => req.input(p.name, p.type, p.value));

      const values = cols.map((c) => `@${c}`).join(", ");
      await req.query(`
        INSERT INTO OrderDetails (${cols.join(", ")})
        VALUES (${values})
      `);
    }

    await updateTableStatusInTx(transaction, tNumber, "not available");
    await transaction.commit();

    res.json({ success: true, orderId });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("POST /api/orders", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/orders/table/:tableNumber", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db
      .request()
      .input("TNumber", sql.VarChar(2), req.params.tableNumber)
      .query(`
        SELECT *
        FROM Orders
        WHERE TNumber = @TNumber
        ORDER BY ODateTime DESC
      `);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("GET /api/orders/table/:tableNumber", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/orders/:orderId/details", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db
      .request()
      .input("OId", sql.VarChar(4), req.params.orderId)
      .query(`
        SELECT od.*, m.MenuName
        FROM OrderDetails od
        LEFT JOIN Menu m ON m.MenuId = od.MenuId
        WHERE od.OId = @OId
      `);

    res.json({ success: true, data: result.recordset });
  } catch (error) {
    console.error("GET /api/orders/:orderId/details", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

/* ===========================
   PAYMENTS
=========================== */
app.post("/api/payments", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const { orderId, method, tableNumber, total, OId, P_Method, TNumber } = req.body;
    const oId = orderId || OId;
    const tNumber = tableNumber || TNumber;
    const paymentMethod = mapPaymentMethod(method || P_Method);
    const pTotal = normalizeNumber(total, 0);

    if (!oId) {
      return res.status(400).json({ success: false, error: "orderId is required" });
    }

    const paymentId = await generateUniqueId("Payment", "PId", "P", 4);
    const hasTotal = await tableHasColumn("Payment", "P_total");
    const hasOStatus = await tableHasColumn("Orders", "OStatus");

    await transaction.begin();

    if (hasTotal) {
      await transaction
        .request()
        .input("PId", sql.VarChar(5), paymentId)
        .input("P_Method", sql.NVarChar(20), paymentMethod)
        .input("P_DateTime", sql.DateTime2, new Date())
        .input("OId", sql.VarChar(4), oId)
        .input("P_total", sql.Int, pTotal)
        .query(`
          INSERT INTO Payment (PId, P_Method, P_DateTime, OId, P_total)
          VALUES (@PId, @P_Method, @P_DateTime, @OId, @P_total)
        `);
    } else {
      await transaction
        .request()
        .input("PId", sql.VarChar(5), paymentId)
        .input("P_Method", sql.NVarChar(20), paymentMethod)
        .input("P_DateTime", sql.DateTime2, new Date())
        .input("OId", sql.VarChar(4), oId)
        .query(`
          INSERT INTO Payment (PId, P_Method, P_DateTime, OId)
          VALUES (@PId, @P_Method, @P_DateTime, @OId)
        `);
    }

    if (hasOStatus) {
      await transaction
        .request()
        .input("OId", sql.VarChar(4), oId)
        .input("OStatus", sql.NVarChar(20), "ชำระเงินแล้ว")
        .query(`
          UPDATE Orders
          SET OStatus = @OStatus
          WHERE OId = @OId
        `);
    }

    if (tNumber) {
      await updateTableStatusInTx(transaction, tNumber, "available");
    }

    await transaction.commit();

    res.json({ success: true, paymentId });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("POST /api/payments", error);
    res.status(500).json({ success: false, error: error.message });
  }
});


/* ===========================
   REVIEW DATA FROM EXISTING DB TABLES ONLY
   QR uses real OId from Orders. No new DB table.
=========================== */
app.get("/api/review-data/:orderId", async (req, res) => {
  try {
    const db = await getPool();

    const rawCode = decodeURIComponent(String(req.params.orderId || "").trim());

    // reviewCode อาจเป็น base64 ของ { orderIds, employeeIds } หรือ orderId ธรรมดา
    let orderIds = [];
    try {
      const decoded = JSON.parse(Buffer.from(rawCode, "base64").toString("utf8"));
      if (Array.isArray(decoded.orderIds) && decoded.orderIds.length > 0) {
        orderIds = decoded.orderIds.map((id) => String(id).trim()).filter(Boolean);
      }
    } catch (e) {
      orderIds = rawCode.split(",").map((item) => item.trim()).filter(Boolean);
    }

    if (orderIds.length === 0) {
      return res.status(400).json({
        success: false,
        error: "orderId is required",
      });
    }

    const orderParams = orderIds.map((_, index) => `@OId${index}`).join(", ");

    const orderRequest = db.request();
    orderIds.forEach((orderId, index) => {
      orderRequest.input(`OId${index}`, sql.VarChar(10), orderId);
    });

    const orderResult = await orderRequest.query(`
      SELECT 
        o.OId,
        o.ODateTime,
        o.CId,
        o.EId,
        o.TNumber,
        m.MFirstName,
        m.MSurName,
        m.MTel,
        m.MEmail,
        e.EFirstName,
        e.ESurName,
        e.ETel,
        e.ERole
      FROM Orders o
      LEFT JOIN Member m ON m.CId = o.CId
      LEFT JOIN Employee e ON e.EId = o.EId
      WHERE o.OId IN (${orderParams})
      ORDER BY o.ODateTime, o.OId
    `);

    if (orderResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: "ไม่พบข้อมูลแบบประเมิน",
      });
    }

    const orders = orderResult.recordset;
    const firstOrder = orders[0];

    const foundOrderIds = orders.map((order) => order.OId);
    const foundOrderParams = foundOrderIds
      .map((_, index) => `@DetailOId${index}`)
      .join(", ");

    const detailRequest = db.request();
    foundOrderIds.forEach((orderId, index) => {
      detailRequest.input(`DetailOId${index}`, sql.VarChar(10), orderId);
    });

    const detailResult = await detailRequest.query(`
      SELECT 
        od.OD_Id,
        od.OId,
        od.MenuId,
        od.Quantity,
        od.UnitPrice,
        menu.MenuName,
        menu.Price
      FROM OrderDetails od
      LEFT JOIN Menu menu ON menu.MenuId = od.MenuId
      WHERE od.OId IN (${foundOrderParams})
      ORDER BY od.OId, od.OD_Id
    `);

    const employeeMap = new Map();

    orders.forEach((order) => {
      if (!order.EId) return;

      employeeMap.set(order.EId, {
        EId: order.EId,
        EFirstName: order.EFirstName || "",
        ESurName: order.ESurName || "",
        ETel: order.ETel || "",
        ERole: order.ERole || "",
      });
    });

    const reviewData = {
      session: {
        reviewCode: rawCode,
        orderIds: foundOrderIds,
        customerId: firstOrder.CId,
        tableNumber: firstOrder.TNumber,
        employeeIds: Array.from(employeeMap.keys()),
        status: "pending",
      },
      customer: {
        CId: firstOrder.CId,
        MFirstName: firstOrder.MFirstName || "",
        MSurName: firstOrder.MSurName || "",
        MTel: firstOrder.MTel || "",
        MEmail: firstOrder.MEmail || "",
      },
      employees: Array.from(employeeMap.values()),
      menus: detailResult.recordset.map((item) => ({
        menuId: item.MenuId,
        MenuId: item.MenuId,
        menuName: item.MenuName,
        MenuName: item.MenuName,
        name: item.MenuName,
        image: "",
        quantity: item.Quantity || 1,
        price: item.UnitPrice || item.Price || 0,
        orderId: item.OId,
      })),
      experienceTopics: [
        { id: "cleanliness", name: "ความสะอาด" },
        { id: "speed", name: "ความรวดเร็ว" },
        { id: "overall", name: "ความพึงพอใจโดยรวม" },
      ],
    };

    res.json({
      success: true,
      data: reviewData,
    });
  } catch (error) {
    console.error("GET /api/review-data/:orderId", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});


/* ===========================
   REVIEWS
=========================== */
app.post("/api/reviews/order", async (req, res) => {
  try {
    const db = await getPool();

    const { orderId, rating, comment, OId, Rating, Comment } = req.body;
    const finalOrderId = String(orderId || OId || "").trim();

    if (!finalOrderId) {
      return res.status(400).json({
        success: false,
        error: "orderId is required",
      });
    }

    const finalRating = Math.max(
      1,
      Math.min(5, normalizeNumber(rating || Rating, 5))
    );

    const finalComment = String(comment || Comment || "").slice(0, 100);
    const reviewId = await generateUniqueId("OrderReview", "ROId", "R", 3);

    await db
      .request()
      .input("ROId", sql.VarChar(4), reviewId)
      .input("Rating", sql.Int, finalRating)
      .input("Comment", sql.NVarChar(100), finalComment)
      .input("ReviewDateTime", sql.DateTime2, new Date())
      .input("OId", sql.VarChar(4), finalOrderId)
      .query(`
        INSERT INTO OrderReview (ROId, Rating, Comment, ReviewDateTime, OId)
        VALUES (@ROId, @Rating, @Comment, @ReviewDateTime, @OId)
      `);

    res.json({ success: true, reviewId });
  } catch (error) {
    console.error("POST /api/reviews/order", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/reviews/employee", async (req, res) => {
  const db = await getPool();
  const transaction = new sql.Transaction(db);

  try {
    const { employeeId, rating, comment, EId, Rating, Comment } = req.body;
    const eId = String(employeeId || EId || "").trim();

    if (!eId) {
      return res.status(400).json({
        success: false,
        error: "employeeId is required",
      });
    }

    const finalRating = Math.max(
      1,
      Math.min(5, normalizeNumber(rating || Rating, 5))
    );

    const finalComment = String(comment || Comment || "").slice(0, 100);
    const reviewId = await generateUniqueId("EmployeeReview", "REId", "E", 4);

    await transaction.begin();

    await transaction
      .request()
      .input("REId", sql.VarChar(5), reviewId)
      .input("Rating", sql.Int, finalRating)
      .input("Comment", sql.NVarChar(100), finalComment)
      .input("ReviewDateTime", sql.DateTime2, new Date())
      .query(`
        INSERT INTO EmployeeReview (REId, Rating, Comment, ReviewDateTime)
        VALUES (@REId, @Rating, @Comment, @ReviewDateTime)
      `);

    await transaction
      .request()
      .input("REId", sql.VarChar(5), reviewId)
      .input("EId", sql.VarChar(10), eId)
      .query(`
        INSERT INTO Reviews_employee (REId, EId)
        VALUES (@REId, @EId)
      `);

    await transaction.commit();

    res.json({ success: true, reviewId });
  } catch (error) {
    await transaction.rollback().catch(() => {});
    console.error("POST /api/reviews/employee", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const port = process.env.PORT || 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`CS251 SQL Server API running at http://0.0.0.0:${port}`);
});

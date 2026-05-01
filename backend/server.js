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
  server: process.env.DB_SERVER || "localhost\\SQLEXPRESS",
  database: process.env.DB_DATABASE || "cs251",
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

function mapCategoryNameToFrontend(categoryName) {
  if (categoryName === "เมนูแนะนำ") return "recommended";
  if (categoryName === "อาหาร") return "food";
  if (categoryName === "ของทานเล่น") return "snackDessert";
  if (categoryName === "ของหวาน") return "snackDessert";
  if (categoryName === "ของทานเล่นและของหวาน") return "snackDessert";
  if (categoryName === "เครื่องดื่ม") return "drink";
  return "food";
}

function mapOptionType(categoryName) {
  if (categoryName === "เครื่องดื่ม") return "drink";
  if (categoryName === "ของทานเล่น" || categoryName === "ของหวาน") return "snack";
  return "food";
}

function mapPaymentMethod(method) {
  const map = {
    เงินสด: "Cash",
    "สแกนคิวอาร์โค้ด": "Qr Code",
    "บัตรเครดิต/เดบิต": "Credit Card",
    Cash: "Cash",
    "Qr Code": "Qr Code",
    "QR Code": "Qr Code",
    "Credit Card": "Credit Card",
  };

  return map[method] || "Cash";
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

  const hasStatus = await tableHasColumn("Tables", "Status");
  const hasTStatus = await tableHasColumn("Tables", "TStatus");

  if (hasStatus) {
    await transaction
      .request()
      .input("Status", sql.NVarChar(20), status)
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
      .input("TStatus", sql.NVarChar(20), status)
      .input("TNumber", sql.VarChar(2), tableNumber)
      .query(`
        UPDATE Tables
        SET TStatus = @TStatus
        WHERE TNumber = @TNumber
      `);
  }
}

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
      WHERE m.MenuStatus = N'พร้อมจำหน่าย'
      ORDER BY m.MenuId
    `);

    const menus = result.recordset.map((row) => ({
      id: row.MenuId,
      menuId: row.MenuId,
      name: row.MenuName,
      price: row.Price,
      image: "",
      category: mapCategoryNameToFrontend(row.Category_Name),
      recommended: row.Category_Name === "เมนูแนะนำ",
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
    const status = req.body.status || "ไม่ว่าง";

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
      .input("MTel", sql.VarChar(10), tel || MTel || "")
      .input("MEmail", sql.VarChar(25), email || MEmail || "")
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
  try {
    const db = await getPool();

    const {
      reservationId,
      customerId,
      tableNumber,
      date,
      time,
      RId,
      CId,
      TNumber,
      RDate,
      RTime,
    } = req.body;

    const rid = reservationId || RId || Number(randomDigits(4));
    const cId = customerId || CId || "MB0001";
    const tNumber = tableNumber || TNumber;
    const rDate = date || RDate;
    const rTime = time || RTime;

    if (!tNumber || !rDate || !rTime) {
      return res.status(400).json({
        success: false,
        error: "tableNumber, date, time are required",
      });
    }

    const duplicate = await db
      .request()
      .input("TNumber", sql.VarChar(2), tNumber)
      .input("RDate", sql.Date, rDate)
      .input("RTime", sql.Time, rTime)
      .query(`
        SELECT COUNT(*) AS count
        FROM Reservation
        WHERE TNumber = @TNumber
          AND RDate = @RDate
          AND RTime = @RTime
      `);

    if (Number(duplicate.recordset[0]?.count || 0) > 0) {
      return res.status(409).json({
        success: false,
        error: "This table is already reserved at selected date/time",
      });
    }

    await db
      .request()
      .input("RId", sql.Int, Number(rid))
      .input("RDate", sql.Date, rDate)
      .input("RTime", sql.Time, rTime)
      .input("CId", sql.VarChar(10), cId)
      .input("TNumber", sql.VarChar(2), tNumber)
      .query(`
        INSERT INTO Reservation (RId, RDate, RTime, CId, TNumber)
        VALUES (@RId, @RDate, @RTime, @CId, @TNumber)
      `);

    res.json({ success: true, reservationId: rid });
  } catch (error) {
    console.error("POST /api/reservations", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get("/api/reservations/customer/:customerId", async (req, res) => {
  try {
    const db = await getPool();

    const result = await db
      .request()
      .input("CId", sql.VarChar(10), req.params.customerId)
      .query(`
        SELECT *
        FROM Reservation
        WHERE CId = @CId
        ORDER BY RDate DESC, RTime DESC
      `);

    res.json({ success: true, data: result.recordset });
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

    const cId = customerId || CId || "G000000001";
    const eId = employeeId || EId || "M123456";
    const tNumber = tableNumber || TNumber || "S3";
    const orderItems = Array.isArray(items) ? items : [];

    if (orderItems.length === 0) {
      return res.status(400).json({ success: false, error: "items are required" });
    }

    const orderId = await generateUniqueId("Orders", "OId", "O", 3);
    const hasOStatus = await tableHasColumn("Orders", "OStatus");

    await transaction.begin();

    if (hasOStatus) {
      await transaction
        .request()
        .input("OId", sql.VarChar(4), orderId)
        .input("ODateTime", sql.DateTime2, new Date())
        .input("CId", sql.VarChar(10), cId)
        .input("EId", sql.VarChar(10), eId)
        .input("TNumber", sql.VarChar(2), tNumber)
        .input("OStatus", sql.VarChar(15), "pending")
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
        .input("EId", sql.VarChar(10), eId)
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

    for (const item of orderItems) {
      const detailId = await generateUniqueId("OrderDetails", "OD_Id", "D", 1);
      const quantity = normalizeNumber(item.quantity, 1);
      const unitPrice = normalizeNumber(item.finalPrice || item.price || item.basePrice, 0);
      const menuId = getMenuIdFromItem(item);
      const options = item.options || {};
      const toppings = Array.isArray(options.toppings)
        ? options.toppings.join(",")
        : options.topping || "";

      const cols = ["OD_Id", "Quantity", "UnitPrice", "OId", "MenuId"];
      const params = [
        { name: "OD_Id", type: sql.VarChar(2), value: detailId },
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
        params.push({ name: "SizeOption", type: sql.NVarChar(20), value: options.size || "" });
      }
      if (hasToppings) {
        cols.push("Toppings");
        params.push({ name: "Toppings", type: sql.NVarChar(100), value: toppings });
      }
      if (hasDrinkType) {
        cols.push("DrinkType");
        params.push({ name: "DrinkType", type: sql.NVarChar(20), value: options.drinkType || "" });
      }
      if (hasSweetness) {
        cols.push("Sweetness");
        params.push({ name: "Sweetness", type: sql.NVarChar(20), value: options.sweetness || "" });
      }
      if (hasNote) {
        cols.push("Note");
        params.push({ name: "Note", type: sql.NVarChar(100), value: options.note || "" });
      }

      const req = transaction.request();
      params.forEach((p) => req.input(p.name, p.type, p.value));

      const values = cols.map((c) => `@${c}`).join(", ");
      await req.query(`
        INSERT INTO OrderDetails (${cols.join(", ")})
        VALUES (${values})
      `);
    }

    await updateTableStatusInTx(transaction, tNumber, "ไม่ว่าง");
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
        .input("P_Method", sql.VarChar(20), paymentMethod)
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
        .input("P_Method", sql.VarChar(20), paymentMethod)
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
        .input("OStatus", sql.VarChar(15), "paid")
        .query(`
          UPDATE Orders
          SET OStatus = @OStatus
          WHERE OId = @OId
        `);
    }

    if (tNumber) {
      await updateTableStatusInTx(transaction, tNumber, "ว่าง");
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
   REVIEWS
=========================== */
app.post("/api/reviews/order", async (req, res) => {
  try {
    const db = await getPool();

    const { orderId, rating, comment, OId, Rating, Comment } = req.body;
    const reviewId = await generateUniqueId("OrderReview", "ROId", "R", 4);

    await db
      .request()
      .input("ROId", sql.VarChar(5), reviewId)
      .input("Rating", sql.Int, normalizeNumber(rating || Rating, 5))
      .input("Comment", sql.NVarChar(100), comment || Comment || "")
      .input("ReviewDateTime", sql.DateTime2, new Date())
      .input("OId", sql.VarChar(4), orderId || OId)
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
    const eId = employeeId || EId || "M123456";
    const reviewId = await generateUniqueId("EmployeeReview", "REId", "E", 4);

    await transaction.begin();

    await transaction
      .request()
      .input("REId", sql.VarChar(5), reviewId)
      .input("Rating", sql.Int, normalizeNumber(rating || Rating, 5))
      .input("Comment", sql.NVarChar(100), comment || Comment || "")
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

app.listen(port, () => {
  console.log(`CS251 SQL Server API running at http://localhost:${port}`);
});

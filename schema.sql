USE cs251;
GO

CREATE TABLE Category
(
    Category_Id VARCHAR(2) PRIMARY KEY,
    Category_Name NVARCHAR(25),
    CONSTRAINT check_Category_Name CHECK (
        Category_Name IN (N'เมนูแนะนำ', N'อาหาร', N'ของทานเล่น', N'ของหวาน', N'เครื่องดื่ม')
    )
);
GO

CREATE TABLE Menu
(
    MenuId VARCHAR(3) PRIMARY KEY,
    MenuName NVARCHAR(25),
    Price INT,
    MenuStatus NVARCHAR(20),
    CONSTRAINT check_MenuStatus CHECK (
        MenuStatus IN (N'พร้อมจำหน่าย', N'หมด')
    )
);
GO

CREATE TABLE Categorizers
(
    Category_Id VARCHAR(2),
    MenuId VARCHAR(3),
    PRIMARY KEY (Category_Id, MenuId),
    FOREIGN KEY (Category_Id) REFERENCES Category(Category_Id),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId)
);
GO

CREATE TABLE Employee
(
    EId VARCHAR(10) PRIMARY KEY,
    EFirstName NVARCHAR(25),
    ESurName NVARCHAR(25),
    ETel VARCHAR(10),
    ERole NVARCHAR(20),
    EStatus NVARCHAR(20),
    CONSTRAINT check_ERole CHECK (
        ERole IN (N'พนักงานเสิร์ฟ', N'แคชเชียร์', N'ผู้จัดการร้าน', N'พ่อครัว')
    ),
    CONSTRAINT check_EStatus CHECK (
        EStatus IN (N'กำลังทำงาน', N'ลาออก')
    )
);
GO

CREATE TABLE Customer
(
    CId VARCHAR(10) PRIMARY KEY
);
GO

CREATE TABLE General
(
    CId VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (CId) REFERENCES Customer(CId)
);
GO

CREATE TABLE Member
(
    CId VARCHAR(10) PRIMARY KEY,
    MFirstName NVARCHAR(25),
    MSurName NVARCHAR(25),
    MTel VARCHAR(10),
    MEmail VARCHAR(25),
    FOREIGN KEY (CId) REFERENCES Customer(CId)
);
GO

CREATE TABLE Tables
(
    TNumber VARCHAR(2) PRIMARY KEY,
    T_Type NVARCHAR(10),
    Status NVARCHAR(20),
    CONSTRAINT check_T_Type CHECK (
        T_Type IN (N'เล็ก', N'กลาง', N'ใหญ่')
    ),
    CONSTRAINT check_Table_Status CHECK (
        Status IN (N'ไม่ว่าง', N'ว่าง')
    )
);
GO

CREATE TABLE Reservation
(
    RId INT PRIMARY KEY,
    RDate DATE,
    RTime TIME,
    CId VARCHAR(10),
    TNumber VARCHAR(2),
    FOREIGN KEY (CId) REFERENCES Customer(CId),
    FOREIGN KEY (TNumber) REFERENCES Tables(TNumber)
);
GO

CREATE TABLE Orders
(
    OId VARCHAR(4) PRIMARY KEY,
    ODateTime DATETIME2,
    CId VARCHAR(10),
    EId VARCHAR(10),
    TNumber VARCHAR(2),
    FOREIGN KEY (CId) REFERENCES Customer(CId),
    FOREIGN KEY (EId) REFERENCES Employee(EId),
    FOREIGN KEY (TNumber) REFERENCES Tables(TNumber)
);
GO

CREATE TABLE OrderDetails
(
    OD_Id VARCHAR(5) PRIMARY KEY,
    Quantity INT,
    UnitPrice INT,
    OId VARCHAR(4),
    MenuId VARCHAR(3),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId)
);
GO

CREATE TABLE EmployeeReview
(
    REId VARCHAR(5) PRIMARY KEY,
    Rating INT,
    Comment NVARCHAR(100),
    ReviewDateTime DATETIME2,
    CONSTRAINT check_EmployeeReview_Rating CHECK (Rating BETWEEN 1 AND 5)
);
GO

CREATE TABLE Reviews_employee
(
    REId VARCHAR(5),
    EId VARCHAR(10),
    PRIMARY KEY (REId, EId),
    FOREIGN KEY (REId) REFERENCES EmployeeReview(REId),
    FOREIGN KEY (EId) REFERENCES Employee(EId)
);
GO

CREATE TABLE OrderReview
(
    ROId VARCHAR(5) PRIMARY KEY,
    Rating INT,
    Comment NVARCHAR(100),
    ReviewDateTime DATETIME2,
    OId VARCHAR(4),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    CONSTRAINT check_OrderReview_Rating CHECK (Rating BETWEEN 1 AND 5)
);
GO

CREATE TABLE Payment
(
    PId VARCHAR(5) PRIMARY KEY,
    P_Method NVARCHAR(20),
    P_DateTime DATETIME2,
    OId VARCHAR(4),
    P_total DECIMAL(10,2),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    CONSTRAINT check_P_Method CHECK (
        P_Method IN (N'เงินสด', N'บัตรเครดิต', N'คิวอาร์โค้ด', 'Cash', 'Credit Card', 'QR Code')
    )
);
GO

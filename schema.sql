
CREATE TABLE Employee
(
    EId VARCHAR(10) PRIMARY KEY,
    EFirstName VARCHAR(25),
    ESurName VARCHAR(25),
    ETel VARCHAR(10),
    ERole VARCHAR(20),
    EStatus VARCHAR(20),
    CONSTRAINT check_ERole CHECK (
        ERole IN ('staff', 'cashier', 'manager', 'chef')
    ),
    CONSTRAINT check_EStatus CHECK (
        EStatus IN ('active', 'inactive', 'resigned')
    )
);
GO

CREATE TABLE Category
(
    Category_Id VARCHAR(2) PRIMARY KEY,
    Category_Name VARCHAR(25),
    CONSTRAINT check_category_name CHECK (
        Category_Name IN ('recommended', 'food', 'snack', 'dessert', 'drink')
    )
);
GO

CREATE TABLE Menu
(
    MenuId VARCHAR(3) PRIMARY KEY,
    MenuName VARCHAR(50),
    Price INT,
    MenuStatus VARCHAR(20),
    CONSTRAINT check_MenuStatus CHECK (
        MenuStatus IN ('available', 'not available')
    )
);
GO

CREATE TABLE Customer
(
    CId VARCHAR(10) PRIMARY KEY
);
GO

CREATE TABLE Member
(
    CId VARCHAR(10) PRIMARY KEY,
    MFirstName VARCHAR(25),
    MSurName VARCHAR(25),
    MTel VARCHAR(10),
    MEmail VARCHAR(50),
    FOREIGN KEY (CId) REFERENCES Customer(CId)
);
GO

CREATE TABLE General
(
    CId VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (CId) REFERENCES Customer(CId)
);
GO

CREATE TABLE Tables
(
    TNumber VARCHAR(2) PRIMARY KEY,
    T_Type VARCHAR(10),
    TStatus VARCHAR(20),
    CONSTRAINT check_T_Type CHECK (
        T_Type IN ('small', 'medium', 'large')
    ),
    CONSTRAINT check_TStatus CHECK (
        TStatus IN ('available', 'not available')
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

CREATE TABLE Categorizers
(
    Category_Id VARCHAR(2),
    MenuId VARCHAR(3),
    PRIMARY KEY (Category_Id, MenuId),
    FOREIGN KEY (Category_Id) REFERENCES Category(Category_Id),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId)
);
GO

CREATE TABLE Orders
(
    OId VARCHAR(4) PRIMARY KEY,
    ODateTime DATETIME2,
    CId VARCHAR(10),
    EId VARCHAR(10),
    TNumber VARCHAR(2),
    OStatus VARCHAR(20),
    FOREIGN KEY (CId) REFERENCES Customer(CId),
    FOREIGN KEY (EId) REFERENCES Employee(EId),
    FOREIGN KEY (TNumber) REFERENCES Tables(TNumber),
    CONSTRAINT check_OStatus CHECK (
        OStatus IN ('pending', 'paid', 'cancelled')
    )
);
GO

CREATE TABLE OrderDetails
(
    OD_Id VARCHAR(5) PRIMARY KEY,
    Quantity INT,
    UnitPrice INT,
    SubTotal INT,
    SizeOption VARCHAR(20),
    Toppings VARCHAR(100),
    DrinkType VARCHAR(20),
    Sweetness VARCHAR(20),
    Note VARCHAR(100),
    OId VARCHAR(4),
    MenuId VARCHAR(3),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId)
);
GO

CREATE TABLE Payment
(
    PId VARCHAR(5) PRIMARY KEY,
    P_Method VARCHAR(20),
    P_DateTime DATETIME2,
    P_total INT,
    OId VARCHAR(4),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    CONSTRAINT check_P_Method CHECK (
        P_Method IN ('Cash', 'Credit Card', 'Qr Code', 'QR Code')
    )
);
GO

CREATE TABLE EmployeeReview
(
    REId VARCHAR(5) PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(100),
    ReviewDateTime DATETIME2
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
    ROId VARCHAR(4) PRIMARY KEY,
    Rating INT NOT NULL,
    Comment VARCHAR(100),
    ReviewDateTime DATETIME2,
    OId VARCHAR(4),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    CONSTRAINT check_Rating CHECK (Rating BETWEEN 1 AND 5)
);
GO

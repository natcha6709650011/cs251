CREATE TABLE Employee
(
    EId VARCHAR(10) PRIMARY KEY,
    EFirstName VARCHAR(25),
    ESurName VARCHAR(25),
    ETel VARCHAR(10),
    ERole VARCHAR(20),
    CONSTRAINT check_ERole CHECK(
        ERole IN(
            'พนักงานเสิรฟ',
            'แคชเชียร',
            'ผู้จัดการร้าน',
            'พ่อครัว'
        )
    )
);

CREATE TABLE Category
(
    Category_Id VARCHAR(2) PRIMARY KEY,
    Category_Name VARCHAR(25) ,
    CONSTRAINT check_category_name CHECK (
    Category_Name IN (
      'เมนูแนะนำ',
      'อาหาร',
      'ของทานเล่น',
      'ของหวาน',
      'เครื่องดื่ม'
    )
  )
);

CREATE TABLE Menu
(
    MenuId VARCHAR (3) PRIMARY KEY,
    MenuName VARCHAR(25),
    Price INT,
    MenuStatus VARCHAR(15),
    CONSTRAINT check_MenuStatus CHECK(
        MenuStatus IN(
            'พร้อมจำหน่าย',
            'หมด'
        )
    )
);

CREATE TABLE Customer
(
    CId VARCHAR(10) PRIMARY KEY
);

CREATE TABLE Member
(
    CId VARCHAR(10) PRIMARY KEY,
    MFirstName VARCHAR(25),
    MSurName VARCHAR(25),
    MTel VARCHAR(10),
    MEmail VARCHAR(25),
    FOREIGN KEY (CId) REFERENCES Customer(CId)
);

CREATE TABLE General
(
    CId VARCHAR(10) PRIMARY KEY,
    FOREIGN KEY (CId) REFERENCES Customer(CId)
);

CREATE TABLE Tables
(
    TNumber VARCHAR(2) PRIMARY KEY,
    T_Type VARCHAR(10),
    CONSTRAINT check_T_Type CHECK(
        T_Type IN(
            'เล็ก',
            'กลาง',
            'ใหญ่'
        )
    ),
    TStatus VARCHAR(10),
    CONSTRAINT check_TStatus CHECK(
        TStatus IN(
            'ว่าง',
            'ไม่ว่าง'
        )
    )
)

CREATE TABLE Reservation
(
    RId INT PRIMARY KEY,
    RDate DATE,
    RTime TIME,
    CId VARCHAR(10),
    TNumber VARCHAR(2),
     FOREIGN KEY (TNumber) REFERENCES Tables(TNumber),
    FOREIGN KEY (CId) REFERENCES Customer(CId)
)

CREATE TABLE Payment
(
    PId VARCHAR (5) PRIMARY KEY,
    P_Method VARCHAR (10),
    P_DateTime DATETIME2,
    OId VARCHAR(4),
    FOREIGN KEY (OId) REFERENCES Orders(OId),
    CONSTRAINT check_P_Method CHECK(
        P_Method IN(
            'Cash',
            'Credit Card',
            'Qr Code'
        )
    )
)


CREATE TABLE Categorizers
(
    Category_Id VARCHAR(2),
    MenuId VARCHAR(3),
    PRIMARY KEY (Category_Id, MenuId),
    FOREIGN KEY (Category_Id) REFERENCES Category(Category_Id),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId)
);


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

CREATE TABLE OrderDetails
(
    OD_Id VARCHAR(2) PRIMARY KEY,
    Quantity INT,
    UnitPrice INT,
    OId VARCHAR(4),
    MenuId VARCHAR(3),
    FOREIGN KEY (MenuId) REFERENCES Menu(MenuId),
    FOREIGN KEY (OId) REFERENCES Orders(OId)
);


CREATE TABLE EmployeeReview
(
    REId VARCHAR(5) PRIMARY KEY,
    Rating INT CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(100),
    ReviewDateTime DATETIME2
)

CREATE TABLE Reviews_employee
(
    REId VARCHAR(5) ,
    EId VARCHAR(10),
    PRIMARY KEY (REId, EId),
    FOREIGN KEY (REId) REFERENCES EmployeeReview(REId),
    FOREIGN KEY (EId) REFERENCES Employee(EId)
);

CREATE TABLE OrderReview
(
    ROId VARCHAR(4) PRIMARY KEY ,
    Rating INT NOT NULL ,
    CONSTRAINT check_Rating CHECK (Rating BETWEEN 1 AND 5),
    Comment VARCHAR(100),
    ReviewDateTime DATETIME2,
    OId VARCHAR(4),
    FOREIGN KEY (OId) REFERENCES Orders(OId)
)



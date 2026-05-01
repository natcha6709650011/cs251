USE cs251;
GO

DECLARE @dropSql NVARCHAR(MAX) = N'';

SELECT @dropSql = @dropSql + N'ALTER TABLE '
    + QUOTENAME(OBJECT_SCHEMA_NAME(parent_object_id)) + N'.'
    + QUOTENAME(OBJECT_NAME(parent_object_id))
    + N' DROP CONSTRAINT ' + QUOTENAME(name) + N';' + CHAR(13)
FROM sys.check_constraints
WHERE OBJECT_NAME(parent_object_id) IN ('Employee', 'Tables', 'Category', 'Menu', 'Orders', 'Payment');

IF LEN(@dropSql) > 0
    EXEC sp_executesql @dropSql;
GO

IF COL_LENGTH('Employee', 'EStatus') IS NULL
BEGIN
    ALTER TABLE Employee ADD EStatus VARCHAR(20);
END
GO

INSERT INTO Employee (EId, EFirstName, ESurName, ETel, ERole, EStatus)
VALUES
('E123456', 'khayan', 'rakdee', '0811111111', 'staff', 'active');
GO

INSERT INTO Tables (TNumber, T_Type, TStatus)
VALUES
('S1', 'small', 'available'),
('S2', 'small', 'available'),
('S3', 'small', 'available'),
('S4', 'small', 'available'),
('S5', 'small', 'available'),
('M1', 'medium', 'available'),
('M2', 'medium', 'available'),
('M3', 'medium', 'available'),
('M4', 'medium', 'available'),
('M5', 'medium', 'available'),
('L1', 'large', 'available'),
('L2', 'large', 'available'),
('L3', 'large', 'available'),
('L4', 'large', 'available'),
('L5', 'large', 'available');
GO

INSERT INTO Category (Category_Id, Category_Name)
VALUES
('01', 'recommended'),
('02', 'food'),
('03', 'snack'),
('04', 'dessert'),
('05', 'drink');
GO

INSERT INTO Menu (MenuId, MenuName, Price, MenuStatus)
VALUES
('001', 'khao phad moo', 60, 'available'),
('002', 'khao phad gai', 60, 'available'),
('003', 'khao phad muek', 70, 'available'),
('004', 'khao phad goong', 70, 'available'),
('005', 'khao phad ruammit', 75, 'available'),
('006', 'cheese ball', 59, 'available'),
('007', 'khanom pang ob ainam', 49, 'available'),
('008', 'sala loi kaew', 45, 'available'),
('009', 'chao kuai', 35, 'available'),
('010', 'panna cotta', 55, 'available'),
('011', 'mocha', 55, 'available'),
('012', 'matcha latte', 60, 'available'),
('013', 'cha mali', 45, 'available'),
('014', 'cha dam', 40, 'available'),
('015', 'nom sod', 45, 'available'),
('016', 'khao phad gaprao moo sap', 60, 'available'),
('017', 'khao phad gaprao gai', 60, 'available'),
('018', 'khao phad gaprao muek', 70, 'available'),
('019', 'khao phad gaprao goong', 70, 'available'),
('020', 'khao phad gaprao talay', 75, 'available'),
('021', 'khao phad moo', 60, 'available'),
('022', 'khao phad gai', 60, 'available'),
('023', 'khao phad muek', 70, 'available'),
('024', 'khao phad goong', 70, 'available'),
('025', 'khao phad ruammit', 75, 'available'),
('026', 'khao gai grob sauce korea', 75, 'available'),
('027', 'khao khai jeaw moo sap', 55, 'available'),
('028', 'suki haeng', 70, 'available'),
('029', 'suki nam', 70, 'available'),
('030', 'khao moo kratiem', 60, 'available'),
('031', 'french fries', 59, 'available'),
('032', 'gai pop', 69, 'available'),
('033', 'goong chup paeng tod', 89, 'available'),
('034', 'en gai tod', 79, 'available'),
('035', 'nugget', 59, 'available'),
('036', 'cheese ball', 59, 'available'),
('037', 'khanom pang ob ainam', 49, 'available'),
('038', 'sala loi kaew', 45, 'available'),
('039', 'chao kuai', 35, 'available'),
('040', 'panna cotta', 55, 'available'),
('041', 'brownie', 55, 'available'),
('042', 'ice cream chocolate', 45, 'available'),
('043', 'ice cream manao', 45, 'available'),
('044', 'ice cream strawberry', 45, 'available'),
('045', 'ice cream vanilla', 45, 'available'),
('046', 'nam plao', 15, 'available'),
('047', 'nam som kan sod', 45, 'available'),
('048', 'nam manao', 45, 'available'),
('049', 'pepsi', 25, 'available'),
('050', 'cha manao', 45, 'available'),
('051', 'cha thai', 45, 'available'),
('052', 'espresso', 55, 'available'),
('053', 'latte', 55, 'available'),
('054', 'americano', 50, 'available'),
('055', 'cocoa', 50, 'available'),
('056', 'mocha', 55, 'available'),
('057', 'matcha latte', 60, 'available'),
('058', 'cha mali', 45, 'available'),
('059', 'cha dam', 40, 'available'),
('060', 'nom sod', 45, 'available');
GO

INSERT INTO Categorizers (Category_Id, MenuId)
VALUES
('01', '001'),
('01', '002'),
('01', '003'),
('01', '004'),
('01', '005'),
('01', '006'),
('01', '007'),
('01', '008'),
('01', '009'),
('01', '010'),
('01', '011'),
('01', '012'),
('01', '013'),
('01', '014'),
('01', '015'),
('02', '016'),
('02', '017'),
('02', '018'),
('02', '019'),
('02', '020'),
('02', '021'),
('02', '022'),
('02', '023'),
('02', '024'),
('02', '025'),
('02', '026'),
('02', '027'),
('02', '028'),
('02', '029'),
('02', '030'),
('03', '031'),
('03', '032'),
('03', '033'),
('03', '034'),
('03', '035'),
('03', '036'),
('03', '037'),
('04', '038'),
('04', '039'),
('04', '040'),
('04', '041'),
('04', '042'),
('04', '043'),
('04', '044'),
('04', '045'),
('05', '046'),
('05', '047'),
('05', '048'),
('05', '049'),
('05', '050'),
('05', '051'),
('05', '052'),
('05', '053'),
('05', '054'),
('05', '055'),
('05', '056'),
('05', '057'),
('05', '058'),
('05', '059'),
('05', '060');
GO

INSERT INTO Customer (CId)
VALUES
('M00001'),
('G00001');
GO

INSERT INTO Member (CId, MFirstName, MSurName, MTel, MEmail)
VALUES
('M00001', 'natcha', 'kanchanapa', '0812345678', 'member@email.com');
GO

INSERT INTO General (CId)
VALUES
('G00001');
GO

ALTER TABLE Employee
ADD CONSTRAINT check_ERole CHECK (ERole IN ('staff', 'cashier', 'manager', 'chef'));
GO

ALTER TABLE Employee
ADD CONSTRAINT check_EStatus CHECK (EStatus IN ('active', 'inactive', 'resigned'));
GO

ALTER TABLE Tables
ADD CONSTRAINT check_T_Type CHECK (T_Type IN ('small', 'medium', 'large'));
GO

ALTER TABLE Tables
ADD CONSTRAINT check_TStatus CHECK (TStatus IN ('available', 'not available'));
GO

ALTER TABLE Category
ADD CONSTRAINT check_category_name CHECK (Category_Name IN ('recommended', 'food', 'snack', 'dessert', 'drink'));
GO

ALTER TABLE Menu
ADD CONSTRAINT check_MenuStatus CHECK (MenuStatus IN ('available', 'not available'));
GO

IF COL_LENGTH('Payment', 'P_Method') IS NOT NULL
BEGIN
    ALTER TABLE Payment
    ADD CONSTRAINT check_P_Method CHECK (P_Method IN ('Cash', 'Credit Card', 'Qr Code', 'QR Code'));
END
GO

IF COL_LENGTH('Orders', 'OStatus') IS NOT NULL
BEGIN
    EXEC('ALTER TABLE Orders ADD CONSTRAINT check_OStatus CHECK (OStatus IN (''pending'', ''paid'', ''cancelled''))');
END
GO

SELECT 'Employee' AS TableName, COUNT(*) AS TotalRows FROM Employee
UNION ALL SELECT 'Tables', COUNT(*) FROM Tables
UNION ALL SELECT 'Category', COUNT(*) FROM Category
UNION ALL SELECT 'Menu', COUNT(*) FROM Menu
UNION ALL SELECT 'Categorizers', COUNT(*) FROM Categorizers
UNION ALL SELECT 'Customer', COUNT(*) FROM Customer
UNION ALL SELECT 'Member', COUNT(*) FROM Member
UNION ALL SELECT 'General', COUNT(*) FROM General
UNION ALL SELECT 'Reservation', COUNT(*) FROM Reservation
UNION ALL SELECT 'Orders', COUNT(*) FROM Orders
UNION ALL SELECT 'OrderDetails', COUNT(*) FROM OrderDetails
UNION ALL SELECT 'Payment', COUNT(*) FROM Payment
UNION ALL SELECT 'EmployeeReview', COUNT(*) FROM EmployeeReview
UNION ALL SELECT 'Reviews_employee', COUNT(*) FROM Reviews_employee
UNION ALL SELECT 'OrderReview', COUNT(*) FROM OrderReview;
GO

SELECT MenuId, MenuName, Price, MenuStatus
FROM Menu
ORDER BY MenuId;
GO

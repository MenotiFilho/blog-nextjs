CREATE TABLE Usuarios (
    id INT IDENTITY(1,1) PRIMARY KEY,
    nome NVARCHAR(100) NOT NULL,
    email NVARCHAR(100) NOT NULL UNIQUE,
    dataCriacao DATETIME DEFAULT GETDATE()
);
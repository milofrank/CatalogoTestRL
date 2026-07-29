PRAGMA defer_foreign_keys=TRUE;
INSERT INTO "negocios" ("id","nombre","slug") VALUES(1,'Exito Group','exito');
INSERT INTO "negocios" ("id","nombre","slug") VALUES(2,'Olimpica','olimpica');
INSERT INTO "productos" ("id","negocio_id","nombre","descripcion","precio","categoria") VALUES(1,1,'Shampoo exito','Nivea',10000,'Aseo');
INSERT INTO "productos" ("id","negocio_id","nombre","descripcion","precio","categoria") VALUES(2,1,'Arroz Exito','Arroz para suchi',29000,'Comida');
INSERT INTO "productos" ("id","negocio_id","nombre","descripcion","precio","categoria") VALUES(3,2,'Queso Morzarella','Queso que se derrite',20000,'Comida');
INSERT INTO "productos" ("id","negocio_id","nombre","descripcion","precio","categoria") VALUES(4,2,'Bacon','Para hamburguesa',8000,'Comida');
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('negocios',2);
INSERT INTO "sqlite_sequence" ("name","seq") VALUES('productos',4);
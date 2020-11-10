-- 08/11

create table if not exists img_produtos(
	id_img int not null primary key auto_increment,
    id_produto int,
    caminho varchar(255),
    foreign key (id_produto) references produtos (idprodutos)
);
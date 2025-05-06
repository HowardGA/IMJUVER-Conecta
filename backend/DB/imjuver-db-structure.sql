create table Roles(
    rol_id serial PRIMARY KEY,
    nombre varchar(50) not null,
    descripcion varchar(200),
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Usuarios(
    usu_id serial PRIMARY KEY,
    nombre varchar(60) not null,
    apellido varchar(60) not null,
    email varchar(100) UNIQUE NOT NULL,
    password varchar(255) NOT NULL,
    rol_id integer REFERENCES Roles(rol_id),
    fecha_nacimiento date not null,
    telefono varchar(15) not null,
    nivel_educativo varchar(100),
    estado BOOLEAN DEFAULT true,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    -- add token logic for the password reset
);

create table Categorias_Cursos(
    cat_cursos_id serial PRIMARY KEY,
    nombre varchar(50) not null,
    descripcion varchar(200) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Imagenes(
    img_id serial PRIMARY KEY,
    url varchar(255) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Cursos(
    titulo varchar(100) PRIMARY KEY,
    descripcion varchar(200) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    cat_cursos_id integer REFERENCES Categorias_Cursos(cat_cursos_id),
    duracion integer not null,
    nivel varchar(50),
    portada_id integer REFERENCES Imagenes(img_id),
    constancia BOOLEAN DEFAULT false,
    publicado BOOLEAN DEFAULT false,
);

create table Modulos(
    mod_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    descripcion varchar(200) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    curso_id varchar(100) REFERENCES Cursos(titulo),
    orden integer not null
);

create table Recursos(
    rec_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    descripcion varchar(200) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    url varchar(255) not null,
);

create table Lecciones(
    lec_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    mod_id integer REFERENCES Modulos(mod_id),
    orden integer not null,
    tipo varchar(50) not null,
    contenido text,
    recurso_id integer REFERENCES Recursos(rec_id),
);

create table Progreso_Lecciones(
    prog_id serial PRIMARY KEY,
    lec_id integer REFERENCES Lecciones(lec_id),
    usu_id integer REFERENCES Usuarios(usu_id),
    fecha_creacion timestamp DEFAULT now(),
    UNIQUE (lec_id, usu_id)
);

create table Constacias(
    constancia_id serial PRIMARY KEY,
    usu_id integer REFERENCES Usuarios(usu_id),
    curso_id varchar(100) REFERENCES Cursos(titulo),
    fecha_creacion timestamp DEFAULT now(),
    UNIQUE (usu_id, curso_id)
);

create table Categorias_Publicaciones(
    cat_pub_id serial PRIMARY KEY,
    nombre varchar(50) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Publicaciones(
    pub_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    contenido text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    cat_pub_id integer REFERENCES Categorias_Publicaciones(cat_pub_id),
    img_id integer REFERENCES Imagenes(img_id),
    recursos_id integer REFERENCES Recursos(rec_id),
    autor_id integer REFERENCES Usuarios(usu_id),
    visible BOOLEAN DEFAULT true,
    destacado BOOLEAN DEFAULT false,
);

create table Categorias_Foros(
    cat_for_id serial PRIMARY KEY,
    nombre varchar(50) not null,
    descripcion TEXT not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Hilos_Foros(
    hilo_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    contenido text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    cat_for_id integer REFERENCES Categorias_Foros(cat_for_id),
    autor_id integer REFERENCES Usuarios(usu_id),
    visible BOOLEAN DEFAULT true,
);
create table Respuestas_Foros(
    resp_id serial PRIMARY KEY,
    contenido text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    hilo_id integer REFERENCES Hilos_Foros(hilo_id) ON DELETE CASCADE,
    autor_id integer REFERENCES Usuarios(usu_id),
    visible BOOLEAN DEFAULT true,
);

create table Propuestas(
    prop_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    contenido text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    autor_id integer REFERENCES Usuarios(usu_id),
    estado ENUM('Recibida', 'En Revisión', 'Aprobada', 'Rechazada', 'Implementada') not null DEFAULT 'Recibida',
);


create table Eventos(
    eventos_id serial PRIMARY KEY,
    categoria REFERENCES Categorias_Publicaciones(cat_pub_id),
    titulo varchar(100) not null,
    descripcion text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    fecha_evento date not null,
    hora_inicio time not null,
    hora_fin time not null,
    lugar varchar(100) not null,
    imagen_id integer REFERENCES Imagenes(img_id),
    requiere_registro BOOLEAN DEFAULT false,
    max_participantes integer,
);

create table Categorias_Directorio(
    cat_dir_id serial PRIMARY KEY,
    nombre varchar(50) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Directorio(
    dir_id serial PRIMARY KEY,
    nombre varchar(100) not null,
    descripcion text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    cat_dir_id integer REFERENCES Categorias_Directorio(cat_dir_id),
    url varchar(255),
    telefono varchar(15) not null,
    horarios text not null,
);

create table Categorias_Ofertas(
    cat_of_id serial PRIMARY KEY,
    nombre varchar(50) not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
);

create table Ofertas(
    of_id serial PRIMARY KEY,
    titulo varchar(100) not null,
    descripcion text not null,
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    cat_of_id integer REFERENCES Categorias_Ofertas(cat_of_id),
    url varchar(255),
    fecha_vigencia date not null,
    activo BOOLEAN DEFAULT true,
);

create table CVS(
    cv_id serial PRIMARY KEY,
    usu_id integer REFERENCES Usuarios(usu_id),
    fecha_creacion timestamp DEFAULT now(),
    fecha_modificacion timestamp DEFAULT now(),
    url varchar(255) not null,
);
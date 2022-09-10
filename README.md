# Prueba técnica Nexura

Este desarrollo fue llevado a cabo de manera no monolítica, realizando, un backend haciendo uso de [Laravel](https://laravel.com/) como Framework de PHP, un frontend haciendo uso del Framework [Next.js](https://nextjs.org/) de la biblioteca [React](https://es.reactjs.org/) y gestión la persistencia haciendo uso de [MySQL](https://www.mysql.com/).

## Instalación y ejecución

Debe seguir los procesos de instalación de las respectivas tecnología

### Base de datos

Se debe realizar la importación de la [base de datos](https://github.com/sirzes02/nexura_prueba_tecnica/blob/main/prueba_tecnica_dev.sql) que se encuentra en la ruta inicial del repositorio.

Alerta: _Se realizó un cambio en la base de datos, implementando una columna id tipo PRIMARY KEY puesto que por buena practica y por uso de [Eloquent](https://laravel.com/docs/9.x/eloquent) como ORM se requería._

### Backend

Se debe crear el archivo .env de configuración.

```bash
cp .env.example .env
```

Se debe realizar la instalación de dependencias haciendo uso de [Composer](https://getcomposer.org/).

```bash
composer install
```

Se debe generar la nueva llave de aplicación.

```bash
php artisan key:generate
```

Se debe realizar la ejecución del sistema el local (dará como resultado la dirección de dominio donde se debe apuntar el frontend).

```bash
php artisan serve
```

### Frontend

Se debe crear el archivo .env de configuración, posteriormente configurando la propiedad NEXT_PUBLIC_DOMAIN con la URL del dominio donde se está alojando el backend (Considerando la ejecución del mismo, suele ser [localhost:8000](localhost:8000)).

```bash
cp .env.local.example .env.local
```

Se debe realizar la instalación de dependencias haciendo uso de [NPM](https://www.npmjs.com/) o [YARN](https://yarnpkg.com/).

```bash
yarn
```

ó

```bash
npm install
```

Se debe realizar la ejecución del sistema el local.

```bash
yarn dev
```

ó

```bash
npm run dev
```

## Información general

Los principales lenguajes de programación y herramientas usadas durante este desarrollo fueron:

- PHP - v. 8.1.6
- TS - v. 4.8
- Laravel - v. 9.x
- Next.js - v. 12.2

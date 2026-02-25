# Colorear Web

Proyecto con frontend en Next.js y backend en Express.

## Scripts

```bash
npm run dev          # frontend (3000)
npm run dev:backend  # backend (5000)
npm run dev:all      # frontend + backend a la vez

npm run build
npm run start
npm run start:backend
npm run start:all    # frontend + backend en modo prod

npm run proxy:up     # levanta Nginx en Docker (puerto 80)
npm run proxy:logs   # logs de Nginx
npm run proxy:down   # apaga Nginx en Docker
```

## Nginx (frontend + backend con una sola URL)

El archivo [`nginx.conf`](./nginx.conf) ya esta preparado para:

- `/` -> Next.js (`127.0.0.1:3000`)
- `/api/*` -> Express (`127.0.0.1:5000`)
- `/healthz` -> health check de Nginx

### 1. Levantar la app

```bash
npm install
npm run dev:all
```

### 2. Cargar configuracion Nginx

Windows (Nginx instalado en `C:\nginx`):

```powershell
Copy-Item .\nginx.conf C:\nginx\conf\conf.d\colorear-web.conf -Force
& C:\nginx\nginx.exe -t
& C:\nginx\nginx.exe -s reload
```

Linux:

```bash
sudo cp nginx.conf /etc/nginx/sites-available/colorear-web
sudo ln -sf /etc/nginx/sites-available/colorear-web /etc/nginx/sites-enabled/colorear-web
sudo nginx -t
sudo systemctl reload nginx
```

### 3. Probar

- `http://localhost` -> frontend
- `http://localhost/api/...` -> backend
- `http://localhost/healthz` -> `ok`

Si frontend o backend no estan levantados, Nginx devolvera `502 Bad Gateway` en esa ruta.

## Nginx con Docker (sin instalar Nginx localmente)

Tambien puedes usar Nginx en contenedor con [`docker-compose.nginx.yml`](./docker-compose.nginx.yml) y [`nginx.docker.conf`](./nginx.docker.conf).

```bash
npm run dev:all
npm run proxy:up
```

Pruebas:

- `http://localhost` -> frontend
- `http://localhost/api/...` -> backend
- `http://localhost/healthz` -> `ok`

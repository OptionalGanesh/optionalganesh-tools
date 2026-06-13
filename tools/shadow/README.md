# Shadow Trainer OS

Static, local-first training planner for Shadow.

The app generates a weekly plan around:

- Mordida legal
- Calma / colchoneta
- Olfato
- Off-switch / terminado
- Señales básicas
- Nombres de objetos
- Revisión semanal

## Run locally

```sh
cd shadow-trainer-os
python3 -m http.server 8787
```

Open:

```text
http://127.0.0.1:8787/
```

## Deploy

The live path on the VPS is:

```text
/var/www/optionalganesh-tools/tools/shadow
```

Public URL:

```text
https://tools.optionalganesh.com/shadow/
```

Deploy with:

```sh
scp -r index.html styles.css app.js sw.js manifest.json icon.svg README.md vps-og:/var/www/optionalganesh-tools/tools/shadow/
```

## Data

Browser storage key:

```text
shadow_os_v2
```

Use **Ajustes → Exportar JSON** before clearing browser data or replacing a device.

## Notes

- No build step.
- No external dependencies.
- Works offline after first load from localhost/HTTPS.
- Keep it direct and usable on phone first.

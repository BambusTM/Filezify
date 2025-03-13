```bash
docker compose up -d
```

```bash
docker cp insert.js filezify-mongo:/insert.js
```

```bash
docker exec -it filezify-mongo mongosh "mongodb://root:root@localhost:27017/testdb?authSource=admin" /insert.js
```

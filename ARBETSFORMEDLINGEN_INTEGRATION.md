# Arbetsförmedlingen API Integration

## Översikt

Denna applikation kan nu hämta hundratusentals jobb från Arbetsförmedlingens öppna API, spara dem i en lokal databas, och presentera dem som jobbkort till användare.

## Funktioner

### Backend

#### 1. **Batch-synkronisering** (`BatchJobSyncService`)
   - Hanterar stora datamängder genom att dela upp API-anrop per kommun
   - Asynkron processing som inte blockerar servern
   - Kan hantera hundratusentals jobb över tid
   - Automatisk duplikathantering baserat på `externalId`

#### 2. **API Endpoints**

**Synkronisera jobb:**
```bash
# Starta batch-synkronisering (asynkron)
POST /api/jobs/sync/batch?maxJobsPerMunicipality=100

# Kontrollera synkroniseringsstatus
GET /api/jobs/sync/status

# Snabb synkronisering (max 1000 jobb)
POST /api/jobs/sync
```

**Sök och hämta jobb:**
```bash
# Hämta jobb med paginering och filter
GET /api/jobs/search?page=0&size=20&query=utvecklare&location=Stockholm

# Hämta alla jobb med paginering
GET /api/jobs?page=0&size=20&sortBy=createdAt&sortDir=desc

# Hämta specifikt jobb
GET /api/jobs/{id}
```

#### 3. **Strategier för att hantera stora datamängder**

Eftersom Arbetsförmedlingens JobSearch API har begränsningar (max offset 2000), använder vi flera strategier:

1. **Kommunbaserad sökning**: Delar upp data per kommun (20 största kommunerna)
2. **Generell sökning**: Hämtar jobb utan platsfilter
3. **Periodisk synkronisering**: Scheduled job som körs dagligen kl 06:00
4. **Inkrementell uppdatering**: Uppdaterar befintliga jobb baserat på `externalId`

### Frontend

#### 1. **Riktiga data från API**
   - Ersatt dummy data med riktiga API-anrop
   - Loading states och error handling
   - Real-time uppdateringar

#### 2. **Paginering**
   - 20 jobb per sida
   - Fullständig pagination-support
   - Responsiv design för mobil och desktop

#### 3. **Sökning och filtrering**
   - Fritextsökning i titel, företag, och beskrivning
   - Platsfilter
   - Anställningstyp-filter
   - Sortering (relevans, nyast, deadline)

## Användning

### Starta applikationen

**Backend:**
```bash
cd backend
mvn spring-boot:run
```

**Frontend:**
```bash
npm run dev
```

### Synkronisera jobb första gången

Det finns två sätt att synkronisera jobb:

#### Alternativ 1: Batch-synkronisering (rekommenderas för stora mängder)

```bash
# Starta batch-sync (hämtar jobb per kommun)
curl -X POST "http://localhost:8081/api/jobs/sync/batch?maxJobsPerMunicipality=100"

# Kontrollera progress
curl http://localhost:8081/api/jobs/sync/status
```

Denna metod:
- Körs i bakgrunden (asynkront)
- Hämtar upp till 100 jobb per kommun (20 kommuner = upp till 2000 jobb)
- Kan ta flera minuter beroende på API-svarstider
- Inkluderar retry-logik för robusthet

#### Alternativ 2: Snabb synkronisering (max 1000 jobb)

```bash
curl -X POST http://localhost:8081/api/jobs/sync
```

Denna metod:
- Hämtar max 1000 jobb snabbt
- Blockerar tills den är klar
- Bra för initial testning

### Automatisk synkronisering

Applikationen har en scheduled job som körs dagligen kl 06:00 för att hålla databasen uppdaterad.

Du kan ändra schemat i `JobSyncService.java`:
```java
@Scheduled(cron = "0 0 6 * * ?") // 06:00 varje dag
```

## Dataflöde

```
Arbetsförmedlingens API
        ↓
  JobSearchApiService (Hämtar jobb)
        ↓
BatchJobSyncService (Batch-processing)
        ↓
  JobListingRepository (Sparar i databas)
        ↓
    JobController (REST API)
        ↓
  Frontend (React/TypeScript)
        ↓
      Användare
```

## Databas-schema

### job_listings tabell
- `id`: Primary key
- `external_id`: Unikt ID från Arbetsförmedlingen (används för duplikathantering)
- `title`: Jobbtitel
- `description`: Jobbeskrivning
- `company_name`: Företagsnamn
- `location`: Plats
- `employment_type`: Anställningstyp
- `working_hours_type`: Arbetstid
- `published_at`: Publiceringsdatum
- `deadline`: Sista ansökningsdatum
- `source`: Källa (t.ex. "jobsearch_api")
- `status`: ACTIVE, EXPIRED, REMOVED
- `created_at`, `updated_at`: Timestamps

## Prestanda och skalning

### Nuvarande kapacitet
- Kan hantera hundratusentals jobb i databasen
- Paginering gör att frontend kan hantera obegränsade mängder
- API-caching via Spring Boot (kan aktiveras vid behov)

### Förbättringar för ännu större skala
1. **Databas-indexering**:
   - Index på `external_id`, `location`, `employment_type`
   - Fulltextsökning på `title` och `description`

2. **Caching**:
   ```java
   @Cacheable("jobs")
   public Page<JobListing> getAllJobs(Pageable pageable)
   ```

3. **Komprimering**:
   - Gzip compression för API-svar
   - Reducera JSON-storlek

4. **Background jobs**:
   - Kör tunga synkroniseringar på natten
   - Använd message queues (RabbitMQ, Kafka)

## API-begränsningar och lösningar

### Arbetsförmedlingens API-begränsningar:
- **Max offset**: 2000 (kan bara hämta de första 2100 jobben per sökning)
- **Max limit per request**: 100
- **Rate limiting**: Okänd, men vi använder 500-1000ms delay mellan anrop

### Våra lösningar:
1. **Segmentering**: Dela upp sökning per kommun/kategori
2. **Periodisk synk**: Hämta nya jobb regelbundet
3. **Inkrementell uppdatering**: Uppdatera istället för duplicera
4. **Retry-logik**: Hantera temporära API-fel

## Felsökning

### Inga jobb visas i frontend
1. Kontrollera att backend körs: `http://localhost:8081/api/jobs`
2. Kontrollera att jobb finns i databasen:
   ```bash
   curl "http://localhost:8081/api/jobs?size=10"
   ```
3. Synkronisera jobb om databasen är tom:
   ```bash
   curl -X POST http://localhost:8081/api/jobs/sync
   ```

### Synkronisering tar lång tid
- Detta är förväntat för batch-synkronisering
- Kontrollera status: `GET /api/jobs/sync/status`
- Batch-sync körs asynkront, så den blockerar inte servern

### CORS-fel i frontend
- Lägg till frontend-URL i `application.yml`:
  ```yaml
  stegroo:
    security:
      cors:
        allowed-origins: http://localhost:3000,http://localhost:5173,http://localhost:8080
  ```

## Miljövariabler

```bash
# Backend port
SERVER_PORT=8081

# Database (optional, använder H2 in-memory som standard)
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/stegroo
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=yourpassword

# Arbetsförmedlingen API (optional, API fungerar utan nyckel)
AF_API_KEY=your-api-key-if-needed

# Frontend API URL
VITE_API_URL=http://localhost:8081/api
```

## Exempel på användning

### 1. Starta en komplett synkronisering
```bash
# Starta batch sync
curl -X POST "http://localhost:8081/api/jobs/sync/batch?maxJobsPerMunicipality=100"

# Vänta 5 sekunder
sleep 5

# Kolla status
curl http://localhost:8081/api/jobs/sync/status
```

### 2. Sök efter jobb
```bash
# Sök efter utvecklare i Stockholm
curl "http://localhost:8081/api/jobs/search?query=utvecklare&location=Stockholm&size=10"

# Hämta första sidan av alla jobb
curl "http://localhost:8081/api/jobs?page=0&size=20"
```

### 3. Se jobb-statistik
```bash
curl http://localhost:8081/api/jobs/stats
```

## Arkitektur och designbeslut

### Varför batch-synkronisering?
- Arbetsförmedlingens API har begränsningar på hur mycket data vi kan hämta per anrop
- Batch-processing låter oss hämta data i chunks över tid
- Asynkron processing blockerar inte servern

### Varför spara i egen databas?
- Snabbare sökning och filtrering
- Offline-tillgänglighet
- Kan lägga till custom fields och relationer
- Minskar beroende på extern API

### Varför paginering?
- Hundratusentals jobb kan inte skickas till frontend på en gång
- Bättre prestanda och användarupplevelse
- Mindre minnesanvändning

## Framtida förbättringar

1. **Elasticsearch integration**: För ännu snabbare och mer avancerad sökning
2. **Job alerts**: Notifiera användare när nya jobb matchar deras profil
3. **AI-matchning**: Använd ML för att matcha jobb med användare
4. **Real-time updates**: WebSocket för live-uppdateringar
5. **Analytics dashboard**: Visualisera jobb-statistik och trender

## Support och dokumentation

- **Swagger UI**: http://localhost:8081/swagger-ui.html
- **API Docs**: http://localhost:8081/api-docs
- **Arbetsförmedlingen API**: https://jobtechdev.se/

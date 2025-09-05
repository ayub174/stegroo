# Stegroo Backend

Backend-tjänst för Stegroo jobbplattform som hämtar jobbannonser från Arbetsförmedlingens API och erbjuder sök- och matchningstjänster.

## Teknisk stack

- Java 17
- Spring Boot 3.2.4
- PostgreSQL (via Supabase)
- Flyway för databasmigrering
- Maven för bygghantering
- JUnit 5 och Testcontainers för testning

## Projektstruktur

```
src/
├── main/
│   ├── java/
│   │   └── se/
│   │       └── stegroo/
│   │           └── backend/
│   │               ├── config/         # Konfigurationsklasser
│   │               ├── controller/     # REST API controllers
│   │               ├── dto/            # Data Transfer Objects
│   │               ├── exception/      # Anpassade undantag och felhantering
│   │               ├── model/          # Datamodeller/entiteter
│   │               ├── repository/     # JPA repositories
│   │               ├── service/        # Affärslogik och tjänster
│   │               └── util/           # Hjälpklasser
│   └── resources/
│       ├── db/
│       │   └── migration/              # Flyway migreringsscript
│       └── application.yml             # Applikationskonfiguration
└── test/
    ├── java/                           # Testkod
    └── resources/
        └── application-test.yml        # Testkonfiguration
```

## Kom igång

### Förutsättningar

- Java 17 eller senare
- Maven
- PostgreSQL-databas (eller Supabase-konto)
- API-nyckel från Arbetsförmedlingen

### Konfiguration

1. Konfigurera databasanslutning i `application.yml` eller via miljövariabler:
   ```
   SPRING_DATASOURCE_URL=jdbc:postgresql://din-databas-url:5432/stegroo
   SPRING_DATASOURCE_USERNAME=ditt-användarnamn
   SPRING_DATASOURCE_PASSWORD=ditt-lösenord
   ```

2. Konfigurera API-nyckel för Arbetsförmedlingen:
   ```
   AF_API_KEY=din-api-nyckel
   ```

### Bygga och köra

```bash
# Bygga projektet
mvn clean install

# Köra applikationen
mvn spring-boot:run
```

### Testa

```bash
# Köra tester
mvn test
```

## API-dokumentation

API-dokumentation finns tillgänglig via Swagger UI:
- http://localhost:8080/api/swagger-ui.html

## Funktioner

- Daglig synkronisering av jobbannonser från Arbetsförmedlingens API
- Kategorisering av jobb
- Sök- och filtreringsfunktionalitet
- Matchning mellan arbetssökande och jobb (kommande)
- Stöd för arbetsgivare att lägga upp jobbannonser (kommande)

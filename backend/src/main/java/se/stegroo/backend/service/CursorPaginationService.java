package se.stegroo.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import se.stegroo.backend.model.SyncCheckpoint;

import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

/**
 * Service för cursor-baserad paginering.
 * Används för att hantera stora datamängder från Jobstream API
 * utan att förlora positionen under synkronisering.
 */
@Service
public class CursorPaginationService {
    
    private static final Logger log = LoggerFactory.getLogger(CursorPaginationService.class);
    
    /**
     * Skapar en cursor baserat på jobbdata
     */
    public String createCursor(String externalId, LocalDateTime publishedAt, String source) {
        if (externalId == null || publishedAt == null) {
            return null;
        }
        
        // Skapa en unik identifierare baserat på jobbets egenskaper
        String cursorData = String.format("%s|%s|%s", 
                externalId, 
                publishedAt.toString(), 
                source != null ? source : "unknown");
        
        // Enkoda till Base64 för säker överföring
        return Base64.getEncoder().encodeToString(cursorData.getBytes());
    }
    
    /**
     * Dekoder en cursor och extraherar information
     */
    public CursorInfo decodeCursor(String cursor) {
        if (cursor == null || cursor.trim().isEmpty()) {
            return null;
        }
        
        try {
            String decoded = new String(Base64.getDecoder().decode(cursor));
            String[] parts = decoded.split("\\|");
            
            if (parts.length >= 2) {
                String externalId = parts[0];
                LocalDateTime publishedAt = LocalDateTime.parse(parts[1]);
                String source = parts.length > 2 ? parts[2] : null;
                
                return new CursorInfo(externalId, publishedAt, source);
            }
        } catch (Exception e) {
            log.warn("Kunde inte dekoda cursor: {}", cursor, e);
        }
        
        return null;
    }
    
    /**
     * Skapar en cursor för nästa sida baserat på senaste jobbet
     */
    public String createNextCursor(String lastExternalId, LocalDateTime lastPublishedAt, String source) {
        return createCursor(lastExternalId, lastPublishedAt, source);
    }
    
    /**
     * Kontrollerar om en cursor är giltig
     */
    public boolean isValidCursor(String cursor) {
        try {
            CursorInfo info = decodeCursor(cursor);
            return info != null && info.getExternalId() != null && info.getPublishedAt() != null;
        } catch (Exception e) {
            return false;
        }
    }
    
    /**
     * Skapar en cursor från en checkpoint
     */
    public String createCursorFromCheckpoint(SyncCheckpoint checkpoint) {
        if (checkpoint == null || checkpoint.getLastCursor() == null) {
            return null;
        }
        
        return checkpoint.getLastCursor();
    }
    
    /**
     * Uppdaterar en checkpoint med ny cursor
     */
    public void updateCheckpointWithCursor(SyncCheckpoint checkpoint, String cursor) {
        if (checkpoint != null && cursor != null) {
            checkpoint.setLastCursor(cursor);
            checkpoint.setLastSyncAt(LocalDateTime.now());
        }
    }
    
    /**
     * Skapar en cursor för första sidan (null cursor)
     */
    public String createFirstPageCursor() {
        return null;
    }
    
    /**
     * Kontrollerar om det finns fler sidor att hämta
     */
    public boolean hasMorePages(String nextCursor, int currentPageSize, int expectedPageSize) {
        // Om vi fick färre resultat än förväntat, finns det troligen inga fler sidor
        if (currentPageSize < expectedPageSize) {
            return false;
        }
        
        // Om vi har en nextCursor, finns det troligen fler sidor
        return nextCursor != null && !nextCursor.trim().isEmpty();
    }
    
    /**
     * Skapar en cursor för sökning baserat på datum
     */
    public String createDateBasedCursor(LocalDateTime date, String source) {
        if (date == null) {
            return null;
        }
        
        String cursorData = String.format("DATE|%s|%s", 
                date.toString(), 
                source != null ? source : "unknown");
        
        return Base64.getEncoder().encodeToString(cursorData.getBytes());
    }
    
    /**
     * Extraherar datum från en datum-baserad cursor
     */
    public Optional<LocalDateTime> extractDateFromCursor(String cursor) {
        CursorInfo info = decodeCursor(cursor);
        if (info != null && info.getSource() != null && info.getSource().startsWith("DATE|")) {
            return Optional.of(info.getPublishedAt());
        }
        return Optional.empty();
    }
    
    /**
     * Information extraherad från en cursor
     */
    public static class CursorInfo {
        private final String externalId;
        private final LocalDateTime publishedAt;
        private final String source;
        
        public CursorInfo(String externalId, LocalDateTime publishedAt, String source) {
            this.externalId = externalId;
            this.publishedAt = publishedAt;
            this.source = source;
        }
        
        public String getExternalId() {
            return externalId;
        }
        
        public LocalDateTime getPublishedAt() {
            return publishedAt;
        }
        
        public String getSource() {
            return source;
        }
        
        @Override
        public String toString() {
            return "CursorInfo{" +
                    "externalId='" + externalId + '\'' +
                    ", publishedAt=" + publishedAt +
                    ", source='" + source + '\'' +
                    '}';
        }
    }
}

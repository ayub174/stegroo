package se.stegroo.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.junit.jupiter.MockitoExtension;
import se.stegroo.backend.model.SyncCheckpoint;

import java.time.LocalDateTime;
import java.util.Base64;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class CursorPaginationServiceTest {

    @InjectMocks
    private CursorPaginationService cursorPaginationService;

    private LocalDateTime testDateTime;
    private String testExternalId;
    private String testSource;

    @BeforeEach
    void setUp() {
        testDateTime = LocalDateTime.of(2024, 1, 1, 12, 0, 0);
        testExternalId = "job-123";
        testSource = "arbetsformedlingen";
    }

    @Test
    void createCursor_ShouldCreateValidCursor() {
        // When
        String cursor = cursorPaginationService.createCursor(testExternalId, testDateTime, testSource);

        // Then
        assertNotNull(cursor);
        assertFalse(cursor.isEmpty());
        
        // Verify cursor can be decoded
        CursorPaginationService.CursorInfo decoded = cursorPaginationService.decodeCursor(cursor);
        assertNotNull(decoded);
        assertEquals(testExternalId, decoded.getExternalId());
        assertEquals(testDateTime, decoded.getPublishedAt());
        assertEquals(testSource, decoded.getSource());
    }

    @Test
    void createCursor_ShouldHandleNullExternalId() {
        // When
        String cursor = cursorPaginationService.createCursor(null, testDateTime, testSource);

        // Then
        assertNull(cursor);
    }

    @Test
    void createCursor_ShouldHandleNullDateTime() {
        // When
        String cursor = cursorPaginationService.createCursor(testExternalId, null, testSource);

        // Then
        assertNull(cursor);
    }

    @Test
    void createCursor_ShouldHandleNullSource() {
        // When
        String cursor = cursorPaginationService.createCursor(testExternalId, testDateTime, null);

        // Then
        assertNotNull(cursor);
        assertFalse(cursor.isEmpty());
        
        // Verify cursor can be decoded
        CursorPaginationService.CursorInfo decoded = cursorPaginationService.decodeCursor(cursor);
        assertNotNull(decoded);
        assertEquals(testExternalId, decoded.getExternalId());
        assertEquals(testDateTime, decoded.getPublishedAt());
        assertNull(decoded.getSource());
    }

    @Test
    void decodeCursor_ShouldDecodeValidCursor() {
        // Given
        String cursor = cursorPaginationService.createCursor(testExternalId, testDateTime, testSource);

        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor(cursor);

        // Then
        assertNotNull(result);
        assertEquals(testExternalId, result.getExternalId());
        assertEquals(testDateTime, result.getPublishedAt());
        assertEquals(testSource, result.getSource());
    }

    @Test
    void decodeCursor_ShouldHandleNullCursor() {
        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor(null);

        // Then
        assertNull(result);
    }

    @Test
    void decodeCursor_ShouldHandleEmptyCursor() {
        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor("");

        // Then
        assertNull(result);
    }

    @Test
    void decodeCursor_ShouldHandleWhitespaceCursor() {
        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor("   ");

        // Then
        assertNull(result);
    }

    @Test
    void decodeCursor_ShouldHandleInvalidBase64() {
        // Given
        String invalidCursor = "invalid-base64-string!@#";

        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor(invalidCursor);

        // Then
        assertNull(result);
    }

    @Test
    void decodeCursor_ShouldHandleInvalidFormat() {
        // Given
        String invalidData = "invalid|format|without|enough|parts";
        String invalidCursor = Base64.getEncoder().encodeToString(invalidData.getBytes());

        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor(invalidCursor);

        // Then
        assertNull(result);
    }

    @Test
    void decodeCursor_ShouldHandleInvalidDateTime() {
        // Given
        String invalidData = "job-123|invalid-datetime|source";
        String invalidCursor = Base64.getEncoder().encodeToString(invalidData.getBytes());

        // When
        CursorPaginationService.CursorInfo result = cursorPaginationService.decodeCursor(invalidCursor);

        // Then
        assertNull(result);
    }

    @Test
    void createNextCursor_ShouldCreateValidNextCursor() {
        // When
        String nextCursor = cursorPaginationService.createNextCursor(testExternalId, testDateTime, testSource);

        // Then
        assertNotNull(nextCursor);
        assertFalse(nextCursor.isEmpty());
        
        // Verify it's the same as createCursor
        String expectedCursor = cursorPaginationService.createCursor(testExternalId, testDateTime, testSource);
        assertEquals(expectedCursor, nextCursor);
    }

    @Test
    void isValidCursor_ShouldReturnTrueForValidCursor() {
        // Given
        String validCursor = cursorPaginationService.createCursor(testExternalId, testDateTime, testSource);

        // When
        boolean isValid = cursorPaginationService.isValidCursor(validCursor);

        // Then
        assertTrue(isValid);
    }

    @Test
    void isValidCursor_ShouldReturnFalseForNullCursor() {
        // When
        boolean isValid = cursorPaginationService.isValidCursor(null);

        // Then
        assertFalse(isValid);
    }

    @Test
    void isValidCursor_ShouldReturnFalseForEmptyCursor() {
        // When
        boolean isValid = cursorPaginationService.isValidCursor("");

        // Then
        assertFalse(isValid);
    }

    @Test
    void isValidCursor_ShouldReturnFalseForInvalidCursor() {
        // Given
        String invalidCursor = "invalid-cursor";

        // When
        boolean isValid = cursorPaginationService.isValidCursor(invalidCursor);

        // Then
        assertFalse(isValid);
    }

    @Test
    void createCursorFromCheckpoint_ShouldReturnCursorWhenCheckpointExists() {
        // Given
        SyncCheckpoint checkpoint = new SyncCheckpoint();
        String expectedCursor = "test-cursor";
        checkpoint.setLastCursor(expectedCursor);

        // When
        String result = cursorPaginationService.createCursorFromCheckpoint(checkpoint);

        // Then
        assertEquals(expectedCursor, result);
    }

    @Test
    void createCursorFromCheckpoint_ShouldReturnNullWhenCheckpointIsNull() {
        // When
        String result = cursorPaginationService.createCursorFromCheckpoint(null);

        // Then
        assertNull(result);
    }

    @Test
    void createCursorFromCheckpoint_ShouldReturnNullWhenCheckpointHasNoCursor() {
        // Given
        SyncCheckpoint checkpoint = new SyncCheckpoint();
        checkpoint.setLastCursor(null);

        // When
        String result = cursorPaginationService.createCursorFromCheckpoint(checkpoint);

        // Then
        assertNull(result);
    }

    @Test
    void updateCheckpointWithCursor_ShouldUpdateCheckpoint() {
        // Given
        SyncCheckpoint checkpoint = new SyncCheckpoint();
        String newCursor = "new-cursor";

        // When
        cursorPaginationService.updateCheckpointWithCursor(checkpoint, newCursor);

        // Then
        assertEquals(newCursor, checkpoint.getLastCursor());
    }

    @Test
    void updateCheckpointWithCursor_ShouldHandleNullCheckpoint() {
        // Given
        String newCursor = "new-cursor";

        // When & Then (should not throw exception)
        assertDoesNotThrow(() -> {
            cursorPaginationService.updateCheckpointWithCursor(null, newCursor);
        });
    }

    @Test
    void updateCheckpointWithCursor_ShouldHandleNullCursor() {
        // Given
        SyncCheckpoint checkpoint = new SyncCheckpoint();

        // When & Then (should not throw exception)
        assertDoesNotThrow(() -> {
            cursorPaginationService.updateCheckpointWithCursor(checkpoint, null);
        });
    }

    @Test
    void hasMorePages_ShouldReturnTrueWhenNextCursorExists() {
        // Given
        String nextCursor = "next-cursor";
        int currentPageSize = 100;
        int expectedPageSize = 100;

        // When
        boolean hasMore = cursorPaginationService.hasMorePages(nextCursor, currentPageSize, expectedPageSize);

        // Then
        assertTrue(hasMore);
    }

    @Test
    void hasMorePages_ShouldReturnFalseWhenNextCursorIsNull() {
        // Given
        int currentPageSize = 100;
        int expectedPageSize = 100;

        // When
        boolean hasMore = cursorPaginationService.hasMorePages(null, currentPageSize, expectedPageSize);

        // Then
        assertFalse(hasMore);
    }

    @Test
    void hasMorePages_ShouldReturnFalseWhenCurrentPageSizeLessThanExpected() {
        // Given
        String nextCursor = "next-cursor";
        int currentPageSize = 50;
        int expectedPageSize = 100;

        // When
        boolean hasMore = cursorPaginationService.hasMorePages(nextCursor, currentPageSize, expectedPageSize);

        // Then
        assertFalse(hasMore);
    }

    @Test
    void hasMorePages_ShouldReturnFalseWhenNextCursorIsEmpty() {
        // Given
        String nextCursor = "";
        int currentPageSize = 100;
        int expectedPageSize = 100;

        // When
        boolean hasMore = cursorPaginationService.hasMorePages(nextCursor, currentPageSize, expectedPageSize);

        // Then
        assertFalse(hasMore);
    }

    @Test
    void cursorInfo_ShouldHaveCorrectGetters() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();
        String source = "test-source";

        // When
        CursorPaginationService.CursorInfo cursorInfo = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);

        // Then
        assertEquals(externalId, cursorInfo.getExternalId());
        assertEquals(publishedAt, cursorInfo.getPublishedAt());
        assertEquals(source, cursorInfo.getSource());
    }

    @Test
    void cursorInfo_ShouldHandleNullSource() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();

        // When
        CursorPaginationService.CursorInfo cursorInfo = new CursorPaginationService.CursorInfo(externalId, publishedAt, null);

        // Then
        assertEquals(externalId, cursorInfo.getExternalId());
        assertEquals(publishedAt, cursorInfo.getPublishedAt());
        assertNull(cursorInfo.getSource());
    }

    @Test
    void cursorInfo_ToString_ShouldContainAllFields() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();
        String source = "test-source";

        // When
        CursorPaginationService.CursorInfo cursorInfo = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);
        String toString = cursorInfo.toString();

        // Then
        assertTrue(toString.contains(externalId));
        assertTrue(toString.contains(publishedAt.toString()));
        assertTrue(toString.contains(source));
    }

    @Test
    void cursorInfo_EqualsAndHashCode_ShouldWorkCorrectly() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();
        String source = "test-source";

        CursorPaginationService.CursorInfo cursorInfo1 = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);
        CursorPaginationService.CursorInfo cursorInfo2 = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);

        // When & Then
        assertEquals(cursorInfo1, cursorInfo2);
        assertEquals(cursorInfo1.hashCode(), cursorInfo2.hashCode());
    }

    @Test
    void cursorInfo_Equals_ShouldReturnFalseForDifferentObjects() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();
        String source = "test-source";

        CursorPaginationService.CursorInfo cursorInfo1 = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);
        CursorPaginationService.CursorInfo cursorInfo2 = new CursorPaginationService.CursorInfo("different-id", publishedAt, source);

        // When & Then
        assertNotEquals(cursorInfo1, cursorInfo2);
    }

    @Test
    void cursorInfo_Equals_ShouldReturnFalseForNull() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();
        String source = "test-source";

        CursorPaginationService.CursorInfo cursorInfo = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);

        // When & Then
        assertNotEquals(null, cursorInfo);
    }

    @Test
    void cursorInfo_Equals_ShouldReturnFalseForDifferentType() {
        // Given
        String externalId = "job-123";
        LocalDateTime publishedAt = LocalDateTime.now();
        String source = "test-source";

        CursorPaginationService.CursorInfo cursorInfo = new CursorPaginationService.CursorInfo(externalId, publishedAt, source);

        // When & Then
        assertNotEquals("string", cursorInfo);
    }
}

package se.stegroo.backend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.Signature;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tester för AuditLoggingAspect-klassen
 */
@ExtendWith(MockitoExtension.class)
class AuditLoggingAspectTest {

    @Mock
    private ProceedingJoinPoint joinPoint;

    @Mock
    private Signature signature;

    @Mock
    private Object target;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    private AuditLoggingAspect auditLoggingAspect;
    private MockHttpServletRequest request;

    @BeforeEach
    void setUp() {
        auditLoggingAspect = new AuditLoggingAspect();
        
        // Mocka HTTP request
        request = new MockHttpServletRequest();
        request.setRemoteAddr("192.168.1.100");
        request.addHeader("User-Agent", "Mozilla/5.0 Test Browser");
        
        // Mocka joinPoint
        when(joinPoint.getSignature()).thenReturn(signature);
        when(joinPoint.getTarget()).thenReturn(target);
        when(signature.getName()).thenReturn("testMethod");
    }

    @Test
    void testControllerAccessLogging() throws Throwable {
        // Mocka joinPoint
        when(joinPoint.proceed()).thenReturn("success");
        
        // Mocka SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        // Mocka RequestContext
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        // Kör aspect
        Object result = auditLoggingAspect.logControllerAccess(joinPoint);

        // Verifiera resultat
        assertEquals("success", result);
        verify(joinPoint, times(1)).proceed();
    }

    @Test
    void testControllerAccessLoggingWithException() throws Throwable {
        // Mocka exception
        RuntimeException exception = new RuntimeException("Test exception");
        when(joinPoint.proceed()).thenThrow(exception);
        
        // Mocka SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        // Mocka RequestContext
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        // Kör aspect och förvänta exception
        assertThrows(RuntimeException.class, () -> {
            auditLoggingAspect.logControllerAccess(joinPoint);
        });
        
        verify(joinPoint, times(1)).proceed();
    }

    @Test
    void testAnonymousUserLogging() throws Throwable {
        // Mocka joinPoint
        when(joinPoint.proceed()).thenReturn("success");
        
        // Mocka SecurityContext utan autentisering
        when(securityContext.getAuthentication()).thenReturn(null);
        SecurityContextHolder.setContext(securityContext);
        
        // Mocka RequestContext
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        // Kör aspect
        Object result = auditLoggingAspect.logControllerAccess(joinPoint);

        // Verifiera resultat
        assertEquals("success", result);
        verify(joinPoint, times(1)).proceed();
    }

    @Test
    void testClientIpExtraction() throws Throwable {
        // Mocka joinPoint
        when(joinPoint.proceed()).thenReturn("success");
        
        // Mocka SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        // Testa med X-Forwarded-For header
        request.addHeader("X-Forwarded-For", "10.0.0.1, 192.168.1.100");
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        // Kör aspect
        Object result = auditLoggingAspect.logControllerAccess(joinPoint);

        // Verifiera resultat
        assertEquals("success", result);
        verify(joinPoint, times(1)).proceed();
    }

    @Test
    void testUserAgentExtraction() throws Throwable {
        // Mocka joinPoint
        when(joinPoint.proceed()).thenReturn("success");
        
        // Mocka SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        // Testa med User-Agent header
        request.addHeader("User-Agent", "Custom Test Agent/1.0");
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        // Kör aspect
        Object result = auditLoggingAspect.logControllerAccess(joinPoint);

        // Verifiera resultat
        assertEquals("success", result);
        verify(joinPoint, times(1)).proceed();
    }

    @Test
    void testMethodTiming() throws Throwable {
        // Mocka joinPoint med långsam operation
        when(joinPoint.proceed()).thenAnswer(invocation -> {
            Thread.sleep(100); // Simulera långsam operation
            return "slow success";
        });
        
        // Mocka SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        // Mocka RequestContext
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        long startTime = System.currentTimeMillis();
        
        // Kör aspect
        Object result = auditLoggingAspect.logControllerAccess(joinPoint);
        
        long endTime = System.currentTimeMillis();
        long duration = endTime - startTime;

        // Verifiera resultat och timing
        assertEquals("slow success", result);
        assertTrue(duration >= 100, "Operation should take at least 100ms");
        verify(joinPoint, times(1)).proceed();
    }

    @Test
    void testExceptionHandling() throws Throwable {
        // Mocka exception
        RuntimeException exception = new RuntimeException("Database connection failed");
        when(joinPoint.proceed()).thenThrow(exception);
        
        // Mocka SecurityContext
        when(securityContext.getAuthentication()).thenReturn(authentication);
        when(authentication.isAuthenticated()).thenReturn(true);
        when(authentication.getName()).thenReturn("testuser");
        SecurityContextHolder.setContext(securityContext);
        
        // Mocka RequestContext
        ServletRequestAttributes attributes = new ServletRequestAttributes(request);
        RequestContextHolder.setRequestAttributes(attributes);

        // Kör aspect och förvänta exception
        RuntimeException thrownException = assertThrows(RuntimeException.class, () -> {
            auditLoggingAspect.logControllerAccess(joinPoint);
        });
        
        // Verifiera exception
        assertEquals("Database connection failed", thrownException.getMessage());
        verify(joinPoint, times(1)).proceed();
    }
}

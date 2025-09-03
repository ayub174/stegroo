package se.stegroo.backend.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import jakarta.servlet.http.HttpServletRequest;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Arrays;

/**
 * Aspect för audit logging av alla viktiga operationer
 */
@Aspect
@Component
public class AuditLoggingAspect {

    private static final Logger auditLogger = LoggerFactory.getLogger("AUDIT");
    private static final Logger securityLogger = LoggerFactory.getLogger("SECURITY");
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    /**
     * Pointcut för alla controller-metoder
     */
    @Pointcut("execution(* se.stegroo.backend.controller.*.*(..))")
    public void controllerMethods() {}

    /**
     * Pointcut för alla service-metoder
     */
    @Pointcut("execution(* se.stegroo.backend.service.*.*(..))")
    public void serviceMethods() {}

    /**
     * Pointcut för alla repository-metoder
     */
    @Pointcut("execution(* se.stegroo.backend.repository.*.*(..))")
    public void repositoryMethods() {}

    /**
     * Pointcut för admin-operationer
     */
    @Pointcut("execution(* se.stegroo.backend.controller.AdminController.*(..))")
    public void adminOperations() {}

    /**
     * Pointcut för synkroniseringsoperationer
     */
    @Pointcut("execution(* se.stegroo.backend.service.*SyncService.*(..))")
    public void syncOperations() {}

    /**
     * Audit logging för alla controller-anrop
     */
    @Around("controllerMethods()")
    public Object logControllerAccess(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String username = getCurrentUsername();
        String clientIp = getClientIp();
        String userAgent = getUserAgent();

        // Logga start av operation
        auditLogger.info("CONTROLLER_ACCESS_START | User: {} | IP: {} | Class: {} | Method: {} | UserAgent: {} | Timestamp: {}",
            username, clientIp, className, methodName, userAgent, LocalDateTime.now().format(formatter));

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga framgångsrik operation
            auditLogger.info("CONTROLLER_ACCESS_SUCCESS | User: {} | IP: {} | Class: {} | Method: {} | Duration: {}ms | Timestamp: {}",
                username, clientIp, className, methodName, duration, LocalDateTime.now().format(formatter));
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga misslyckad operation
            auditLogger.error("CONTROLLER_ACCESS_FAILURE | User: {} | IP: {} | Class: {} | Method: {} | Duration: {}ms | Error: {} | Timestamp: {}",
                username, clientIp, className, methodName, duration, e.getMessage(), LocalDateTime.now().format(formatter));
            
            throw e;
        }
    }

    /**
     * Detaljerad audit logging för admin-operationer
     */
    @Around("adminOperations()")
    public Object logAdminOperations(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String username = getCurrentUsername();
        String clientIp = getClientIp();
        Object[] args = joinPoint.getArgs();

        // Logga admin-operation med detaljer
        securityLogger.info("ADMIN_OPERATION_START | User: {} | IP: {} | Method: {} | Args: {} | Timestamp: {}",
            username, clientIp, methodName, Arrays.toString(args), LocalDateTime.now().format(formatter));

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga framgångsrik admin-operation
            securityLogger.info("ADMIN_OPERATION_SUCCESS | User: {} | IP: {} | Method: {} | Duration: {}ms | Result: {} | Timestamp: {}",
                username, clientIp, methodName, duration, result, LocalDateTime.now().format(formatter));
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga misslyckad admin-operation
            securityLogger.error("ADMIN_OPERATION_FAILURE | User: {} | IP: {} | Method: {} | Duration: {}ms | Error: {} | Timestamp: {}",
                username, clientIp, methodName, duration, e.getMessage(), LocalDateTime.now().format(formatter));
            
            throw e;
        }
    }

    /**
     * Audit logging för synkroniseringsoperationer
     */
    @Around("syncOperations()")
    public Object logSyncOperations(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String username = getCurrentUsername();
        String clientIp = getClientIp();

        // Logga start av synkronisering
        auditLogger.info("SYNC_OPERATION_START | User: {} | IP: {} | Class: {} | Method: {} | Timestamp: {}",
            username, clientIp, className, methodName, LocalDateTime.now().format(formatter));

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga framgångsrik synkronisering
            auditLogger.info("SYNC_OPERATION_SUCCESS | User: {} | IP: {} | Class: {} | Method: {} | Duration: {}ms | Timestamp: {}",
                username, clientIp, className, methodName, duration, LocalDateTime.now().format(formatter));
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga misslyckad synkronisering
            auditLogger.error("SYNC_OPERATION_FAILURE | User: {} | IP: {} | Class: {} | Method: {} | Duration: {}ms | Error: {} | Timestamp: {}",
                username, clientIp, className, methodName, duration, e.getMessage(), LocalDateTime.now().format(formatter));
            
            throw e;
        }
    }

    /**
     * Audit logging för databasoperationer
     */
    @Around("repositoryMethods()")
    public Object logDatabaseOperations(ProceedingJoinPoint joinPoint) throws Throwable {
        long startTime = System.currentTimeMillis();
        String methodName = joinPoint.getSignature().getName();
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String username = getCurrentUsername();
        Object[] args = joinPoint.getArgs();

        // Logga start av databasoperation
        auditLogger.debug("DATABASE_OPERATION_START | User: {} | Class: {} | Method: {} | Args: {} | Timestamp: {}",
            username, className, methodName, Arrays.toString(args), LocalDateTime.now().format(formatter));

        try {
            Object result = joinPoint.proceed();
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga framgångsrik databasoperation
            auditLogger.debug("DATABASE_OPERATION_SUCCESS | User: {} | Class: {} | Method: {} | Duration: {}ms | Timestamp: {}",
                username, className, methodName, duration, LocalDateTime.now().format(formatter));
            
            return result;
        } catch (Exception e) {
            long duration = System.currentTimeMillis() - startTime;
            
            // Logga misslyckad databasoperation
            auditLogger.error("DATABASE_OPERATION_FAILURE | User: {} | Class: {} | Method: {} | Duration: {}ms | Error: {} | Timestamp: {}",
                username, className, methodName, duration, e.getMessage(), LocalDateTime.now().format(formatter));
            
            throw e;
        }
    }

    /**
     * Hämta aktuell användarnamn
     */
    private String getCurrentUsername() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.isAuthenticated()) {
                return authentication.getName();
            }
        } catch (Exception e) {
            // Ignorera fel vid hämtning av användarnamn
        }
        return "ANONYMOUS";
    }

    /**
     * Hämta klientens IP-adress
     */
    private String getClientIp() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String xForwardedFor = request.getHeader("X-Forwarded-For");
                if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
                    return xForwardedFor.split(",")[0].trim();
                }
                return request.getRemoteAddr();
            }
        } catch (Exception e) {
            // Ignorera fel vid hämtning av IP-adress
        }
        return "UNKNOWN";
    }

    /**
     * Hämta User-Agent header
     */
    private String getUserAgent() {
        try {
            ServletRequestAttributes attributes = (ServletRequestAttributes) RequestContextHolder.getRequestAttributes();
            if (attributes != null) {
                HttpServletRequest request = attributes.getRequest();
                String userAgent = request.getHeader("User-Agent");
                return userAgent != null ? userAgent : "UNKNOWN";
            }
        } catch (Exception e) {
            // Ignorera fel vid hämtning av User-Agent
        }
        return "UNKNOWN";
    }
}

package se.stegroo.backend.exception;

/**
 * Exception för fel vid anrop till Arbetsförmedlingens API.
 */
public class AfApiException extends RuntimeException {

    public AfApiException(String message) {
        super(message);
    }

    public AfApiException(String message, Throwable cause) {
        super(message, cause);
    }
}
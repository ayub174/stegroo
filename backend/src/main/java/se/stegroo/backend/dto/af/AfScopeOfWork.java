package se.stegroo.backend.dto.af;

/**
 * DTO för arbetstid från Arbetsförmedlingens API
 */
public class AfScopeOfWork {
    
    private Integer min;
    private Integer max;
    
    // Getters and Setters
    public Integer getMin() { return min; }
    public void setMin(Integer min) { this.min = min; }
    
    public Integer getMax() { return max; }
    public void setMax(Integer max) { this.max = max; }
}

package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;

/**
 * Arbetstid från JobSearch API
 */
public class ScopeOfWork {
    
    @JsonProperty("min")
    private Integer min;
    
    @JsonProperty("max")
    private Integer max;

    // Getters and setters
    public Integer getMin() { return min; }
    public void setMin(Integer min) { this.min = min; }
    
    public Integer getMax() { return max; }
    public void setMax(Integer max) { this.max = max; }
}

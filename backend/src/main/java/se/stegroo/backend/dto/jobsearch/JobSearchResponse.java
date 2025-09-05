package se.stegroo.backend.dto.jobsearch;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

/**
 * Response från JobSearch API:s /search endpoint
 */
public class JobSearchResponse {
    
    @JsonProperty("total")
    private NumberOfHits total;
    
    @JsonProperty("positions")
    private Integer positions;
    
    @JsonProperty("query_time_in_millis")
    private Integer queryTimeInMillis;
    
    @JsonProperty("result_time_in_millis")
    private Integer resultTimeInMillis;
    
    @JsonProperty("hits")
    private List<JobSearchHit> hits;
    
    @JsonProperty("stats")
    private List<Stats> stats;
    
    @JsonProperty("freetext_concepts")
    private FreetextConcepts freetextConcepts;

    // Getters and setters
    public NumberOfHits getTotal() { return total; }
    public void setTotal(NumberOfHits total) { this.total = total; }
    
    public Integer getPositions() { return positions; }
    public void setPositions(Integer positions) { this.positions = positions; }
    
    public Integer getQueryTimeInMillis() { return queryTimeInMillis; }
    public void setQueryTimeInMillis(Integer queryTimeInMillis) { this.queryTimeInMillis = queryTimeInMillis; }
    
    public Integer getResultTimeInMillis() { return resultTimeInMillis; }
    public void setResultTimeInMillis(Integer resultTimeInMillis) { this.resultTimeInMillis = resultTimeInMillis; }
    
    public List<JobSearchHit> getHits() { return hits; }
    public void setHits(List<JobSearchHit> hits) { this.hits = hits; }
    
    public List<Stats> getStats() { return stats; }
    public void setStats(List<Stats> stats) { this.stats = stats; }
    
    public FreetextConcepts getFreetextConcepts() { return freetextConcepts; }
    public void setFreetextConcepts(FreetextConcepts freetextConcepts) { this.freetextConcepts = freetextConcepts; }
    
    public static class NumberOfHits {
        @JsonProperty("value")
        private Integer value;
        
        public Integer getValue() { return value; }
        public void setValue(Integer value) { this.value = value; }
    }
    
    public static class Stats {
        @JsonProperty("type")
        private String type;
        
        @JsonProperty("values")
        private List<StatDetail> values;
        
        public String getType() { return type; }
        public void setType(String type) { this.type = type; }
        
        public List<StatDetail> getValues() { return values; }
        public void setValues(List<StatDetail> values) { this.values = values; }
    }
    
    public static class StatDetail {
        @JsonProperty("term")
        private String term;
        
        @JsonProperty("concept_id")
        private String conceptId;
        
        @JsonProperty("code")
        private String code;
        
        @JsonProperty("count")
        private Integer count;
        
        public String getTerm() { return term; }
        public void setTerm(String term) { this.term = term; }
        
        public String getConceptId() { return conceptId; }
        public void setConceptId(String conceptId) { this.conceptId = conceptId; }
        
        public String getCode() { return code; }
        public void setCode(String code) { this.code = code; }
        
        public Integer getCount() { return count; }
        public void setCount(Integer count) { this.count = count; }
    }
    
    public static class FreetextConcepts {
        @JsonProperty("skill")
        private List<String> skill;
        
        @JsonProperty("occupation")
        private List<String> occupation;
        
        @JsonProperty("location")
        private List<String> location;
        
        public List<String> getSkill() { return skill; }
        public void setSkill(List<String> skill) { this.skill = skill; }
        
        public List<String> getOccupation() { return occupation; }
        public void setOccupation(List<String> occupation) { this.occupation = occupation; }
        
        public List<String> getLocation() { return location; }
        public void setLocation(List<String> location) { this.location = location; }
    }
}

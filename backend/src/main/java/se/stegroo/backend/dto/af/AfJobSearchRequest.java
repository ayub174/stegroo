package se.stegroo.backend.dto.af;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

/**
 * DTO för sökförfrågan till Arbetsförmedlingens API.
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
public class AfJobSearchRequest {

    /**
     * Fritext för sökning
     */
    @JsonProperty("q")
    private String query;

    /**
     * Plats för sökning
     */
    private List<AfGeoLocation> location;

    /**
     * Yrken för sökning
     */
    private List<AfOccupation> occupation;

    /**
     * Filter för sökning
     */
    private AfFilter filter;

    /**
     * Sorteringsordning
     */
    private String sort;

    /**
     * Antal resultat per sida
     */
    private Integer limit;

    /**
     * Offset för paginering
     */
    private Integer offset;

    /**
     * Statistik för sökning
     */
    private AfStatistics statistics;
    
    public AfJobSearchRequest() {
    }
    
    public String getQuery() {
        return query;
    }
    
    public void setQuery(String query) {
        this.query = query;
    }
    
    public List<AfGeoLocation> getLocation() {
        return location;
    }
    
    public void setLocation(List<AfGeoLocation> location) {
        this.location = location;
    }
    
    public List<AfOccupation> getOccupation() {
        return occupation;
    }
    
    public void setOccupation(List<AfOccupation> occupation) {
        this.occupation = occupation;
    }
    
    public AfFilter getFilter() {
        return filter;
    }
    
    public void setFilter(AfFilter filter) {
        this.filter = filter;
    }
    
    public String getSort() {
        return sort;
    }
    
    public void setSort(String sort) {
        this.sort = sort;
    }
    
    public Integer getLimit() {
        return limit;
    }
    
    public void setLimit(Integer limit) {
        this.limit = limit;
    }
    
    public Integer getOffset() {
        return offset;
    }
    
    public void setOffset(Integer offset) {
        this.offset = offset;
    }
    
    public AfStatistics getStatistics() {
        return statistics;
    }
    
    public void setStatistics(AfStatistics statistics) {
        this.statistics = statistics;
    }

    /**
     * Geografisk plats för sökning
     */
    public static class AfGeoLocation {
        private List<String> code;
        
        public AfGeoLocation() {
        }
        
        public List<String> getCode() {
            return code;
        }
        
        public void setCode(List<String> code) {
            this.code = code;
        }
    }

    /**
     * Yrke för sökning
     */
    public static class AfOccupation {
        private List<String> code;
        
        public AfOccupation() {
        }
        
        public List<String> getCode() {
            return code;
        }
        
        public void setCode(List<String> code) {
            this.code = code;
        }
    }

    /**
     * Filter för sökning
     */
    public static class AfFilter {
        private AfDateRange publishedBefore;
        private AfDateRange publishedAfter;
        private AfDateRange lastPublicationBefore;
        private AfDateRange lastPublicationAfter;
        private AfDateRange removedBefore;
        private AfDateRange removedAfter;
        
        public AfFilter() {
        }
        
        public AfDateRange getPublishedBefore() {
            return publishedBefore;
        }
        
        public void setPublishedBefore(AfDateRange publishedBefore) {
            this.publishedBefore = publishedBefore;
        }
        
        public AfDateRange getPublishedAfter() {
            return publishedAfter;
        }
        
        public void setPublishedAfter(AfDateRange publishedAfter) {
            this.publishedAfter = publishedAfter;
        }
        
        public AfDateRange getLastPublicationBefore() {
            return lastPublicationBefore;
        }
        
        public void setLastPublicationBefore(AfDateRange lastPublicationBefore) {
            this.lastPublicationBefore = lastPublicationBefore;
        }
        
        public AfDateRange getLastPublicationAfter() {
            return lastPublicationAfter;
        }
        
        public void setLastPublicationAfter(AfDateRange lastPublicationAfter) {
            this.lastPublicationAfter = lastPublicationAfter;
        }
        
        public AfDateRange getRemovedBefore() {
            return removedBefore;
        }
        
        public void setRemovedBefore(AfDateRange removedBefore) {
            this.removedBefore = removedBefore;
        }
        
        public AfDateRange getRemovedAfter() {
            return removedAfter;
        }
        
        public void setRemovedAfter(AfDateRange removedAfter) {
            this.removedAfter = removedAfter;
        }
    }

    /**
     * Datumintervall för sökning
     */
    public static class AfDateRange {
        private String date;
        
        public AfDateRange() {
        }
        
        public String getDate() {
            return date;
        }
        
        public void setDate(String date) {
            this.date = date;
        }
    }

    /**
     * Statistik för sökning
     */
    public static class AfStatistics {
        private List<String> term;
        
        public AfStatistics() {
        }
        
        public List<String> getTerm() {
            return term;
        }
        
        public void setTerm(List<String> term) {
            this.term = term;
        }
    }
}
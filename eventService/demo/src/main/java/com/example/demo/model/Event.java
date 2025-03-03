package com.example.demo.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "events")
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private LocalDateTime date;

    @Column(nullable = false)
    private String organizerName;

    @Column(nullable = false)
    private String organizerContact;

    @Column(nullable = false)
    private Double price;

    @Column(nullable = false)
    private Integer totalTickets;

    @Column(nullable = false)
    private Integer availableTickets;

    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String venue;

    @Column(nullable = false)
    private String city;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private EventStatus status = EventStatus.UPCOMING;

    // Enum for event status
    public enum EventStatus {
        UPCOMING, ONGOING, COMPLETED
    }

    // Getters
    public Long getId() { return id; }
    public String getName() { return name; }
    public LocalDateTime getDate() { return date; }
    public String getOrganizerName() { return organizerName; }
    public String getOrganizerContact() { return organizerContact; }
    public Double getPrice() { return price; }
    public Integer getTotalTickets() { return totalTickets; }
    public Integer getAvailableTickets() { return availableTickets; }
    public String getCategory() { return category; }
    public String getVenue() { return venue; }
    public String getCity() { return city; }
    public String getDescription() { return description; }
    public EventStatus getStatus() { return status; }

    // Setters
    public void setName(String name) { this.name = name; }
    public void setId(Long id) { this.id = id; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setOrganizerName(String organizerName) { this.organizerName = organizerName; }
    public void setOrganizerContact(String organizerContact) { this.organizerContact = organizerContact; }
    public void setPrice(Double price) { this.price = price; }
    public void setTotalTickets(Integer totalTickets) { this.totalTickets = totalTickets; }
    public void setAvailableTickets(Integer availableTickets) { this.availableTickets = availableTickets; }
    public void setCategory(String category) { this.category = category; }
    public void setVenue(String venue) { this.venue = venue; }
    public void setCity(String city) { this.city = city; }
    public void setDescription(String description) { this.description = description; }
    public void setStatus(EventStatus status) { this.status = status; }
}

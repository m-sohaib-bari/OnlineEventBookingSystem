package com.example.demo.service;

import com.example.demo.model.Event;
import com.example.demo.repository.EventRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    private final EventRepository eventRepository;

    public EventService(EventRepository eventRepository) {
        this.eventRepository = eventRepository;
    }

    public Optional<Event> getEventById(Long id) {
        return eventRepository.findById(id);
    }

    public boolean getEventAvailability(Long id) {
        Optional<Event> event = eventRepository.findById(id);
        // Check if the event exists, has available tickets, and is in UPCOMING or ONGOING status
        return event.isPresent() &&
                event.get().getAvailableTickets() > 0 &&
                (event.get().getStatus() == Event.EventStatus.UPCOMING || event.get().getStatus() == Event.EventStatus.ONGOING);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public Event createEvent(Event event) {
        event.setId(null); // Ensure Hibernate assigns a new ID
        return eventRepository.save(event);
    }

    @Transactional // Ensures consistency in case of failure
    public boolean deleteEvent(Long id) {
        if (eventRepository.existsById(id) && (eventRepository.getById(id).getStatus() == Event.EventStatus.COMPLETED)) {
            eventRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Transactional
    public Optional<Event> updateEvent(Long id, Event updatedEvent) {
        return eventRepository.findById(id).map(existingEvent -> {
            existingEvent.setName(updatedEvent.getName());
            existingEvent.setDate(updatedEvent.getDate());
            existingEvent.setOrganizerName(updatedEvent.getOrganizerName());
            existingEvent.setOrganizerContact(updatedEvent.getOrganizerContact());
            existingEvent.setPrice(updatedEvent.getPrice());
            existingEvent.setTotalTickets(updatedEvent.getTotalTickets());
            existingEvent.setAvailableTickets(updatedEvent.getAvailableTickets());
            existingEvent.setCategory(updatedEvent.getCategory());
            existingEvent.setVenue(updatedEvent.getVenue());
            existingEvent.setCity(updatedEvent.getCity());
            existingEvent.setDescription(updatedEvent.getDescription());
            existingEvent.setStatus(updatedEvent.getStatus());
            return eventRepository.save(existingEvent);
        });
    }
}

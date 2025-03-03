package com.example.demo.controller;

import com.example.demo.model.Event;
import com.example.demo.service.EventService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import java.util.List;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/events")
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllEvents() {
        List<Event> events = eventService.getAllEvents();
        if (events.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build(); // 204 No Content
        }
        return ResponseEntity.ok(events); // 200 OK
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable Long id) {
        return eventService.getEventById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("{id}/availability")
    public ResponseEntity<Boolean> checkEventAvailability(@PathVariable Long id) {
        boolean isAvailable = eventService.getEventAvailability(id);
        return ResponseEntity.ok(isAvailable);
    }

    @PostMapping("/create")
    public ResponseEntity<Event> createEvent(@RequestBody Event event) {
        if (event == null || event.getName() == null || event.getDate() == null) {
            return ResponseEntity.badRequest().body(null); // 400 Bad Request
        }
        Event createdEvent = eventService.createEvent(event);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdEvent);
    }

    @PutMapping("/update/{id}") // PUT request for updating an event
    public ResponseEntity<Event> updateEvent(@PathVariable Long id, @RequestBody Event updatedEvent) {
        return eventService.updateEvent(id, updatedEvent)
                .map(ResponseEntity::ok) // Return 200 OK with updated event
                .orElseGet(() -> ResponseEntity.notFound().build()); // Return 404 if event not found
    }

    @DeleteMapping("/remove/{id}")
    public ResponseEntity<String> deleteEvent(@PathVariable Long id) {
        boolean exists = eventService.deleteEvent(id);
        if (exists) {
            return ResponseEntity.ok("Event deleted successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Event not found or cannot be removed right now.");
        }
    }
}

import { Ticket, IssueStatus, TimelineEvent, Severity, Coordinates } from "../types";
import { AUTO_ESCALATION_MINUTES } from "../constants";

const STORAGE_KEY = 'civic_ai_tickets';

// --- Helper: Simulate Backend ---

export const getTickets = (): Ticket[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];
  const tickets: Ticket[] = JSON.parse(stored);
  
  // Auto-escalation Logic (Simulation)
  const now = Date.now();
  let changed = false;
  
  const updatedTickets = tickets.map(t => {
    // If ticket is open and older than X minutes, escalate it
    const ageMinutes = (now - t.createdAt) / (1000 * 60);
    if (t.status === IssueStatus.OPEN && ageMinutes > AUTO_ESCALATION_MINUTES && t.severity !== Severity.EMERGENCY) {
      changed = true;
      const escalationEvent: TimelineEvent = {
        timestamp: now,
        title: "Auto-Escalated",
        description: `Ticket escalated due to inactivity for ${AUTO_ESCALATION_MINUTES} simulated days.`,
        icon: "fa-arrow-up"
      };
      return {
        ...t,
        status: IssueStatus.ESCALATED,
        severity: Severity.HIGH, // Bump severity
        timeline: [escalationEvent, ...t.timeline],
        updatedAt: now
      };
    }
    return t;
  });

  if (changed) {
    saveTickets(updatedTickets);
  }

  return updatedTickets.sort((a, b) => b.createdAt - a.createdAt);
};

export const getTicketById = (id: string): Ticket | undefined => {
  const tickets = getTickets();
  return tickets.find(t => t.id === id);
};

export const saveTicket = (ticket: Ticket) => {
  const tickets = getTickets();
  const existingIndex = tickets.findIndex(t => t.id === ticket.id);
  
  if (existingIndex >= 0) {
    tickets[existingIndex] = ticket;
  } else {
    tickets.push(ticket);
  }
  
  saveTickets(tickets);
};

const saveTickets = (tickets: Ticket[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
};

export const voteTicket = (id: string) => {
  const tickets = getTickets();
  const ticket = tickets.find(t => t.id === id);
  if (ticket) {
    ticket.votes += 1;
    saveTicket(ticket);
  }
};

export const addTimelineEvent = (id: string, event: TimelineEvent) => {
  const ticket = getTicketById(id);
  if (ticket) {
    ticket.timeline.unshift(event);
    ticket.updatedAt = Date.now();
    saveTicket(ticket);
  }
};

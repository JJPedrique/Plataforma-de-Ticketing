import { seedData } from '../../../Data/Mock';

export let eventos = seedData.events.map((event) => {
  const venue = seedData.venues.find((v) => v.id === event.venue_id);
  const sections = seedData.sections.filter((s) => s.venue_id === event.venue_id);
  return {
    ...event,
    venue,
    sections,
  };
});

export const addEvento = (evento) => {
  const newEvento = {
    id: eventos.length + 1,
    venue_id: evento.venue_id,
    title: evento.title,
    description: evento.description,
    event_date: evento.event_date,
    is_active: evento.is_active !== false,
    venue: seedData.venues.find((v) => v.id === evento.venue_id),
    sections: seedData.sections.filter((s) => s.venue_id === evento.venue_id),
  };
  eventos.push(newEvento);
  return newEvento;
};

export const updateEvento = (id, updates) => {
  const index = eventos.findIndex((e) => e.id === id);
  if (index === -1) return null;
  eventos[index] = {
    ...eventos[index],
    ...updates,
    venue: updates.venue_id ? seedData.venues.find((v) => v.id === updates.venue_id) : eventos[index].venue,
    sections: updates.venue_id ? seedData.sections.filter((s) => s.venue_id === updates.venue_id) : eventos[index].sections,
  };
  return eventos[index];
};

export const deleteEvento = (id) => {
  const index = eventos.findIndex((e) => e.id === id);
  if (index === -1) return false;
  eventos[index] = { ...eventos[index], is_active: false };
  return true;
};

export const getEventoById = (id) => {
  return eventos.find((e) => e.id === id);
};

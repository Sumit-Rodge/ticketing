import { Ticket } from '../ticket';

it('implements optimistic concurrency control (OCC)', async () => {
  //Create an instance of a ticket
  const ticket = Ticket.build({
    title: 'concer',
    price: 5,
    userId: '123',
  });
  // Save the ticket to the database
  await ticket.save();

  // Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  // Make two seprate changes to the ticket we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // Save the first fetched ticket
  await firstInstance!.save();

  // Save the second fetched ticket and expect an error
  try {
    await secondInstance!.save();
  } catch (error) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('Increments the version number on multiple saves', async () => {
  const ticket = Ticket.build({
    title: 'concert',
    price: 30,
    userId: '123',
  });

  await ticket.save();
  expect(ticket.version).toEqual(0);
  await ticket.save();
  expect(ticket.version).toEqual(1);
  await ticket.save();
  expect(ticket.version).toEqual(2);
});

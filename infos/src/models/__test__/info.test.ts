import { Info } from '../info';

it('implements optimistic concurrency control', async () => {
  // Create an instance of a info
  const info = Info.build({
    title: 'concert',
    price: 5,
    userId: '123',
  });

  // Save the info to the database
  await info.save();

  // fetch the info twice
  const firstInstance = await Info.findById(info.id);
  const secondInstance = await Info.findById(info.id);

  // make two separate changes to the infos we fetched
  firstInstance!.set({ price: 10 });
  secondInstance!.set({ price: 15 });

  // save the first fetched info
  await firstInstance!.save();

  // save the second fetched info and expect an error
  try {
    await secondInstance!.save();
  } catch (err) {
    return;
  }

  throw new Error('Should not reach this point');
});

it('increments the version number on multiple saves', async () => {
  const info = Info.build({
    title: 'concert',
    price: 20,
    userId: '123',
  });

  await info.save();
  expect(info.version).toEqual(0);
  await info.save();
  expect(info.version).toEqual(1);
  await info.save();
  expect(info.version).toEqual(2);
});

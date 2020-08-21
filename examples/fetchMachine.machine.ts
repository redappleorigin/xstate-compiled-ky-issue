import { Machine, interpret } from '@xstate/compiled';
import ky from 'ky';

const loadGoogle = () => {
  return ky.get('www.google.com')
    .text();
}

type Data = {
  yeah: boolean;
};

interface Context {
  data: Data;
}

type Event =
  | { type: 'MAKE_FETCH'; params: { id: string } }
  | { type: 'CANCEL' }
  | { type: 'done.invoke.makeFetch'; data: Data };

const machine = Machine<Context, Event, 'fetchMachine'>({
  initial: 'idle',
  states: {
    idle: {
      on: {
        MAKE_FETCH: 'pending',
      },
    },
    pending: {
      invoke: {
        src: 'makeFetch',
        onDone: 'success',
      },
    },
    success: {
      entry: ['celebrate'],
    },
  },
});

interpret(machine, {
  services: {
    makeFetch: loadGoogle,
  },
  actions: {
    celebrate: (context, event) => {
      console.log(event.data);
    },
  },
});

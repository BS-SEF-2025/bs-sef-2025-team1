const services = ['server', 'firestore'] as const;

export type Service = typeof services[number];

export interface RunnableService {
    start: () => void | Promise<void>;
}

export interface StoppableService extends RunnableService {
    stop: () => void | Promise<void>;
}
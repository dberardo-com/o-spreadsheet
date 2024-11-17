export interface Buddy {
    extension: string;
    name?: string;
    status: 'Ready' | "Not online" | 'Available' | 'Idle' | 'Unavailable' | 'Ringing' | 'Busy' | 'On the phone';
}
import { Session } from "sip.js";
import { SessionDirection, Timer } from "../contexts/sip-provider/types";

export interface SessionCallResult {
    direction: SessionDirection;
    session: Session;
    timer: Timer;
    hold: () => void;
    unhold: () => void;
    isHeld: boolean;
    mute: () => void;
    unmute: () => void;
    isMuted: boolean;
    answer: () => Promise<void> | undefined;
    decline: () => Promise<void> | undefined;
    hangup: () => void;
}
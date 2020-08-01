import { LogLoader } from "./LogLoader";
import ProcessLog, { Event, Trace } from "./ProcessLog";
import moment from 'moment';

class XESLogLoader implements LogLoader {
    loadLog(text: string): Promise<ProcessLog> {
        return new Promise((resolve) => {
            const parser = new DOMParser();
            const XMLDoc = parser.parseFromString(text, "text/xml");

            const traces = Array
                .from(XMLDoc.getElementsByTagName('trace'))
                .map((trace: Element) => {
                    const events = Array
                        .from(trace.getElementsByTagName('event'))
                        .map((event: Element) => {
                            return Array.from(event.children).reduce((event: Event, property: Element) => {
                                const key = property.getAttribute('key')!;
                                const value = property.getAttribute('value')!;
                                if (key === "time:timestamp") {
                                    event.start = moment(value); 
                                    event.end = moment(value); 
                                } else if (key === "concept:name") {
                                    event.name = value; 
                                }
                                return event;
                            }, {} as Event);
                        });

                        const traceStart = moment.min(events.map(e => e.start));
                        const traceEnd = moment.max(events.map(e => e.end));
                    
                    return {
                        start: traceStart,
                        end: traceEnd,
                        events: events,
                    } as Trace;
                });
            const logStart = moment.min(traces.map(t => t.start));
            const logEnd = moment.max(traces.map(t => t.end));
            resolve(new ProcessLog(traces, logStart, logEnd));
        });
    }
}

export default XESLogLoader;
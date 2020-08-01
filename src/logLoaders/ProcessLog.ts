import moment from 'moment';

export type Trace = {
    start: moment.Moment,
    end: moment.Moment,
    events: Array<Event>,
}

export type Event = {
    name: string,
    start: moment.Moment,
    end: moment.Moment,
}

class ProcessLog {
    traces: Trace[];
    start: moment.Moment;
    end: moment.Moment;
    constructor(traces: Array<Trace>, start: moment.Moment, end: moment.Moment) {
        this.traces = traces;
        this.start = start;
        this.end = end;
    }
}

export default ProcessLog
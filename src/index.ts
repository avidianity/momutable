import moment from 'moment';

const mutativeMethods = [
    'add',
    'subtract',
    'startOf',
    'endOf',
    'set',
    'locale',
    'utcOffset',
    'tz',
    'millisecond',
    'second',
    'minute',
    'hour',
    'date',
    'day',
    'weekday',
    'isoWeekday',
    'dayOfYear',
    'week',
    'isoWeek',
    'month',
    'quarter',
    'year',
    'weekYear',
    'isoWeekYear',
];

export default function momutable(
    momentInstance: moment.Moment,
): moment.Moment {
    const instance = momentInstance.clone();

    for (const method of mutativeMethods) {
        const original = (instance as any)[method];
        if (typeof original === 'function') {
            (instance as any)[method] = function (...args: any[]) {
                const clone = instance.clone();
                const result = original.apply(clone, args);

                if (moment.isMoment(result)) {
                    return momutable(result);
                }

                return result;
            };
        }
    }

    return instance;
}

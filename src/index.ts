import type { Moment } from 'moment';

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

export default function makeImmutable(momentInstance: Moment) {
    return new Proxy(momentInstance, {
        get(target, prop, receiver) {
            const originalMethod = Reflect.get(target, prop, receiver);
            if (typeof originalMethod === 'function') {
                if (mutativeMethods.includes(prop.toString())) {
                    return function (...args: any[]) {
                        const clonedInstance = momentInstance.clone();
                        const result = Reflect.apply(
                            originalMethod,
                            clonedInstance,
                            args
                        );

                        return makeImmutable(result as Moment);
                    };
                }
                return originalMethod.bind(target);
            }
            return originalMethod;
        },
    });
}

import moment from 'moment';
import momutable from '../src';

describe('momutable', () => {
    it('should return an immutable Moment instance', () => {
        const mutableMoment = moment();

        const immutableMoment = momutable(mutableMoment);

        expect(immutableMoment.isSame(mutableMoment, 'date')).toBeTruthy();
        expect(immutableMoment).not.toBe(mutableMoment);
        expect(typeof immutableMoment.format).toBe('function');
    });

    it('should clone the original instance so mutations on the original do not affect it', () => {
        const mutableMoment = moment('2024-01-15');
        const immutableMoment = momutable(mutableMoment);

        mutableMoment.add(5, 'days');

        expect(immutableMoment.date()).toBe(15);
    });

    it('should return new immutable instances after mutative method calls', () => {
        const mutableMoment = moment();
        const clonedMutableMoment = mutableMoment.clone();

        const immutableMoment = momutable(mutableMoment);

        const newImmutableMoment = immutableMoment.add(1, 'day');

        // Original mutable moment is unchanged
        expect(mutableMoment.isSame(clonedMutableMoment, 'date')).toBeTruthy();

        // Original immutable moment is unchanged
        expect(
            immutableMoment.isSame(clonedMutableMoment, 'date'),
        ).toBeTruthy();

        // New immutable instance has the correct value
        expect(
            newImmutableMoment.isSame(moment().add(1, 'day'), 'day'),
        ).toBeTruthy();
        expect(newImmutableMoment).not.toBe(immutableMoment);
    });

    it('should maintain immutability when accessing non-mutative methods', () => {
        const mutableMoment = moment();

        const immutableMoment = momutable(mutableMoment);

        const formattedDate = immutableMoment.format('YYYY-MM-DD');

        expect(mutableMoment.format('YYYY-MM-DD')).toEqual(formattedDate);
        expect(immutableMoment.format('YYYY-MM-DD')).toEqual(formattedDate);
    });

    it('should handle nested immutability correctly', () => {
        const mutableMoment = moment();

        const immutableMoment = momutable(mutableMoment);

        const newImmutableMoment = immutableMoment.add(1, 'day');
        const newerImmutableMoment = newImmutableMoment.subtract(1, 'day');

        expect(mutableMoment.isSame(moment(), 'date')).toBeTruthy();
        expect(immutableMoment.isSame(moment(), 'date')).toBeTruthy();
        expect(newerImmutableMoment.isSame(moment(), 'date')).toBeTruthy();
        expect(newerImmutableMoment).not.toBe(newImmutableMoment);
    });

    it('should handle getter/setter duals correctly', () => {
        const immutableMoment = momutable(moment('2024-06-15'));

        // Getter mode: returns a number, not a Moment
        expect(immutableMoment.date()).toBe(15);
        expect(immutableMoment.month()).toBe(5); // June is 5 (0-indexed)
        expect(immutableMoment.year()).toBe(2024);
        expect(immutableMoment.day()).toBe(6); // Saturday

        // Setter mode: returns a new immutable Moment
        const changed = immutableMoment.date(20);
        expect(changed.date()).toBe(20);
        expect(immutableMoment.date()).toBe(15); // Original unchanged
    });

    it('should handle startOf and endOf correctly', () => {
        const immutableMoment = momutable(moment('2024-06-15T14:30:00'));

        const startOfDay = immutableMoment.startOf('day');
        expect(startOfDay.hour()).toBe(0);
        expect(startOfDay.minute()).toBe(0);

        // Original unchanged
        expect(immutableMoment.hour()).toBe(14);
        expect(immutableMoment.minute()).toBe(30);

        const endOfDay = immutableMoment.endOf('day');
        expect(endOfDay.hour()).toBe(23);
        expect(endOfDay.minute()).toBe(59);

        // Original still unchanged
        expect(immutableMoment.hour()).toBe(14);
    });

    it('should handle locale as getter and setter', () => {
        const immutableMoment = momutable(moment());

        // Getter
        expect(typeof immutableMoment.locale()).toBe('string');

        // Setter
        const localized = immutableMoment.locale('fr');
        expect(localized.locale()).toBe('fr');
    });

    it('should handle utcOffset as getter and setter', () => {
        const immutableMoment = momutable(moment());

        // Getter
        expect(typeof immutableMoment.utcOffset()).toBe('number');

        // Setter
        const offset = immutableMoment.utcOffset(5);
        expect(offset.utcOffset()).toBe(5 * 60);
        expect(immutableMoment.utcOffset()).not.toBe(5 * 60);
    });
});

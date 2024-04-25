import moment from 'moment';
import momutable from '../src';

describe('makeImmutable', () => {
    it('should return an immutable Moment instance', () => {
        // Create a Moment.js instance
        const mutableMoment = moment();
        const clonedMutableMoment = mutableMoment.clone();

        // Make the moment instance immutable
        const immutableMoment = momutable(mutableMoment);

        // Verify that the immutable moment instance behaves correctly
        expect(
            immutableMoment.isSame(clonedMutableMoment, 'date')
        ).toBeTruthy();
        expect(immutableMoment).not.toBe(mutableMoment); // Ensure immutability
        expect(typeof immutableMoment.format).toBe('function'); // Ensure methods are accessible
    });

    it('should return new immutable instances after mutative method calls', () => {
        // Create a Moment.js instance
        const mutableMoment = moment();
        const clonedMutableMoment = mutableMoment.clone();

        // Make the moment instance immutable
        const immutableMoment = momutable(mutableMoment);

        // Call a mutative method on the immutable moment instance
        const newImmutableMoment = immutableMoment.add(1, 'day');

        // Verify that the original moment instance is not modified
        expect(mutableMoment.isSame(clonedMutableMoment, 'date')).toBeTruthy();

        // Verify that the original immutable moment instance is not modified
        expect(
            immutableMoment.isSame(clonedMutableMoment, 'date')
        ).toBeTruthy();

        // Verify that a new immutable instance is returned after mutative method call
        expect(
            newImmutableMoment.isSame(moment().add(1, 'day'), 'day')
        ).toBeTruthy();
        expect(newImmutableMoment).not.toBe(immutableMoment); // Ensure immutability
    });

    it('should maintain immutability when accessing non-mutative methods', () => {
        // Create a Moment.js instance
        const mutableMoment = moment();

        // Make the moment instance immutable
        const immutableMoment = momutable(mutableMoment);

        // Access a non-mutative method
        const formattedDate = immutableMoment.format('YYYY-MM-DD');

        // Verify that the original moment instance is not modified
        expect(mutableMoment.format('YYYY-MM-DD')).toEqual(formattedDate);

        // Verify that the immutable moment instance is not modified
        expect(immutableMoment.format('YYYY-MM-DD')).toEqual(formattedDate);
    });

    it('should handle nested immutability correctly', () => {
        // Create a Moment.js instance
        const mutableMoment = moment();

        // Make the moment instance immutable
        const immutableMoment = momutable(mutableMoment);

        // Call a mutative method on the immutable moment instance
        const newImmutableMoment = immutableMoment.add(1, 'day');

        // Call another mutative method on the new immutable moment instance
        const newerImmutableMoment = newImmutableMoment.subtract(1, 'day');

        // Verify that the original moment instance is not modified
        expect(mutableMoment.isSame(moment(), 'date')).toBeTruthy();

        // Verify that the original immutable moment instance is not modified
        expect(immutableMoment.isSame(moment(), 'date')).toBeTruthy();

        // Verify that a new immutable instance is returned after mutative method calls
        expect(newerImmutableMoment.isSame(moment(), 'date')).toBeTruthy();
        expect(newerImmutableMoment).not.toBe(newImmutableMoment); // Ensure immutability
    });
});

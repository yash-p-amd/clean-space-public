import { InsertPreference } from './enums';
import { addInArray, removeFromArray } from './shared';

test('Should insert a new element after the reference element', () => {
    //First
    //Not possible as it requires a reference element, which is not possible in this test.

    //Middle
    expect(addInArray({ pref: InsertPreference.AfterReference, newEle: 3, refEle: 2, col: [1, 2, 4] })).toStrictEqual([1, 2, 3, 4]);

    //Last
    expect(addInArray({ pref: InsertPreference.AfterReference, newEle: 4, refEle: 3, col: [1, 2, 3] })).toStrictEqual([1, 2, 3, 4]);

    //Out of range
    expect(addInArray({ pref: InsertPreference.AfterReference, newEle: 3, refEle: 6, col: [1, 2, 4] })).toStrictEqual([1, 2, 4]);
});

test('Should insert a new element at the reference position', () => {
    //First 
    expect(addInArray({ pref: InsertPreference.AtReference, newEle: 1, refEle: 2, col: [2, 3, 4] })).toStrictEqual([1, 2, 3, 4]);

    //Middle
    expect(addInArray({ pref: InsertPreference.AtReference, newEle: 3, refEle: 4, col: [1, 2, 4] })).toStrictEqual([1, 2, 3, 4]);

    //Last
    //Not possible to insert a new element at the end of an array as it would push a new element before the reference element and the reference element would be the last element.

    //Out of range
    expect(addInArray({ pref: InsertPreference.AtReference, newEle: 3, refEle: 6, col: [1, 2, 4] })).toStrictEqual([1, 2, 4]);
});

test('Should remove an element 3', () => {
    expect(removeFromArray({ refEle: 3, col: [1, 2, 3, 4] })).toStrictEqual([1, 2, 4]);
});

test('Should remove an element 1', () => {
    expect(removeFromArray({ refEle: 1, col: [1, 2, 3, 4] })).toStrictEqual([2, 3, 4]);
});

test('Should remove an element 4', () => {
    expect(removeFromArray({ refEle: 4, col: [1, 2, 3, 4] })).toStrictEqual([1, 2, 3]);
});

test('Should return the same collection', () => {
    expect(removeFromArray({ refEle: 6, col: [1, 2, 3, 4] })).toStrictEqual([1, 2, 3, 4]);
});
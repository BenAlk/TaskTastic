export const moveItemUp = (array, index) => {
    if (index === 0 || index >= array.length) {
        console.log('Cannot move item any further in this direction.')
        return array;
    }

    const item = array.splice(index, 1)[0];
    array.splice(index - 1, 0, item);
    return array;
}

export const moveItemDown = (array, index) => {
    if (index === array.length - 1 || index < 0) {
        console.log('Cannot move item any further in this direction.')
        return array;
    }

    const item = array.splice(index, 1)[0];
    array.splice(index + 1, 0, item);
    return array;
}

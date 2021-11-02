export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function getRandomColor() {
    const r = getRandomIntInclusive(0, 256);
    const g = getRandomIntInclusive(0, 256);
    const b = getRandomIntInclusive(0, 256);

    return `rgb(${r}, ${g}, ${b})`;
}

export function getRandomSize() {
    return getRandomIntInclusive(20, 32);
}

export const updateData = (items, update) => {
    const index = items.findIndex((item) => item.id === update.id);

    if (index === -1) {
        return items;
    }

    return [
        ...items.slice(0, index),
        update,
        ...items.slice(index + 1)
    ];
};
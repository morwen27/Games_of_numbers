export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
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
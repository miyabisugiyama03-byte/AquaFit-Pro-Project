export function formatSkillLevel(level: string) {
    return level
        .toLowerCase()
        .replace('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function formatSessionsPerWeek(sessions: string) {
    return sessions === 'TWO' ? '2 sessions/week' : '1 session/week';
}

export function getBlockWeeks(startDate: string, endDate: string) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();

    return Math.max(1, Math.ceil(diff / (1000 * 60 * 60 * 24 * 7)));
}

export function getBlockPriceCents(
    startDate: string,
    endDate: string,
    sessions: string,
) {
    const weeks = getBlockWeeks(startDate, endDate);

    if (sessions === 'TWO') {
        return weeks * 2 * 1300;
    }

    return weeks * 1500;
}

export function getBlockPrice(startDate: string, endDate: string, sessions: string) {
    return `€${(getBlockPriceCents(startDate, endDate, sessions) / 100).toFixed(2)}`;
}
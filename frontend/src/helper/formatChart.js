export const formatPie = (data) => {
    const statusCounts = data.reduce((acc, order) => {
        const status = order.status;
        acc[status] = (acc[status] || 0) + 1;
        return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
        name: status,
        value: count,
    }));
};


/**
 * Tính khoảng cách giữa hai điểm GPS (lat/lon) bằng công thức Haversine (đơn vị: mét)
 */
export const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number,
): number => {
    const R = 6371e3; // Bán kính Trái Đất (mét)
    const phi1 = (lat1 * Math.PI) / 180;
    const phi2 = (lat2 * Math.PI) / 180;
    const deltaphi = ((lat2 - lat1) * Math.PI) / 180;
    const deltalamda = ((lon2 - lon1) * Math.PI) / 180;

    const a =
        Math.sin(deltaphi / 2) * Math.sin(deltaphi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltalamda / 2) * Math.sin(deltalamda / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const distanceInMeters = R * c;
    return distanceInMeters;
};
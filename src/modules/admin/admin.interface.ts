export interface IDashboardStats {
    users: {
        total: number;
        tenants: number;
        landlords: number;
        admins: number;
        active: number;
        banned: number;
    };

    properties: {
        total: number;
        available: number;
        rented: number;
        unavailable: number;
    };

    rentalRequests: {
        total: number;
        pending: number;
        approved: number;
        rejected: number;
        completed: number;
        cancelled: number;
    };

    payments: {
        total: number;
        pending: number;
        completed: number;
        failed: number;
        refunded: number;
        totalRevenue: number;
    };

    reviews: {
        total: number;
    };
}
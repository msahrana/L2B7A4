export interface ICreateRental {
    propertyId: string;
    moveInDate: Date;
    message?: string;
}

export interface IUpdateRental {
    propertyId: string;
    moveInDate: Date;
    message?: string;
}

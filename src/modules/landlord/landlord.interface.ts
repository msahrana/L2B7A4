export interface ICreateProperty {
    title: string;
    description: string;
    location: string;
    address?: string;
    rent: number;
    bedrooms: number;
    bathrooms: number;
    area?: number;
    propertyType: string;
    amenities: string[];
    thumbnail?: string;
    images: string[];
    categoryId: string;
}

export interface IUpdateProperty {
    title?: string;
    description?: string;
    location?: string;
    address?: string;
    rent?: number;
    bedrooms?: number;
    bathrooms?: number;
    area?: number;
    propertyType?: string;
    amenities?: string[];
    thumbnail?: string;
    images?: string[];
    categoryId?: string;
}

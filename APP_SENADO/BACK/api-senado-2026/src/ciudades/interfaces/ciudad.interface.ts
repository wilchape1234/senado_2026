export interface Ciudad {
    id: number;
    name: string | null;
    description: string | null;
    surface: number | null;
    population: number | null;
    postalCode: string | null;
    departmentId: number;
}
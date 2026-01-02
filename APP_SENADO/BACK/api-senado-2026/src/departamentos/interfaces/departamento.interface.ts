
export interface Departamento {
    id: number;
    name: string;
    description: string | null;
    cityCapitalId: number | null;
    municipalities: number | null;
    surface: number | null;
    population: number | null;
    phonePrefix: string | null;
}

/* 

    id	integer($int32)
    name	string
    nullable: true
    description	string
    cityCapitalId	integer($int32)
    nullable: true
    municipalities	integer($int32)
    surface	number($float)
    population	number($float)
    phonePrefix	string
*/
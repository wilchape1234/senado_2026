
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
nullable: true
cityCapitalId	integer($int32)
nullable: true
municipalities	integer($int32)
nullable: true
surface	number($float)
population	number($float)
nullable: true
phonePrefix	string
*/
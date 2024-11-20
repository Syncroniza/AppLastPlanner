export const BASE_URL =
    import.meta.env.MODE === 'production' ?
        'https://api-planner.appsyncroniza.cl' :
        'http://localhost:8000';
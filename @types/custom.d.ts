declare namespace Express {
    interface Request {
        payload?:any
        quickStore:import("../redis").StoreType
        actions:import("../Resolvers/App/Auth/actions").ActionsType
    }
}
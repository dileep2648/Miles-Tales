from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

durations = durations = [
    #   0    1    2    3    4    5    6    7
    [   0, 900, 700, 950, 300, 800, 650, 1000], # 0
    [ 900,   0, 400, 750, 850, 250, 600, 700],  # 1
    [ 700, 400,   0, 650, 200, 500, 350, 800],  # 2
    [ 950, 750, 650,   0, 700, 550, 800, 300],  # 3
    [ 300, 850, 200, 700,   0, 600, 250, 900],  # 4
    [ 800, 250, 500, 550, 600,   0, 450, 650],  # 5
    [ 650, 600, 350, 800, 250, 450,   0, 500],  # 6
    [1000, 700, 800, 300, 900, 650, 500,   0]   # 7
]


# 0 = Charminar
# 1 = Golconda Fort
# 2 = Ramoji Film City

START = 3
END = 7


manager = pywrapcp.RoutingIndexManager(
    len(durations),
    1,
    [START],
    [END]
)

routing = pywrapcp.RoutingModel(manager)


def time_callback(from_index, to_index):

    from_node = manager.IndexToNode(from_index)
    to_node = manager.IndexToNode(to_index)

    return durations[from_node][to_node]


callback_index = routing.RegisterTransitCallback(
    time_callback
)

routing.SetArcCostEvaluatorOfAllVehicles(
    callback_index
)


search_parameters = (
    pywrapcp.DefaultRoutingSearchParameters()
)

search_parameters.first_solution_strategy = (
    routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
)


solution = routing.SolveWithParameters(
    search_parameters
)


if solution:

    index = routing.Start(0)

    route = []

    while not routing.IsEnd(index):

        route.append(
            manager.IndexToNode(index)
        )

        index = solution.Value(
            routing.NextVar(index)
        )

    route.append(
        manager.IndexToNode(index)
    )

    print("ROUTE:", route)

else:

    print("No route found")
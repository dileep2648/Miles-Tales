from ortools.constraint_solver import routing_enums_pb2
from ortools.constraint_solver import pywrapcp

import sys
import json


def optimize_route(durations, start_index=0, end_index=None, round_trip=False):
    num_locations = len(durations)
    if num_locations <= 1:
        return [0]

    # CASE 1: Open One-Way (Auto-select optimal end city using 0-cost dummy node)
    is_open_end = (not round_trip) and (end_index is None)

    if is_open_end:
        dummy_node = num_locations
        # Attach 0-cost transitions to dummy node
        extended_matrix = [row + [0] for row in durations]
        extended_matrix.append([0] * (num_locations + 1))

        manager = pywrapcp.RoutingIndexManager(
            num_locations + 1,
            1,
            [start_index],
            [dummy_node]
        )
        active_matrix = extended_matrix
    else:
        # CASE 2 & 3: Fixed End or Round Trip
        target_end = start_index if round_trip else end_index
        manager = pywrapcp.RoutingIndexManager(
            num_locations,
            1,
            [start_index],
            [target_end]
        )
        active_matrix = durations

    routing = pywrapcp.RoutingModel(manager)

    def time_callback(from_index, to_index):
        from_node = manager.IndexToNode(from_index)
        to_node = manager.IndexToNode(to_index)
        return int(active_matrix[from_node][to_node])

    transit_callback_index = routing.RegisterTransitCallback(time_callback)
    routing.SetArcCostEvaluatorOfAllVehicles(transit_callback_index)

    search_parameters = pywrapcp.DefaultRoutingSearchParameters()
    search_parameters.first_solution_strategy = (
        routing_enums_pb2.FirstSolutionStrategy.PATH_CHEAPEST_ARC
    )
    search_parameters.local_search_metaheuristic = (
        routing_enums_pb2.LocalSearchMetaheuristic.GUIDED_LOCAL_SEARCH
    )
    search_parameters.time_limit.seconds = 2

    solution = routing.SolveWithParameters(search_parameters)

    if not solution:
        raise Exception("No route found")

    route = []
    index = routing.Start(0)

    while not routing.IsEnd(index):
        node = manager.IndexToNode(index)
        if not (is_open_end and node == num_locations):
            route.append(node)
        index = solution.Value(routing.NextVar(index))

    # Append end node if it is a fixed destination or round trip
    end_node = manager.IndexToNode(index)
    if not is_open_end:
        route.append(end_node)

    return route


if __name__ == "__main__":
    input_data = sys.stdin.read()
    payload = json.loads(input_data)

    # Handles both legacy array [[...]] and flexible request object {...}
    if isinstance(payload, list):
        durations = payload
        start_idx = 0
        end_idx = None
        is_round = False
    else:
        durations = payload.get("durations") or payload.get("matrix", [])
        start_idx = payload.get("startIndex", 0)
        end_idx = payload.get("endIndex", None)
        is_round = payload.get("roundTrip", False)

    result = optimize_route(durations, start_idx, end_idx, is_round)
    print(json.dumps(result))
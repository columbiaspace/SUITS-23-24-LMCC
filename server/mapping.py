from types import NoneType
import heapq
import utm
import json
import math
from scipy.interpolate import CubicSpline
import numpy as np

# Conversion functions
def utm_to_latlon(easting, northing):
    zone_number = 15
    zone_letter = 'R'
    lat, lon = utm.to_latlon(easting, northing, zone_number, zone_letter)
    return lat, lon

def latlon_to_utm(latitude, longitude):
    easting, northing, zone_number, zone_letter = utm.from_latlon(latitude, longitude)
    return easting, northing, zone_number, zone_letter

# Grid setup
grid_width = 29
grid_height = 27
grid = [[1 for _ in range(grid_width)] for _ in range(grid_height)]

def letter_to_index(coord):
    if coord.startswith('AA'):  # Handle AA as the top row
        return 0, int(coord[2:])
    else:
        row = ord('Z') - ord(coord[0]) + 1
        return row, int(coord[1:])

# Define areas with specific weights
def define_areas(grid, areas, weight):
    for start, end in areas:
        start_x, start_y = letter_to_index(start)
        end_x, end_y = letter_to_index(end)
        for i in range(start_x, end_x + 1):
            for j in range(start_y, end_y + 1):
                grid[i][j] = weight

grass_areas = [
    ('AA0', 'U16'), ('U0', 'T16'), ('T0', 'S13'), ('S0', 'R11'), ('R0', 'Q9'), ('Q0', 'P8'),
    ('O0', 'O7'), ('N0', 'M7'), ('M0', 'I3'), ('I0', 'G2'), ('G0', 'F2'), ('F0', 'A1'),
    ('C1', 'A5'), ('A5', 'A14'), ('AA16', 'AA28'), ('Z23', 'X28'), ('H15', 'D22'),
    ('D18', 'A22'), ('J19', 'H28'), ('L20', 'K24'), ('H25', 'A28'), ('I18', 'H18')
]
define_areas(grid, grass_areas, 3)

mound_areas = [
    ('M9', 'L17'), ('Q9', 'M18'), ('P8', 'M9'), ('R10', 'Q19'),
    ('S12', 'R19'), ('T13', 'S19')
]
define_areas(grid, mound_areas, 0)

# Graph setup
graph = {}
distances = {}
predecessors = {}

def index_to_letter(index):
    if index == 0:
        return "AA"
    else:
        return chr(ord('A') + 26 - index - 1)

def initialize_graph():
    for row in range(grid_height):
        for col in range(grid_width):
            coord = index_to_letter(row) + str(col)
            distances[coord] = float('inf')
            predecessors[coord] = None  # Initialize predecessor to None

            neighbors = {}
            if row > 0:
                neighbors[index_to_letter(row - 1) + str(col)] = grid[row][col]
            if row < grid_height - 1:
                neighbors[index_to_letter(row + 1) + str(col)] = grid[row][col]
            if col > 0:
                neighbors[index_to_letter(row) + str(col - 1)] = grid[row][col]
            if col < grid_width - 1:
                neighbors[index_to_letter(row) + str(col + 1)] = grid[row][col]

            # Add diagonal neighbors with a length of sqrt(2)
            if row > 0 and col > 0:
                neighbors[index_to_letter(row - 1) + str(col - 1)] = grid[row][col] * math.sqrt(2)
            if row > 0 and col < grid_width - 1:
                neighbors[index_to_letter(row - 1) + str(col + 1)] = grid[row][col] * math.sqrt(2)
            if row < grid_height - 1 and col > 0:
                neighbors[index_to_letter(row + 1) + str(col - 1)] = grid[row][col] * math.sqrt(2)
            if row < grid_height - 1 and col < grid_width - 1:
                neighbors[index_to_letter(row + 1) + str(col + 1)] = grid[row][col] * math.sqrt(2)

            graph[coord] = neighbors

initialize_graph()

# Dijkstra's algorithm
def dijkstra(graph, startLat, startLong, endLat, endLong):
    Start_east, Start_north, _, _ = latlon_to_utm(startLat, startLong)
    start = indices_to_grid_coord(Start_east, Start_north)

    End_east, End_north, _, _ = latlon_to_utm(endLat, endLong)
    end = indices_to_grid_coord(End_east, End_north)

    pq = [(0, start)]
    visited = set()
    distances[start] = 0

    while pq:
        dist, node = heapq.heappop(pq)

        if node == end:
            break 

        if node in visited:
            continue

        visited.add(node)

        for neighbor, weight in graph[node].items():
            if distances[node] + weight < distances[neighbor]:
                distances[neighbor] = distances[node] + weight
                predecessors[neighbor] = node
                heapq.heappush(pq, (distances[neighbor], neighbor))

def reconstruct_path(startLat, startLong, endLat, endLong):
    Start_east, Start_north, _, _ = latlon_to_utm(startLat, startLong)
    start = indices_to_grid_coord(Start_east, Start_north)

    End_east, End_north, _, _ = latlon_to_utm(endLat, endLong)
    end = indices_to_grid_coord(End_east, End_north)

    path = []
    node = end

    coord_path = []
    while node is not None:
        path.append(node)
        node = predecessors[node]

    for item in path[::-1]:
        east, north = grid_coord_to_indices(item)
        coord_path.append(utm_to_latlon(east, north))

    return coord_path  # Reverse the path to start from start node

# Convert grid coordinates to indices
def grid_coord_to_indices(coord):
    def letter_to_index(letter):
        if letter == "AA":
            return 0
        else:
            return 26 - (ord(letter) - ord('A'))

    row_letter = ""
    col_number = ""
    for char in coord:
        if char.isalpha():
            row_letter += char
        elif char.isdigit():
            col_number += char

    col_number = int(col_number)

    row_index = letter_to_index(row_letter)
    col_index = col_number

    width_per_box = 100 / 28
    height_per_box = 108 / 26

    return 298305 + (width_per_box * col_index), 3272438 - (height_per_box * row_index)

# Convert indices to grid coordinates
def indices_to_grid_coord(easting, northing):
    def index_to_letter(index):
        if index == 0:
            return "AA"
        else:
            return chr(ord('A') + 26 - index - 1)

    width_per_box = 100 / 28
    height_per_box = 108 / 26

    ref_easting = 298305
    ref_northing = 3272438

    col_index = int((easting - ref_easting) / width_per_box)
    row_index = int((ref_northing - northing) / height_per_box)

    row_letter = index_to_letter(row_index)
    col_number = str(col_index)

    return row_letter + col_number

def get_shortest_path_geojson(start_lat, start_long, end_lat, end_long):
    dijkstra(graph, start_lat, start_long, end_lat, end_long)
    shortest_path = reconstruct_path(start_lat, start_long, end_lat, end_long)
    return convert_to_geojson_feature_collection(shortest_path)

def convert_to_geojson_feature_collection(coordinates):
    smooth_path = smooth_coordinates(coordinates)
    geojson_feature_collection = {
        "type": "FeatureCollection",
        "features": [
            {
                "type": "Feature",
                "geometry": {
                    "type": "LineString",
                    "coordinates": [
                        [longitude, latitude] for latitude, longitude in smooth_path
                    ]
                },
                "properties": {
                    "name": "Rover Path"
                }
            }
        ]
    }
    return json.dumps(geojson_feature_collection)

def smooth_coordinates(coordinates):
    if len(coordinates) < 3:
        return coordinates  # Not enough points to smooth

    latitudes = [coord[0] for coord in coordinates]
    longitudes = [coord[1] for coord in coordinates]

    cs_lat = CubicSpline(range(len(latitudes)), latitudes)
    cs_lon = CubicSpline(range(len(longitudes)), longitudes)

    xs = np.linspace(0, len(latitudes) - 1, len(latitudes) * 10)
    smoothed_lats = cs_lat(xs)
    smoothed_lons = cs_lon(xs)

    return list(zip(smoothed_lats, smoothed_lons))